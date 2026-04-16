import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { Lead } from '../../types'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface LeadModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  lead?: Lead | null
}

const ORIGENS: Array<{label: string; value: string}> = [
  { label: 'WhatsApp Direto', value: 'whatsapp_direto' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'Google', value: 'google' },
  { label: 'TikTok', value: 'tiktok' },
  { label: 'Site', value: 'site' },
  { label: 'Indicação', value: 'indicacao' },
  { label: 'Outro', value: 'outro' },
]

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  lead
}) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    whatsapp: '',
    produto_interesse: '',
    origem: 'whatsapp_direto',
    cidade: '',
    observacoes_agente: ''
  })

  useEffect(() => {
    if (lead) {
      setFormData({
        nome: lead.nome || '',
        whatsapp: lead.whatsapp || '',
        produto_interesse: lead.produto_interesse || '',
        origem: lead.origem || 'whatsapp_direto',
        cidade: lead.cidade || '',
        observacoes_agente: lead.observacoes_agente || ''
      })
    } else {
      setFormData({
        nome: '',
        whatsapp: '',
        produto_interesse: '',
        origem: 'whatsapp_direto',
        cidade: '',
        observacoes_agente: ''
      })
    }
  }, [lead, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        status: lead ? lead.status : 'novo_contato',
        horario_contato: lead ? lead.horario_contato : new Date().toISOString(),
        encaminhado_vendedor: lead ? lead.encaminhado_vendedor : false
      }

      if (lead) {
        const { error } = await supabase
          .from('leads')
          .update(payload)
          .eq('id', lead.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('leads')
          .insert([payload])
        if (error) throw error
      }

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Erro ao salvar lead:', error)
      alert('Erro ao salvar lead. Verifique os dados e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={lead ? 'Editar Lead' : 'Cadastrar Novo Lead'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase text-text-muted mb-2">WhatsApp *</label>
            <Input
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              placeholder="Ex: 5527999990000"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase text-text-muted mb-2">Nome Completo</label>
            <Input
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Nome do lead"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-text-muted mb-2">Canal de Origem</label>
            <select
              name="origem"
              value={formData.origem}
              onChange={handleChange}
              className="w-full bg-bg-base border border-border-card rounded-button px-4 py-2.5 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
            >
              {ORIGENS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-text-muted mb-2">Produto de Interesse</label>
            <Input
              name="produto_interesse"
              value={formData.produto_interesse}
              onChange={handleChange}
              placeholder="Ex: Produto X"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase text-text-muted mb-2">Cidade</label>
            <Input
              name="cidade"
              value={formData.cidade}
              onChange={handleChange}
              placeholder="Cidade do lead"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase text-text-muted mb-2">Observações Iniciais</label>
            <textarea
              name="observacoes_agente"
              value={formData.observacoes_agente}
              onChange={handleChange}
              rows={3}
              className="w-full bg-bg-base border border-border-card rounded-button px-4 py-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none text-sm"
              placeholder="Digite observações importantes sobre o lead..."
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-border-card">
          <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" className="flex-1" isLoading={loading}>
            {lead ? 'Salvar Alterações' : 'Cadastrar Lead'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
