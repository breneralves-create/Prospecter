import React from 'react'

interface CardProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  footer?: React.ReactNode
  headerAction?: React.ReactNode
  className?: string
  noPadding?: boolean
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  footer,
  headerAction,
  className = '',
  noPadding = false
}) => {
  return (
    <div className={`
      bg-bg-card border border-border-card rounded-card shadow-card overflow-hidden
      ${className}
    `}>
      {(title || subtitle || headerAction) && (
        <div className="px-6 py-5 border-b border-border-card flex items-center justify-between">
          <div className="space-y-0.5">
            {title && <h3 className="text-xl font-bold text-text-main font-heading">{title}</h3>}
            {subtitle && <p className="text-sm text-text-muted">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 bg-bg-base/50 border-t border-border-card">
          {footer}
        </div>
      )}
    </div>
  )
}
