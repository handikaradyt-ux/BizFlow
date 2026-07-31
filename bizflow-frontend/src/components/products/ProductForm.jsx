import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ImagePlus, X } from 'lucide-react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { FormField } from '../ui/FormField';
import { Button } from '../ui/Button';
import { productService } from '../../services/productService';
import api from '../../services/api';

export const ProductForm = ({ product, onSuccess, onCancel }) => {
    const isEdit = !!product;
    const [categories, setCategories] = useState([]);
    const [imagePreview, setImagePreview] = useState(product?.image_url || null);
    
    const { register, handleSubmit, setError, setFocus, formState: { errors, isSubmitting }, setValue, watch } = useForm({
        mode: 'onChange',
        defaultValues: {
            name: product?.name || '',
            sku: product?.sku || '',
            category_id: product?.category_id || '',
            description: product?.description || '',
            selling_price: product?.selling_price || '',
            purchase_price: product?.purchase_price || '',
            stock: product?.stock || 0,
            minimum_stock: product?.minimum_stock || 0,
            status: product?.status || 'active',
            image: null
        }
    });

    const selectedImage = watch('image');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories');
                setCategories(res.data?.data || res.data || []);
            } catch (err) {
                console.error("Failed to fetch categories. Using fallbacks.", err);
                setCategories([
                    { id: 1, name: 'Electronics' },
                    { id: 2, name: 'Furniture' },
                    { id: 3, name: 'Clothing' },
                    { id: 4, name: 'Accessories' }
                ]);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedImage && selectedImage.length > 0) {
            const objectUrl = URL.createObjectURL(selectedImage[0]);
            setImagePreview(objectUrl);
            
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [selectedImage]);

    const handleClearImage = () => {
        setValue('image', null);
        setImagePreview(product?.image_url || null);
    };

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('sku', data.sku);
            formData.append('category_id', data.category_id);
            if (data.description) formData.append('description', data.description);
            formData.append('selling_price', data.selling_price);
            if (data.purchase_price) formData.append('purchase_price', data.purchase_price);
            formData.append('stock', data.stock);
            formData.append('minimum_stock', data.minimum_stock);
            formData.append('status', data.status);
            
            if (data.image && data.image[0]) {
                formData.append('image', data.image[0]);
            }

            if (isEdit) {
                await productService.updateProduct(product.id, formData);
            } else {
                await productService.createProduct(formData);
            }
            onSuccess();
        } catch (error) {
            console.error("Failed to save product", error);
            
            // Handle Laravel 422 Validation Errors
            if (error.response && error.response.status === 422) {
                const backendErrors = error.response.data.errors;
                if (backendErrors) {
                    let firstField = null;
                    
                    Object.keys(backendErrors).forEach((field) => {
                        if (!firstField) firstField = field;
                        
                        setError(field, {
                            type: 'server',
                            message: backendErrors[field][0]
                        });
                    });
                    
                    if (firstField) {
                        setFocus(firstField);
                    }
                }
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <FormField label="Product Name" error={errors.name?.message}>
                        <Input 
                            {...register('name', { required: 'Name is required', maxLength: { value: 150, message: 'Max 150 characters' } })} 
                            hasError={!!errors.name} 
                        />
                    </FormField>
                    
                    <FormField label="SKU" error={errors.sku?.message}>
                        <Input 
                            {...register('sku', { required: 'SKU is required', maxLength: { value: 50, message: 'Max 50 characters' } })} 
                            hasError={!!errors.sku} 
                        />
                    </FormField>

                    <FormField label="Category" error={errors.category_id?.message}>
                        <Select 
                            {...register('category_id', { required: 'Category is required' })}
                            hasError={!!errors.category_id}
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </Select>
                    </FormField>

                    <FormField label="Description">
                        <Textarea 
                            {...register('description')} 
                            rows={3} 
                        />
                    </FormField>
                </div>
                
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Selling Price" error={errors.selling_price?.message}>
                            <Input 
                                type="number" step="0.01" min="0"
                                {...register('selling_price', { required: 'Required', min: { value: 0, message: 'Min 0' } })} 
                                hasError={!!errors.selling_price} 
                            />
                        </FormField>
                        <FormField label="Purchase Price" error={errors.purchase_price?.message}>
                            <Input 
                                type="number" step="0.01" min="0"
                                {...register('purchase_price', { min: { value: 0, message: 'Min 0' } })} 
                                hasError={!!errors.purchase_price} 
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Stock" error={errors.stock?.message}>
                            <Input 
                                type="number" min="0"
                                {...register('stock', { required: 'Required', min: { value: 0, message: 'Min 0' } })} 
                                hasError={!!errors.stock} 
                            />
                        </FormField>
                        <FormField label="Min Stock" error={errors.minimum_stock?.message}>
                            <Input 
                                type="number" min="0"
                                {...register('minimum_stock', { required: 'Required', min: { value: 0, message: 'Min 0' } })} 
                                hasError={!!errors.minimum_stock} 
                            />
                        </FormField>
                    </div>

                    <FormField label="Status" error={errors.status?.message}>
                        <Select {...register('status', { required: 'Required' })} hasError={!!errors.status}>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </Select>
                    </FormField>
                </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
                <FormField label="Product Image" error={errors.image?.message}>
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                        {/* Image Preview Area */}
                        <div className="relative w-32 h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    {selectedImage && selectedImage.length > 0 && (
                                        <button 
                                            type="button" 
                                            onClick={handleClearImage}
                                            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                                            title="Remove image"
                                        >
                                            <X size={14} className="text-gray-600" />
                                        </button>
                                    )}
                                </>
                            ) : (
                                <ImagePlus className="text-gray-400" size={32} />
                            )}
                        </div>
                        
                        <div className="flex-1">
                            <input 
                                type="file" 
                                accept="image/jpeg, image/png, image/webp"
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
                                {...register('image', {
                                    validate: {
                                        lessThan2MB: files => !files || files.length === 0 || files[0].size < 2000000 || 'Max 2MB'
                                    }
                                })}
                            />
                            <p className="mt-2 text-xs text-gray-500">
                                PNG, JPG or WEBP up to 2MB.
                            </p>
                        </div>
                    </div>
                </FormField>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
                </Button>
            </div>
        </form>
    );
};
