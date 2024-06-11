import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Spinning } from '../../../animation-loading';

const UploadSquare = ({ src, srcURL, setSrc, text, id, width, name, handleImageChange }) => {
  // const [src, setSrc] = useState(null)
  const [loading, setLoading] = useState(false)
  const handleShowImage = (e) => {
    //show image
    const fileImg = e.target.files[0];
    if (!fileImg) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSrc({
        ...src,
        [e.target.name]: reader.result
      });
    };
    reader.readAsDataURL(fileImg);

    //call callback: handleImageChange to upload file in firebase
    handleImageChange(e, fileImg, setLoading); //fileImg là đối tượng của hình ảnh đó
  }

  return (
    <div className={`${width} aspect-square border-[2px] bg-[#f2f5f8] border-dashed border-bgPrimary rounded-[4px]`}>
      <label
        className='flex flex-col gap-2 items-center justify-center w-full h-full cursor-pointer'
        htmlFor={id}>
        {loading && <Spinning color='#000' size='26px' />}
        {!srcURL && !loading &&
          <>
            <FontAwesomeIcon className='text-[26px]' icon={faCloudUploadAlt} />
            <span className='text-[16px]'>{text}</span>
          </>}
        {srcURL && !loading && <img className='w-full h-full object-cover object-center' src={srcURL} alt="" />}
      </label>
      <input
        onChange={handleShowImage}
        type="file"
        name={name}
        id={id}
        hidden />
    </div>
  );
};
// upload-product
export default UploadSquare;