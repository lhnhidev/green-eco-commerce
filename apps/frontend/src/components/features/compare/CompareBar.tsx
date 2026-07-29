import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Button } from '@mantine/core'
import { ScalesIcon, XIcon } from '@phosphor-icons/react'
import { useNavigate } from 'react-router'
import { clearCompare, MAX_COMPARE_ITEMS } from './compare.slice'

const CompareBar = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const productIds = useAppSelector((state) => state.compare.productIds)

  if (productIds.length === 0) return null

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white shadow-2xl rounded-full border border-gray-200 pl-5 pr-2 py-2 flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <ScalesIcon size={18} className="text-primary" weight="fill" />
        Compare ({productIds.length}/{MAX_COMPARE_ITEMS})
      </div>

      <Button
        size="xs"
        color="primary"
        radius="xl"
        disabled={productIds.length < 2}
        onClick={() => navigate('/compare')}
      >
        Compare Now
      </Button>
      <button
        type="button"
        onClick={() => dispatch(clearCompare())}
        className="text-gray-400 hover:text-gray-600 p-1"
        aria-label="Clear compare list"
      >
        <XIcon size={14} />
      </button>
    </div>
  )
}

export default CompareBar
