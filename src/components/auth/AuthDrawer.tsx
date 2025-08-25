import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { X, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthForm } from "./AuthForm";

type AuthMode = 'signin' | 'signup' | 'forgot-password';

interface AuthDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
}

export const AuthDrawer = ({ isOpen, onClose, initialMode = 'signin' }: AuthDrawerProps) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  // Reset mode when drawer opens/closes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  const handleClose = () => {
    setMode(initialMode);
    onClose();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Success",
        description: "You have been signed out successfully.",
      });
      onClose();
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
  };

  const handleAuthSuccess = () => {
    if (mode === 'signup') {
      // Switch to signin after successful signup
      setMode('signin');
      toast({
        title: "Success!",
        description: "Your account has been created! Please check your email to verify your account.",
      });
    } else {
      // Close drawer after successful signin
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden ${!isOpen ? 'pointer-events-none' : ''}`}>
      <div className={`absolute inset-0 bg-black/50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose} />
      <div 
        className={`fixed inset-y-0 right-0 flex max-w-full pl-10 transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="w-screen max-w-md">
          <div className="flex h-full flex-col bg-gray-900 shadow-xl overflow-y-auto">
            {/* Header */}
            <div className="px-6 py-6">
              <div className="flex items-start justify-between">
                <div className="w-full">
                  {mode !== 'signin' && (
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
                     'Reset your password'}
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
            <div className="flex-1">
              <div className="px-4 sm:px-6 pb-6">
                {user ? (
                  // User is logged in - show sign out option
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-gray-300 mb-4">
                        Welcome back, <span className="font-semibold text-white">{user.email}</span>
                      </p>
                      <Button
                        onClick={handleSignOut}
                        className="w-full bg-red-600 hover:bg-red-700"
                      >
                        Sign Out
                      </Button>
                    </div>
                  </div>
                ) : (
                  // User is not logged in - show auth form
                  <AuthForm
                    mode={mode}
                    onModeChange={handleModeChange}
                    onSuccess={handleAuthSuccess}
                    showModeToggle={true}
                  />
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
