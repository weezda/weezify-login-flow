
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import AlertService from '@/services/AlertService';
import AuthCard from '@/components/auth/AuthCard';

// API base URL
const API_BASE_URL = "https://weez-auth-api-ewhdbra3dbbtfaaw.canadacentral-01.azurewebsites.net";

// Form schema
const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Initialize form
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  // Form submission handler
  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);

    try {
      // This would be an actual API call in a real implementation
      // const response = await fetch(`${API_BASE_URL}/api/forgot-password`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: data.email }),
      // });
      
      // Simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      setIsSubmitted(true);
      
    } catch (error) {
      console.error('Forgot password error:', error);
      AlertService.showError('Error', 'An error occurred while processing your request. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
      <div className="absolute top-4 left-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full" 
          onClick={() => navigate('/email-login')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="w-full max-w-md">
        {!isSubmitted ? (
          <AuthCard 
            title="Forgot Password" 
            description="Enter your email and we'll send you a link to reset your password."
            className="animate-fade-in"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your email address" 
                          type="email" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button
                  type="submit"
                  className="w-full h-12 bg-black hover:bg-gray-800 rounded-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Reset Password"}
                </Button>
              </form>
            </Form>
          </AuthCard>
        ) : (
          <AuthCard
            title="Check Your Email"
            description={`We've sent password reset instructions to ${form.getValues().email}`}
            className="animate-fade-in"
          >
            <div className="text-center p-4">
              <p className="text-gray-600 mb-6">
                If you don't receive an email within a few minutes, please check your spam folder or try again.
              </p>
              
              <Button
                onClick={() => navigate('/email-login')}
                className="w-full h-12 bg-black hover:bg-gray-800 rounded-full"
              >
                Return to Login
              </Button>
            </div>
          </AuthCard>
        )}
        
        <div className="text-center mt-6">
          <Button 
            variant="link" 
            className="text-gray-600 font-medium"
            onClick={() => navigate('/email-login')}
          >
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
