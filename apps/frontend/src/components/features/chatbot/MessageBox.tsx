import { Avatar, Paper, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

interface MessageBoxProps {
  message: string
  time: string
  isBot: boolean
  avatar?: string
}

const LINE_LIMIT = 10

const MessageBox = ({ message, time, isBot, avatar }: MessageBoxProps) => {
  const [expanded, { toggle }] = useDisclosure(false)

  const lines = message.split('\n')
  const isLong = lines.length > LINE_LIMIT

  const preview = isLong ? lines.slice(0, LINE_LIMIT).join('\n') : message

  return (
    <div className={`flex items-end gap-2 w-full ${isBot ? 'justify-start' : 'justify-end'}`}>
      {/* Avatar bot (bên trái) */}
      {isBot && (
        <Avatar src={avatar} alt="Bot" size="sm" radius="xl" color="green" className="mb-1 shrink-0">
          🤖
        </Avatar>
      )}

      <div className={`flex flex-col gap-1 max-w-[75%] ${isBot ? 'items-start' : 'items-end'}`}>
        <Paper
          shadow="xs"
          px="md"
          py="sm"
          radius="lg"
          style={{
            borderBottomLeftRadius: isBot ? 4 : undefined,
            borderBottomRightRadius: !isBot ? 4 : undefined,
            backgroundColor: isBot ? '#f1f3f5' : 'var(--mantine-color-green-6)',
            color: isBot ? '#1a1a1a' : '#ffffff',
            wordBreak: 'break-word',
          }}
        >
          {/* Nội dung tin nhắn */}
          <Text size="sm" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {expanded ? message : preview}
          </Text>

          {/* Show more / Show less */}
          {isLong && (
            <Text
              size="xs"
              mt={4}
              style={{
                cursor: 'pointer',
                color: isBot ? 'var(--mantine-color-green-7)' : 'rgba(255,255,255,0.8)',
                userSelect: 'none',
              }}
              onClick={toggle}
            >
              {expanded ? '▲ Show less' : '▼ Show more...'}
            </Text>
          )}
        </Paper>

        {/* Thời gian */}
        <Text size="xs" c="dimmed" px={4}>
          {time}
        </Text>
      </div>

      {/* Avatar user (bên phải) */}
      {!isBot && (
        <Avatar size="sm" radius="xl" color="blue" className="mb-1 shrink-0">
          👤
        </Avatar>
      )}
    </div>
  )
}

export default MessageBox
