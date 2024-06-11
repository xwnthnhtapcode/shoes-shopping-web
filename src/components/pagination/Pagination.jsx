import { faBan, faLongArrowAltLeft, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';

const Pagination = ({
  products,
  itemsPerPage,
  setPageProducts,
  quantity,
  currentPage,
  setCurrentPage
}) => {

  const totalPages = Math.ceil(products.length / itemsPerPage);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, products.length);
    const productsSlice = products.slice(startIndex, endIndex)
    setPageProducts(productsSlice);
  }, [currentPage, products])

  return (
    <>
      <ol className="flex items-center justify-center gap-6 text-[18px] font-medium mt-4">
        <li>
          <button
            onClick={() => (currentPage > 1 && setCurrentPage(currentPage - 1))}
            className="inline-flex gap-2 items-center justify-center rounded border border-gray-100">
            <FontAwesomeIcon className='text-[18px] text-bgPrimary' icon={faLongArrowAltLeft} />
            <span className="text-[16px]">Prev Page</span>
          </button>
        </li>

        <div className="flex items-center justify-center gap-2">
          {Array(quantity).fill().map((_, idx) => {
            //moi lan page tang quantity thi count tang len 1
            //page 1-5: count = 1
            //page 2-6: count = 2
            //...
            const count = Math.floor((currentPage - 1) / quantity) + 1;
            const activeNumber = 1 + quantity * (count - 1)
            return (
              <li
                key={idx}
                className=''>
                {idx + activeNumber < totalPages + 1
                  ? <button
                    onClick={() => setCurrentPage(idx + activeNumber)}
                    className={`${currentPage === idx + activeNumber ? 'bg-bgPrimary text-white' : ''} w-[44px] h-[44px] flex items-center justify-center rounded py-2 border border-gray-100 leading-8`} >
                    {idx + activeNumber}
                  </button>
                  : <FontAwesomeIcon className='text-[15px] text-primary block rounded w-[48px] aspect-square py-2 border border-gray-100 text-center leading-8' icon={faBan} />}
              </li>
            )
          }
          )}

        </div>

        <li>
          <button
            onClick={() => (currentPage < totalPages && setCurrentPage(currentPage + 1))}
            className="inline-flex gap-2 items-center justify-center rounded border border-gray-100" >
            <span className="text-[16px]">Next Page</span>
            <FontAwesomeIcon className='text-[18px] text-bgPrimary' icon={faLongArrowAltRight} />
          </button>
        </li>
      </ol>
    </>
  );
};

export default Pagination;