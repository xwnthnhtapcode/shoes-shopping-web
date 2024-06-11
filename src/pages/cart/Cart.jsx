
import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltLeft, faTags } from '@fortawesome/free-solid-svg-icons';
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserID } from '../../redux-toolkit/slice/authSlice';
import CartProduct from './CartProduct';
import CarLoading from '../../components/carLoading/CarLoading';
import { toast } from 'react-toastify';
import { CAlC_TOTAL_PAYMENT } from '../../redux-toolkit/slice/cartSlice';
import { VOUCHERS } from '../../voucherShop';
import { OverlayLoading, Skeleton } from '../../animation-loading';
import Notiflix from 'notiflix';

const Cart = () => {
  const [loading, setLoading] = useState(true)
  const [done, setDone] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  let vouchersAction = useRef({
    FREESHIP: false,
    GIAM50K: false
  })
  const [deliveryFee, setDeliveryFee] = useState(30000)
  const [discount, setDiscount] = useState(0)
  const inputVoucher = useRef()
  const [totalPayment, setTotalPayment] = useState(0)
  const [cartProducts, setCartProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [quantityCart, setQuantityCart] = useState({})
  const userID = useSelector(selectUserID) || localStorage.getItem('userID')


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
      toast.error(e.message, {
        autoClose: 1000
      })
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
          console.log(allCartProducts);
          const totalPayment = allCartProducts.reduce((total, item) => {
            return total + item.price * item.quantity
          }, 0)
          setTotalPayment(totalPayment)
          localStorage.setItem('totalPayment', JSON.stringify(totalPayment))
          dispatch(CAlC_TOTAL_PAYMENT(totalPayment))
          //
          localStorage.setItem('cartLength', JSON.stringify(allCartProducts.length))
          setTimeout(() => {
            setCartProducts(allCartProducts)
            setLoading(false)
          }, 254)
        })
      }
      catch (e) {
        console.log(e.message);
      }
    }
  }

  const handleUpdateCartProduct = async () => {
    window.scrollTo({
      top: 0,
      // behavior: 'smooth'
    })
    setLoading(true)
    cartProducts.forEach(async (cartProduct, idx) => {
      // console.log(quantityCart[cartProduct.idCartProduct]);
      const productsRef = query(
        collection(db, "cartProducts"),
        where('userID', "==", userID), //id người dùng
        where('id', "==", cartProduct.id)); //id của sản phẩm
      const q = query(productsRef);

      try {
        const querySnapshot = await getDocs(q);
        const docRef = querySnapshot.docs[0].ref;
        //
        const docSnapshot = await getDoc(docRef);
        // console.log(docSnapshot.data());

        await updateDoc(docRef, {
          quantity: quantityCart[cartProduct.idCartProduct],
        });

        if (idx === cartProducts.length - 1) {
          setDone(true)
          //update cart
          setTimeout(() => {
            toast.success(`Cập nhật giỏ hàng thành công`, {
              position: "top-left",
              autoClose: 1200
            })
          }, 500)
          // setLoading(false)
        }
      } catch (e) {
        console.log(e.message);
      }
    })
  }

  const handleCheckOut = async (e) => {
    window.scrollTo({
      top: 0,
    })
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      navigate('/thanh-toan/bill-info')
      // setLoading(false)
    }, 1200)
  }

  const confirmDelete = () => {
    window.scrollTo({
      top: 0,
      // behavior: 'smooth'
    })
    Notiflix.Confirm.show(
      'Xóa giỏ hàng',
      'Bạn có muốn xóa giỏ hàng ?',
      'Xóa',
      'Hủy bỏ',
      function okCb() {
        setTimeout(() => {
          handleDeleteAllCart()
        }, 200)
      },
      function cancelCb() {
        // console.log();
      },
      {
        zindex: 2000,
        width: '320px',
        zindex: 999999,
        fontFamily: 'Roboto',
        borderRadius: '4px',
        titleFontSize: '20px',
        titleColor: '#c30005',
        messageFontSize: '18px',
        cssAnimationDuration: 300,
        cssAnimationStyle: 'zoom',
        buttonsFontSize: '16px',
        okButtonBackground: '#c30005',
        cancelButtonBackground: '#a5a3a3',
        backgroundColor: '##d8d8d8',
        backOverlayColor: 'rgba(0,0,0,0.4)',
      },
    );
  }

  const handleDeleteAllCart = async () => {
    setLoading(true)
    const productsRef = query(
      collection(db, "cartProducts"),
      where('userID', "==", userID));
    const q = query(productsRef);
    try {
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot.docs);
      //doc.id là id của firebase tạo riêng cho mỗi sản phẩm, còn doc.data() là dữ liệu của sản phẩm, nên doc.data().id tức là id của bên trong cái object sản phẩm {}
      Promise.all(
        querySnapshot.docs.map(async (docQuery) => {
          try {
            await deleteDoc(doc(db, "cartProducts", docQuery.id));
            return Promise.resolve()
          } catch (e) {
            console.log(e.message);
          }
        })
      )
      setDone(true)
      setTimeout(() => {
        toast.success(`Xóa giỏ hàng thành công`, {
          position: "top-left",
          autoClose: 1200
        })
      }, 500)
    }
    catch (e) {
      console.log(e.message);
    }
  }

  const deliveryDate = () => {
    const today = new Date()
    const startDelivary = new Date()
    const endDelivary = new Date()
    startDelivary.setDate(today.getDate() + 2)
    endDelivary.setDate(today.getDate() + 5)

    //tháng bắt đầu từ 0 nên phải +1
    return (
      `${startDelivary.getDate()} Th${startDelivary.getMonth() + 1 < 10 ? `0${startDelivary.getMonth() + 1}` : startDelivary.getMonth() + 1} - ${endDelivary.getDate()} Th${endDelivary.getMonth() + 1 < 10 ? `0${endDelivary.getMonth() + 1}` : endDelivary.getMonth() + 1}`
    )
  }

  const solvePrice = (price) => {
    return Number(price).toLocaleString('vi-VN');
  }

  useEffect(() => {
    // console.log('dasd');
    setDone(false)

    getProducts()
    getCartProducts()
  }, [done])



  useEffect(() => {
    getCartProducts()
  }, [allProducts])


  return (
    <>
      <OverlayLoading loading={loading}>
        <div className={`w-full py-[30px] ${loading && 'blur-[3px]'}`}>
          <div className="max-w-[1230px] min-h-[600px] mx-auto ">
            <div className="w-full px-[15px] pb-[30px]">
              <div className="w-full flex">
                {(cartProducts.length === 0
                  || JSON.parse(localStorage.getItem('cartLength')) === 0) && !loading
                  ? <div className="w-full h-[480px] flex flex-col gap-7 items-center justify-center">
                    {/* <img className='w-full h-[300px] object-contain' src="../../emptyCart.png" alt="" /> */}
                    <div
                      style={{
                        backgroundImage: "url('/emptyCart.png')"
                      }}
                      className="w-[520px] h-[500px] bg-contain bg-no-repeat bg-center"></div>
                    <div className='text-center text-[28px] font-bold text-bgPrimary font-mono leading-[32px] uppercase'>Giỏ hàng của bạn hiện đang trống
                    </div>
                    <NavLink
                      to='/'
                      className='bg-primary text-white px-4 py-3 hover:bg-[#a40206] transition-all ease-linear duration-[120ms]'>
                      <FontAwesomeIcon className='mr-[6px]' icon={faLongArrowAltLeft} />
                      <span className='text-[20px]'>Quay lại trang chủ</span>
                    </NavLink>
                  </div>
                  : (
                    <>
                      {/* left */}
                      <div className="basis-[58.33%] pr-[30px] border border-transparent border-r-[#ececec]">
                        <table className='w-full'>
                          <thead>
                            <tr className='border-[3px] border-transparent border-b-[#ececec] grid gap-5 grid-cols-12 grid-rows-1 text-[14px] font-bold py-2 uppercase tracking-wider'>
                              <td className='col-span-6'>Sản phẩm</td>
                              <td className='col-span-2'>Giá</td>
                              <td className='col-span-2'>Số lượng</td>
                              <td className='col-span-2'>Tổng</td>
                            </tr>
                          </thead>
                          <tbody>
                            {cartProducts.map((cartProduct) => (
                              <CartProduct
                                key={cartProduct.idCartProduct}
                                setDone={setDone}
                                setLoading={setLoading}
                                quantityCart={quantityCart}
                                setQuantityCart={setQuantityCart}
                                idProduct={cartProduct.id}
                                name={cartProduct.name}
                                nameInput={cartProduct.idCartProduct}
                                category={cartProduct.category}
                                img={cartProduct.imgURL}
                                price={cartProduct.price}
                                quantityProduct={cartProduct.quantity}
                              />
                            ))}
                          </tbody>
                        </table>
                        {!loading && (
                          <div className="mt-6 flex gap-4">
                            <NavLink
                              to='/'
                              className='border-[2px] border-primary text-primary px-4 py-1 hover:bg-primary hover:text-white flex items-center font-medium transition-all ease-linear duration-[120ms]'>
                              <FontAwesomeIcon className='mr-[6px]' icon={faLongArrowAltLeft} />
                              <span className='text-[14] uppercase'>Tiếp tục xem sản phẩm</span>
                            </NavLink>
                            <button
                              onClick={handleUpdateCartProduct}
                              className='px-4 py-1 bg-primary hover:bg-[#9f0d11] text-white font-medium transition-all ease-linear flex items-center duration-[120ms]'>
                              <span className='text-[14] uppercase'>Cập nhật giỏ hàng</span>
                            </button>
                            <button
                              onClick={confirmDelete}
                              className='px-4 py-1 bg-primary hover:bg-[#9f0d11] text-white font-medium transition-all ease-linear flex items-center duration-[120ms]'>
                              <span className='text-[14] uppercase'>Xóa giỏ hàng</span>
                            </button>
                          </div>
                        )}
                      </div>
                      {/* right */}
                      <div className={`flex-1 pt-[15px] pb-[30px] px-[30px] h-full border-[2px] border-solid ${!loading && 'border-primary'}`}>
                        <div className="w-full border-[3px] border-transparent border-b-[#ececec] text-[14px] font-bold py-2 uppercase tracking-wider">
                          <h1 className=''>Tổng thanh toán</h1>
                        </div>
                        <div className='flex items-center justify-between border border-transparent border-b-[#ddd] py-4 text-[14px]'>
                          <h2 className=''>Tổng phụ</h2>
                          <h2 className='font-bold'>
                            {totalPayment > 0 ? solvePrice(totalPayment) : 0}₫</h2>
                        </div>
                        <div className='flex items-center justify-between border border-transparent border-b-[#ddd] py-4 text-[14px]'>
                          <h2 className=''>Giao hàng</h2>
                          <div className="text-right">
                            {/* lấy 1% giá trị hàng */}
                            <p>Phí giao hàng toàn quốc:
                              <span className='font-bold ml-1'>{solvePrice(deliveryFee)}₫</span></p>
                            <p className=''>Nhận hàng vào <span className='font-bold'>{deliveryDate()}</span></p>
                          </div>
                        </div>
                        <div className='flex items-center justify-between border border-transparent border-b-[#ddd] py-3 text-[14px]'>
                          <h2 className=''>Giảm giá từ shop:</h2>
                          <span className='font-bold ml-1'>{solvePrice(discount)}₫</span>
                        </div>
                        <div className='flex items-center justify-between border-[3px] border-transparent border-b-[#ddd] py-4 text-[14px]'>
                          <h2 className=''>Tổng thanh toán</h2>
                          <h2 className='font-bold'>
                            {totalPayment + deliveryFee - discount > 0
                              ? solvePrice(totalPayment + deliveryFee - discount)
                              : 0}₫</h2>
                        </div>
                        <div className='mt-6 text-[14px]'>
                          <button
                            onClick={handleCheckOut}
                            className='block text-center w-full px-2 py-3 bg-secondary font-bold tracking-widest text-white hover:brightness-90 transition-all ease-in-out duration-100 uppercase'>Tiến hành thanh toán
                          </button>

                        </div>
                      </div>
                    </>
                  )}
              </div>
            </div>
          </div>
        </div >
      </OverlayLoading>
    </>
  );
};

export default Cart;