import { TextInput, Tooltip } from '@mantine/core'
import { PaperPlaneRight } from '@phosphor-icons/react'
import type * as React from 'react'

interface ChatInputBarProps {
  inputValue: string
  onChange: (value: string) => void
  onSend: () => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  isPending: boolean
}

const ChatInputBar = ({ inputValue, onChange, onSend, onKeyDown, isPending }: ChatInputBarProps) => (
  <TextInput
    classNames={{
      input: 'bg-gray-50 border-gray-200 focus:border-green-400 rounded-md',
    }}
    placeholder="Ask me about eco-friendly living..."
    value={inputValue}
    onChange={(e) => onChange(e.currentTarget.value)}
    onKeyDown={onKeyDown}
    disabled={isPending}
    rightSection={
      <Tooltip label="Send" withArrow>
        {/** biome-ignore lint/a11y/noStaticElementInteractions: <> */}
        {/** biome-ignore lint/a11y/useKeyWithClickEvents: <> */}
        <div
          className={`flex items-center justify-center w-10 h-10 mr-2 rounded-lg transition-all duration-200 ${
            isPending || !inputValue.trim()
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-green-500 text-white cursor-pointer hover:bg-green-600 hover:scale-105 hover:shadow-md'
          }`}
          onClick={onSend}
        >
          <PaperPlaneRight weight="fill" size={18} />
        </div>
      </Tooltip>
    }
    rightSectionWidth={56}
  />
)

export default ChatInputBar
