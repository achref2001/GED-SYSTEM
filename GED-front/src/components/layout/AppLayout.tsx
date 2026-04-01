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
import { 
  ChevronDown, 
  Tag as TagIcon,
  FileType
} from 'lucide-react'

const navItems = [
  { to: '/explorer', icon: FolderOpen, label: 'Document Explorer' },
  { to: '/favorites', icon: Star, label: 'Favorites' },
  { to: '/recent', icon: Clock, label: 'Recently Viewed' },
  { to: '/templates', icon: FileStack, label: 'Templates' },
  { to: '/settings/tags', icon: TagIcon, label: 'Tags' },
]

const adminItems = [
  { to: '/admin', icon: Shield, label: 'Admin Dashboard' },
  { to: '/admin/audit', icon: FileStack, label: 'Audit Logs' },
]

export function AppLayout({ children }: { children?: React.ReactNode }) {
  const { user, logout, hasAnyRole, hasAnyPermission } = useAuthStore()
  const { isModalOpen, closeModal } = useUploadStore()
  const [collapsed, setCollapsed] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-mesh font-sans text-foreground overflow-hidden">
      <Toaster position="top-right" richColors />
      
      {/* Upload Modal */}
      <UploadModal />
      
      {/* Sidebar */}
      <motion.div
        animate={{ width: collapsed ? 80 : 280 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative z-40 flex flex-col bg-sidebar-background text-sidebar-foreground border-r border-sidebar-accent/50 shadow-2xl shadow-indigo-500/10"
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 gap-4 border-b border-sidebar-accent/30 overflow-hidden">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
            <FolderOpen className="w-6 h-6 text-white" />
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-bold text-xl text-white tracking-tight whitespace-nowrap"
              >
                GED<span className="text-indigo-400">Sphere</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-8 px-4 space-y-10 scrollbar-premium">
          <div className="space-y-1.5">
             <AnimatePresence mode="wait">
               {!collapsed && (
                 <motion.p 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="px-4 text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4"
                 >
                   Workspace
                 </motion.p>
               )}
             </AnimatePresence>
             {navItems.map((item) => (
               <NavLink
                 key={item.to}
                 to={item.to}
                 className={({ isActive }) => cn(
                    "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group relative",
                    isActive 
                      ? "bg-indigo-500/10 text-indigo-600 font-semibold shadow-sm" 
                      : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900 shadow-none border border-transparent hover:border-slate-200/50"
                 )}
               >
                 {({ isActive }) => (
                   <>
                     <item.icon className={cn("w-5 h-5 flex-shrink-0 transition-all duration-300", 
                       isActive ? "text-indigo-600 scale-110" : "group-hover:text-indigo-600 group-hover:scale-110"
                     )} />
                     {!collapsed && (
                       <motion.span
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         className="text-sm tracking-wide"
                       >
                         {item.label}
                       </motion.span>
                     )}
                     {isActive && (
                       <motion.div 
                         layoutId="activeNavBackground"
                         className="absolute inset-0 bg-indigo-500/10 rounded-2xl -z-10"
                       />
                     )}
                     {isActive && (
                       <motion.div 
                         layoutId="activeNavIndicator"
                         className="absolute left-[-4px] w-1.5 h-6 bg-indigo-500 rounded-r-full shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                       />
                     )}
                   </>
                 )}
               </NavLink>
             ))}
          </div>

          {hasAnyRole('ADMIN', 'MANAGER') && (
            <div className="space-y-1.5">
              {!collapsed && <p className="px-4 text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Administration</p>}
              {adminItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => cn(
                    "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group",
                    isActive ? "bg-emerald-500/10 text-emerald-600 font-bold shadow-sm" : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900"
                  )}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className={cn("w-5 h-5 flex-shrink-0 transition-transform duration-300", isActive ? "text-emerald-600 scale-110" : "group-hover:text-emerald-600 group-hover:scale-110")} />
                      {!collapsed && <span className="text-sm tracking-wide">{item.label}</span>}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          )}

          {/* System Settings Section */}
          <div className="space-y-1.5">
            {!collapsed && (
              <p className="px-4 text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">
                Configuration
              </p>
            )}
            
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={cn(
                "w-full flex items-center justify-between gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group border border-transparent",
                isSettingsOpen ? "bg-slate-100 text-slate-900 border-slate-200/50 shadow-sm" : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900"
              )}
            >
              <div className="flex items-center gap-4">
                <Settings className={cn("w-5 h-5 flex-shrink-0 transition-all duration-300", 
                  isSettingsOpen ? "text-indigo-400 scale-110" : "group-hover:text-amber-400 group-hover:scale-110"
                )} />
                {!collapsed && <span className="text-sm tracking-wide font-medium">Settings</span>}
              </div>
              {!collapsed && (
                <motion.div
                  animate={{ rotate: isSettingsOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={14} className="text-slate-500" />
                </motion.div>
              )}
            </button>

            <AnimatePresence>
              {isSettingsOpen && !collapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-white/[0.02] rounded-2xl mx-1"
                >
                  <div className="py-2 pl-4 space-y-1">
                    <NavLink
                      to="/settings"
                      className={({ isActive }) => cn(
                        "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group",
                        isActive
                          ? "bg-indigo-500/10 text-indigo-600 font-bold"
                          : "text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm"
                      )}
                    >
                      <LayoutDashboard size={14} className="group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-semibold tracking-wide">Overview</span>
                    </NavLink>
                    <NavLink
                      to="/settings/tags"
                      className={({ isActive }) => cn(
                        "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group",
                        isActive 
                          ? "bg-indigo-500/10 text-indigo-600 font-bold" 
                          : "text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm"
                      )}
                    >
                      <TagIcon size={14} className="group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-semibold tracking-wide">Manage Tags</span>
                    </NavLink>
                    <NavLink
                      to="/settings/extensions"
                      className={({ isActive }) => cn(
                        "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group",
                        isActive
                          ? "bg-indigo-500/10 text-indigo-600 font-bold"
                          : "text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm"
                      )}
                    >
                      <FileType size={14} className="group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-semibold tracking-wide">Allowed Extensions</span>
                    </NavLink>
                    {hasAnyPermission('users.manage_roles') && (
                      <NavLink
                        to="/settings/rbac"
                        className={({ isActive }) => cn(
                          "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group",
                          isActive
                            ? "bg-indigo-500/10 text-indigo-600 font-bold"
                            : "text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm"
                        )}
                      >
                        <Shield size={14} className="group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-semibold tracking-wide">RBAC Roles</span>
                      </NavLink>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* If collapsed, show tags icon as a standalone button */}
            {collapsed && isSettingsOpen && (
              <div className="space-y-1">
                <NavLink
                  to="/settings/tags"
                  className={({ isActive }) => cn(
                    "flex items-center justify-center w-full py-3 transition-colors",
                    isActive ? "text-indigo-600 bg-indigo-50" : "text-slate-500 hover:text-indigo-600 hover:bg-slate-50"
                  )}
                  title="Manage Tags"
                >
                  <TagIcon size={20} />
                </NavLink>
                <NavLink
                  to="/settings/extensions"
                  className={({ isActive }) => cn(
                    "flex items-center justify-center w-full py-3 transition-colors",
                    isActive ? "text-indigo-600 bg-indigo-50" : "text-slate-500 hover:text-indigo-600 hover:bg-slate-50"
                  )}
                  title="Allowed Extensions"
                >
                  <FileType size={20} />
                </NavLink>
                {hasAnyPermission('users.manage_roles') && (
                  <NavLink
                    to="/settings/rbac"
                    className={({ isActive }) => cn(
                      "flex items-center justify-center w-full py-3 transition-colors",
                      isActive ? "text-indigo-600 bg-indigo-50" : "text-slate-500 hover:text-indigo-600 hover:bg-slate-50"
                    )}
                    title="RBAC Roles"
                  >
                    <Shield size={20} />
                  </NavLink>
                )}
              </div>
            )}
          </div>
        </div>

        {/* User Profile / Logout */}
        <div className="p-4 border-t border-sidebar-accent/30 bg-sidebar-background/50 backdrop-blur-sm">
          <div className={cn("flex items-center gap-4 p-2 rounded-2xl bg-white/5 border border-white/5", collapsed ? "justify-center" : "px-3")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-800 flex items-center justify-center border border-white/5 shadow-inner shrink-0">
              <User className="w-5 h-5 text-indigo-400" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.full_name || 'User Profile'}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate">{user?.role || 'Member'}</p>
              </div>
            )}
            {!collapsed && (
              <button 
                onClick={handleLogout}
                className="p-2.5 hover:bg-rose-500/10 hover:text-rose-400 text-slate-500 rounded-xl transition-all duration-300 group"
                title="Sign out"
              >
                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-24 w-7 h-7 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-xl shadow-indigo-500/40 hover:bg-indigo-500 transition-all duration-300 z-50 invisible lg:visible border border-white/10 group active:scale-90"
        >
          {collapsed ? <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" /> : <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />}
        </button>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative h-full bg-mesh">
        <AnimatePresence mode="wait">
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex-1 flex flex-col h-full overflow-hidden"
          >
            {children || <Outlet />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
