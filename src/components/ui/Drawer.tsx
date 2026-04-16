import React, { useEffect } from 'react'
import { X } from 'lucide-react'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  width?: string
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  width = 'w-full lg:w-[45%]'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`
          fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
      />
      
      {/* Content */}
      <div className={`
        fixed top-0 right-0 z-50 h-full ${width} bg-bg-card border-l border-border-card 
        shadow-2xl transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className="px-6 py-6 flex items-center justify-between border-b border-border-card">
          {title ? (
            <h3 className="text-xl font-bold text-text-main font-heading">{title}</h3>
          ) : <div />}
          <button 
            onClick={onClose}
            className="p-2 text-text-muted hover:text-text-main hover:bg-primary-light rounded-button transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 bg-bg-base/30 border-t border-border-card shrink-0">
            {footer}
          </div>
        )}
      </div>
    </>
  )
}
