
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo = ({ size = 'md', className }: LogoProps) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };
  
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={cn(
        "rounded-full border-2 border-black overflow-hidden flex items-center justify-center bg-black text-white font-bold",
        sizeClasses[size]
      )}>
        <span className="text-2xl">W</span>
      </div>
    </div>
  );
};

export default Logo;
