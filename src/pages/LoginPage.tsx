
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/auth/Logo';
import { ArrowLeft } from 'lucide-react';
import SocialButtons from '@/components/auth/SocialButtons';
import AuthCard from '@/components/auth/AuthCard';
import AlertService from '@/services/AlertService';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSocialLogin = (provider: string) => {
    // This would be replaced with actual social login logic
    AlertService.showAlert('Social Login', `${provider} login is not implemented yet`);
  };

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
      
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Logo className="mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-8">Log in to Weez</h1>
        </div>
        
        <div className="w-full animate-fade-in">
          <Button 
            onClick={() => navigate('/email-login')} 
            variant="outline"
            className="w-full h-12 border-black relative rounded-xl mb-4"
          >
            <div className="absolute left-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            Continue with Email
          </Button>
          
          <SocialButtons 
            onGoogleClick={() => handleSocialLogin('Google')}
            onFacebookClick={() => handleSocialLogin('Facebook')}
            onLinkedInClick={() => handleSocialLogin('LinkedIn')}
          />
        </div>
        
        <div className="text-center">
          <p className="text-gray-600">Don't have an account?</p>
          <Button 
            variant="link" 
            className="font-semibold text-black underline"
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
