export const IMAGE_URL = 'https://media.rawg.io/media/'
export const LIGHTWEIGHT_IMAGE_URL = {
  VIDEO: 'https://media.rawg.io/media/crop/600/400/',
  NO_VIDEO: 'https://media.rawg.io/media/resize/640/-/',
}

export function formatImageUrl(url: string, clipExists = true) {
  const urlReplaced = clipExists
    ? LIGHTWEIGHT_IMAGE_URL.VIDEO
    : LIGHTWEIGHT_IMAGE_URL.NO_VIDEO

  return !!url ? url.replace(IMAGE_URL, urlReplaced) : ''
}
