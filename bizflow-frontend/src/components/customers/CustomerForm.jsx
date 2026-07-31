import { useForm } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { FormField } from '../ui/FormField';
import { Button } from '../ui/Button';
import { customerService } from '../../services/customerService';

export const CustomerForm = ({ customer, onSuccess, onCancel }) => {
    const isEdit = !!customer;
    
    const { register, handleSubmit, setError, setFocus, formState: { errors, isSubmitting } } = useForm({
        mode: 'onChange',
        defaultValues: {
            name: customer?.name || '',
            phone: customer?.phone || '',
            email: customer?.email || '',
            address: customer?.address || '',
        }
    });

    const onSubmit = async (data) => {
        try {
            if (isEdit) {
                await customerService.updateCustomer(customer.id, data);
            } else {
                await customerService.createCustomer(data);
            }
            onSuccess();
        } catch (error) {
            console.error("Failed to save customer", error);
            
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
                    <FormField label="Customer Name" error={errors.name?.message}>
                        <Input 
                            {...register('name', { required: 'Name is required', maxLength: { value: 150, message: 'Max 150 characters' } })} 
                            hasError={!!errors.name} 
                        />
                    </FormField>
                    
                    <FormField label="Phone" error={errors.phone?.message}>
                        <Input 
                            {...register('phone', { required: 'Phone is required', maxLength: { value: 20, message: 'Max 20 characters' } })} 
                            hasError={!!errors.phone} 
                        />
                    </FormField>
                </div>
                
                <div className="space-y-4">
                    <FormField label="Email" error={errors.email?.message}>
                        <Input 
                            type="email"
                            {...register('email')} 
                            hasError={!!errors.email} 
                        />
                    </FormField>

                    <FormField label="Address" error={errors.address?.message}>
                        <Textarea 
                            {...register('address')} 
                            rows={3} 
                            hasError={!!errors.address} 
                        />
                    </FormField>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : (isEdit ? 'Update Customer' : 'Create Customer')}
                </Button>
            </div>
        </form>
    );
};
