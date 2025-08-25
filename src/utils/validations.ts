export const validations = {
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address',
    },
  },
  password: {
    required: 'Password is required',
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters',
    },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    },
  },
  confirmPassword: {
    required: 'Please confirm your password',
    validate: (value: string, formData: Record<string, any>): string => {
      if (!formData.password) return 'Please enter your password first';
      return value === formData.password ? '' : 'Passwords do not match';
    },
  },
  fullName: {
    required: 'Full name is required',
    minLength: {
      value: 2,
      message: 'Full name must be at least 2 characters',
    },
    pattern: {
      value: /^[a-zA-Z\s]+$/,
      message: 'Full name can only contain letters and spaces',
    },
  },
  required: (field: string) => ({
    required: `${field} is required`,
  }),
  minLength: (length: number, field: string) => ({
    minLength: {
      value: length,
      message: `${field} must be at least ${length} characters`,
    },
  }),
};
