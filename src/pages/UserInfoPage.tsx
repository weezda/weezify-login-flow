
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AlertService from '@/services/AlertService';
import { useAuth } from '@/contexts/AuthContext';

// API base URL
const API_BASE_URL = "https://weez-auth-api-ewhdbra3dbbtfaaw.canadacentral-01.azurewebsites.net";

// Form schema
const userInfoSchema = z.object({
  profession: z.string().min(2, 'Profession is required'),
  age: z.string().refine(val => {
    const num = parseInt(val);
    return !isNaN(num) && num > 0 && num <= 120;
  }, { message: 'Age must be between 1 and 120' }),
  bio: z.string().optional(),
  gender: z.string().min(1, 'Please select a gender'),
});

type UserInfoFormValues = z.infer<typeof userInfoSchema>;

const UserInfoPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Get user email, password and name from route state
  const { 
    email = "", 
    password = "", 
    name = "" 
  } = location.state || {};
  
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  // Gender options
  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Non-binary", label: "Non-binary" },
    { value: "Prefer not to say", label: "Prefer not to say" }
  ];
  
  // Initialize form
  const form = useForm<UserInfoFormValues>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      profession: '',
      age: '',
      bio: '',
      gender: '',
    },
  });
  
  // Function to handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Function to save user info
  const onSubmit = async (data: UserInfoFormValues) => {
    setIsLoading(true);
    
    try {
      // In a real implementation, would upload profile image here
      // For now, we'll just use a placeholder URL
      const profileImageUrl = profileImage || "https://via.placeholder.com/150";
      
      // Create user info object
      const userInfo = {
        name,
        email,
        profession: data.profession,
        bio: data.bio || "",
        gender: data.gender,
        age: parseInt(data.age),
        profileImage: profileImageUrl,
      };
      
      console.log("Submitting user info:", userInfo);
      
      // Simulate API call to save user info
      // In a real implementation, would send this to the server
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate login after profile completion
      if (email) {
        // In a real implementation, would get token from API
        // For now, just navigate to home page
        // Normally we'd use login() with proper auth token
        AlertService.showSuccess('Profile Complete', 'Your profile has been saved!');
        navigate('/');
      }
      
    } catch (error) {
      console.error('Error saving user info:', error);
      AlertService.showError('Error', 'An error occurred while saving your profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to skip profile completion
  const handleSkip = () => {
    AlertService.showAlert('Profile Skipped', 'You can complete your profile later');
    navigate('/');
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
      <div className="absolute top-4 left-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl p-6 shadow-sm animate-fade-in">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Complete Your Profile</h1>
            <p className="text-gray-500">Step 3 of 3: Profile Details</p>
          </div>
          
          {/* Profile Image Upload */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-2 border-black flex items-center justify-center overflow-hidden bg-gray-100">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <Upload className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
              <div className="absolute bottom-0 right-0 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center">
                +
              </div>
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="profession"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profession <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="What do you do?" 
                        className="h-12 border-2 border-gray-300 focus:border-black"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Your age"
                        type="number"
                        min="1"
                        max="120"
                        className="h-12 border-2 border-gray-300 focus:border-black"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us a bit about yourself..."
                        className="min-h-[100px] border-2 border-gray-300 focus:border-black"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Gender <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-3"
                      >
                        {genderOptions.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2 border-2 border-gray-300 p-3 rounded-lg hover:border-black cursor-pointer">
                            <RadioGroupItem value={option.value} id={option.value} />
                            <Label htmlFor={option.value}>{option.label}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                className="w-full h-12 bg-black hover:bg-gray-800 rounded-full text-white mt-4"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save & Continue"}
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                className="w-full text-gray-500 underline hover:text-gray-700"
                onClick={handleSkip}
                disabled={isLoading}
              >
                Skip for now
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default UserInfoPage;
