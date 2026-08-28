import type { Metadata } from 'next'
import type { Page } from '@/lib/source'

type PackageInfo = {
  /**
   * Full product name. Used to prefix every SEO title of the package
   * (e.g. "AdonisJS GraphQL - Getting Started") and shown on OG images.
   */
  name: string
  /** npm package name */
  package: string
  /** Fallback description, used when a page ships without one */
  description: string
}

export const siteName = 'Friends Of Adonis'

export const siteDescription =
  'Well-crafted and battle-tested AdonisJS packages made with ♥ by the community'

export const packages: Record<string, PackageInfo> = {
  'magnify': {
    package: '@foadonis/magnify',
    name: 'AdonisJS Magnify',
    description:
      'Plug and play full-text search for AdonisJS, powered by Algolia, Meilisearch or Typesense.',
  },
  'openapi': {
    package: '@foadonis/openapi',
    name: 'AdonisJS OpenAPI',
    description:
      'Generate OpenAPI V3 specifications from your AdonisJS controllers using TypeScript decorators.',
  },
  'graphql': {
    package: '@foadonis/graphql',
    name: 'AdonisJS GraphQL',
    description:
      'Build code-first GraphQL APIs in AdonisJS with TypeScript decorators, Apollo Server or GraphQL Yoga.',
  },
  'shopkeeper': {
    package: '@foadonis/shopkeeper',
    name: 'AdonisJS Shopkeeper',
    description:
      "An expressive, fluent interface to Stripe's subscription billing services for AdonisJS.",
  },
  'maintenance': {
    package: '@foadonis/maintenance',
    name: 'AdonisJS Maintenance',
    description:
      'Put your AdonisJS application in maintenance mode without redeploying, with bypass secrets and custom drivers.',
  },
  'crypt': {
    package: '@foadonis/crypt',
    name: 'AdonisJS Crypt',
    description:
      'Safely store encrypted secrets and environment credentials inside your AdonisJS repository.',
  },
  'actions': {
    package: '@foadonis/actions',
    name: 'AdonisJS Actions',
    description:
      'Organize business logic into reusable action classes that run as controllers, Ace commands and event listeners.',
  },
  'lucid-parser': {
    package: '@foadonis/lucid-parser',
    name: 'AdonisJS Lucid Parser',
    description:
      'Parse Lucid models through the TypeScript AST to extract property and relationship type information.',
  },
  'flick': {
    package: '@foadonis/flick',
    name: 'AdonisJS Flick',
    description:
      'A typed, driver-based feature flag system for AdonisJS, with scopes, Edge helpers and test fakes.',
  },
  'sentinel': {
    package: '@foadonis/sentinel',
    name: 'AdonisJS Sentinel',
    description:
      'Authentication building blocks for AdonisJS: email verification, password management and magic links.',
  },
}

export const baseUrl =
  process.env.NODE_ENV === 'development'
    ? new URL('http://localhost:3000')
    : new URL('https://friendsofadonis.com')

/** The package a documentation page belongs to, if any. */
export function getPackage(page: Page): PackageInfo | undefined {
  return packages[page.slugs[0] ?? '']
}

/**
 * SEO title of a documentation page. Always carries the library name so the
 * ~7 pages titled "Getting Started" stay distinguishable in search results.
 */
export function getPageTitle(page: Page): string {
  const pkg = getPackage(page)
  const title = page.data.title ?? siteName
  return pkg && title !== pkg.name ? `${pkg.name} - ${title}` : title
}

/** Description of a documentation page, falling back to its package then the site. */
export function getPageDescription(page: Page): string {
  return page.data.description ?? getPackage(page)?.description ?? siteDescription
}

function resolveTitle(title: Metadata['title']): string | undefined {
  if (typeof title === 'string') return title
  if (title && typeof title === 'object') {
    if ('absolute' in title && title.absolute) return title.absolute
    if ('default' in title && title.default) return title.default
  }
  return undefined
}

type MetadataInput = Metadata & {
  /** Path of the page, used to build its canonical and og:url */
  path?: string
}

export function createMetadata({ path, ...override }: MetadataInput): Metadata {
  const url = new URL(path ?? '/', baseUrl).toString()
  const title = resolveTitle(override.title)
  const description = override.description ?? undefined

  return {
    ...override,
    alternates: {
      canonical: url,
      ...override.alternates,
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url,
      siteName,
      locale: 'en_US',
      ...override.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@PaucotMartin',
      site: '@PaucotMartin',
      title,
      description,
      ...override.twitter,
    },
    metadataBase: baseUrl,
  }
}

export function getPageImage(page: Page) {
  const segments = [...page.slugs, 'image.webp']

  return {
    segments,
    url: `/og/${segments.join('/')}`,
  }
}

export function withPageImage(page: Page, metadata: MetadataInput): MetadataInput {
  const image = {
    url: getPageImage(page).url,
    width: 1_200,
    height: 630,
    alt: getPageTitle(page),
  }

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      images: [image],
    },
    twitter: {
      ...metadata.twitter,
      images: [image],
    },
  }
}
