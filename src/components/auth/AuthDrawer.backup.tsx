import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { X, ArrowLeft, Mail, CheckCircle, Upload, User, Briefcase, Building2 } from "lucide-react";
import { CountrySelect } from "@/components/ui/country-select";

type AuthMode = 'signin' | 'signup' | 'forgot-password' | 'reset-sent';

interface AuthDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
}

const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePhone = (phone: string): boolean => {
  const re = /^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,3}[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,4}$/;
  return re.test(phone);
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const PASSWORD_MIN_LENGTH = 6;

// File handling functions
const isValidFileType = (file: File): boolean => {
  return ALLOWED_FILE_TYPES.includes(file.type);
};

const isFileSizeValid = (file: File): boolean => {
  return file.size <= MAX_FILE_SIZE;
};

export const AuthDrawer = ({ isOpen, onClose, initialMode = 'signin' }: AuthDrawerProps) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [userType, setUserType] = useState("individual");
  const [countryCode, setCountryCode] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [subscribeToNewsletter, setSubscribeToNewsletter] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const userTypes = [
    { 
      value: 'individual', 
      label: 'Individual',
      icon: <User className="h-4 w-4 mr-2" />
    },
    { 
      value: 'business', 
      label: 'Business',
      icon: <Briefcase className="h-4 w-4 mr-2" />
    },
    { 
      value: 'organization', 
      label: 'Organization',
      icon: <Building2 className="h-4 w-4 mr-2" />
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!isValidFileType(file)) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a JPG, PNG, or WebP image.',
          variant: 'destructive',
        });
        return;
      }
      
      if (!isFileSizeValid(file)) {
        toast({
          title: 'File too large',
          description: 'Maximum file size is 5MB.',
          variant: 'destructive',
        });
        return;
      }
      
      setProfilePicture(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would call:
      // const { error } = await supabase.auth.resetPasswordForEmail(email, {
      //   redirectTo: `${window.location.origin}/reset-password`,
      // });
      
      // if (error) throw error;
      
      setMode('reset-sent');
      setErrors({});
      
      toast({
        title: 'Password reset email sent',
        description: 'Check your email for instructions to reset your password.',
      });
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to send reset email. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    // Validate fields in the order they appear in the form
    if (mode === 'signup') {
      if (!fullName) {
        newErrors.fullName = 'Full name is required';
        isValid = false;
      }
      
      if (!userType) {
        newErrors.userType = 'Please select a user type';
        isValid = false;
      }
      
      if (!countryCode) {
        newErrors.country = 'Please select a country';
        isValid = false;
      }
      
      if (!phone) {
        newErrors.phone = 'Phone number is required';
        isValid = false;
      } else if (!validatePhone(phone)) {
        newErrors.phone = 'Please enter a valid phone number';
        isValid = false;
      }
      
      if (!acceptedTerms) {
        newErrors.terms = 'You must accept the terms and conditions';
        isValid = false;
      }
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }
    
    if (mode !== 'forgot-password') {
      if (!password) {
        newErrors.password = 'Password is required';
        isValid = false;
      } else if (mode === 'signup' && password.length < PASSWORD_MIN_LENGTH) {
        newErrors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        // 1. Create auth user
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone,
              user_type: userType,
              country_code: countryCode,
            },
          },
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          // 2. Upload profile picture if provided
          let profilePictureUrl = null;
          if (profilePicture) {
            const fileExt = profilePicture.name.split('.').pop();
            const fileName = `${data.user.id}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
              .from('profile-pictures')
              .upload(fileName, profilePicture);
            
            if (!uploadError) {
              const { data: { publicUrl } } = supabase.storage
                .from('profile-pictures')
                .getPublicUrl(fileName);
              profilePictureUrl = publicUrl;
            }
          }

          // 3. Create user profile with additional fields
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              full_name: fullName,
              email,
              phone,
              user_type: userType,
              country_code: countryCode,
              profile_picture_url: profilePictureUrl,
              subscribe_to_newsletter: subscribeToNewsletter,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

          if (profileError) throw profileError;

          // 4. Send welcome email or other post-signup actions
          const { error: welcomeError } = await supabase.functions.invoke('send-welcome-email', {
            body: { email, name: fullName }
          });

          if (welcomeError) console.error('Welcome email error:', welcomeError);

          toast({
            title: "Success!",
            description: "Your account has been created! Please check your email to verify your account.",
          });
          
          // Reset form
          setFullName("");
          setEmail("");
          setPassword("");
          setPhone("");
          setUserType("");
          setCountryCode("");
          setProfilePicture(null);
          setSubscribeToNewsletter(true);
          setAcceptedTerms(false);
          
          // Switch to sign in view
          setMode('signin');
        }
      } else {
        // Sign in logic remains the same
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        toast({
          title: "Success",
          description: "You have been logged in successfully!",
        });
        onClose();
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: error.message || 'An error occurred. Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderBackButton = () => (
    <button
      type="button"
      onClick={() => setMode('signin')}
      className="flex items-center text-sm text-gray-400 hover:text-white mb-6"
    >
      <ArrowLeft className="h-4 w-4 mr-1" />
      Back to sign in
    </button>
  );

  if (!isOpen) return null;

  // Set initial mode to signup if coming from create account button
  const handleClose = () => {
    setMode(initialMode);
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="mb-4 flex items-center text-sm text-gray-400 hover:text-white"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to sign in
                </button>
              )}
              <h2 className="text-2xl font-bold text-white">
                {mode === 'signin' ? 'Welcome Back' : 
                 mode === 'signup' ? 'Create an Account' : 
                 mode === 'forgot-password' ? 'Reset your password' : 
                 'Check your email'}
              </h2>
            </div>
            <button
              type="button"
              className="rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              onClick={handleClose}
            >
              <span className="sr-only">Close panel</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="px-4 sm:px-6 pb-6">
            {/* Reset Password Success Message */}
            {mode === 'reset-sent' && (
              <div className="rounded-md bg-green-900/30 p-4 border border-green-800/50 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-200">Password reset email sent</h3>
                    <div className="mt-2 text-sm text-green-300">
                      <p>We've sent you an email with a link to reset your password. Please check your inbox.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Auth Forms */}
            {['signin', 'signup', 'forgot-password'].includes(mode) && (
              <form onSubmit={mode === 'forgot-password' ? handleForgotPassword : handleSubmit} className="space-y-6">
                {/* Sign Up Form Fields */}
                {mode === 'signup' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className={`w-full bg-gray-800 border-gray-700 text-white ${errors.fullName ? 'border-red-500' : ''}`}
                      />
                      {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>}
                    )}

                    {/* Phone Number (Sign Up Only) */}
                    {mode === 'signup' && (
                      <div className="space-y-3">
                        <Label htmlFor="phone" className="text-gray-300 font-medium">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                          }}
                          placeholder="+1 (555) 000-0000"
                          className={`h-12 bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:ring-2 ${
                          errors.phone ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'
                        } focus:border-transparent`}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                        )}
                      </div>
                    )}

                    {/* Terms and Conditions (Sign Up Only) */}
                    {mode === 'signup' && (
                      <div className="space-y-4 pt-2">
                        <div className="flex items-start space-x-3">
                          <div className="flex items-center h-5">
                            <Checkbox
                              id="terms"
                              checked={acceptedTerms}
                              onCheckedChange={(checked) => {
                                setAcceptedTerms(!!checked);
                                if (errors.terms) setErrors(prev => ({ ...prev, terms: '' }));
                              }}
                              className="h-5 w-5 rounded border-gray-600 bg-gray-800 text-green-500 focus:ring-green-500"
                            />
                          </div>
                          <div className="text-sm">
                            <label
                              htmlFor="terms"
                              className="font-medium text-gray-300 cursor-pointer"
                            >
                              I agree to the{' '}
                              <a href="#" className="text-green-400 hover:text-green-300">
                                Terms of Service
                              </a>{' '}
                              and{' '}
                              <a href="#" className="text-green-400 hover:text-green-300">
                                Privacy Policy
                              </a>
                            </label>
                            {errors.terms && (
                              <p className="text-red-500 text-sm mt-1">{errors.terms}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="flex items-center h-5">
                            <Checkbox
                              id="newsletter"
                              checked={subscribeToNewsletter}
                              onCheckedChange={(checked) => setSubscribeToNewsletter(!!checked)}
                              className="h-5 w-5 rounded border-gray-600 bg-gray-800 text-green-500 focus:ring-green-500"
                            />
                          </div>
                          <label
                            htmlFor="newsletter"
                            className="text-sm font-medium text-gray-300 cursor-pointer"
                          >
                            Subscribe to our newsletter
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-2">
                      <Button
                        type="submit"
                        className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium text-sm rounded-md transition-colors"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>
                              {mode === 'signin' 
                                ? 'Signing in...' 
                                : mode === 'signup' 
                                  ? 'Creating account...' 
                                  : 'Sending...'}
                            </span>
                          </div>
                        ) : mode === 'signin' ? 'Sign In' : 
                          mode === 'signup' ? 'Create Account' : 
                          'Send Reset Link'}
                      </Button>
                    </div>

                    {/* Toggle between Sign In and Sign Up */}
                    {mode !== 'reset-sent' && mode !== 'forgot-password' && (
                      <div className="mt-8 pt-6 border-t border-gray-800">
                        <p className="text-center text-sm text-gray-400">
                          {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
                          <button
                            type="button"
                            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                            className="ml-1.5 font-medium text-green-400 hover:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
                          >
                            {mode === 'signin' ? 'Sign up' : 'Sign in'}
                          </button>
                        </p>
                        {mode === 'signin' && (
                          <p className="mt-3 text-center text-xs text-gray-500">
                            By continuing, you agree to our Terms of Service and Privacy Policy
                          </p>
                        )}
                      </div>
                    )}
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default AuthDrawer;
