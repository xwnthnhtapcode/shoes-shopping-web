import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import "../../components/lineClamp.scss"
import { Skeleton } from '../../animation-loading';

const solvePrice = (price) => {
  return Number(price).toLocaleString('vi-VN');
}

const NewestProduct = ({ productDemo, loading }) => {
  const navigate = useNavigate()
  return (
    <>
      <div className="w-full mt-10">
        <p className='font-bold mb-5 text-bgPrimary text-[16px] uppercase tracking-widest'>Sản phẩm</p>
        <ul className="p-[15px] pb-0 bg-[#fcfcfc] border border-solid border-[#ddd] flex flex-col gap-1">
          {(productDemo.length === 0
            ? Array(5).fill()
            : productDemo).map((item, idx) => (
              <Skeleton key={idx} width='w-full' height='min-h-[80px]' loading={loading}>
                <li className={`min-h-[80px] flex gap-4 ${idx > -1 && "border border-transparent border-dashed border-t-[#ececec]"}`}>
                  <img
                    onClick={() => {
                      navigate(`/san-pham/${item?.id}`)
                      window.scrollTo({
                        top: 0,
                        // behavior: 'smooth'
                      });
                    }}
                    className='w-[60px] h-[60px] object-cover cursor-pointer'
                    src={item?.imgURL}
                    alt="" />
                  <div className="flex-1">
                    <NavLink
                      to={`/san-pham/${item?.id}`}
                      onClick={() => {
                        window.scrollTo({
                          top: 0,
                          // behavior: 'smooth'
                        });
                      }}
                      className='block text-[#334862] text-[14px] mb-1 line-clamp-1'>{item?.name}</NavLink>
                    <span
                      className='text-[#111111] font-bold text-[14px]'>
                      {solvePrice(item?.price)}
                      <p className='inline-block text-[14px] align-top ml-[2px]'>₫</p>
                    </span>
                  </div>
                </li>
              </Skeleton>
            ))}
          {/* <li className='min-h-[80px] pt-[10px] pb-[5px] flex gap-4'>
            <img className='w-[60px] h-[60px] object-cover' src="https://source.unsplash.com/random" alt="" />
            <div className="flex-1">
              <NavLink className='block text-[#334862] text-[14px] mb-5'>Chuck 70 Psy-Kicks Ox </NavLink>
              <span className='text-[#111111] font-bold text-[14px]'>2,800,000 ₫</span>
            </div>
          </li>
          <li className='min-h-[80px] pt-[10px] pb-[5px] flex gap-4 border border-transparent border-dashed border-t-[#ececec]'>
            <img className='w-[60px] h-[60px] object-cover' src="https://source.unsplash.com/random" alt="" />
            <div className="flex-1">
              <NavLink className='block text-[#334862] text-[14px] mb-5'>Chuck 70 Psy-Kicks Ox </NavLink>
              <span className='text-[#111111] font-bold text-[14px]'>2,800,000 ₫</span>
            </div>
          </li> */}

        </ul>
      </div>
    </>
  );
};

export default NewestProduct;