import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useFormState } from "@/hooks/useFormState";
import { validations } from "@/utils/validations";
import { getAuthErrorMessage } from "@/utils/auth-errors";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft } from "lucide-react";
import { AuthForm } from "@/components/auth/AuthForm";

export const SignupPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const {
    formData,
    setFormData,
    errors,
    isLoading,
    handleChange,
    validateForm,
    showError,
    showSuccess,
    setIsLoading,
    resetForm,
  } = useFormState(
    {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
    },
    {
      email: validations.email,
      password: validations.password,
      confirmPassword: validations.confirmPassword,
      fullName: validations.fullName,
    }
  );
  
  // Redirect if already logged in
  const redirectTo = searchParams.get('redirectTo') || '/';
  
  if (user) {
    navigate(redirectTo, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName.trim(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) throw signUpError;

      showSuccess(
        "Check your email",
        "We've sent you a verification link. Please check your email to complete your registration."
      );

      // Reset form after successful signup
      resetForm();

      // Redirect to login with success state
      navigate(`/login?registered=true&email=${encodeURIComponent(formData.email)}`);
    } catch (error: any) {
      console.error('Signup error:', error);
      
      const errorInfo = getAuthErrorMessage(error);
      showError("Signup Failed", errorInfo.message);
      
      // If it's an email already exists error, suggest going to login
      if (errorInfo.code === 'EMAIL_EXISTS') {
        setTimeout(() => {
          navigate('/login?email=' + encodeURIComponent(formData.email));
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
            <h1 className="text-2xl font-bold text-white mb-2">Create an account</h1>
            <p className="text-gray-400">Join us to get started</p>
          </div>
          
          <AuthForm
            mode="signup"
            formData={formData}
            errors={errors}
            isLoading={isLoading}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
          
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-500 text-center">
              By signing up, you agree to our{' '}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
