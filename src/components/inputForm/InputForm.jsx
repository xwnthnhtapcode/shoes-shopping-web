import React from 'react';

const InputForm = ({ numberType, type, py, borderColor, width, labelName, placeholder, bg, id, children, value, onChange, name, maxLength }) => {
  return (
    <div className={`${width} relative ${type === "textarea" ? "flex-1" : ""}`}>
      <label
        htmlFor={id}
        className={`${bg} absolute inline-block font-medium cursor-pointer top-0 left-[10px] px-[5px] text-[16px] translate-y-[-50%] text-bgPrimary`}>
        {labelName}
      </label>
      {type === 'input'
        ? <input
          required
          value={value}
          onChange={onChange}
          name={name}
          className={`px-[15px] ${py || 'py-[12px]'} block w-full text-[16px] border border-solid  rounded-[4px] ${borderColor || 'border-bgPrimary'} bg-transparent text-bgPrimary outline-none `}
          autoComplete="off"
          type={numberType || "text"}
          id={id}
          placeholder={placeholder}
          maxLength={maxLength} />
        : ""}

      {type === 'textarea'
        ? <textarea
          required
          value={value}
          onChange={onChange}
          name={name}
          className={`px-[15px] ${py || 'py-[12px]'} block w-full h-full text-[16px] border border-solid border-bgPrimary rounded-[4px] bg-transparent text-bgPrimary outline-none`}
          cols="30"
          autoComplete="off"
          type="text"
          id={id}
          placeholder={placeholder} />
        : ""}

      {type === 'select'
        ? <select
          required
          value={value}
          onChange={onChange}
          name={name}
          className={`cursor-pointer px-[15px] ${py || 'py-[12px]'} block w-full text-[16px] border border-solid border-bgPrimary rounded-[4px] bg-transparent text-bgPrimary outline-none`}
          autoComplete="off"
          type="text"
          id={id}
          placeholder={placeholder} >
          {children}
        </select>
        : ""}

    </div >
  );
};

export default InputForm;