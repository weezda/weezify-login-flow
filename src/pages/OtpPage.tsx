
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import AuthCard from '@/components/auth/AuthCard';
import AlertService from '@/services/AlertService';
import { useAuth } from '@/contexts/AuthContext';

// API base URL
const API_BASE_URL = "https://weez-auth-api-ewhdbra3dbbtfaaw.canadacentral-01.azurewebsites.net";

const OtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Get data from location state
  const { 
    username, 
    fromScreen, 
    email,
    password,
    name,
    isUnverifiedAccount 
  } = location.state || {};
  
  // Initialize state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCounter, setResendCounter] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Effect to auto-focus first input
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);
  
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
  
  // Handle OTP input change
  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };
  
  // Handle key down events for navigation and deletion
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowLeft' && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };
  
  // Handle pasting OTP
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.slice(0, 6).split('');
      const newOtp = [...otp];
      
      digits.forEach((digit, index) => {
        if (index < 6) {
          newOtp[index] = digit;
        }
      });
      
      setOtp(newOtp);
      
      // Focus the next empty input or the last input
      const nextEmptyIndex = newOtp.findIndex(val => !val);
      if (nextEmptyIndex !== -1 && inputRefs.current[nextEmptyIndex]) {
        inputRefs.current[nextEmptyIndex].focus();
      } else if (inputRefs.current[5]) {
        inputRefs.current[5].focus();
      }
    }
  };
  
  // Handle OTP submission
  const handleSubmit = async () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      AlertService.showError('Invalid OTP', 'Please enter a valid 6-digit code');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const endpoint = fromScreen === 'registration' 
        ? '/api/verify-email' 
        : '/api/verify-login';
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: otpValue,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        AlertService.showError('Verification Failed', data.error || 'Failed to verify OTP');
        setIsLoading(false);
        return;
      }
      
      // Handle successful verification
      if (fromScreen === 'registration') {
        // For registration, we should have received a token
        if (data.token) {
          // Log the user in
          await login(data.token, email, data.refreshToken || null);
          
          AlertService.showSuccess('Success', 'Your account has been verified!');
          navigate('/');
        } else {
          navigate('/email-login');
        }
      } else {
        // For login, we should have received a token
        if (data.token) {
          // Log the user in
          await login(data.token, email, data.refreshToken || null);
          
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
          email,
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
  if (!email && !username) {
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
          onClick={() => navigate(fromScreen === 'registration' ? '/signup' : '/email-login')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="w-full max-w-md">
        <AuthCard
          title="Verify Your Email"
          description={`We've sent a verification code to ${email || username}`}
          className="animate-fade-in"
        >
          <div className="space-y-6">
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <div key={index} className="w-10">
                  <Input
                    ref={el => inputRefs.current[index] = el}
                    value={digit}
                    onChange={e => handleChange(index, e.target.value)}
                    onKeyDown={e => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    className="w-full text-center text-lg font-semibold h-12 border-2"
                    autoComplete="one-time-code"
                  />
                </div>
              ))}
            </div>
            
            <Button
              onClick={handleSubmit}
              disabled={isLoading || otp.join('').length !== 6}
              className="w-full h-12 bg-black hover:bg-gray-800 rounded-full"
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Didn't receive a code?</p>
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
