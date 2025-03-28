
import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface OtpInputProps {
  otp: string[];
  setOtp: React.Dispatch<React.SetStateAction<string[]>>;
  length?: number;
  className?: string;
}

const OtpInput = ({ otp, setOtp, length = 6, className }: OtpInputProps) => {
  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Combine the individual OTP digits into a single string for the InputOTP component
  const otpValue = otp.join("");

  const handleValueChange = (value: string) => {
    // Convert the string back to an array of individual digits
    const newOtp = value.split("").concat(Array(length - value.length).fill(""));
    setOtp(newOtp.slice(0, length));
  };

  return (
    <div className={cn("flex justify-center w-full", className)}>
      <InputOTP
        maxLength={length}
        value={otpValue}
        onChange={handleValueChange}
        className="gap-3"
        pattern="^[0-9]+$"
      >
        <InputOTPGroup>
          {Array.from({ length }).map((_, index) => (
            <InputOTPSlot 
              key={index} 
              index={index} 
              className="w-12 h-14 text-xl font-bold border-2 border-gray-300 focus:border-black transition-colors rounded-lg overflow-hidden" 
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
};

export default OtpInput;
