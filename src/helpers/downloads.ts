export function download(filename: string, contents: string) {
  const blob = new Blob([contents], { type: "application/x-pem-file" })
  const url = URL.createObjectURL(blob)

  downloadUrl(url, filename)

  URL.revokeObjectURL(url)
}

export function downloadUrl(url: string, filename: string) {
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
}
