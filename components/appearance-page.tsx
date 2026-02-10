"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
  Palette,
  Sun,
  Moon,
  Monitor,
  Smartphone,
  Tablet,
  Save,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react"
import { useTheme } from "next-themes"

interface AppearancePageProps {
  onUpdateAppearance?: (appearance: AppearanceSettings) => void
}

interface AppearanceSettings {
  theme: string
  accentColor: string
  font: string
  fontSize: string
  layout: string
  animations: boolean
  darkModeSchedule: boolean
  darkModeStart: string
  darkModeEnd: string
}

export function AppearancePage({ onUpdateAppearance }: AppearancePageProps) {
  const { theme, setTheme } = useTheme()
  const [appearance, setAppearance] = useState<AppearanceSettings>({
    theme: theme || "system",
    accentColor: "primary",
    font: "system",
    fontSize: "medium",
    layout: "comfortable",
    animations: true,
    darkModeSchedule: false,
    darkModeStart: "20:00",
    darkModeEnd: "06:00",
  })
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")
  const [saveMessage, setSaveMessage] = useState("")

  const handleSave = () => {
    // Update theme
    setTheme(appearance.theme)
    
    // Call callback
    onUpdateAppearance?.(appearance)
    
    setSaveStatus("success")
    setSaveMessage("外观设置已更新")
    setTimeout(() => {
      setSaveStatus("idle")
      setSaveMessage("")
    }, 3000)
  }

  const handleReset = () => {
    setAppearance({
      theme: "system",
      accentColor: "primary",
      font: "system",
      fontSize: "medium",
      layout: "comfortable",
      animations: true,
      darkModeSchedule: false,
      darkModeStart: "20:00",
      darkModeEnd: "06:00",
    })
    setTheme("system")
    
    setSaveStatus("success")
    setSaveMessage("外观设置已重置")
    setTimeout(() => {
      setSaveStatus("idle")
      setSaveMessage("")
    }, 3000)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h1 className="text-xl font-semibold text-foreground">外观设置</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Theme Section */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-medium text-foreground">主题</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm text-foreground">颜色模式</Label>
                <Select value={appearance.theme} onValueChange={(value) => setAppearance({ ...appearance, theme: value })}>
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
                <Label className="text-sm text-foreground">主题预览</Label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setAppearance({ ...appearance, theme: "light" })}
                    className={`flex flex-col items-center justify-center rounded-md border p-3 transition-colors ${appearance.theme === "light" ? "border-primary bg-primary/10" : "border-border hover:bg-muted"}`}
                  >
                    <Sun className="h-5 w-5 text-yellow-500 mb-1" />
                    <span className="text-xs">浅色</span>
                  </button>
                  <button
                    onClick={() => setAppearance({ ...appearance, theme: "dark" })}
                    className={`flex flex-col items-center justify-center rounded-md border p-3 transition-colors ${appearance.theme === "dark" ? "border-primary bg-primary/10" : "border-border hover:bg-muted"}`}
                  >
                    <Moon className="h-5 w-5 text-blue-400 mb-1" />
                    <span className="text-xs">深色</span>
                  </button>
                  <button
                    onClick={() => setAppearance({ ...appearance, theme: "system" })}
                    className={`flex flex-col items-center justify-center rounded-md border p-3 transition-colors ${appearance.theme === "system" ? "border-primary bg-primary/10" : "border-border hover:bg-muted"}`}
                  >
                    <Monitor className="h-5 w-5 text-gray-500 mb-1" />
                    <span className="text-xs">系统</span>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={appearance.darkModeSchedule}
                    onChange={(e) => setAppearance({ ...appearance, darkModeSchedule: e.target.checked })}
                    className="rounded border border-border text-primary focus:ring-primary"
                  />
                  定时深色模式
                </Label>
                {appearance.darkModeSchedule && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">开始时间</Label>
                      <input
                        type="time"
                        value={appearance.darkModeStart}
                        onChange={(e) => setAppearance({ ...appearance, darkModeStart: e.target.value })}
                        className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">结束时间</Label>
                      <input
                        type="time"
                        value={appearance.darkModeEnd}
                        onChange={(e) => setAppearance({ ...appearance, darkModeEnd: e.target.value })}
                        className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Display Section */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Monitor className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-medium text-foreground">显示</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm text-foreground">强调色</Label>
                <Select value={appearance.accentColor} onValueChange={(value) => setAppearance({ ...appearance, accentColor: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">蓝色</SelectItem>
                    <SelectItem value="red">红色</SelectItem>
                    <SelectItem value="green">绿色</SelectItem>
                    <SelectItem value="yellow">黄色</SelectItem>
                    <SelectItem value="purple">紫色</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm text-foreground">字体</Label>
                <Select value={appearance.font} onValueChange={(value) => setAppearance({ ...appearance, font: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">系统字体</SelectItem>
                    <SelectItem value="sans">无衬线字体</SelectItem>
                    <SelectItem value="serif">衬线字体</SelectItem>
                    <SelectItem value="mono">等宽字体</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm text-foreground">字体大小</Label>
                <Select value={appearance.fontSize} onValueChange={(value) => setAppearance({ ...appearance, fontSize: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">小</SelectItem>
                    <SelectItem value="medium">中</SelectItem>
                    <SelectItem value="large">大</SelectItem>
                    <SelectItem value="xlarge">超大</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm text-foreground">布局密度</Label>
                <Select value={appearance.layout} onValueChange={(value) => setAppearance({ ...appearance, layout: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comfortable">舒适</SelectItem>
                    <SelectItem value="compact">紧凑</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={appearance.animations}
                    onChange={(e) => setAppearance({ ...appearance, animations: e.target.checked })}
                    className="rounded border border-border text-primary focus:ring-primary"
                  />
                  启用动画
                </Label>
              </div>
            </div>
          </div>

          {/* Device Preview Section */}
          <div className="rounded-lg border border-border bg-card p-6 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Monitor className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-medium text-foreground">设备预览</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm text-foreground">预览设备</Label>
                <Select value={appearance.layout} onValueChange={(value) => setAppearance({ ...appearance, layout: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comfortable">桌面</SelectItem>
                    <SelectItem value="compact">移动设备</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center">
                  <Monitor className="h-8 w-8 text-muted-foreground mb-1" />
                  <span className="text-xs">桌面</span>
                </div>
                <div className="flex flex-col items-center">
                  <Tablet className="h-6 w-6 text-muted-foreground mb-1" />
                  <span className="text-xs">平板</span>
                </div>
                <div className="flex flex-col items-center">
                  <Smartphone className="h-5 w-5 text-muted-foreground mb-1" />
                  <span className="text-xs">手机</span>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={handleSave}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 mr-2"
                >
                  <Save className="mr-2 h-4 w-4" />
                  保存设置
                </Button>
                <Button
                  onClick={handleReset}
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  重置
                </Button>
              </div>
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
