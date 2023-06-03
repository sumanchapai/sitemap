import {SchemaTypeDefinition, definePlugin} from 'sanity'
import getRoute from './schemas/route'
import RouteIcon from './components/RouteIcon'
import Tool from './components/Tool'

interface SitemapConfig {
  pages: Array<SchemaTypeDefinition>
}

export const myPlugin = definePlugin<SitemapConfig | void>((config) => {
  if (!config?.pages || config.pages.length === 0) {
    throw new Error(`
    You haven't defined the pages to for the RouterSMConfig
    Add the routeSM({pages: [Add array of document schemas type here]})
    in the plugins array of your sanity configuration.
    `)
  }
  const nonDoc = config.pages.find((x) => x.type !== 'document')
  if (nonDoc) {
    throw new Error(`
    Found a non-document type ${nonDoc.title} in the array of document schemas
    in routeSM configuration.
    `)
  }
  return {
    name: 'route-sm',
    schema: {
      types: (prev) => {
        return [...prev, getRoute(config.pages.map((x) => x.name))]
      },
    },
    tools: (prev) => {
      return [
        ...prev,
        {
          name: 'sitemap',
          title: 'Sitemap',
          icon: RouteIcon,
          component: Tool,
        },
      ]
    },
  }
})
