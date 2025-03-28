
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/auth/Logo';
import { ArrowRight, FileText, Calendar, Settings } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center px-6 py-12 md:px-12 lg:px-24">
        <div className="w-full md:w-1/2 space-y-8 animate-fade-in">
          <div className="space-y-2">
            <Logo size="lg" className="mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              All your Documents
              <span className="text-blue-600">.</span>
            </h1>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Work Smarter with <span className="text-blue-600">Weez</span>
              <span className="text-blue-600">.</span>
            </h2>
            <p className="mt-6 text-lg text-gray-600 max-w-md">
              Simplify your workflow, enhance productivity, and collaborate seamlessly with our intuitive document management system.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              onClick={() => navigate('/signup')} 
              className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium"
            >
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              onClick={() => navigate('/login')} 
              variant="outline"
              className="h-12 px-8 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full font-medium"
            >
              Log In
            </Button>
          </div>
        </div>
        
        <div className="hidden md:block w-full md:w-1/2 pl-8 animate-fade-in">
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-64 h-64 bg-blue-100 rounded-full opacity-50"></div>
            <div className="absolute -bottom-12 -right-12 w-72 h-72 bg-blue-200 rounded-full opacity-30"></div>
            
            <div className="relative z-10 bg-white rounded-xl shadow-xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <FileText className="text-white h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h3 className="font-bold">Document Management</h3>
                  <p className="text-sm text-gray-600">Store and organize your files</p>
                </div>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full mb-2"></div>
              <div className="h-2 w-3/4 bg-gray-100 rounded-full mb-2"></div>
              <div className="h-2 w-1/2 bg-gray-100 rounded-full"></div>
            </div>
            
            <div className="relative z-20 bg-white rounded-xl shadow-xl p-6 mt-6 ml-12 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <Calendar className="text-white h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h3 className="font-bold">Smart Calendar</h3>
                  <p className="text-sm text-gray-600">Plan your schedule efficiently</p>
                </div>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full mb-2"></div>
              <div className="h-2 w-2/3 bg-gray-100 rounded-full mb-2"></div>
              <div className="h-2 w-1/3 bg-gray-100 rounded-full"></div>
            </div>
            
            <div className="relative z-30 bg-white rounded-xl shadow-xl p-6 mt-6 -ml-4 transform rotate-1 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                  <Settings className="text-white h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h3 className="font-bold">Advanced Settings</h3>
                  <p className="text-sm text-gray-600">Customize to your needs</p>
                </div>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full mb-2"></div>
              <div className="h-2 w-1/2 bg-gray-100 rounded-full mb-2"></div>
              <div className="h-2 w-3/4 bg-gray-100 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="py-6 text-center text-gray-500 text-sm">
        <p>© 2024 Weez. All rights reserved.</p>
      </div>
    </div>
  );
};

export default LandingPage;
