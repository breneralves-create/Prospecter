import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Flame,
  MessageSquare, 
  Settings, 
  Code, 
  LogOut, 
  Sun, 
  Moon,
  ChevronLeft
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useCompany } from '../../contexts/CompanyContext'
import { Avatar } from '../ui/Avatar'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { userProfile, signOut, isAdmin } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { company } = useCompany()

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Leads', icon: Users, path: '/leads' },
    { label: 'Funil', icon: Flame, path: '/funil' },
    { label: 'Conversas', icon: MessageSquare, path: '/conversas' },
    ...(isAdmin ? [{ label: 'Configurações', icon: Settings, path: '/configuracoes' }] : []),
    { label: 'Doc. API', icon: Code, path: '/documentacao-api' }
  ]

  const SidebarItem = ({ item }: { item: typeof navItems[0] }) => {
    const Icon = item.icon
    return (
      <NavLink
        to={item.path}
        onClick={() => {
          if (window.innerWidth < 1024) onClose()
        }}
        className={({ isActive }) => `
          flex items-center gap-3 px-4 py-3 rounded-button transition-all duration-200 group
          ${isActive 
            ? 'bg-sidebar-active text-primary border-l-4 border-primary rounded-l-none' 
            : 'text-text-muted hover:text-text-main hover:bg-primary-light'}
        `}
      >
        <Icon size={20} className="transition-transform duration-200 group-hover:scale-110" />
        <span className="font-medium font-sans">{item.label}</span>
      </NavLink>
    )
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-bg-sidebar border-r border-border-card
        flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top: Branding */}
        <div className="p-6 flex flex-col items-center gap-4 text-center">
          <button 
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 p-2 text-text-muted hover:text-text-main"
          >
            <ChevronLeft size={24} />
          </button>

          {company?.logo_url ? (
            <img 
              src={company.logo_url} 
              alt={company.nome} 
              className="max-h-20 w-auto object-contain transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center text-primary text-3xl font-bold font-heading shadow-lg shadow-primary/10">
              {company?.nome?.[0] || 'L'}
            </div>
          )}
          <h2 className="text-xl font-bold text-text-main font-heading leading-tight mt-1 max-w-[200px] break-words">
            {company?.nome || 'Lead Panel'}
          </h2>
          <div className="flex items-center gap-2 mt-[-4px]">
            <div className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-blink-fast" />
            <span className="text-[10px] font-black text-success uppercase tracking-[0.25em] leading-none opacity-80 animate-pulse">
              AO VIVO
            </span>
          </div>
        </div>

        {/* Middle: Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto mt-2">
          {navItems.map(item => (
            <SidebarItem key={item.path} item={item} />
          ))}
        </nav>

        {/* Bottom: Profile & Actions */}
        <div className="p-4 bg-bg-base/20 border-t border-border-card space-y-4">
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar src={undefined} name={userProfile?.name} size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-main truncate">
                {userProfile?.name || 'Usuário'}
              </p>
              <p className="text-xs text-text-muted truncate capitalize">
                {userProfile?.role || 'vendedor'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={toggleTheme}
              className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-button bg-bg-card border border-border-card text-text-muted hover:text-text-main hover:bg-primary-light transition-all"
              title={theme === 'dark' ? 'Mudar para Light Mode' : 'Mudar para Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              <span className="text-xs font-medium uppercase tracking-wider">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
            <button
              onClick={() => signOut()}
              className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-button bg-error/10 border border-error/20 text-error hover:bg-error/20 transition-all"
              title="Sair do sistema"
            >
              <LogOut size={18} />
              <span className="text-xs font-medium uppercase tracking-wider">Sair</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
