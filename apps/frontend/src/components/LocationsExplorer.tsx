import { Box, Text, VStack, HStack } from '@chakra-ui/react'
import type { Location } from '@weave/types'

interface LocationsExplorerProps {
  locations: Location[]
}

export function LocationsExplorer({ locations }: LocationsExplorerProps) {
  if (locations.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Text color="gray.500">暂无地点数据</Text>
      </Box>
    )
  }

  return (
    <VStack align="stretch" gap={3}>
      {locations.map((location, index) => (
        <Box
          key={index}
          border="1px solid"
          borderColor="gray.600"
          borderRadius="md"
          mb={2}
          bg="gray.700"
        >
          <Box
            bg="gray.700"
            _hover={{ bg: 'gray.600' }}
            borderRadius="md"
            p={3}
          >
            <HStack justify="space-between" py={2}>
              <HStack gap={2}>
                <Text fontWeight="bold" color="white">
                  {location.name}
                </Text>
                <Box
                  bg="green.500"
                  color="white"
                  px={1}
                  py={0.5}
                  borderRadius="sm"
                  fontSize="xs"
                >
                  {location.currentOccupants?.length || 0} 人
                </Box>
              </HStack>
            </HStack>
          </Box>

          <Box bg="gray.800" p={4}>
            <VStack align="stretch" gap={3}>
              <Text fontSize="sm" color="gray.300">
                {location.description}
              </Text>

              <Box height="1px" bg="gray.600" />

              <HStack wrap="wrap" gap={2}>
                <Text fontSize="sm" color="gray.400" fontWeight="bold">
                  连接地点:
                </Text>
                {location.connectedLocations?.map((loc, idx) => (
                  <Box
                    key={idx}
                    bg="purple.500"
                    color="white"
                    px={1}
                    py={0.5}
                    borderRadius="sm"
                    fontSize="xs"
                  >
                    {loc}
                  </Box>
                ))}
              </HStack>

              <HStack wrap="wrap" gap={2}>
                <Text fontSize="sm" color="gray.400" fontWeight="bold">
                  当前人员:
                </Text>
                {location.currentOccupants?.map((occupant, idx) => (
                  <Box
                    key={idx}
                    bg="blue.500"
                    color="white"
                    px={1}
                    py={0.5}
                    borderRadius="sm"
                    fontSize="xs"
                  >
                    {occupant}
                  </Box>
                ))}
              </HStack>

              {location.notableFeatures &&
                location.notableFeatures.length > 0 && (
                  <>
                    <Box height="1px" bg="gray.600" />
                    <VStack align="stretch" gap={1}>
                      <Text fontSize="sm" color="gray.400" fontWeight="bold">
                        显著特征:
                      </Text>
                      {location.notableFeatures.map((feature, idx) => (
                        <Text key={idx} fontSize="sm" color="gray.300">
                          • {feature}
                        </Text>
                      ))}
                    </VStack>
                  </>
                )}

              {location.items && location.items.length > 0 && (
                <>
                  <Box height="1px" bg="gray.600" />
                  <VStack align="stretch" gap={1}>
                    <Text fontSize="sm" color="gray.400" fontWeight="bold">
                      物品:
                    </Text>
                    {location.items.map((item, idx) => (
                      <Text key={idx} fontSize="sm" color="gray.300">
                        • {item}
                      </Text>
                    ))}
                  </VStack>
                </>
              )}
            </VStack>
          </Box>
        </Box>
      ))}
    </VStack>
  )
}
