import React from 'react';
import { Spinning } from '../../animation-loading';
import "./ButtonPrimary.scss"

const ButtonPrimary = ({ text, loading, onClick }) => {
  return (
    <div>
      <div className="mt-[10px] button-hover">
        <button
          onClick={onClick}
          className={`btn ${loading ? "bg-secondary" : "bg-primary"}`}>
          <span>
            {loading ? <Spinning /> : text}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ButtonPrimary;