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
  FileText,
  Download,
  Upload,
  CheckCircle2,
  XCircle,
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

interface ImportExportPageProps {
  items: VaultItem[]
  onImport?: (items: VaultItem[]) => void
}

export function ImportExportPage({ items, onImport }: ImportExportPageProps) {
  const [exportFormat, setExportFormat] = useState("json")
  const [importFormat, setImportFormat] = useState("json")
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle")
  const [importMessage, setImportMessage] = useState("")

  const handleExport = () => {
    const exportData = items.map(item => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }))

    let content = ""
    let fileName = "passwords"
    let mimeType = ""

    if (exportFormat === "json") {
      content = JSON.stringify(exportData, null, 2)
      fileName += ".json"
      mimeType = "application/json"
    } else if (exportFormat === "csv") {
      // Convert to CSV
      const headers = ["name", "username", "password", "url", "notes", "type", "folder", "favorite", "createdAt", "updatedAt"]
      const csvContent = [
        headers.join(","),
        ...exportData.map(item => 
          headers.map(header => {
            const value = item[header as keyof typeof item]
            return typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value
          }).join(",")
        ),
      ].join("\n")
      content = csvContent
      fileName += ".csv"
      mimeType = "text/csv"
    }

    // Create download link
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        let importedItems: VaultItem[] = []

        if (importFormat === "json") {
          const parsedData = JSON.parse(content)
          importedItems = Array.isArray(parsedData) ? parsedData.map((item: any) => ({
            ...item,
            id: item.id || crypto.randomUUID(),
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
            favorite: Boolean(item.favorite),
          })) : []
        } else if (importFormat === "csv") {
          // Parse CSV
          const lines = content.split("\n").filter(line => line.trim())
          const headers = lines[0].split(",").map(header => header.replace(/"/g, ''))
          
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(value => value.replace(/"/g, ''))
            const item: any = {}
            
            headers.forEach((header, index) => {
              item[header] = values[index]
            })
            
            importedItems.push({
              id: item.id || crypto.randomUUID(),
              name: item.name || "",
              username: item.username || "",
              password: item.password || "",
              url: item.url || undefined,
              notes: item.notes || undefined,
              type: item.type || "login",
              folder: item.folder || undefined,
              favorite: Boolean(item.favorite),
              createdAt: new Date(item.createdAt || Date.now()),
              updatedAt: new Date(item.updatedAt || Date.now()),
            })
          }
        }

        if (importedItems.length > 0) {
          onImport?.(importedItems)
          setImportStatus("success")
          setImportMessage(`成功导入 ${importedItems.length} 个项目`)
          setTimeout(() => {
            setImportStatus("idle")
            setImportMessage("")
          }, 3000)
        } else {
          setImportStatus("error")
          setImportMessage("未找到有效的项目数据")
          setTimeout(() => {
            setImportStatus("idle")
            setImportMessage("")
          }, 3000)
        }
      } catch (error) {
        setImportStatus("error")
        setImportMessage("导入失败：数据格式不正确")
        setTimeout(() => {
          setImportStatus("idle")
          setImportMessage("")
        }, 3000)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h1 className="text-xl font-semibold text-foreground">导入导出</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Export Section */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-medium text-foreground">导出数据</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm text-foreground">导出格式</Label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  导出所有密码库项目到文件。
                </p>
                <Button
                  onClick={handleExport}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Download className="mr-2 h-4 w-4" />
                  导出 {items.length} 个项目
                </Button>
              </div>
            </div>
          </div>

          {/* Import Section */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Upload className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-medium text-foreground">导入数据</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm text-foreground">导入格式</Label>
                <Select value={importFormat} onValueChange={setImportFormat}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm text-foreground">选择文件</Label>
                <div className="mt-1 relative">
                  <Input
                    type="file"
                    accept={importFormat === "json" ? ".json" : ".csv"}
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  支持从其他密码管理器导入数据。
                </p>
              </div>

              {/* Import Status */}
              {importStatus === "success" && (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>导入成功</AlertTitle>
                  <AlertDescription>{importMessage}</AlertDescription>
                </Alert>
              )}

              {importStatus === "error" && (
                <Alert className="bg-red-50 border-red-200 text-red-800">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>导入失败</AlertTitle>
                  <AlertDescription>{importMessage}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 rounded-lg border border-border bg-muted/50 p-4">
          <h3 className="text-sm font-medium text-foreground mb-2">提示</h3>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• JSON格式支持所有字段，包括文件夹和收藏状态</li>
            <li>• CSV格式适合与电子表格软件一起使用</li>
            <li>• 导入时会保留原始数据，不会覆盖现有项目</li>
            <li>• 建议定期导出备份以防止数据丢失</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
