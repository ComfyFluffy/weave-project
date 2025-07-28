# 世界状态管理系统 (World State Management System)

## 概述

世界状态管理系统是 Weave 项目的核心功能之一，旨在解决大语言模型(LLM)在长期对话中的记忆丢失问题。通过维护一个结构化的、持续更新的世界状态数据库，确保 AI 助手和游戏主持人能够基于准确的历史信息做出决策。

## 核心理念

### 问题定义
- **LLM 记忆限制**: 传统 LLM 在长对话中会逐渐"遗忘"早期的重要信息
- **上下文窗口限制**: 无法将所有历史对话都放入 prompt 中
- **信息碎片化**: 重要的游戏状态信息散布在聊天记录中，难以提取和维护

### 解决方案
通过**外置的结构化知识库**替代依赖 LLM 原生记忆，将世界状态抽象为可查询、可更新的数据结构。

## 系统架构

### 1. 世界状态数据结构

```typescript
interface WorldState {
  // 基础世界信息
  world_info: {
    name: string
    description: string
    genre: string
    themes: string[]
    current_time: string
    weather?: string
  }
  
  // 角色状态管理
  characters: Record<string, PlayerCharacter>
  
  // 重要事件日志
  key_events_log: TimelineEvent[]
  
  // NPC 状态和关系
  npc_status: Record<string, NPCState>
  
  // 地点和场景信息
  locations: Record<string, Location>
  
  // 物品和道具
  items: Record<string, Item>
  
  // 活跃的剧情线
  active_plots: Plot[]
  
  // 世界规则和机制
  rules: Rule[]
  
  // 知识库和传说
  lore: LoreEntry[]
}
```

### 2. 数据更新机制

#### 自动更新触发器
- 角色状态变化 (HP、位置、物品获得等)
- 重要对话或决策发生
- 新 NPC 出现或态度改变
- 场景转换
- 剧情节点达成

#### 更新工作流
1. **事件检测**: 监听聊天消息，识别需要更新世界状态的事件
2. **信息提取**: 使用 LLM 从对话中提取结构化信息
3. **状态更新**: 将提取的信息合并到现有世界状态中
4. **验证检查**: 确保更新后的状态逻辑一致
5. **通知同步**: 通知相关用户状态变化

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
- **基础属性**: HP、MP、经验值、等级
- **位置追踪**: 当前位置、移动历史
- **物品管理**: 装备、消耗品、关键物品
- **关系网络**: 与其他角色和 NPC 的关系状态
- **个人目标**: 当前任务和长期目标

### 2. 世界事件日志
```typescript
interface TimelineEvent {
  id: string
  timestamp: Date
  type: 'story' | 'combat' | 'social' | 'exploration' | 'system'
  title: string
  description: string
  participants: string[]
  location: string
  consequences: string[]
  importance: 'low' | 'medium' | 'high' | 'critical'
}
```

### 3. NPC 管理系统
```typescript
interface NPCState {
  id: string
  name: string
  description: string
  current_location: string
  personality_traits: string[]
  relationships: Record<string, Relationship>
  knowledge: string[]
  goals: string[]
  secrets: string[]
  last_interaction: Date
  disposition: 'hostile' | 'unfriendly' | 'neutral' | 'friendly' | 'allied'
}
```

### 4. 地点和场景管理
```typescript
interface Location {
  id: string
  name: string
  description: string
  type: 'town' | 'dungeon' | 'wilderness' | 'building' | 'other'
  connected_locations: string[]
  notable_features: string[]
  current_occupants: string[]
  hidden_secrets: string[]
  danger_level: number
}
```

### 5. 剧情线管理
```typescript
interface Plot {
  id: string
  title: string
  description: string
  status: 'active' | 'completed' | 'failed' | 'paused'
  participants: string[]
  key_events: string[]
  next_steps: string[]
  deadline?: Date
  importance: 'main' | 'side' | 'personal'
}
```

## 用户界面设计

### 1. GM 控制面板
- **世界状态概览**: 显示关键信息摘要
- **角色状态面板**: 实时查看所有角色状态
- **事件时间线**: 可视化重要事件序列
- **NPC 管理器**: 快速查看和编辑 NPC 信息
- **剧情追踪器**: 管理活跃的剧情线

### 2. 玩家视图
- **角色面板**: 查看自己的角色状态
- **已知信息**: 角色已获得的知识和线索
- **关系图**: 与其他角色和 NPC 的关系
- **个人日志**: 重要事件的个人记录

### 3. 智能助手集成
- **状态查询**: 通过自然语言查询世界状态
- **建议生成**: 基于当前状态生成剧情建议
- **一致性检查**: 自动检测状态矛盾并提醒
- **自动更新**: 根据对话内容自动更新相关状态

## 实现计划

### Phase 1: 基础架构 (当前阶段)
- [x] 定义核心数据结构
- [ ] 实现基础的状态存储和检索
- [ ] 创建简单的更新 API
- [ ] 建立基础的 GM 控制面板

### Phase 2: 智能更新
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
- **开发阶段**: 内存存储 + JSON 文件备份
- **生产环境**: PostgreSQL + Redis 缓存
- **实时同步**: Socket.IO 事件驱动更新

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

这个系统将成为 Weave 平台的核心竞争优势，通过解决传统 TRPG 工具的记忆和状态管理问题，为用户提供前所未有的沉浸式体验。
