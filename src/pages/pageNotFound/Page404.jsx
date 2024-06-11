import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { NavLink } from 'react-router-dom';

const Page404 = () => {
  return (
    <>
      <div className="max-w-full h-auto mx-auto mb-20 flex flex-col items-center">
        <img
          className='max-w-[520px] h-full object-cover'
          src="../../404.png" alt="" />
        <h1 className='text-center text-[46px] font-bold mb-4 text-bgPrimary font-mono leading-[32px] uppercase'>Bạn đã bị lạc lối 404</h1>
        <div className="">
          <p className='font-mono text-[24px] text-center'>Trang này hiện không tồn tại hoặc đã bị xóa</p>
          <p className='font-mono text-[24px] text-center'>Thay tên hoặc tạm thời cách ly</p>
        </div>
        <div className="mt-5">
          <NavLink
            to='/'
            className='bg-primary text-white px-4 py-3 hover:bg-[#a40206] transition-all ease-linear duration-[120ms]'>
            <FontAwesomeIcon className='mr-[6px]' icon={faLongArrowAltLeft} />
            <span className='text-[20px]'>Quay lại trang chủ</span>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Page404;