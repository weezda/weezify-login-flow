
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface AuthCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const AuthCard = ({ title, description, children, footer, className }: AuthCardProps) => {
  return (
    <Card className={cn("w-full max-w-md shadow-lg border-2 bg-white", className)}>
      <CardHeader className="space-y-2 pb-6">
        <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
        {description && <CardDescription className="text-center text-gray-500">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pb-6">{children}</CardContent>
      {footer && <CardFooter className="border-t pt-6">{footer}</CardFooter>}
    </Card>
  );
};

export default AuthCard;
