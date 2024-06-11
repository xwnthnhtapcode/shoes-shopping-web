import React from 'react';
import { NavLink } from 'react-router-dom';

const Nav = ({ name, to }) => {
  return (
    <>
      <NavLink
        to={to}
        onClick={() => {
          window.scrollTo({
            top: 0,
            // behavior: 'smooth'
          });
        }}
        style={({ isActive }) => ({
          borderColor: isActive ? '#c30005' : "",
        })}
        className={`pt-[15px] pb-[10px] list-none border-b-[3px] border-solid cursor-pointer hover:transition-all hover:ease-linear duration-300 border-transparent hover:border-bgPrimary`}>
        <div
          className='text-bgPrimary text-[14px] no-underline uppercase font-bold tracking-[0.32px] leading-[1.8]'
        >{name}
        </div>
      </NavLink>
    </>
  );
};

export default Nav;