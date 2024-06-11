import React from 'react';
import './skeleton.scss'

const Skeleton = ({ children, loading, width, height, rounded, className }) => {
  return (
    <>
      <div className={`relative ${width} ${height} ${rounded} ${className}`}>
        {loading && (
          <div className="bg-[#dddbdd] absolute top-0 left-0 bottom-0 right-0 z-10 skeleton">
          </div>
        )}
        {/* <div className="bg-[#dddbdd] absolute top-0 left-0 bottom-0 right-0 z-10 skeleton">
        </div> */}
        {children}
      </div>
    </>
  );
};

export default Skeleton;