import type { StructureBuilder, StructureResolver } from 'sanity/structure'
import type { ComponentType } from 'react'
import { BellIcon } from '@sanity/icons/Bell'
import { CogIcon } from '@sanity/icons/Cog'
import { ControlsIcon } from '@sanity/icons/Controls'
import { CommentIcon } from '@sanity/icons/Comment'
import { DocumentIcon } from '@sanity/icons/Document'
import { EditIcon } from '@sanity/icons/Edit'
import { HelpCircleIcon } from '@sanity/icons/HelpCircle'
import { HomeIcon } from '@sanity/icons/Home'
import { ImageIcon } from '@sanity/icons/Image'
import { MenuIcon } from '@sanity/icons/Menu'
import { PackageIcon } from '@sanity/icons/Package'
import { PinIcon } from '@sanity/icons/Pin'
import { TransferIcon } from '@sanity/icons/Transfer'
import { UserIcon } from '@sanity/icons/User'

/** Singleton: clicking the item opens the one document directly (no list). */
function singletonListItem(S: StructureBuilder, typeName: string, title: string, icon: ComponentType) {
  return S.listItem()
    .title(title)
    .icon(icon)
    .id(typeName)
    .child(S.document().schemaType(typeName).documentId(typeName).title(title))
}

function documentListItem(S: StructureBuilder, typeName: string, title: string, icon: ComponentType) {
  return S.documentTypeListItem(typeName).title(title).icon(icon)
}

/**
 * Settings folder. "SEO & tracking" is technical (analytics IDs, Google data), so only
 * administrators (the agency) see it. Client editors get the three everyday items.
 */
function settingsFolder(S: StructureBuilder, isAdmin: boolean) {
  return S.listItem()
    .title('Settings')
    .icon(CogIcon)
    .id('settings')
    .child(
      S.list()
        .title('Settings')
        .items([
          singletonListItem(S, 'businessInfo', 'Business info & hours', PinIcon),
          singletonListItem(S, 'announcementBar', 'Announcement bar', BellIcon),
          singletonListItem(S, 'brandSettings', 'Logo, footer & social', ImageIcon),
          ...(isAdmin ? [S.divider(), singletonListItem(S, 'seoSettings', 'SEO & tracking', ControlsIcon)] : []),
        ]),
    )
}

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      singletonListItem(S, 'homePage', 'Home page', HomeIcon),
      documentListItem(S, 'page', 'Pages', DocumentIcon),
      S.divider(),
      documentListItem(S, 'service', 'Services', PackageIcon),
      documentListItem(S, 'serviceArea', 'Service areas', PinIcon),
      documentListItem(S, 'blogPost', 'Blog posts', EditIcon),
      S.divider(),
      documentListItem(S, 'testimonial', 'Testimonials', CommentIcon),
      documentListItem(S, 'faq', 'FAQs', HelpCircleIcon),
      documentListItem(S, 'teamMember', 'Team', UserIcon),
      S.divider(),
      singletonListItem(S, 'navigation', 'Navigation', MenuIcon),
      settingsFolder(S, Boolean(context.currentUser?.roles.some((role) => role.name === 'administrator'))),
      documentListItem(S, 'redirect', 'Redirects', TransferIcon),
    ])
