export interface AuthErrorInfo {
  message: string;
  code?: string;
  action?: string;
}

export const getAuthErrorMessage = (error: any): AuthErrorInfo => {
  const errorMessage = error?.message || error?.error_description || 'An unexpected error occurred';
  
  // Handle common Supabase auth errors
  if (errorMessage.includes('Invalid login credentials')) {
    return {
      message: 'Invalid email or password. Please check your credentials and try again.',
      code: 'INVALID_CREDENTIALS',
      action: 'Please verify your email and password are correct.'
    };
  }
  
  if (errorMessage.includes('Email not confirmed')) {
    return {
      message: 'Please verify your email before logging in.',
      code: 'EMAIL_NOT_CONFIRMED',
      action: 'Check your email for a verification link and click it to confirm your account.'
    };
  }
  
  if (errorMessage.includes('already registered')) {
    return {
      message: 'This email is already registered. Please sign in instead.',
      code: 'EMAIL_EXISTS',
      action: 'Use the sign in form or reset your password if you forgot it.'
    };
  }
  
  if (errorMessage.includes('password')) {
    return {
      message: 'Please choose a stronger password.',
      code: 'WEAK_PASSWORD',
      action: 'Your password must be at least 8 characters and contain uppercase, lowercase, and numbers.'
    };
  }
  
  if (errorMessage.includes('email')) {
    return {
      message: 'Please enter a valid email address.',
      code: 'INVALID_EMAIL',
      action: 'Check that your email address is correctly formatted.'
    };
  }
  
  if (errorMessage.includes('rate limit') || errorMessage.includes('Too many requests')) {
    return {
      message: 'Too many attempts. Please try again later.',
      code: 'RATE_LIMIT',
      action: 'Wait a few minutes before trying again.'
    };
  }
  
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return {
      message: 'Network error. Please check your connection and try again.',
      code: 'NETWORK_ERROR',
      action: 'Check your internet connection and try again.'
    };
  }
  
  if (errorMessage.includes('User already registered')) {
    return {
      message: 'An account with this email already exists.',
      code: 'USER_EXISTS',
      action: 'Please sign in instead or use the forgot password feature.'
    };
  }
  
  if (errorMessage.includes('Signup disabled')) {
    return {
      message: 'Sign up is currently disabled.',
      code: 'SIGNUP_DISABLED',
      action: 'Please contact support for assistance.'
    };
  }
  
  if (errorMessage.includes('Invalid phone number')) {
    return {
      message: 'Please enter a valid phone number.',
      code: 'INVALID_PHONE',
      action: 'Use the format: +1-234-567-8900'
    };
  }
  
  // Default error
  return {
    message: errorMessage,
    code: 'UNKNOWN_ERROR',
    action: 'Please try again or contact support if the problem persists.'
  };
};

export const isRetryableError = (error: any): boolean => {
  const errorMessage = error?.message || '';
  
  // These errors are typically retryable
  const retryableErrors = [
    'network',
    'fetch',
    'timeout',
    'rate limit',
    'Too many requests',
    'service unavailable',
    'internal server error'
  ];
  
  return retryableErrors.some(retryableError => 
    errorMessage.toLowerCase().includes(retryableError.toLowerCase())
  );
};

export const getRetryDelay = (error: any): number => {
  const errorMessage = error?.message || '';
  
  if (errorMessage.includes('rate limit') || errorMessage.includes('Too many requests')) {
    return 60000; // 1 minute
  }
  
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return 5000; // 5 seconds
  }
  
  return 1000; // 1 second default
};
