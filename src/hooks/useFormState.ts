import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

type ValidationRules = {
  [key: string]: {
    required?: string;
    pattern?: {
      value: RegExp;
      message: string;
    };
    validate?: (value: string, formData?: Record<string, any>) => string | undefined;
    minLength?: {
      value: number;
      message: string;
    };
  };
};

export const useFormState = <T extends Record<string, any>>(
  initialData: T,
  validationRules?: ValidationRules
) => {
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const validateField = useCallback(
    (name: string, value: string, allFormData?: T) => {
      if (!validationRules || !validationRules[name]) return '';

      const rules = validationRules[name];
      const currentFormData = allFormData || formData;
      
      if (rules.required && !value.trim()) {
        return rules.required;
      }

      if (rules.pattern && !rules.pattern.value.test(value)) {
        return rules.pattern.message;
      }

      if (rules.minLength && value.length < rules.minLength.value) {
        return rules.minLength.message;
      }

      if (rules.validate) {
        return rules.validate(value, currentFormData);
      }

      return '';
    },
    [formData, validationRules]
  );

  const validateForm = useCallback((): boolean => {
    if (!validationRules) return true;

    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(validationRules).forEach((fieldName) => {
      const error = validateField(fieldName, formData[fieldName] || '', formData);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData, validateField, validationRules]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Mark field as touched
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const handleBlur = useCallback(
    (name: string) => {
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      // Validate field on blur
      if (validationRules && validationRules[name]) {
        const error = validateField(name, formData[name] || '', formData);
        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }
    },
    [formData, validateField, validationRules]
  );

  const showError = useCallback(
    (title: string, message: string) => {
      toast({
        title,
        description: message,
        variant: 'destructive',
      });
    },
    [toast]
  );

  const showSuccess = useCallback(
    (title: string, message: string) => {
      toast({
        title,
        description: message,
        variant: 'default',
      });
    },
    [toast]
  );

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setTouched({});
  }, [initialData]);

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    isLoading,
    setIsLoading,
    touched,
    setTouched,
    handleChange,
    handleBlur,
    validateForm,
    showError,
    showSuccess,
    resetForm,
    setFieldError,
    clearFieldError,
  };
};
