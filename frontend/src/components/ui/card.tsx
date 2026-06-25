import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`bg-card text-card-foreground rounded-lg border border-border p-4 shadow-sm ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }: CardProps) => {
  return <div className={`mb-4 pb-4 border-b border-border ${className}`}>{children}</div>;
};

export const CardTitle = ({ children, className = '' }: CardProps) => {
  return <h2 className={`text-2xl font-bold ${className}`}>{children}</h2>;
};

export const CardDescription = ({ children, className = '' }: CardProps) => {
  return <p className={`text-muted-foreground text-sm ${className}`}>{children}</p>;
};

export const CardContent = ({ children, className = '' }: CardProps) => {
  return <div className={className}>{children}</div>;
};
