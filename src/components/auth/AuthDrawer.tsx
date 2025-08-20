import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { X, ArrowLeft, Mail, CheckCircle, Upload } from "lucide-react";
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
  const [userType, setUserType] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [subscribeToNewsletter, setSubscribeToNewsletter] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const userTypes = [
    { value: 'individual', label: 'Individual' },
    { value: 'business', label: 'Business' },
    { value: 'organization', label: 'Organization' },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    const newErrors: Record<string, string> = {};
    
    // Store field order for consistent error message display
    const fieldOrder = [
      'fullName',
      'userType',
      'phone',
      'email',
      'password',
      'country',
      'terms'
    ];
    
    // Validate in the order fields appear in the form (top to bottom)
    if (mode === 'signup') {
      // 1. Full Name (first field in signup form)
      if (!fullName) {
        newErrors.fullName = 'Full name is required';
      }
      
      // 2. User Type (second field in signup form)
      if (!userType) {
        newErrors.userType = 'Please select a user type';
      }
      
      // 3. Phone Number (third field in signup form)
      if (!phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!validatePhone(phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }
    
    // 4. Email (appears in all forms)
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // 5. Password (appears in signin/signup)
    if (mode !== 'forgot-password') {
      if (!password) {
        newErrors.password = 'Password is required';
      } else if (mode === 'signup' && password.length < PASSWORD_MIN_LENGTH) {
        newErrors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
      }
    }
    
    // 6. Terms acceptance (last field in signup form)
    if (mode === 'signup' && !acceptedTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
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
    // Reset to the initial mode when closing
    setMode(initialMode);
    onClose();
  };
  
  // Handle sign up button click
  const handleSignUpClick = () => {
    setMode('signup');
    // Clear any existing errors when switching modes
    setErrors({});
  };

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" 
        onClick={handleClose} 
        aria-hidden="true"
      />
      <div className={`fixed inset-y-0 right-0 flex max-w-full pl-10 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="w-screen max-w-md">
          <div className="flex h-full flex-col bg-gray-900 shadow-xl">
            {/* Header */}
            <div className="px-6 py-6">
              <div className="flex items-start justify-between">
                <div className="w-full">
                  {(mode === 'forgot-password' || mode === 'reset-sent') && (
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
                        {/* Profile Picture Upload */}
                        <div className="space-y-3">
                          <Label className="text-gray-300 font-medium block">Profile Picture</Label>
                          <div className="flex items-center space-x-4">
                            <div 
                              onClick={triggerFileInput}
                              className="w-20 h-20 rounded-full bg-gray-800 border-2 border-dashed border-gray-700 flex items-center justify-center cursor-pointer hover:border-green-500 transition-colors"
                            >
                              {profilePicture ? (
                                <img 
                                  src={URL.createObjectURL(profilePicture)} 
                                  alt="Profile preview" 
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <div className="text-center">
                                  <Upload className="w-5 h-5 mx-auto text-gray-400" />
                                  <span className="text-xs text-gray-400 mt-1 block">Upload</span>
                                </div>
                              )}
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                              />
                            </div>
                            <div className="text-sm text-gray-400">
                              <p>JPG, PNG, or WebP</p>
                              <p className="text-xs">Max 5MB</p>
                            </div>
                          </div>
                        </div>

                        {/* Full Name */}
                        <div className="space-y-3">
                          <Label htmlFor="fullName" className="text-gray-300 font-medium">Full Name</Label>
                          <Input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => {
                              setFullName(e.target.value);
                              if (errors.fullName) setErrors(prev => ({ ...prev, fullName: '' }));
                            }}
                            placeholder="John Doe"
                            className={`h-12 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 ${
                              errors.fullName ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'
                            } focus:border-transparent`}
                          />
                          {errors.fullName && (
                            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                          )}
                        </div>

                        {/* User Type Dropdown */}
                        <div className="space-y-3">
                          <Label htmlFor="userType" className="text-gray-300 font-medium block">I am a</Label>
                          <Select
                            value={userType}
                            onValueChange={(value) => {
                              setUserType(value);
                              if (errors.userType) setErrors(prev => ({ ...prev, userType: '' }));
                            }}
                          >
                            <SelectTrigger 
                              id="userType"
                              className={`h-12 bg-gray-800 border-gray-700 text-white focus:ring-2 ${
                                errors.userType ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'
                              } focus:border-transparent`}
                            >
                              <SelectValue placeholder="Select user type" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700 text-white">
                              {userTypes.map((type) => (
                                <SelectItem 
                                  key={type.value} 
                                  value={type.value}
                                  className="hover:bg-gray-700 focus:bg-gray-700"
                                >
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.userType && (
                            <p className="text-red-500 text-sm mt-1">{errors.userType}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Email Field (Common for all forms) */}
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-gray-300 font-medium">
                        {mode === 'forgot-password' ? 'Email address' : 'Email'}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                        }}
                        placeholder="you@example.com"
                        className={`h-12 w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent rounded-md ${
                          errors.email ? 'border-red-500 focus:ring-red-500' : 'hover:border-gray-600'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    {/* Password Field (Not shown in forgot password) */}
                    {mode !== 'forgot-password' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password" className="text-gray-300 font-medium">
                            {mode === 'signup' ? 'Create a password' : 'Password'}
                          </Label>
                          {mode === 'signin' && (
                            <button
                              type="button"
                              onClick={() => setMode('forgot-password')}
                              className="text-sm font-medium text-green-400 hover:text-green-300"
                            >
                              Forgot password?
                            </button>
                          )}
                        </div>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                          }}
                          placeholder="••••••••"
                          className={`h-12 w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent rounded-md ${
                            errors.password ? 'border-red-500 focus:ring-red-500' : 'hover:border-gray-600'
                          }`}
                        />
                        {errors.password && (
                          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}
                        {mode === 'signup' && (
                          <p className="text-xs text-gray-400 mt-1">
                            Use {PASSWORD_MIN_LENGTH} or more characters with a mix of letters, numbers & symbols
                          </p>
                        )}
                      </div>
                    )}

                    {/* Phone Number (Sign Up Only) */}
                    {mode === 'signup' && (
                      <div className="space-y-3">
                        <Label htmlFor="phone" className="text-gray-300 font-medium">Phone Number</Label>
                        <div className="space-y-2">
                          <Input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value);
                              if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                            }}
                            placeholder="+1 (555) 000-0000"
                            className={`h-12 w-full bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:ring-2 ${
                              errors.phone ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'
                            } focus:border-transparent`}
                          />
                          {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                          )}
                        </div>

                        {/* Country Dropdown */}
                        <div className="space-y-2">
                          <Label htmlFor="country" className="text-gray-300 font-medium block">
                            Country
                          </Label>
                          <div className={errors.country ? 'border border-red-500 rounded-md' : ''}>
                            <CountrySelect
                              value={countryCode}
                              onChange={(value: string) => {
                                setCountryCode(value);
                                if (errors.country) setErrors(prev => ({ ...prev, country: '' }));
                              }}
                            />
                          </div>
                          {errors.country && (
                            <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                          )}
                        </div>
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
