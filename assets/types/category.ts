export interface Category {
    id: number;
    name: string;
    color: string | null;
}

export interface CreateCategoryData {
    name: string;
    color?: string;
}

export interface UpdateCategoryData {
    name?: string;
    color?: string | null;
}
