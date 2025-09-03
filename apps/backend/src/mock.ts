import {
  Message,
  World,
  WorldState,
  Character,
  User,
} from '@weave/types'

// Users
export const users: User[] = [
  {
    id: 'user-1',
    email: 'knight@example.com',
    displayName: '龙骑士玩家',
    avatar: '🛡️',
  },
  {
    id: 'user-2',
    email: 'mage@example.com',
    displayName: '法师玩家',
    avatar: '🔮',
  },
  {
    id: 'user-3',
    email: 'rogue@example.com',
    displayName: '盗贼玩家',
    avatar: '🗡️',
  },
  {
    id: 'gm-1',
    email: 'gm@example.com',
    displayName: '游戏主持人',
    avatar: '🎭',
  },
]

// Characters
export const characters: Character[] = [
  {
    id: 'char-1',
    name: '阿尔萨斯·光明使者',
    description: '一位虔诚的圣骑士，金发碧眼，身着银色盔甲，散发着神圣的光辉',
    avatar: '⚔️',
  },
  {
    id: 'char-2',
    name: '梅林·星辰法师',
    description: '睿智的年轻法师，深蓝色长袍上绣着星辰图案，手持古老法杖',
    avatar: '🔮',
  },
  {
    id: 'char-3',
    name: '影舞者·凯瑟琳',
    description: '敏捷的精灵盗贼，身着黑色皮甲，双眼如夜空般深邃',
    avatar: '🏹',
  },
  {
    id: 'npc-1',
    name: '托尼·铁须',
    description: '金麦酒馆的矮人酒保，红褐色胡须编成辫子，总是笑容满面',
    avatar: '🍺',
  },
  {
    id: 'npc-2',
    name: '艾莉娅·月歌',
    description: '神秘的精灵吟游诗人，银发如瀑，琴声能触动人心',
    avatar: '🎵',
  },
]

// World State
export const worldState: WorldState = {
  id: 'ws-1',
  worldId: '1',
  characters,
  state: {
    keyEventsLog: [
      {
        title: '命运的相遇',
        type: 'story',
        gameTime: '1372年夏末，黄昏时分',
        description: '三位冒险者在金麦酒馆中首次相遇，命运将他们聚集在一起',
        participants: ['char-1', 'char-2', 'char-3'],
        locations: ['金麦酒馆'],
        consequences: ['冒险小队成立', '获得了古老遗迹的线索'],
        importance: 'high',
      },
      {
        title: '神秘吟游诗人的预言',
        type: 'story',
        gameTime: '1372年夏末，深夜',
        description: '精灵吟游诗人艾莉娅唱起了关于古老诅咒的歌谣',
        participants: ['char-1', 'char-2', 'char-3', 'npc-2'],
        locations: ['金麦酒馆'],
        consequences: ['了解到遗迹的真正危险', '获得了破解诅咒的线索'],
        importance: 'critical',
      },
      {
        title: '午夜的袭击',
        type: 'combat',
        gameTime: '1372年夏末，午夜',
        description: '暗影生物突然袭击酒馆，冒险者们迎来第一场战斗',
        participants: ['char-1', 'char-2', 'char-3', 'npc-1'],
        locations: ['金麦酒馆'],
        consequences: ['击败了暗影狼群', '发现敌人与遗迹有关', '托尼受伤'],
        importance: 'high',
      },
    ],
    items: {
      // Item instances with required properties
      'holy-sword': {
        key: 'holy-sword',
        count: 1,
        name: '圣光之剑',
        description: '散发神圣光芒的双手剑，对邪恶生物造成额外伤害',
        type: 'weapon',
        rarity: 'rare',
        properties: {
          enchantment: '神圣',
          material: '秘银',
          weaponType: '双手剑',
          special: '对邪恶生物+2伤害',
        },
        stats: { damage: 12, accuracy: 8, durability: 100 },
      },
      'star-staff': {
        key: 'star-staff',
        count: 1,
        name: '星辰法杖',
        description: '顶端镶嵌蓝宝石的橡木法杖，夜晚会发出微光',
        type: 'weapon',
        rarity: 'rare',
        properties: {
          enchantment: '星辰之力',
          material: '月桂木',
          weaponType: '法杖',
          special: '+1法术攻击',
        },
        stats: { spellPower: 10, manaRegeneration: 2, durability: 80 },
      },
      'moon-blade': {
        key: 'moon-blade',
        count: 1,
        name: '月影短剑',
        description: '锋利的精灵短剑，刀身如月光般闪烁',
        type: 'weapon',
        rarity: 'uncommon',
        properties: {
          enchantment: '月影',
          material: '精灵钢',
          weaponType: '短剑',
          special: '潜行时+2攻击',
        },
        stats: { damage: 8, accuracy: 12, durability: 90 },
      },
      'health-potion': {
        key: 'health-potion',
        count: 1,
        name: '治疗药水',
        description: '恢复生命值的红色药剂',
        type: 'consumable',
        rarity: 'common',
        properties: {
          effect: '治疗',
          consumeType: '饮用',
          stackable: 'true',
        },
        stats: { healing: 30, charges: 1 },
      },
      'fireball-scroll': {
        key: 'fireball-scroll',
        count: 1,
        name: '魔法卷轴：火球术',
        description: '施放火球术的一次性卷轴',
        type: 'consumable',
        rarity: 'uncommon',
        properties: {
          spell: '火球术',
          level: '3',
          consumeType: '施法',
        },
        stats: { damage: 28, range: 150, charges: 1 },
      },
      'ancient-map': {
        key: 'ancient-map',
        count: 1,
        name: '古老的地图',
        description: '绘制在羊皮纸上的褪色地图，标记着附近遗迹的位置',
        type: 'key-item',
        rarity: 'rare',
        properties: {
          mapType: '遗迹位置',
          region: '绿谷镇北方森林',
          condition: '古旧但清晰',
        },
        stats: { authenticity: 95 },
      },
      'elf-coins': {
        key: 'elf-coins',
        count: 12,
        name: '精灵硬币',
        description: '古老的精灵制造的银币，上面刻着月亮符号',
        type: 'misc',
        rarity: 'uncommon',
        properties: {
          era: '月隐之城时代',
          material: '精灵银',
          condition: '保存完好',
        },
        stats: { value: 50 },
      },
    },
    characterStates: {
      'char-1': {
        currentLocationName: '金麦酒馆',
        inventory: ['holy-sword', 'health-potion'],
        stats: {
          health: { current: 95, max: 100 },
          mana: { current: 25, max: 30 },
          stamina: { current: 80, max: 85 },
        },
        attributes: {
          strength: 16,
          constitution: 14,
          wisdom: 13,
          charisma: 15,
          dexterity: 12,
          intelligence: 11,
        },
        properties: {
          class: '圣骑士',
          level: '3',
          armorClass: '18',
          proficiencyBonus: '+2',
          savingThrows: 'Wisdom +5, Charisma +7',
        },
        knowledge: {
          religions: ['圣光教义', '邪恶生物知识'],
          locations: ['绿谷镇历史', '金麦酒馆'],
          people: ['托尼·铁须', '艾莉娅·月歌'],
        },
        goals: {
          primary: ['保护无辜的人民', '净化古老遗迹的邪恶'],
          personal: ['寻找失踪的导师', '证明自己的虔诚'],
          party: ['帮助凯瑟琳找到妹妹', '阻止暗影之主苏醒'],
        },
        secrets: {
          personal: ['曾在梦中听到神明的低语', '对自己的信仰偶有怀疑'],
          discovered: ['知道遗迹的大概位置', '了解暗影生物的弱点'],
        },
        discoveredLores: ['绿谷镇的建立', '月光之泪的传说'],
      },
      'char-2': {
        currentLocationName: '金麦酒馆',
        inventory: ['star-staff', 'fireball-scroll'],
        stats: {
          health: { current: 68, max: 75 },
          mana: { current: 45, max: 60 },
          focus: { current: 85, max: 90 },
        },
        attributes: {
          intelligence: 16,
          dexterity: 14,
          constitution: 12,
          wisdom: 13,
          strength: 10,
          charisma: 11,
        },
        properties: {
          class: '法师',
          level: '3',
          armorClass: '12',
          proficiencyBonus: '+2',
          spellcastingAbility: 'Intelligence',
          spellSaveDC: '14',
        },
        knowledge: {
          magic: ['奥术理论', '法术组合', '魔法物品识别'],
          languages: ['古代语言', '精灵语', '龙语'],
          lore: ['星象学', '遗迹传说', '月隐之城历史'],
        },
        goals: {
          primary: ['掌握更高级的魔法', '研究古老遗迹的魔法奥秘'],
          personal: ['寻找失落的法术', '证明自己的学术价值'],
          party: ['用知识帮助队友', '解开遗迹的魔法谜题'],
        },
        secrets: {
          personal: ['家族中有黑魔法师的血统', '偷偷研究禁忌魔法'],
          discovered: ['知道破解封印的部分方法', '察觉到艾莉娅隐瞒了什么'],
        },
        discoveredLores: ['绿谷镇的建立', '月光之泪的传说'],
      },
      'char-3': {
        currentLocationName: '金麦酒馆',
        inventory: ['moon-blade'],
        stats: {
          health: { current: 72, max: 78 },
          stealth: { current: 95, max: 100 },
          luck: { current: 60, max: 80 },
        },
        attributes: {
          dexterity: 16,
          constitution: 14,
          intelligence: 13,
          wisdom: 14,
          strength: 12,
          charisma: 10,
        },
        properties: {
          class: '盗贼',
          level: '3',
          armorClass: '13',
          proficiencyBonus: '+2',
          sneakAttack: '2d6',
          expertise: '潜行, 撬锁',
        },
        knowledge: {
          streetwise: ['街头智慧', '地下组织', '黑市交易'],
          skills: ['陷阱识别', '撬锁技巧', '潜行技术'],
          secrets: ['绿谷镇秘密通道', '商队路线'],
        },
        goals: {
          primary: ['寻找失散的妹妹莉亚', '找到商队失踪的真相'],
          personal: ['证明自己的价值', '摆脱盗贼公会的过去'],
          party: ['保护队友的安全', '利用技能帮助探索'],
        },
        secrets: {
          personal: ['曾是盗贼公会成员', '妹妹被拐卖的真相'],
          discovered: ['知道几个密道入口', '察觉到托尼隐瞒了什么'],
        },
        discoveredLores: ['绿谷镇的建立'],
      },
    },
    locations: [
      {
        name: '金麦酒馆',
        description:
          '绿谷镇最受欢迎的酒馆，由矮人托尼经营。温暖的壁炉，舒适的座椅，总是充满欢声笑语。二楼有客房，地下室储存着美酒。',
        connectedLocations: ['绿谷镇广场', '酒馆后院', '地下酒窖'],
        notableFeatures: [
          '古老的橡木吧台',
          '巨大的石头壁炉',
          '挂满冒险者徽章的墙壁',
          '角落里的吟游诗人舞台',
        ],
        currentOccupants: [
          '托尼·铁须',
          '阿尔萨斯·光明使者',
          '梅林·星辰法师',
          '影舞者·凯瑟琳',
          '艾莉娅·月歌',
        ],
        hiddenSecrets: [
          '地下室有通往古老下水道的密门',
          '吧台下藏着一把古老的精灵短剑',
          '壁炉后有秘密隔间',
        ],
        items: ['ancient-map', 'elf-coins', 'health-potion'],
      },
    ],
    plots: [
      {
        title: '遗落的精灵遗迹',
        description:
          '在绿谷镇北方的森林深处，隐藏着一座古老的精灵遗迹。传说中，那里封印着强大的魔法力量，但也潜藏着古老的诅咒。最近，遗迹周围出现了异常现象，暗影生物开始活跃，威胁着附近的村庄。',
        status: 'active',
        participants: ['char-1', 'char-2', 'char-3'],
        keyEvents: ['获得古老地图', '听到艾莉娅的预言', '遭遇暗影生物袭击'],
        nextSteps: ['深入了解遗迹历史', '准备探索装备', '寻找进入遗迹的方法'],
        importance: 'main',
      },
      {
        title: '消失的商队',
        description:
          '最近有几支商队在前往绿谷镇的路上神秘消失，只留下被破坏的马车和诡异的爪痕。村民们怀疑这与遗迹的异常现象有关。',
        status: 'active',
        participants: ['char-1', 'char-2', 'char-3'],
        keyEvents: ['听到村民的传言'],
        nextSteps: ['调查商队消失的现场', '寻找幸存者'],
        importance: 'side',
      },
    ],
    lore: [
      {
        title: '绿谷镇的建立',
        content:
          '绿谷镇建立在古老精灵文明的废墟之上。一千多年前，这里曾是繁荣的精灵城市月隐之城，以其美丽的月光花园和强大的魔法学院而闻名。然而，一场神秘的灾难摧毁了这座城市，只留下废墟和传说。人类在废墟上建立了绿谷镇，但古老的魔法力量仍然在地下流淌。',
        accessLevel: 'public',
      },
      {
        title: '月光之泪的传说',
        content:
          '传说在遗迹的最深处，保存着一颗名为"月光之泪"的神秘宝石。这颗宝石拥有强大的魔法力量，可以净化一切邪恶，但同时也被古老的诅咒所保护。只有纯洁之心的人才能触碰它而不被诅咒吞噬。',
        accessLevel: 'player-discovered',
      },
      {
        title: '暗影之主的苏醒',
        content:
          '在精灵文明灭亡时，一个强大的邪恶存在被封印在遗迹深处。它被称为暗影之主，拥有操控阴影和亡灵的能力。最近封印开始松动，暗影生物的出现就是它苏醒的征兆。如果封印完全破裂，整个地区都将陷入永恒的黑暗。',
        accessLevel: 'gm-only',
      },
    ],
    currentGameTime: '1372年夏末，午夜过后',
    outline:
      '冒险者们在金麦酒馆相遇，得知了古老精灵遗迹的秘密。他们必须深入危险的遗迹，寻找传说中的月光之泪，阻止暗影之主的苏醒，拯救绿谷镇和周边地区。',
  },
}

// Second World State for Cyberpunk world
export const worldState2: WorldState = {
  id: 'ws-2',
  worldId: '2',
  characters: [], // Different characters for cyberpunk world
  state: {
    characterStates: {}, // Empty character states for now
    keyEventsLog: [
      {
        title: '数据泄露事件',
        type: 'story',
        gameTime: '2087年11月15日，22:30',
        description: '阿拉萨卡公司的机密数据被神秘黑客泄露',
        participants: [],
        locations: ['数字风暴酒吧'],
        consequences: ['企业开始搜捕黑客', '街头紧张气氛升级'],
        importance: 'high',
      },
    ],
    items: {},
    locations: [
      {
        name: '数字风暴',
        description: '位于地下的黑客酒吧，充满霓虹灯和网络终端',
        connectedLocations: ['阿拉萨卡高塔'],
        notableFeatures: ['黑客聚集地', '安全的交易场所'],
        currentOccupants: [],
        hiddenSecrets: [],
        items: [],
      },
      {
        name: '阿拉萨卡高塔',
        description: '企业巨头的摩天大楼，象征着公司的权力',
        connectedLocations: ['数字风暴'],
        notableFeatures: ['高度安防', '企业总部'],
        currentOccupants: [],
        hiddenSecrets: [],
        items: [],
      },
    ],
    plots: [],
    lore: [
      {
        title: '新东京的现状',
        content: '2087年的新东京被大企业统治，街头充满了改造人和AI',
        accessLevel: 'public',
      },
    ],
    currentGameTime: '2087年11月15日，深夜',
    outline: '在企业统治的未来东京，一群边缘人必须在生存与反抗之间做出选择',
  },
}

// In-memory data store (in production, this would be a database)
export const worlds: World[] = [
  {
    id: '1',
    name: '龙与地下城：绿谷镇传说',
    description:
      '在古老精灵文明废墟上建立的人类小镇，充满了魔法、冒险和未知的危险',
    tags: ['奇幻', '冒险', '魔法', '精灵遗迹'],
    rules: '使用D&D 5e规则系统，重视角色扮演和创造性解决问题',
    channels: [
      {
        id: '1',
        worldId: '1',
        name: '酒馆-金麦酒馆',
        type: 'ic',
        description: '冒险开始的地方，温暖的酒馆里充满了故事和机遇',
        worldStateId: 'ws-1',
      },
    ],
  },
  {
    id: '2',
    name: '赛博朋克2087：新东京',
    description:
      '在2087年的新东京，科技与人性的边界模糊，企业统治着霓虹灯下的街道',
    tags: ['赛博朋克', '科幻', '未来', '企业'],
    rules: '使用赛博朋克RED规则系统，注重黑客技术和企业阴谋',
    channels: [
      {
        id: '4',
        worldId: '2',
        name: '酒吧-数字风暴',
        type: 'ic',
        description: '黑客和边缘人聚集的地下酒吧',
        worldStateId: 'ws-2',
      },
      {
        id: '5',
        worldId: '2',
        name: '企业区-高塔',
        type: 'ic',
        description: '阿拉萨卡公司的摩天大楼',
        worldStateId: 'ws-2',
      },
    ],
  },
]

export const messages: { [channelId: string]: Message[] } = {
  '1': [
    {
      id: '1',
      channelId: '1',
      userId: 'gm-1',
      type: 'gm',
      content:
        '**【夏末的黄昏，金麦酒馆】**\n\n温暖的灯光透过琥珀色的玻璃窗洒向外面逐渐暗淡的街道。酒馆内弥漫着麦酒的香甜和炖肉的浓香，壁炉中的火焰跳跃着，在石制的墙壁上投下舞动的影子。几张橡木圆桌散落在大厅中，吧台后的矮人酒保托尼正哼着古老的矮人歌谣擦拭着酒杯。\n\n这是一个普通的夜晚...或者说，看起来是这样。',
      createdAt: new Date('2024-08-01T19:00:00Z'),
    },
    {
      id: '2',
      channelId: '1',
      userId: 'user-1',
      characterId: 'char-1',
      type: 'character',
      content:
        '*推开酒馆厚重的橡木门，银色盔甲在火光映照下闪闪发亮*\n\n"愿圣光保佑这座温暖的酒馆。" *向酒保点头致意，然后环视四周* "托尼，给我来一杯你这里最好的麦酒。旅途漫长，我的喉咙早已干渴。"\n\n*将圣光之剑小心地靠在吧台边，头盔下金色的头发在火光中泛着微光*',
      createdAt: new Date('2024-08-01T19:05:00Z'),
    },
    {
      id: '3',
      channelId: '1',
      userId: 'gm-1',
      characterId: 'npc-1',
      type: 'character',
      content:
        '*停下手中的活计，露出灿烂的笑容，红褐色的胡须抖动着*\n\n"哈！又来了一位勇敢的骑士！从你的装束看，你一定走了很远的路。" *熟练地倒出一大杯泡沫丰富的金色麦酒* "这是我们酒馆的招牌，绿谷金麦！保证让你忘记旅途的疲劳。"\n\n*压低声音，眼中闪烁着神秘的光芒* "不过，骑士大人，您来得正是时候...最近镇上发生了一些...奇怪的事情。"',
      createdAt: new Date('2024-08-01T19:07:00Z'),
    },
    {
      id: '4',
      channelId: '1',
      userId: 'user-2',
      characterId: 'char-2',
      type: 'character',
      content:
        '*从酒馆角落的阴影中缓缓走出，深蓝色长袍上的银色星座图案在火光下仿佛真的在闪烁*\n\n"奇怪的事情？" *将法杖轻轻撞击地面，发出清脆的回声* "我在这里已经观察了三天，确实感受到了...不寻常的魔法波动。"\n\n*走向吧台，蓝色的眼眸凝视着圣骑士* "看来我不是唯一一个被这种异常吸引到这里来的人。我是梅林，来自北方的星辰法师。你呢，闪亮的骑士？"',
      createdAt: new Date('2024-08-01T19:10:00Z'),
    },
    {
      id: '5',
      channelId: '1',
      userId: 'user-1',
      characterId: 'char-1',
      type: 'character',
      content:
        '*接过麦酒，深深饮了一口，然后转向法师*\n\n"我是阿尔萨斯·光明使者，圣光教会的圣骑士。" *眼神变得严肃* "三天前，我在祈祷中收到了神谕——有古老的邪恶正在苏醒，而绿谷镇就是风暴的中心。"\n\n*向托尼投去询问的目光* "托尼，你刚才提到的奇怪事情...能详细说说吗？或许这与我的神谕有关。"',
      createdAt: new Date('2024-08-01T19:12:00Z'),
    },
    {
      id: '6',
      channelId: '1',
      userId: 'user-3',
      characterId: 'char-3',
      type: 'character',
      content:
        '*如幽灵般无声地出现在吧台旁，黑色皮甲完美地融入阴影*\n\n"看来今晚注定不会平静。" *声音轻柔如夜风，精灵的耳朵微微抖动* "我从屋顶上听到了你们的对话...抱歉，这是职业习惯。"\n\n*优雅地坐在高脚凳上* "我是凯瑟琳，大家叫我影舞者。我来这里是为了寻找我失散的妹妹。" *眼中闪过一丝痛苦* "三周前，她随同一支商队前往这里，然后就...消失了。"',
      createdAt: new Date('2024-08-01T19:15:00Z'),
    },
    {
      id: '7',
      channelId: '1',
      userId: 'gm-1',
      characterId: 'npc-1',
      type: 'character',
      content:
        '*脸色变得凝重，放下手中的酒杯*\n\n"消失的商队...这已经是第三支了。" *低声说道，眼神扫视着三位冒险者* "每次都是在北方森林的同一段路上，马车被发现时空无一人，只留下奇怪的爪痕和...这个。"\n\n*从吧台下拿出一个古老的银币，上面刻着月亮符号* "这是精灵制造的古币，但已经有一千多年的历史了。每次商队消失，现场都会留下这样的硬币。"',
      createdAt: new Date('2024-08-01T19:18:00Z'),
    },
    {
      id: '8',
      channelId: '1',
      userId: 'user-2',
      characterId: 'char-2',
      type: 'character',
      content:
        '*立即上前检查银币，眼中蓝光闪烁*\n\n"这上面有微弱的魔法痕迹！" *施展了一个检测魔法的咒语* "而且...这些符文...我在古代典籍中见过。这是月隐之城的货币，传说中的精灵都市！"\n\n*激动地转向其他人* "如果我的研究没错，绿谷镇就建在月隐之城的废墟上。这些硬币的出现意味着...古老的魔法封印可能正在松动。"',
      createdAt: new Date('2024-08-01T19:20:00Z'),
    },
    {
      id: '9',
      channelId: '1',
      userId: 'user-3',
      characterId: 'char-3',
      type: 'character',
      content:
        '*眯起眼睛，声音中带着决心*\n\n"不管是什么古老的邪恶，如果它伤害了我的妹妹...我会让它付出代价。" *手不自觉地抚摸着月影短剑的剑柄* "托尼，最后一支商队是什么时候消失的？现场还有其他线索吗？"\n\n*看向圣骑士和法师* "看起来我们的目标是一致的。三个人总比一个人更有胜算，你们说呢？"',
      createdAt: new Date('2024-08-01T19:22:00Z'),
    },
    {
      id: '10',
      channelId: '1',
      userId: 'user-1',
      characterId: 'char-1',
      type: 'character',
      content:
        '*坚定地点头，将手放在心脏上*\n\n"圣光指引我保护无辜之人。如果有邪恶威胁着这片土地，我绝不会袖手旁观。" *转向凯瑟琳，眼神温和* "而且，寻找失踪的亲人是神圣的使命。我愿意帮助你找到妹妹。"\n\n*举起酒杯* "那么，就让我们结成同盟吧。圣光会庇佑我们的征程。"',
      createdAt: new Date('2024-08-01T19:25:00Z'),
    },
    {
      id: '11',
      channelId: '1',
      userId: 'user-2',
      characterId: 'char-2',
      type: 'character',
      content:
        '*同样举起酒杯，眼中燃烧着求知的渴望*\n\n"知识就是力量，而你们两位正是我需要的强大盟友。" *微笑着* "一位圣骑士，一位游侠...我们的组合相当均衡。古代魔法的奥秘等待着我们去揭开！"\n\n*突然，酒馆的门再次打开，一阵冷风带着花香吹了进来*',
      createdAt: new Date('2024-08-01T19:27:00Z'),
    },
    {
      id: '12',
      channelId: '1',
      userId: 'gm-1',
      characterId: 'npc-2',
      type: 'character',
      content:
        '*一位银发如瀑的精灵女子踏进酒馆，身着飘逸的绿色长袍，怀抱着一把精美的竖琴*\n\n"晚上好，各位旅者。" *声音如银铃般清脆* "我是艾莉娅·月歌，一名吟游诗人。我感受到了这里聚集的命运之力...或许，我应该为你们唱一首关于月隐之城的古老歌谣？"\n\n*眼中闪烁着深邃的智慧，仿佛看透了时间的迷雾* "那首歌里藏着你们寻找的答案...关于封印，关于诅咒，关于即将到来的危险。"',
      createdAt: new Date('2024-08-01T19:30:00Z'),
    },
    {
      id: '13',
      channelId: '1',
      userId: 'gm-1',
      type: 'gm',
      content:
        '**【命运的交汇】**\n\n酒馆内的气氛突然变得庄重而神秘。艾莉娅优雅地走向角落的小舞台，竖琴弦在她纤细的手指下轻柔地颤动。其他客人不知不觉地安静下来，仿佛被某种古老的魔力所吸引。\n\n月光透过窗棂洒在吟游诗人的银发上，她开始轻柔地拨弄琴弦...',
      createdAt: new Date('2024-08-01T19:32:00Z'),
    },
    {
      id: '14',
      channelId: '1',
      userId: 'gm-1',
      characterId: 'npc-2',
      type: 'character',
      content:
        '*开始轻唱，声音空灵而悠远*\n\n🎵 "月隐之城曾辉煌，银树花开满庭芳，\n魔法学院塔高耸，智慧之光照四方。\n然而黑暗悄然至，暗影之主破封印，\n光明陨落城池毁，唯留废墟诉沧桑...\n\n月光之泪深处藏，纯洁之心方可取，\n三重试炼需通过，勇气智慧与正义。\n若是封印再破碎，永夜将降临大地，\n唯有勇者齐协力，方能重燃希望之火..." 🎵\n\n*歌声渐停，竖琴的余音在空气中轻柔地飘荡*',
      createdAt: new Date('2024-08-01T19:35:00Z'),
    },
    {
      id: '15',
      channelId: '1',
      userId: 'user-1',
      characterId: 'char-1',
      type: 'character',
      content:
        '*深深地被歌声震撼，握紧了拳头*\n\n"月光之泪...这就是我在神谕中看到的光芒！" *眼中燃烧着决心* "艾莉娅，这首歌不是传说，对吗？暗影之主真的存在，而且它正在苏醒？"\n\n*转向同伴们* "看来我们的使命比想象中更加重大。我们不仅要拯救失踪的人们，还要阻止一场可能毁灭世界的灾难。"',
      createdAt: new Date('2024-08-01T19:37:00Z'),
    },
    {
      id: '16',
      channelId: '1',
      userId: 'user-2',
      characterId: 'char-2',
      type: 'character',
      content:
        '*激动得几乎要站起来*\n\n"三重试炼！我知道这个！" *翻开随身携带的法术书* "在我研究的古代文献中提到过，月光之泪被三重魔法保护：勇气试炼考验内心的无畏，智慧试炼考验知识与判断，正义试炼考验道德品格！"\n\n*看着艾莉娅* "但是，这些试炼的具体内容...以及遗迹的入口在哪里？"',
      createdAt: new Date('2024-08-01T19:40:00Z'),
    },
    {
      id: '17',
      channelId: '1',
      userId: 'user-3',
      characterId: 'char-3',
      type: 'character',
      content:
        '*冷静地分析情况*\n\n"如果我妹妹真的被这个暗影之主抓走了...那她可能还活着，被困在某个地方。" *眼中闪过希望的光芒* "这意味着我们不仅要阻止邪恶，还要进行一场救援任务。"\n\n*看向吟游诗人* "艾莉娅，你知道遗迹的入口吗？我可以潜行侦察，为大家探路。"',
      createdAt: new Date('2024-08-01T19:42:00Z'),
    },
    {
      id: '18',
      channelId: '1',
      userId: 'gm-1',
      characterId: 'npc-2',
      type: 'character',
      content:
        '*缓缓站起，走向吧台，从袍中取出一张古老的羊皮纸地图*\n\n"这张地图已经传承了几个世纪，一直由我的家族保管。" *将地图摊开在桌上* "遗迹的入口在北方森林深处，被一个古老的幻象结界保护着。只有在月圆之夜，入口才会显现。"\n\n*指着地图上的标记* "明晚就是月圆之夜，这是我们的机会。但要小心...越接近遗迹，暗影生物就越活跃。"',
      createdAt: new Date('2024-08-01T19:45:00Z'),
    },
    {
      id: '19',
      channelId: '1',
      userId: 'gm-1',
      characterId: 'npc-1',
      type: 'character',
      content:
        '*走过来查看地图，脸色凝重*\n\n"我知道这个地方...我父亲的父亲曾经警告过我们，永远不要在月圆之夜去那片森林。" *声音有些颤抖* "传说那里会传出奇怪的嚎叫声，还有人看到过影子在树林间游荡。"\n\n*拍拍阿尔萨斯的肩膀* "勇敢的冒险者们，如果你们真的要去那里...这些或许能帮到你们。" *从柜台下拿出几瓶药剂* "祝福药水，能抵御一些黑暗魔法。"',
      createdAt: new Date('2024-08-01T19:47:00Z'),
    },
    {
      id: '20',
      channelId: '1',
      userId: 'user-1',
      characterId: 'char-1',
      type: 'character',
      content:
        '*庄重地接过药剂*\n\n"托尼，你的慷慨将被圣光铭记。" *看向团队成员* "我们今晚应该好好休息，准备装备。明天白天可以采购补给，了解更多关于遗迹的信息。"\n\n*突然，外面传来一声凄厉的嚎叫，整个酒馆都震动了一下*\n\n"这是什么声音？！"',
      createdAt: new Date('2024-08-01T19:50:00Z'),
    },
    {
      id: '21',
      channelId: '1',
      userId: 'gm-1',
      type: 'gm',
      content:
        '**【危险降临】**\n\n酒馆内的烛光突然开始闪烁，窗外传来沉重的脚步声和低沉的咆哮。几个酒客惊恐地指向窗外，只见月光下出现了几个黑色的身影——它们的眼睛闪烁着红光，身形模糊不定，仿佛是由纯粹的阴影构成。\n\n暗影狼群！它们包围了酒馆！',
      createdAt: new Date('2024-08-01T19:52:00Z'),
    },
    {
      id: '22',
      channelId: '1',
      userId: 'user-3',
      characterId: 'char-3',
      type: 'character',
      content:
        '*立即拔出双刃，身体进入战斗状态*\n\n"暗影狼！我听说过它们，是被黑暗魔法扭曲的野兽！" *敏捷地移向窗边侦察* "数量...至少有六只，而且它们在等待什么...仿佛在接受某种指令。"\n\n*回头看向同伴* "看来敌人已经知道我们在这里了。这是一场测试，还是...警告？"',
      createdAt: new Date('2024-08-01T19:54:00Z'),
    },
    {
      id: '23',
      channelId: '1',
      userId: 'user-2',
      characterId: 'char-2',
      type: 'character',
      content:
        '*举起法杖，开始吟唱咒语*\n\n"护盾术！" *一层微蓝的魔法光罩包围了在场的所有人* "这能抵挡一些攻击。" *继续准备法术* "我能感觉到...这些生物被某种强大的意志控制着。它们的出现不是巧合！"\n\n*法杖顶端的蓝宝石开始发光* "准备战斗！火球术已经准备就绪！"',
      createdAt: new Date('2024-08-01T19:56:00Z'),
    },
    {
      id: '24',
      channelId: '1',
      userId: 'user-1',
      characterId: 'char-1',
      type: 'character',
      content:
        '*抓起圣光之剑，剑身立即爆发出金色的光芒*\n\n"暗影在圣光面前无处遁形！" *转向其他客人* "所有平民撤到吧台后面！托尼，你有武器吗？"\n\n*圣光开始在他周围流转，驱散了部分阴影* "邪恶的仆从们，你们胆敢在圣光的见证下肆虐！今夜就是你们的末日！"\n\n*看向队友* "准备好了吗？为了正义而战！"',
      createdAt: new Date('2024-08-01T19:58:00Z'),
    },
    {
      id: '25',
      channelId: '1',
      userId: 'gm-1',
      type: 'gm',
      content:
        '**【战斗爆发！】**\n\n*CRASH!* 酒馆的窗户被暴力撞碎，三只暗影狼同时跃入室内！它们的利爪闪烁着不祥的黑光，血红的眼睛紧盯着三位冒险者。另外几只暗影狼在外面守候，似乎在防止任何人逃脱。\n\n第一只暗影狼向阿尔萨斯发起攻击，利爪向他的胸甲狠狠抓去！\n\n**【请进行先攻检定！】**',
      createdAt: new Date('2024-08-01T20:00:00Z'),
    },
  ],
  '2': [
    {
      id: '26',
      channelId: '2',
      userId: 'gm-1',
      type: 'gm',
      content:
        '**【精灵废墟入口】**\n\n古老的石柱在月光下投下长长的阴影，废墟入口被神秘的精灵文字包围。空气中弥漫着古老魔法的气息，让人感到一种深深的敬畏。',
      createdAt: new Date('2024-08-02T10:00:00Z'),
    },
  ],
  '3': [
    {
      id: '27',
      channelId: '3',
      userId: 'user-1',
      type: 'character',
      content: '大家今晚的战斗很精彩！我们下次什么时候继续？',
      createdAt: new Date('2024-08-01T21:00:00Z'),
    },
  ],
  '4': [
    {
      id: '28',
      channelId: '4',
      userId: 'gm-1',
      type: 'gm',
      content:
        '**【数字风暴酒吧，2087年11月15日深夜】**\n\n霓虹灯管发出蓝紫色的光芒，照亮了这个地下酒吧。网络终端的屏幕闪烁着数据流，改造人和原生人类并肩坐在吧台前。今晚的气氛格外紧张，所有人都在低声讨论着阿拉萨卡的数据泄露事件。',
      createdAt: new Date('2024-08-15T23:00:00Z'),
    },
  ],
  '5': [
    {
      id: '29',
      channelId: '5',
      userId: 'gm-1',
      type: 'gm',
      content:
        '**【阿拉萨卡高塔，第89层】**\n\n巨大的落地窗展现着新东京的夜景，企业标志在摩天大楼间闪烁。这里是权力的象征，也是许多阴谋的诞生地。',
      createdAt: new Date('2024-08-15T20:00:00Z'),
    },
  ],
}
