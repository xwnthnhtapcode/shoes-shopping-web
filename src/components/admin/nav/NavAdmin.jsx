import React from 'react';
import { faFolder, faHome, faMountain, faPlus, faUsers } from '@fortawesome/free-solid-svg-icons';
import NavActive from './NavActive';
import { useSelector } from 'react-redux';
import { auth } from '../../../firebase/config';

const NavAdmin = () => {
  const currentUser = auth.currentUser;
  const displayName = useSelector(state => state.auth.userName)

  return (
    <div className="rounded-tl-[12px] rounded-bl-[12px] p-[20px] pt-0 w-[270px] shadow-xl">
      <div className="w-full py-[20px] flex flex-col items-center mb-[10px]">
        <img
          className='w-[80px] h-[80px] rounded-full mb-2 object-cover'
          src={localStorage.getItem('imgAvatar') || currentUser?.photoURL} alt="" />
        <span className='block font-[500] text-center text-bgPrimary text-[18px]'>{localStorage.getItem('displayName') || displayName}</span>
      </div>
      <ul className='w-full'>
        <NavActive to='home' icon={faHome} text='Thống kê' />
        <NavActive to='view-users' icon={faUsers} iconSize='text-[18px]' text='Quản lý khách hàng' />
        <NavActive to='view-products' icon={faMountain} iconSize='text-[22px]' text='Xem sản phẩm' />
        <NavActive to='add-product/add' icon={faPlus} text='Thêm sản phẩm' />
        <NavActive to='view-orders/view' icon={faFolder} text='Xem đơn đặt hàng' />
      </ul>

    </div>
  );
};

export default NavAdmin;