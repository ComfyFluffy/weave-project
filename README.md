# Weave - AI增强的在线协作叙事平台

> 🎲 **智能化的、永不疲倦的虚拟游戏主持人**  
> 一个融合了AI技术、拥有高度自由度的实时在线协作叙事平台

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-black?style=flat-square&logo=socket.io&badgeColor=010101)](https://socket.io/)

---

## 🎯 项目愿景

Weave 旨在打破传统线上跑团（TRPG）的壁垒，通过强大的人工智能为玩家提供一个类似Discord的、高度整合的社交与游戏空间。我们致力于解决传统模式中主持人构思枯竭、规则复杂、节奏拖沓等核心痛点，让创造故事的乐趣变得前所未有的简单和纯粹。

## 🚀 核心特性

### ✅ 已完成功能
- **Discord风格聊天界面**: 熟悉直观的多频道聊天体验
- **实时多人协作**: 基于Socket.IO的即时通信
- **角色创建与管理**: 完整的角色创建和选择系统
- **世界/频道管理**: 支持多世界、多频道的组织结构
- **类型安全架构**: 完整的TypeScript类型定义体系

### 🚧 开发中功能
- **智能世界状态管理系统**: 结构化的事实库/规则库，解决LLM长期记忆问题
- **AI辅助剧情推进**: LLM融合进故事发展，提供智能建议和选项
- **自动规则判定**: 玩家行动的智能裁决系统

### 🔄 计划中功能
- **AI主持人模式**: 完全自动化的游戏主持体验
- **LLM辅助内容生成**: 世界观、角色、故事的AI辅助创建
- **智能故事导出**: AI辅助的游戏记录整理和导出

## 🏗️ 技术架构

### 项目结构
```
weave-project/
├── apps/
│   ├── frontend/          # React + Vite 前端应用
│   │   ├── src/
│   │   │   ├── components/    # UI组件
│   │   │   │   ├── ChatLayout/    # 聊天界面组件
│   │   │   │   ├── CharacterCreation/    # 角色创建组件
│   │   │   │   └── ui/    # 基础UI组件
│   │   │   ├── hooks/     # React Hooks
│   │   │   ├── services/  # API服务
│   │   │   └── providers/ # 上下文提供者
│   │   └── package.json
│   └── backend/           # Node.js + Express 后端服务
│       ├── src/
│       │   ├── index.ts       # 服务器入口
│       │   └── mock.ts        # 模拟数据
│       └── package.json
├── packages/
│   └── types/             # 共享TypeScript类型定义
│       └── src/index.ts
├── docs/                  # 项目文档
│   ├── world-state-management.md    # 世界状态管理系统文档
│   └── implementation-plan.md       # 实现计划
└── package.json           # 根目录配置
```

### 技术栈

#### 前端
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI库**: Chakra UI
- **状态管理**: React Query + Context API
- **实时通信**: Socket.IO Client

#### 后端  
- **运行时**: Node.js + Express
- **语言**: TypeScript
- **实时通信**: Socket.IO
- **数据存储**: 内存存储 (开发阶段) → PostgreSQL (生产环境)

#### 开发工具
- **包管理**: npm workspaces
- **代码规范**: ESLint + Prettier
- **类型检查**: TypeScript严格模式
- **开发环境**: VS Code Dev Container

## 🎮 核心功能详解

### 1. Discord风格界面
- **世界侧边栏**: 快速切换不同的游戏世界
- **频道系统**: 
  - 📢 世界公告 (只读)
  - 📚 规则与传说 (知识库)
  - 👥 场外闲聊 (OOC)
  - ⚔️ 场景频道 (IC) - 多个游戏场景
- **成员列表**: 显示在线玩家和角色状态
- **实时消息**: 支持文字、系统消息、行动指令

### 2. 智能世界状态管理 🧠

这是Weave的核心创新，通过**外置结构化知识库**解决LLM记忆限制问题。

#### 核心数据结构
```typescript
interface WorldState {
  world_info: {
    name: string
    description: string
    genre: string
    themes: string[]
    current_time: string
    weather?: string
  }
  characters: Record<string, PlayerCharacter>      // 角色状态
  key_events_log: TimelineEvent[]                 // 事件日志
  npc_status: Record<string, NPCState>            // NPC状态
  locations: Record<string, Location>             // 地点信息
  items: Record<string, Item>                     // 物品道具
  active_plots: Plot[]                            // 活跃剧情
  rules: Rule[]                                   // 游戏规则
  lore: LoreEntry[]                              // 世界传说
}
```

#### 智能上下文生成
```
AI上下文 = [最近聊天记录] + [相关角色状态] + [当前位置信息] + 
          [活跃剧情] + [相关NPC状态] + [适用规则]
```

### 3. 角色系统
- **完整角色卡**: 姓名、职业、属性、装备、关系网
- **状态追踪**: HP、位置、物品、个人目标
- **关系管理**: 角色间关系和NPC关系的动态追踪
- **个人知识库**: 每个角色已知的世界信息和秘密

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 9+
- 现代浏览器 (支持ES2020+)

### 安装和运行

1. **克隆项目**
```bash
git clone https://github.com/ComfyFluffy/weave-project.git
cd weave-project
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
# 启动后端服务 (端口 3001)
npm run dev:backend

# 启动前端应用 (端口 5173)
npm run dev:frontend
```

4. **访问应用**
- 前端: http://localhost:5173
- 后端API: http://localhost:3001

### 开发命令
```bash
# 构建整个项目
npm run build

# 运行类型检查
npm run type-check

# 运行代码检查
npm run lint

# 清理构建文件
npm run clean
```

## 📖 使用指南

### 1. 创建角色
1. 选择或创建一个世界
2. 点击"角色创建"按钮
3. 填写角色信息：名称、职业、描述
4. 设置初始属性和装备
5. 确认创建并进入游戏

### 2. 游戏流程
1. **选择频道**: 根据需要选择公告、闲聊或场景频道
2. **角色扮演**: 在IC频道中以角色身份进行互动
3. **状态更新**: 角色状态会根据游戏进展自动更新
4. **查看信息**: 通过角色面板查看详细状态和关系

### 3. GM功能 (开发中)
- 世界状态管理面板
- NPC和剧情管理工具
- 事件时间线查看
- AI辅助内容生成

## 🔧 开发指南

### 项目规范
- **代码风格**: 遵循ESLint和Prettier配置
- **提交信息**: 使用[Conventional Commits](https://www.conventionalcommits.org/)格式
- **类型安全**: 所有代码必须通过TypeScript严格模式检查

### 贡献流程
1. Fork项目并创建功能分支
2. 进行开发并编写测试
3. 确保代码通过所有检查
4. 提交Pull Request

### 核心概念
- **World**: 游戏世界，包含频道、成员、状态
- **Channel**: 聊天频道，不同类型服务不同目的
- **Character**: 玩家角色，包含完整的游戏状态
- **WorldState**: 结构化的世界状态数据
- **Message**: 聊天消息，支持多种类型

## 📚 相关文档

- [世界状态管理系统详解](./docs/world-state-management.md)
- [实现计划和路线图](./docs/implementation-plan.md)
- [API文档](./docs/api.md) (待完善)
- [部署指南](./docs/deployment.md) (待完善)

## 🛣️ 开发路线图

### Phase 1: 基础架构 (已完成)
- [x] 项目架构搭建
- [x] Discord风格界面
- [x] 基础聊天功能
- [x] 角色创建系统

### Phase 2: 世界状态管理 (进行中)
- [x] 类型定义完善
- [ ] 状态管理API
- [ ] GM控制面板
- [ ] 实时状态同步

### Phase 3: AI集成 (计划中)
- [ ] LLM接口集成
- [ ] 智能内容生成
- [ ] 自动状态更新
- [ ] AI辅助决策

### Phase 4: 高级功能 (远期)
- [ ] 移动端适配
- [ ] 多语言支持
- [ ] 插件系统
- [ ] 社区功能

## 🤝 贡献

欢迎所有形式的贡献！无论是bug报告、功能建议、代码提交还是文档完善。

### 如何贡献
1. 查看[Issues](https://github.com/ComfyFluffy/weave-project/issues)寻找感兴趣的任务
2. Fork项目并创建分支
3. 进行开发并测试
4. 提交Pull Request

### 贡献者
感谢所有为项目做出贡献的开发者！

## 📄 许可证

本项目采用MIT许可证 - 查看[LICENSE](LICENSE)文件了解详情。

## ⭐ 支持项目

如果这个项目对你有帮助，请给我们一个星标⭐！

---

**Weave** - 让AI成为你最好的游戏伙伴 🎲✨
