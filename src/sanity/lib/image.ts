import { createImageUrlBuilder } from '@sanity/image-url'
import { dataset, projectId } from '../env'

const builder = createImageUrlBuilder({ projectId, dataset })

export type ImageSource = Parameters<typeof builder.image>[0]

/** Build a Sanity CDN image URL. Respects the editor's crop + hotspot. */
export function urlFor(source: ImageSource) {
  return builder.image(source).auto('format').fit('max')
}
