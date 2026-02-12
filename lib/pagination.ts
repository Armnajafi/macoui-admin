export function toApiEndpoint(url: string): string {
  if (!url) return url

  if (url.startsWith("http")) {
    const parsed = new URL(url)
    const apiPathIndex = parsed.pathname.indexOf("/api/")
    const path = apiPathIndex >= 0 ? parsed.pathname.slice(apiPathIndex) : parsed.pathname
    return `${path}${parsed.search}`
  }

  return url
}
