import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
import { Spinning } from '../../../animation-loading';
import { NavLink } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { toast } from 'react-toastify';

const OverlaySendGift = ({
  children,
  openSendGift,
  setOpenSendGift,
  userID }) => {
  const [loading, setLoading] = useState(false);
  const codeRef = useRef()
  const valueRef = useRef()

  const sendVoucher = (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const docRef = addDoc(collection(db, "vouchers"), {
        userID,
        code: codeRef.current.value,
        value: Number(valueRef.current.value)
      });
      setTimeout(() => {
        setLoading(false)
        setOpenSendGift(false)
        toast.success('Gửi voucher thành công', {
          autoClose: 1200
        })
      }, 1000)
    } catch (e) {
      console.log(e.message);
    }
  }

  return (
    <>
      <div
        className='w-full h-full relative'>
        {openSendGift && (
          <form
            onSubmit={sendVoucher}
            // ref={overlayRef}
            // onClick={handleClickOutside}
            className="wraper-review bg-black/20 fixed top-0 left-0 bottom-0 right-0 z-[10000] flex items-center">
            <div className="relative review w-[520px] mx-auto px-6 py-6 bg-white rounded-[8px]">
              <div
                onClick={() => setOpenSendGift(false)}
                className="absolute hover:text-primary transition-all ease-linear duration-100 top-1 right-[6px]">
                <FontAwesomeIcon className='cursor-pointer text-[30px] p-2' icon={faXmark} />
              </div>
              <h1 className="text-[18px] font-bold text-bgPrimary uppercase">
                Gửi voucher cho khách hàng
              </h1>
              <div className="flex gap-3">
                <div className="flex-1 mt-7 relative bg-[#fff]">
                  <label
                    htmlFor='code'
                    className='absolute inline-block font-medium cursor-pointer top-0 left-[20px] px-[5px] text-[16px] translate-y-[-50%] text-bgPrimary bg-[#fff]'>
                    Mã giảm giá
                  </label>
                  <input
                    ref={codeRef}
                    required
                    className='px-2 py-3 pl-[20px] block w-full h-full text-[16px] border border-solid border-bgPrimary rounded-[4px] bg-transparent text-bgPrimary outline-none resize-none'
                    autoComplete="off"
                    type="text"
                    id='code'
                    placeholder='Mã giảm giá (Nhập chuỗi)' />
                </div>
                <div className="flex-1 mt-7 relative bg-[#fff]">
                  <label
                    htmlFor='value'
                    className='absolute inline-block font-medium cursor-pointer top-0 left-[20px] px-[5px] text-[16px] translate-y-[-50%] text-bgPrimary bg-[#fff]'>
                    Giá trị
                  </label>
                  <input
                    ref={valueRef}
                    required
                    className='px-2 py-3 pl-[20px] block w-full h-full text-[16px] border border-solid border-bgPrimary rounded-[4px] bg-transparent text-bgPrimary outline-none resize-none'
                    autoComplete="off"
                    type="text"
                    id='value'
                    placeholder='Giá trị (VNĐ)' />
                </div>
              </div>
              <button
                type='submit'
                className='inline-flex bg-primary text-white px-4 py-2 hover:bg-[#a40206] transition-all ease-linear duration-[120ms] mt-6 rounded-[8px] w-[145px] h-[40px] items-center justify-center'>
                <span className='tracking-wider uppercase text-[16px] font-medium'>
                  {loading
                    ? <Spinning size='22px' />
                    : 'Gửi voucher'
                  }
                </span>
              </button>
            </div>
          </form>
        )}
        {children}
      </div>
    </>
  );
};

export default OverlaySendGift;