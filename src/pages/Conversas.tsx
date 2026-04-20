import React, { useState, useEffect, useMemo } from 'react'
import { Search, MessageSquare, Send, Bot, MoreVertical, User, Info, Check, Flame } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { supabase, supabaseAdmin } from '../lib/supabase'
import { Layout } from '../components/layout/Layout'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { ScoreBar } from '../components/ui/ScoreBar'
import { LeadTemperature } from '../components/ui/LeadTemperature'
import { DrawerLead } from '../components/Lead/DrawerLead'
import { LeadModal } from '../components/Lead/LeadModal'
import type { Lead, Interacao } from '../types'

export const Conversas: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [interactions, setInteractions] = useState<Interacao[]>([])
  const [loading, setLoading] = useState(true)
  const [chatLoading, setChatLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null)

  useEffect(() => {
    fetchLeads()
  }, [])

  useEffect(() => {
    if (selectedLead) {
      fetchInteractions(selectedLead.id)
      
      // Real-time subscription for messages
      const channel = supabase.channel(`lead_messages_${selectedLead.id}`)
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'interacoes',
          filter: `lead_id=eq.${selectedLead.id}` 
        }, (payload) => {
          setInteractions(prev => [...prev, payload.new as Interacao])
        })
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [selectedLead])

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabaseAdmin
        .from('leads')
        .select('*')
        .order('horario_contato', { ascending: false })
      
      if (error) throw error
      if (data) {
        setLeads(data as Lead[])
        if (data.length > 0 && !selectedLead) {
          setSelectedLead(data[0] as Lead)
        }
      }
    } catch (err) {
      console.error('Erro ao buscar leads:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchInteractions = async (leadId: string) => {
    setChatLoading(true)
    try {
      const { data, error } = await supabaseAdmin
        .from('interacoes')
        .select('*')
        .eq('lead_id', leadId)
        .order('criado_em', { ascending: true })
      
      if (error) throw error
      if (data) setInteractions(data as Interacao[])
    } catch (err) {
      console.error('Erro ao buscar interações:', err)
    } finally {
      setChatLoading(false)
    }
  }

  const filteredLeads = useMemo(() => {
    return leads.filter(l => 
      (l.nome?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
      (l.whatsapp || '').includes(searchTerm)
    )
  }, [leads, searchTerm])

  const formatWhatsApp = (num: string) => {
    const cleaned = num.replace(/\D/g, '')
    if (cleaned.length === 11) {
      return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`
    }
    return num
  }

  return (
    <Layout title="Monitoramento de Conversas">
      <div className="flex gap-6 h-[calc(100vh-140px)] overflow-hidden">
        {/* Left Sidebar: Leads List */}
        <div className="w-full lg:w-[350px] flex flex-col bg-bg-card border border-border-card rounded-2xl overflow-hidden shrink-0">
          <div className="p-4 border-b border-border-card space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted">Interações Recentes</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <Input 
                className="pl-10 h-10 text-sm" 
                placeholder="Buscar conversa..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto divide-y divide-border-card">
            {loading ? (
              <div className="p-10 text-center animate-pulse space-y-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-bg-base/50 rounded-xl" />)}
              </div>
            ) : filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <div 
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`p-4 flex gap-4 cursor-pointer transition-all hover:bg-bg-base/30 relative ${
                    selectedLead?.id === lead.id ? 'bg-primary/5 before:absolute before:left-0 before:top-4 before:bottom-4 before:w-1 before:bg-primary before:rounded-r-full' : ''
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-bg-base border border-border-card flex items-center justify-center text-primary font-bold overflow-hidden">
                      {lead.nome?.[0] || <User size={20} />}
                    </div>
                    {(lead.score || 0) >= 80 && (
                      <div className="absolute -top-1 -right-1 bg-hot text-white p-1 rounded-full shadow-lg">
                        <Flame size={10} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className={`text-sm font-bold truncate ${selectedLead?.id === lead.id ? 'text-primary' : 'text-text-main'}`}>
                        {lead.nome || formatWhatsApp(lead.whatsapp)}
                      </p>
                      <span className="text-[10px] text-text-muted whitespace-nowrap">
                        {formatDistanceToNow(new Date(lead.horario_contato), { addSuffix: false, locale: ptBR })}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted truncate">
                      {lead.resumo_conversa || 'Iniciando qualificação...'}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                       <LeadTemperature temperature={lead.temperatura} className="text-[8px] py-0 px-1.5" />
                       <span className="text-[10px] font-bold text-text-muted tabular-nums">{lead.score || 0}%</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center opacity-20">
                <MessageSquare size={48} className="mx-auto mb-4" />
                <p className="text-sm">Nenhuma conversa encontrada.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Chat Area */}
        {selectedLead ? (
          <div className="flex-1 flex flex-col bg-bg-card border border-border-card rounded-2xl overflow-hidden shadow-sm relative">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-border-card flex items-center justify-between bg-bg-card/50 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4 cursor-pointer" onClick={() => setIsDrawerOpen(true)}>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {selectedLead.nome?.[0] || <User size={18} />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
                    {selectedLead.nome || formatWhatsApp(selectedLead.whatsapp)}
                    <Badge variant="muted" className="text-[9px] py-0">{selectedLead.origem || 'WhatsApp'}</Badge>
                  </h4>
                  <div className="flex items-center gap-3 mt-0.5">
                    <ScoreBar score={selectedLead.score || 0} className="w-16 h-1" />
                    <span className="text-[10px] font-bold text-text-muted">{selectedLead.score || 0}% de Qualificação</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="p-2" onClick={() => setIsDrawerOpen(true)}>
                  <Info size={20} className="text-text-muted" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <MoreVertical size={20} className="text-text-muted" />
                </Button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col bg-bg-base/10">
              {/* IA Summary Header */}
              {selectedLead.resumo_conversa && (
                <div className="mx-auto max-w-md w-full bg-primary/5 border border-primary/20 rounded-2xl p-4 flex gap-4 items-start relative animate-in fade-in duration-500">
                  <div className="p-2 bg-primary rounded-xl text-white shrink-0">
                    <Bot size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-1">Resumo da IA</p>
                    <p className="text-xs text-text-main leading-relaxed italic">
                      "{selectedLead.resumo_conversa}"
                    </p>
                  </div>
                </div>
              )}

              {/* Day Divider */}
              <div className="flex items-center gap-4 py-4">
                <div className="flex-1 h-px bg-border-card" />
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">
                  {format(new Date(selectedLead.horario_contato), "dd 'de' MMMM", { locale: ptBR })}
                </span>
                <div className="flex-1 h-px bg-border-card" />
              </div>

              {chatLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                       <div className="h-12 w-48 bg-bg-base rounded-2xl animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : interactions.length > 0 ? (
                interactions.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col ${
                      msg.tipo === 'mensagem_lead' ? 'items-end' : 
                      msg.tipo === 'nota_vendedor' ? 'items-center' : 'items-start'
                    }`}
                  >
                    <div className="flex items-end gap-2 max-w-[80%]">
                      {msg.tipo === 'resposta_agente' && (
                        <div className="w-6 h-6 rounded-full bg-bg-base border border-border-card flex items-center justify-center text-primary shrink-0 mb-1">
                          <Bot size={12} />
                        </div>
                      )}
                      
                      <div className={`
                        px-4 py-2.5 rounded-2xl text-sm shadow-sm relative
                        ${msg.tipo === 'mensagem_lead' ? 'bg-primary text-white rounded-tr-none' : 
                          msg.tipo === 'nota_vendedor' ? 'bg-warning/10 border border-warning/20 text-warning text-center italic rounded-lg w-full max-w-lg' :
                          'bg-bg-card text-text-main border border-border-card rounded-tl-none'}
                      `}>
                        {msg.conteudo}
                        <div className={`
                          text-[9px] mt-1 flex items-center gap-1 opacity-60
                          ${msg.tipo === 'mensagem_lead' ? 'justify-end text-white' : 'justify-start text-text-muted'}
                        `}>
                          {format(new Date(msg.criado_em), 'HH:mm')}
                          {msg.tipo === 'resposta_agente' && <Check size={10} className="text-success" />}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-text-muted opacity-30 gap-4">
                  <MessageSquare size={64} />
                  <p className="text-sm">Nenhuma mensagem registrada no log.</p>
                </div>
              )}
            </div>

            {/* Input Overlay (Read Only / Forwarding Info) */}
            <div className="p-4 bg-bg-card border-t border-border-card flex items-center gap-4">
              <div className="flex-1 bg-bg-base/50 rounded-full px-6 py-3 border border-border-card text-text-muted text-sm italic">
                A IA está monitorando esta conversa. Encaminhe ao vendedor para assumir.
              </div>
              <Button disabled className="rounded-full w-12 h-12 p-0 flex items-center justify-center">
                <Send size={20} />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-bg-card border border-border-card rounded-2xl flex flex-col items-center justify-center opacity-50 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
             <div className="relative text-center space-y-4">
               <div className="w-20 h-20 bg-bg-base rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-border-card">
                 <MessageSquare size={32} className="text-text-muted" />
               </div>
               <div className="space-y-1">
                 <h4 className="text-lg font-bold text-text-main">Escolha uma conversa</h4>
                 <p className="text-sm text-text-muted">Selecione um lead na lista lateral para monitorar o atendimento da IA.</p>
               </div>
             </div>
          </div>
        )}
      </div>

      <DrawerLead 
        lead={selectedLead}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onUpdate={fetchLeads}
        onEdit={(lead) => {
          setLeadToEdit(lead)
          setIsModalOpen(true)
          setIsDrawerOpen(false)
        }}
      />

      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchLeads}
        lead={leadToEdit}
      />
    </Layout>
  )
}
