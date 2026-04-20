import React, { useState, useEffect } from 'react'
import { supabaseAdmin } from '../../lib/supabase'
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
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nome: '',
    whatsapp: '',
    produto_interesse: '',
    origem: 'whatsapp_direto',
    cidade: '',
    observacoes_agente: ''
  })

  useEffect(() => {
    setError(null)
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
    setError(null)

    // Validação básica local antes de enviar
    const onlyNumbers = formData.whatsapp.replace(/\D/g, '')
    if (onlyNumbers.length < 8 && !formData.whatsapp.includes('@')) {
       setError('O WhatsApp parece inválido. Insira apenas números com DDD.')
       setLoading(false)
       return
    }

    try {
      // Verifica se a URL do Supabase é válida ou se é um placeholder
      if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder')) {
        throw new Error('As chaves do Supabase não foram configuradas na Vercel. Adicione VITE_SUPABASE_URL no painel do projeto.')
      }

      const payload = {
        ...formData,
        status: lead ? lead.status : 'novo_contato',
        horario_contato: lead?.horario_contato ?? new Date().toISOString(),
        encaminhado_vendedor: lead ? lead.encaminhado_vendedor : false
      }

      console.log('Dados a serem enviados:', payload)

      const response: any = lead 
        ? await supabaseAdmin.from('leads').update(payload).eq('id', lead.id).select().single()
        : await supabaseAdmin.from('leads').insert([payload]).select().single()

      if (response.error) {
        console.error('Erro retornado pelo Supabase:', response.error)
        // Se o erro for que a coluna não existe, a mensagem será clara aqui
        throw new Error(response.error.message || 'Erro ao salvar dados.')
      }

      console.log('Sucesso ao salvar!')
      onSuccess()
      onClose()
    } catch (err: any) {
      console.error('Falha no cadastro de lead:', err)
      setError(err.message)
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
        {error && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-error text-xs font-bold animate-shake">
            ⚠️ {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase text-text-muted mb-2">WhatsApp / Telefone *</label>
            <Input
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              placeholder="Ex: 31999998888 (Apenas números)"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase text-text-muted mb-2">Nome Completo do Cliente</label>
            <Input
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Digite o nome completo"
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
              placeholder="Ex: Mentoria, Produto X..."
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
              placeholder="Observações complementares..."
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
