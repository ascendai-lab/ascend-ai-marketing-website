import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { visionTool } from '@sanity/vision'
import { schemaTypes, singletonTypes } from './src/sanity/schemas'
import { structure } from './src/sanity/structure'
import { resolve } from './src/sanity/presentation'
import { dataset, previewOrigin, projectId } from './src/sanity/env'

// Singletons can only be published/edited, never created, duplicated or deleted.
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  name: 'default',

  // ── REPLACE per client ───────────────────────────────────────
  title: 'Client Site Name',
  // ─────────────────────────────────────────────────────────────

  projectId,
  dataset,

  plugins: [
    // Presentation first so editors land in visual editing.
    presentationTool({
      resolve,
      previewUrl: {
        origin: previewOrigin,
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
      },
      allowOrigins: previewOrigin ? [previewOrigin] : undefined,
    }),
    structureTool({ structure }),
    ...(import.meta.env.DEV ? [visionTool()] : []),
  ],

  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },

  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
})
