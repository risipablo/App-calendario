
// Paginate props
export interface PaginateProps{
    currentPage:number
    setCurrentPage: (page:number) => void
    totalItems: number;
    itemsPerPage: number;
    offset:number
    pageCount:number
}
