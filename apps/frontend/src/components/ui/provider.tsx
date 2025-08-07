'use client'

import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  defineConfig,
} from '@chakra-ui/react'
import { ColorModeProvider, type ColorModeProviderProps } from './color-mode'
import { Toaster } from './toaster'

const config = defineConfig({
  globalCss: {
    '*::selection': {
      bg: 'blue.500',
    },
  },
})

const system = createSystem(defaultConfig, config)

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} forcedTheme="dark" />
      <Toaster />
    </ChakraProvider>
  )
}
