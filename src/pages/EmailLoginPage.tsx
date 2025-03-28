
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft } from 'lucide-react';
import PasswordInput from '@/components/auth/PasswordInput';
import AuthCard from '@/components/auth/AuthCard';
import AlertService from '@/services/AlertService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

// API base URL
const API_BASE_URL = "https://weez-auth-api-ewhdbra3dbbtfaaw.canadacentral-01.azurewebsites.net";

// Form schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const EmailLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Form submission handler
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);

    try {
      // Attempt to login with email and password
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        // Handle different error scenarios
        if (responseData.error?.includes("Email not registered") || responseData.error?.includes("Invalid email or password")) {
          AlertService.showError("Login Failed", "Invalid email or password");
        } 
        else if (responseData.error?.includes("Email not verified")) {
          navigate("/verify-email", { 
            state: { 
              username: data.email 
            } 
          });
          
          toast({
            title: "Email Not Verified",
            description: "Please verify your email first",
            variant: "destructive",
            action: (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  // Would typically implement resend OTP functionality here
                  AlertService.showAlert("Request Sent", "A new verification code has been sent to your email");
                }}
              >
                Resend OTP
              </Button>
            ),
          });
        } 
        else {
          AlertService.showError("Error", responseData.error || "An error occurred during login");
        }
        setIsLoading(false);
        return;
      }

      // If login successful, navigate to OTP verification
      navigate("/otp", {
        state: {
          username: responseData.username,
          fromScreen: "login",
          email: data.email
        }
      });
      
    } catch (error) {
      console.error("Login error:", error);
      AlertService.showError("Network Error", "Could not connect to the server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full hover:bg-black/5" 
          onClick={() => navigate('/login')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="w-full max-w-md">
        <AuthCard 
          title="Log in with email" 
          description="Enter your email and password to continue"
          className="animate-fade-in shadow-xl border-none"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your email" 
                        type="email" 
                        className="h-11 text-base border-gray-300 focus:border-black" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Password</FormLabel>
                    <FormControl>
                      <PasswordInput 
                        placeholder="Enter your password" 
                        className="h-11 text-base border-gray-300 focus:border-black"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-medium text-black hover:text-gray-700"
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                >
                  Forgot password?
                </Button>
              </div>
              
              <Button
                type="submit"
                className="w-full h-12 bg-black hover:bg-gray-800 rounded-full font-medium transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </AuthCard>
        
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-2">Don't have an account?</p>
          <Button 
            variant="link" 
            className="font-semibold text-black underline text-lg p-0 transition-colors hover:text-gray-700"
            onClick={() => navigate('/signup')}
          >
            Sign up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailLoginPage;
