# 世界状态管理系统 - 实现计划 (更新版)

## 当前状态分析

### 已完成功能

- ✅ Discord-like 聊天界面
- ✅ 基础的世界和频道管理
- ✅ 角色选择和创建系统
- ✅ 实时消息传递 (Socket.IO)
- ✅ **完整的世界状态数据结构定义**
- ✅ **内存数据库实现**
- ✅ **示例数据集和完整的世界场景**
- ✅ **完整的API路由系统**
- ✅ **数据库服务层实现**

### 现有数据结构

- ✅ 基础的 `WorldState` 接口已定义
- ✅ 完整的角色、世界、消息类型
- ✅ 内存数据存储 (mock.ts) 已实现
- ✅ 物品系统、剧情系统、事件日志等完整实现
- ✅ 完整的API路由系统，支持所有实体的CRUD操作

## 下一步实现重点

### 1. 扩展世界状态数据结构 ✅ (已完成)

- [x] 更新 TypeScript 类型定义
- [x] 包含所有新的实体类型 (NPCState, Location, Plot 等)
- [x] 建立关系型数据结构

### 2. 实现基础的状态管理 API

**优先级: 高** ✅ (已完成)

#### 后端 API 路由 (完整实现)

```typescript
// 获取世界状态
GET /api/world-states/:id

// 更新世界状态 (完整替换)
PUT /api/world-states/:id

// 更新世界状态 (部分更新)
PATCH /api/world-states/:id

// 删除世界状态
DELETE /api/world-states/:id

// 获取特定实体
GET /api/world-states/:id/characters
GET /api/world-states/:id/characters/:characterId
GET /api/world-states/:id/locations
GET /api/world-states/:id/locations/:locationName
GET /api/world-states/:id/plots
GET /api/world-states/:id/plots/:plotTitle
GET /api/world-states/:id/events

// 添加新实体
POST /api/world-states/:id/characters
POST /api/world-states/:id/locations
POST /api/world-states/:id/plots
POST /api/world-states/:id/events

// 更新实体
PUT /api/world-states/:id/characters/:characterId
PUT /api/world-states/:id/locations/:locationName
PUT /api/world-states/:id/plots/:plotTitle

// 删除实体
DELETE /api/world-states/:id/characters/:characterId
DELETE /api/world-states/:id/locations/:locationName
DELETE /api/world-states/:id/plots/:plotTitle
```

#### 已实现的功能

1. ✅ **状态读取服务**: 从内存/数据库获取世界状态
2. ✅ **状态更新服务**: 支持部分更新，保持数据一致性
3. ✅ **事件记录系统**: 自动记录重要的游戏事件
4. **变更通知**: 通过 Socket.IO 实时通知状态变化 (待实现)

### 3. 创建世界状态管理界面

**优先级: 高** (进行中)

#### GM 控制面板组件

```typescript
// 主要组件列表
- WorldStateOverview: 世界状态总览
- CharacterStatusPanel: 角色状态面板
- NPCManager: NPC 管理器
- EventTimeline: 事件时间线
- PlotTracker: 剧情追踪器
- LocationExplorer: 地点浏览器
```

#### 玩家视图组件

```typescript
- CharacterSheet: 角色信息面板
- PersonalJournal: 个人日志
- KnownLore: 已知传说/知识
- RelationshipMap: 关系图
```

#### 当前进度

- [ ] WorldStateOverview: 世界状态总览
- [ ] CharacterStatusPanel: 角色状态面板
- [ ] NPCManager: NPC 管理器
- [ ] EventTimeline: 事件时间线
- [ ] PlotTracker: 剧情追踪器
- [ ] LocationExplorer: 地点浏览器

### 4. 智能状态更新系统

**优先级: 中**

#### 消息分析器

- 监听聊天消息
- 识别需要更新世界状态的事件
- 提取结构化信息

#### 自动更新触发器

- 角色 HP/位置变化
- 新 NPC 出现
- 重要决策或对话
- 场景转换

### 5. 上下文生成系统

**优先级: 中**

#### 智能过滤器

- 根据当前场景过滤相关信息
- 按重要性和时间排序
- 控制上下文长度

#### LLM 集成准备

- 设计 prompt 模板
- 上下文格式化
- API 接口设计

## 实现顺序 (接下来2周)

### Week 1: 基础设施 ✅ (已完成)

1. **Day 1-2**: 完善后端 API 路由以匹配现有的类型定义 ✅
2. **Day 3-4**: 实现状态管理服务层 ✅
3. **Day 5-7**: 创建 GM 控制面板的基础组件结构

### Week 2: 功能实现

1. **Day 8-10**: 实现世界状态的增删改查功能 ✅
2. **Day 11-12**: 添加实时状态同步 (Socket.IO)
3. **Day 13-14**: 创建基础的状态管理界面

## 具体文件结构

### 后端现有文件

```
apps/backend/src/
├── services/
│   ├── database.interface.ts   # 数据库服务接口
│   ├── database.memory.ts      # 内存数据库实现
│   └── aiService.ts            # AI服务
├── routes/
│   ├── world-states.ts         # 世界状态 API 路由
│   ├── characters.ts           # 角色 API 路由
│   ├── items.ts                # 物品 API 路由
│   ├── messages.ts             # 消息 API 路由
│   ├── users.ts                # 用户 API 路由
│   ├── worlds.ts               # 世界 API 路由
│   └── ai.ts                   # AI API 路由
└── mock.ts                     # 示例数据
```

### 前端新增文件

```
apps/frontend/src/
├── components/
│   └── WorldState/
│       ├── GMPanel/
│       │   ├── WorldStateOverview.tsx
│       │   ├── CharacterStatusPanel.tsx
│       │   ├── NPCManager.tsx
│       │   ├── EventTimeline.tsx
│       │   └── PlotTracker.tsx
│       └── PlayerView/
│           ├── CharacterSheet.tsx
│           ├── PersonalJournal.tsx
│           └── KnownLore.tsx
├── hooks/
│   ├── useWorldState.ts       # 世界状态管理 hook
│   ├── useStateUpdates.ts     # 状态更新 hook
│   └── useEventHistory.ts     # 事件历史 hook
└── services/
    └── worldStateApi.ts       # 世界状态 API 客户端
```

## 技术实现细节

### 数据更新策略

1. **乐观更新**: 前端立即显示变化，后台异步同步
2. **冲突解决**: 基于时间戳的冲突解决机制
3. **批量更新**: 相关的状态变化合并为单次更新

### 性能考虑

1. **增量更新**: 只同步变化的数据
2. **智能缓存**: 缓存常用查询
3. **懒加载**: 按需加载详细信息

### 用户体验

1. **即时反馈**: 所有操作都有即时的视觉反馈
2. **离线支持**: 基础功能在离线状态下可用
3. **键盘快捷键**: 为常用操作提供快捷键

## 成功指标

### 第一阶段目标 (2周后)

- [x] 新的类型定义完全实现
- [x] 基础的状态 CRUD API 可用
- [ ] GM 可以通过界面查看和编辑世界状态
- [ ] 状态变化能实时同步到所有客户端
- [ ] 至少完成 3 个核心组件 (概览、角色面板、事件时间线)

### 验收标准

1. GM 可以添加、编辑、删除 NPC ✅
2. 角色状态变化会自动记录到事件日志 ✅
3. 玩家可以查看自己的角色详细信息
4. 所有状态变化都会实时同步
5. 界面响应速度 < 200ms

## 风险和挑战

### 技术风险

1. **数据一致性**: 多用户同时编辑可能导致冲突
2. **性能问题**: 复杂的状态结构可能影响性能
3. **类型安全**: 复杂的嵌套类型可能导致类型错误

### 解决方案

1. 实现适当的锁机制和冲突解决
2. 使用性能监控和优化工具
3. 完善的类型测试和验证

---

这个更新后的实现计划反映了项目的实际进展，并为下一步开发提供了明确的指导。