export function labelFromUrl(url: string): string {
  return url.replace(/^https?:\/\//, '')
}
