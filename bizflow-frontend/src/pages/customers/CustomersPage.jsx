import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../../components/ui/Card';
import { Table, TableHeader, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';

const DUMMY_CUSTOMERS = [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', phone: '555-0101', address: '123 Main St', status: 'Active' },
    { id: 2, name: 'Bob Jones', email: 'bob@example.com', phone: '555-0102', address: '456 Elm St', status: 'Active' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', phone: '555-0103', address: '789 Oak St', status: 'Inactive' },
    { id: 4, name: 'Diana Prince', email: 'diana@example.com', phone: '555-0104', address: '321 Pine St', status: 'Active' },
    { id: 5, name: 'Evan Wright', email: 'evan@example.com', phone: '555-0105', address: '654 Cedar St', status: 'Active' },
];

const CustomersPage = () => {
    return (
        <div className="space-y-6">
            <PageHeader 
                title="Customers" 
                subtitle="Manage your customer database."
            />
            
            <Card>
                <CardContent noPadding>
                    <div className="flex flex-col sm:flex-row justify-between items-center p-5 border-b border-gray-100 gap-4">
                        <div className="relative w-full sm:w-80">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search size={18} className="text-gray-400" />
                            </div>
                            <Input 
                                placeholder="Search customers..." 
                                className="pl-10" 
                            />
                        </div>
                        <div className="flex w-full sm:w-auto">
                            <Button variant="primary" icon={Plus} className="w-full sm:w-auto">
                                Add Customer
                            </Button>
                        </div>
                    </div>
                    
                    <Table>
                        <TableHeader>
                            <tr>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </tr>
                        </TableHeader>
                        <tbody>
                            {DUMMY_CUSTOMERS.map(cust => (
                                <TableRow key={cust.id}>
                                    <TableCell className="font-medium text-gray-900">{cust.name}</TableCell>
                                    <TableCell className="text-gray-500">{cust.email}</TableCell>
                                    <TableCell className="text-gray-500">{cust.phone}</TableCell>
                                    <TableCell className="text-gray-500 truncate max-w-[150px]">{cust.address}</TableCell>
                                    <TableCell>
                                        <Badge variant={cust.status === 'Active' ? 'success' : 'danger'}>
                                            {cust.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="sm" className="p-1.5" title="Edit">
                                            <Pencil size={18} />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50" title="Delete">
                                            <Trash2 size={18} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </tbody>
                    </Table>
                </CardContent>
                
                <CardFooter className="justify-between flex-col sm:flex-row">
                    <span className="text-sm text-gray-500 mb-4 sm:mb-0">
                        Showing <span className="font-medium text-gray-900">1</span> to <span className="font-medium text-gray-900">5</span> of <span className="font-medium text-gray-900">5</span> entries
                    </span>
                    <div className="inline-flex rounded-md shadow-sm">
                        <button className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 transition-colors">Previous</button>
                        <button className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 border border-blue-600 hover:bg-blue-700 transition-colors z-10">1</button>
                        <button className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md border-l-0 hover:bg-gray-50 transition-colors">Next</button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default CustomersPage;
