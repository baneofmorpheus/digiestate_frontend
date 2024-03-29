import Router, { useRouter } from 'next/router';
import { useState, useEffect, useRef, useCallback } from 'react';

import axiosErrorHandler from 'helpers/axiosErrorHandler';
import { useSelector, useDispatch } from 'react-redux';
import { updateToastData } from 'reducers/utility';
import digiEstateAxiosInstance from 'helpers/digiEstateAxiosInstance';
import { Dialog } from 'primereact/dialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import Pagination from 'components/utility/pagination/Pagination';
import { Skeleton } from 'primereact/skeleton';
import { DependentListType, SingleDependentType } from 'types/';
import Dependent from 'components/reusable/dependent/Dependent';
import EmptyState from 'components/utility/empty_state/EmptyState';

type FilterData = {
  selectedPerPage: number;
  name: string;
};

const SecurityDependentList = () => {
  const [showFiltertModal, setShowFilterModal] = useState<boolean>(false);

  const paginationRef = useRef<any>(null);
  const [formLoading, setFormLoading] = useState(false);
  const updateToastDispatch = useDispatch();

  const [dependents, setDependents] = useState<DependentListType>([]);

  const { estate } = useSelector((state: any) => state.authentication);
  const [perPage, setPerPage] = useState<number>(10);
  const [selectedPerPage, setSelectedPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [selectedName, setSelectedName] = useState<string>('');
  const router = useRouter();

  const [filterData, setFilterData] = useState<FilterData>({
    selectedPerPage: 10,
    name: '',
  });

  const handleDialogHideEevent = () => {
    setShowFilterModal(false);
  };

  const resetFilter = () => {
    setShowFilterModal(false);

    setSelectedName('');
    setSelectedPerPage(10);
    setCurrentPage(1);
    paginationRef.current.resetPagination();

    setFilterData({
      selectedPerPage: 10,
      name: '',
    });
  };
  const applyFilter = () => {
    setShowFilterModal(false);

    setFilterData({
      selectedPerPage: selectedPerPage,
      name: selectedName || '',
    });
  };

  const getDependents = useCallback(async () => {
    const queryData: any = {};

    queryData.per_page = filterData.selectedPerPage;
    queryData.name = filterData.name;

    setPerPage(selectedPerPage);
    queryData.page = currentPage;
    const queryString = Object.keys(queryData)
      .map((key) => {
        return (
          encodeURIComponent(key) + '=' + encodeURIComponent(queryData[key])
        );
      })
      .join('&');

    setFormLoading(true);
    try {
      const response = await digiEstateAxiosInstance.get(
        `/estates/${estate.id}/dependents?${queryString}`
      );
      setDependents(response.data.data.dependents);

      setTotalRecords(response.data.data.links.total);
      setTotalPages(response.data.data.links.last_page);
    } catch (error: any) {
      const toastData = axiosErrorHandler(error);
      updateToastDispatch(updateToastData(toastData));
    }
    setFormLoading(false);
  }, [
    filterData.selectedPerPage,
    filterData.name,
    selectedPerPage,
    currentPage,
    estate.id,
    updateToastDispatch,
  ]);

  useEffect(() => {
    getDependents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getDependents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData]);

  useEffect(() => {
    getDependents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleNameFilterSubmit = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter') {
      applyFilter();
    }
  };

  const viewDependent = (dependent: SingleDependentType) => {
    return router.push(`/app/dependents/single/${dependent.id}`);
  };

  return (
    <div className=' pt-6 md:pl-2 md:pr-2'>
      <div className=' '>
        <div className='mb-4  ml-auto mr-auto lg:pr-0 lg:pl-0 pl-2 pr-2  '>
          <div className=''>
            <h2 className=' mb-2 lato-font'>Dependents</h2>

            <div className='flex  mb-6'>
              <div className='w-4/5'>
                <input
                  value={selectedName}
                  onChange={(e) => {
                    setSelectedName(e.target.value);
                  }}
                  id='filterInput'
                  onKeyDown={handleNameFilterSubmit}
                  placeholder='  Search by name, press enter or search key to search'
                  className='rei-text-input !rounded-r-none '
                  type='search'
                  name='name'
                />{' '}
              </div>
              <div className='w-1/5  '>
                <button
                  type='button'
                  className='bg-gray-600 w-full transition-all duration-700 hover:bg-black hover:text-white lg:pl-4 pl-2 pr-2 lg:pr-4 pt-2 pb-2 rounded-r-lg text-digiDefault text-sm'
                  onClick={() => {
                    setShowFilterModal(true);
                  }}
                >
                  Filter{' '}
                  <FontAwesomeIcon
                    className={` filter-icon `}
                    icon={faFilter}
                  />
                </button>
              </div>
            </div>

            <div className='guests-container mb-4'>
              {formLoading && (
                <div>
                  <div className='flex mb-4'>
                    <Skeleton
                      shape='circle'
                      size='3REM'
                      className='mr-2'
                    ></Skeleton>
                    <div style={{ flex: '1' }}>
                      <Skeleton width='100%' className='mb-2'></Skeleton>
                      <Skeleton width='75%'></Skeleton>
                    </div>
                  </div>
                  <div className='flex mb-4'>
                    <Skeleton
                      shape='circle'
                      size='3REM'
                      className='mr-2'
                    ></Skeleton>
                    <div style={{ flex: '1' }}>
                      <Skeleton width='100%' className='mb-2'></Skeleton>
                      <Skeleton width='75%'></Skeleton>
                    </div>
                  </div>
                  <div className='flex mb-4'>
                    <Skeleton
                      shape='circle'
                      size='3REM'
                      className='mr-2'
                    ></Skeleton>
                    <div style={{ flex: '1' }}>
                      <Skeleton width='100%' className='mb-2'></Skeleton>
                      <Skeleton width='75%'></Skeleton>
                    </div>
                  </div>
                </div>
              )}

              {!formLoading && dependents.length < 1 && (
                <div className=' mb-2  text-center pt-2 pb-2'>
                  <EmptyState message='No dependents found' />
                </div>
              )}
              {!formLoading &&
                dependents.map(
                  (singleDependent: SingleDependentType, index) => {
                    return (
                      <Dependent
                        handleClick={viewDependent}
                        key={index}
                        dependent={singleDependent}
                      />
                    );
                  }
                )}
            </div>
            <div>
              <Pagination
                ref={paginationRef}
                rowsPerPage={perPage}
                onPageChange={onPageChange}
                totalRecords={totalRecords}
                totalPages={totalPages}
              />
            </div>
          </div>
        </div>

        <Dialog
          header=''
          id='filterDialog'
          visible={showFiltertModal}
          position='bottom'
          modal
          style={{ width: '100vw' }}
          onHide={handleDialogHideEevent}
          draggable={false}
          resizable={false}
        >
          <div>
            <form className='lg:w-1/2 ml-auto mr-auto'>
              <div className='mb-6 flex flex-col  justify-between gap-y-2.5 md:gap-x-2.5 '>
                <h4 className='mb-4 font-bold'>Filter</h4>

                <div className='text-sm mb-4'>
                  <label className='block' htmlFor='range'>
                    Number of Results Per Page
                  </label>
                  <select
                    value={selectedPerPage}
                    onChange={(e) => setSelectedPerPage(Number(e.target.value))}
                    className='rei-text-input'
                    name='perPage'
                    id=''
                  >
                    <option value='10'>10</option>
                    <option value='20'>20</option>
                    <option value='60'>60</option>
                    <option value='100'>100</option>
                    <option value='200'>200</option>
                  </select>
                </div>
              </div>
              <div className='flex gap-x-4'>
                <button
                  type='button'
                  onClick={applyFilter}
                  className='pt-2 pb-2 pl-4 pr-4 bg-gray-600 text-digiDefault rounded-lg text-sm'
                >
                  Apply
                </button>
                <button
                  onClick={resetFilter}
                  type='button'
                  className='pt-2 pb-2 pl-4 pr-4 border-2 border-gray-600 rounded-lg text-sm'
                >
                  Cancel / Reset
                </button>
              </div>
            </form>
          </div>
        </Dialog>
      </div>
      <style global jsx>{`
        @keyframes p-progress-spinner-color {
          100%,
          0% {
            stroke: #4b5563;
          }
          40% {
            stroke: #4b5563;
          }
          66% {
            stroke: #4b5563;
          }
          80%,
          90% {
            stroke: #4b5563;
          }
        }
        #filterInput {
          -webkit-appearance: none;
        }

        #filterDialog,
        #editDialog,
        #deleteDialog {
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default SecurityDependentList;
