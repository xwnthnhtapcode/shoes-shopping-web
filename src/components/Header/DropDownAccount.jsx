import React from 'react';
import { faInfoCircle, faSignOutAlt, faTools, faTruckMoving } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink, useNavigate } from 'react-router-dom';
import './headerScroll.scss'

const DropDownAccount = ({ logined, logoutUser, setHoverAccount, admin }) => {
  const navigate = useNavigate()
  return (
    <>
      <ul
        className="absolute top-full text-[16px] min-w-[240px] rounded-[3px] bg-white shadow-shadowAccount drop-down-account z-[2] mt-3">
        {admin
          || (
            <li
              onClick={() => {
                navigate('/don-hang')
                // else
                setHoverAccount(false)
                window.scrollTo({
                  top: 0,
                  // behavior: 'smooth'
                });
              }}
              className='hover:text-black transition-all ease-linear duration-100 font-medium text-[#838586] px-5 py-[13px] rounded-[3px]'>
              <NavLink
                onClick={() => setHoverAccount(false)}
                className='flex items-center gap-1'>
                <FontAwesomeIcon
                  icon={faTruckMoving}
                  className='cursor-pointer pr-[10px] text-[18px]' />
                <p className='inline-block'>Đơn hàng</p>
              </NavLink>
            </li>
          )}

        <li
          onClick={() => {
            navigate('/tai-khoan')
            setHoverAccount(false)
            window.scrollTo({
              top: 0,
              // behavior: 'smooth'
            });
          }}
          className='hover:text-black transition-all ease-linear duration-100 font-medium text-[#838586] px-5 py-[13px] rounded-[3px]'>
          <NavLink
            // to="/tai-khoan"
            // onClick={() => setHoverAccount(false)}
            className='flex items-center gap-1'>
            <FontAwesomeIcon
              icon={faInfoCircle}
              className='cursor-pointer pr-[10px] text-[18px]' />
            <p className='inline-block'>Thông tin tài khoản</p>
          </NavLink>
        </li>

        <li
          onClick={() => {
            navigate('/')
            logoutUser()
            window.scrollTo({
              top: 0,
              // behavior: 'smooth'
            });
          }}
          className='hover:text-black transition-all ease-linear duration-100 font-medium text-[#838586] px-5 py-[13px] rounded-[3px]'>
          <NavLink
            // to='/'
            // onClick={logoutUser}
            className='flex items-center gap-1'>
            <FontAwesomeIcon
              icon={faSignOutAlt}
              className='cursor-pointer pr-[10px] text-[18px]' />
            <p className='inline-block'>Đăng xuất</p>
          </NavLink>
        </li>
      </ul>
    </>
  );
};

export default DropDownAccount;