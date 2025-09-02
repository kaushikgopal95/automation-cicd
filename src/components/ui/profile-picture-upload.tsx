import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { uploadProfilePicture, validateImageFile } from '@/utils/storage';
import { updateProfilePicture } from '@/utils/profile';
import { useToast } from '@/components/ui/use-toast';

interface ProfilePictureUploadProps {
  currentImageUrl?: string;
  userId: string;
  onImageUpdate?: (imageUrl: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentImageUrl,
  userId,
  onImageUpdate,
  className,
  size = 'md'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast({
        title: "Invalid file",
        description: validation.error,
        variant: "destructive"
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const result = await uploadProfilePicture(file, userId);

      if (result.success && result.url) {
        // Update the profile in the database
        const updateResult = await updateProfilePicture(userId, result.url);

        if (!updateResult.success) {
          console.error('Failed to update profile:', updateResult.error);
          toast({
            title: "Profile update failed",
            description: updateResult.error || "Failed to update profile",
            variant: "destructive"
          });
          return;
        }

        // Call the callback
        onImageUpdate?.(result.url);
        
        // Clear preview
        setPreviewUrl(null);
        
        toast({
          title: "Success",
          description: "Profile picture updated successfully!",
        });
      } else {
        toast({
          title: "Upload failed",
          description: result.error || "Failed to upload image",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayImageUrl = previewUrl || currentImageUrl;

  return (
    <div className={cn('flex flex-col items-center space-y-4', className)}>
      <div className="relative">
        <Avatar className={cn('border-2 border-gray-200', sizeClasses[size])}>
          <AvatarImage src={displayImageUrl} alt="Profile picture" />
          <AvatarFallback className="text-lg font-semibold">
            {currentImageUrl ? 'U' : 'U'}
          </AvatarFallback>
        </Avatar>
        
        {/* Upload button overlay */}
        <Button
          size="sm"
          variant="secondary"
          className={cn(
            'absolute -bottom-2 -right-2 rounded-full p-2 shadow-lg',
            size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-10 h-10' : 'w-12 h-12'
          )}
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Camera className={iconSizes[size]} />
        </Button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Preview actions */}
      {previewUrl && (
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={handleUpload}
            disabled={isUploading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              'Save'
            )}
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={isUploading}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      )}

      {/* Upload instructions */}
      {!previewUrl && (
        <div className="text-center text-sm text-gray-500">
          <p>Click the camera icon to upload a new picture</p>
          <p className="text-xs mt-1">Supports: JPEG, PNG, GIF, WebP (max 5MB)</p>
        </div>
      )}
    </div>
  );
};
