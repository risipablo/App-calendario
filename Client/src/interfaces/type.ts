import type { Dispatch, SetStateAction } from "react";

// Paginate props
export interface PaginateProps{
    currentPage:number
    setCurrentPage: (page:number) => void
    totalItems: number;
    itemsPerPage: number;
    offset:number
    pageCount:number
}


export interface LoaderProps {
    setLoading: Dispatch<SetStateAction<boolean>>;
    onComplete?: () => void;
  }
  
export interface AuthenticatedProps{
  isAuthenticated: boolean | null  
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>  
}

export interface LoaderProps {
  setLoading: Dispatch<SetStateAction<boolean>>;
  onComplete?: () => void;
}

