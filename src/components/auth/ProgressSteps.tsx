
import React from 'react';
import { cn } from '@/lib/utils';

interface Step {
  label: string;
  number: number;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

const ProgressSteps = ({ steps, currentStep, className }: ProgressStepsProps) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between w-full relative">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10" />
        
        {/* Steps */}
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center">
            <div 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                currentStep >= step.number 
                  ? "bg-black text-white" 
                  : "bg-gray-200 text-gray-500"
              )}
            >
              {step.number}
            </div>
            <span 
              className={cn(
                "text-xs mt-1",
                currentStep >= step.number 
                  ? "font-medium text-black" 
                  : "text-gray-500"
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressSteps;
