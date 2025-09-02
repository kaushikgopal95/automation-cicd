import React from 'react';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ 
  password, 
  className 
}) => {
  const checks = [
    {
      label: 'At least 8 characters',
      test: password.length >= 8,
    },
    {
      label: 'Contains uppercase letter',
      test: /[A-Z]/.test(password),
    },
    {
      label: 'Contains lowercase letter',
      test: /[a-z]/.test(password),
    },
    {
      label: 'Contains number',
      test: /\d/.test(password),
    },
  ];

  const passedChecks = checks.filter(check => check.test).length;
  const strength = passedChecks / checks.length;

  const getStrengthColor = () => {
    if (strength === 1) return 'text-green-500';
    if (strength >= 0.75) return 'text-yellow-500';
    if (strength >= 0.5) return 'text-orange-500';
    return 'text-red-500';
  };

  const getStrengthText = () => {
    if (strength === 1) return 'Strong';
    if (strength >= 0.75) return 'Good';
    if (strength >= 0.5) return 'Fair';
    return 'Weak';
  };

  if (!password) return null;

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-400">Password strength</span>
        <span className={cn('text-sm font-medium', getStrengthColor())}>
          {getStrengthText()}
        </span>
      </div>
      
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className={cn(
            'h-2 rounded-full transition-all duration-300',
            strength === 1 ? 'bg-green-500' :
            strength >= 0.75 ? 'bg-yellow-500' :
            strength >= 0.5 ? 'bg-orange-500' : 'bg-red-500'
          )}
          style={{ width: `${strength * 100}%` }}
        />
      </div>
      
      <div className="space-y-2">
        {checks.map((check, index) => (
          <div key={index} className="flex items-center space-x-2">
            {check.test ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-red-500" />
            )}
            <span className={cn(
              'text-sm',
              check.test ? 'text-green-400' : 'text-red-400'
            )}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
