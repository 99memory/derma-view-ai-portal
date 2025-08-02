好的，这是一个为您的“皮肤健康AI平台”项目编写的详细自述文件（README.md）。

-----

# 皮肤健康AI平台

欢迎来到皮肤健康AI平台！ 这是一个创新的Web应用程序，旨在利用人工智能为您提供快速、准确的皮肤病变初步筛查。所有AI分析结果均由专业皮肤科医生进行二次审核，确保诊断的可靠性。

## 🚀 项目概览

该平台为**患者**和**医生**提供了一个协作环境：

  * **患者**可以轻松上传皮肤病变的图像，并获得由AI驱动的即时初步分析报告。
  * **医生**可以审查、修改和确认AI的诊断，为患者提供最终的专业医疗建议。

此外，平台还集成了一个**AI健康助手**，为用户提供个性化的健康咨询和生活建议。

## ✨ 主要功能

  * **AI智能分析**: 采用先进的深度学习算法，能够识别多种皮肤病变类型，并提供置信度评估。
  * **专业医生审核**: 所有AI诊断结果都将由专业皮肤科医生进行二次审核，确保诊断的准确性和可靠性。
  * **详细的诊断历史**: 用户可以随时查看其所有的诊断记录，包括AI分析和医生的最终诊断。
  * **AI健康助手**: 集成了智能聊天机器人，提供健康咨询、皮肤问题初步评估、营养和运动指导等。
  * **患者管理 (医生端)**: 医生可以方便地管理和查看所有患者的信息和诊断历史。
  * **隐私保护**: 严格遵循医疗数据保护标准，确保您的个人信息和医疗数据安全。

## 🛠️ 技术栈

  * **前端**:
      * **框架**: React
      * **构建工具**: Vite
      * **语言**: TypeScript
      * **UI组件**: shadcn-ui, Radix UI
      * **样式**: Tailwind CSS
      * **路由**: React Router
      * **状态管理**: React Query
  * **后端 & 数据库**:
      * **服务**: Supabase (包括认证、数据库、存储)
  * **代码质量**:
      * **Linting**: ESLint
      * **代码格式化**: Prettier (通过ESLint集成)

## 🏁 开始使用

### 环境要求

  * [Node.js](https://nodejs.org/) (建议使用 v18 或更高版本)
  * [npm](https://www.npmjs.com/) (或 pnpm, yarn)

### 安装与运行

1.  **克隆仓库**
    ```bash
    git clone https://github.com/your-username/derma-view-ai-portal.git
    cd derma-view-ai-portal
    ```
2.  **安装依赖**
    ```bash
    npm install
    ```
3.  **配置Supabase**
      * 前往 `src/integrations/supabase/client.ts` 文件。
      * 替换 `SUPABASE_URL` 和 `SUPABASE_PUBLISHABLE_KEY` 为您自己的Supabase项目凭据。
4.  **运行开发服务器**
    ```bash
    npm run dev
    ```
    应用将在 `http://localhost:8080` (或您配置的其他端口) 上运行。

## 📁 项目结构

```
derma-view-ai-portal/
├── public/                  # 公共静态资源
├── src/
│   ├── assets/              # 图片、字体等资源
│   ├── components/
│   │   ├── auth/            # 认证相关组件
│   │   ├── dashboard/       # 仪表盘相关组件
│   │   └── ui/              # 可重用的UI组件 (shadcn-ui)
│   ├── hooks/               # 自定义React Hooks
│   ├── integrations/
│   │   └── supabase/        # Supabase客户端和类型定义
│   ├── lib/                 # 辅助函数
│   ├── pages/               # 页面级组件
│   ├── services/            # API服务层
│   ├── types/               # 全局类型定义
│   ├── App.tsx              # 应用主入口组件
│   ├── main.tsx             # React应用渲染入口
│   └── index.css            # 全局CSS样式
├── supabase/                # Supabase迁移文件
├── tailwind.config.ts       # Tailwind CSS 配置文件
├── vite.config.ts           # Vite 配置文件
└── package.json             # 项目依赖和脚本
```

## ⚙️ Supabase集成

本项目深度集成了Supabase，用于处理：

  * **用户认证**: 通过`useAuth`钩子实现用户注册、登录和会话管理。
  * **数据库**:
      * `profiles`: 存储用户信息和角色（患者/医生）。
      * `diagnosis_records`: 存储诊断记录，包括图片URL、症状、AI和医生的诊断结果。
      * `chat_messages`: 存储AI健康助手的聊天记录。
  * **存储**: 用于存储用户上传的皮肤图片。

所有的数据库迁移文件都位于`supabase/migrations`目录下。

## 🎨 UI组件和样式

  * **组件库**: 本项目使用了[shadcn-ui](https://ui.shadcn.com/)，它提供了一系列基于Radix UI和Tailwind CSS构建的可重用、可访问的UI组件。所有UI组件都位于`src/components/ui`目录下。
  * **样式**: 使用[Tailwind CSS](https://tailwindcss.com/)进行样式设计。配置文件为`tailwind.config.ts`，全局样式定义在`src/index.css`中。
  * **图标**: 使用[Lucide React](https://www.google.com/search?q=https://lucide.dev/guide/react)提供清晰、一致的图标。

## 📜 代码规范和Linting

项目使用ESLint和TypeScript-ESLint来确保代码质量和一致性。配置文件为`eslint.config.js`。

在开发过程中，建议您在IDE中安装ESLint插件，以便实时获得反馈。

## 部署

本项目已配置为可通过Vite进行构建和预览。

1.  **构建项目**

    ```bash
    npm run build
    ```

    构建产物将输出到`dist/`目录。

2.  **本地预览**

    ```bash
    npm run preview
    ```

    您可以在本地预览生产构建版本。

之后，您可以将`dist/`目录部署到任何静态网站托管服务，如Vercel、Netlify或GitHub Pages。

-----

希望这份文档能帮助您更好地了解和使用这个项目！如果您有任何问题，请随时提出。
