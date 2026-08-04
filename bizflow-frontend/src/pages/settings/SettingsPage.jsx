import { useState, useEffect } from 'react';
import { Save, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { FormField } from '../../components/ui/FormField';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { getSettings, updateSettings } from '../../services/settingService';

// ---------- option lists ----------
const CURRENCY_OPTIONS = [
    { value: 'IDR', label: 'IDR - Indonesian Rupiah' },
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'SGD', label: 'SGD - Singapore Dollar' },
    { value: 'MYR', label: 'MYR - Malaysian Ringgit' },
];

const CURRENCY_POSITION_OPTIONS = [
    { value: 'prefix', label: 'Prefix (e.g. Rp 10.000)' },
    { value: 'suffix', label: 'Suffix (e.g. 10.000 Rp)' },
];

const THEME_OPTIONS = [
    { value: 'light', label: 'Light' },
    { value: 'dark',  label: 'Dark' },
    { value: 'system', label: 'System' },
];

const DECIMAL_OPTIONS = [
    { value: '0', label: '0 (e.g. 10.000)' },
    { value: '1', label: '1 (e.g. 10.000,0)' },
    { value: '2', label: '2 (e.g. 10.000,00)' },
];

const SEPARATOR_OPTIONS = [
    { value: '.', label: 'Dot (.)' },
    { value: ',', label: 'Comma (,)' },
    { value: ' ', label: 'Space ( )' },
];

const TIMEZONE_OPTIONS = [
    { value: 'Asia/Jakarta',     label: 'Asia/Jakarta (WIB UTC+7)' },
    { value: 'Asia/Makassar',    label: 'Asia/Makassar (WITA UTC+8)' },
    { value: 'Asia/Jayapura',    label: 'Asia/Jayapura (WIT UTC+9)' },
    { value: 'Asia/Singapore',   label: 'Asia/Singapore (SGT UTC+8)' },
    { value: 'Asia/Kuala_Lumpur',label: 'Asia/Kuala_Lumpur (MYT UTC+8)' },
    { value: 'UTC',              label: 'UTC' },
];

const DATE_FORMAT_OPTIONS = [
    { value: 'd/m/Y', label: 'd/m/Y (31/12/2026)' },
    { value: 'm/d/Y', label: 'm/d/Y (12/31/2026)' },
    { value: 'Y-m-d', label: 'Y-m-d (2026-12-31)' },
    { value: 'd-m-Y', label: 'd-m-Y (31-12-2026)' },
    { value: 'd M Y', label: 'd M Y (31 Dec 2026)' },
];
// ----------------------------------

const SettingsPage = () => {
    const [form, setForm]           = useState(null);      // null = not loaded yet
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving]   = useState(false);
    const [errors, setErrors]       = useState({});
    const [saved, setSaved]         = useState(false);

    // Fetch on mount
    useEffect(() => {
        setIsLoading(true);
        getSettings()
            .then(res => setForm(res.data))
            .catch(err => console.error('Failed to load settings', err))
            .finally(() => setIsLoading(false));
    }, []);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        // Clear the error for that field as the user types
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setErrors({});
        setSaved(false);

        try {
            const res = await updateSettings(form);
            setForm(res.data);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            if (err.response?.status === 422) {
                // Map Laravel validation errors (field -> first message)
                const raw = err.response.data.errors || {};
                const mapped = {};
                Object.keys(raw).forEach(key => {
                    mapped[key] = Array.isArray(raw[key]) ? raw[key][0] : raw[key];
                });
                setErrors(mapped);
            } else {
                alert('Failed to save settings. Please try again.');
            }
        } finally {
            setIsSaving(false);
        }
    };

    // ---- Loading skeleton ----
    if (isLoading) {
        return (
            <div className="space-y-6">
                <PageHeader title="Settings" subtitle="Configure your business preferences and application settings." />
                <div className="flex justify-center items-center h-64">
                    <LoadingSpinner size="lg" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Settings" 
                subtitle="Configure your business preferences and application settings."
            />

            {/* Success banner */}
            {saved && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg px-4 py-3 text-sm font-medium">
                    <CheckCircle size={16} />
                    Settings saved successfully.
                </div>
            )}

            <form onSubmit={handleSave}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* ---- Left Column ---- */}
                    <div className="space-y-6">
                        {/* Store Information */}
                        <Card>
                            <CardHeader title="Store Information" />
                            <CardContent>
                                <div className="space-y-5">
                                    <FormField label="Business Name" required error={errors.business_name}>
                                        <Input
                                            value={form?.business_name ?? ''}
                                            onChange={e => handleChange('business_name', e.target.value)}
                                            hasError={!!errors.business_name}
                                            placeholder="BizFlow POS"
                                        />
                                    </FormField>
                                    <FormField label="Address" error={errors.business_address}>
                                        <Textarea
                                            value={form?.business_address ?? ''}
                                            onChange={e => handleChange('business_address', e.target.value)}
                                            hasError={!!errors.business_address}
                                            placeholder="Your business address"
                                            rows={3}
                                        />
                                    </FormField>
                                    <FormField label="Phone" error={errors.business_phone}>
                                        <Input
                                            value={form?.business_phone ?? ''}
                                            onChange={e => handleChange('business_phone', e.target.value)}
                                            hasError={!!errors.business_phone}
                                            placeholder="08123456789"
                                        />
                                    </FormField>
                                    <FormField label="Email" error={errors.business_email}>
                                        <Input
                                            type="email"
                                            value={form?.business_email ?? ''}
                                            onChange={e => handleChange('business_email', e.target.value)}
                                            hasError={!!errors.business_email}
                                            placeholder="admin@bizflow.test"
                                        />
                                    </FormField>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Invoice Settings */}
                        <Card>
                            <CardHeader title="Invoice Settings" />
                            <CardContent>
                                <div className="space-y-5">
                                    <FormField label="Invoice Prefix" required error={errors.invoice_prefix} helperText="e.g. INV → INV-0001">
                                        <Input
                                            value={form?.invoice_prefix ?? ''}
                                            onChange={e => handleChange('invoice_prefix', e.target.value)}
                                            hasError={!!errors.invoice_prefix}
                                            placeholder="INV"
                                        />
                                    </FormField>
                                    <FormField label="Low Stock Threshold" required error={errors.low_stock_threshold} helperText="Products below this quantity will be flagged as low stock">
                                        <Input
                                            type="number"
                                            min="0"
                                            value={form?.low_stock_threshold ?? ''}
                                            onChange={e => handleChange('low_stock_threshold', e.target.value)}
                                            hasError={!!errors.low_stock_threshold}
                                        />
                                    </FormField>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* ---- Right Column ---- */}
                    <div className="space-y-6">
                        {/* Financial Settings */}
                        <Card>
                            <CardHeader title="Financial Settings" />
                            <CardContent>
                                <div className="space-y-5">
                                    <FormField label="Currency" required error={errors.currency}>
                                        <Select
                                            value={form?.currency ?? ''}
                                            onChange={e => handleChange('currency', e.target.value)}
                                            hasError={!!errors.currency}
                                            options={CURRENCY_OPTIONS}
                                        >
                                            {CURRENCY_OPTIONS.map(o => (
                                                <option key={o.value} value={o.value}>{o.label}</option>
                                            ))}
                                        </Select>
                                    </FormField>
                                    <FormField label="Currency Symbol" required error={errors.currency_symbol}>
                                        <Input
                                            value={form?.currency_symbol ?? ''}
                                            onChange={e => handleChange('currency_symbol', e.target.value)}
                                            hasError={!!errors.currency_symbol}
                                            placeholder="Rp"
                                        />
                                    </FormField>
                                    <FormField label="Currency Position" required error={errors.currency_position}>
                                        <Select
                                            value={form?.currency_position ?? ''}
                                            onChange={e => handleChange('currency_position', e.target.value)}
                                            hasError={!!errors.currency_position}
                                        >
                                            {CURRENCY_POSITION_OPTIONS.map(o => (
                                                <option key={o.value} value={o.value}>{o.label}</option>
                                            ))}
                                        </Select>
                                    </FormField>
                                    <FormField label="Tax Rate (%)" required error={errors.tax_rate}>
                                        <Input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            value={form?.tax_rate ?? ''}
                                            onChange={e => handleChange('tax_rate', e.target.value)}
                                            hasError={!!errors.tax_rate}
                                        />
                                    </FormField>
                                    <FormField label="Decimal Places" required error={errors.decimal_places}>
                                        <Select
                                            value={String(form?.decimal_places ?? '0')}
                                            onChange={e => handleChange('decimal_places', e.target.value)}
                                            hasError={!!errors.decimal_places}
                                        >
                                            {DECIMAL_OPTIONS.map(o => (
                                                <option key={o.value} value={o.value}>{o.label}</option>
                                            ))}
                                        </Select>
                                    </FormField>
                                    <FormField label="Thousand Separator" required error={errors.thousand_separator}>
                                        <Select
                                            value={form?.thousand_separator ?? '.'}
                                            onChange={e => handleChange('thousand_separator', e.target.value)}
                                            hasError={!!errors.thousand_separator}
                                        >
                                            {SEPARATOR_OPTIONS.map(o => (
                                                <option key={o.value} value={o.value}>{o.label}</option>
                                            ))}
                                        </Select>
                                    </FormField>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Regional Settings */}
                        <Card>
                            <CardHeader title="Regional Settings" />
                            <CardContent>
                                <div className="space-y-5">
                                    <FormField label="Timezone" required error={errors.timezone}>
                                        <Select
                                            value={form?.timezone ?? ''}
                                            onChange={e => handleChange('timezone', e.target.value)}
                                            hasError={!!errors.timezone}
                                        >
                                            {TIMEZONE_OPTIONS.map(o => (
                                                <option key={o.value} value={o.value}>{o.label}</option>
                                            ))}
                                        </Select>
                                    </FormField>
                                    <FormField label="Date Format" required error={errors.date_format}>
                                        <Select
                                            value={form?.date_format ?? ''}
                                            onChange={e => handleChange('date_format', e.target.value)}
                                            hasError={!!errors.date_format}
                                        >
                                            {DATE_FORMAT_OPTIONS.map(o => (
                                                <option key={o.value} value={o.value}>{o.label}</option>
                                            ))}
                                        </Select>
                                    </FormField>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Appearance */}
                        <Card>
                            <CardHeader title="Appearance" />
                            <CardContent>
                                <div className="space-y-5">
                                    <FormField label="Theme" required error={errors.theme}>
                                        <Select
                                            value={form?.theme ?? ''}
                                            onChange={e => handleChange('theme', e.target.value)}
                                            hasError={!!errors.theme}
                                        >
                                            {THEME_OPTIONS.map(o => (
                                                <option key={o.value} value={o.value}>{o.label}</option>
                                            ))}
                                        </Select>
                                    </FormField>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Save button — aligned to right, same position as before */}
                        <div className="flex justify-end pt-4">
                            <Button
                                type="submit"
                                variant="primary"
                                icon={Save}
                                disabled={isSaving}
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SettingsPage;
