import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ChevronRight, FileType, LayoutDashboard, ShieldCheck, Tags } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'

const settingCards = [
  {
    to: '/settings/tags',
    icon: Tags,
    title: 'Tag Categories',
    description: 'Organize documents with shared classification tags.',
    accent: 'from-indigo-500 to-violet-600',
  },
  {
    to: '/settings/extensions',
    icon: FileType,
    title: 'Allowed Extensions',
    description: 'Control which file types can be uploaded into the system.',
    accent: 'from-sky-500 to-cyan-600',
  },
  {
    to: '/settings/rbac',
    icon: ShieldCheck,
    title: 'Role Management',
    description: 'Create roles and assign permissions to users.',
    accent: 'from-emerald-500 to-teal-600',
    permission: 'users.manage_roles',
  },
]

export default function SettingsPage() {
  const navigate = useNavigate()
  const { hasAnyPermission } = useAuthStore()

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-mesh">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
              <p className="text-slate-500 text-sm">Manage tags, upload policy, and access control from one place.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {settingCards.map((card) => {
            const isAllowed = card.permission ? hasAnyPermission(card.permission) : true
            const Icon = card.icon

            return (
              <Link
                key={card.to}
                to={isAllowed ? card.to : '#'}
                onClick={(e) => {
                  if (!isAllowed) e.preventDefault()
                }}
                aria-disabled={!isAllowed}
                className={`group rounded-[2rem] border p-6 transition-all duration-300 bg-white/70 backdrop-blur-xl shadow-xl shadow-slate-900/5 ${
                  isAllowed
                    ? 'border-white hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10'
                    : 'border-slate-200/70 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.accent} flex items-center justify-center shadow-lg shadow-indigo-500/20`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="mt-5 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-xl font-bold text-slate-900">{card.title}</h2>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-sm text-slate-500 leading-6">{card.description}</p>
                  {!isAllowed && (
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Permission required</p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
