
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/auth/Logo';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white p-6 md:p-8">
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-8 animate-fade-in">
        <div className="space-y-6">
          <Logo size="lg" className="mx-auto" />
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold">All your Documents.</h1>
            <h2 className="text-3xl md:text-4xl font-bold">works Smarter with Weez.</h2>
          </div>
        </div>
        
        <div className="w-full max-w-xs space-y-4 mt-12">
          <Button 
            onClick={() => navigate('/signup')} 
            className="w-full h-12 bg-black hover:bg-gray-800 text-white rounded-full"
          >
            Sign up for free
          </Button>
          <Button 
            onClick={() => navigate('/login')} 
            className="w-full h-12 bg-black hover:bg-gray-800 text-white rounded-full"
          >
            Log In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
