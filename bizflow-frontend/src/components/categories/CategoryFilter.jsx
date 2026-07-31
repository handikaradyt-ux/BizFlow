import { useState, useEffect } from 'react';
import { Select } from '../ui/Select';
import { categoryService } from '../../services/categoryService';

export const CategoryFilter = ({ value, onChange, className = '' }) => {
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
        <Select className={className} value={value} onChange={onChange}>
            <option value="">All Categories</option>
            {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
        </Select>
    );
};
