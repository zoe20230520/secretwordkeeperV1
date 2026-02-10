"use client"

import {
  Shield,
  Send,
  Wrench,
  Sparkles,
  Import,
  HelpCircle,
  Trash2,
  UserCircle,
  Lock,
  Palette,
  CreditCard,
  Globe,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AppSidebarProps {
  activeNav: string
  onNavChange: (nav: string) => void
  collapsed: boolean
  onToggleCollapse: () => void
  onLogout?: () => void
}

const mainNavItems = [
  { id: "vault", label: "密码库", icon: Shield },
  { id: "generator", label: "生成器", icon: Sparkles },
  { id: "import-export", label: "导入导出", icon: Import },
  { id: "backup", label: "备份", icon: Shield },
]

const settingsNavItems = [
  { id: "account", label: "账户管理", icon: UserCircle },
  { id: "appearance", label: "外观", icon: Palette },
]

export function AppSidebar({
  activeNav,
  onNavChange,
  collapsed,
  onToggleCollapse,
  onLogout,
}: AppSidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-screen flex-col bg-sidebar text-sidebar-foreground transition-all duration-300",
        collapsed ? "w-14" : "w-56"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5">
        <Shield className="h-6 w-6 shrink-0 text-sidebar-foreground" />
        {!collapsed && (
          <span className="text-base font-semibold text-sidebar-foreground">
            密码管理器
          </span>
        )}
      </div>

      {/* Main nav */}
      <nav className="flex flex-1 flex-col gap-0.5 px-2">
        {mainNavItems.map((item) => {
          const Icon = item.icon
          const isActive = activeNav === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavChange(item.id)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          )
        })}

        {/* Settings section */}
        <div className="mt-4">
          {!collapsed && (
            <div className="mb-1 flex items-center gap-1 px-3 py-1">
              <ChevronDown className="h-3 w-3 text-sidebar-foreground/60" />
              <span className="text-xs font-medium uppercase tracking-wider text-sidebar-foreground/60">
                设置
              </span>
            </div>
          )}
          {settingsNavItems.map((item) => {
            const Icon = item.icon
            const isActive = activeNav === item.id
            return (
              <button
                key={item.id}
                onClick={() => onNavChange(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggleCollapse}
        className="flex items-center gap-2 border-t border-sidebar-border px-4 py-3 text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
      >
        <ChevronLeft
          className={cn(
            "h-4 w-4 transition-transform",
            collapsed && "rotate-180"
          )}
        />
      </button>

      {/* Logout button */}
      {onLogout && (
        <button
          onClick={onLogout}
          className="flex items-center gap-2 border-t border-sidebar-border px-4 py-3 text-sm text-sidebar-foreground/60 hover:text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>退出登录</span>}
        </button>
      )}
    </aside>
  )
}
