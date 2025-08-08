import { marked } from 'marked'
import { memo, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  Text,
  Heading,
  Code,
  Link,
  Em,
  Mark,
  List,
  Blockquote,
  type TextProps,
  type HeadingProps,
  type CodeProps,
  type LinkProps,
  type EmProps,
  type MarkProps,
} from '@chakra-ui/react'

const markdownComponents = {
  // 段落
  p: ({ ...props }: TextProps) => (
    <Text as="p" mb={4} lineHeight="tall" {...props} />
  ),

  // 标题
  h1: ({ ...props }: HeadingProps) => (
    <Heading
      as="h1"
      size={{ base: '2xl', md: '3xl' }}
      mt={6}
      mb={4}
      {...props}
    />
  ),

  h2: ({ ...props }: HeadingProps) => (
    <Heading
      as="h2"
      size={{ base: 'xl', md: '2xl' }}
      mt={5}
      mb={3}
      {...props}
    />
  ),

  h3: ({ ...props }: HeadingProps) => (
    <Heading as="h3" size="lg" mt={4} mb={2} {...props} />
  ),

  // 列表
  ul: ({ ...props }: List.RootProps) => (
    <List.Root as="ul" pl={6} mb={4} {...props} />
  ),

  ol: ({ ...props }: List.RootProps) => (
    <List.Root as="ol" pl={6} mb={4} {...props} />
  ),

  li: ({ ...props }: List.ItemProps) => (
    <List.Item mb={1} lineHeight="tall" {...props} />
  ),

  // 代码块
  code: ({ className, children, ...props }: CodeProps) => {
    // 检查是否为行内代码元素（没有语言类名）
    const isInline = !className || !/language-(\w+)/.exec(className || '')

    // 如果是行内代码，使用Code组件渲染
    if (isInline) {
      return (
        <Code
          as="span"
          colorScheme="gray"
          px={1.5}
          py={0.5}
          borderRadius="md"
          fontSize="sm"
          {...props}
        >
          {children}
        </Code>
      )
    }

    // 如果是代码块，也使用Code组件渲染
    return (
      <Code
        as="pre"
        colorScheme="gray"
        p={4}
        borderRadius="md"
        fontSize="sm"
        whiteSpace="pre-wrap"
        mt={4}
        mb={4}
        {...props}
      >
        {children}
      </Code>
    )
  },

  // 引用块
  blockquote: ({ children, ...props }: Blockquote.RootProps) => (
    <Blockquote.Root
      borderLeft="4px solid"
      borderColor="gray.500"
      pl={4}
      ml={2}
      my={4}
      {...props}
    >
      <Blockquote.Content fontStyle="italic" color="gray.300">
        {children}
      </Blockquote.Content>
    </Blockquote.Root>
  ),

  // 链接
  a: ({ ...props }: LinkProps) => (
    <Link
      as="a"
      color="blue.400"
      fontWeight="medium"
      _hover={{
        textDecoration: 'underline',
        color: 'blue.300',
      }}
      {...props}
    />
  ),

  // 加粗文本
  strong: ({ ...props }: TextProps) => (
    <Text as="strong" fontWeight="bold" {...props} />
  ),

  // 斜体文本
  em: ({ ...props }: EmProps) => <Em {...props} />,

  // 高亮文本
  mark: ({ ...props }: MarkProps) => <Mark {...props} />,
}

// 解析Markdown内容为块
function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown)
  return tokens.map((token) => token.raw)
}

// 记忆化的Markdown块组件
const MemoizedMarkdownBlock = memo(
  ({ content }: { content: string }) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    )
  },
  (prevProps, nextProps) => {
    if (prevProps.content !== nextProps.content) return false
    return true
  }
)

MemoizedMarkdownBlock.displayName = 'MemoizedMarkdownBlock'

// 统一的Markdown渲染器组件
export const MemoizedMarkdown = memo(
  ({ content, id }: { content: string; id: string }) => {
    // 将Markdown内容解析为块
    const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content])

    // 记忆化的常规渲染
    return (
      <>
        {blocks.map((block, index) => (
          <MemoizedMarkdownBlock content={block} key={`${id}-block_${index}`} />
        ))}
      </>
    )
  }
)

MemoizedMarkdown.displayName = 'UnifiedMarkdownRenderer'
