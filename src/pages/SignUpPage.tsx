
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

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white p-4">
      <div className="absolute top-4 left-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full shadow-sm" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Logo className="mx-auto mb-4" size="md" />
          <h1 className="text-2xl font-bold">Create your account</h1>
        </div>
        
        <div className="space-y-5 bg-white rounded-xl animate-fade-in">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your full name" 
                        className="h-11 border-2 border-gray-300 focus:border-black"
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
                        className="h-11 border-2 border-gray-300 focus:border-black"
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
                        className="h-11 border-2 border-gray-300 focus:border-black"
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
                        className="h-11 border-2 border-gray-300 focus:border-black"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="text-xs text-center">
                <p className="text-gray-600">
                  By signing up, you agree to our{" "}
                  <Button variant="link" className="p-0 h-auto text-xs font-semibold underline text-black">
                    Terms
                  </Button>{" "}
                  and{" "}
                  <Button variant="link" className="p-0 h-auto text-xs font-semibold underline text-black">
                    Privacy Policy
                  </Button>
                </p>
              </div>
              
              <Button
                type="submit"
                className="w-full h-11 bg-black hover:bg-gray-800 rounded-full text-white mt-2"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Continue"}
              </Button>
            </form>
          </Form>

          <div className="relative h-px bg-gray-200 my-4">
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-gray-500 text-xs">
              or continue with
            </div>
          </div>

          <SocialButtons
            onGoogleClick={() => handleSocialLogin("Google")}
            onLinkedInClick={() => handleSocialLogin("LinkedIn")}
            className="gap-2"
          />
        </div>
        
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">Already have an account?</p>
          <Button 
            variant="link" 
            className="font-semibold text-black underline p-0 text-sm"
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
