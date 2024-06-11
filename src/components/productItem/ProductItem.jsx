import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import ButtonPrimary from '../button/ButtonPrimary';
import "../../components/lineClamp.scss"
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAdmin, selectIsLoggedIn } from '../../redux-toolkit/slice/authSlice';
import { selectUserID } from '../../redux-toolkit/slice/authSlice';
import { Timestamp, addDoc, collection, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';

const ProductItem = ({
  setIdxActive, setHoverShowProduct, setTranslateShowX,
  setTranslateX, setHoverSimilarProduct,
  product, id, img, name, price, text, width, idURL, setLoadingPage }) => {

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const admin = useSelector(selectIsAdmin) || JSON.parse(localStorage.getItem('admin'))
  const userID = useSelector(selectUserID) || localStorage.getItem('userID')
  const logined = useSelector(selectIsLoggedIn) || JSON.parse(localStorage.getItem('logined'))

  const detectUser = (functionAdmin, functionUser) => {
    if (admin) return functionAdmin;
    return functionUser
  }

  const handleDetectAdmin = () => {
    //chỉ admi mới cần set showProduct và prevLinkEditProduct
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    localStorage.setItem('showProduct', JSON.stringify(product))
    if (idURL) localStorage.setItem('prevLinkEditProduct', `/${idURL}`)
    navigate(`/admin/add-product/${id}`)
  }

  const handleAddToCart = async () => {
    if (!loading) { //nếu đang loading thì k xử lí thêm sản phẩm
      setLoading(true)
      const productsRef = query(
        collection(db, "cartProducts"),
        where('userID', "==", userID), //id người dùng
        where('id', "==", id)); //id của sản phẩm
      const q = query(productsRef);
      try {
        const querySnapshot = await getDocs(q);
        //sản phẩm chưa có trong giỏ hàng, thêm vào với quantity là 1
        if (querySnapshot.docs.length === 0) {
          setTimeout(() => {
            try {
              const docRef = addDoc(collection(db, "cartProducts"), {
                ...product,
                userID: userID,
                quantity: 1,
                addAt: Timestamp.now().toDate().toString()
              });
              setLoading(false)
              toast.success(`Thêm sản phẩm thành công`, {
                position: "top-left",
                autoClose: 1200
              })
            } catch (e) {
              console.log(e.message);
            }
          }, 1000)
        }
        else { //nếu nó đã tồn tại rồi thì tăng quantity lên 1
          const docRef = querySnapshot.docs[0].ref;
          const docSnapshot = await getDoc(docRef);
          const currentQuantity = docSnapshot.data().quantity;

          await updateDoc(docRef, {
            quantity: currentQuantity + 1,
          });
          setLoading(false)
          //có rồi mà thêm ở product Item thì quantity tăng 1, nếu ở detail thi quantity: số lượng
          toast.success(`Thêm sản phẩm thành công`, {
            position: "top-left",
            autoClose: 1200
          })
        }
      }
      catch (e) {
        console.log(e.message);
      }
    }
  }

  return (
    <>
      {/* w-[280px] */}
      <div
        className={`bg-white ${width ? "" : 'w-full'}`}>
        <div className=''>
          <NavLink
            onMouseDown={(e) => e.preventDefault()}
            onMouseUp={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            className='block h-[150px] touch-none'
            draggable="false"

            onClick={(e) => {
              if (setTranslateX) setTranslateX(0)
              if (setHoverSimilarProduct) setHoverSimilarProduct(false)
              //
              if (setIdxActive) setIdxActive(0)
              if (setHoverShowProduct) setHoverShowProduct(false)
              if (setTranslateShowX) setTranslateShowX(0)
              //
              if (setLoadingPage) setLoadingPage(true) //nguyên nhân có cái này là truyền từ Sản phẩm tương tự trong productDetail, lí do truyền là khi ấn vào, nó sẽ bị nháy ở sp hiện tại (loading car ý nó = false nên nó hiện cái cũ), vậy nên khi ấn vào minh set cho nó là true phát luôn để không bị nháy, THỬ BỎ DÒNG NÀY ĐI CHẠY LÀ THẤY SỰ KHÁC BIỆT
              window.scrollTo({
                top: 0,
                // behavior: 'smooth'
              });
            }}
            to={`/san-pham/${id}`}>
            <img className='w-full h-full object-contain' src={img} alt="" />
          </NavLink>
        </div>
        <div className="pt-[10px] px-[10px] pb-[20px] flex flex-col justify-center">
          <div className="mb-[10px] text-bgPrimary line-clamp-1 text-center">
            <NavLink
              onDragStart={(e) => e.preventDefault()}
              onMouseUp={(e) => e.preventDefault()}
              onClick={() => {
                if (setTranslateX) setTranslateX(0)
                if (setHoverSimilarProduct) setHoverSimilarProduct(false)
                if (setLoadingPage) setLoadingPage(true) //nguyên nhân có cái này là truyền từ Sản phẩm tương tự trong productDetail, lí do truyền là khi ấn vào, nó sẽ bị nháy ở sp hiện tại (loading car duchauý nó = false nên nó hiện cái cũ), vậy nên khi ấn vào minh set cho nó là true phát luôn để không bị nháy, THỬ BỎ DÒNG NÀY ĐI CHẠY LÀ THẤY SỰ KHÁC BIỆT
                window.scrollTo({
                  top: 0,
                  // behavior: 'smooth'
                });
              }}
              to={`/san-pham/${id}`}>
              {name}
            </NavLink>
          </div>
          <div className=" text-bgPrimary font-bold flex justify-center">
            {price}
            <p className='inline-block text-[14px] align-top ml-[2px]'>₫</p>
          </div>
          <div className=''>
            <ButtonPrimary
              loading={loading}
              onClick={() => {
                if (!logined) {
                  window.scroll({
                    top: 0,
                    behavior: 'smooth'
                  })
                  navigate('/dang-nhap')
                }
                else detectUser(handleDetectAdmin, handleAddToCart)()
              }}
              text={text} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductItem;