import { useMemo } from 'react'
import { Box, Text, VStack, HStack } from '@chakra-ui/react'
import type { WorldState, Plot, Event } from '@weave/types'
import { EditableText, FieldRow } from './shared-editable-components'
import { EditableNumberInput } from './shared-number-slider-components'

// 定义组件接收的属性接口
interface WorldStateOverviewProps {
  // 世界状态对象，包含所有世界相关信息
  worldState: WorldState
  // 更新元数据的回调函数（可选）
  onUpdateMetadata?: (metadata: {
    currentGameTime?: string // 当前游戏时间
    outline?: string // 世界概要
  }) => void
  // 更新数值字段的回调函数（可选）
  onUpdateNumericFields?: (updates: {
    characterCount?: number // 角色数量
    locationCount?: number // 地点数量
    activePlotCount?: number // 活跃剧情数量
    importantEventCount?: number // 重要事件数量
  }) => void
}

/**
 * 世界状态概览组件
 * 展示当前世界的核心信息，包括时间、角色数量、地点数量、活跃剧情和重要事件等
 * 支持GM面板模式下的编辑功能
 */
export function WorldStateOverview({
  worldState,
  onUpdateMetadata,
  onUpdateNumericFields,
}: WorldStateOverviewProps) {
  // 使用useMemo计算各种统计数据，避免不必要的重复计算
  // 只有当worldState变化时才会重新计算
  const {
    characterCount, // 角色总数
    locationCount, // 地点总数
    activePlotCount, // 活跃剧情数量
    importantEventCount, // 重要事件数量
  } = useMemo(() => {
    // 计算角色数量
    const characterCount = worldState.characters.length

    // 计算地点数量
    const locationCount = worldState.state.locations.length

    // 计算活跃剧情数量（状态为"active"的剧情）
    const activePlotCount = worldState.state.plots.filter(
      (p: Plot) => p.status === 'active'
    ).length

    // 计算重要事件数量（重要性为"critical"或"high"的事件）
    const importantEventCount = worldState.state.keyEventsLog.filter(
      (e: Event) => e.importance === 'critical' || e.importance === 'high'
    ).length

    // 返回计算结果
    return {
      characterCount,
      locationCount,
      activePlotCount,
      importantEventCount,
    }
  }, [worldState])

  // 渲染组件UI
  return (
    // 主容器盒子，设置背景色、内边距、圆角和边框
    <Box
      bg="gray.800" // 背景色
      p={4} // 内边距
      borderRadius="md" // 圆角
      borderWidth="1px" // 边框宽度
      borderColor="gray.600" // 边框颜色
    >
      {/* 垂直堆栈布局，用于排列所有内容 */}
      <VStack align="stretch" gap={4}>
        {/* 顶部标题栏 */}
        <HStack justify="space-between">
          {/* 组件标题 */}
          <Text fontSize="lg" fontWeight="bold" color="white">
            世界状态概览
          </Text>

          {/* GM面板标识 */}
          <Box
            bg="purple.500" // 背景色
            color="white" // 文字颜色
            px={2} // 水平内边距
            py={1} // 垂直内边距
            borderRadius="sm" // 小圆角
            fontSize="sm" // 字体大小
          >
            GM 面板
          </Box>
        </HStack>

        {/* 分隔线 */}
        <Box height="1px" bg="gray.600" />

        {/* 核心数据展示区域 */}
        <VStack align="stretch" gap={3}>
          {/* 当前游戏时间字段 */}
          <FieldRow
            label="当前游戏时间"
            value={worldState.state.currentGameTime}
            onEdit={
              onUpdateMetadata
                ? (newValue) =>
                    onUpdateMetadata({ currentGameTime: newValue as string })
                : undefined
            }
            isEditing={!!onUpdateMetadata} // 根据是否有更新函数决定是否可编辑
            placeholder="设置游戏时间..."
          />

          {/* 角色数量字段 */}
          <FieldRow
            label="角色数量"
            value={characterCount}
            onEdit={
              onUpdateNumericFields
                ? (newValue) =>
                    onUpdateNumericFields({
                      characterCount: newValue as number,
                    })
                : undefined
            }
            isEditing={!!onUpdateNumericFields} // 根据是否有更新函数决定是否可编辑
          />

          {/* 地点数量字段 */}
          <FieldRow
            label="地点数量"
            value={locationCount}
            onEdit={
              onUpdateNumericFields
                ? (newValue) =>
                    onUpdateNumericFields({ locationCount: newValue as number })
                : undefined
            }
            isEditing={!!onUpdateNumericFields} // 根据是否有更新函数决定是否可编辑
          />

          {/* 活跃剧情字段 */}
          <FieldRow
            label="活跃剧情"
            value={activePlotCount}
            onEdit={
              onUpdateNumericFields
                ? (newValue) =>
                    onUpdateNumericFields({
                      activePlotCount: newValue as number,
                    })
                : undefined
            }
            isEditing={!!onUpdateNumericFields} // 根据是否有更新函数决定是否可编辑
          />

          {/* 重要事件字段 */}
          <FieldRow
            label="重要事件"
            value={importantEventCount}
            onEdit={
              onUpdateNumericFields
                ? (newValue) =>
                    onUpdateNumericFields({
                      importantEventCount: newValue as number,
                    })
                : undefined
            }
            isEditing={!!onUpdateNumericFields} // 根据是否有更新函数决定是否可编辑
          />
        </VStack>

        {/* 世界概要部分（仅在存在概要时显示） */}
        {worldState.state.outline !== undefined && (
          <>
            {/* 分隔线 */}
            <Box height="1px" bg="gray.600" />

            {/* 世界概要内容区域 */}
            <VStack align="stretch" gap={2}>
              {/* 概要标题 */}
              <Text fontSize="sm" fontWeight="bold" color="white">
                世界概要:
              </Text>

              {/* 根据是否可编辑显示不同组件 */}
              {onUpdateMetadata ? (
                // 可编辑模式：使用可编辑文本组件
                <EditableText
                  value={worldState.state.outline}
                  onChange={(newValue) =>
                    onUpdateMetadata({ outline: newValue })
                  }
                  placeholder="添加世界概要..."
                />
              ) : (
                // 只读模式：直接显示概要内容
                <Text fontSize="sm" color="gray.300" fontStyle="italic">
                  {worldState.state.outline}
                </Text>
              )}
            </VStack>
          </>
        )}
      </VStack>
    </Box>
  )
}
