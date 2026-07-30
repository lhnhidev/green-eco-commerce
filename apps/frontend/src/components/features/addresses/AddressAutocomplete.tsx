import { useSearchAddresses } from '@api'
import type { AddressSuggestion } from '@api/schemas'
import { Autocomplete, Loader } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { useMemo, useState } from 'react'

type AddressAutocompleteProps = {
  value: string
  onChange: (value: string) => void
  onSelectSuggestion: (suggestion: AddressSuggestion) => void
  placeholder?: string
  label?: string
}

const AddressAutocomplete = ({ value, onChange, onSelectSuggestion, placeholder, label }: AddressAutocompleteProps) => {
  const [debouncedValue] = useDebouncedValue(value, 300)
  const trimmed = debouncedValue.trim()

  const { data: suggestions, isFetching } = useSearchAddresses(
    { input: trimmed },
    { query: { enabled: trimmed.length > 2 } },
  )

  const [lastSuggestions, setLastSuggestions] = useState<AddressSuggestion[]>([])

  // Keep the most recent non-empty suggestion list around so selecting an option
  // still works even after the debounce/query has moved on.
  const options = useMemo(() => {
    if (suggestions) {
      setLastSuggestions(suggestions)
      return suggestions
    }
    return lastSuggestions
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestions])

  return (
    <Autocomplete
      label={label}
      placeholder={placeholder ?? 'Start typing your address...'}
      value={value}
      onChange={onChange}
      data={options.map((s) => s.description)}
      onOptionSubmit={(selected) => {
        const match = options.find((s) => s.description === selected)
        if (match) onSelectSuggestion(match)
      }}
      rightSection={isFetching ? <Loader size="xs" /> : null}
    />
  )
}

export default AddressAutocomplete
