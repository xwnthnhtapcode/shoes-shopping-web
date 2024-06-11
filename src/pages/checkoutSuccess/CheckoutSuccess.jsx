import React, { useState } from 'react';
import { OverlayLoading } from '../../animation-loading';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectEmail, selectUserName } from '../../redux-toolkit/slice/authSlice';

const CheckoutSuccess = ({
  cartProducts,
  totalPayment,
  shippingAddress,
  deliveryFee,
  discount,
  orderDate,
  orderTime }) => {
  const displayEmail = useSelector(selectEmail) || localStorage.getItem('displayEmail')
  const displayName = useSelector(selectUserName) || localStorage.getItem('displayName')

  const solveCategory = (category) => {
    switch (category) {
      case 'giay-nam':
        return 'Giày nam'
      case 'giay-nu':
        return 'Giày nữ'
      case 'giay-tre-em':
        return 'Giày trẻ em'
      default:
        break;
    }
  }

  const solvePrice = (price) => {
    return Number(price).toLocaleString('vi-VN');
  }

  return (
    <>
      <div className="w-full py-[30px]">
        <div className="max-w-[1230px] mx-auto ">
          <div className="w-full px-[15px] pb-[30px]">
            <div className="w-full flex">
              <form className='w-full flex'>
                {/* left */}
                <div className="basis-[58.33%] pr-[30px] flex flex-col gap-6">
                  <div className="w-full">
                    <h1 className='text-[26px] text-bgPrimary font-bold'>Chi tiết đơn hàng</h1>
                    <div className="">
                      <div className="flex justify-between uppercase font-bold border-[3px] border-transparent border-b-[#ececec]">
                        <h2 className='text-[14px] tracking-widest text-bgPrimary py-2'>Sản phẩm</h2>
                        <h2 className='text-[14px] tracking-widest text-bgPrimary py-2'>Tổng</h2>
                      </div>
                      {cartProducts.map((cartProduct) => (
                        <div
                          key={cartProduct.id}
                          className="flex justify-between py-2 border border-transparent border-b-[#ddd]">
                          <NavLink
                            to={`/san-pham/${cartProduct.id}`}
                            className='text-[#334862] text-[14px] cursor-pointer flex items-center'>
                            {cartProduct.name}
                            <div className="inline-block mx-1 w-[2px] h-4 bg-[#aaa]"></div>
                            <p className='text-[#666] inline text-[14px] cursor-pointer'>{solveCategory(cartProduct.category)}</p>
                            <strong className='text-bgPrimary font-blod ml-1 text-[14px]'>× {cartProduct.quantity}</strong>
                          </NavLink>
                          <h2 className='font-bold inline-block text-[14px]'>
                            {solvePrice(cartProduct.price)} ₫
                          </h2>
                        </div>
                      ))}
                      <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                        <h2 className=''>Tổng phụ</h2>
                        <h2 className='font-bold inline-block text-[14px]'>
                          {solvePrice(totalPayment)} ₫
                        </h2>
                      </div>
                      <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                        <h2 className=''>Giao hàng</h2>
                        <h2 className='font-bold inline-block text-[14px]'>
                          {solvePrice(deliveryFee)} ₫
                        </h2>
                      </div>
                      <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                        <h2 className=''>Giảm giá từ shop</h2>
                        <h2 className='font-bold inline-block text-[14px]'>
                          {solvePrice(discount)} ₫
                        </h2>
                      </div>
                      <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                        <h2 className=''>Phương thức thanh toán</h2>
                        <h2 className='font-bold inline-block text-[14px]'>
                          {shippingAddress.paymentMethod === "cash"
                            ? 'Trả tiền mặt khi nhận hàng'
                            : 'Chuyển khoản ngân hàng'}
                        </h2>
                      </div>
                      <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                        <h2 className=''>Tổng cộng</h2>
                        <h2 className='font-bold inline-block text-[14px]'>
                          {totalPayment + deliveryFee - discount > 0
                            ? solvePrice(totalPayment + deliveryFee - discount)
                            : 0} ₫
                        </h2>
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                    <h1 className='text-[26px] text-bgPrimary font-bold'>Địa chỉ giao hàng</h1>
                    <div className="">
                      <div className="flex justify-between py-2 border border-transparent border-b-[#ddd]">
                        <h2 className='text-[14px]'>Tỉnh / Thành phố
                        </h2>
                        <h2 className='font-bold inline-block text-[14px]'>
                          {shippingAddress.city}
                        </h2>
                      </div>
                      <div className="flex justify-between py-2 border border-transparent border-b-[#ddd]">
                        <h2 className='text-[14px]'>Quận / Huyện
                        </h2>
                        <h2 className='font-bold inline-block text-[14px]'>
                          {shippingAddress.district}
                        </h2>
                      </div>
                      <div className="flex justify-between py-2 border border-transparent border-b-[#ddd]">
                        <h2 className='text-[14px]'>Phường / Xã
                        </h2>
                        <h2 className='font-bold inline-block text-[14px]'>
                          {shippingAddress.wards}
                        </h2>
                      </div>
                      <div className="flex justify-between py-2 border border-transparent border-b-[#ddd]">
                        <h2 className='text-[14px]'>Địa chỉ cụ thể
                        </h2>
                        <h2 className='font-bold inline-block text-[14px]'>
                          {shippingAddress.address}
                        </h2>
                      </div>
                      <div className="flex justify-between py-2 border border-transparent border-b-[#ddd]">
                        <h2 className='text-[14px]'>Số điện thoại
                        </h2>
                        <h2 className='font-bold inline-block text-[14px]'>
                          {shippingAddress.phoneNumber}
                        </h2>
                      </div>
                      <div className="flex justify-between py-2 border border-transparent border-b-[#ddd]">
                        <h2 className='text-[14px]'>Ghi chú
                        </h2>
                        <h2 className='font-bold inline-block text-[14px]'>
                          {shippingAddress.note
                            ? shippingAddress.note
                            : <p className='italic'>Không có ghi chú</p>}
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>

                {/* right */}
                <div className='self-start flex-1 py-6 bg-[#fafafa] shadow-md px-[30px] border-[2px] border-solid'>
                  <strong className='text-[#7a9c59] font-bold block mb-5'>Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được nhận</strong>
                  <ul className=''>
                    <li className='flex mb-3'>
                      <p className='mr-1'>Thời gian đặt hàng:</p>
                      <strong>{`${orderDate} | ${orderTime}`}</strong>
                    </li>
                    <li className='flex mb-3'>
                      <p className='mr-1'>Tên hiển thị:</p>
                      <strong>{displayName}</strong>
                    </li>
                    <li className='flex mb-3'>
                      <p className='mr-1'>Email:</p>
                      <strong>{displayEmail}</strong>
                    </li>
                    <li className='flex mb-3'>
                      <p className='mr-1'>Tổng cộng:</p>
                      <strong>
                        {totalPayment + deliveryFee - discount > 0
                          ? solvePrice(totalPayment + deliveryFee - discount)
                          : 0} ₫
                      </strong>
                    </li>
                    <li className='flex mb-3'>
                      <p className='mr-1'>Phương thức thanh toán:</p>
                      <strong>
                        {shippingAddress.paymentMethod === "cash"
                          ? 'Trả tiền mặt khi nhận hàng'
                          : 'Chuyển khoản ngân hàng'}
                      </strong>
                    </li>
                  </ul>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};

export default CheckoutSuccess;