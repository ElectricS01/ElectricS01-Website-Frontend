export const formatFileSize = (size: number): string => {
  if (size < 1024) return `${size} B`
  if (size < 1_048_576) return `${(size / 1024).toFixed(1)} KB`
  if (size < 1_073_741_824) return `${(size / 1_048_576).toFixed(1)} MB`
  return `${(size / 1_073_741_824).toFixed(1)} GB`
}
