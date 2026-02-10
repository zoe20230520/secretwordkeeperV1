"use client"

import { useState } from "react"
import {
  Plus,
  LayoutGrid,
  List,
  Search,
  Star,
  LogIn,
  CreditCard,
  User,
  StickyNote,
  Key,
  Folder,
  FileText,
  FolderOpen,
  CheckCircle2,
  Circle,
  ChevronRight,
  ChevronDown,
  Shield,
  Lock,
  Copy,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface VaultItem {
  id: string
  name: string
  username: string
  password: string
  url?: string
  notes?: string
  type: string
  folder?: string
  favorite: boolean
  createdAt: Date
  updatedAt: Date
}

interface VaultPageProps {
  items: VaultItem[]
  onAddItem: () => void
  onEditItem?: (item: VaultItem) => void
  onDeleteItem?: (id: string) => void
  onToggleFavorite?: (id: string) => void
}

const categories = [
  {
    id: "favorites",
    label: "收藏",
    icon: Star,
    section: "top",
  },
  {
    id: "all",
    label: "所有类型",
    icon: null,
    section: "types",
    children: [
      { id: "login", label: "登录", icon: LogIn },
      { id: "card", label: "支付卡", icon: CreditCard },
      { id: "identity", label: "身份", icon: User },
      { id: "note", label: "安全笔记", icon: StickyNote },
      { id: "ssh", label: "SSH密钥", icon: Key },
    ],
  },
  {
    id: "folders",
    label: "文件夹",
    icon: null,
    section: "folders",
    children: [
      { id: "folder-none", label: "未分组", icon: FolderOpen },
    ],
  },
]



export function VaultPage({ items, onAddItem, onEditItem, onDeleteItem, onToggleFavorite }: VaultPageProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [showGettingStarted, setShowGettingStarted] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "types",
    "folders",
  ])
  const [filterOwner, setFilterOwner] = useState("all")
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  const [copiedItems, setCopiedItems] = useState<Record<string, boolean>>({})

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h1 className="text-xl font-semibold text-foreground">所有密码库</h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={onAddItem}
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="mr-1 h-4 w-4" />
            新建
          </Button>
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "rounded p-1.5 transition-colors",
              viewMode === "grid"
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "rounded p-1.5 transition-colors",
              viewMode === "list"
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>



      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - categories */}
        <div className="w-52 shrink-0 overflow-y-auto border-r border-border p-3">
          <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            筛选
          </div>
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜索密码库"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>

          {/* Favorites */}
          <button
            onClick={() => setSelectedCategory("favorites")}
            className={cn(
              "mb-1 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
              selectedCategory === "favorites"
                ? "bg-primary/10 text-primary font-medium"
                : "text-foreground hover:bg-muted"
            )}
          >
            <Star className="h-3.5 w-3.5" />
            <span>收藏</span>
          </button>

          {/* All types */}
          <div className="mb-1">
            <button
              onClick={() => toggleSection("types")}
              className="flex w-full items-center gap-1 px-1 py-1 text-xs font-medium text-muted-foreground"
            >
              {expandedSections.includes("types") ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
              所有类型
            </button>
            {expandedSections.includes("types") && (
              <div className="ml-1 space-y-0.5">
                {categories[1].children?.map((child) => {
                  const Icon = child.icon
                  return (
                    <button
                      key={child.id}
                      onClick={() => setSelectedCategory(child.id)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                        selectedCategory === child.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{child.label}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Folders */}
          <div className="mb-1">
            <button
              onClick={() => toggleSection("folders")}
              className="flex w-full items-center gap-1 px-1 py-1 text-xs font-medium text-muted-foreground"
            >
              {expandedSections.includes("folders") ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
              文件夹
            </button>
            {expandedSections.includes("folders") && (
              <div className="ml-1 space-y-0.5">
                <button
                  onClick={() => setSelectedCategory("folder-none")}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                    selectedCategory === "folder-none"
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <FolderOpen className="h-3.5 w-3.5" />
                  <span>未分组</span>
                </button>
              </div>
            )}
          </div>

          {/* Uncategorized */}
          <button
            onClick={() => setSelectedCategory("uncategorized")}
            className={cn(
              "mt-1 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
              selectedCategory === "uncategorized"
                ? "bg-primary/10 text-primary font-medium"
                : "text-foreground hover:bg-muted"
            )}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>{'未归档'}</span>
          </button>
        </div>

        {/* Right content area */}
        <div className="flex flex-1 flex-col">
          {/* Filter bar */}
          <div className="flex items-center gap-4 border-b border-border px-4 py-2">
            <button
              onClick={() => setFilterOwner("all")}
              className={cn(
                "text-sm transition-colors",
                filterOwner === "all"
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              全部
            </button>
            <button
              onClick={() => setFilterOwner("name")}
              className={cn(
                "text-sm transition-colors",
                filterOwner === "name"
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              名称
            </button>
            <div className="ml-auto text-sm text-muted-foreground">
              所有者
            </div>
          </div>

          {/* Content / Empty state */}
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
              <div className="flex gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-border bg-card">
                  <Shield className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-border bg-card">
                  <Lock className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-base font-semibold text-foreground">
                  密码库中没有密码
                </h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  您还没有向密码库中添加项目。先让我们添加些内容来保护密码、卡片信息等重要数据吧。
                </p>
              </div>
              <Button
                onClick={onAddItem}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="mr-1 h-4 w-4" />
                新增密码
              </Button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4">
              {items.map((item) => {
                const handleCopy = async (text: string) => {
                  try {
                    await navigator.clipboard.writeText(text)
                    setCopiedItems(prev => ({ ...prev, [item.id]: true }))
                    setTimeout(() => {
                      setCopiedItems(prev => ({ ...prev, [item.id]: false }))
                    }, 2000)
                  } catch (err) {
                    console.error('Failed to copy:', err)
                  }
                }
                
                return (
                  <div
                    key={item.id}
                    className="rounded-md border border-border bg-card mb-2 overflow-hidden hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded bg-primary/10">
                          {item.type === 'login' && <LogIn className="h-4 w-4 text-primary" />}
                          {item.type === 'card' && <CreditCard className="h-4 w-4 text-primary" />}
                          {item.type === 'identity' && <User className="h-4 w-4 text-primary" />}
                          {item.type === 'note' && <StickyNote className="h-4 w-4 text-primary" />}
                          {item.type === 'ssh' && <Key className="h-4 w-4 text-primary" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-medium text-card-foreground truncate">
                              {item.name}
                            </h3>
                            <button
                              onClick={() => onToggleFavorite?.(item.id)}
                              className="text-muted-foreground hover:text-yellow-500 transition-colors"
                            >
                              <Star className={`h-4 w-4 ${item.favorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                            </button>
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {item.username}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEditItem?.(item)}
                          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                          title="编辑"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteItem?.(item.id)}
                          className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-muted rounded-md transition-colors"
                          title="删除"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="px-3 pb-3 space-y-2">
                      {item.password && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">密码</span>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">
                              {showPasswords[item.id] ? item.password : '••••••••'}
                            </span>
                            <button
                              onClick={() => setShowPasswords(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                              title={showPasswords[item.id] ? '隐藏' : '显示'}
                            >
                              {showPasswords[item.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </button>
                            <button
                              onClick={() => handleCopy(item.password)}
                              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                              title="复制"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {item.url && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">网址</span>
                          <div className="flex items-center gap-1">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline truncate max-w-[200px]"
                              title={item.url}
                            >
                              {item.url}
                            </a>
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          </div>
                        </div>
                      )}
                      
                      {item.notes && (
                        <div>
                          <span className="text-xs text-muted-foreground block mb-1">备注</span>
                          <div className="text-xs bg-muted p-2 rounded">
                            {item.notes}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>修改于: {new Date(item.updatedAt).toLocaleDateString()}</span>
                        <span>类型: {item.type}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
