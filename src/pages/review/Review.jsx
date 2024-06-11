import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { selectEmail, selectUserID, selectUserName } from '../../redux-toolkit/slice/authSlice';
import StarsRating from 'react-star-rate';
import './review.scss'
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Timestamp, addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import Spinning from '../../animation-loading/spinning/Spinning'

const Review = ({
  children,
  id,
  openReview,
  setOpenReview,
  setReviewDone,
  review,
  orderID
}) => {
  const overlayRef = useRef(null)
  //
  const [loading, setLoading] = useState(false);
  //
  const [rate, setRate] = useState('');
  const [typeReview, setTypeReview] = useState('');
  const currentUser = auth.currentUser;
  const userID = useSelector(selectUserID) || localStorage.getItem('userID')
  const displayName = useSelector(selectUserName) || localStorage.getItem('displayName')
  const displayEmail = useSelector(selectEmail) || localStorage.getItem('displayEmail')

  const MAX_WORDS = 180;
  const handleChange = (e) => {
    e.preventDefault()
    const words = e.target.value.trim()
    if (words.length > MAX_WORDS) {
      const truncatedWords = words.slice(0, MAX_WORDS);
      setTypeReview(truncatedWords.trim());
      toast.warn('Giới hạn của ô là 180 ký tự', {
        autoClose: 1200,
        position: 'top-left'
      })
    } else {
      setTypeReview(e.target.value);
    }
  };

  const handleClickOutside = (e) => {
    e.preventDefault()
    if (e.target.contains(overlayRef.current) && openReview) {
      setOpenReview(false)
    }
  }


  const solveDate = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString('vi-VN', { month: 'long' });
    const year = today.getFullYear();
    return `${day} ${month}, ${year}`;
  }

  const solveTime = () => {
    const now = new Date()
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const second = now.getSeconds().toString().padStart(2, '0');
    return `${hour}:${minute}:${second}`;
  }

  const detectReview = (review, f1, f2) => {
    if (review) return f1;
    return f2
  }

  const saveReview = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await addDoc(collection(db, "reviews"), {
        userID,
        imgAvatar: localStorage.getItem('imgAvatar') || currentUser?.photoURL,
        displayName,
        displayEmail,
        productID: id,
        rate,
        typeReview,
        orderID,
        orderDate: solveDate(),
        orderTime: solveTime(),
        creatAt: Timestamp.now().toDate().toString()
      })
      setLoading(false)
      setOpenReview(false)
      setReviewDone(true)
      toast.success('Đánh giá sản phẩm thành công', {
        autoClose: 1200,
        position: 'top-left'
      })
    } catch (e) {
      console.log(e.message);
    }
  }

  const editReview = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await setDoc(doc(db, "reviews", review.id), {
        userID,
        imgAvatar: localStorage.getItem('imgAvatar') || currentUser?.photoURL,
        displayName,
        displayEmail,
        productID: id,
        rate,
        typeReview,
        orderID,
        orderDate: review.orderDate,
        orderTime: review.orderTime,
        creatAt: review.creatAt,
        editedAt: Timestamp.now().toDate().toString()
      })
      setLoading(false)
      toast.success('Sửa đánh giá thành công', {
        autoClose: 1200,
        position: 'top-left'
      })
      setOpenReview(false)
    } catch (e) {
      console.log(e.message);
    }
  }

  useEffect(() => {
    if (review) {
      setRate(review.rate)
      setTypeReview(review.typeReview)
    }
  }, [review])

  return (
    <>
      <div
        className='w-full h-full relative'>
        {openReview && (
          <div
            ref={overlayRef}
            // onClick={handleClickOutside}
            className="wraper-review bg-black/20 fixed top-0 left-0 bottom-0 right-0 z-[10000] flex items-center">
            <div className="relative review w-[520px] mx-auto px-6 py-6 bg-white rounded-[8px] mt-[68px]">
              <div
                onClick={() => setOpenReview(false)}
                className="absolute hover:text-primary transition-all ease-linear duration-100 top-1 right-[6px]">
                <FontAwesomeIcon className='cursor-pointer text-[30px] p-2' icon={faXmark} />
              </div>
              <h1 className="text-[18px] font-bold text-bgPrimary uppercase">
                Đánh giá đơn hàng
              </h1>
              <div className="">
                <StarsRating
                  value={rate}
                  onChange={rate => {
                    setRate(rate);
                  }}
                />
              </div>
              <div className="mt-7 relative bg-[#f2f2f4]">
                <div className="absolute top-0 left-[20px] w-[168px] h-[3px] bg-[#f2f2f4]"></div>
                <label
                  htmlFor='review'
                  className='absolute inline-block font-medium cursor-pointer top-0 left-[20px] px-[5px] text-[16px] translate-y-[-50%] text-bgPrimary'>
                  Đánh giá về sản phẩm
                </label>
                <textarea
                  value={typeReview}
                  onChange={handleChange}
                  required
                  className='px-[15px] py-5 pl-[20px] block w-full h-full text-[16px] border border-solid border-bgPrimary rounded-[4px] bg-transparent text-bgPrimary outline-none resize-none'
                  cols="30"
                  rows='4'
                  autoComplete="off"
                  type="text"
                  id='review'
                  placeholder='Bạn có đóng góp gì về sản phẩm này? (Giới hạn 200 ký tự)' />
              </div>
              <NavLink
                onClick={detectReview(review, editReview, saveReview)}
                className='inline-block bg-primary text-white px-4 py-2 hover:bg-[#a40206] transition-all ease-linear duration-[120ms] mt-6 rounded-[8px] min-w-[233px] h-[40px]'>
                <div className="w-full">
                  <span className='tracking-wider uppercase text-[16px] font-medium'>
                    {loading
                      ? <Spinning size='22px' />
                      : (
                        `${review ? 'Sửa đánh giá của bạn' : 'Gửi đánh giá của bạn'}`
                      )
                    }
                  </span>
                </div>
              </NavLink>
            </div>
          </div>
        )}
        {children}
      </div>
    </>
  );
};

export default Review;