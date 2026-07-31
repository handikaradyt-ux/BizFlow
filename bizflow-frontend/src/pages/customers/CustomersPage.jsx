import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Pencil, Trash2, Users, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { EmptyState } from '../../components/ui/EmptyState';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { customerService } from '../../services/customerService';
import { CustomerForm } from '../../components/customers/CustomerForm';

const CustomersPage = () => {
    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Search state
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Modal state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);

    // Delete state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchCustomers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = {};
            if (debouncedSearch) params.search = debouncedSearch;

            const res = await customerService.getCustomers(params);
            setCustomers(res.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load customers');
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const handleAddClick = () => {
        setEditingCustomer(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (customer) => {
        setEditingCustomer(customer);
        setIsFormOpen(true);
    };

    const handleFormSuccess = () => {
        setIsFormOpen(false);
        fetchCustomers();
    };

    const handleDeleteClick = (customer) => {
        setDeleteError(null);
        setCustomerToDelete(customer);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!customerToDelete) return;
        setIsDeleting(true);
        setDeleteError(null);
        
        try {
            await customerService.deleteCustomer(customerToDelete.id);
            setIsDeleteModalOpen(false);
            setCustomerToDelete(null);
            fetchCustomers();
        } catch (err) {
            setDeleteError(err.response?.data?.message || 'Failed to delete customer.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Customers" 
                subtitle="Manage your customer database."
            />

            {error && (
                <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg" role="alert">
                    <span className="font-medium">Error:</span> {error}
                </div>
            )}

            <Card>
                <CardContent noPadding>
                    {/* Action Bar */}
                    <div className="flex flex-col sm:flex-row justify-between items-center p-5 border-b border-gray-100 gap-4">
                        <div className="relative w-full sm:w-80">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search size={18} className="text-gray-400" />
                            </div>
                            <Input 
                                placeholder="Search by name or phone..." 
                                className="pl-10"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex w-full sm:w-auto">
                            <Button variant="primary" icon={Plus} className="w-full sm:w-auto" onClick={handleAddClick}>
                                Add Customer
                            </Button>
                        </div>
                    </div>
                    
                    {isLoading ? (
                        <div className="p-12">
                            <LoadingSpinner text="Loading customers..." />
                        </div>
                    ) : customers.length === 0 ? (
                        <EmptyState 
                            icon={Users}
                            title="No customers found"
                            description={search ? "Try adjusting your search query." : "Get started by adding a new customer."}
                            action={
                                <Button variant="primary" icon={Plus} onClick={handleAddClick}>
                                    Add Customer
                                </Button>
                            }
                        />
                    ) : (
                        <Table>
                            <TableHeader>
                                <tr>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </tr>
                            </TableHeader>
                            <tbody>
                                {customers.map(cust => (
                                    <TableRow key={cust.id}>
                                        <TableCell className="font-medium text-gray-900">{cust.name}</TableCell>
                                        <TableCell className="text-gray-500">{cust.phone}</TableCell>
                                        <TableCell className="text-gray-500">{cust.email || '-'}</TableCell>
                                        <TableCell className="text-gray-500 truncate max-w-[200px]">{cust.address || '-'}</TableCell>
                                        <TableCell className="text-right space-x-2 whitespace-nowrap">
                                            <Link to={`/customers/${cust.id}`}>
                                                <Button variant="ghost" size="sm" className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50" title="View Details">
                                                    <Eye size={18} />
                                                </Button>
                                            </Link>
                                            <Button variant="ghost" size="sm" className="p-1.5" title="Edit" onClick={() => handleEditClick(cust)}>
                                                <Pencil size={18} />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50" title="Delete" onClick={() => handleDeleteClick(cust)}>
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
                title={editingCustomer ? "Edit Customer" : "Add New Customer"}
            >
                <CustomerForm 
                    customer={editingCustomer} 
                    onSuccess={handleFormSuccess} 
                    onCancel={() => setIsFormOpen(false)} 
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <ConfirmDialog 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Customer"
                description={
                    deleteError ? (
                        <span className="text-red-600 font-medium">{deleteError}</span>
                    ) : (
                        "Are you sure you want to delete this customer? Deleting cannot be undone."
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

export default CustomersPage;
