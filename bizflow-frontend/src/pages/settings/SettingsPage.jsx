import { Save } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { FormField } from '../../components/ui/FormField';

const SettingsPage = () => {
    return (
        <div className="space-y-6">
            <PageHeader 
                title="Settings" 
                subtitle="Configure your business preferences and application settings."
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader title="Store Information" />
                        <CardContent>
                            <form className="space-y-5">
                                <FormField label="Business Name">
                                    <Input disabled value="BizFlow Tech" />
                                </FormField>
                                <FormField label="Address">
                                    <Textarea disabled value="123 Commerce St, Business District&#10;Jakarta, Indonesia 10220" />
                                </FormField>
                                <FormField label="Phone">
                                    <Input disabled value="+62 811 2345 6789" />
                                </FormField>
                            </form>
                        </CardContent>
                    </Card>
                </div>
                
                {/* Right Column */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader title="Financial Settings" />
                        <CardContent>
                            <form className="space-y-5">
                                <FormField label="Currency">
                                    <Select disabled>
                                        <option>IDR - Indonesian Rupiah</option>
                                        <option>USD - US Dollar</option>
                                    </Select>
                                </FormField>
                                <FormField label="Tax Rate (%)">
                                    <Input type="number" disabled value="11" />
                                </FormField>
                            </form>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader title="Appearance" />
                        <CardContent>
                            <form className="space-y-5">
                                <FormField label="Theme">
                                    <Select disabled>
                                        <option>Light</option>
                                        <option>Dark</option>
                                        <option>System</option>
                                    </Select>
                                </FormField>
                            </form>
                        </CardContent>
                    </Card>
                    
                    <div className="flex justify-end pt-4">
                        <Button variant="primary" icon={Save} disabled>
                            Save Changes
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
