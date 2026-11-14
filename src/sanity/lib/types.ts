import type { HomePageQueryResult, LayoutQueryResult } from '../types'

/** One page-builder section, as returned by the queries. */
export type PageBuilderBlock = NonNullable<NonNullable<HomePageQueryResult>['pageBuilder']>[number]
export type BlockOf<T extends PageBuilderBlock['_type']> = Extract<PageBuilderBlock, { _type: T }>

export type SiteSettings = NonNullable<LayoutQueryResult['settings']>
export type Navigation = NonNullable<LayoutQueryResult['navigation']>
export type Layout = LayoutQueryResult
