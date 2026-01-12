

import type { PaginateProps } from "../../types/interface";
import { Pagination } from "@mui/material";


export const PaginationComponent = ({
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalItems,
    offset,
    pageCount
}: PaginateProps) => {

    if (pageCount <= 1) return null
    
    return(
        <>
        {pageCount > 1 && (
            <div className="pagination-wrapper">
                <div className="pagination-info">
                    Mostrando {offset + 1} - {Math.min(offset + itemsPerPage, totalItems)} de {totalItems} tareas
                </div>
    
                <Pagination
                    count={pageCount}
                    page={currentPage + 1} 
                    onChange={(_event, page) => setCurrentPage(page - 1)}
                    color="primary"
                    showFirstButton
                    showLastButton
                />
            </div>
        )}
        </>
    
        
    )
}