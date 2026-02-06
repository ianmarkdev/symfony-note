import client from './client';
import { User, LoginCredentials, RegisterData } from '../types/user';

interface AuthResponse {
    user: User;
}

interface MessageResponse {
    message: string;
}

export const register = async (data: RegisterData): Promise<MessageResponse> => {
    const response = await client.post<MessageResponse>('/auth/register', data);
    return response.data;
};

export const login = async (credentials: LoginCredentials): Promise<User> => {
    const response = await client.post<AuthResponse>('/auth/login', credentials);
    return response.data.user;
};

export const logout = async (): Promise<void> => {
    await client.post('/auth/logout');
};

export const getCurrentUser = async (): Promise<User> => {
    const response = await client.get<AuthResponse>('/auth/me');
    return response.data.user;
};

export const confirmEmail = async (token: string): Promise<MessageResponse> => {
    const response = await client.get<MessageResponse>(`/auth/confirm/${token}`);
    return response.data;
};
