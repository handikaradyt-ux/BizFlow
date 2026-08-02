import { useEffect, useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { customerService } from '../../services/customerService';

export const REPORT_TYPES = [
    { value: 'revenue', label: 'Revenue Report' },
    { value: 'sales', label: 'Sales Report' },
    { value: 'top-products', label: 'Top Products' },
    { value: 'monthly-trend', label: 'Monthly Trend' },
    { value: 'daily', label: 'Daily Report' },
];

const STATUS_OPTIONS = [
    { value: '', label: 'All Statuses' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' },
];

const LIMIT_OPTIONS = [
    { value: '10', label: 'Top 10' },
    { value: '25', label: 'Top 25' },
    { value: '50', label: 'Top 50' },
    { value: '100', label: 'Top 100' },
];

export const ReportFilterBar = ({ 
    reportType, 
    setReportType, 
    filters, 
    setFilters 
}) => {
    const [customers, setCustomers] = useState([]);
    const [dateError, setDateError] = useState('');

    useEffect(() => {
        // Fetch customers for the customer filter
        if (reportType === 'sales') {
            customerService.getCustomers().then(data => {
                if (data && data.data) {
                    const custOptions = data.data.map(c => ({
                        value: c.id.toString(),
                        label: c.name
                    }));
                    setCustomers([{ value: '', label: 'All Customers' }, ...custOptions]);
                }
            }).catch(err => console.error("Failed to load customers for filters", err));
        }
    }, [reportType]);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        
        // Validate dates
        if (key === 'start_date' || key === 'end_date') {
            const start = key === 'start_date' ? value : filters.start_date;
            const end = key === 'end_date' ? value : filters.end_date;
            
            if (start && end && new Date(end) < new Date(start)) {
                setDateError('End date cannot be earlier than start date');
                return; // don't update if invalid
            } else {
                setDateError('');
            }
        }
        
        setFilters(newFilters);
    };

    return (
        <Card className="mb-6">
            <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {/* Report Type (Always visible) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                        <Select
                            options={REPORT_TYPES}
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                        />
                    </div>

                    {/* Date Filters (Hidden for Monthly Trend) */}
                    {reportType !== 'monthly-trend' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <Input
                                    type="date"
                                    value={filters.start_date || ''}
                                    onChange={(e) => handleFilterChange('start_date', e.target.value)}
                                    error={dateError ? true : undefined}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <Input
                                    type="date"
                                    value={filters.end_date || ''}
                                    onChange={(e) => handleFilterChange('end_date', e.target.value)}
                                    error={dateError}
                                />
                            </div>
                        </>
                    )}

                    {/* Status Filter (Sales Only) */}
                    {reportType === 'sales' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <Select
                                options={STATUS_OPTIONS}
                                value={filters.status || ''}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                            />
                        </div>
                    )}

                    {/* Customer Filter (Sales Only) */}
                    {reportType === 'sales' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                            <Select
                                options={customers.length ? customers : [{ value: '', label: 'Loading...' }]}
                                value={filters.customer_id || ''}
                                onChange={(e) => handleFilterChange('customer_id', e.target.value)}
                            />
                        </div>
                    )}

                    {/* Limit Filter (Top Products Only) */}
                    {reportType === 'top-products' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Show</label>
                            <Select
                                options={LIMIT_OPTIONS}
                                value={filters.limit || '10'}
                                onChange={(e) => handleFilterChange('limit', e.target.value)}
                            />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
