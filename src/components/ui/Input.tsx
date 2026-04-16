import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-sm font-medium text-text-muted px-1 font-sans">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full bg-bg-card border border-border-card text-text-main px-4 py-2.5 
              rounded-input transition-all duration-200 outline-none
              placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary/20
              disabled:opacity-50 disabled:cursor-not-allowed
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-error/50 focus:border-error focus:ring-error/20' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-error mt-1 px-1">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
