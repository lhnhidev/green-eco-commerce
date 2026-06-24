import { Center, Loader } from '@mantine/core'

type LoadingType = {
  text: string
}

const Loading = ({ text }: LoadingType) => {
  return (
    <Center h={300}>
      <div className="flex flex-col items-center">
        <Loader color="green" size="lg" type="dots" />
        <p className="text-center mt-2">{text}</p>
      </div>
    </Center>
  )
}

export default Loading
