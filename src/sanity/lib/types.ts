import type { HomePageQueryResult, LayoutQueryResult } from '../types'

/** One page-builder section, as returned by the queries. */
export type PageBuilderBlock = NonNullable<NonNullable<HomePageQueryResult>['pageBuilder']>[number]
export type BlockOf<T extends PageBuilderBlock['_type']> = Extract<PageBuilderBlock, { _type: T }>

export type SiteSettings = NonNullable<LayoutQueryResult['settings']>
export type Navigation = NonNullable<LayoutQueryResult['navigation']>
/** Layout data. Settings and navigation can be missing (empty dataset, or the CMS can't be reached). */
export type Layout = Omit<LayoutQueryResult, 'settings' | 'navigation'> & {
  settings: LayoutQueryResult['settings'] | null
  navigation: LayoutQueryResult['navigation'] | null
}

/** Used when the layout query fails, so pages still render with their built-in fallbacks. */
export const emptyLayout: Layout = { settings: null, navigation: null, footerPages: [] }
