import {
  Box,
  Text,
  Select,
  Portal,
  createListCollection,
} from '@chakra-ui/react'
import { Crown, User, Eye } from 'lucide-react'

export type UserRole = 'player' | 'gm' | 'spectator'

interface RoleSelectorProps {
  selectedRole: UserRole
  onRoleChange: (role: UserRole) => void
}

const roleConfig = {
  player: {
    label: '玩家',
    icon: User,
    color: 'blue.400',
    description: '参与游戏的普通玩家',
  },
  gm: {
    label: '游戏主持人',
    icon: Crown,
    color: 'yellow.400',
    description: '拥有完整管理权限',
  },
  spectator: {
    label: '观察者',
    icon: Eye,
    color: 'gray.400',
    description: '只能观看，无法参与',
  },
}

const roleCollection = createListCollection({
  items: [
    {
      label: '玩家',
      value: 'player',
      description: '参与游戏的普通玩家',
      color: 'blue.400',
      icon: User,
    },
    {
      label: '游戏主持人',
      value: 'gm',
      description: '拥有完整管理权限',
      color: 'yellow.400',
      icon: Crown,
    },
    {
      label: '观察者',
      value: 'spectator',
      description: '只能观看，无法参与',
      color: 'gray.400',
      icon: Eye,
    },
  ],
})

export function RoleSelector({
  selectedRole,
  onRoleChange,
}: RoleSelectorProps) {
  const selectedConfig = roleConfig[selectedRole]
  const IconComponent = selectedConfig.icon

  return (
    <Box p={3} borderTop="1px solid" borderColor="gray.700" bg="gray.800">
      <Text
        color="gray.400"
        fontSize="xs"
        fontWeight="semibold"
        textTransform="uppercase"
        letterSpacing="0.5px"
        mb={2}
      >
        角色
      </Text>

      <Select.Root
        collection={roleCollection}
        value={[selectedRole]}
        onValueChange={(details) => onRoleChange(details.value[0] as UserRole)}
        size="sm"
      >
        <Select.HiddenSelect />
        <Select.Control>
          <Select.Trigger
            bg="gray.700"
            borderColor="gray.600"
            color="white"
            _hover={{ bg: 'gray.600' }}
            _focus={{ borderColor: selectedConfig.color }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <IconComponent size={16} color={selectedConfig.color} />
              <Select.ValueText placeholder="选择角色">
                {selectedConfig.label}
              </Select.ValueText>
            </Box>
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>

        <Portal>
          <Select.Positioner>
            <Select.Content bg="gray.700" borderColor="gray.600" shadow="lg">
              {roleCollection.items.map((role) => {
                const RoleIcon = role.icon
                return (
                  <Select.Item
                    key={role.value}
                    item={role}
                    py={2}
                    px={3}
                    color="white"
                    _hover={{ bg: 'gray.600' }}
                    _selected={{ bg: role.color, color: 'white' }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={2}
                      width="full"
                    >
                      <RoleIcon size={16} color={role.color} />
                      <Box>
                        <Text fontSize="sm" fontWeight="medium">
                          {role.label}
                        </Text>
                        <Text
                          fontSize="xs"
                          color="gray.400"
                          style={{
                            color:
                              selectedRole === role.value ? 'white' : undefined,
                          }}
                        >
                          {role.description}
                        </Text>
                      </Box>
                    </Box>
                    <Select.ItemIndicator />
                  </Select.Item>
                )
              })}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </Box>
  )
}
