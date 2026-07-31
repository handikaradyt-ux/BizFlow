import { useForm } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { FormField } from '../ui/FormField';
import { Button } from '../ui/Button';
import { categoryService } from '../../services/categoryService';

export const CategoryForm = ({ category, onSuccess, onCancel }) => {
    const isEdit = !!category;
    
    const { register, handleSubmit, setError, setFocus, formState: { errors, isSubmitting } } = useForm({
        mode: 'onChange',
        defaultValues: {
            name: category?.name || '',
            description: category?.description || '',
        }
    });

    const onSubmit = async (data) => {
        try {
            if (isEdit) {
                await categoryService.updateCategory(category.id, data);
            } else {
                await categoryService.createCategory(data);
            }
            onSuccess();
        } catch (error) {
            console.error("Failed to save category", error);
            
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
            <div className="space-y-4">
                <FormField label="Category Name" error={errors.name?.message}>
                    <Input 
                        {...register('name', { required: 'Name is required', maxLength: { value: 100, message: 'Max 100 characters' } })} 
                        hasError={!!errors.name} 
                    />
                </FormField>
                
                <FormField label="Description" error={errors.description?.message}>
                    <Textarea 
                        {...register('description')} 
                        rows={3} 
                        hasError={!!errors.description} 
                    />
                </FormField>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : (isEdit ? 'Update Category' : 'Create Category')}
                </Button>
            </div>
        </form>
    );
};
