/** biome-ignore-all lint/a11y/useButtonType: <> */
import { Tooltip } from '@mantine/core'
import { BiMessageRoundedAdd } from 'react-icons/bi'
import { VscChromeMinimize } from 'react-icons/vsc'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { setIsShow } from './chatbot.slice'

const HeaderChatbot = () => {
  const dispatch = useAppDispatch()

  return (
    <header className="flex justify-between">
      <select name="communication" id="communication" className="cursor-pointer">
        <option value="1">Cuộc trò chuyện 1</option>
        <option value="2">Cuộc trò chuyện 2</option>
        <option value="3">Cuộc trò chuyện 3</option>
      </select>

      <div className="flex items-center gap-2">
        <Tooltip label="New chat">
          <button className="cursor-pointer hover:bg-gray-200 transition-all rounded-full p-0.5">
            <BiMessageRoundedAdd />
          </button>
        </Tooltip>

        <Tooltip label="Hiden chatbot">
          <button
            onClick={(e) => {
              e.stopPropagation()
              dispatch(setIsShow(false))
            }}
            className="cursor-pointer hover:bg-gray-200 transition-all rounded-full p-0.5"
          >
            <VscChromeMinimize />
          </button>
        </Tooltip>
      </div>
    </header>
  )
}

export default HeaderChatbot
