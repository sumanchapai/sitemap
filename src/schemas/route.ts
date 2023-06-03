import {defineType} from 'sanity'
import {ROUTE_DOCUMENT_NAME} from '../constants'
import RouteIcon from '../components/RouteIcon'

interface Document {
  _id: string
}

interface DocumentType {
  type: string
}

export default function getRoute(pages: Array<string>) {
  return defineType({
    name: ROUTE_DOCUMENT_NAME,
    type: 'document',
    title: 'Routes',
    icon: RouteIcon,
    fields: [
      {
        name: 'title',
        type: 'string',
        title: 'Title',
        validation: (Rule) => Rule.required().min(1),
      },
      {
        name: 'slug',
        type: 'string',
        title: 'Slug name',
        description: 'This will be the URL name',
        validation: (Rule) =>
          Rule.required()
            .min(1)
            .custom((slug: string) =>
              slug.includes('/')
                ? 'Slug name cannot contain "/". Use filler instead routes for nesting.'
                : true
            ),
      },
      {
        title: 'Parent',
        name: 'parent',
        type: 'reference',
        to: [{type: ROUTE_DOCUMENT_NAME}],
        options: {
          filter: ({
            document, // Current document
          }: {
            document: Document
          }) => {
            return {
              // Ensure that the current document isn't the parent of the item that's listed
              // Also ensure that a document cannot be its own parent
              filter: 'parent._ref != $id && _id != $id',
              params: {
                id: document._id,
              },
            }
          },
        },
      },
      {
        name: 'type',
        type: 'string',
        title: 'Type',
        initialValue: 'static',
        options: {
          list: [
            {title: 'Static', value: 'static'},
            {title: 'Filler', value: 'filler'},
            {title: 'Dynamic', value: 'dynamic'},
          ],
          layout: 'radio',
        },
      },
      // Static route
      {
        name: 'staticRoute',
        type: 'object',
        title: 'Static Route Content',
        description: 'Static routes are routes that are not generated dynamically',
        fields: [
          {
            name: 'staticPage',
            type: 'reference',
            title: 'Static page',
            to: pages.map((p) => ({
              type: p,
            })),
          },
        ],
        hidden: ({parent}: {parent: DocumentType}) => parent?.type !== 'static',
      },
      // Dynamic route
      {
        name: 'dynamicRoute',
        type: 'object',
        title: 'Dynamic Route Content',
        description: 'Dynamic routes are routes that are generated dynamically',
        fields: [
          {
            name: 'title',
            type: 'string',
            title: 'Title',
          },
        ],
        hidden: ({parent}: {parent: DocumentType}) => parent?.type !== 'dynamic',
      },
      // Filler route
      {
        name: 'fillerRoute',
        type: 'object',
        title: 'Filler Route Content',
        description: 'Filler routes are routes without content',
        fields: [
          {
            name: 'title',
            type: 'string',
            title: 'Title',
          },
        ],
        hidden: ({parent}: {parent: DocumentType}) => parent?.type !== 'filler',
      },
    ],
    preview: {
      select: {
        title: 'slug',
        parent: 'parent.slug',
        type: 'type',
      },
      prepare(selection) {
        const {title, parent, type} = selection
        return {
          title: title,
          subtitle: parent ? `${type} - /${parent}/${title}` : `${type} - /${title}`,
        }
      },
    },
  })
}
