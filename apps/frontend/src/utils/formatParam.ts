export const formatParam = (text: string | null | undefined, formatChar: string): string => {
  if (text === null || text === undefined) return ''

  if (!text || !formatChar) return text

  return text.split(formatChar).join('\n')
}
