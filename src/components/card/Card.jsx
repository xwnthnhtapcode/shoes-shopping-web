import React from 'react';

const Card = ({ children, width }) => {
  return (
    <div className={`${width} inline-flex shadow-shadowPrimary hover:shadow-shadowHover transition-all ease-linear delay-[0.1s]`}>
      {children}
    </div>
  );
};

export default Card;