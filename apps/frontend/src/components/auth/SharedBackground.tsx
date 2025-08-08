import { Box } from '@chakra-ui/react'

export function SharedBackground() {
  return (
    <>
      {/* 星空背景 */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgImage={`
          linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
        `}
        backgroundSize="30px 30px"
        zIndex={0}
      />
      
      {/* 光效 */}
      <Box
        position="absolute"
        top="-50%"
        left="-50%"
        right="-50%"
        bottom="-50%"
        bgImage={`
          radial-gradient(circle at 30% 40%, rgba(100, 149, 237, 0.2) 0%, transparent 20%),
          radial-gradient(circle at 70% 60%, rgba(138, 43, 226, 0.2) 0%, transparent 20%)
        `}
        zIndex={0}
      />
    </>
  )
}