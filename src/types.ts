interface RouteSMParentType {
  _id: string
  slug: string
  _type: string
  type: 'static' | 'dynamic' | 'filler'
  title: string
}

export interface RouteSMType {
  parent: RouteSMParentType
  _id: string
  type: 'static' | 'dynamic' | 'filler'
  slug: string
  _type: string
  title: string
}
