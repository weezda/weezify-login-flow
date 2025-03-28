
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Logo from '@/components/auth/Logo';
import SocialButtons from '@/components/auth/SocialButtons';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AlertService from '@/services/AlertService';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import PasswordInput from '@/components/auth/PasswordInput';
import ProgressSteps from '@/components/auth/ProgressSteps';
import AuthCard from '@/components/auth/AuthCard';

// API base URL
const API_BASE_URL = "https://weez-auth-api-ewhdbra3dbbtfaaw.canadacentral-01.azurewebsites.net";

// Form schema
const signupSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

const SignUpPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  // Social login handlers
  const handleSocialLogin = (provider: string) => {
    AlertService.showAlert('Social Login', `${provider} login is not implemented yet`);
  };

  // Initialize form
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Form submission handler
  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: data.name,
          email: data.email,
          password: data.password
        }),
      });
      
      const responseData = await response.json();
      console.log("Registration response:", responseData);
      
      // Check for standard success (status 201)
      if (response.status === 201) {
        navigate("/otp", { 
          state: { 
            username: data.email,
            password: data.password,
            name: data.name,
            fromScreen: "registration",
            email: data.email
          }
        });
      } 
      // Check specifically for "already registered but not verified" case
      else if (responseData.error && responseData.error.includes("already registered but not verified")) {
        // Navigate to OTP screen with flag for unverified account
        navigate("/otp", { 
          state: { 
            username: data.email,
            fromScreen: "registration",
            email: data.email,
            isUnverifiedAccount: true // This flag will trigger auto-resend in OtpScreen
          }
        });
      }
      // Handle other success cases
      else if (!responseData.error || responseData.success) {
        navigate("/otp", { 
          state: { 
            username: data.email,
            fromScreen: "registration",
            email: data.email
          }
        });
      } 
      // Handle actual errors
      else {
        AlertService.showError("Registration Error", responseData.error || responseData.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Registration error:", error);
      AlertService.showError("Connection Error", "Unable to connect to the server. Please check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // Define progress steps
  const steps = [
    { number: 1, label: 'Account' },
    { number: 2, label: 'Verify' },
    { number: 3, label: 'Profile' }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
      <div className="absolute top-4 left-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="w-full max-w-md mb-6">
        <div className="text-center mb-6">
          <Logo className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-gray-500">Step 1 of 3: Account Details</p>
        </div>
        
        <AuthCard
          title=""
          className="animate-fade-in border-none shadow-none"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your full name" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your email" 
                        type="email" 
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput 
                        placeholder="Create a password (min. 8 characters)" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput 
                        placeholder="Confirm your password" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="text-sm text-center py-2">
                <p>
                  By signing up, you agree to our{" "}
                  <Button variant="link" className="p-0 h-auto text-sm font-semibold underline text-black">
                    Terms of Service
                  </Button>{" "}
                  and{" "}
                  <Button variant="link" className="p-0 h-auto text-sm font-semibold underline text-black">
                    Privacy Policy
                  </Button>
                </p>
              </div>
              
              <Button
                type="submit"
                className="w-full h-12 bg-black hover:bg-gray-800 rounded-full"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Continue"}
              </Button>
              
              <ProgressSteps steps={steps} currentStep={1} className="mt-8 mb-4" />
            </form>
          </Form>
        </AuthCard>
        
        <div className="text-center mt-6">
          <p className="text-gray-600">Already have an account?</p>
          <Button 
            variant="link" 
            className="font-semibold text-black underline p-0"
            onClick={() => navigate('/login')}
          >
            Log in
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
