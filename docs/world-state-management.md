# 世界状态管理系统 (World State Management System)

## 概述

世界状态管理系统是 Weave 项目的核心功能之一，旨在解决大语言模型(LLM)在长期对话中的记忆丢失问题。通过维护一个结构化的、持续更新的世界状态数据库，确保 AI 助手和游戏主持人能够基于准确的历史信息做出决策。

## 当前实现状态

**注意：此文档已更新以反映当前的实际实现状态，而非原始计划。**

系统目前已完成基础架构实现：

- [x] 定义完整的核心数据结构（位于 `packages/types`）
- [x] 实现基础的状态存储和检索（内存数据库）
- [x] 创建完整的示例数据集和世界场景
- [x] 建立完整的前后端通信接口
- [x] 实现完整的API路由系统（CRUD操作）
- [x] 实现数据库服务层

## 核心理念

### 问题定义

- **LLM 记忆限制**: 传统 LLM 在长对话中会逐渐"遗忘"早期的重要信息
- **上下文窗口限制**: 无法将所有历史对话都放入 prompt 中
- **信息碎片化**: 重要的游戏状态信息散布在聊天记录中，难以提取和维护

### 解决方案

通过**外置的结构化知识库**替代依赖 LLM 原生记忆，将世界状态抽象为可查询、可更新的数据结构。

## 系统架构

### 1. 世界状态数据结构

当前已在 `@weave/types` 包中完整实现：

```typescript
interface WorldState {
  // 基础世界信息
  id: string
  worldId: string

  // 角色状态管理
  characters: Character[]
  characterStates: Record<Character['id'], CharacterState>

  // 重要事件日志
  keyEventsLog: TimelineEvent[]

  // 地点和场景信息
  locations: Location[]

  // 物品和道具
  items: Record<Item['key'], Item>
  itemTemplates?: ItemTemplate[]

  // 活跃的剧情线
  plots: Plot[]

  // 世界规则和机制
  lore: Lore[]

  // 游戏时间
  currentGameTime: string

  // 世界概述
  outline?: string
}
```

### 2. 数据更新机制

#### 当前实现

目前系统使用内存数据库实现，具备完整的 CRUD 操作能力：

- 世界状态的创建、读取、更新、删除
- 角色、物品、地点等实体的独立管理
- 事件日志的自动记录
- 完整的API路由系统，支持对所有实体的CRUD操作
- 数据库服务层封装，便于后续替换为真实数据库

#### 待实现的自动更新触发器

- 角色状态变化 (HP、位置、物品获得等)
- 重要对话或决策发生
- 新 NPC 出现或态度改变
- 场景转换
- 剧情节点达成
- 实时状态同步（通过WebSocket）

### 3. 智能查询系统

#### 上下文生成

为 LLM 生成最相关的上下文信息：

```
[最近聊天记录 (最后 N 条消息)] +
[相关角色状态] +
[当前位置信息] +
[活跃剧情] +
[相关 NPC 状态] +
[适用规则]
```

#### 智能过滤

- 根据当前场景和角色位置过滤相关信息
- 按时间和重要性排序事件
- 动态调整上下文长度以适应 token 限制

## 功能模块

### 1. 角色状态追踪

已实现的字段包括：

- **基础属性**: HP、MP、经验值、等级等
- **位置追踪**: 当前位置、移动历史
- **物品管理**: 装备、消耗品、关键物品
- **关系网络**: 与其他角色和 NPC 的关系状态
- **个人目标**: 当前任务和长期目标
- **秘密信息**: 隐藏知识和个人秘密
- **已知传说**: 角色发现的 lore 条目

### 2. 世界事件日志

```typescript
interface Event {
  title: string
  type: string // e.g., 'story', 'combat', 'social', 'exploration', 'system'
  gameTime: string // e.g., "1372年，夏末时节，傍晚"
  description: string
  participants: Character['id'][]
  locations: Location['name'][]
  consequences: string[]
  importance: 'low' | 'medium' | 'high' | 'critical'
}
```

### 3. NPC 管理系统

通过通用的 `Character` 接口实现，通过 `isNpc` 字段区分：

- 角色基本信息（名称、描述、头像）
- NPC 特有属性通过 `CharacterState` 管理

### 4. 地点和场景管理

```typescript
interface Location {
  name: string
  description: string
  connectedLocations: string[]
  notableFeatures: string[]
  currentOccupants: string[]
  hiddenSecrets: string[]
  items: Item['key'][]
}
```

### 5. 剧情线管理

```typescript
interface Plot {
  title: string
  description: string
  status: 'active' | 'completed' | 'paused'
  participants: Character['id'][]
  keyEvents: string[]
  nextSteps: string[]
  importance: 'main' | 'side' | 'personal'
}
```

### 6. 物品系统

采用模板+实例的设计模式：

```typescript
// 物品模板 - 可复用的物品定义
interface ItemTemplate {
  name: string
  description: string
  type: 'weapon' | 'armor' | 'consumable' | 'tool' | 'key-item' | 'misc'
  rarity: 'common' | 'uncommon' | 'rare' | 'very-rare' | 'legendary'
  properties: Record<string, string>
  stats: Record<string, number>
}

// 物品实例 - 游戏中的具体物品
type Item = {
  key: string // Unique identifier for each item instance
  count?: number
  templateName?: ItemTemplate['name']
} & Partial<ItemTemplate>
```

## 用户界面设计

### 1. GM 控制面板

计划中的功能模块：

- **世界状态概览**: 显示关键信息摘要
- **角色状态面板**: 实时查看所有角色状态
- **事件时间线**: 可视化重要事件序列
- **NPC 管理器**: 快速查看和编辑 NPC 信息
- **剧情追踪器**: 管理活跃的剧情线

### 2. 玩家视图

计划中的功能模块：

- **角色面板**: 查看自己的角色状态
- **已知信息**: 角色已获得的知识和线索
- **关系图**: 与其他角色和 NPC 的关系
- **个人日志**: 重要事件的个人记录

### 3. 智能助手集成

计划中的功能：

- **状态查询**: 通过自然语言查询世界状态
- **建议生成**: 基于当前状态生成剧情建议
- **一致性检查**: 自动检测状态矛盾并提醒
- **自动更新**: 根据对话内容自动更新相关状态

## 实现计划

### Phase 1: 基础架构 (已完成)

- [x] 定义核心数据结构
- [x] 实现基础的状态存储和检索
- [x] 创建示例数据集
- [x] 建立基础的前后端通信

### Phase 2: 智能更新 (进行中)

- [ ] 实现事件检测和信息提取
- [ ] 开发自动状态更新机制
- [ ] 创建上下文生成系统
- [ ] 集成 LLM 查询功能

### Phase 3: 高级功能

- [ ] 智能冲突检测和解决
- [ ] 自动剧情建议生成
- [ ] 深度 NPC 行为模拟
- [ ] 预测性状态管理

### Phase 4: 用户体验优化

- [ ] 可视化界面完善
- [ ] 移动端适配
- [ ] 协作编辑功能
- [ ] 导入/导出系统

## 技术实现细节

### 数据存储

- **开发阶段**: 内存存储 + JSON 文件备份 (已实现)
- **生产环境**: PostgreSQL + Redis 缓存 (待实现)
- **实时同步**: Socket.IO 事件驱动更新 (部分实现)

### AI 集成

- **状态提取**: 使用专门的 prompt 从对话中提取结构化信息
- **一致性验证**: LLM 辅助检查状态更新的逻辑一致性
- **智能建议**: 基于当前状态生成剧情发展建议

### 性能优化

- **增量更新**: 只更新变化的部分
- **智能缓存**: 缓存常用查询结果
- **异步处理**: 状态更新不阻塞主要流程
- **批量操作**: 合并相关的状态更新

## 成功指标

### 技术指标

- 状态更新延迟 < 500ms
- 上下文生成时间 < 2s
- 数据一致性准确率 > 95%
- API 响应时间 < 100ms

### 用户体验指标

- GM 工作效率提升 50%
- 剧情连贯性评分 > 4.5/5
- 用户满意度 > 90%
- 长期游戏参与度提升 30%

## 扩展规划

### 多世界支持

- 世界模板系统
- 跨世界角色迁移
- 世界融合和分割功能

### AI 增强功能

- 智能 NPC 对话生成
- 动态剧情生成
- 个性化内容推荐
- 自动世界扩展

### 社区功能

- 世界状态分享
- 模板市场
- 协作编辑
- 版本控制

---

这个系统已成为 Weave 平台的核心功能，通过解决传统 TRPG 工具的记忆和状态管理问题，为用户提供前所未有的沉浸式体验。
