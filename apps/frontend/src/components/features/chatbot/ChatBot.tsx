/** biome-ignore-all lint/a11y/noStaticElementInteractions: <> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <> */
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import ChatComunication from './ChatComunication'
import ChatIconComp from './ChatIconComp'
import { setIsShow } from './chatbot.slice'

const ChatBot = () => {
  const isShow = useAppSelector((state) => state.chatbot.isShow)
  const dispatch = useAppDispatch()

  return (
    <div onClick={() => dispatch(setIsShow(true))}>{isShow === false ? <ChatIconComp /> : <ChatComunication />}</div>
  )
}

export default ChatBot
