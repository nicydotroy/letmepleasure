/**
 * IndexNow integration — pings Bing, Yandex, Naver, Seznam, Yep when URLs
 * are added or change so they get indexed instantly instead of waiting for
 * the next crawl. Google does not currently consume IndexNow, but the
 * protocol covers most non-Google search engines.
 *
 * The key string also lives in public/{KEY}.txt for ownership verification.
 */
const INDEXNOW_KEY = '542a4126a30d13d9dde31edeb84619a9'
const HOST = 'letmepleasure.com'
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`
const ENDPOINT = 'https://api.indexnow.org/indexnow'

/**
 * Submit a single URL or batch of URLs to IndexNow. Failures are swallowed
 * so an indexing hiccup never breaks the calling request path.
 */
export async function pingIndexNow(urls: string | string[]): Promise<void> {
  const urlList = Array.isArray(urls) ? urls : [urls]
  if (urlList.length === 0) return

  // IndexNow caps each request at 10,000 URLs — we batch in chunks of 9,000
  // to leave headroom and keep the JSON body well under the soft limit.
  const chunks: string[][] = []
  const CHUNK = 9000
  for (let i = 0; i < urlList.length; i += CHUNK) {
    chunks.push(urlList.slice(i, i + CHUNK))
  }

  await Promise.all(
    chunks.map(async (chunk) => {
      try {
        await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify({
            host: HOST,
            key: INDEXNOW_KEY,
            keyLocation: KEY_LOCATION,
            urlList: chunk,
          }),
        })
      } catch {
        // Best-effort: a network blip on a search-engine ping must never
        // surface as an error to the user posting an ad.
      }
    })
  )
}

export const INDEXNOW_CONFIG = { key: INDEXNOW_KEY, host: HOST, keyLocation: KEY_LOCATION }
