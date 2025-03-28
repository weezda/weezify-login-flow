
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import AuthCard from '@/components/auth/AuthCard';
import AlertService from '@/services/AlertService';
import { useAuth } from '@/contexts/AuthContext';
import OtpInput from '@/components/auth/OtpInput';

// API base URL
const API_BASE_URL = "https://weez-auth-api-ewhdbra3dbbtfaaw.canadacentral-01.azurewebsites.net";

// Define flow types for better code organization
const FLOW_TYPES = {
  LOGIN: "login",
  REGISTRATION: "registration",
  FORGOT_PASSWORD: "forgotpassword",
};

const OtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Get data from location state
  const { 
    username = "", 
    fromScreen = FLOW_TYPES.REGISTRATION,
    email = "",
    isUnverifiedAccount = false,
    password = "",
    name = "",
    newPassword = "", 
  } = location.state || {};
  
  // Initialize state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCounter, setResendCounter] = useState(30);
  const [isResending, setIsResending] = useState(false);
  
  // Effect for countdown timer
  useEffect(() => {
    if (resendCounter <= 0) return;
    
    const timerId = setInterval(() => {
      setResendCounter(prevCounter => prevCounter - 1);
    }, 1000);
    
    return () => clearInterval(timerId);
  }, [resendCounter]);
  
  // Effect to handle auto-resend for unverified accounts
  useEffect(() => {
    if (isUnverifiedAccount) {
      handleResendOtp();
    }
  }, [isUnverifiedAccount]);
  
  // Determine email to use (normalize if needed)
  const emailToUse = email || username;
  
  // Handle OTP submission
  const handleSubmit = async () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      AlertService.showError('Invalid OTP', 'Please enter a valid 6-digit code');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const endpoint = fromScreen === FLOW_TYPES.REGISTRATION
        ? '/api/verify-email'
        : fromScreen === FLOW_TYPES.FORGOT_PASSWORD
          ? '/api/reset-password'
          : '/api/verify-login';
      
      const body = fromScreen === FLOW_TYPES.FORGOT_PASSWORD
        ? { email: emailToUse, otp: otpValue, new_password: newPassword }
        : { email: emailToUse, otp: otpValue };
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        AlertService.showError('Verification Failed', data.error || 'Failed to verify OTP');
        setIsLoading(false);
        return;
      }
      
      // Handle successful verification based on flow type
      if (fromScreen === FLOW_TYPES.REGISTRATION) {
        // For registration, we should have received a token
        if (data.token) {
          // Log the user in
          await login(data.token, emailToUse, data.refreshToken || null);
          
          AlertService.showSuccess('Success', 'Your account has been verified!');
          navigate('/');
        } else {
          navigate('/email-login');
        }
      } else if (fromScreen === FLOW_TYPES.FORGOT_PASSWORD) {
        AlertService.showSuccess('Success', 'Password has been reset successfully!');
        navigate('/email-login');
      } else {
        // For login, we should have received a token
        if (data.token) {
          // Log the user in
          await login(data.token, emailToUse, data.refreshToken || null);
          
          AlertService.showSuccess('Success', 'Login successful!');
          navigate('/');
        } else {
          navigate('/email-login');
        }
      }
      
    } catch (error) {
      console.error('OTP verification error:', error);
      AlertService.showError('Error', 'An error occurred during verification. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle resending OTP
  const handleResendOtp = async () => {
    if (resendCounter > 0 && !isUnverifiedAccount) {
      return;
    }
    
    setIsResending(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailToUse,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        AlertService.showError('Resend Failed', data.error || 'Failed to resend OTP');
        return;
      }
      
      // Reset counter
      setResendCounter(30);
      AlertService.showSuccess('OTP Sent', 'A new verification code has been sent to your email');
      
    } catch (error) {
      console.error('Resend OTP error:', error);
      AlertService.showError('Error', 'An error occurred while resending the code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  // If no email or username, redirect to login
  if (!emailToUse) {
    useEffect(() => {
      navigate('/login');
    }, []);
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
      <div className="absolute top-4 left-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full" 
          onClick={() => navigate(fromScreen === FLOW_TYPES.REGISTRATION ? '/signup' : '/email-login')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="w-full max-w-md">
        <AuthCard
          title="Verify Your Email"
          description={isUnverifiedAccount 
            ? `This email is already registered but not verified. Enter the verification code sent to ${emailToUse}` 
            : `We've sent a verification code to ${emailToUse}`}
          className="animate-fade-in"
        >
          <div className="space-y-8">
            <OtpInput 
              otp={otp} 
              setOtp={setOtp} 
              className="my-6"
            />
            
            <Button
              onClick={handleSubmit}
              disabled={isLoading || otp.join('').length !== 6}
              className="w-full h-12 bg-black hover:bg-gray-800 rounded-full"
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
            
            <div className="text-center mt-2">
              <p className="text-sm text-gray-600 mb-2">Didn't receive a code?</p>
              <Button 
                variant="link" 
                disabled={resendCounter > 0 && !isUnverifiedAccount}
                onClick={handleResendOtp}
                className="text-black font-semibold"
              >
                {isResending 
                  ? 'Resending...' 
                  : resendCounter > 0 && !isUnverifiedAccount 
                    ? `Resend code in ${resendCounter}s` 
                    : 'Resend code'}
              </Button>
            </div>
          </div>
        </AuthCard>
      </div>
    </div>
  );
};

export default OtpPage;
