import React, { useEffect, useState } from 'react';
import { faInfoCircle, faSignOutAlt, faTools, faTruckMoving, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink, useNavigate } from 'react-router-dom';
import './headerScroll.scss'
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';
import { selectUserID } from '../../redux-toolkit/slice/authSlice';
import { useSelector } from 'react-redux';
import { Spinning } from '../../animation-loading';

const DropDownCart = ({ logined, logoutUser, setHoverCart, admin }) => {
  const [loading, setLoading] = useState(true)
  const [done, setDone] = useState(false)
  const [cartProducts, setCartProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [totalPayment, setTotalPayment] = useState(0)
  const userID = useSelector(selectUserID) || localStorage.getItem('userID')
  const navigate = useNavigate()

  // lí do có hàm này là do khi admin đổi tên, ảnh,... thì trong giỏ hàng cũng phải cập nhật thông tin mới nhất
  const getProducts = async () => {
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
      setAllProducts(allProducts)
    }
    catch (e) {
      console.log(e.message);
    }
  }

  const getCartProducts = async () => {
    setLoading(true)
    const productsRef = query(collection(db, "cartProducts"), where('userID', "==", userID));
    const q = query(productsRef);
    if (allProducts.length > 0) {
      try {
        const querySnapshot = await getDocs(q);
        await new Promise((resolve) => {
          const allCartProducts = querySnapshot.docs
            .map((doc) => {
              // console.log(doc.data().id);
              const newProduct = allProducts.filter((product) => product.id === doc.data().id)[0]
              // console.log('newProduct: ', newProduct);
              return {
                ...doc.data(),
                imgURL: newProduct.imgURL,
                name: newProduct.name,
                price: newProduct.price,
                category: newProduct.category,
                idCartProduct: doc.id,
              }
            })
            .sort((cartProductA, cartProductB) => (new Date(cartProductB.addAt)) - (new Date(cartProductA.addAt)))
          resolve(allCartProducts)
        }).then((allCartProducts) => {
          //
          localStorage.setItem('cartLength', JSON.stringify(allCartProducts.length))
          setTimeout(() => {
            setLoading(false)
            const totalPayment = allCartProducts.reduce((total, item) => {
              return total + item.price * item.quantity
            }, 0)
            setTotalPayment(totalPayment)
            setCartProducts(allCartProducts)
          }, 254)
        })
      }
      catch (e) {
        console.log(e.message);
      }
    }
  }

  const handleDeleteCartProduct = async (idCartProductsDelete) => {
    setLoading(true)
    try {
      await deleteDoc(doc(db, "cartProducts", idCartProductsDelete));
      setDone(true)
      setTimeout(() => {
        toast.success(`Xóa sản phẩm thành công`, {
          position: "top-left",
          autoClose: 1200
        })
      }, 500)
    } catch (e) {
      console.log(e.message);
    }
  }

  const solvePrice = (price) => {
    return Number(price).toLocaleString('vi-VN');
  }

  useEffect(() => {
    setDone(false)

    getProducts()
    getCartProducts()
  }, [done])

  useEffect(() => {
    getCartProducts()
  }, [allProducts])

  return (
    <>
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute right-0 text-[16px] min-w-[260px] rounded-[3px] bg-white shadow-shadowAccount drop-down-cart z-[2] mt-3 p-5 font-medium cursor-default">

        {loading
          ? (
            <div className="h-[180px] cursor-default">
              <Spinning color='#1f2028' size='30px' />
            </div>
          )
          : cartProducts.length === 0
          || JSON.parse(localStorage.getItem('cartLength')) === 0
          || (
            <div className="max-h-[40vh] overflow-y-scroll cursor-default">
              {cartProducts.map(cartProduct => (
                <div
                  key={cartProduct.id}
                  className='flex items-start justify-between border border-transparent border-b-[#ececec] pt-[10px] pb-[5px]'>
                  <img
                    onClick={() => {
                      navigate(`/san-pham/${cartProduct.id}`)
                      setHoverCart(false)
                      window.scrollTo({
                        top: 0,
                        // behavior: 'smooth'
                      });
                    }}
                    className='w-[60px] h-[60px] object-cover cursor-pointer' src={cartProduct.imgURL} alt="" />
                  <div
                    className="flex-1 text-bgPrimary ml-[10px]">
                    <div
                      onClick={() => {
                        navigate(`/san-pham/${cartProduct.id}`)
                        setHoverCart(false)
                        window.scrollTo({
                          top: 0,
                          // behavior: 'smooth'
                        });
                      }}
                      className="text-[#334862] text-[14px] line-clamp-3 mb-[5px] cursor-pointer hover:text-bgPrimary">
                      {cartProduct.name}</div>
                    <div className="text-[#999] opacity-90 text-[13px]">{cartProduct.quantity} × {solvePrice(cartProduct.price)} ₫</div>
                  </div>
                  <div
                    onClick={() => handleDeleteCartProduct(cartProduct.idCartProduct)}
                    className="group cursor-pointer hover:border-primary w-[26px] h-[26px] border-[2px] border-[#b8b8b8] rounded-full flex items-center justify-center transition-all ease-in-out duration-150 mt-2">
                    <FontAwesomeIcon className='text-[#b8b8b8] group-hover:text-primary text-[16px] transition-all ease-in-out duration-100' icon={faXmark} />
                  </div>
                </div>
              ))}
            </div>
          )
        }
        {(!loading
          && (
            cartProducts.length === 0
            || JSON.parse(localStorage.getItem('cartLength')) === 0
          ))
          ? <div className="w-full flex flex-col gap-2 items-center justify-center">
            <div
              style={{
                backgroundImage: "url('../../emptyCart.png')"
              }}
              className="w-[200px] h-[180px] bg-contain bg-no-repeat bg-center">
            </div>
            <div className='text-center text-[16px] font-bold text-bgPrimary font-mono leading-[32px] uppercase'>Giỏ hàng hiện đang trống
            </div>
          </div>
          : loading || (
            <div className="flex py-[10px] justify-center gap-1 text-[#777] font-bold border border-transparent border-b-[#ececec] cursor-default">
              <h1 className=''>Tổng phụ:</h1>
              <p className=''>{solvePrice(totalPayment)} ₫</p>
            </div>
          )}
        {/*  */}
        {!loading && (
          cartProducts.length === 0
          || JSON.parse(localStorage.getItem('cartLength')) === 0
        )
          || (
            <>
              <div className="w-full pt-[10px] pb-2">
                <button
                  onClick={() => {
                    if (!loading) {
                      setHoverCart(false)
                      navigate('/gio-hang')
                    }
                  }}
                  className='w-full flex justify-center bg-primary text-white px-4 py-2 hover:bg-[#a40206] transition-all ease-linear duration-[120ms]'>
                  <span className='text-[16px] text-center uppercase'>Xem giỏ hàng</span>
                </button>
              </div>
              <div className="w-full">
                <button
                  onClick={() => {
                    if (!loading) {
                      setHoverCart(false)
                      navigate('/thanh-toan/bill-info')
                    }
                  }}
                  className='w-full flex justify-center bg-secondary text-white px-4 py-2 hover:bg-[#a6573c] transition-all ease-linear duration-[120ms]'>
                  <span className='text-[16px] text-center uppercase'>Thanh toán</span>
                </button>
              </div>
            </>
          )}
      </div>

    </>
  );
};

export default DropDownCart;