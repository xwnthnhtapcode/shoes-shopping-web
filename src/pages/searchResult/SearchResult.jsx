import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectIsAdmin } from '../../redux-toolkit/slice/authSlice';
import { NavLink, useParams } from 'react-router-dom';
import { Skeleton } from '../../animation-loading';
import { Card, ProductItem } from '../../components';
import Pagination from '../../components/pagination/Pagination';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../firebase/config';

const itemsPerPage = 10;
const quantity = 3;

const SearchResult = () => {
  const { queryValue } = useParams()
  const [loading, setLoading] = useState(true);
  const [searchProducts, setSearchProducts] = useState([])

  const queryRef = useRef()
  const admin = useSelector(selectIsAdmin) || JSON.parse(localStorage.getItem('admin'))

  const [currentPage, setCurrentPage] = useState(1)
  const [pageProducts, setPageProducts] = useState([]); //products every page (use slice to cut all prod

  const getProductsSearch = async () => {
    setLoading(true)
    setCurrentPage(1)
    const productsRef = collection(db, "products");
    const q = query(productsRef);
    try {
      const querySnapshot = await getDocs(q);
      const allProducts = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        }
      })
      const searchProducts = allProducts.filter(product => product.name.toLowerCase().includes(queryValue.toLowerCase()))
      console.log(searchProducts);
      setTimeout(() => {
        setLoading(false)
        setSearchProducts(searchProducts)
        setPageProducts(searchProducts.slice(0, itemsPerPage))
      }, 800)
    }
    catch (e) {
      console.log(e.message);
    }
  }

  const handleQueryProduct = (e) => {
    if (e.target.value !== 'default') {
      const { field, order } = solveQuery(e.target.value)
      if (field === 'creatAt') {
        setSearchProducts([...searchProducts].sort((a, b) => {
          if ((new Date(a[field])) > (new Date(b[field]))) return order
          return (order) * (-1)
        }));
      }
      else {
        setSearchProducts([...searchProducts].sort((a, b) => {
          if (a[field] > b[field]) return order
          return (order) * (-1)
        }));
      }
    }
  }

  const solveQuery = (value) => {
    //1 la a[..] > b[...]
    //-1 ..
    switch (value) {
      case 'latest':
        return {
          field: 'creatAt',
          order: -1
        }
      case 'oldest':
        return {
          field: 'creatAt',
          order: 1
        }
      case 'lowest-price':
        return {
          field: 'price',
          order: 1
        }
      case 'highest-price':
        return {
          field: 'price',
          order: -1
        }
      case 'a-z':
        return {
          field: 'name',
          order: 1
        }
      case 'z-a':
        return {
          field: 'name',
          order: -1
        }
      default:
        break;
    }
  }

  const solvePrice = (price) => {
    return Number(price).toLocaleString('vi-VN');
  }

  useEffect(() => {
    //reset init
    setSearchProducts([])
    setPageProducts([])
    queryRef.current.value = 'default'
    //
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    getProductsSearch()
  }, [queryValue])

  return (
    <>
      <div className='min-h-[666px]'>
        {/* top */}
        <div className=" max-w-[1230px] px-[15px] mx-auto min-h-[60px] pt-5 flex items-center justify-between">
          <div className="flex-1">
            <NavLink
              to='/'
              className='uppercase text-[18px] text-[#95959f] hover:text-bgPrimary'>
              Trang chủ
            </NavLink>
            <div className="mx-2 inline-block">/</div>
            <span className='uppercase text-[18px] font-bold '>
              Kết quả tìm kiếm cho {`"${queryValue}"`}
            </span>
          </div>
          <div className="flex items-center">
            <p className='inline-block text-[16px] text-[#353535] mr-8'>
              <span className='font-bold'>Số lượng</span>: {searchProducts.length} sản phẩm
            </p>
            <select
              ref={queryRef}
              onChange={handleQueryProduct}
              className='outline-none mr-[12px] px-3 py-3 pr-16 text-bgPrimary cursor-pointer border bg-white border-solid border-[#ccc] shadow-shadowSearch'
              name="sort-by" id="">
              <option key='0' value="default">Sắp xếp theo</option>
              <option key='1' value="latest">Mới nhất</option>
              <option key='2' value="oldest">Cũ nhất</option>
              <option key='3' value="lowest-price">Giá tăng dần</option>
              <option key='4' value="highest-price">Giá giảm dần</option>
              <option key='5' value="a-z">A - Z</option>
              <option key='6' value="z-a">Z - A</option>
            </select>
          </div>
        </div>

        {/* bot */}
        <div className="w-full">
          <div className='max-w-[1230px] min-h-[666px] pt-[30px] mx-auto'>
            <div className="w-full">
              {searchProducts.length == 0 && !loading
                ? (
                  <div className='flex flex-col items-center'>
                    <img
                      className='w-[350px] object-cover'
                      src="..//../notFound.jpg" alt=""
                    />
                    <h1 className='text-[26px] text-center text-bgPrimary font-mono'>Không tìm thấy sản phẩm nào</h1>
                  </div>
                )
                : (
                  <>
                    <div className={`px-[15px] ${searchProducts.length > 0 && 'min-h-[596px]'} grid grid-cols-5`}>
                      {(pageProducts.length === 0 && loading
                        ? Array(10).fill()
                        : pageProducts).map((item, idx) => (
                          <div
                            key={idx}
                            className="w-full px-[10px] pb-5">
                            <Skeleton loading={loading} className={`${loading && 'overflow-hidden rounded-[6px]'}`}>
                              <Card width='w-full' >
                                <ProductItem
                                  product={item}
                                  id={item?.id}
                                  img={item?.imgURL}
                                  name={item?.name}
                                  price={solvePrice(item?.price)}
                                  idURL={`tim-kiem/${queryValue}`}
                                  text={admin ? 'Sửa sản phẩm' : 'Thêm vào giỏ'}
                                />
                              </Card>
                            </Skeleton>
                          </div>
                        ))}
                    </div>
                    {searchProducts?.length > itemsPerPage
                      && (
                        <div className="mb-10">
                          <Pagination
                            products={searchProducts}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            itemsPerPage={itemsPerPage}
                            quantity={quantity}
                            setPageProducts={setPageProducts} />
                        </div>
                      )
                    }
                  </>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchResult;