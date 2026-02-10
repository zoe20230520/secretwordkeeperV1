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
  UserCircle,
  Lock,
  Mail,
  Phone,
  Globe,
  Calendar,
  CheckCircle2,
  XCircle,
  Save,
  LogOut,
} from "lucide-react"

interface AccountPageProps {
  onUpdateAccount?: (account: AccountInfo) => void
  onLogout?: () => void
}

interface AccountInfo {
  name: string
  email: string
  phone?: string
  language: string
  theme: string
  dateFormat: string
}

export function AccountPage({ onUpdateAccount, onLogout }: AccountPageProps) {
  const [account, setAccount] = useState<AccountInfo>({
    name: "张三",
    email: "zhangsan@example.com",
    phone: "13800138000",
    language: "zh-CN",
    theme: "system",
    dateFormat: "YYYY-MM-DD",
  })
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")
  const [saveMessage, setSaveMessage] = useState("")

  const handleSave = () => {
    // Validate form
    if (!account.name.trim() || !account.email.trim()) {
      setSaveStatus("error")
      setSaveMessage("请填写必填字段")
      setTimeout(() => {
        setSaveStatus("idle")
        setSaveMessage("")
      }, 3000)
      return
    }

    onUpdateAccount?.(account)
    setSaveStatus("success")
    setSaveMessage("账户信息已更新")
    setTimeout(() => {
      setSaveStatus("idle")
      setSaveMessage("")
    }, 3000)
  }

  const handleChangePassword = () => {
    if (!password || password !== confirmPassword) {
      setSaveStatus("error")
      setSaveMessage("密码不匹配")
      setTimeout(() => {
        setSaveStatus("idle")
        setSaveMessage("")
      }, 3000)
      return
    }

    setSaveStatus("success")
    setSaveMessage("密码已更新")
    setPassword("")
    setConfirmPassword("")
    setTimeout(() => {
      setSaveStatus("idle")
      setSaveMessage("")
    }, 3000)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h1 className="text-xl font-semibold text-foreground">账户管理</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Personal Information Section */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <UserCircle className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-medium text-foreground">个人信息</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm text-foreground">姓名</Label>
                <Input
                  value={account.name}
                  onChange={(e) => setAccount({ ...account, name: e.target.value })}
                  placeholder="您的姓名"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm text-foreground">邮箱</Label>
                <Input
                  type="email"
                  value={account.email}
                  onChange={(e) => setAccount({ ...account, email: e.target.value })}
                  placeholder="您的邮箱"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm text-foreground">手机号</Label>
                <Input
                  value={account.phone || ""}
                  onChange={(e) => setAccount({ ...account, phone: e.target.value })}
                  placeholder="您的手机号（可选）"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm text-foreground">语言</Label>
                <Select value={account.language} onValueChange={(value) => setAccount({ ...account, language: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zh-CN">简体中文</SelectItem>
                    <SelectItem value="en-US">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleSave}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Save className="mr-2 h-4 w-4" />
                保存个人信息
              </Button>
            </div>
          </div>

          {/* Security Section */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-medium text-foreground">安全设置</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm text-foreground">新密码</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="输入新密码"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm text-foreground">确认密码</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="确认新密码"
                  className="mt-1"
                />
              </div>

              <Button
                onClick={handleChangePassword}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Save className="mr-2 h-4 w-4" />
                修改密码
              </Button>

              <div className="pt-2">
                <h3 className="text-sm font-medium text-foreground mb-2">两步验证</h3>
                <div className="flex items-center justify-between rounded-md border border-border p-3">
                  <div>
                    <p className="text-sm text-foreground">Google 验证码</p>
                    <p className="text-xs text-muted-foreground">提高账户安全性</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary/80"
                  >
                    启用
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="rounded-lg border border-border bg-card p-6 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-medium text-foreground">偏好设置</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-sm text-foreground">主题</Label>
                <Select value={account.theme} onValueChange={(value) => setAccount({ ...account, theme: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">跟随系统</SelectItem>
                    <SelectItem value="light">浅色</SelectItem>
                    <SelectItem value="dark">深色</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm text-foreground">日期格式</Label>
                <Select value={account.dateFormat} onValueChange={(value) => setAccount({ ...account, dateFormat: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Button
                  onClick={handleSave}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Save className="mr-2 h-4 w-4" />
                  保存偏好设置
                </Button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="rounded-lg border border-border bg-card p-6 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-medium text-foreground">危险操作</h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-md border border-red-200 bg-red-50 p-4">
                <h3 className="text-sm font-medium text-red-800 mb-2">注销账户</h3>
                <p className="text-xs text-red-700 mb-4">
                  注销账户将永久删除您的所有数据，包括密码、卡片信息等。此操作不可撤销。
                </p>
                <Button
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  注销账户
                </Button>
              </div>

              <Button
                onClick={() => onLogout?.()}
                variant="ghost"
                className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                退出登录
              </Button>
            </div>
          </div>
        </div>

        {/* Save Status */}
        {saveStatus === "success" && (
          <Alert className="mt-6 bg-green-50 border-green-200 text-green-800">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>保存成功</AlertTitle>
            <AlertDescription>{saveMessage}</AlertDescription>
          </Alert>
        )}

        {saveStatus === "error" && (
          <Alert className="mt-6 bg-red-50 border-red-200 text-red-800">
            <XCircle className="h-4 w-4" />
            <AlertTitle>保存失败</AlertTitle>
            <AlertDescription>{saveMessage}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
