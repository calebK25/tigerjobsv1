
import React from 'react';
import { Button, buttonVariants } from './button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { cva } from 'class-variance-authority';

// Define custom classes for the accent variant
const accentVariantClasses = "bg-primary/80 text-primary-foreground hover:bg-primary/70";

interface CustomButtonProps extends Omit<React.ComponentProps<typeof Button>, 'variant'> {
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary' | 'accent';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
  animation?: 'none' | 'lift' | 'pulse' | 'scale';
}

const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'default', 
    isLoading = false, 
    animation = 'lift',
    children,
    disabled,
    ...props 
  }, ref) => {
    // Determine animation classes based on the animation prop
    const animationClasses = React.useMemo(() => {
      switch(animation) {
        case 'lift':
          return 'hover:shadow-lg hover:transform hover:-translate-y-1';
        case 'pulse':
          return 'hover:animate-pulse-slow';
        case 'scale':
          return 'hover:scale-105';
        case 'none':
        default:
          return '';
      }
    }, [animation]);

    // Check if we're using the custom accent variant
    const isAccentVariant = variant === 'accent';
    
    // Combine all the class names
    const buttonClassNames = cn(
      'font-medium transition-all duration-300',
      animationClasses,
      isLoading && 'opacity-80 pointer-events-none',
      isAccentVariant && accentVariantClasses,
      className
    );

    return (
      <Button
        ref={ref}
        variant={isAccentVariant ? 'default' : variant}
        size={size}
        disabled={isLoading || disabled}
        className={buttonClassNames}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {typeof children === 'string' ? 'Loading...' : children}
          </>
        ) : (
          children
        )}
      </Button>
    );
  }
);

CustomButton.displayName = 'CustomButton';

export { CustomButton };
