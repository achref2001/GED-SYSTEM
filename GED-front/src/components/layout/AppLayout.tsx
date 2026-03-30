import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useUploadStore } from '../../stores/uploadStore'
import { 
  LayoutDashboard, FolderOpen, Search, Star, Clock, 
  FileStack, Shield, Bell, LogOut, User, Settings, 
  Menu, X, ChevronLeft, ChevronRight 
} from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster } from 'sonner'
import { UploadModal } from '../upload/UploadModal'

const navItems = [
  { to: '/explorer', icon: FolderOpen, label: 'Document Explorer' },
  { to: '/favorites', icon: Star, label: 'Favorites' },
  { to: '/recent', icon: Clock, label: 'Recently Viewed' },
  { to: '/templates', icon: FileStack, label: 'Templates' },
  { to: '/search', icon: Search, label: 'Search' },
]

const adminItems = [
  { to: '/admin', icon: Shield, label: 'Admin Dashboard' },
  { to: '/admin/audit', icon: FileStack, label: 'Audit Logs' },
]

export function AppLayout({ children }: { children?: React.ReactNode }) {
  const { user, logout, hasAnyRole } = useAuthStore()
  const { isModalOpen, closeModal } = useUploadStore()
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      <Toaster position="top-right" richColors />
      
      {/* Upload Modal */}
      <UploadModal />
      
      {/* Sidebar */}
      <div
        className={`relative z-40 flex flex-col bg-slate-900 text-slate-300 border-r border-slate-800 shadow-lg transition-all duration-200 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 gap-3 border-b border-slate-800">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow">
            <FolderOpen className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-xl text-white tracking-tight">
              GED<span className="text-blue-500">System</span>
            </span>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
          <div className="space-y-1">
             {!collapsed && <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Main Menu</p>}
             {navItems.map((item) => (
               <NavLink
                 key={item.to}
                 to={item.to}
                 className={({ isActive }) => cn(
                   "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                   isActive 
                     ? "bg-blue-600/10 text-blue-400 font-semibold" 
                     : "hover:bg-slate-800 hover:text-white"
                 )}
               >
                 {({ isActive }) => (
                   <>
                     <item.icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", isActive ? "text-blue-400" : "group-hover:text-blue-400")} />
                     {!collapsed && <span>{item.label}</span>}
                     {isActive && <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full" />}
                   </>
                 )}
               </NavLink>
             ))}
          </div>

          {hasAnyRole('ADMIN', 'MANAGER') && (
            <div className="space-y-1">
              {!collapsed && <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Management</p>}
              {adminItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                    isActive ? "bg-blue-600/10 text-blue-400 font-semibold" : "hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0 group-hover:text-blue-400" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        {/* User Profile / Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
              <User className="w-5 h-5 text-slate-400" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.full_name || user?.email}</p>
                <p className="text-xs text-slate-500 truncate">{user?.role}</p>
              </div>
            )}
            {!collapsed && (
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-24 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center shadow hover:bg-blue-500 transition-colors z-50 invisible lg:visible"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative h-full">
        {children || <Outlet />}
      </div>
    </div>
  )
}
