import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { NavLink } from 'react-router-dom';

const PermissionDenied = () => {
  return (
    <>
      <div className="max-w-full h-auto mx-auto mb-20 flex flex-col items-center">
        <img
          className='max-w-[700px] h-full object-cover'
          src="../../permissionDenied.png" alt="" />
        <h1 className='text-center text-[46px] font-bold mb-4 text-bgPrimary font-mono leading-[32px] uppercase'>Quyền truy cập bị từ chối</h1>
        <div className="">
          <p className='font-mono text-[24px] text-center'>Trang bạn đang cố gắng truy cập yêu cầu quyền hạn lớn nhất</p>
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

export default PermissionDenied;