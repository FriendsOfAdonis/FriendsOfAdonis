import type { Metadata } from 'next'

type PackageInfo = {
  description: string
  name: string
  package: string
}

export const packages: Record<string, PackageInfo> = {
  magnify: {
    package: '@foadonis/magnify',
    name: 'Adonis Magnify',
    description: 'Plug and play full-text search for your Adonis application.',
  },
  openapi: {
    package: '@foadonis/openapi',
    name: 'Adonis OpenAPI',
    description: 'Generate OpenAPI V3 specifications for your Adonis application',
  },
  graphql: {
    package: '@foadonis/graphql',
    name: 'Adonis GraphQL',
    description: 'Create GraphQL APIs using Adonis and Apollo.',
  },
  shopkeeper: {
    package: '@foadonis/shopkeeper',
    name: 'Adonis Shopkeeper',
    description:
      "An expressive and fluent interface to Stripe's subscription billing services for Adonis.",
  },
}

export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: 'https://friendsofadonis.com',
      siteName: 'Friends Of Adonis',
      ...override.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@PaucotMartin',
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      ...override.twitter,
    },
  }
}
