import { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';

// Subcomponents
import { ReportFilterBar } from '../../components/reports/ReportFilterBar';
import { RevenueReportView } from '../../components/reports/views/RevenueReportView';
import { SalesReportView } from '../../components/reports/views/SalesReportView';
import { TopProductsView } from '../../components/reports/views/TopProductsView';
import { MonthlyTrendView } from '../../components/reports/views/MonthlyTrendView';
import { DailyReportView } from '../../components/reports/views/DailyReportView';

// Services
import { 
    getRevenueReport, getSalesReport, getTopProductsReport, 
    getMonthlyTrendReport, getDailyReport, exportPdf, exportExcel 
} from '../../services/reportService';

const ReportsPage = () => {
    const [reportType, setReportType] = useState('revenue');
    const [filters, setFilters] = useState({});
    const [page, setPage] = useState(1);
    
    // Data states
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isExporting, setIsExporting] = useState(false);

    // Fetch Data
    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                let result = null;
                switch (reportType) {
                    case 'revenue':
                        result = await getRevenueReport(filters);
                        break;
                    case 'sales':
                        result = await getSalesReport(filters, page, 15);
                        break;
                    case 'top-products':
                        result = await getTopProductsReport(filters);
                        break;
                    case 'monthly-trend':
                        result = await getMonthlyTrendReport();
                        break;
                    case 'daily':
                        result = await getDailyReport(filters);
                        break;
                    default:
                        break;
                }
                
                if (isMounted) {
                    setData(reportType === 'sales' ? result : result?.data);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err);
                    console.error('Failed to load report data', err);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchData();

        return () => { isMounted = false; };
    }, [reportType, filters, page]);

    // Reset pagination when filters change (only relevant for sales)
    useEffect(() => {
        setPage(1);
    }, [filters, reportType]);

    // Export Handlers
    const handleExport = async (format) => {
        setIsExporting(true);
        try {
            if (format === 'pdf') {
                await exportPdf(reportType, filters);
            } else {
                await exportExcel(reportType, filters);
            }
        } catch (err) {
            console.error(`Failed to export ${format.toUpperCase()}`, err);
            alert(`Failed to export ${format.toUpperCase()}`);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Reports" 
                subtitle="Analytics and business performance metrics."
                action={
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            icon={FileText} 
                            onClick={() => handleExport('pdf')}
                            disabled={isExporting || isLoading || error}
                        >
                            PDF
                        </Button>
                        <Button 
                            variant="primary" 
                            icon={FileSpreadsheet} 
                            onClick={() => handleExport('excel')}
                            disabled={isExporting || isLoading || error}
                        >
                            {isExporting ? 'Exporting...' : 'Excel'}
                        </Button>
                    </div>
                }
            />

            <ReportFilterBar 
                reportType={reportType}
                setReportType={setReportType}
                filters={filters}
                setFilters={setFilters}
            />

            {/* Dynamic View Rendering */}
            {reportType === 'revenue' && (
                <RevenueReportView data={data} isLoading={isLoading} error={error} />
            )}
            
            {reportType === 'sales' && (
                <SalesReportView data={data} isLoading={isLoading} error={error} page={page} setPage={setPage} />
            )}
            
            {reportType === 'top-products' && (
                <TopProductsView data={data} isLoading={isLoading} error={error} />
            )}
            
            {reportType === 'monthly-trend' && (
                <MonthlyTrendView data={data} isLoading={isLoading} error={error} />
            )}
            
            {reportType === 'daily' && (
                <DailyReportView data={data} isLoading={isLoading} error={error} />
            )}
        </div>
    );
};

export default ReportsPage;
