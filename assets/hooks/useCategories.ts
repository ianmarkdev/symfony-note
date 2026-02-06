import { useState, useEffect, useCallback } from 'react';
import { Category, CreateCategoryData, UpdateCategoryData } from '../types/category';
import * as categoriesApi from '../api/categories';

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await categoriesApi.getCategories();
            setCategories(data);
            setError(null);
        } catch (err) {
            setError('Failed to load categories');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const createCategory = async (data: CreateCategoryData): Promise<Category> => {
        const newCategory = await categoriesApi.createCategory(data);
        setCategories((prev) => [...prev, newCategory].sort((a, b) => a.name.localeCompare(b.name)));
        return newCategory;
    };

    const updateCategory = async (id: number, data: UpdateCategoryData): Promise<Category> => {
        const updated = await categoriesApi.updateCategory(id, data);
        setCategories((prev) =>
            prev.map((c) => (c.id === id ? updated : c)).sort((a, b) => a.name.localeCompare(b.name))
        );
        return updated;
    };

    const deleteCategory = async (id: number): Promise<void> => {
        await categoriesApi.deleteCategory(id);
        setCategories((prev) => prev.filter((c) => c.id !== id));
    };

    return { categories, isLoading, error, createCategory, updateCategory, deleteCategory, refetch: fetchCategories };
};
