import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGetProfileQuery } from '../api/tasks/taskSlice';
import { toast } from 'react-toastify';

export const useAuth = (options?: { 
  redirectOnError?: boolean;
  showErrorToast?: boolean;
}) => {
  const router = useRouter();
  const { 
    redirectOnError = true, 
    showErrorToast = true 
  } = options || {};

  const {
    data: user,
    error,
    isLoading,
    isSuccess,
    isError
  } = useGetProfileQuery(undefined);

  const isAuthenticated = isSuccess && !!user;
  const isAuthLoading = isLoading;

  useEffect(() => {
    if (isError && error && 'status' in error) {
      const status = error.status;
      
      if (status === 401 || status === 403) {
        if (showErrorToast) {
          toast.error("Your session has expired. Please log in again.");
        }
        
        if (redirectOnError) {
          router.push("/login");
        }
      } else if (showErrorToast) {
        toast.error("An error occurred while loading your profile.");
      }
    }
  }, [isError, error, router, redirectOnError, showErrorToast]);

  return {
    user,
    isAuthenticated,
    isAuthLoading,
    isError,
    error,
    isSuccess
  };
};

export default useAuth;
