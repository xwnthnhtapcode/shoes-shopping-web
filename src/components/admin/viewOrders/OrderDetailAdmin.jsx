import React, { useEffect, useState } from 'react';
import { OverlayLoading, Skeleton } from '../../../animation-loading';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { NavLink, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectEmail, selectUserName } from '../../../redux-toolkit/slice/authSlice'
import Notiflix from 'notiflix';
import { toast } from 'react-toastify';

const solveCategory = (category) => {
  switch (category) {
    case 'giay-nam':
      return 'Giày nam'
    case 'giay-nu':
      return 'Giày nữ'
    case 'giay-tre-em':
      return 'Giày trẻ em'
    default:
      break;
  }
}

const solvePrice = (price) => {
  return Number(price).toLocaleString('vi-VN');
}

const solveBrand = (brand) => {
  switch (brand) {
    case 'classic':
      return 'Classic'
    case 'sunbaked':
      return 'Sunbaked'
    case 'chuck-07s':
      return 'Chuck 07S'
    case 'one-star':
      return 'One Star'
    case 'psy-kicks':
      return 'PSY Kicks'
    default:
      break;
  }
}

const OrderDetailAdmin = ({ id }) => {
  const [loading, setLoading] = useState(true)
  const [changeStatus, setChangeStatus] = useState(false)
  const [activeStatus, setActiveStatus] = useState('')
  const [order, setOrder] = useState(null)
  const displayEmail = useSelector(selectEmail) || localStorage.getItem('displayEmail')
  const displayName = useSelector(selectUserName) || localStorage.getItem('displayName')

  const getOrder = async () => {
    setLoading(true)
    const docRef = doc(db, "orders", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data());
      setOrder({
        id: id,
        ...docSnap.data()
      })

      setTimeout(() => {
        setLoading(false)
      }, 1000)
    } else {
      // docSnap.data() will be undefined in this case
      // console.log("No such document!");
    }
  }

  const handleUpdateStatus = () => {
    try {
      setDoc(doc(db, "orders", id), {
        userID: order.userID,
        displayName: order.displayName,
        displayEmail: order.displayEmail,
        imgAvatar: order.imgAvatar,
        // totalPayment,
        deliveryFee: order.deliveryFee,
        discount: order.discount,
        orderDate: order.orderDate,
        orderTime: order.orderTime,
        orderAmount: order.orderAmount,
        orderStatus: activeStatus,
        cartProduct: order.cartProduct,
        shippingAddress: order.shippingAddress,
        creatAt: order.creatAt,
      })
      setTimeout(() => {
        setChangeStatus(true)
        toast.success('Cập nhật tình trạng đơn hàng thành công', {
          autoClose: 1200
        })
      }, 300)
    } catch (e) {
      console.log(e.message);
    }
  }

  const confirmUpdateStatus = (e) => {
    Notiflix.Confirm.show(
      'Cập nhật tình trạng đơn hàng',
      'Bạn có muốn cập nhật tình trạng đơn hàng?',
      'Cập nhật',
      'Hủy bỏ',
      function okCb() {
        handleUpdateStatus()
      },
      function cancelCb() {
        console.log();
      },
      {
        zindex: 2000,
        width: '352px',
        zindex: 999999,
        fontFamily: 'Roboto',
        borderRadius: '4px',
        titleFontSize: '18px',
        titleColor: '#c30005',
        messageFontSize: '16px',
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

  useEffect(() => {
    setChangeStatus(false)
    getOrder()
  }, [changeStatus])

  useEffect(() => {
    if (order?.orderStatus) setActiveStatus(order?.orderStatus)
  }, [order])

  return (
    <>
      <OverlayLoading loading={loading}>
        <div className={`w-full h-auto ${loading && 'blur-[2px]'}`}>
          <div className="max-w-[1230px] mx-auto ">
            <div className="w-full px-[15px]">
              <div className="w-full flex">
                <form className='w-full flex flex-col '>
                  {/* top */}
                  <div className="flex">
                    <div className="w-full pr-4 border border-transparent border-r-[#ddd]">
                      <h1 className='text-[18px] text-bgPrimary font-bold uppercase flex items-center'>
                        Chi tiết đơn hàng
                        <div className="inline-block px-1 border border-[#777] ml-2 text-[16px]">
                          <p className="inline-block text-primary opacity-75">{order?.orderStatus}</p>
                        </div>
                      </h1>
                      <div className="w-[100px] h-[3px] my-[10px] bg-red-600"></div>
                      <div className="">
                        <div className="flex justify-between uppercase font-bold border-[2px] border-transparent border-b-[#ccc]">
                          <h2 className='text-[14px] tracking-widest text-bgPrimary py-2'>Sản phẩm</h2>
                          <h2 className='text-[14px] tracking-widest text-bgPrimary py-2'>Tổng</h2>
                        </div>
                        <div className="flex items-center justify-between border border-transparent border-b-[#ddd]">
                          <div className="flex pb-4 mt-4">
                            <Skeleton loading={loading}>
                              <NavLink
                                to={`/san-pham/${order?.cartProduct.id}`}
                                className=''>
                                <img className="h-[80px] object-cover"
                                  src={order?.cartProduct.imgURL} alt="" />
                              </NavLink>
                            </Skeleton>
                            <div className="pl-4">
                              <div className="flex">
                                <Skeleton loading={loading}>
                                  <NavLink
                                    to={`/san-pham/${order?.cartProduct.id}`}
                                    className='text-[#334862]'>
                                    {order?.cartProduct.name || 'day la ten de chay skeleton'}
                                  </NavLink>
                                </Skeleton>
                                <Skeleton loading={loading} className='inline-block'>
                                  <p className='inline-block ml-1'> ×{order?.cartProduct.quantity}</p>
                                </Skeleton>
                              </div>
                              <Skeleton loading={loading}>
                                <div className="text-[14px] text-[#777]">
                                  <p className="mr-1 inline-block">Phân loại hàng:</p>
                                  {`${solveCategory(order?.cartProduct.category)} | ${solveBrand(order?.cartProduct.brand)}`}
                                </div>
                              </Skeleton>
                              <div className="text-primary px-1 text-[12px] border border-primary inline-block">7 ngày trả hàng</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                          <h2 className=''>Thời gian đặt hàng</h2>
                          <Skeleton className='inline-block' loading={loading}>
                            <h2 className={`${loading && 'w-[100px]'} font-bold inline-block text-[14px]`}>
                              {(order && `${order?.orderDate} | ${order?.orderTime}`) || '25 tháng 4 năm 2002'}
                            </h2>
                          </Skeleton>
                        </div>
                        <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                          <h2 className=''>Tổng phụ</h2>
                          <Skeleton className='inline-block' loading={loading}>
                            <h2 className={`${loading && 'w-[100px]'} font-bold inline-block text-[14px]`}>
                              {solvePrice(order?.cartProduct.price) || '9.999.999'} ₫
                            </h2>
                          </Skeleton>
                        </div>
                        <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                          <h2 className=''>Giao hàng</h2>
                          <Skeleton className={`${loading && 'w-[100px]'} inline-block`} loading={loading}>
                            <h2 className='font-bold inline-block text-[14px]'>
                              {solvePrice(order?.deliveryFee) || '9.999.999'} ₫
                            </h2>
                          </Skeleton>
                        </div>
                        <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                          <h2 className=''>Giảm giá từ shop</h2>
                          <Skeleton className={`${loading && 'w-[100px]'} inline-block`} loading={loading}>
                            <h2 className='font-bold inline-block text-[14px]'>
                              {solvePrice(order?.discount) || '9.999.999'} ₫
                            </h2>
                          </Skeleton>
                        </div>
                        <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                          <h2 className=''>Phương thức thanh toán</h2>
                          <Skeleton className='inline-block' loading={loading}>
                            <h2 className='font-bold inline-block text-[14px]'>
                              {order && order?.shippingAddress.paymentMethod
                                ? `${order?.shippingAddress.paymentMethod === "cash"
                                  ? 'Trả tiền mặt khi nhận hàng'
                                  : 'Chuyển khoản ngân hàng'}`
                                : 'Trả tiền mặt khi nhận hàng'}
                            </h2>
                          </Skeleton>
                        </div>
                        <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                          <h2 className=''>Tổng cộng</h2>
                          <Skeleton className={`${loading && 'w-[100px]'} inline-block`} loading={loading}>
                            <h2 className='font-bold inline-block text-[14px]'>
                              {`${order && order?.cartProduct.price + order?.deliveryFee - order?.discount > 0
                                ? solvePrice(order?.cartProduct.price + order?.deliveryFee - order?.discount)
                                : 0} ₫` || '9.999.999 ₫'}
                            </h2>
                          </Skeleton>
                        </div>
                      </div>
                    </div>
                    <div className="w-full pl-4">
                      <h1 className='text-[18px] text-bgPrimary font-bold uppercase'>Thông tin khách hàng</h1>
                      <div className="w-[100px] h-[3px] my-[10px] bg-red-600"></div>
                      <div className="flex justify-between uppercase font-bold border-[2px] border-transparent border-b-[#ccc]">
                        <h2 className='text-[14px] tracking-widest text-bgPrimary py-2'>Thông tin</h2>
                        <h2 className='text-[14px] tracking-widest text-bgPrimary py-2'>Cụ thể</h2>
                      </div>
                      <div className="">
                        <div className="flex items-center justify-between border border-transparent border-b-[#ddd]">
                          <div className="flex pb-4 mt-4">
                            <Skeleton loading={loading}>
                              <NavLink
                                // to={`/san-pham/${order?.cartProduct.id}`}
                                className=''>
                                <img className="h-[80px] aspect-square object-cover rounded-full"
                                  src={order?.imgAvatar} alt="" />
                              </NavLink>
                            </Skeleton>
                            <div className="pl-4">
                              <div className="">
                                <Skeleton loading={loading}>
                                  <div
                                    className='text-bgPrimary'>
                                    <p className="font-medium inline-block mr-1">Họ tên:</p>
                                    {order?.displayName || 'day la ten de chay skeleton'}
                                  </div>
                                </Skeleton>
                                <Skeleton loading={loading} className='inline-block'>
                                  <p className="font-medium inline-block mr-1">Email:</p>
                                  <p className='inline-block'> {order?.displayEmail}</p>
                                </Skeleton>
                              </div>
                              <div className="text-primary px-1 text-[12px] border border-primary inline-block">Thành viên của ShoesPlus</div>
                            </div>
                          </div>
                        </div>
                        {/* <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                          <h2 className=''>Thời gian đặt hàng</h2>
                          <Skeleton className='inline-block' loading={loading}>
                            <h2 className={`${loading && 'w-[100px]'} font-bold inline-block text-[14px]`}>
                              {(order && `${order?.orderDate} | ${order?.orderTime}`) || '25 tháng 4 năm 2002'}
                            </h2>
                          </Skeleton>
                        </div> */}
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd] text-[14px]">
                          <h2 className=''>Tỉnh / Thành phố
                          </h2>
                          <Skeleton className='inline-block' loading={loading}>
                            <h2 className='font-bold inline-block '>
                              {(order && order?.shippingAddress.city) || 'Bắc Ninhhhhhhhhhhhhhhhhhhh'}
                            </h2>
                          </Skeleton>
                        </div>
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd] text-[14px]">
                          <h2 className=''>Quận / Huyện
                          </h2>
                          <Skeleton className='inline-block' loading={loading}>
                            <h2 className='font-bold inline-block'>
                              {(order && order?.shippingAddress.district) || 'Bắc Ninhhhhhhhhhhhhhhhhhhh'}
                            </h2>
                          </Skeleton>
                        </div>
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd] text-[14px]">
                          <h2 className=''>Phường / Xã
                          </h2>
                          <Skeleton className='inline-block' loading={loading}>
                            <h2 className='font-bold inline-block'>
                              {(order && order?.shippingAddress.wards) || 'Bắc Ninhhhhhhhhhhhhhhhhhhh'}
                            </h2>
                          </Skeleton>
                        </div>
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd] text-[14px]">
                          <h2 className=''>Địa chỉ cụ thể
                          </h2>
                          <Skeleton className='inline-block' loading={loading}>
                            <h2 className='font-bold inline-block '>
                              {(order && order?.shippingAddress.address) || 'Bắc Ninhhhhhhhhhhhhhhhhhhh'}
                            </h2>
                          </Skeleton>
                        </div>
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd] text-[14px]">
                          <h2 className=''>Số điện thoại
                          </h2>
                          <Skeleton className='inline-block' loading={loading}>
                            <h2 className='font-bold inline-block '>
                              {(order && order?.shippingAddress.phoneNumber) || 'Bắc Ninhhhhhhhhhhhhhhhhhhh'}
                            </h2>
                          </Skeleton>
                        </div>
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd] text-[14px]">
                          <h2 className=''>Ghi chú
                          </h2>
                          <Skeleton className='inline-block' loading={loading}>
                            <h2 className='font-bold inline-block '>
                              {order && order?.shippingAddress.note
                                ? order.shippingAddress.note
                                : <p className={`${loading || 'italic'}`}>Không có ghi chú</p>}
                            </h2>
                          </Skeleton>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{
                    height: '.1875rem',
                    width: '100%',
                    backgroundPositionX: '-1.875rem',
                    backgroundSize: '7.25rem .1875rem',
                    backgroundImage: 'repeating-linear-gradient(45deg,#6fa6d6,#6fa6d6 33px,transparent 0,transparent 41px,#f18d9b 0,#f18d9b 74px,transparent 0,transparent 82px)',
                  }} className='my-4'></div>
                  {/* bottom */}
                  <div className="">
                    <div className="w-full flex items-center justify-between item shadow-shadowPrimary px-3">
                      {['Đang xử lý', 'Vận chuyển', 'Đang giao', 'Hoàn thành']
                        .map(item => (
                          <button
                            key={item}
                            onClick={(e) => {
                              e.preventDefault()
                              if (order.orderStatus === 'Hoàn thành') {
                                toast.error('Đơn hàng đã hoàn thành, không thể cập nhật', {
                                  autoClose: 1200
                                })
                              }
                              else if (order.orderStatus === 'Đã hủy') {
                                toast.error('Đơn hàng đã bị hủy, không thể cập nhật', {
                                  autoClose: 1200
                                })
                              }
                              else setActiveStatus(item)
                            }}
                            value={item}
                            className={`${activeStatus === item ? 'border-b-primary text-primary' : 'border-b-[#fff]'} text-center text-bgPrimary cursor-pointer transition-all ease-in-out duration-150 border-[2px] border-t-0 border-l-0 border-r-0 hover:text-primary font-medium py-3`}>{item}</button>
                        ))}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          console.log(activeStatus);
                          if (order.orderStatus === 'Hoàn thành') {
                            toast.error('Đơn hàng đã hoàn thành, không thể cập nhật', {
                              autoClose: 1200
                            })
                          }
                          else if (order.orderStatus === 'Đã hủy') {
                            toast.error('Đơn hàng đã bị hủy, không thể cập nhật', {
                              autoClose: 1200
                            })
                          }
                          else confirmUpdateStatus(e)
                        }}
                        className='bg-primary text-white px-2 py-1 hover:bg-[#a40206] transition-all ease-linear duration-[120ms]'>
                        <span className='tracking-wider uppercase text-[14px] font-medium'>Cập nhật tình trạng</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div >
      </OverlayLoading >
    </>
  );
};

export default OrderDetailAdmin;