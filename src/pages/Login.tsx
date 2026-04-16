import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCompany } from '../contexts/CompanyContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { Mail, Lock, AlertCircle } from 'lucide-react'

export const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const { signIn } = useAuth()
  const { company } = useCompany()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await signIn(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Credenciais inválidas ou erro de conexão.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center mb-8 gap-4">
          {company?.logo_url ? (
            <img src={company.logo_url} alt={company.nome} className="max-h-20 w-auto" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center text-primary text-2xl font-bold font-heading">
              {company?.nome?.[0] || 'L'}
            </div>
          )}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-text-main font-heading">
              Painel de Leads
            </h1>
            <p className="text-text-muted mt-2">
              Acesse sua conta para continuar
            </p>
          </div>
        </div>

        <Card className="border-t-4 border-t-primary">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-error/10 border border-error/20 p-4 rounded-input flex items-start gap-3 text-error">
                <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              icon={<Mail size={20} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={20} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button 
              type="submit" 
              className="w-full" 
              isLoading={isLoading}
              size="lg"
            >
              Entrar
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-text-muted mt-6">
          Esqueceu sua senha? Entre em contato com o suporte.
        </p>
      </div>
    </div>
  )
}
