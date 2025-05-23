import React from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { DashboardSkeleton } from '@/components/ui/Skeleton';

interface WithAuthProps {
  loadingComponent?: React.ComponentType;
  redirectOnError?: boolean;
  showErrorToast?: boolean;
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: WithAuthProps
) {
  const {
    loadingComponent: LoadingComponent = DashboardSkeleton,
    redirectOnError = true,
    showErrorToast = true
  } = options || {};

  const AuthenticatedComponent = (props: P) => {
    const { isAuthenticated, isAuthLoading } = useAuth({
      redirectOnError,
      showErrorToast
    });

    if (isAuthLoading) {
      return <LoadingComponent />;
    }

    if (!isAuthenticated) {
      // The useAuth hook will handle redirection
      return <LoadingComponent />;
    }

    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;

  return AuthenticatedComponent;
}

export default withAuth;
