"use client"

import { useState, useCallback, useEffect } from "react"
import { Copy, RefreshCw, Settings, X, UserCircle } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

function generatePassword(options: {
  length: number
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  special: boolean
  minNumbers: number
  minSpecial: number
  avoidAmbiguous: boolean
}): string {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const upperSafe = "ABCDEFGHJKLMNPQRSTUVWXYZ"
  const lower = "abcdefghijklmnopqrstuvwxyz"
  const lowerSafe = "abcdefghjkmnpqrstuvwxyz"
  const digits = "0123456789"
  const digitsSafe = "23456789"
  const specials = "!@#$%^&*()_+-=[]{}|;:',.<>?"
  const specialsSafe = "!@#$%^&*_+-=?"

  let chars = ""
  const requiredChars: string[] = []

  const u = options.avoidAmbiguous ? upperSafe : upper
  const l = options.avoidAmbiguous ? lowerSafe : lower
  const d = options.avoidAmbiguous ? digitsSafe : digits
  const s = options.avoidAmbiguous ? specialsSafe : specials

  if (options.uppercase) chars += u
  if (options.lowercase) chars += l
  if (options.numbers) chars += d
  if (options.special) chars += s

  if (!chars) chars = l

  // Add minimum required characters
  for (let i = 0; i < options.minNumbers && options.numbers; i++) {
    requiredChars.push(d[Math.floor(Math.random() * d.length)])
  }
  for (let i = 0; i < options.minSpecial && options.special; i++) {
    requiredChars.push(s[Math.floor(Math.random() * s.length)])
  }

  const remaining = options.length - requiredChars.length
  const result: string[] = [...requiredChars]

  for (let i = 0; i < Math.max(0, remaining); i++) {
    result.push(chars[Math.floor(Math.random() * chars.length)])
  }

  // Shuffle
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result.join("")
}

function generatePassphrase(options: {
  words: number
  separator: string
  capitalize: boolean
  includeNumber: boolean
}): string {
  const wordList = [
    "apple", "brave", "cloud", "dance", "eagle", "flame", "grace",
    "heart", "ivory", "judge", "kneel", "lunar", "magic", "noble",
    "ocean", "peace", "quiet", "river", "solar", "trust", "unity",
    "vivid", "water", "xenon", "youth", "zebra", "amber", "blaze",
    "coral", "dream", "ember", "frost", "gleam", "haven", "image",
    "jewel", "karma", "light", "maple", "north", "oasis", "plume",
    "quest", "realm", "shine", "tiger", "ultra", "vapor", "wiser",
  ]

  const words: string[] = []
  for (let i = 0; i < options.words; i++) {
    let word = wordList[Math.floor(Math.random() * wordList.length)]
    if (options.capitalize) {
      word = word.charAt(0).toUpperCase() + word.slice(1)
    }
    words.push(word)
  }

  let result = words.join(options.separator)
  if (options.includeNumber) {
    result += Math.floor(Math.random() * 100)
  }

  return result
}

function generateUsername(type: string): string {
  const adjectives = ["swift", "calm", "bold", "keen", "wise", "cool", "fast", "neat"]
  const nouns = ["tiger", "eagle", "wolf", "bear", "hawk", "lynx", "fox", "deer"]
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const num = Math.floor(Math.random() * 9999)

  if (type === "word") {
    return `${adj}${noun}${num}`
  }
  return `${adj}.${noun}${num}@example.com`
}

export function GeneratorPage() {
  const [activeTab, setActiveTab] = useState("password")
  const [showTip, setShowTip] = useState(true)

  // Password options
  const [passwordLength, setPasswordLength] = useState(6)
  const [inputLength, setInputLength] = useState('6')
  const [uppercase, setUppercase] = useState(true)
  const [lowercase, setLowercase] = useState(true)
  const [numbers, setNumbers] = useState(true)
  const [special, setSpecial] = useState(false)
  const [minNumbers, setMinNumbers] = useState(1)
  const [minSpecial, setMinSpecial] = useState(0)
  const [avoidAmbiguous, setAvoidAmbiguous] = useState(false)

  // Passphrase options
  const [wordCount, setWordCount] = useState(4)
  const [separator, setSeparator] = useState("-")
  const [capitalizeWords, setCapitalizeWords] = useState(true)
  const [includeNumber, setIncludeNumber] = useState(true)

  // Generated values
  const [generatedPassword, setGeneratedPassword] = useState("")
  const [generatedPassphrase, setGeneratedPassphrase] = useState("")
  const [generatedUsername, setGeneratedUsername] = useState("")
  const [copied, setCopied] = useState(false)

  const regeneratePassword = useCallback(() => {
    setGeneratedPassword(
      generatePassword({
        length: passwordLength,
        uppercase,
        lowercase,
        numbers,
        special,
        minNumbers,
        minSpecial,
        avoidAmbiguous,
      })
    )
  }, [passwordLength, uppercase, lowercase, numbers, special, minNumbers, minSpecial, avoidAmbiguous])

  const regeneratePassphrase = useCallback(() => {
    setGeneratedPassphrase(
      generatePassphrase({
        words: wordCount,
        separator,
        capitalize: capitalizeWords,
        includeNumber,
      })
    )
  }, [wordCount, separator, capitalizeWords, includeNumber])

  const regenerateUsername = useCallback(() => {
    setGeneratedUsername(generateUsername("word"))
  }, [])

  useEffect(() => {
    regeneratePassword()
  }, [regeneratePassword])

  useEffect(() => {
    regeneratePassphrase()
  }, [regeneratePassphrase])

  useEffect(() => {
    regenerateUsername()
  }, [regenerateUsername])

  const currentValue =
    activeTab === "password"
      ? generatedPassword
      : activeTab === "passphrase"
        ? generatedPassphrase
        : generatedUsername

  // History management
  interface HistoryItem {
    id: string
    value: string
    type: "password" | "passphrase" | "username"
    timestamp: Date
  }

  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])

  const handleCopy = () => {
    navigator.clipboard.writeText(currentValue).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      
      // Add to history
      const newHistoryItem: HistoryItem = {
        id: crypto.randomUUID(),
        value: currentValue,
        type: activeTab as "password" | "passphrase" | "username",
        timestamp: new Date()
      }
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 50)) // Keep last 50 items
    })
  }

  const handleRegenerate = () => {
    if (activeTab === "password") regeneratePassword()
    else if (activeTab === "passphrase") regeneratePassphrase()
    else regenerateUsername()
  }

  // Calculate password strength
  const getStrengthColor = (password: string) => {
    const len = password.length
    if (len >= 16) return "bg-green-500"
    if (len >= 12) return "bg-primary"
    if (len >= 8) return "bg-yellow-500"
    return "bg-destructive"
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h1 className="text-xl font-semibold text-foreground">生成器</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full max-w-xl"
        >
          <TabsList className="grid w-full grid-cols-3 bg-muted">
            <TabsTrigger value="password">密码</TabsTrigger>
            <TabsTrigger value="passphrase">密码短语</TabsTrigger>
            <TabsTrigger value="username">用户名</TabsTrigger>
          </TabsList>

          {/* Tip box */}
          {showTip && (
            <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-sm font-medium text-foreground">
                    快速使用密码
                  </span>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    一键就能把入口处一条密钥以安全的方式保管并管理起来。
                  </p>
                </div>
                <button
                  onClick={() => setShowTip(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Generated value display */}
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3">
            <code className="flex-1 overflow-x-auto text-sm font-mono text-card-foreground whitespace-nowrap">
              {currentValue}
            </code>
            <button
              onClick={handleCopy}
              className="shrink-0 rounded p-1.5 text-muted-foreground hover:text-foreground transition-colors"
              title="复制"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={handleRegenerate}
              className="shrink-0 rounded p-1.5 text-muted-foreground hover:text-foreground transition-colors"
              title="重新生成"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          {copied && (
            <p className="mt-1 text-xs text-primary">已复制到剪贴板</p>
          )}

          {/* Strength bar for password */}
          {activeTab === "password" && (
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-border">
              <div
                className={cn("h-full rounded-full transition-all", getStrengthColor(generatedPassword))}
                style={{ width: `${Math.min(100, (generatedPassword.length / 20) * 100)}%` }}
              />
            </div>
          )}

          {/* Password Tab Content */}
          <TabsContent value="password" className="mt-6">
            <div className="space-y-5">
              {/* Length */}
              <div>
                <Label className="text-sm text-foreground">密码</Label>
                <div className="mt-2 flex items-center gap-3">
                  <Label className="text-xs text-muted-foreground w-10">长度</Label>
                  <Input
                    type="number"
                    value={inputLength}
                    onChange={(e) => {
                      const value = e.target.value;
                      setInputLength(value);
                      if (value === '') {
                        // 允许输入框为空
                        return;
                      }
                      const numValue = Number(value);
                      if (!isNaN(numValue)) {
                        setPasswordLength(
                          Math.max(4, Math.min(128, numValue))
                        );
                      }
                    }}
                    onBlur={() => {
                      if (inputLength === '') {
                        setInputLength('6');
                        setPasswordLength(6);
                      }
                    }}
                    className="h-9 w-20 text-sm"
                  />
                  <button
                    onClick={() => {
                      setPasswordLength(6);
                      setInputLength('6');
                    }}
                    className="h-9 px-3 rounded-md border border-input bg-background text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    默认
                  </button>
                </div>
                <div className="mt-2">
                  <Slider
                    value={[passwordLength]}
                    onValueChange={([v]) => {
                      setPasswordLength(v);
                      setInputLength(v.toString());
                    }}
                    min={4}
                    max={128}
                    step={1}
                    className="w-full"
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  推荐长度12到16位。数据库支持最长128位。
                </p>
              </div>

              {/* Character types */}
              <div>
                <Label className="text-sm text-foreground">字符</Label>
                <div className="mt-2 flex flex-wrap gap-4">
                  <label className="flex items-center gap-2">
                    <Checkbox
                      checked={uppercase}
                      onCheckedChange={(v) => setUppercase(v === true)}
                    />
                    <span className="text-sm text-foreground">A-Z</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <Checkbox
                      checked={lowercase}
                      onCheckedChange={(v) => setLowercase(v === true)}
                    />
                    <span className="text-sm text-foreground">a-z</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <Checkbox
                      checked={numbers}
                      onCheckedChange={(v) => setNumbers(v === true)}
                    />
                    <span className="text-sm text-foreground">0-9</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <Checkbox
                      checked={special}
                      onCheckedChange={(v) => setSpecial(v === true)}
                    />
                    <span className="text-sm text-foreground">{'!@#$%^&*'}</span>
                  </label>
                </div>
              </div>

              {/* Min numbers / min special */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">
                    数字最少个数
                  </Label>
                  <Input
                    type="number"
                    value={minNumbers}
                    onChange={(e) => setMinNumbers(Math.max(0, Number(e.target.value)))}
                    className="mt-1 h-9 text-sm"
                    min={0}
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">
                    符号最少个数
                  </Label>
                  <Input
                    type="number"
                    value={minSpecial}
                    onChange={(e) => setMinSpecial(Math.max(0, Number(e.target.value)))}
                    className="mt-1 h-9 text-sm"
                    min={0}
                  />
                </div>
              </div>

              {/* Avoid ambiguous */}
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={avoidAmbiguous}
                  onCheckedChange={(v) => setAvoidAmbiguous(v === true)}
                />
                <span className="text-sm text-foreground">
                  避免易混淆的字符
                </span>
              </label>

              {/* History link */}
              <button 
                onClick={() => setShowHistory(true)}
                className="text-sm text-primary hover:underline"
              >
                查看生成历史记录
              </button>
            </div>
          </TabsContent>

          {/* Passphrase Tab Content */}
          <TabsContent value="passphrase" className="mt-6">
            <div className="space-y-5">
              <div>
                <Label className="text-sm text-foreground">单词数量</Label>
                <div className="mt-2 flex items-center gap-3">
                  <Input
                    type="number"
                    value={wordCount}
                    onChange={(e) =>
                      setWordCount(Math.max(2, Math.min(20, Number(e.target.value))))
                    }
                    className="h-9 w-20 text-sm"
                  />
                </div>
                <Slider
                  value={[wordCount]}
                  onValueChange={([v]) => setWordCount(v)}
                  min={2}
                  max={20}
                  step={1}
                  className="mt-2 w-full"
                />
              </div>

              <div>
                <Label className="text-sm text-foreground">分隔符</Label>
                <Input
                  value={separator}
                  onChange={(e) => setSeparator(e.target.value)}
                  className="mt-1 h-9 w-20 text-sm"
                  maxLength={3}
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={capitalizeWords}
                    onCheckedChange={(v) => setCapitalizeWords(v === true)}
                  />
                  <span className="text-sm text-foreground">大写首字母</span>
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={includeNumber}
                    onCheckedChange={(v) => setIncludeNumber(v === true)}
                  />
                  <span className="text-sm text-foreground">包含数字</span>
                </label>
              </div>
              {/* History link */}
              <button 
                onClick={() => setShowHistory(true)}
                className="text-sm text-primary hover:underline"
              >
                查看生成历史记录
              </button>
            </div>
          </TabsContent>

          {/* Username Tab Content */}
          <TabsContent value="username" className="mt-6">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                生成随机用户名用于注册新账户,保护你的隐私。
              </p>
              <div className="flex items-center gap-6">
                <button
                  onClick={regenerateUsername}
                  className="text-sm text-primary hover:underline"
                >
                  重新生成用户名
                </button>
                {/* History link */}
                <button 
                  onClick={() => setShowHistory(true)}
                  className="text-sm text-primary hover:underline"
                >
                  查看生成历史记录
                </button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* History Panel */}
        {showHistory && (
          <div className="mt-8 border-t border-border pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-foreground">生成历史记录</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHistory([])}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  清除历史
                </button>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  关闭
                </button>
              </div>
            </div>
            {history.length === 0 ? (
              <p className="text-xs text-muted-foreground">暂无生成历史记录</p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {history.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-muted-foreground">
                          {item.type === "password" ? "密码" : 
                           item.type === "passphrase" ? "密码短语" : "用户名"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.timestamp.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-foreground truncate">{item.value}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(item.value).then(() => {
                          setCopied(true)
                          setTimeout(() => setCopied(false), 2000)
                        })
                      }}
                      className="shrink-0 rounded p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                      title="复制"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
