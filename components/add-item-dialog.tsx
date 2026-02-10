"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Eye, EyeOff } from "lucide-react"

interface AddItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (item: {
    name: string
    username: string
    password: string
    type: string
    url: string
    notes: string
  }) => void
  item?: {
    id: string
    name: string
    username: string
    password: string
    type: string
    url?: string
    notes?: string
  }
}

export function AddItemDialog({ open, onOpenChange, onAdd, item }: AddItemDialogProps) {
  const [name, setName] = useState(item?.name || "")
  const [username, setUsername] = useState(item?.username || "")
  const [password, setPassword] = useState(item?.password || "")
  const [url, setUrl] = useState(item?.url || "")
  const [notes, setNotes] = useState(item?.notes || "")
  const [type, setType] = useState(item?.type || "login")
  const [showPassword, setShowPassword] = useState(false)

  // Reset form when dialog opens or closes
  useEffect(() => {
    if (open) {
      setName(item?.name || "")
      setUsername(item?.username || "")
      setPassword(item?.password || "")
      setUrl(item?.url || "")
      setNotes(item?.notes || "")
      setType(item?.type || "login")
    }
  }, [open, item])

  const handleSubmit = () => {
    if (!name.trim()) return
    onAdd({ name, username, password, type, url, notes })
    setName("")
    setUsername("")
    setPassword("")
    setUrl("")
    setNotes("")
    setType("login")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card text-card-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">{item ? "编辑项目" : "新增密码项"}</DialogTitle>
          <DialogDescription>
            {item ? "编辑现有密码项的信息。" : "填写以下信息来添加一个新的密码项到您的密码库。"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-sm text-foreground">类型</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="login">登录</SelectItem>
                <SelectItem value="card">支付卡</SelectItem>
                <SelectItem value="identity">身份</SelectItem>
                <SelectItem value="note">安全笔记</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm text-foreground">名称</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如: Google 账户"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm text-foreground">用户名</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="邮箱或用户名"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm text-foreground">密码</Label>
            <div className="relative mt-1">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="输入密码"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <Label className="text-sm text-foreground">网址</Label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm text-foreground">备注</Label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="可选备注信息"
              className="mt-1"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-foreground"
          >
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
