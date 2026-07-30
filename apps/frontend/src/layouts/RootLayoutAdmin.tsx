import { useGetMe } from '@api'
import { RoleEnum } from '@api/schemas'
import HeaderAdmin from '@components/features/header-admin/HeaderAdmin'
import SidebarContent from '@components/features/navigation/TheNavigation'
import Loading from '@components/ui/status/Loading'
import { AppShell } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { Suspense, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { useAppSelector } from '@/hooks/useAppSelector'

const RootLayoutAdmin = () => {
  const navigate = useNavigate()
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
      header={{ height: 56 }}
      navbar={{
        width: 224,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileSidebarOpen, desktop: !desktopSidebarOpen },
      }}
    >
      <HeaderAdmin />
      <SidebarContent />

      <AppShell.Main className="bg-surface-sunken">
        <div className="mx-auto w-full max-w-[1400px]">
          <Suspense fallback={<Loading text="Loading" />}>
            <Outlet />
          </Suspense>
        </div>
      </AppShell.Main>
    </AppShell>
  )
}

export default RootLayoutAdmin
