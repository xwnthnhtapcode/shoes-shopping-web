import React, { useEffect, useRef, useState } from 'react';
import CarLoading from '../../components/carLoading/CarLoading';
import { Timestamp, addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { useSelector } from 'react-redux';
import { selectUserID } from '../../redux-toolkit/slice/authSlice';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltLeft, faTags } from '@fortawesome/free-solid-svg-icons';
import { selectEmail } from '../../redux-toolkit/slice/authSlice';
import { selectUserName } from '../../redux-toolkit/slice/authSlice';
import { OverlayLoading, Skeleton } from '../../animation-loading';
import { toast } from 'react-toastify';
import CheckoutSuccess from '../checkoutSuccess/CheckoutSuccess';

const CheckOut = () => {
  const [loading, setLoading] = useState(true)
  const [loadingNavigate, setLoadingNavigate] = useState(false)
  const [totalPayment, setTotalPayment] = useState(0)
  const [allProducts, setAllProducts] = useState([])
  const [cartProducts, setCartProducts] = useState([])
  //
  const [quantityProduct, setQuantityProduct] = useState(new Map())
  //
  const currentUser = auth.currentUser;
  const userID = useSelector(selectUserID) || localStorage.getItem('userID')
  const displayEmail = useSelector(selectEmail) || localStorage.getItem('displayEmail')
  const displayName = useSelector(selectUserName) || localStorage.getItem('displayName')
  const imgAvatar = currentUser?.photoURL || localStorage.getItem('imgAvatar')
  //
  const navigate = useNavigate()
  //
  const [deliveryFee, setDeliveryFee] = useState(30000)
  const [discount, setDiscount] = useState(0)
  const [vouchers, setVouchers] = useState(new Map())
  const [checkTypeVouchers, setCheckTypeVouchers] = useState({})
  const inputVoucher = useRef()
  const vouchersID = useRef([])
  //
  const { id } = useParams()
  // console.log('id: ', id);
  const [shippingAddress, setShippingAddress] = useState({
    city: '',
    district: '',
    wards: '',
    address: '',
    phoneNumber: '',
    note: '',
    paymentMethod: 'cash'
  })
  const [checkoutSuccess, setCheckoutSuccess] = useState(false)


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

  const handleInventory = async () => {
    Promise.all(
      allProducts.map(async (product) => {
        if (quantityProduct.has(product.id)) {
          try {
            await setDoc(doc(db, "products", product.id), {
              name: product.name,
              imgURL: product.imgURL,
              price: product.price,
              inventory: product.inventory - quantityProduct.get(product.id), //số lượng tồn kho trừ đi 1 khi đơn hàng hoàn thành
              category: product.category,
              brand: product.brand,
              desc: product.desc,
              imgPreviewURL1: product.imgPreviewURL1,
              imgPreviewURL2: product.imgPreviewURL2,
              imgPreviewURL3: product.imgPreviewURL3,
              imgPreviewURL4: product.imgPreviewURL4,
              creatAt: product.creatAt,
              editedAt: product.editedAt
            })
          } catch (e) {
            console.log(e.message);
          }
        }
      })
    )
  }

  const getCartProducts = async () => {
    setLoading(true)
    const map = new Map()
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
              map.set(doc.data().id, doc.data().quantity)
              return {
                ...doc.data(),
                name: newProduct.name,
                price: newProduct.price,
                idCartProduct: doc.id,
              }
            })
            .sort((cartProductA, cartProductB) => (new Date(cartProductB.addAt)) - (new Date(cartProductA.addAt)))
          resolve(allCartProducts)
        }).then((allCartProducts) => {
          //
          const totalPayment = allCartProducts.reduce((total, item) => {
            return total + item.price * item.quantity
          }, 0)
          setTotalPayment(totalPayment)
          localStorage.setItem('cartLength', JSON.stringify(allCartProducts.length))
          //
          setQuantityProduct(map)
          setTimeout(() => {
            setCartProducts(allCartProducts)
            setLoading(false)
          }, 1200)
        })
      }
      catch (e) {
        console.log(e.message);
      }
    }
  }

  const getVouchers = async () => {
    const productsRef = query(collection(db, "vouchers"), where('userID', '==', userID));
    const q = query(productsRef);
    try {
      const querySnapshot = await getDocs(q);
      const map = new Map()
      const check = {}
      querySnapshot.docs.map(doc => {
        const id = doc.id
        const { code, value } = doc.data()
        map.set(code, {
          voucherID: id,
          value,
        })
        check[code] = true
      })
      console.log(check);
      setVouchers(map)
      setCheckTypeVouchers(check)
    } catch (e) {
      console.log(e.message);
    }
  }

  const handleShippingAddress = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    })
  }

  //để xử lí khi ấn đặt hàng thì sẽ xóa tất cả sản phẩm trong giỏ hàng
  const handleDeleteAllCart = async () => {
    const productsRef = query(
      collection(db, "cartProducts"),
      where('userID', "==", userID));
    const q = query(productsRef);
    try {
      const querySnapshot = await getDocs(q);
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
    }
    catch (e) {
      console.log(e.message);
    }
  }

  const saveOrder = async () => {
    cartProducts.map((cartProduct) => {
      try {
        addDoc(collection(db, "orders"), {
          userID,
          displayName,
          displayEmail,
          imgAvatar,
          // totalPayment,
          deliveryFee: deliveryFee / cartProducts.length,
          discount: discount / cartProducts.length,
          orderDate: solveDate(),
          orderTime: solveTime(),
          orderAmount: cartProducts.length,
          orderStatus: "Đang xử lý",
          cartProduct,
          shippingAddress,
          creatAt: Timestamp.now().toDate().toString()
        })
      } catch (e) {
        console.log(e.message);
      }
    })
  }

  const handleVoucherFalse = async () => {
    Promise.all(
      vouchersID.current.map(async (voucherID) => {
        try {
          await deleteDoc(doc(db, "vouchers", voucherID));
        } catch (e) {
          console.log(e.message);
        }
      })
    )
  }

  const handleOrder = async (e) => {
    //CHỈ KHI NÀO BẤM VÀO ĐẶT HÀNG MỚI CHUYỂN ĐẾN TRANG THÀNH CÔNG
    e.preventDefault()
    if (shippingAddress.city === ''
      || shippingAddress.district === ''
      || shippingAddress.wards === ''
      || shippingAddress.address === ''
      || shippingAddress.phoneNumber === '') {
      toast.error('Vui lòng điền hết các trường hợp', {
        autoClose: 1200,
        position: 'top-left'
      })
    }
    else {
      if (!loading) {
        e.preventDefault()
        console.log(inputVoucher.current.value);
        window.scrollTo({
          top: 0,
          // behavior: 'smooth'
        });
        setLoadingNavigate(true)
        await saveOrder() // await HANDLE VIỆC ĐẨY ORDER LÊN FIREBASE SAU ĐÓ MỚI XÓA SẢN PHẨM TRONG GIỎ HÀNG
        await handleDeleteAllCart() //xóa tất cả sp trong giỏ hàng khi ấn đặt hàng
        //chuyển hướng tới /thanh-toan/success
        await handleInventory() //xóa đi số sản phẩm tương ứng của 'sản phẩm có sẵn'
        await handleVoucherFalse() //sửa voucher thành false (không được nhập)
        setTimeout(() => {
          setLoadingNavigate(false)
          setCheckoutSuccess(true)
          navigate('/thanh-toan/success')
          toast.success("Đặt hàng thành công", {
            autoClose: 1200,
          })
        }, 1600)
      }
    }
  }

  const solveDate = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString('vi-VN', { month: 'long' });
    const year = today.getFullYear();
    return `${day} ${month}, ${year}`;
  }

  const solveTime = () => {
    const now = new Date()
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const second = now.getSeconds().toString().padStart(2, '0');
    return `${hour}:${minute}:${second}`;
  }

  const solvePrice = (price) => {
    return Number(price).toLocaleString('vi-VN');
  }

  useEffect(() => {
    getProducts()
  }, [])

  useEffect(() => {
    (async function () {
      await getCartProducts()
      await getVouchers()
    })()
  }, [allProducts])

  return (
    <>
      {!checkoutSuccess
        ? (
          <OverlayLoading loading={loadingNavigate}>
            <div className={`w-full py-[30px] ${loadingNavigate && 'blur-[2px]'}`}>
              <div className="max-w-[1230px] mx-auto ">
                <div className="w-full px-[15px] pb-[30px]">
                  <div className="w-full flex">
                    {(cartProducts.length === 0
                      || JSON.parse(localStorage.getItem('cartLength')) === 0) && !loading
                      ? <div className="w-full h-[480px] flex flex-col gap-10 items-center justify-center">
                        <img className='w-full h-[300px] object-contain' src="../../orderNoExist.png" alt="" />
                        <h1 className='text-center text-[36px] font-bold text-bgPrimary font-mono leading-[32px] uppercase'>Đơn thanh toán không tồn tại</h1>
                        <NavLink
                          to='/'
                          className='bg-primary text-white px-4 py-3 hover:bg-[#a40206] transition-all ease-linear duration-[120ms]'>
                          <FontAwesomeIcon className='mr-[6px]' icon={faLongArrowAltLeft} />
                          <span className='text-[20px]'>Quay lại trang chủ</span>
                        </NavLink>
                      </div>
                      : (
                        <div className='w-full flex flex-row'>
                          {/* left */}
                          <div className="basis-[58.33%] pr-[30px]">
                            <h1 className='text-[18px] mb-4 font-bold text-bgPrimary uppercase'>
                              Thông tin thanh toán
                            </h1>
                            <div className="w-full text-[#222] text-[14px] flex flex-col gap-5 ">
                              <p>
                                <label className='mb-2 font-bold block' htmlFor="account_display_name">Tên hiển thị *</label>
                                <input
                                  placeholder={displayName || localStorage.getItem('displayName') || ""}
                                  name="name"
                                  className='align-middle pointer-events-none bg-white shadow-sm text-[#333] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2 transition-all ease-linear duration-150 focus:shadow-shadowPink focus:border focus:border-[#ea4c8966]' id='account_display_name' type="text" />
                                <span className='text-[#353535] text-[16px] italic'>Để thay đổi tên, hãy vào "Thông tin tài khoản"</span>
                              </p>

                              <p>
                                <label className='mb-2 font-bold block'>Địa chỉ email *</label>
                                <input
                                  name="email"
                                  autoComplete="off"
                                  placeholder={displayEmail || localStorage.getItem('displayEmail') || ""}
                                  className='align-middle pointer-events-none bg-white shadow-sm text-[#222] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2' type="text" />
                                <span className='text-[#353535] text-[16px] italic'>Bạn không thể thay đổi email</span>
                              </p>
                              <p>
                                <label className='mb-2 font-bold block'>Tỉnh / Thành phố *</label>
                                <input
                                  value={shippingAddress.city}
                                  onChange={handleShippingAddress}
                                  name="city"
                                  autoComplete="off"
                                  required
                                  placeholder="Nhập vào tỉnh/ thành phố"
                                  className='align-middle bg-white shadow-sm text-[#222] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2' type="text" />
                              </p>

                              <p>
                                <label className='mb-2 font-bold block'>Quận / Huyện *</label>
                                <input
                                  value={shippingAddress.district}
                                  onChange={handleShippingAddress}
                                  name="district"
                                  autoComplete="off"
                                  required
                                  placeholder="Nhập vào quận/ huyện"
                                  className='align-middle bg-white shadow-sm text-[#222] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2' type="text" />
                              </p>

                              <p>
                                <label className='mb-2 font-bold block'>Phường / Xã *</label>
                                <input
                                  value={shippingAddress.wards}
                                  onChange={handleShippingAddress}
                                  name="wards"
                                  autoComplete="off"
                                  required
                                  placeholder="Nhập vào phường/ xã"
                                  className='align-middle bg-white shadow-sm text-[#222] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2' type="text" />
                              </p>

                              <p>
                                <label className='mb-2 font-bold block'>Địa chỉ cụ thể *</label>
                                <input
                                  value={shippingAddress.address}
                                  onChange={handleShippingAddress}
                                  name="address"
                                  autoComplete="off"
                                  required
                                  placeholder="Nhập vào địa chỉ nhà cụ thể"
                                  className='align-middle bg-white shadow-sm text-[#222] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2' type="text" />
                              </p>

                              <p>
                                <label className='mb-2 font-bold block'>Số điện thoại *</label>
                                <input
                                  value={shippingAddress.phoneNumber}
                                  onChange={handleShippingAddress}
                                  name="phoneNumber"
                                  autoComplete="off"
                                  required
                                  placeholder="Nhập vào số điện thoại liên hệ"
                                  className='align-middle bg-white shadow-sm text-[#222] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2' type="number" />
                              </p>

                              <p>
                                <label className='mb-2 font-bold block'>Ghi chú đơn hàng (tùy chọn)</label>
                                <textarea
                                  value={shippingAddress.note}
                                  onChange={handleShippingAddress}
                                  name="note"
                                  autoComplete="off"
                                  cols={30}
                                  rows={5}
                                  placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                                  className='align-middle bg-white shadow-sm text-[#222] px-3 pt-3 block w-full text-[16px] border border-solid border-[#ccc] rounded-[4px] bg-transparent outline-none' type="text" />
                              </p>

                            </div>
                          </div>
                          {/* right */}
                          <div className={`self-start flex-1 pt-[15px] pb-[30px] px-[30px] border-[2px] border-solid ${!loadingNavigate && 'border-primary'}`}>
                            <div className="w-full border-[3px] border-transparent border-b-[#ececec] text-[18px] font-bold py-2 uppercase tracking-wider">
                              <h1 className='mb-4'>Đơn hàng của bạn</h1>
                              <div className="flex justify-between">
                                <h2 className='text-[14px] tracking-widest'>Sản phẩm</h2>
                                <h2 className='text-[14px] tracking-widest'>Tổng</h2>
                              </div>
                            </div>
                            {(cartProducts.length === 0
                              ? Array(3).fill()
                              : cartProducts).map((cartProduct, idx) => (
                                <div
                                  key={idx}
                                  className={`${!loading ? 'py-4' : 'my-2'} grid grid-cols-7 items-center justify-center border border-transparent border-b-[#ddd] text-[14px]`}>
                                  <Skeleton loading={loading} className={`${loading && 'mb-2 w-3/4 h-[30px]'} overflow-hidden col-span-5`}>
                                    <h2
                                      className='text-[#666]'>{cartProduct?.name || 'day la ten de chay skeleton animation animation animation animation'}
                                      <strong className='text-bgPrimary font-blod ml-1'>× {cartProduct?.quantity}</strong>
                                    </h2>
                                  </Skeleton>
                                  <Skeleton loading={loading} className='overflow-hidden col-span-2 text-right'>
                                    <div className="">
                                      <span
                                        className='font-bold inline-block'>
                                        {cartProduct?.price
                                          ? `${solvePrice(cartProduct?.price * cartProduct?.quantity)} ₫`
                                          : 'day la gia tien'}
                                      </span>
                                    </div>
                                  </Skeleton>
                                </div>
                              ))}

                            <div className='flex items-center justify-between border border-transparent border-b-[#ddd] py-2 text-[14px]'>
                              <Skeleton loading={loading} className='overflow-hidden'>
                                <h2 className=''>Tổng phụ</h2>
                              </Skeleton>
                              <Skeleton loading={loading} className='overflow-hidden'>
                                <h2 className='font-bold'>
                                  {totalPayment
                                    ? `${solvePrice(totalPayment)} ₫`
                                    : 'day la tong tien'}
                                </h2>
                              </Skeleton>
                            </div>
                            <div className='flex items-center justify-between border border-transparent border-b-[#ddd] py-4 text-[14px]'>
                              <Skeleton loading={loading} className='overflow-hidden'>
                                <h2 className=''>Giao hàng</h2>
                              </Skeleton>
                              <Skeleton loading={loading} className='overflow-hidden'>
                                <div className="">
                                  <p className='text-right'>
                                    Phí giao hàng toàn quốc:
                                    <span className='font-bold ml-1'>{`${solvePrice(deliveryFee)} ₫`}</span>
                                  </p>
                                </div>
                              </Skeleton>
                            </div>
                            <Skeleton loading={loading}
                              className={`${loading && 'h-6'} overflow-hidden`}>
                              <div className='flex items-center justify-between border border-transparent border-b-[#ddd] py-3 text-[14px]'>
                                <h2 className=''>Giảm giá từ shop:</h2>
                                <span className='font-bold ml-1'>{solvePrice(discount)}₫</span>
                              </div>
                            </Skeleton>
                            <div className='flex items-center justify-between border-[3px] border-transparent border-b-[#ddd] py-2 text-[14px]'>
                              <Skeleton loading={loading} className='overflow-hidden'>
                                <h2 className=''>Tổng thanh toán</h2>
                              </Skeleton>
                              <Skeleton loading={loading} className='overflow-hidden'>
                                <h2 className='font-bold'>
                                  {totalPayment
                                    ? `${totalPayment + deliveryFee - discount > 0
                                      ? solvePrice(totalPayment + deliveryFee - discount)
                                      : 0} ₫`
                                    : 'day la tong tien'}
                                </h2>
                              </Skeleton>
                            </div>
                            <div className="border-[3px] pb-3 border-transparent border-b-[#ddd]">
                              <div className="pt-6 flex gap-2">
                                <FontAwesomeIcon
                                  className='text-[#b0b0b0] text-[20px]'
                                  icon={faTags}
                                  rotation={90} />
                                <p className='font-bold text-[14px] uppercase tracking-widest'>Phiếu ưu đãi</p>
                              </div>
                              <input
                                ref={inputVoucher}
                                className='mb-5 mt-3 text-[16px] w-full px-3 py-2 outline-none border border-[#ccc] focus:shadow-shadowPink'
                                placeholder='Mã ưu đãi'
                                type="text" name="" id="" />
                              <button
                                onClick={(e) => {
                                  if (!loading) {
                                    e.preventDefault()
                                    if (inputVoucher.current.value === 'FREESHIP') {
                                      setDeliveryFee(0)
                                      toast.success('Áp dụng mã miễn phí vận chuyển thành công', {
                                        autoClose: 1200
                                      })
                                      inputVoucher.current.value = ''
                                    }
                                    else {
                                      if (!vouchers.has(inputVoucher.current.value)) {
                                        toast.error('Mã giảm giá không tồn tại', {
                                          autoClose: 1200
                                        })
                                      }
                                      else if (checkTypeVouchers[inputVoucher.current.value] === false) {
                                        toast.error('Bạn đã áp dụng mã giảm giá', {
                                          autoClose: 1200
                                        })
                                      }
                                      else {
                                        const field = inputVoucher.current.value
                                        vouchersID.current.push(vouchers.get(field).voucherID)
                                        setCheckTypeVouchers(prevState => {
                                          return Object.assign({}, prevState, { [field]: false });
                                        })
                                        setDiscount(Number(vouchers.get(field).value))
                                        inputVoucher.current.value = ''
                                        toast.success('Áp dụng mã giảm giá thành công', {
                                          autoClose: 1200
                                        })
                                      }
                                    }
                                  }
                                }}
                                className='w-full p-2 border border-[#ccc] bg-[#f9f9f9] hover:bg-[#c7c7c7] flex items-center justify-center -tracking-tighter text-[16px] text-[#666] transition-all ease-in-out duration-100'>
                                Áp dụng
                              </button>
                            </div>
                            <div className='mt-6 text-[14px]'>
                              <div className="flex flex-col gap-4 mb-4">
                                <div className="flex gap-2">
                                  <input
                                    value='cash'
                                    onChange={handleShippingAddress}
                                    type="radio"
                                    name="paymentMethod"
                                    id="checkbox-1"
                                    checked={shippingAddress.paymentMethod === 'cash'} />
                                  <label htmlFor='checkbox-1' className='text-[14px] font-bold'>Trả tiền mặt khi nhận hàng</label>
                                </div>
                                <div className="flex gap-2">
                                  <input
                                    value='bankTransfer'
                                    onChange={handleShippingAddress}
                                    type="radio"
                                    name="paymentMethod"
                                    id="checkbox-2"
                                    checked={shippingAddress.paymentMethod === 'bankTransfer'} />
                                  <label htmlFor='checkbox-2' className='text-[14px] font-bold'>Chuyển khoản ngân hàng</label>
                                </div>
                              </div>
                              <button
                                onClick={handleOrder}
                                className='px-6 py-3 bg-secondary font-bold tracking-widest text-white hover:brightness-90 transition-all ease-in-out duration-100 uppercase'>Đặt hàng
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                  </div>
                </div>
              </div>
            </div >
          </OverlayLoading>
        )
        : <CheckoutSuccess
          cartProducts={cartProducts}
          totalPayment={totalPayment}
          shippingAddress={shippingAddress}
          deliveryFee={deliveryFee}
          discount={discount}
          orderDate={solveDate()}
          orderTime={solveTime()}
        />
      }
    </>
  );
};

export default CheckOut;