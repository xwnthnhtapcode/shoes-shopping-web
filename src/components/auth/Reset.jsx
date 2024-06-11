import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Spinning } from '../../animation-loading';
import { auth } from '../../firebase/config';

const Reset = ({ signUp, setResetPassword }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleResetPassword = (e) => {
    e.preventDefault()
    setLoading(true)
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setLoading(false)
        toast.success("Kiểm tra email để nhận đường dẫn đặt lại mật khẩu", {
          autoClose: 1200
        })
        setResetPassword(false)
      })
      .catch((e) => {
        setLoading(false)
        toast.error('Email chưa đăng ký tài khoản', {
          autoClose: 1200,
        });
      });
  }

  return (
    <>
      <div className={`absolute top-0 transition-all duration-[0.6s] ease-in-out h-full left-0 w-1/2 z-[2] ${signUp ? "translate-x-[100%]" : ""}`}>
        <form onSubmit={handleResetPassword} className='bg-white flex justify-center flex-col px-[50px] h-full'>
          <h1 className="font-bold m-0 text-[30px] text-center">Quên mật khẩu</h1>
          <span className='text-[13px] mb-3  flex items-center'>
            <div className="flex-grow flex-shrink w-[30px] h-[2px] inline-block bg-[#ccc]"></div>
            <p className='mx-[5px] my-2'>Nhập email để lấy lại mật khẩu</p>
            <div className="flex-grow flex-shrink w-[30px] h-[2px] inline-block bg-[#ccc]"></div>
          </span>
          <input
            onChange={(e) => setEmail(e.target.value)}
            className='bg-[#eee] focus:outline-none focus:shadow-shadowPrimary border-none py-3 px-[15px] my-2 w-full' type="text" placeholder="Email" />
          <NavLink
            onClick={() => setResetPassword(false)}
            className=' text-[#333] text-[14px] underline my-[15px] flex items-center'>
            <FontAwesomeIcon className='mr-[6px]' icon={faLongArrowAltLeft} />
            Đăng nhập
          </NavLink>
          <button
            type='submit'
            className='bg-primary text-white text-[13px] leading-5 font-bold py-3 px-[45px] tracking-[1px] uppercase transition-transform ease-in delay-[80ms] focus:outline-none'>
            {loading ? <Spinning /> : "Đặt lại mật khẩu"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Reset;