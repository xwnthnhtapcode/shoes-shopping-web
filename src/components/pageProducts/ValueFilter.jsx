import React, { useEffect, useState } from 'react';
import InputForm from '../inputForm/InputForm';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const minValueFilter = 500000
const maxValueFilter = 3000000;

const ValueFilter = ({
  setProductPreview,
  queryRef,
  filterRef,
  selectNameProduct,
  setCurrentPage }) => {

  const productsCategoryRedux = useSelector(selectNameProduct) //trai, gai, tre em

  const [errorRange, setErrorRange] = useState(false)
  const [priceRange, setPriceRange] = useState({
    from: null,
    to: null
  })

  const handleRangeSearch = (e) => {
    e.preventDefault()
    if (errorRange) toast.error('Vui lòng điền khoảng giá phù hợp', {
      autoClose: 1000
    })
    else {
      //thằng nào k điền (null thì lấy giá trị mặc định)
      //khi lọc thì luôn lấy thằng gốc nhé :v (lấy trên redux)
      const ProductFilter = productsCategoryRedux.filter((item) => (item.price >= Number(priceRange.from || minValueFilter) && item.price <= Number(priceRange.to || maxValueFilter)))
      setCurrentPage(1)
      setProductPreview(ProductFilter)
      //reset
      filterRef.current.value = 'default'
      queryRef.current.value = 'default'
      setPriceRange({
        from: null,
        to: null
      })
    }
  }


  const handleSetPriceRange = (e) => {
    e.preventDefault()
    //check value invalid
    if (/^\d{0,7}$/.test(e.target.value)) {
      setPriceRange({
        ...priceRange,
        [e.target.name]: e.target.value
      })
    }
  }

  const solvePrice = (price) => {
    return Number(price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }

  useEffect(() => {
    if ((Number(priceRange.from) > Number(priceRange.to) && priceRange.from !== null && priceRange.from !== "" && priceRange.to !== null && priceRange.to !== "")
      || ((priceRange.from === "" || priceRange.from === null) && priceRange.to && Number(priceRange.to) < minValueFilter)
      || ((priceRange.to === "" || priceRange.to === null) && priceRange.from && Number(priceRange.from) > maxValueFilter)) {
      setErrorRange(true)
    }
    else setErrorRange(false)
  }, [priceRange])


  return (
    <>
      <aside className="w-full">
        <p className='font-bold text-bgPrimary text-[16px] uppercase tracking-widest'>Khoảng giá</p>
        <div className={`w-full my-5 flex items-center gap-3`}>
          <InputForm
            value={priceRange.from || ""}
            onChange={handleSetPriceRange}
            name='from'
            type='input'
            width='w-1/2'
            py='py-2'
            labelName='Từ'
            placeholder='VNĐ'
            bg='bg-white'
            id='min'
            maxLength={7}
            borderColor={`${errorRange ? 'border-primary' : ''}`}
          />
          <div className="w-[24px] h-[2px] bg-[#aaa]"></div>
          <InputForm
            value={priceRange.to || ""}
            onChange={handleSetPriceRange}
            name='to'
            type='input'
            width='w-1/2'
            py='py-2'
            labelName='Đến'
            placeholder='VNĐ'
            bg='bg-white'
            id='max'
            maxLength={7}
            borderColor={`${errorRange ? 'border-primary' : ''}`}
          />
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={handleRangeSearch}
            className="bg-[#666] rounded-full text-white text-[16px] py-[6px] px-6">
            Lọc
          </button>
          <div className='text-[14px] inline-block ml-auto'>
            Giá
            <p className='inline-block font-bold mx-1'>{solvePrice(priceRange.from || '500000')}</p>
            <p className='inline'>-</p>
            <p className='inline-block font-bold mx-1'>{solvePrice(priceRange.to || '3000000')}</p>
          </div>

        </div>
      </aside>
    </>
  );
};

export default ValueFilter;