import React from 'react';
import { cn } from '@/lib/utils';

export interface NoirCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'flat' | 'elevated' | 'interactive';
  hover?: boolean;
  onClick?: () => void;
}

/**
 * NoirCard - Foundation card component for the Intelligent SPM noir aesthetic
 *
 * Features:
 * - Black background with purple accent border
 * - Halftone texture overlay
 * - Purple glow effect on hover (interactive variant)
 * - Three variants: flat, elevated, interactive
 *
 * Usage:
 * ```tsx
 * <NoirCard variant="interactive" hover>
 *   <h3>Card Title</h3>
 *   <p>Card content</p>
 * </NoirCard>
 * ```
 */
export function NoirCard({
  children,
  className,
  variant = 'flat',
  hover = false,
  onClick,
}: NoirCardProps) {
  const isClickable = Boolean(onClick);

  const baseStyles = [
    'relative',
    'bg-spm-black-soft',
    'border border-spm-purple-dark/30',
    'rounded-lg',
    'overflow-hidden',
    'transition-all duration-300',
  ];

  const variantStyles = {
    flat: [],
    elevated: ['shadow-noir'],
    interactive: [
      'shadow-noir',
      'cursor-pointer',
      hover && 'hover:shadow-purple-glow',
      hover && 'hover:border-spm-purple',
      hover && 'hover:scale-[1.02]',
    ],
  };

  const clickableStyles = isClickable
    ? ['cursor-pointer', 'active:scale-[0.98]']
    : [];

  return (
    <div
      className={cn(
        ...baseStyles,
        ...variantStyles[variant],
        ...clickableStyles,
        className
      )}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      {/* Halftone texture overlay */}
      <div
        className="absolute inset-0 halftone opacity-10 pointer-events-none"
        aria-hidden="true"
      />

      {/* Purple accent gradient (subtle) */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-spm-purple/5 via-transparent to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * NoirCardHeader - Header section for NoirCard
 */
export function NoirCardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'px-6 py-4 border-b border-spm-purple-dark/20',
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * NoirCardContent - Main content area for NoirCard
 */
export function NoirCardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('px-6 py-4', className)}>{children}</div>;
}

/**
 * NoirCardFooter - Footer section for NoirCard
 */
export function NoirCardFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'px-6 py-4 border-t border-spm-purple-dark/20 bg-spm-black/30',
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * NoirCardTitle - Typography component for card titles
 */
export function NoirCardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        'text-2xl font-headline text-spm-purple mb-2',
        className
      )}
    >
      {children}
    </h3>
  );
}

/**
 * NoirCardDescription - Typography component for card descriptions
 */
export function NoirCardDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn('text-gray-300 text-sm leading-relaxed', className)}>
      {children}
    </p>
  );
}
