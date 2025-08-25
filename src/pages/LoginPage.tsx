import { useEffect } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useFormState } from "@/hooks/useFormState";
import { validations } from "@/utils/validations";
import { getAuthErrorMessage } from "@/utils/auth-errors";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/auth/AuthForm";
import { useToast } from "@/components/ui/use-toast";

export const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  
  // Check for registration success
  const isNewRegistration = searchParams.get('registered') === 'true';
  const registeredEmail = searchParams.get('email');
  
  // Show success message after registration
  useEffect(() => {
    if (isNewRegistration && registeredEmail) {
      toast({
        title: "Registration successful!",
        description: `We've sent a confirmation link to ${registeredEmail}. Please check your email to verify your account.`,
      });
      // Clear the URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [isNewRegistration, registeredEmail, toast]);
  
  // Redirect if already logged in
  const redirectTo = searchParams.get('redirectTo') || '/';
  
  const {
    formData,
    errors,
    isLoading,
    handleChange,
    showError,
    showSuccess,
    setIsLoading,
    resetForm,
  } = useFormState(
    {
      email: "",
      password: "",
    },
    {
      email: validations.email,
      password: validations.required('Password'),
    }
  );
  
  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (user) {
    navigate(redirectTo, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) throw error;
      
      showSuccess("Success", "You have been logged in successfully!");
      
      // Reset form after successful login
      resetForm();
      
      // Redirect to the intended page or home
      navigate(redirectTo, { replace: true });
    } catch (error: any) {
      console.error('Login error:', error);
      
      const errorInfo = getAuthErrorMessage(error);
      showError("Login Failed", errorInfo.message);
      
      // If it's an email not confirmed error, suggest checking email
      if (errorInfo.code === 'EMAIL_NOT_CONFIRMED') {
        setTimeout(() => {
          toast({
            title: "Email Verification Required",
            description: errorInfo.action,
            variant: "default",
          });
        }, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-6 -ml-2 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-gray-400">Sign in to your account</p>
          </div>
          
          <AuthForm
            mode="signin"
            formData={formData}
            errors={errors}
            isLoading={isLoading}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
    );
};

export default LoginPage;
