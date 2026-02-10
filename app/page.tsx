"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { VaultPage } from "@/components/vault-page"
import { GeneratorPage } from "@/components/generator-page"
import { AddItemDialog } from "@/components/add-item-dialog"
import { ImportExportPage } from "@/components/import-export-page"
import { BackupPage } from "@/components/backup-page"
import { AccountPage } from "@/components/account-page"
import { AppearancePage } from "@/components/appearance-page"
import { LoginPage } from "@/components/login-page"
import { useAuth } from "@/lib/auth-context"
import {
  Send,
  Wrench,
  Import,
  HelpCircle,
  Trash2,
  UserCircle,
  Lock,
  Palette,
  CreditCard,
  Globe,
} from "lucide-react"

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

function PlaceholderPage({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      </div>
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  const { isAuthenticated, login, logout } = useAuth()
  const [activeNav, setActiveNav] = useState("vault")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<VaultItem | null>(null)
  const [loginError, setLoginError] = useState("")

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={(username, password) => {
          if (login(username, password)) {
            setLoginError("")
          } else {
            setLoginError("用户名或密码错误")
          }
        }}
        error={loginError}
      />
    )
  }

  const handleAddItem = (item: {
    name: string
    username: string
    password: string
    type: string
    url: string
    notes: string
  }) => {
    const now = new Date()
    setVaultItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: item.name,
        username: item.username,
        password: item.password,
        url: item.url,
        notes: item.notes,
        type: item.type,
        favorite: false,
        createdAt: now,
        updatedAt: now,
      },
    ])
  }

  const handleEditItem = (item: VaultItem) => {
    setEditingItem(item)
    setShowAddDialog(true)
  }

  const handleDeleteItem = (id: string) => {
    if (confirm('确定要删除这个项目吗？')) {
      setVaultItems((prev) => prev.filter(item => item.id !== id))
    }
  }

  const handleToggleFavorite = (id: string) => {
    setVaultItems((prev) => prev.map(item => 
      item.id === id 
        ? { ...item, favorite: !item.favorite, updatedAt: new Date() }
        : item
    ))
  }

  const renderPage = () => {
    // Ensure all items have unique IDs
    const uniqueVaultItems = vaultItems.reduce((acc, item) => {
      const existingIndex = acc.findIndex(i => i.id === item.id)
      if (existingIndex === -1) {
        acc.push(item)
      } else {
        // Generate new ID for duplicate items
        acc.push({ ...item, id: crypto.randomUUID() })
      }
      return acc
    }, [] as VaultItem[])

    switch (activeNav) {
      case "vault":
        return (
          <VaultPage
            items={uniqueVaultItems}
            onAddItem={() => setShowAddDialog(true)}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onToggleFavorite={handleToggleFavorite}
          />
        )
      case "generator":
        return <GeneratorPage />
      case "import-export":
        return (
          <ImportExportPage
            items={uniqueVaultItems}
            onImport={handleImport}
          />
        )
      case "backup":
        return (
          <BackupPage
            items={uniqueVaultItems}
            onRestore={handleRestore}
          />
        )
      case "account":
        return (
          <AccountPage
            onUpdateAccount={(account) => console.log('Account updated:', account)}
            onLogout={logout}
          />
        )
      case "appearance":
        return (
          <AppearancePage
            onUpdateAppearance={(appearance) => console.log('Appearance updated:', appearance)}
          />
        )
      default:
        return (
          <VaultPage
            items={uniqueVaultItems}
            onAddItem={() => setShowAddDialog(true)}
          />
        )
    }
  }

  const handleAddOrEditItem = (item: {
    name: string
    username: string
    password: string
    type: string
    url: string
    notes: string
  }) => {
    if (editingItem) {
      // Update existing item
      setVaultItems((prev) => prev.map(existingItem => 
        existingItem.id === editingItem.id 
          ? { ...existingItem, ...item, updatedAt: new Date() }
          : existingItem
      ))
      setEditingItem(null)
    } else {
      // Add new item
      handleAddItem(item)
    }
  }

  const handleImport = (importedItems: VaultItem[]) => {
    // Add imported items to the vault
    setVaultItems((prev) => [
      ...prev,
      ...importedItems.map(item => ({
        ...item,
        id: item.id || crypto.randomUUID(),
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      })),
    ])
  }

  const handleRestore = (restoredItems: VaultItem[]) => {
    if (confirm('确定要恢复备份吗？这将覆盖当前所有密码库数据。')) {
      setVaultItems(restoredItems.map(item => ({
        ...item,
        id: item.id || crypto.randomUUID(),
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      })))
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar
        activeNav={activeNav}
        onNavChange={setActiveNav}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLogout={logout}
      />
      <main className="flex flex-1 flex-col overflow-hidden bg-card">
        {renderPage()}
      </main>

      <AddItemDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAdd={handleAddOrEditItem}
        item={editingItem}
      />
    </div>
  )
}
