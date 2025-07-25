import { Message, World } from '@weave/types'

// In-memory data store (in production, this would be a database)
export const worlds: World[] = [
  {
    id: '1',
    name: '龙与地下城',
    description: '经典奇幻冒险世界',
    channels: [
      {
        id: '1',
        name: '世界公告',
        type: 'announcement',
        readonly: true,
        description: '重要的世界信息和公告',
      },
      {
        id: '2',
        name: '规则与传说',
        type: 'rules',
        readonly: true,
        description: '世界观、核心规则',
      },
      {
        id: '3',
        name: '角色创建',
        type: 'character-creation',
        description: '创建和管理你的角色',
      },
      {
        id: '4',
        name: '场外闲聊',
        type: 'ooc',
        description: '游戏外的自由交流',
      },
      {
        id: '5',
        name: '场景-酒馆相遇',
        type: 'ic',
        description: '故事开始的地方',
      },
      {
        id: '6',
        name: '场景-深入龙穴',
        type: 'ic',
        description: '危险的冒险场景',
      },
    ],
    members: [
      {
        id: '1',
        username: '游戏主持人',
        role: 'gm',
        character: {
          id: 'gm1',
          name: '智慧老人',
          class: '游戏主持人',
          hp: 100,
          maxHp: 100,
          location: '神域',
          inventory: [],
        },
      },
      {
        id: '2',
        username: '龙骑士玩家',
        role: 'player',
        character: {
          id: 'p1',
          name: '阿尔萨斯',
          class: '圣骑士',
          hp: 85,
          maxHp: 100,
          location: '酒馆',
          inventory: ['神圣剑', '治疗药水'],
        },
      },
      {
        id: '3',
        username: '法师玩家',
        role: 'player',
        character: {
          id: 'p2',
          name: '梅林',
          class: '法师',
          hp: 60,
          maxHp: 80,
          location: '酒馆',
          inventory: ['法杖', '魔法书'],
        },
      },
      {
        id: '4',
        username: '观察者',
        role: 'spectator',
      },
    ],
    state: {
      world_info: {
        name: '龙与地下城',
        description: '经典奇幻冒险世界',
      },
      player_characters: {},
      key_events_log: ['游戏开始'],
      npc_status: {},
    },
  },
  {
    id: '2',
    name: '赛博朋克2077',
    description: '未来科幻世界',
    channels: [
      { id: '7', name: '世界公告', type: 'announcement', readonly: true },
      { id: '8', name: '规则与传说', type: 'rules', readonly: true },
      { id: '9', name: '角色创建', type: 'character-creation' },
      { id: '10', name: '场外闲聊', type: 'ooc' },
      { id: '11', name: '场景-夜之城', type: 'ic' },
    ],
    members: [],
    state: {
      world_info: {
        name: '赛博朋克2077',
        description: '未来科幻世界',
      },
      player_characters: {},
      key_events_log: [],
      npc_status: {},
    },
  },
  {
    id: '3',
    name: '克苏鲁的呼唤',
    description: '恐怖神秘世界',
    channels: [
      { id: '12', name: '世界公告', type: 'announcement', readonly: true },
      { id: '13', name: '规则与传说', type: 'rules', readonly: true },
      { id: '14', name: '角色创建', type: 'character-creation' },
      { id: '15', name: '场外闲聊', type: 'ooc' },
      { id: '16', name: '场景-阿卡姆镇', type: 'ic' },
    ],
    members: [],
    state: {
      world_info: {
        name: '克苏鲁的呼唤',
        description: '恐怖神秘世界',
      },
      player_characters: {},
      key_events_log: [],
      npc_status: {},
    },
  },
]

export const messages: { [channelId: string]: Message[] } = {
  '1': [
    {
      id: '1',
      channelId: '1',
      worldId: '1',
      authorId: 'system',
      authorName: '系统',
      content: '欢迎来到龙与地下城世界！请先在 #角色创建 频道创建你的角色。',
      timestamp: new Date('2024-01-15T10:00:00Z'),
      type: 'system',
    },
    {
      id: '2',
      channelId: '1',
      worldId: '1',
      authorId: 'gm1',
      authorName: '游戏主持人',
      content: '今晚的冒险将在酒馆开始，请所有玩家准备好你们的角色！',
      timestamp: new Date('2024-01-15T14:30:00Z'),
      type: 'user',
    },
  ],
  '5': [
    {
      id: '3',
      channelId: '5',
      worldId: '1',
      authorId: 'gm1',
      authorName: '游戏主持人',
      content:
        '你们进入了一间温暖的酒馆，里面充满了烟草和啤酒的香味。酒保是一个友善的矮人，正在擦拭着酒杯。',
      timestamp: new Date('2024-01-15T20:00:00Z'),
      type: 'user',
    },
    {
      id: '4',
      channelId: '5',
      worldId: '1',
      authorId: 'p1',
      authorName: '龙骑士玩家',
      characterName: '阿尔萨斯',
      content: '我走向酒保，点了一杯麦酒，同时观察着酒馆里的其他客人。',
      timestamp: new Date('2024-01-15T20:05:00Z'),
      type: 'user',
    },
  ],
}
