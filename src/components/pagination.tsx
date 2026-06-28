'use client';

import style from '@styles/admin/pagination.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChangePage: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onChangePage,
}) => {
  return (
    <div className={style.pagination}>
      <button
        disabled={page === 1}
        onClick={() => onChangePage(page - 1)}
      >
        <ChevronLeft size={18} />
      </button>

      <span className={style.pageInfo}>
        {page} / {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => onChangePage(page + 1)}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};