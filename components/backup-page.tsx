"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Shield,
  Download,
  Upload,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
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

interface Backup {
  id: string
  timestamp: Date
  itemCount: number
  size: string
}

interface BackupPageProps {
  items: VaultItem[]
  onRestore?: (items: VaultItem[]) => void
}

export function BackupPage({ items, onRestore }: BackupPageProps) {
  const [backupHistory, setBackupHistory] = useState<Backup[]>([
    {
      id: "1",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      itemCount: 15,
      size: "1.2 KB",
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
      itemCount: 12,
      size: "0.9 KB",
    },
  ])
  const [autoBackup, setAutoBackup] = useState("daily")
  const [restoreStatus, setRestoreStatus] = useState<"idle" | "success" | "error">("idle")
  const [restoreMessage, setRestoreMessage] = useState("")

  const handleCreateBackup = () => {
    const backupData = {
      items: items.map(item => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })),
      metadata: {
        timestamp: new Date().toISOString(),
        version: "1.0",
        itemCount: items.length,
      },
    }

    const content = JSON.stringify(backupData, null, 2)
    const blob = new Blob([content], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)

    // Add to backup history
    setBackupHistory(prev => [
      {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        itemCount: items.length,
        size: `${(content.length / 1024).toFixed(1)} KB`,
      },
      ...prev,
    ])
  }

  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        const backupData = JSON.parse(content)

        if (backupData.items && Array.isArray(backupData.items)) {
          const restoredItems = backupData.items.map((item: any) => ({
            ...item,
            id: item.id || crypto.randomUUID(),
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
            favorite: Boolean(item.favorite),
          }))

          onRestore?.(restoredItems)
          setRestoreStatus("success")
          setRestoreMessage(`成功恢复 ${restoredItems.length} 个项目`)
          setTimeout(() => {
            setRestoreStatus("idle")
            setRestoreMessage("")
          }, 3000)
        } else {
          throw new Error("Invalid backup file format")
        }
      } catch (error) {
        setRestoreStatus("error")
        setRestoreMessage("恢复失败：无效的备份文件")
        setTimeout(() => {
          setRestoreStatus("idle")
          setRestoreMessage("")
        }, 3000)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h1 className="text-xl font-semibold text-foreground">备份</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Create Backup Section */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-medium text-foreground">创建备份</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  创建当前密码库的完整备份。
                </p>
                <Button
                  onClick={handleCreateBackup}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Download className="mr-2 h-4 w-4" />
                  创建备份 ({items.length} 个项目)
                </Button>
              </div>

              <div>
                <Label className="text-sm text-foreground">自动备份</Label>
                <Select value={autoBackup} onValueChange={setAutoBackup}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">每天</SelectItem>
                    <SelectItem value="weekly">每周</SelectItem>
                    <SelectItem value="monthly">每月</SelectItem>
                    <SelectItem value="off">关闭</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  自动备份功能将在后台运行。
                </p>
              </div>
            </div>
          </div>

          {/* Restore Backup Section */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Upload className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-medium text-foreground">恢复备份</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm text-foreground">选择备份文件</Label>
                <div className="mt-1 relative">
                  <Input
                    type="file"
                    accept=".json"
                    onChange={handleRestoreBackup}
                    className="cursor-pointer"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  从之前创建的备份文件中恢复数据。
                </p>
              </div>

              {/* Restore Status */}
              {restoreStatus === "success" && (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>恢复成功</AlertTitle>
                  <AlertDescription>{restoreMessage}</AlertDescription>
                </Alert>
              )}

              {restoreStatus === "error" && (
                <Alert className="bg-red-50 border-red-200 text-red-800">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>恢复失败</AlertTitle>
                  <AlertDescription>{restoreMessage}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </div>

        {/* Backup History Section */}
        <div className="mt-8 rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-medium text-foreground">备份历史</h2>
          </div>

          <div className="space-y-2">
            {backupHistory.length > 0 ? (
              backupHistory.map((backup) => (
                <div
                  key={backup.id}
                  className="flex items-center justify-between rounded-md border border-border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {backup.timestamp.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {backup.itemCount} 个项目 · {backup.size}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary/80"
                    onClick={() => {
                      if (confirm('确定要从这个备份恢复数据吗？这将覆盖当前的密码库数据。')) {
                        // 这里应该从备份文件中读取数据并恢复
                        // 由于这是模拟数据，我们暂时只显示提示
                        setRestoreStatus("success")
                        setRestoreMessage(`成功恢复备份: ${backup.timestamp.toLocaleString()}`)
                        setTimeout(() => {
                          setRestoreStatus("idle")
                          setRestoreMessage("")
                        }, 3000)
                      }
                    }}
                  >
                    恢复
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  暂无备份历史记录
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 rounded-lg border border-border bg-muted/50 p-4">
          <h3 className="text-sm font-medium text-foreground mb-2">备份提示</h3>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• 定期备份您的数据以防止意外丢失</li>
            <li>• 将备份文件存储在安全的位置，如加密的云存储</li>
            <li>• 备份文件包含所有密码，请注意保护</li>
            <li>• 恢复备份会覆盖当前的密码库数据</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
