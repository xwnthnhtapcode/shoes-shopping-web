import React, { memo, useCallback, useEffect, useState } from 'react';
import { faSearch, faShapes, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Nav from './Nav';
import './headerScroll.scss'
import { navData } from './navData';
import DropDownAccount from './DropDownAccount';
import { onAuthStateChanged, signOut, updateEmail, updateProfile } from 'firebase/auth';
import { auth, db } from '../../firebase/config';
import { toast, ToastContainer } from 'react-toastify';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  REMOVE_ACTIVE_USER,
  SET_ACTIVE_USER,
  selectEmail,
  SET_ACTIVE_ADMIN,
  REMOVE_ACTIVE_ADMIN,
  SET_GOOGLE_USER,
  selectUserID,
} from '../../redux-toolkit/slice/authSlice';
import Admin from '../admin/Admin';
import { adminAccount } from '../../AdminAccount';
import { SET_CURRENT_USER, STORE_PRODUCTS } from '../../redux-toolkit/slice/productSlice';
import { addDoc, collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { selectTotalPayment } from '../../redux-toolkit/slice/cartSlice';
import DropDownCart from './DropDownCart';
import DropDownSearch from './DropDownSearch';

const Header = ({ logined, setLogined, admin, setAdmin, isGoogleUser, setIsGoogleUser }) => {
  // khi reload lại window, logined bị chạy lại const [logined, setLogined] = useState(false) nên nó sẽ nhấp nháy ở "Đăng nhập/đăng xuất" (logined = false) rồi mới chuyển qua Tài khoản (logined = false), do đó phải khởi tạo lấy giá trị từ localstrogate
  // const [logined, setLogined] = useState(localStorage.getItem('logined') === 'true' ? true : false)
  const [scrolled, setScrolled] = useState(false);
  const [hoverAccount, setHoverAccount] = useState(false)
  const [hoverCart, setHoverCart] = useState(false)
  const [hoverSearch, setHoverSearch] = useState(false)
  // const totalPayment = useSelector(selectTotalPayment) || JSON.parse(localStorage.getItem('totalPayment'))
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userEmail = useSelector(selectEmail) || localStorage.getItem('displayEmail')
  const userID = useSelector(selectUserID) || localStorage.getItem('userID')
  //
  const currentPath = window.location.pathname;

  const getProducts = async () => {
    const productsRef = collection(db, "products");
    const q = query(productsRef, orderBy('creatAt', 'desc'));
    try {
      const querySnapshot = await getDocs(q);
      const allProducts = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        }
      })
      //init
      // console.log(allProducts);
      localStorage.setItem('products', JSON.stringify(allProducts))
      //save products to redux
      dispatch(STORE_PRODUCTS(allProducts))
    }
    catch (e) {
      toast.error(e.message, {
        autoClose: 1000
      })
    }
  }

  const solvePrice = (price) => {
    return Number(price).toLocaleString('vi-VN');
  }

  const logoutUser = () => {
    signOut(auth).then(() => {
      toast.success('Đăng xuất thành công', {
        autoClose: 1200,
      });
      setLogined(false)

      dispatch(REMOVE_ACTIVE_USER())
      localStorage.setItem('logined', JSON.stringify(false));

      setAdmin(false)
      dispatch(SET_ACTIVE_ADMIN(false))
      localStorage.setItem('admin', JSON.stringify(false));

      setIsGoogleUser(false)
      localStorage.setItem('isGoogleUser', JSON.stringify(false));

      localStorage.removeItem('imgAvatar');
      localStorage.removeItem('prevLinkEditProduct')
      localStorage.removeItem('showProduct')
      localStorage.removeItem('products')
      localStorage.removeItem('currentUser')
      localStorage.removeItem('userID')
      localStorage.removeItem('cartItems')
      localStorage.removeItem('totalPayment')
      localStorage.removeItem('cartLength')
    }).catch((e) => {
      toast.error(e.message, {
        autoClose: 1200,
      });
    });
  }

  //DO thằng Header để ở đầu file App nên lúc nào cũng đc chạy trước :v nên lấy luôn thông tin từ đây cho nhanh, thông tin luôn được lấy đầu tiên
  useEffect(() => {
    //Nhận diện người dùng đã log in vào hay chưa
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.photoURL) localStorage.setItem('imgAvatar', user.photoURL); //set avatar cho user login by google
        else { //avatar default cho account
          const currentUser = auth.currentUser;
          updateProfile(currentUser, { photoURL: '../../defaultAvatar.jpg' })
          localStorage.setItem('imgAvatar', '../../defaultAvatar.jpg');
        }

        const uid = user.uid;
        const providerData = user.providerData;
        const isGoogleUser = providerData.some(provider => provider.providerId === 'google.com');

        // Nếu tài khoản đăng nhập là Google
        if (isGoogleUser) {
          localStorage.setItem('isGoogleUser', JSON.stringify(true));
          dispatch(SET_GOOGLE_USER(true))
          setIsGoogleUser(true)
          // xử lý khác (ví dụ hiển thị thông báo lỗi, ẩn form đổi mật khẩu, v.v.)
        }

        setLogined(true)
        setHoverAccount(false)
        localStorage.setItem('logined', JSON.stringify(true));
        //login bằng gg thì nó có displayname là tên gg, còn login bằng mail thì nó là null, khi đó setusername là tên gmail luôn

        //lưu trên localStorage để xử lí TH mất mạng, phương thức onAuthStateChanged không được gọi vì thế dislayName, displayEmail SẼ BỊ RỖNG (do lúc này dispatch ở dòng 61 không được thực hiện nên nó sẽ lấy giá trị khởi tạo của redux), VẬY NÊN để xử lí thì lưu trên localstrogate
        localStorage.setItem('displayName', user.displayName?.slice(0, 20) || (user.email.slice(0, -10).charAt(0).toUpperCase() + (user.email.slice(0, -10)).slice(1)));
        localStorage.setItem('displayEmail', user?.email);
        localStorage.setItem('userID', user.uid);

        //set info user
        dispatch(
          SET_ACTIVE_USER({
            email: user?.email,
            userName: user.displayName?.slice(0, 20) || (user.email.slice(0, -10).charAt(0).toUpperCase() + (user.email.slice(0, -10)).slice(1)),
            userID: user.uid,
          })
        )

        // console.log(user.email);
        // console.log(adminAccount);
        if (user.email === adminAccount) {
          dispatch(SET_ACTIVE_ADMIN(true))
          setAdmin(true)
          localStorage.setItem('admin', JSON.stringify(true));
        }
        else {
          dispatch(SET_ACTIVE_ADMIN(false))
          setAdmin(false)
          localStorage.setItem('admin', JSON.stringify(false));
        }

        //Nhận diện người dùng đã log out hay chưa
      } else {
        console.log('nhan dien logout'); //mat mang hoac tai koan k ton tai (xoa tai khoan trong firebase) thi no tu dong chay vao day luon :v thoi met qua k solve cai nay nua
        localStorage.removeItem('displayName');
        localStorage.removeItem('displayEmail');

        setLogined(false)
        localStorage.setItem('logined', JSON.stringify(false));

        setAdmin(false)
        dispatch(SET_ACTIVE_ADMIN(false))
        localStorage.setItem('admin', JSON.stringify(false));

        setIsGoogleUser(false)
        localStorage.setItem('isGoogleUser', JSON.stringify(false));

        localStorage.removeItem('imgAvatar');
        localStorage.removeItem('prevLinkEditProduct')
        localStorage.removeItem('showProduct')
        localStorage.removeItem('products')
        localStorage.removeItem('currentUser')
        localStorage.removeItem('userID')
        localStorage.removeItem('cartItems')
        localStorage.removeItem('totalPayment')
        localStorage.removeItem('cartLength')

        dispatch(REMOVE_ACTIVE_ADMIN())
        dispatch(REMOVE_ACTIVE_USER())
        dispatch(SET_ACTIVE_ADMIN(false))
      }
    });

  }, [userEmail]) //khi useSelector(selectEmail) thì redux lúc này vẫn là "" hết, vậy nên khi dispatch thằng email, phải truyền userEmail để dispatch xong re-render nó lại chạy vào thằng useEffect này để check userEmail === adminAccount ?

  const handleScroll = useCallback(() => {
    if (window.pageYOffset > 254) {
      setScrolled(true);
    } else if (window.pageYOffset == 0) {
      setScrolled(false);
    }
  });

  useEffect(() => {
    //lúc vào trang cái thì tải luôn cả products về cho dễ dùng
    //ném vào localstrogate và ném vào redux
    getProducts()

    //call scroll luc moi vao web ma man hinh > 200
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* <img className='w-[100px] h-[100px]' src={localStorage.getItem('imgAvatar')} alt="" /> */}
      <div className={`${scrolled ? "" : "absolute"} z-[99999] h-[125px] w-full`}></div>
      <header className={`${scrolled ? "stuck fixed" : "relative"} z-[99999] h-[125px] w-full text-white/80`}>
        <div className="h-[72px] bg-bgPrimary">
          <div className=" grid grid-cols-12 grid-rows-1 h-full px-[15px] max-w-[1230px]  mx-auto">
            <div className='col-span-4 flex items-center'>
              {
                logined
                  ? <div
                    onMouseEnter={() => setHoverAccount(true)}
                    onMouseLeave={() => setHoverAccount(false)}
                    className='cursor-pointer text-[13px] py-[10px] font-bold tracking-[0.32px] no-underline  text-white/80 hover:text-white transition-all ease-linear duration-200 relative'>
                    <FontAwesomeIcon icon={faUser} className='cursor-pointer pr-[10px] text-[18px]' />
                    <p className='uppercase inline-block'>Tài khoản</p>
                    {hoverAccount ? <DropDownAccount logined={logined} logoutUser={logoutUser} setHoverAccount={setHoverAccount} admin={admin} /> : ""}
                  </div>
                  : <NavLink
                    to="/dang-nhap"
                    onClick={() => {
                      window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                      });
                    }}
                    className='text-[13px] cursor-pointer py-[10px] hover:text-white transition-all ease-linear duration-200 font-bold tracking-[0.32px] no-underline uppercase text-white/80' href="">
                    Đăng nhập / Đăng ký
                  </NavLink>
              }
            </div>

            <NavLink
              to="/"
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                });
              }}
              className="col-span-4 py-[10px] h-full">
              <div
                style={{
                  backgroundImage: "url(../../logo.png)"
                }}
                className="w-full h-full bg-contain bg-no-repeat bg-center"></div>
              {/* <img className='w-full h-full object-contain' src="/logo.png" alt="" /> */}
            </NavLink>

            <div className="col-span-4 ml-auto flex gap-[15px] items-center">
              <div
                onMouseEnter={() => setHoverSearch(true)}
                onMouseLeave={() => setHoverSearch(false)}
                className="relative flex items-center py-[22px] pl-4 pr-2">
                <FontAwesomeIcon icon={faSearch} className='cursor-pointer text-[18px]' />
                {hoverSearch && <DropDownSearch setHoverSearch={setHoverSearch} />}
              </div>
              {admin
                ? (<NavLink
                  to='/admin/home'
                  onClick={() => {
                    window.scrollTo({
                      top: 0,
                      // behavior: 'smooth'
                    });
                  }}
                  className="col-span-4 flex items-center ml-auto cursor-pointer py-[10px] text-[13px] font-bold no-underline tracking-[0.32px] uppercase hover:text-white transition-all ease-linear duration-200 justify-center">
                  Dashboard
                  <FontAwesomeIcon
                    icon={faShapes}
                    className='cursor-pointer pl-[10px] text-[18px] mb-1' />
                </NavLink>)
                : (
                  <div
                    onMouseEnter={() => {
                      if (currentPath !== '/gio-hang'
                        && currentPath !== '/thanh-toan/bill-info'
                        && currentPath !== '/thanh-toan/success') {
                        setHoverCart(true)
                      }
                    }}
                    onMouseLeave={() => {
                      if (currentPath !== '/gio-hang'
                        && currentPath !== '/thanh-toan/bill-info'
                        && currentPath !== '/thanh-toan/success') {
                        setHoverCart(false)
                      }
                    }}
                    onClick={() => {
                      window.scrollTo({
                        top: 0,
                      })
                      if (logined) {
                        navigate('/gio-hang')
                        setHoverCart(false)
                      }
                      else navigate('/dang-nhap')
                    }}
                    className="flex gap-[10px] cursor-pointer py-[22px] text-[13px] font-bold items-center no-underline tracking-[0.32px] hover:text-white transition-all ease-linear duration-200 relative">
                    <span className="uppercase">
                      Giỏ hàng / Thanh toán
                    </span>
                    <span className="">
                      <FontAwesomeIcon icon={faShoppingCart} className='text-[18px]' />
                    </span>
                    {hoverCart && logined && <DropDownCart logined={logined} logoutUser={logoutUser} setHoverCart={setHoverCart} admin={admin} />}
                  </div>
                )}

            </div>

          </div>
        </div >
        <div className="min-h-[25px] w-full shadow-shadowAccounts bg-[#d3d3d3]">
          <div className="px-[15px] max-w-[1230px] mx-auto">
            <ul className="flex w-full gap-[30px] justify-center">
              {navData.map((nav) => (
                <Nav
                  key={nav.name}
                  name={nav.name}
                  to={nav.to}
                />
              ))}
            </ul>
          </div>
        </div>
      </header >
    </>
  );
};

export default memo(Header);