import type { ReactNode } from 'react'
import Container from './Container'
import PageHeader from './PageHeader'

type AdminPageShellProps = {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}

const AdminPageShell = ({ title, description, actions, children }: AdminPageShellProps) => (
  <Container width="wide">
    <PageHeader title={title} subtitle={description} actions={actions} density="compact" />
    {children}
  </Container>
)

export default AdminPageShell
