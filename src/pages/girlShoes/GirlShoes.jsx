import React from 'react';
import PageProducts from '../../components/pageProducts/PageProducts';
import { STORE_GIRL_PRODUCTS, selectGirlProducts } from '../../redux-toolkit/slice/productSlice';


const GirlShoes = () => {
  return (
    <>
      <PageProducts
        currentName='Giày nữ'
        fieldValue='giay-nu'
        STORE_NAME_PRODUCTS={STORE_GIRL_PRODUCTS}
        selectNameProduct={selectGirlProducts} />
    </>
  );
};

export default GirlShoes;