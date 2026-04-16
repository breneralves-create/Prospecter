import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'success' | 'hot' | 'warm' | 'cold' | 'muted' | 'info' | 'warning' | 'danger'
  icon?: React.ReactNode
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'muted', 
  icon, 
  className = '' 
}) => {
  const variants: Record<string, string> = {
    primary: 'bg-primary-light text-primary',
    success: 'bg-primary-light text-success',
    hot: 'bg-hot-light text-hot',
    warm: 'bg-warm-light text-warm',
    cold: 'bg-cold-light text-cold',
    muted: 'bg-border-card text-text-muted',
    info: 'bg-blue-500/10 text-blue-400',
    warning: 'bg-yellow-500/10 text-yellow-400',
    danger: 'bg-red-500/10 text-red-400',
  }

  return (
    <span className={`
      inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold
      rounded-badge transition-colors duration-200
      ${variants[variant]}
      ${className}
    `}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  )
}
