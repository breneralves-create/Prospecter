import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'primary'
  isLoading?: boolean
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Deletar',
  cancelText = 'Cancelar',
  variant = 'danger',
  isLoading = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className={`p-4 rounded-full ${
          variant === 'danger' ? 'bg-error/10 text-error shadow-[0_0_20px_rgba(255,77,77,0.2)]' : 
          variant === 'warning' ? 'bg-warning/10 text-warning shadow-[0_0_20px_rgba(255,149,0,0.2)]' :
          'bg-primary/10 text-primary shadow-[0_0_20px_rgba(0,200,150,0.2)]'
        }`}>
          <AlertTriangle size={48} />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-text-main font-heading">{title}</h3>
          <p className="text-sm text-text-muted leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex w-full gap-3 pt-2">
          <Button 
            variant="secondary" 
            className="flex-1 h-12 text-sm uppercase tracking-widest font-black" 
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button 
            variant={variant === 'danger' ? 'danger' : 'primary'} 
            className="flex-1 h-12 text-sm uppercase tracking-widest font-black shadow-lg" 
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
