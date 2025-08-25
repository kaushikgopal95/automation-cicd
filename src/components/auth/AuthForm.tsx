import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-input';
import { PasswordStrength } from '@/components/ui/password-strength';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CountrySelect } from '@/components/ui/country-select';
import countriesData from 'world-countries';

interface AuthFormProps {
  mode: 'signin' | 'signup' | 'forgot-password';
  onModeChange?: (mode: 'signin' | 'signup' | 'forgot-password') => void;
  onSuccess?: () => void;
  showModeToggle?: boolean;
  className?: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  onModeChange,
  onSuccess,
  showModeToggle = true,
  className
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    userType: 'individual',
    country: '',
    subscribeToNewsletter: true,
    acceptedTerms: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const userTypes = [
    { value: 'individual', label: 'Individual' },
    { value: 'business', label: 'Business' },
    { value: 'organization', label: 'Organization' }
  ];

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (mode === 'signup') {
      if (!formData.fullName?.trim()) {
        newErrors.fullName = 'Full name is required';
      }
      if (!formData.phone?.trim()) {
        newErrors.phone = 'Phone number is required';
      }
      if (!formData.userType) {
        newErrors.userType = 'Please select a user type';
      }
      if (!formData.acceptedTerms) {
        newErrors.terms = 'You must accept the terms and conditions';
      }
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (mode !== 'forgot-password') {
      if (!formData.password?.trim()) {
        newErrors.password = 'Password is required';
      } else if (mode === 'signup' && formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }

      if (mode === 'signup' && formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, GIF, or WebP image.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB.",
        variant: "destructive"
      });
      return;
    }

    setProfilePicture(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeProfilePicture = () => {
    setProfilePicture(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        // Create auth user
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              phone: formData.phone,
              user_type: formData.userType,
              subscribe_to_newsletter: formData.subscribeToNewsletter,
              country: formData.country
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (signUpError) throw signUpError;

        if (authData.user) {
          let profilePictureUrl = null;
          
          // Upload profile picture if provided
          if (profilePicture) {
            try {
              const userId = authData.user.id;
              const fileExt = profilePicture.name.split('.').pop()?.toLowerCase() || 'jpg';
              const fileName = `profile.${fileExt}`;
              const filePath = `${userId}/${fileName}`;
              
              const { error: uploadError } = await supabase.storage
                .from('profile-pictures')
                .upload(filePath, profilePicture, {
                  cacheControl: '3600',
                  upsert: false
                });
              
              if (uploadError) throw uploadError;
              
              // Get public URL
              const { data: { publicUrl } } = supabase.storage
                .from('profile-pictures')
                .getPublicUrl(filePath);
              
              profilePictureUrl = publicUrl;
              
              // Update profile with picture URL
              await supabase
                .from('profiles')
                .update({ profile_picture_url: profilePictureUrl })
                .eq('id', userId);
                
            } catch (uploadError: any) {
              console.error('Profile picture upload failed:', uploadError);
              toast({
                title: "Profile picture upload failed",
                description: "Your account was created, but we could not upload your profile picture. You can update it later.",
                variant: "destructive"
              });
            }
          }

          toast({
            title: "Success!",
            description: "Your account has been created! Please check your email to verify your account.",
          });
          
          // Reset form
          setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            fullName: '',
            phone: '',
            userType: 'individual',
            country: '',
            subscribeToNewsletter: true,
            acceptedTerms: false
          });
          removeProfilePicture();
          
          onSuccess?.();
        }
      } else if (mode === 'signin') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (signInError) throw signInError;

        toast({
          title: "Success",
          description: "You have been logged in successfully!",
        });
        
        onSuccess?.();
      } else if (mode === 'forgot-password') {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(formData.email, {
          redirectTo: `${window.location.origin}/auth/callback`,
        });

        if (resetError) throw resetError;

        toast({
          title: "Reset link sent",
          description: "Check your email for a password reset link.",
        });
        
        onSuccess?.();
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      let errorMessage = error.message || 'An unexpected error occurred. Please try again.';
      
      // Handle specific Supabase auth errors
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Please verify your email before logging in.';
      } else if (error.message?.includes('already registered')) {
        errorMessage = 'This email is already registered. Please sign in instead.';
        if (onModeChange) onModeChange('signin');
      } else if (error.message?.includes('password')) {
        errorMessage = 'Please choose a stronger password.';
      } else if (error.message?.includes('rate limit') || error.message?.includes('Too many requests')) {
        errorMessage = 'Too many attempts. Please try again later.';
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderProfilePictureUpload = () => {
    if (mode !== 'signup') return null;

    return (
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-300">Profile Picture (Optional)</label>
        <div className="flex items-center space-x-4">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer transition-colors",
              previewUrl 
                ? "border-green-500 bg-green-50" 
                : "border-gray-600 bg-gray-800 hover:border-gray-500"
            )}
          >
            {previewUrl ? (
              <div className="relative w-full h-full">
                <img 
                  src={previewUrl} 
                  alt="Profile preview" 
                  className="w-full h-full rounded-full object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeProfilePicture();
                  }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <Camera className="w-5 h-5 mx-auto text-gray-400" />
                <span className="text-xs text-gray-400 mt-1 block">Upload</span>
              </div>
            )}
          </div>
          <div className="text-sm text-gray-400">
            <p>JPG, PNG, GIF, or WebP</p>
            <p className="text-xs">Max 5MB</p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    );
  };

  const renderSignupFields = () => {
    if (mode !== 'signup') return null;

    return (
      <>
        {renderProfilePictureUpload()}
        
        <FormInput
          label="Full Name"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          placeholder="John Doe"
          error={errors.fullName}
          required
        />

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-300">User Type</label>
          <select
            value={formData.userType}
            onChange={(e) => handleChange('userType', e.target.value)}
            className={cn(
              "w-full h-11 bg-gray-800 border border-gray-700 text-white rounded-lg px-3 focus:ring-2 focus:ring-green-500 focus:border-transparent",
              errors.userType ? "border-red-500 focus:ring-red-500" : ""
            )}
          >
            {userTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.userType && (
            <p className="text-red-500 text-sm mt-1">{errors.userType}</p>
          )}
        </div>

        <FormInput
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="+1 (555) 000-0000"
          error={errors.phone}
          required
        />

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-300">Country</label>
          <CountrySelect
            value={(() => {
              // Find the country code from the stored country name
              const countries = countriesData.map((country: any) => ({
                code: country.cca2,
                name: country.name.common,
              }));
              const country = countries.find(c => c.name === formData.country);
              return country?.code || '';
            })()}
            onChange={(countryCode) => {
              // Find the country name from the code and store that
              const countries = countriesData.map((country: any) => ({
                code: country.cca2,
                name: country.name.common,
              }));
              const selectedCountry = countries.find(c => c.code === countryCode);
              handleChange('country', selectedCountry?.name || '');
            }}
            className={errors.country ? "border-red-500 focus:ring-red-500" : ""}
          />
          {errors.country && (
            <p className="text-red-500 text-sm mt-1">{errors.country}</p>
          )}
        </div>
      </>
    );
  };

  const renderSignupCheckboxes = () => {
    if (mode !== 'signup') return null;

    return (
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="terms"
            checked={formData.acceptedTerms}
            onChange={(e) => handleChange('acceptedTerms', e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-600 bg-gray-800 text-green-500 focus:ring-green-500"
          />
          <label htmlFor="terms" className="text-sm text-gray-300">
            I agree to the{' '}
            <a href="#" className="text-green-400 hover:text-green-300">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-green-400 hover:text-green-300">
              Privacy Policy
            </a>
          </label>
        </div>
        {errors.terms && (
          <p className="text-red-500 text-sm mt-1">{errors.terms}</p>
        )}

        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="newsletter"
            checked={formData.subscribeToNewsletter}
            onChange={(e) => handleChange('subscribeToNewsletter', e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-600 bg-gray-800 text-green-500 focus:ring-green-500"
          />
          <label htmlFor="newsletter" className="text-sm text-gray-300">
            Subscribe to our newsletter
          </label>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      {renderSignupFields()}

      <FormInput
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        placeholder="you@example.com"
        error={errors.email}
        required
      />

      {mode !== 'forgot-password' && (
        <>
          <FormInput
            label={mode === 'signup' ? 'Create a password' : 'Password'}
            name="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="••••••••"
            error={errors.password}
            required
          />

          {mode === 'signup' && (
            <>
              <FormInput
                label="Confirm password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                placeholder="••••••••"
                error={errors.confirmPassword}
                required
              />
              <PasswordStrength password={formData.password} />
            </>
          )}
        </>
      )}

      {renderSignupCheckboxes()}

      <Button
        type="submit"
        className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
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

      {showModeToggle && mode !== 'forgot-password' && (
        <div className="text-center text-sm text-gray-400">
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button 
            type="button" 
            onClick={() => onModeChange?.(mode === 'signin' ? 'signup' : 'signin')}
            className="font-medium text-green-400 hover:text-green-300"
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      )}

      {mode === 'signin' && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => onModeChange?.('forgot-password')}
            className="text-sm font-medium text-green-400 hover:text-green-300"
          >
            Forgot password?
          </button>
        </div>
      )}
    </form>
  );
};
