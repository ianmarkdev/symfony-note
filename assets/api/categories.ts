import client from './client';
import { Category, CreateCategoryData, UpdateCategoryData } from '../types/category';

interface CategoriesResponse {
    categories: Category[];
}

interface CategoryResponse {
    category: Category;
}

export const getCategories = async (): Promise<Category[]> => {
    const response = await client.get<CategoriesResponse>('/categories');
    return response.data.categories;
};

export const createCategory = async (data: CreateCategoryData): Promise<Category> => {
    const response = await client.post<CategoryResponse>('/categories', data);
    return response.data.category;
};

export const updateCategory = async (id: number, data: UpdateCategoryData): Promise<Category> => {
    const response = await client.put<CategoryResponse>(`/categories/${id}`, data);
    return response.data.category;
};

export const deleteCategory = async (id: number): Promise<void> => {
    await client.delete(`/categories/${id}`);
};
