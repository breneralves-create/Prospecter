import React from 'react'
import { Layout } from '../components/layout/Layout'
import { Construction } from 'lucide-react'

interface PagePlaceholderProps {
  title: string
}

const PagePlaceholder: React.FC<PagePlaceholderProps> = ({ title }) => {
  return (
    <Layout title={title}>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="p-6 bg-primary-light rounded-full text-primary animate-pulse">
          <Construction size={64} />
        </div>
        <h2 className="text-3xl font-bold text-text-main font-heading">
          {title} em Construção
        </h2>
        <p className="text-text-muted max-w-md">
          Estamos trabalhando para trazer esta funcionalidade em breve. 
          A Fase 1 foca na estrutura base e configurações globais.
        </p>
      </div>
    </Layout>
  )
}

export const Dashboard = () => <PagePlaceholder title="Dashboard" />
export const Leads = () => <PagePlaceholder title="Leads" />
export const Conversas = () => <PagePlaceholder title="Conversas" />
