import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/auth';
import type { LoginRequest, RegisterRequest } from '../types/auth';

export const useAuth = () => {
  const navigate = useNavigate();
  const { 
    login: setAuth, 
    logout: clearAuth, 
    user, 
    isAuthenticated, 
    isLoading 
  } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    },
    onError: () => {
      toast.error('Erro ao fazer login. Verifique suas credenciais.');
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success('Conta criada com sucesso!');
      navigate('/dashboard');
    },
    onError: () => {
      toast.error('Erro ao criar conta. Tente novamente.');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return Promise.resolve();
    },
    onSuccess: () => {
      clearAuth();
      navigate('/login');
      toast.success('Logout realizado com sucesso!');
    },
  });

  return {
    user,
    isAuthenticated,
    isLoading,
    login: (credentials: LoginRequest) => loginMutation.mutate(credentials),
    register: (userData: RegisterRequest) => registerMutation.mutate(userData),
    logout: () => logoutMutation.mutate(),
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
  };
};