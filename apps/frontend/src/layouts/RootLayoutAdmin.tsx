import { useAppSelector } from '@/hooks/useAppSelector'
import HeaderAdmin from '@components/features/header-admin/HeaderAdmin'
import { type ActiveType, setActive } from '@components/features/navigation/navigation.slice'
import SidebarContent from '@components/features/navigation/TheNavigation'
import Loading from '@components/ui/status/Loading'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { AppShell } from '@mantine/core'
import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'

const RootLayoutAdmin = () => {
  const location = useLocation()
  const dispatch = useAppDispatch()
  const desktopSidebarOpen = useAppSelector((state) => state.theNavigation.desktopSidebarOpen)
  const mobileSidebarOpen = useAppSelector((state) => state.theNavigation.mobileSidebarOpen)

  useEffect(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    const currentPath = pathSegments[pathSegments.length - 1]

    const pathToActiveMap: Record<string, ActiveType> = {
      admin: 'dashboard',
      dashboard: 'dashboard',
      product: 'product',
      category: 'category',
      user: 'user',
      material: 'material',
      document: 'document',
      order: 'order',
      analyst: 'analyst',
      setting: 'setting',
      review: 'review',
      coupon: 'coupon',
      banner: 'banner',
    }

    const activeValue = pathToActiveMap[currentPath] || 'dashboard'

    dispatch(setActive(activeValue))
  }, [location.pathname, dispatch])

  return (
    // 1. Thêm h-screen để cố định layout bằng chiều cao màn hình
    <AppShell
      padding="md"
      layout="alt"
      header={{ height: 60 }}
      navbar={{
        width: 240,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileSidebarOpen, desktop: !desktopSidebarOpen },
      }}
    >
      <HeaderAdmin />
      <SidebarContent />

      <AppShell.Main className="flex flex-col flex-1 min-w-0 bg-muted/30">
        {/* <div className="px-5 pt-2 w-full h-13 bg-white border-b border-[#ececee] shrink-0">
          <HeaderAdmin />
        </div> */}

        <div className="flex-1 overflow-y-auto p-5">
          <Suspense fallback={<Loading text="Loading" />}>
            <Outlet></Outlet>
          </Suspense>
        </div>
      </AppShell.Main>
    </AppShell>
  )
}

export default RootLayoutAdmin
