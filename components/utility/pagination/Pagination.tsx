import { Paginator, PaginatorTemplate } from 'primereact/paginator';
import type { NextPage } from 'next';
import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { PaginatorPageState } from 'primereact';

type PaginationProp = {
  onPageChange: Function;
  totalRecords: number;
  totalPages: number;
  rowsPerPage: number;
  ref: any;
};

const Pagination: NextPage<PaginationProp> = forwardRef(
  ({ onPageChange, totalRecords, rowsPerPage, totalPages }, ref) => {
    useImperativeHandle(ref, () => ({
      resetPagination() {
        setFirstPage(1);
        setCurrentPage(1);
      },
    }));

    const [firstPage, setFirstPage] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const handlePageChange = (event: PaginatorPageState) => {
      setFirstPage(event.first);
      setCurrentPage(event.page + 1);
      onPageChange(event.page + 1);
    };

    useEffect(() => {
      setFirstPage(1);
      setCurrentPage(1);
    }, [totalRecords, totalPages]);
    return (
      <div>
        <Paginator
          first={firstPage}
          template={'PrevPageLink PageLinks  NextPageLink'}
          className='!text-xs pagination-component'
          rows={rowsPerPage}
          totalRecords={totalRecords}
          onPageChange={handlePageChange}
        ></Paginator>
        <p className='text-center text-xs text-gray-600'>
          {' '}
          Page {currentPage} / {totalPages}{' '}
        </p>
        <style jsx global>{`
          .pagination-component .p-dropdown-label.p-inputtext,
          .pagination-component button,
          .pagination-component .p-dropdown-item {
            font-size: 0.75rem !important;
            line-height: 1rem !important;
          }
          .pagination-component .p-paginator-prev,
          .pagination-component .p-paginator-next {
            border-radius: 0 !important;
            height: 2rem !important;
          }
          .pagination-component .p-paginator-page {
            height: 2rem !important;
            min-width: 2rem !important;
          }
          @media screen and (max-width: 325px) {
            .p-paginator.p-component.pagination-component {
              padding-right: 0 !important;
              padding-left: 0 !important;
            }
          }
        `}</style>
      </div>
    );
  }
);
Pagination.displayName = 'Pagination';
export default Pagination;
