import {
  Box,
  Text,
  HStack,
  Button,
  Select,
  Portal,
  createListCollection,
} from '@chakra-ui/react'

// Reusable Tag component for consistent styling
interface TagProps {
  children: React.ReactNode
  onRemove?: () => void
  colorScheme?: string
}

export const Tag: React.FC<TagProps> = ({
  children,
  onRemove,
  colorScheme = 'purple',
}) => {
  return (
    <HStack
      bg={`${colorScheme}.500`}
      color="white"
      px={1}
      py={0.5}
      borderRadius="sm"
      fontSize="xs"
    >
      <Text>{children}</Text>
      {onRemove && (
        <Button size="xs" colorPalette="red" onClick={onRemove}>
          ×
        </Button>
      )}
    </HStack>
  )
}

interface GenericSelectProps {
  items: string[]
  selectedItem: string | null
  onSelectionChange: (item: string | null) => void
  placeholder?: string
  label?: string
  icon?: React.ReactNode
}

export function GenericSelect({
  items,
  selectedItem,
  onSelectionChange,
  placeholder,
  label,
  icon,
}: GenericSelectProps) {
  // Create collection for select component
  const collection = createListCollection({
    items: items.map((item: string) => ({
      label: item,
      value: item,
    })),
  })

  return (
    <Box>
      {label && (
        <Text
          color="gray.400"
          fontSize="xs"
          fontWeight="semibold"
          textTransform="uppercase"
          letterSpacing="0.5px"
          mb={2}
        >
          {label}
        </Text>
      )}

      <Select.Root
        collection={collection}
        value={selectedItem ? [selectedItem] : []}
        onValueChange={(details) => onSelectionChange(details.value[0] || null)}
        size="sm"
      >
        <Select.HiddenSelect />
        <Select.Control>
          <Select.Trigger
            bg="gray.700"
            borderColor="gray.600"
            color="white"
            _hover={{ bg: 'gray.600' }}
            _focus={{ borderColor: 'blue.400' }}
            width="100%"
          >
            <Box display="flex" alignItems="center" gap={2}>
              {icon}
              <Select.ValueText placeholder={placeholder} />
            </Box>
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>

        <Portal>
          <Select.Positioner>
            <Select.Content
              bg="gray.700"
              borderColor="gray.600"
              shadow="lg"
              maxHeight="200px"
              overflowY="auto"
            >
              {collection.items.map(
                (item: { value: string; label: string }) => (
                  <Select.Item
                    key={item.value}
                    item={item}
                    py={2}
                    px={3}
                    color="white"
                    _hover={{ bg: 'gray.600' }}
                    _selected={{ bg: 'blue.500', color: 'white' }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={2}
                      width="full"
                    >
                      <Text fontSize="sm">{item.label}</Text>
                    </Box>
                    <Select.ItemIndicator />
                  </Select.Item>
                )
              )}

              {collection.items.length === 0 && (
                <Box py={2} px={3} color="gray.400" fontSize="sm">
                  无可用选项
                </Box>
              )}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </Box>
  )
}
