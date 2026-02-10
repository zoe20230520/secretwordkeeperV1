# 密码管理器生成器

一个功能强大的密码管理器和生成器应用，帮助您安全管理和生成密码。

## 应用预览

public/generator-screenshot.png

## 功能特性

### 核心功能
- **密码库**：安全存储和管理密码，支持分类、搜索和筛选
- **密码生成器**：生成高强度随机密码，可自定义长度和字符类型
- **导入导出**：支持CSV和JSON格式的密码数据导入导出
- **备份恢复**：自动备份密码库数据，支持手动恢复
- **账户管理**：管理员登录系统，保护应用访问
- **外观设置**：可切换浅色/深色主题

### 技术特性
- **现代化前端**：Next.js 16 + React + TypeScript
- **响应式设计**：适配各种设备屏幕
- **安全存储**：本地存储加密，保护用户数据
- **直观界面**：基于Tailwind CSS和shadcn/ui的现代化UI
- **快速开发**：使用Turbopack实现快速热重载

## 技术栈

- **框架**：Next.js 16
- **语言**：TypeScript
- **样式**：Tailwind CSS v4
- **UI组件**：shadcn/ui
- **状态管理**：React Context API
- **数据存储**：LocalStorage
- **构建工具**：Vite (via Next.js)
- **包管理器**：pnpm

## 安装步骤

### 前提条件
- Node.js 18.0 或更高版本
- pnpm 8.0 或更高版本

### 安装方法

1. **克隆项目**
   ```bash
   git clone git@github.com:zoe20230520/secretwordkeeperV1.git
   cd secretwordkeeperV1
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **启动开发服务器**
   ```bash
   pnpm run dev
   ```

4. **构建生产版本**
   ```bash
   pnpm run build
   ```

5. **预览生产版本**
   ```bash
   pnpm run start
   ```

## 使用说明

### 首次登录
1. 启动应用后，会显示登录页面
2. 使用默认管理员凭证登录：
   - 用户名：`admin`
   - 密码：`admin123`

### 密码库管理
1. **添加密码**：点击"新建"按钮，填写网站、用户名、密码等信息
2. **编辑密码**：点击密码项右侧的编辑图标
3. **删除密码**：点击密码项右侧的删除图标
4. **收藏密码**：点击密码项左侧的星形图标
5. **搜索密码**：使用左侧边栏的搜索框
6. **筛选密码**：使用左侧边栏的分类和标签筛选

### 密码生成器
1. 进入"生成器"页面
2. 调整密码长度和字符类型选项
3. 点击"生成"按钮获取随机密码
4. 点击"复制"按钮复制生成的密码

### 导入导出
1. 进入"导入导出"页面
2. **导出**：选择导出格式（CSV或JSON），点击"导出"按钮
3. **导入**：选择导入文件，点击"导入"按钮

### 备份恢复
1. 进入"备份"页面
2. **手动备份**：点击"创建备份"按钮
3. **恢复备份**：选择备份文件，点击"恢复"按钮

### 账户管理
1. 进入"账户管理"页面
2. 可修改管理员密码（功能开发中）

### 外观设置
1. 进入"外观"页面
2. 切换浅色/深色主题

## 项目结构

```
secretwordkeeperV1/
├── app/                  # Next.js 应用路由
│   ├── page.tsx          # 主页面
│   └── layout.tsx        # 应用布局
├── components/           # React 组件
│   ├── app-sidebar.tsx   # 应用侧边栏
│   ├── vault-page.tsx    # 密码库页面
│   ├── generator-page.tsx # 密码生成器页面
│   ├── import-export-page.tsx # 导入导出页面
│   ├── backup-page.tsx   # 备份页面
│   ├── account-page.tsx  # 账户管理页面
│   ├── appearance-page.tsx # 外观设置页面
│   └── login-page.tsx    # 登录页面
├── lib/                  # 工具函数和上下文
│   ├── auth-context.tsx  # 认证上下文
│   └── utils.ts          # 工具函数
├── public/               # 静态资源
├── tailwind.config.ts    # Tailwind 配置
├── tsconfig.json         # TypeScript 配置
├── package.json          # 项目依赖
└── README.md             # 项目说明
```

## 安全说明

- **本地存储**：密码数据存储在浏览器的LocalStorage中，建议定期导出备份
- **密码保护**：应用使用管理员密码保护访问，但不加密存储密码数据
- **最佳实践**：
  - 定期导出和备份密码数据
  - 使用强管理员密码
  - 不要在公共设备上使用此应用
  - 考虑使用专业的密码管理服务进行重要密码的存储

## 开发指南

### 启动开发服务器
```bash
pnpm run dev
```

### 运行类型检查
```bash
pnpm run typecheck
```

### 运行代码检查
```bash
pnpm run lint
```

### 构建生产版本
```bash
pnpm run build
```

## 功能规划

### 已实现功能
- [x] 密码库管理（CRUD操作）
- [x] 密码生成器
- [x] 导入导出功能
- [x] 备份恢复功能
- [x] 管理员登录系统
- [x] 外观设置（浅色/深色主题）

### 计划功能
- [ ] 密码强度分析
- [ ] 批量操作
- [ ] 密码自动填充
- [ ] 多用户支持
- [ ] 云同步功能
- [ ] 浏览器扩展

## 贡献指南

欢迎贡献代码和提出建议！请遵循以下步骤：

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件

## 联系方式

- 项目链接：https://github.com/zoe20230520/secretwordkeeperV1
- 问题反馈：https://github.com/zoe20230520/secretwordkeeperV1/issues

---

**注意**：本应用仅用于个人密码管理，不适合存储极其敏感的密码数据。对于企业级或高度敏感的密码管理，建议使用专业的密码管理服务。
