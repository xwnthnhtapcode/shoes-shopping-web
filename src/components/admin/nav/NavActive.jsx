import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { NavLink } from 'react-router-dom';

const NavActive = ({ to, icon, iconSize = 'text-[18px]', text }) => {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        'backgroundColor': isActive ? "#1f2028" : "",
        'color': isActive ? "#fff" : "#1f2028",
      })}
      className='transition-all ease-linear duration-100 block w-full px-4 py-[12px] rounded-[6px] mb-3'>
      <div
        className='flex items-center gap-5'>
        <FontAwesomeIcon className={iconSize} icon={icon} />
        <span className=' text-[16px] font-[450]'>{text}</span>
      </div>
    </NavLink>
  );
};

export default NavActive;