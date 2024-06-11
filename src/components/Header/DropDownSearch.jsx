import React, { useEffect, useRef, useState } from 'react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink, useNavigate } from 'react-router-dom';
import './headerScroll.scss'
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';
import { selectUserID } from '../../redux-toolkit/slice/authSlice';
import { useSelector } from 'react-redux';
import { Spinning } from '../../animation-loading';

const DropDownSearch = ({ setHoverSearch }) => {
  const [loading, setLoading] = useState(false)
  // const [done, setDone] = useState(false)
  //
  // const [allProducts, setAllProducts] = useState([])
  // const [searchProducts, setSearchProducts] = useState([])
  //
  // const userID = useSelector(selectUserID) || localStorage.getItem('userID')
  const navigate = useNavigate()
  //
  const inputSearch = useRef(null)

  const handleSubmitSearch = (e) => {
    e.preventDefault()
    const valueSearch = inputSearch.current.value
    if (valueSearch === '') {
      toast.warn('Vui lòng nhập vào ô tìm kiếm', {
        autoClose: 1200,
        position: 'top-left'
      })
    }
    else {
      setLoading(true)
      //
      setTimeout(() => {
        navigate(`/tim-kiem/${valueSearch}`)
        setLoading(false)
        setHoverSearch(false)
        inputSearch.current.value = ''
      }, 800)
      //
    }
  }

  const solvePrice = (price) => {
    return Number(price).toLocaleString('vi-VN');
  }

  // useEffect(() => {
  //   setDone(false)

  //   getProducts()
  // }, [done])

  // useEffect(() => {
  //   getProducts()
  // }, [])

  return (
    <>
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute left-[-100px] text-[16px] w-[260px] rounded-[3px] bg-white shadow-shadowAccount drop-down-search z-[2] mt-3 p-5 font-medium cursor-default">

        <form
          onSubmit={handleSubmitSearch}
          className="w-full h-10 inline-flex items-center">
          <input
            ref={inputSearch}
            className='w-[180px] px-3 py-[6px] text-[18px] text-bgPrimary outline-none  border border-[#ddd]'
            placeholder='Tìm kiếm...'
            autoComplete='off'
            type="text" name="" id="" />
          <button
            type='submit'
            className="flex-1 h-full cursor-pointer bg-primary flex items-center justify-center transition-all ease-in-out duration-150">
            {loading
              ? <Spinning />
              : <FontAwesomeIcon className='text-white text-[16px] transition-all ease-in-out duration-100' icon={faSearch} />
            }
          </button>
        </form>



      </div>
    </>
  );
};

export default DropDownSearch;