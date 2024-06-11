import { faArrowLeft, faArrowRight, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';

const OverlayProduct = ({
  children,
  activeImg,
  openOverlay,
  setOpenOverlay,
  imgProductsPreview }) => {

  return (
    <>
      <div className='w-full h-full relative'>
        {openOverlay && (
          <OverlayChild
            activeImg={activeImg}
            setOpenOverlay={setOpenOverlay}
            imgProductsPreview={imgProductsPreview}
          />
        )}
        {children}
      </div>
    </>
  );
};

const OverlayChild = ({
  activeImg,
  setOpenOverlay,
  imgProductsPreview,
}) => {

  const [translateShowX, setTranslateShowX] = useState(activeImg * 876)
  return (
    <div
      className="wraper-review bg-black/20 fixed top-0 left-0 bottom-0 right-0 z-[10000] flex items-center justify-center">
      <div className="relative w-[1000px] mx-auto flex items-center justify-center">
        {/* prev */}
        <div
          onClick={() => setTranslateShowX(translateShowX - 876)}
          className={`${translateShowX === 0 && 'hidden'} absolute cursor-pointer top-[50%] translate-y-[-50%] left-[-60px] flex items-center justify-center w-[66px] h-[66px] rounded-full bg-white z-50 shadow-shadowHover hover:bg-slate-700 transition-all ease-in-out duration-200 hover:text-white group`}>
          <FontAwesomeIcon className=' text-[32px] text-bgPrimary group-hover:text-white' icon={faArrowLeft} />
        </div>
        <div className="cursor-pointer w-[876px] h-[586px] mx-auto whitespace-nowrap mt-[30px] rounded-[8px] relative z-[48] overflow-hidden">
          <div
            onClick={() => setOpenOverlay(false)}
            className="absolute hover:text-primary transition-all ease-linear duration-100 top-1 right-[6px] z-[100]">
            <FontAwesomeIcon className='cursor-pointer text-[40px] p-2' icon={faXmark} />
          </div>
          <div
            style={{
              transform: `translateX(-${translateShowX}px)`
            }}
            className="h-full transition-all ease-in-out duration-300 rounded-[8px] ">
            {imgProductsPreview.map((imgProduct, idx) => (
              <img
                key={idx}
                className='select-none pointer-events-none rounded-[8px] inline-flex w-[876px] h-full object-cover' src={imgProduct} alt="" />
            ))}
          </div>
        </div>
        {/* next */}
        <div
          onClick={() => setTranslateShowX(translateShowX + 876)}
          className={`${translateShowX === (imgProductsPreview.length - 1) * 876 && 'hidden'} absolute cursor-pointer top-[50%] translate-y-[-50%] right-[-60px] flex items-center justify-center w-[66px] h-[66px] rounded-full bg-white z-50 shadow-shadowHover hover:bg-slate-700 transition-all ease-in-out duration-200 hover:text-white group`}>
          <FontAwesomeIcon className=' text-[32px] text-bgPrimary group-hover:text-white' icon={faArrowRight} />
        </div>
      </div>
    </div>
  )
}

export default OverlayProduct;