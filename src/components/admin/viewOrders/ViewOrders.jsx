import { faMinus, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { collection, getDocs, query } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { db } from '../../../firebase/config';
import { Spinning } from '../../../animation-loading'
import OrderDetailAdmin from './OrderDetailAdmin';
import Pagination from '../../pagination/Pagination';

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

function formatDate(dateString) {
  const arr = dateString.split(/[\s,]+/);
  const filteredArr = arr.filter(item => !isNaN(item));
  return `${filteredArr[0].padStart(2, '0')}/${filteredArr[1].padStart(2, '0')}/${filteredArr[2]}`
}

const itemsPerPage = 5;
const quantity = 3;

const ViewOrders = () => {
  const { id } = useParams()
  const [orderID, setOrderID] = useState('')
  const [orderDetailAdmin, setOrderDetailAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [allOrders, setAllOrders] = useState(true)
  const [allOrdersSort, setAllOrdersSort] = useState(true)
  const navigate = useNavigate()
  //
  const [currentPage, setCurrentPage] = useState(1)
  const [pageProducts, setPageProducts] = useState([]); //products every page (use slice to cut all 
  //
  const [notFound, setFound] = useState(false)
  const filterRef = useRef()
  const queryRef = useRef()

  const getOrders = async () => {
    setLoading(true)
    const ordersRef = query(collection(db, "orders"));
    const q = query(ordersRef);
    try {
      const querySnapshot = await getDocs(q);
      const allOrders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      const allOrdersConverted = allOrders
        .sort((orderA, orderB) => (new Date(orderA.creatAt)) - (new Date(orderB.creatAt)))

      localStorage.setItem('orderLengthAdmin', JSON.stringify(allOrders.length))
      setTimeout(() => {
        setLoading(false)
        setAllOrders(allOrdersConverted)
        setAllOrdersSort(allOrdersConverted)
        setPageProducts(allOrdersConverted.slice(0, itemsPerPage))
      }, 500)
    }
    catch (e) {
      console.log(e.message);
    }
  }

  const handleFilterOrder = (e) => {
    if (e.target.value !== 'default') {
      queryRef.current.value = 'default'
      // setNotFound(false)
      setCurrentPage(1)
      if (e.target.value == 'all') setAllOrdersSort(allOrders)
      else setAllOrdersSort([...allOrders].filter(item => (item.orderStatus === e.target.value)));
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
      default:
        break;
    }
  }

  const handleQueryOrder = (e) => {
    if (e.target.value !== 'default') {
      const { field, order } = solveQuery(e.target.value)
      setAllOrdersSort([...allOrdersSort].sort((a, b) => {
        if ((new Date(a[field])) > (new Date(b[field]))) return order
        return (order) * (-1)
      }));
    }
  }

  useEffect(() => {
    getOrders()
    filterRef.current.value = 'default'
    queryRef.current.value = 'default'
  }, [])

  useEffect(() => {
    if (id === 'view') {
      setOrderDetailAdmin(false)
      getOrders()
    }
    else setOrderDetailAdmin(true)
  }, [id])

  return (
    <>
      {!orderDetailAdmin
        ? (
          <div className="">
            <div className="h-full">
              <div className="flex gap-4 mb-4 w-full items-center justify-end">
                <div className='text-bgPrimary text-[16px] flex items-center'>
                  <p className='font-bold inline-block text-[16px]'>Số lượng</p>
                  : {notFound ? "0" : allOrdersSort.length} đơn hàng
                </div>
                <div className="">
                  <select
                    ref={filterRef}
                    onChange={handleFilterOrder}
                    className='outline-none bg-slate-100 px-3 py-2 text-bgPrimary cursor-pointer border border-solid border-[#ddd] inline-block'
                    name="sort-by" id="">
                    <option key='0' value="default">Lọc đơn hàng theo</option>
                    <option key='1' value="all">Tất cả</option>
                    <option key='2' value="Đang xử lý">Đang xử lý</option>
                    <option key='3' value="Vận chuyển">Vận chuyển</option>
                    <option key='4' value="Đang giao">Đang giao</option>
                    <option key='5' value="Hoàn thành">Hoàn thành</option>
                    <option key='6' value="Đã hủy">Đã hủy</option>
                  </select>
                </div>
                <div className="">
                  <select
                    ref={queryRef}
                    onChange={handleQueryOrder}
                    className='outline-none bg-slate-100 px-3 py-2 text-bgPrimary cursor-pointer border border-solid border-[#ddd] shadow-shadowSearch'
                    name="sort-by" id="">
                    <option key='0' value="default">Sắp xếp đơn hàng theo</option>
                    <option key='1' value="latest">Mới nhất</option>
                    <option key='2' value="oldest">Cũ nhất</option>
                  </select>
                </div>
              </div>
              <div className="w-full shadow-shadowPrimary px-3 rounded-md">
                <table className='w-full'>
                  <thead>
                    <tr className={`${!loading && allOrders.length > 0 && 'border-[3px] border-transparent border-b-[#ececec]'} grid grid-cols-14 gap-2 grid-rows-1 text-[14px] font-bold py-4 uppercase tracking-wider`}>
                      <td className='col-span-3'>Họ tên</td>
                      <td className='col-span-3'>Địa chỉ</td>
                      <td className='col-span-2'>SĐT</td>
                      <td className='col-span-2'>Ngày đặt</td>
                      <td className='col-span-2'>Tình trạng</td>
                      <td className='col-span-2'>Hành động</td>
                    </tr>
                  </thead>
                  <tbody style={{
                    height: `${loading ? '0' : itemsPerPage * 70 + 20}px`
                  }}>
                    {!loading && allOrders.length === 0 && (
                      <div className="w-full h-full flex flex-col gap-4 mt-8 items-center">
                        <div
                          style={{
                            backgroundImage: "url('/emptyOrder.jpg')"
                          }}
                          className="w-[220px] h-[250px] bg-cover bg-no-repeat bg-center"></div>
                        <div className='text-center text-[18px] font-bold text-bgPrimary leading-[32px] uppercase'>Chưa có đơn hàng nào được tạo ra
                        </div>
                      </div>
                    )}
                    {!loading
                      && (
                        (pageProducts.length === 0 && allOrders.length > 0)
                          ? (
                            <div className="w-full flex flex-col gap-4 items-center mt-8">
                              <div
                                style={{
                                  backgroundImage: "url('/emptyOrder.jpg')"
                                }}
                                className="w-[220px] h-[250px] bg-cover bg-no-repeat bg-center"></div>
                              <div className='text-center text-[18px] font-bold text-bgPrimary leading-[32px] uppercase'>
                                Chưa có đơn hàng nào
                                <p className="inline-block text-primary ml-[6px]">{filterRef.current.value}</p>
                              </div>
                            </div>
                          )
                          : (
                            pageProducts.map((order) => (
                              <tr
                                key={order.id}
                                className='grid items-center grid-cols-14 gap-2 rounded-[4px] h-[70px] border border-transparent border-b-[#ececec]'>
                                <td className='col-span-3 grid grid-cols-7 gap-3 items-center'>
                                  <p className="col-span-7 flex flex-col line-clamp-2">
                                    {order.displayName}
                                  </p>
                                </td >
                                <td className='col-span-3 flex ' >
                                  <span className='text-[16px] line-clamp-2'>{order.shippingAddress.address}</span>
                                </td >
                                <td className='col-span-2 flex items-center py-2'>
                                  <p className="">{order.shippingAddress.phoneNumber}</p>
                                </td>
                                <td className='col-span-2 flex items-center py-2'>
                                  <p className="">{formatDate(order.orderDate)}</p>
                                </td>
                                <td className='col-span-2 flex items-center font-bold'>
                                  <p className={`text-bgPrimary text-center text-[16px] ${order.orderStatus === 'Hoàn thành' && 'text-green-600'} ${order.orderStatus === 'Đã hủy' && 'text-primary'}`}>
                                    {order.orderStatus}
                                  </p>
                                </td>
                                <td className='col-span-2 flex items-center font-bold'>
                                  <button
                                    onClick={(e) => {
                                      setOrderID(order.id)
                                      setOrderDetailAdmin(true)
                                      navigate(`/admin/view-orders/${order.id}`)
                                    }}
                                    className='bg-primary text-white px-2 py-1 hover:bg-[#a40206] transition-all ease-linear duration-[120ms]'>
                                    <span className='tracking-wider uppercase text-[14px] font-medium'>Xem chi tiết</span>
                                  </button>
                                </td>
                              </tr>
                            ))
                          )
                      )}
                  </tbody>
                </table>
              </div>
              {loading && (
                <div className="w-full h-[350px]">
                  <Spinning color='#1f2028' size='30px' />
                </div>
              )}
            </div>
            {!loading && allOrders.length !== 0 && (
              <div className="">
                <Pagination
                  products={allOrdersSort}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  quantity={quantity}
                  setPageProducts={setPageProducts} />
              </div>
            )}
          </div>
        )
        : <>
          {/* lí do phải || id là orderID chỉ được set khi click vào sp, vậy khi click rồi, vào đc OrderDetailAdmin rồi mà nhấn refresh thì orderID nó là '', vậy nên phải || id (vì id lúc này là cái path phía sau view-order/kjas2pIeRvlnvkGAHpjX) */}
          <OrderDetailAdmin id={orderID || id} />
        </>}
    </>
  );
};

export default ViewOrders;