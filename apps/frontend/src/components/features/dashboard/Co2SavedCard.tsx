import type { GetInfoAnalystQueryCo2Saved } from '@api/schemas'
import { RingProgress, Tooltip } from '@mantine/core'
import {
  ApproximateEqualsIcon,
  InfoIcon,
  LeafIcon,
  TrendDownIcon,
  TrendUpIcon,
} from '@phosphor-icons/react'

// A mature tree absorbs roughly this much CO2 per year — a commonly cited public
// approximation, used only to translate the raw kg figure into something graspable.
// This is NOT a measurement from this system — the tooltip below says so explicitly.
const CO2_KG_PER_TREE_YEAR = 21

type Co2SavedCardProps = {
  data: GetInfoAnalystQueryCo2Saved
  direction: 'up' | 'down' | 'flat'
}

const Co2SavedCard = ({ data, direction }: Co2SavedCardProps) => {
  const currentValue = Number(data.currentValue)
  const previousValue = Number(data.previousValue)
  const growthPercentage = Number(Number(data.growthPercentage).toFixed(1))

  const ringValue =
    previousValue > 0 ? Math.min((currentValue / previousValue) * 100, 100) : currentValue > 0 ? 100 : 0
  const treeYears = currentValue / CO2_KG_PER_TREE_YEAR

  const deltaColor = direction === 'up' ? 'text-primary' : direction === 'down' ? 'text-red-500' : 'text-gray-500'

  return (
    <div className="relative flex-1 min-w-0 overflow-hidden bg-white border border-border rounded-lg shadow-2xs px-3.5 py-3">
      <div className="absolute inset-0 bg-gradient-to-br from-admin-mist to-transparent pointer-events-none" />

      <div className="relative flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <LeafIcon className="text-muted-foreground" size={13} />
            <span className="text-[11px] text-muted-foreground truncate">CO₂ Saved</span>
          </div>
          <div className="font-mono text-[20px] font-bold leading-tight truncate text-admin-canopy">
            {currentValue.toFixed(1)} kg
          </div>
          <div className="flex items-center gap-1 mt-1">
            <span className={`flex items-center gap-1 text-[11px] font-semibold ${deltaColor}`}>
              {direction === 'up' ? (
                <TrendUpIcon size={10} />
              ) : direction === 'down' ? (
                <TrendDownIcon size={10} />
              ) : (
                <ApproximateEqualsIcon size={10} />
              )}
              {growthPercentage}%
            </span>
            <span className="text-[11px] text-fg-subtle">vs last month</span>
          </div>
        </div>

        <RingProgress
          size={44}
          thickness={4}
          sections={[{ value: ringValue, color: 'primary' }]}
          label={<LeafIcon size={14} weight="fill" className="mx-auto text-primary" />}
        />
      </div>

      <div className="relative flex items-center gap-1 mt-2 pt-2 border-t border-border">
        <span className="font-mono text-[11px] text-admin-compost">≈ {treeYears.toFixed(1)} tree-years</span>
        <Tooltip
          multiline
          w={220}
          label="Approximate reference figure based on a public constant (~21kg CO₂ per tree per year) — not a direct measurement from this system."
        >
          <InfoIcon size={12} className="text-fg-subtle cursor-help" />
        </Tooltip>
      </div>
    </div>
  )
}

export default Co2SavedCard
