import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../../components/ui/Card';
import { Table, TableHeader, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';

const DUMMY_CATEGORIES = [
    { id: 1, name: 'Electronics', description: 'Gadgets, devices, and accessories', totalProducts: 45, status: 'Active' },
    { id: 2, name: 'Furniture', description: 'Office and home furniture', totalProducts: 12, status: 'Active' },
    { id: 3, name: 'Audio', description: 'Headphones and speakers', totalProducts: 8, status: 'Active' },
    { id: 4, name: 'Accessories', description: 'Cables, adapters, cases', totalProducts: 120, status: 'Active' },
    { id: 5, name: 'Software', description: 'Digital licenses', totalProducts: 0, status: 'Inactive' },
];

const CategoriesPage = () => {
    return (
        <div className="space-y-6">
            <PageHeader 
                title="Categories" 
                subtitle="Manage all product categories."
            />
            
            <Card>
                <CardContent noPadding>
                    <div className="flex flex-col sm:flex-row justify-between items-center p-5 border-b border-gray-100 gap-4">
                        <div className="relative w-full sm:w-80">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search size={18} className="text-gray-400" />
                            </div>
                            <Input 
                                placeholder="Search categories..." 
                                className="pl-10" 
                            />
                        </div>
                        <div className="flex w-full sm:w-auto">
                            <Button variant="primary" icon={Plus} className="w-full sm:w-auto">
                                Add Category
                            </Button>
                        </div>
                    </div>
                    
                    <Table>
                        <TableHeader>
                            <tr>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Total Products</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </tr>
                        </TableHeader>
                        <tbody>
                            {DUMMY_CATEGORIES.map(cat => (
                                <TableRow key={cat.id}>
                                    <TableCell className="font-medium text-gray-900">{cat.name}</TableCell>
                                    <TableCell className="text-gray-500">{cat.description}</TableCell>
                                    <TableCell>{cat.totalProducts}</TableCell>
                                    <TableCell>
                                        <Badge variant={cat.status === 'Active' ? 'success' : 'danger'}>
                                            {cat.status}
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

export default CategoriesPage;
