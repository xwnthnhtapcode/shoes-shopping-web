import React from 'react';
import CarLoading from '../../components/carLoading/CarLoading';

const OverlayLoading = ({ children, loading }) => {
  return (
    <>
      <div className={`w-full h-full ${loading && 'pointer-events-none select-none'} relative `}>
        {loading && (
          <div className="bg-white/75 absolute top-0 left-0 bottom-0 right-0 z-[10000]">
            <CarLoading />
          </div>
        )}
        {children}
      </div>
    </>
  );
};

export default OverlayLoading;