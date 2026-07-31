import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, FolderOpen } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { categoryService } from '../../services/categoryService';
import { CategoryForm } from '../../components/categories/CategoryForm';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    // Delete state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    const fetchCategories = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await categoryService.getCategories();
            setCategories(res.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load categories');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleAddClick = () => {
        setEditingCategory(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (category) => {
        setEditingCategory(category);
        setIsFormOpen(true);
    };

    const handleFormSuccess = () => {
        setIsFormOpen(false);
        fetchCategories();
    };

    const handleDeleteClick = (category) => {
        setDeleteError(null);
        setCategoryToDelete(category);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!categoryToDelete) return;
        setIsDeleting(true);
        setDeleteError(null);
        
        try {
            await categoryService.deleteCategory(categoryToDelete.id);
            setIsDeleteModalOpen(false);
            setCategoryToDelete(null);
            fetchCategories();
        } catch (err) {
            if (err.response && (err.response.status === 409 || err.response.status === 422)) {
                setDeleteError(err.response.data.message || 'This category cannot be deleted because it still contains products.');
            } else {
                setDeleteError(err.response?.data?.message || 'Failed to delete category.');
            }
            // Do not close the modal automatically if deletion fails
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeleteError(null);
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Categories" 
                subtitle="Manage all product categories."
            />

            {error && (
                <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg" role="alert">
                    <span className="font-medium">Error:</span> {error}
                </div>
            )}

            <Card>
                <CardContent noPadding>
                    {/* Action Bar */}
                    <div className="flex flex-col sm:flex-row justify-end items-center p-5 border-b border-gray-100 gap-4">
                        <div className="flex w-full sm:w-auto">
                            <Button variant="primary" icon={Plus} className="w-full sm:w-auto" onClick={handleAddClick}>
                                Add Category
                            </Button>
                        </div>
                    </div>
                    
                    {isLoading ? (
                        <div className="p-12">
                            <LoadingSpinner text="Loading categories..." />
                        </div>
                    ) : categories.length === 0 ? (
                        <EmptyState 
                            icon={FolderOpen}
                            title="No categories found"
                            description="Get started by creating your first product category."
                            action={
                                <Button variant="primary" icon={Plus} onClick={handleAddClick}>
                                    Add Category
                                </Button>
                            }
                        />
                    ) : (
                        <Table>
                            <TableHeader>
                                <tr>
                                    <TableHead>Category Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-center">Product Count</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </tr>
                            </TableHeader>
                            <tbody>
                                {categories.map((cat) => (
                                    <TableRow key={cat.id}>
                                        <TableCell className="font-medium text-gray-900">{cat.name}</TableCell>
                                        <TableCell className="text-gray-500 max-w-xs truncate">{cat.description || '-'}</TableCell>
                                        <TableCell className="text-center">
                                            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                {cat.product_count || 0}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="ghost" size="sm" className="p-1.5" title="Edit" onClick={() => handleEditClick(cat)}>
                                                <Pencil size={18} />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50" title="Delete" onClick={() => handleDeleteClick(cat)}>
                                                <Trash2 size={18} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Form Modal */}
            <Modal 
                isOpen={isFormOpen} 
                onClose={() => setIsFormOpen(false)}
                title={editingCategory ? "Edit Category" : "Add New Category"}
            >
                <CategoryForm 
                    category={editingCategory} 
                    onSuccess={handleFormSuccess} 
                    onCancel={() => setIsFormOpen(false)} 
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <ConfirmDialog 
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                title="Delete Category"
                description={
                    deleteError ? (
                        <span className="text-red-600 font-medium">{deleteError}</span>
                    ) : (
                        "Are you sure you want to delete this category? Deleting cannot be undone."
                    )
                }
                confirmText="Delete"
                cancelText="Cancel"
                isDestructive={true}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default CategoriesPage;
