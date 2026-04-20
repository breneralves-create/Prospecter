import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  icon?: React.ReactNode
  as?: string // permite renderizar como span para labels de upload
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  icon,
  className = '',
  disabled,
  as: Tag,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'

  const variants: Record<string, string> = {
    primary: 'bg-primary text-[#0F1117] hover:opacity-90 shadow-sm',
    secondary: 'bg-transparent border border-border-card text-text-main hover:bg-primary/5',
    ghost: 'bg-transparent text-text-muted hover:text-text-main hover:bg-primary/5',
    danger: 'bg-error/10 border border-error/20 text-error hover:bg-error/20',
    outline: 'bg-transparent border border-border-card text-text-main hover:bg-primary/5',
  }

  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5',
    lg: 'px-8 py-3.5 text-lg',
  }

  const rounded = 'rounded-button'

  const combinedClass = `${baseStyles} ${variants[variant] ?? variants.primary} ${sizes[size]} ${rounded} ${className}`

  const content = (
    <>
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : icon ?? null}
      {children}
    </>
  )

  if (Tag) {
    return <span className={combinedClass}>{content}</span>
  }

  return (
    <button
      className={combinedClass}
      disabled={disabled || isLoading}
      {...props}
    >
      {content}
    </button>
  )
}
