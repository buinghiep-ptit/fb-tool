export interface Pageable {
  page: number
  size: number
  sort: Array<string>
}

export interface PlaceCamp {
  name?: string
  pageable: Pageable
}
