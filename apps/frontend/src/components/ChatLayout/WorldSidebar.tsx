import { VStack, Box, IconButton, Badge } from '@chakra-ui/react'
import { PlusSquareIcon, LogOutIcon } from 'lucide-react'
import { Tooltip } from '../ui/tooltip'
import { useLogout } from '../../hooks/auth'
import { useNavigate } from 'react-router'

interface WorldSidebarProps {
  worlds?: Array<{
    id: string
    name: string
    avatar: string
    hasNotification?: boolean
  }>
  selectedWorldId?: string
  onWorldSelect?: (worldId: string) => void
  onCreateWorld?: () => void
}

export function WorldSidebar({
  worlds = [],
  selectedWorldId,
  onWorldSelect,
  onCreateWorld,
}: WorldSidebarProps) {
  const { logout } = useLogout()
  const navigate = useNavigate()

  return (
    <Box
      width="72px"
      bg="gray.950"
      borderRight="1px solid"
      borderColor="gray.700"
      py={3}
      display="flex"
      flexDirection="column"
      height="100%"
    >
      <VStack gap={2} px={3} flex="1">
        {/* Add World Button */}
        <Tooltip content="创建世界" positioning={{ placement: 'right' }}>
          <IconButton
            size="lg"
            bg="gray.700"
            color="green.400"
            _hover={{ bg: 'green.600', color: 'white' }}
            onClick={onCreateWorld}
            borderRadius="12px"
            transition="all 0.2s"
          >
            <PlusSquareIcon size={24} />
          </IconButton>
        </Tooltip>

        {/* Separator */}
        <Box height="2px" width="32px" bg="gray.600" my={2} />

        {/* World List */}
        {worlds.map((world) => (
          <Tooltip
            key={world.id}
            content={world.name}
            positioning={{ placement: 'right' }}
          >
            <Box position="relative">
              <IconButton
                size="lg"
                bg={selectedWorldId === world.id ? 'blue.500' : 'gray.600'}
                color="white"
                _hover={{
                  bg: selectedWorldId === world.id ? 'blue.600' : 'blue.400',
                  borderRadius: '16px',
                }}
                onClick={() => onWorldSelect?.(world.id)}
                borderRadius={selectedWorldId === world.id ? '16px' : '24px'}
                transition="all 0.2s"
                fontSize="24px"
              >
                {world.avatar}
              </IconButton>
              {world.hasNotification && (
                <Badge
                  position="absolute"
                  top="-2px"
                  right="-2px"
                  bg="red.500"
                  color="white"
                  borderRadius="full"
                  fontSize="xs"
                  minW="18px"
                  h="18px"
                >
                  !
                </Badge>
              )}
              {/* Active indicator */}
              {selectedWorldId === world.id && (
                <Box
                  position="absolute"
                  left="-6px"
                  top="50%"
                  transform="translateY(-50%)"
                  width="4px"
                  height="20px"
                  bg="white"
                  borderRadius="0 2px 2px 0"
                />
              )}
            </Box>
          </Tooltip>
        ))}
      </VStack>

      {/* Logout Button at the bottom */}
      <Box px={3} pb={2}>
        <Tooltip content="退出登录" positioning={{ placement: 'right' }}>
          <IconButton
            size="lg"
            bg="gray.700"
            color="red.400"
            _hover={{ bg: 'red.600', color: 'white' }}
            onClick={() => {
              logout()
              void navigate('/')
            }}
            borderRadius="12px"
            transition="all 0.2s"
          >
            <LogOutIcon size={20} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )
}
