
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/auth/Logo';
import { ArrowLeft } from 'lucide-react';
import SocialButtons from '@/components/auth/SocialButtons';
import AlertService from '@/services/AlertService';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSocialLogin = (provider: string) => {
    // This would be replaced with actual social login logic
    AlertService.showAlert('Social Login', `${provider} login is not implemented yet`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full hover:bg-black/5" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo className="mx-auto h-16 w-16 mb-4" />
          <h1 className="text-2xl font-bold">Log in to Weez</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your documents smarter</p>
        </div>
        
        <div className="w-full space-y-4 animate-fade-in">
          <Button 
            onClick={() => navigate('/email-login')} 
            variant="outline"
            className="w-full h-12 border-black relative rounded-xl transition-all hover:bg-black hover:text-white font-medium"
          >
            <div className="absolute left-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            Continue with Email
          </Button>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-500">or</span>
            </div>
          </div>
          
          <SocialButtons 
            onGoogleClick={() => handleSocialLogin('Google')}
            onLinkedInClick={() => handleSocialLogin('LinkedIn')}
            className="space-y-3"
          />
        </div>
        
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">Don't have an account?</p>
          <Button 
            variant="link" 
            className="font-semibold text-black underline text-sm"
            onClick={() => navigate('/signup')}
          >
            Sign up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
