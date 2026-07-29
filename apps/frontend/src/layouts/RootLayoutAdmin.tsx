import { useGetMe } from '@api'
import { RoleEnum } from '@api/schemas'
import HeaderAdmin from '@components/features/header-admin/HeaderAdmin'
import { type ActiveType, setActive } from '@components/features/navigation/navigation.slice'
import SidebarContent from '@components/features/navigation/TheNavigation'
import Loading from '@components/ui/status/Loading'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { AppShell } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { Suspense, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { useAppSelector } from '@/hooks/useAppSelector'

const RootLayoutAdmin = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const desktopSidebarOpen = useAppSelector((state) => state.theNavigation.desktopSidebarOpen)
  const mobileSidebarOpen = useAppSelector((state) => state.theNavigation.mobileSidebarOpen)
  const { data: me, isPending: authPending } = useGetMe({ query: { staleTime: 1000 * 60 * 5 } })

  // ── Role Guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (authPending) return
    if (!me || me.role !== RoleEnum.Admin) {
      notifications.show({
        title: 'Access Denied',
        message: 'You must be an administrator to access this area.',
        color: 'red',
      })
      navigate('/', { replace: true })
    }
  }, [me, authPending, navigate])

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

  // Show spinner while verifying auth
  if (authPending) {
    return <Loading text="Verifying access..." />
  }

  // Guard passed — render admin shell
  if (!me || me.role !== RoleEnum.Admin) {
    return null
  }

  return (
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
