import { Avatar, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Leaf, User } from '@phosphor-icons/react'

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
    <div className={`flex items-end gap-3 w-full ${isBot ? 'justify-start' : 'justify-end'}`}>
      {/* Avatar bot (bên trái) */}
      {isBot && (
        <Avatar
          src={avatar}
          alt="Bot"
          size="md"
          radius="xl"
          className="mb-1 shrink-0 bg-linear-to-br from-green-100 to-emerald-200 border-2 border-white shadow-sm"
        >
          <Leaf weight="fill" color="#059669" size={20} />
        </Avatar>
      )}

      <div className={`flex flex-col gap-1 max-w-[75%] ${isBot ? 'items-start' : 'items-end'}`}>
        <div
          className={`px-3 py-2 shadow-xs ${
            isBot
              ? 'rounded-lg rounded-bl-sm bg-white border border-green-100 text-gray-800'
              : 'rounded-lg rounded-br-sm bg-linear-to-br from-green-500 to-emerald-600 text-white'
          }`}
          style={{ wordBreak: 'break-word' }}
        >
          {/* Nội dung tin nhắn */}
          <Text size="sm" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {expanded ? message : preview}
          </Text>

          {/* Show more / Show less */}
          {isLong && (
            <Text
              size="xs"
              mt={6}
              fw={600}
              style={{
                cursor: 'pointer',
                color: isBot ? '#059669' : 'rgba(255,255,255,0.9)',
                userSelect: 'none',
                display: 'inline-block',
              }}
              className="hover:underline"
              onClick={toggle}
            >
              {expanded ? '▲ Show less' : '▼ Show more...'}
            </Text>
          )}
        </div>

        {/* Thời gian */}
        <Text size="xs" c="dimmed" px={4} className="opacity-70 font-medium">
          {time}
        </Text>
      </div>

      {/* Avatar user (bên phải) */}
      {!isBot && (
        <Avatar
          size="md"
          radius="xl"
          className="mb-1 shrink-0 bg-linear-to-br from-gray-100 to-gray-200 border-2 border-white shadow-sm"
        >
          <User weight="fill" color="#4b5563" size={20} />
        </Avatar>
      )}
    </div>
  )
}

export default MessageBox
