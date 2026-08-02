import api from './api';

/**
 * Fetch revenue summary and comparison
 */
export const getRevenueReport = async (filters = {}) => {
    const response = await api.get('/reports/revenue', { params: filters });
    return response.data;
};

/**
 * Fetch paginated sales report
 */
export const getSalesReport = async (filters = {}, page = 1, perPage = 15) => {
    const response = await api.get('/reports/sales', { 
        params: { ...filters, page, per_page: perPage } 
    });
    return response.data;
};

/**
 * Fetch top products report
 */
export const getTopProductsReport = async (filters = {}) => {
    const response = await api.get('/reports/top-products', { params: filters });
    return response.data;
};

/**
 * Fetch monthly trend report
 */
export const getMonthlyTrendReport = async () => {
    const response = await api.get('/reports/monthly-trend');
    return response.data;
};

/**
 * Fetch daily report
 */
export const getDailyReport = async (filters = {}) => {
    const response = await api.get('/reports/daily', { params: filters });
    return response.data;
};

/**
 * Helper to download blob files or handle 202 Async Queue responses
 */
const handleExportResponse = async (response, defaultFilename) => {
    // If it's 202 Accepted, it's queued in the background
    if (response.status === 202) {
        let msg = 'Export queued for processing in the background.';
        try {
            // response.data is a Blob because of responseType: 'blob'
            const text = await response.data.text();
            const json = JSON.parse(text);
            msg = json.message || msg;
        } catch (e) {
            console.error('Failed to parse 202 response blob', e);
        }
        alert(msg);
        return true;
    }

    // Otherwise it's a synchronous blob download
    const disposition = response.headers['content-disposition'];
    let filename = defaultFilename;
    
    if (disposition && disposition.indexOf('filename=') !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) { 
            filename = matches[1].replace(/['"]/g, '');
        }
    }

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return true;
};

/**
 * Export PDF
 */
export const exportPdf = async (reportType, filters = {}) => {
    const response = await api.get('/reports/export/pdf', {
        params: { report_type: reportType, ...filters },
        responseType: 'blob', // Important for file download
    });
    return handleExportResponse(response, `bizflow-${reportType}-report.pdf`);
};

/**
 * Export Excel
 */
export const exportExcel = async (reportType, filters = {}) => {
    const response = await api.get('/reports/export/excel', {
        params: { report_type: reportType, ...filters },
        responseType: 'blob',
    });
    return handleExportResponse(response, `bizflow-${reportType}-report.xlsx`);
};
