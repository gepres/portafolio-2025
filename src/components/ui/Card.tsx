import type { ReactNode, HTMLAttributes } from 'react';
import { cn } from '../../lib/utils/helpers';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
}

export const Card = ({ children, className, hover = true, glass = true, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'rounded-xl p-6',
        glass && 'glass',
        hover && 'glass-hover cursor-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
