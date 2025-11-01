import { authAPI } from './api';
import { LoginCredentials, AuthResponse } from '../types';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  return await authAPI.login(credentials.username, credentials.password);
};

export const logout = (): void => {
  authAPI.logout();
};

export const getAuthHeaders = () => {
  return authAPI.getAuthHeaders();
};
