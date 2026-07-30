import { ActionIcon, Button } from '@mantine/core'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import type { FormEventHandler, ReactNode } from 'react'
import { Link } from 'react-router'
import Panel from './Panel'

type FormPanelProps = {
  title: string
  description?: string
  backTo?: string
  onSubmit: FormEventHandler<HTMLFormElement>
  submitLabel?: string
  isSubmitting?: boolean
  cancelTo?: string
  children: ReactNode
  /** `narrow` (720px, default) or `wide` (1000px) — for forms with many side-by-side fields. */
  width?: 'narrow' | 'wide'
}

// Form-library-agnostic on purpose: admin forms use @mantine/form, auth forms use react-hook-form.
const FormPanel = ({
  title,
  description,
  backTo,
  onSubmit,
  submitLabel = 'Save',
  isSubmitting,
  cancelTo,
  children,
  width = 'narrow',
}: FormPanelProps) => (
  <div className={width === 'wide' ? 'max-w-[1000px]' : 'max-w-[720px]'}>
    <div className="flex items-center gap-2 mb-4">
      {backTo && (
        <ActionIcon component={Link} to={backTo} variant="subtle" size="sm" aria-label="Back">
          <ArrowLeftIcon size={14} />
        </ActionIcon>
      )}
      <div>
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
    <Panel variant="admin" padding="md">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {children}
        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          {cancelTo && (
            <Button component={Link} to={cancelTo} variant="default" size="xs">
              Cancel
            </Button>
          )}
          <Button type="submit" size="xs" loading={isSubmitting}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Panel>
  </div>
)

export default FormPanel
