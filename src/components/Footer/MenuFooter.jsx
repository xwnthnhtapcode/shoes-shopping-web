import React from 'react';
import { NavLink } from 'react-router-dom';

const MenuFooter = ({ name, to }) => {
  return (
    <>
      <li className='flex gap-[10px] mb-[4px] list-none'>
        <NavLink
          to={to}
          style={({ isActive }) => ({
            color: isActive ? "#c30005" : "",
          })}
          className='hover:text-primary transition-all'>
          {name}
        </NavLink>
      </li>
    </>
  );
};

export default MenuFooter;