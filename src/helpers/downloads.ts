export function download(filename: string, contents: string) {
  const blob = new Blob([contents], { type: "application/x-pem-file" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()

  URL.revokeObjectURL(url)
}
