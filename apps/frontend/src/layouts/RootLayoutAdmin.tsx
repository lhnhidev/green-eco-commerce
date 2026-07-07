import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import HeaderAdmin from '../components/features/header-admin/HeaderAdmin'
import { type ActiveType, setActive } from '../components/features/navigation/navigation.slice'
import TheNavigation from '../components/features/navigation/TheNavigation'
import Loading from '../components/ui/status/Loading'
import { useAppDispatch } from '../hooks/useAppDispatch'

const RootLayoutAdmin = () => {
  const location = useLocation()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    const currentPath = pathSegments[pathSegments.length - 1]

    const pathToActiveMap: Record<string, ActiveType> = {
      admin: 'dashboard',
      dashboard: 'dashboard',
      category: 'category',
      user: 'user',
      material: 'material',
      document: 'document',
      order: 'order',
      analyst: 'analyst',
      setting: 'setting',
    }

    const activeValue = pathToActiveMap[currentPath] || 'dashboard'

    dispatch(setActive(activeValue))
  }, [location.pathname, dispatch])

  return (
    // 1. Thêm h-screen để cố định layout bằng chiều cao màn hình
    <div className="flex h-screen w-screen overflow-hidden">
      <TheNavigation />

      <div className="flex flex-col flex-1 min-w-0">
        <div className="px-8 pt-3 w-full h-15 bg-(--color-background) border-b border-b-[#e5e7e0] shrink-0">
          <HeaderAdmin />
        </div>

        <div className="flex-1 bg-gray-50 overflow-y-auto">
          <Suspense fallback={<Loading text="Loading" />}>
            <Outlet></Outlet>
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default RootLayoutAdmin
