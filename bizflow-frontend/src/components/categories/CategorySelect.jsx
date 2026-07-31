import { useState, useEffect, forwardRef } from 'react';
import { Select } from '../ui/Select';
import { categoryService } from '../../services/categoryService';

export const CategorySelect = forwardRef(({ hasError, ...props }, ref) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await categoryService.getCategories();
                setCategories(res.data || []);
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        };
        fetchCategories();
    }, []);

    return (
        <Select ref={ref} hasError={hasError} {...props}>
            <option value="">Select Category</option>
            {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
        </Select>
    );
});

CategorySelect.displayName = 'CategorySelect';
