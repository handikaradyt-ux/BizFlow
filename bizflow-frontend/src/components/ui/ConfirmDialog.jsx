import { Modal } from './Modal';
import { Button } from './Button';

export const ConfirmDialog = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = 'Confirm Action', 
    description = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDestructive = false,
    isLoading = false
}) => {
    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={title}
            className="max-w-md"
            footer={
                <>
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        {cancelText}
                    </Button>
                    <Button 
                        variant={isDestructive ? 'danger' : 'primary'} 
                        onClick={onConfirm}
                        isLoading={isLoading}
                    >
                        {confirmText}
                    </Button>
                </>
            }
        >
            <p className="text-gray-600 text-sm">
                {description}
            </p>
        </Modal>
    );
};
