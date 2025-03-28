
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import AuthCard from '@/components/auth/AuthCard';
import AlertService from '@/services/AlertService';

// API base URL
const API_BASE_URL = "https://weez-auth-api-ewhdbra3dbbtfaaw.canadacentral-01.azurewebsites.net";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, email } = location.state || {};
  
  const [isResending, setIsResending] = useState(false);
  
  // Handle resend verification email
  const handleResendVerification = async () => {
    if (!email && !username) {
      AlertService.showError('Error', 'Email address is missing. Please go back and try again.');
      return;
    }
    
    setIsResending(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email || username,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        AlertService.showError('Failed', data.error || 'Failed to resend verification email');
        return;
      }
      
      // If successful, show confirmation and navigate to OTP page
      AlertService.showSuccess('Email Sent', 'Verification email has been resent');
      
      navigate('/otp', { 
        state: { 
          email: email || username,
          username: email || username,
          fromScreen: 'verification'
        } 
      });
      
    } catch (error) {
      console.error('Resend verification error:', error);
      AlertService.showError('Error', 'An error occurred. Please try again later.');
    } finally {
      setIsResending(false);
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
        <AuthCard
          title="Verify Your Email"
          description="Your email address needs verification before you can continue"
          className="animate-fade-in"
        >
          <div className="space-y-6 text-center">
            <p className="text-gray-600">
              We've sent a verification email to <strong>{email || username}</strong>. 
              Please check your inbox and follow the instructions to verify your account.
            </p>
            
            <div className="pt-2">
              <Button
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full h-12 bg-black hover:bg-gray-800 rounded-full"
              >
                {isResending ? 'Sending...' : 'Resend Verification Email'}
              </Button>
            </div>
            
            <p className="text-sm text-gray-500 pt-4">
              If you don't see the email, check your spam folder or try another email address.
            </p>
          </div>
        </AuthCard>
        
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

export default VerifyEmailPage;
