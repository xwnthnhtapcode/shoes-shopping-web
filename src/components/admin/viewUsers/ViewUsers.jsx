import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { auth, db } from '../../../firebase/config';
import Pagination from '../../pagination/Pagination';
import { Spinning } from '../../../animation-loading';
import { adminAccount } from '../../../AdminAccount';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faGift, faLock } from '@fortawesome/free-solid-svg-icons';
import { browserSessionPersistence, createUserWithEmailAndPassword, sendPasswordResetEmail, setPersistence } from 'firebase/auth';
import Notiflix from 'notiflix';
import { toast } from 'react-toastify';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import OverlaySendGift from './OverlaySendGift';

const itemsPerPage = 6;
const quantity = 3;

const ViewUsers = () => {
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState(null);
  const [allUsersSort, setAllUsersSort] = useState(null);
  //
  const [currentPage, setCurrentPage] = useState(1)
  const [pageProducts, setPageProducts] = useState([]); //products every page (use slice to cut all 
  //
  const [openSendGift, setOpenSendGift] = useState(false)
  //
  const userIDSendGift = useRef()

  const getUsers = async () => {
    setLoading(true)
    const ordersRef = query(collection(db, "users"));
    const q = query(ordersRef);
    try {
      const querySnapshot = await getDocs(q);
      const allUsers = querySnapshot.docs.map((doc) => {
        if (doc.data().displayEmail !== adminAccount) {
          return ({
            id: doc.id,
            ...doc.data()
          })
        }
      }).filter(user => user)
      const allUserWithOrder = await Promise.all(allUsers.map(async (user) => {
        const ordersRef = query(collection(db, "orders"), where('userID', "==", user.userID));
        const q = query(ordersRef);
        try {
          const querySnapshot = await getDocs(q);
          const order = querySnapshot.docs.map((doc) => ({ ...doc.data() }))
          return ({
            ...user,
            orderQuantity: order.length
          })
        }
        catch (e) {
          console.log(e.message);
        }
      }))
      // localStorage.setItem('orderLength', JSON.stringify(allOrders.length))
      setTimeout(() => {
        setLoading(false)
        setAllUsers(allUserWithOrder)
        setAllUsersSort(allUserWithOrder)
        setPageProducts(allUserWithOrder.slice(0, itemsPerPage))
      }, 1000)
    }
    catch (e) {
      console.log(e.message);
    }
  }

  // const getUserProvider = async (id) => {
  //   const docRef = doc(db, "users", id);
  //   const docSnap = await getDoc(docRef);

  //   if (docSnap.exists()) {
  //     return docSnap.data().provider
  //     // setUser({
  //     //   id: id,
  //     //   ...docSnap.data()
  //     // })
  //   } else {
  //     //
  //   }
  // }

  const handleCreateNewUser = () => {
    createUserWithEmailAndPassword(auth, 'duchau123@gmail.com', '11111111')
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log('user: ', user);
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  const handleSendMail = async (e, email, provider) => {
    e.preventDefault()
    if (provider === 'google') {
      toast.error('Tài khoàn google không thể đổi mật khẩu', {
        autoClose: 1200,
        position: 'top-left'
      })
    }
    else {
      Notiflix.Confirm.show(
        'Đặt lại mật khẩu',
        'Bạn có muốn gửi email đặt lại mật khẩu cho người dùng này ?',
        'Gửi email',
        'Hủy bỏ',
        function okCb() {
          sendPasswordResetEmail(auth, email)
            .then(() => {
              toast.success('Email đã được gửi thành công', {
                autoClose: 1200,
                position: 'top-left'
              })
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              // ..
            });
        },
        function cancelCb() {
          console.log();
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

  }

  const handleSendVoucher = (e, userID) => {
    e.preventDefault()

  }

  useEffect(() => {
    getUsers()
  }, []);

  return (
    <>
      <OverlaySendGift
        openSendGift={openSendGift}
        setOpenSendGift={setOpenSendGift}
        userID={userIDSendGift.current}>
        <div className="">
          <div className="h-full">
            <div className="w-full shadow-shadowPrimary px-3 rounded-md">
              <table className='w-full'>
                <thead>
                  <tr className={`${!loading && allUsersSort.length > 0 && 'border-[3px] border-transparent border-b-[#ececec]'} grid grid-cols-14 gap-2 grid-rows-1 text-[14px] font-bold py-4 uppercase tracking-wider`}>
                    <td className='col-span-2 flex justify-center'>Ảnh hiển thị</td>
                    <td className='col-span-3'>Họ tên khách hàng</td>
                    <td className='col-span-3'>Địa chỉ email</td>
                    <td className='col-span-2 flex justify-center'>Đăng nhập</td>
                    <td className='col-span-2 flex justify-center'>Số đơn hàng</td>
                    <td className='col-span-2 flex justify-center'>Hành động</td>
                  </tr>
                </thead>
                <tbody style={{
                  height: `${loading ? '0' : itemsPerPage * 70 + 20}px`
                }}>
                  {!loading && allUsers.length === 0 && (
                    <div className="w-full h-full flex flex-col gap-4 items-center mt-8">
                      <div
                        style={{
                          backgroundImage: "url('/emptyOrder.jpg')"
                        }}
                        className="w-[220px] h-[250px] bg-cover bg-no-repeat bg-center"></div>
                      {/* khi chưa có người dùng nào */}
                      <div className='text-center text-[18px] font-bold text-bgPrimary leading-[32px] uppercase'>Chưa có người dùng nào được tạo ra
                      </div>
                    </div>
                  )}
                  {!loading
                    && (
                      (pageProducts.length === 0 && allUsers.length > 0)
                        ? (
                          <div className="w-full flex flex-col gap-4 items-center mt-8">
                            <div
                              style={{
                                backgroundImage: "url('/emptyOrder.jpg')"
                              }}
                              className="w-[220px] h-[250px] bg-cover bg-no-repeat bg-center"></div>
                            <div className='text-center text-[18px] font-bold text-bgPrimary leading-[32px] uppercase'>
                              {/* search */}
                              Chưa có người dùng nào
                            </div>
                          </div>
                        )
                        : (
                          pageProducts.map((user) => (
                            <tr
                              key={user.id}
                              className='grid items-center grid-cols-14 gap-2 rounded-[4px] h-[70px] border border-transparent border-b-[#ececec]'>
                              <td className='col-span-2 flex items-center justify-center'>
                                <img src={user.avatar} alt="" className='col-span-7 flex flex-col w-[50px] aspect-square rounded-full' />
                              </td >
                              <td className='col-span-3 flex ' >
                                <span className='text-[16px] line-clamp-2'>{user.displayName}</span>
                              </td >
                              <td className='col-span-3 flex items-center py-2'>
                                <p className="">{user.displayEmail}</p>
                              </td>
                              <td className='col-span-2 flex items-center justify-center py-2 font-bold'>
                                {user.provider === 'google'
                                  ? <FontAwesomeIcon className='text-[20px] text-primary' icon={faGoogle} />
                                  : <FontAwesomeIcon className='text-[20px] text-blue-600' icon={faEnvelope} />}
                              </td>
                              <td className='col-span-2 flex items-center justify-center font-bold'>
                                <p className='text-bgPrimary text-center text-[16px]'>
                                  {user.orderQuantity}
                                </p>
                              </td>
                              <td className='col-span-2 flex gap-4 items-center font-bold justify-center'>
                                <button
                                  className='hover:text-primary transition-all ease-in-out duration-200'
                                  onClick={(e) => handleSendMail(e, user.displayEmail, user.provider)}>
                                  <FontAwesomeIcon className='text-[18px]' icon={faLock} />
                                </button>
                                <button
                                  className='hover:text-primary transition-all ease-in-out duration-200'
                                  onClick={() => {
                                    userIDSendGift.current = user.userID
                                    setOpenSendGift(true)
                                  }}>
                                  <FontAwesomeIcon className='text-[18px]' icon={faGift} />
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
          {!loading && allUsers.length !== 0 && (
            <div className="">
              <Pagination
                products={allUsersSort}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                quantity={quantity}
                setPageProducts={setPageProducts} />
            </div>
          )}
        </div >
      </OverlaySendGift>
    </>
  );
};

export default ViewUsers;