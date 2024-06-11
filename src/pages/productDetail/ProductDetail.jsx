import { Timestamp, addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { db } from '../../firebase/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCartShopping, faChevronLeft, faChevronRight, faCircleCheck, faMinus, faPlus, faStar, faTags, faTruckFast, faWrench } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAdmin, selectIsLoggedIn, selectUserID } from '../../redux-toolkit/slice/authSlice';
import CarLoading from '../../components/carLoading/CarLoading'
import { selectProducts } from '../../redux-toolkit/slice/productSlice';
import { Card, ProductItem } from '../../components';
import OverlayProduct from './OverlayProduct';
import { ADD_TO_CART } from '../../redux-toolkit/slice/cartSlice';
import { Skeleton, Spinning } from '../../animation-loading';
import { toast } from 'react-toastify';
import StarsRating from 'react-star-rate';

const solvePrice = (price) => {
  return Number(price).toLocaleString('vi-VN');
}

const ProductDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const userID = useSelector(selectUserID) || localStorage.getItem('userID')
  const logined = useSelector(selectIsLoggedIn) || JSON.parse(localStorage.getItem('logined'))
  //
  const [allReviews, setAllReviews] = useState([])
  //
  const [openOverlay, setOpenOverlay] = useState(false)
  const [activeImg, setActiveImg] = useState(0)
  //top prodcut show
  const [idxActive, setIdxActive] = useState(0)
  const [translateShowX, setTranslateShowX] = useState(0)
  const [hoverShowProduct, setHoverShowProduct] = useState(false)
  //bottom product
  const [translateX, setTranslateX] = useState(0)
  const [hoverSimilarProduct, setHoverSimilarProduct] = useState(false)

  const [loading, setLoading] = useState(true)
  const [loadingAddtoCart, setLoadingAddtoCart] = useState(false)
  const [product, setProduct] = useState({})
  const navigate = useNavigate()
  const admin = useSelector(selectIsAdmin) || JSON.parse(localStorage.getItem('admin'))
  const products = useSelector(selectProducts)

  const [quantity, setQuantity] = useState(1)

  const imgProductsPreview = [
    product.imgURL,
    product.imgPreviewURL1,
    product.imgPreviewURL2,
    product.imgPreviewURL3,
    product.imgPreviewURL4
  ].filter(item => item) //trả về item là trả về item nào mang giá trị trusy thôi nhé :v short syntax
  const similarProducts = products.filter((item) => !(item.category !== product.category || item.id === product.id))

  /////////////// SLIDE /////////////////
  // const wrapper = useRef(null)
  // const speed = 1; //tốc độ kéo sp
  // const [scrollLeft, setScrollLeft] = useState(0)
  // const [startX, setStartX] = useState()
  // const [isMouseDown, setIsMouseDown] = useState(false)

  // //ấn chuột
  // const handleDragStart = (e) => {
  //   setIsMouseDown(true)
  //   wrapper.current.style.cursor = 'grabbing'
  //   setStartX(e.pageX - wrapper.current.offsetLeft)
  //   setScrollLeft(wrapper.current.scrollLeft)
  // }

  // //lúc di chuột & thả chuột
  // const handleDragEnd = () => {
  //   setIsMouseDown(false)
  //   wrapper.current.style.cursor = 'grab'
  // }

  // const handleDragMove = (e) => {
  //   if (!isMouseDown) return;
  //   let afterX = e.pageX - wrapper.current.offsetLeft;
  //   let walk = (afterX - startX) * speed;
  //   wrapper.current.scrollLeft = scrollLeft - walk;
  // }
  ////////////////////////////////

  ////////////////////////////////
  const getProduct = async () => {
    console.log('get Product')
    setLoading(true)
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setProduct({
        id: id,
        ...docSnap.data()
      })

      if (admin) {
        localStorage.setItem('showProduct', JSON.stringify({
          id: id,
          ...docSnap.data()
        }))
      }
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    } else {
      // docSnap.data() will be undefined in this case
      // console.log("No such document!");
    }
  }

  const getReviews = async () => {
    const reviewsRef = query(collection(db, "reviews"),
      where('productID', "==", id));
    const q = query(reviewsRef);
    try {
      const querySnapshot = await getDocs(q);
      const allReviews = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      const allReviewsConverted = allReviews
        .sort((reviewA, reviewB) => (new Date(reviewB.creatAt)) - (new Date(reviewA.creatAt)))
      setAllReviews(allReviewsConverted)
    }
    catch (e) {
      console.log(e.message);
    }
  }

  const averageRate = () => {
    const totalRate = allReviews.reduce((total, review) => {
      return total + review.rate;
    }, 0)
    if (allReviews.length === 0) return 0
    return (totalRate / allReviews.length).toFixed(1)
  }

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

  const detectUser = (functionAdmin, functionUser, e) => {
    if (admin) return functionAdmin();
    return functionUser(e)
  }

  const handleDetectAdmin = () => {
    //chỉ admin mới cần set prevLinkEditProduct
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    localStorage.setItem('prevLinkEditProduct', `/san-pham/${id}`)
    navigate(`/admin/add-product/${id}`)
  }

  const handleAddToCart = async (e) => {
    if (!loadingAddtoCart) { //nếu đang quay thì không cho bấm
      e.preventDefault()
      setQuantity(1)
      // console.log(quantity);
      setLoadingAddtoCart(true)
      const productsRef = query(
        collection(db, "cartProducts"),
        where('userID', "==", userID), //id người dùng
        where('id', "==", id)); //id của sản phẩm
      const q = query(productsRef);
      try {
        const querySnapshot = await getDocs(q);
        //sản phẩm chưa có trong giỏ hàng, thêm vào với quantity là quantity(state)
        if (querySnapshot.docs.length === 0) {
          setTimeout(() => {
            try {
              const docRef = addDoc(collection(db, "cartProducts"), {
                ...product,
                userID: userID,
                quantity: quantity,
                addAt: Timestamp.now().toDate().toString()
              });
              //reset init
              //
              setLoadingAddtoCart(false)
              toast.success(`Thêm sản phẩm thành công`, {
                position: "top-left",
                autoClose: 1200
              })
            } catch (e) {
              console.log(e.message);
            }
          }, 1000)
        }
        else { //nếu nó đã tồn tại rồi thì tăng quantity lên quantity (ô input)
          const docRef = querySnapshot.docs[0].ref;
          const docSnapshot = await getDoc(docRef);
          const currentQuantity = docSnapshot.data().quantity;

          await updateDoc(docRef, {
            quantity: currentQuantity + quantity,
          });
          setQuantity(1)
          setLoadingAddtoCart(false)
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

  useEffect(() => {
    window.scrollTo({
      top: 0,
    })
    getProduct() //lấy ra sản phẩm đó lúc vào trang
    getReviews()
  }, [id]) //param là id để xử lí việc vẫn ở trang đó nhưng bấm vào sản phẩm khác (ở Sản phẩm tương tự cuối trang) thì nó phải re-render lại để hiển thị, nếu k có cái này thì hình ảnh vẫn là của sản phẩm trước

  useEffect(() => {
    setIdxActive(translateShowX / 584)
    //
    if (translateShowX < 0) setTranslateShowX((imgProductsPreview.length - 1) * 584)
    else if (translateShowX > (imgProductsPreview.length - 1) * 584) setTranslateShowX(0)
  }, [translateShowX])

  return (
    <>
      <OverlayProduct
        activeImg={activeImg}
        openOverlay={openOverlay}
        setOpenOverlay={setOpenOverlay}
        imgProductsPreview={imgProductsPreview}>
        <div>
          {/* top */}
          <div className="w-full">
            <div className="w-full h-full py-10">
              <div className="max-w-[1230px] h-full mx-auto px-[15px] flex gap-8">
                {/* left  */}
                <div className={`flex-1 ${openOverlay && 'pointer-events-none select-none'}`}>
                  <div
                    onMouseEnter={() => (!loading && setHoverShowProduct(true))}
                    onMouseLeave={() => (!loading && setHoverShowProduct(false))}
                    className="relative mb-4 w-[584px] h-[425px] overflow-hidden whitespace-nowrap">
                    <button
                      className={`${hoverShowProduct ? '' : 'left-2 opacity-0'} hover:text-primary outline-none py-8 px-4 absolute cursor-pointer left-0 top-1/2 translate-y-[-50%] z-30 transition-all ease-in-out duration-500 ${imgProductsPreview.length === 1 ? 'hidden' : ''}`}
                      onClick={() => { setTranslateShowX(translateShowX - 584) }}>
                      <FontAwesomeIcon className='text-[36px]' icon={faChevronLeft} />
                    </button>
                    <Skeleton loading={loading} className='overflow-hidden' rounded='rounded-sm' height='h-full'>
                      <div
                        style={{
                          transform: `translateX(-${translateShowX}px)`
                        }}
                        className='h-full transition-all ease-in-out duration-300'>
                        {imgProductsPreview.map((imgProduct, idx) => (
                          <img
                            key={idx}
                            onClick={async () => {
                              await new Promise((resolve) => {
                                window.scroll({
                                  top: 0,
                                  behavior: 'smooth'
                                })
                                resolve()
                              })
                              setActiveImg(idx)
                              setOpenOverlay(true)
                            }}
                            className='inline-flex w-[584px] h-full cursor-pointer object-contain' src={imgProduct} alt="" />
                        ))}
                      </div>
                    </Skeleton>
                    <button
                      className={`${hoverShowProduct ? '' : 'right-2 opacity-0'} hover:text-primary outline-none py-8 px-4 absolute cursor-pointer right-0 top-1/2 translate-y-[-50%] z-30 transition-all ease-in-out duration-500 ${imgProductsPreview.length === 1 ? 'hidden' : ''}`}
                      onClick={() => { setTranslateShowX(translateShowX + 584) }}>
                      <FontAwesomeIcon className='text-[36px]' icon={faChevronRight} />
                    </button>
                  </div>

                  <div className="w-full h-[70px] min-[1024px]:h-[95px] mb-6">
                    {/* fix height cứng để slide nè, responsive cẩn thận nhé */}
                    <div className="w-[584px] h-full cursor-grab overflow-hidden whitespace-nowrap">
                      {(imgProductsPreview.length === 0
                        ? Array(5).fill()
                        : imgProductsPreview).map((imgProduct, idx) => (
                          <div
                            onClick={() => {
                              setIdxActive(idx)
                              setTranslateShowX(idx * 584)
                            }}
                            key={idx}
                            className={`inline-flex ${idx > 0 ? 'pl-[10px]' : ''} w-1/5 h-full`}>
                            <Skeleton className='overflow-hidden' loading={loading} rounded='rounded-[4px]' width='w-full'>
                              <img
                                className={`cursor-pointer border-[2px] rounded-[4px] ${idxActive === idx ? 'border-bgPrimary' : ' border-[#aaa] opacity-40'} h-full inline-block w-full object-contain transition-all ease-in-out duration-150 `}
                                src={imgProduct || ''}
                                alt="" />
                            </Skeleton>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* right */}
                <div className="flex-1 pb-[30px]">
                  <nav className='text-[#94949e] uppercase text-[14px]'>
                    <Skeleton className='overflow-hidden' loading={loading} rounded='rounded-[4px]'>
                      <NavLink className='transition-all ease-linear duration-100 hover:text-bgPrimary hover:opacity-70mb-2' to='/'>Trang chủ</NavLink>
                      <div className="mx-2 inline-block">/</div>
                      <NavLink
                        to={`/${product.category}`}
                        className='transition-all ease-linear duration-100 hover:text-bgPrimary hover:opacity-70mb-2'>{solveCategory(product.category)}</NavLink>
                    </Skeleton>
                  </nav>
                  <div className={`${loading && 'mt-[14px] mb-[14px]'}`}>
                    <Skeleton className='overflow-hidden' loading={loading} rounded='rounded-[4px]'>
                      <h1 className='text-[28px] text-bgPrimary font-semibold'>
                        {product.name || 'Day la ten san pham de chay skeleton'}
                      </h1>
                    </Skeleton>
                  </div>
                  <Skeleton
                    loading={loading} className='inline-flex overflow-hidden' rounded='rounded-[4px]'>
                    <div className="inline-flex gap-3">
                      <div className="">
                        <FontAwesomeIcon className='text-[#f9dc4b] text-[18px] mr-2' icon={faStar} />
                        <p className='inline-block text-[#767676] font-medium'>
                          {averageRate() || 0}
                        </p>
                      </div>
                      <div className="w-[2px] bg-[#e6e6e6]"></div>
                      <p className='text-[#767676] font-medium'>{allReviews.length} Đánh giá</p>
                    </div>
                  </Skeleton>
                  <Skeleton loading={loading} className='mt-5 mb-4 overflow-hidden'>
                    <div className={`flex items-center gap-3 ${loading && 'mt-5 mb-4'}`}>
                      {/* cái đề để tránh flex nó làm cho height tăng theo thằng con dài nhất mà mình chỉ muốn nó py-1 theo font thui */}
                      <div className="">
                        <div className="inline-flex rounded-[12px] items-center gap-1 w-auto bg-[#6ab87e]/20 py-1 px-2">
                          <FontAwesomeIcon className='text-[#6ab87e] text-[14px]' icon={faTags} />
                          <p className='text-[#6ab87e] font-medium text-[14px]'>50%</p>
                        </div>
                      </div>
                      <p className="inline-block line-through text-[#aaa] text-[16px]">
                        {solvePrice(Math.floor(product.price * 2))}
                        <span className='text-[14px] align-top'>₫</span>
                      </p>
                      <p className="inline-block font-semibold text-[26px] text-bgPrimary">
                        {solvePrice(product.price)}
                        <span className='text-[22px] align-top'>₫</span>
                      </p>
                    </div>
                  </Skeleton>
                  <Skeleton loading={loading} className='my-[10px] h-[8px] inline-block overflow-hidden'>
                    <div className="w-[50px] h-[2px] bg-black/20"></div>
                  </Skeleton>
                  <Skeleton loading={loading} className='mb-[20px] overflow-hidden'>
                    <div className={`${!loading && 'mb-[20px]'} grid grid-cols-5 items-start`}>
                      <div className="col-span-1 mb-3 font-medium text-[18px] text-[#1b1b1b] inline-flex items-center gap-3">
                        <p className=''>Vận chuyển</p>
                      </div>
                      <div className='col-span-4 inline-flex flex-col'>
                        <div className="flex gap-2">
                          <FontAwesomeIcon className='text-[#00c7a3] text-[18px] mt-1' icon={faTruckFast} />
                          <p className='text-[16px] font-medium'>Miễn phí vận chuyển</p>
                        </div>
                        <p className='text-[16px] opacity-80 ml-[30px]'>Miễn phí vận chuyển cho đơn hàng trên 850.000₫</p>
                      </div>
                    </div>
                  </Skeleton>
                  <Skeleton loading={loading} className='mb-[20px] overflow-hidden'>
                    <div className={`${!loading && 'mb-[20px]'} grid grid-cols-5 items-center`}>
                      <div className="col-span-1 mb-3 font-medium text-[18px] text-[#1b1b1b] inline-flex items-center gap-3">
                        <p className=''>Số lượng</p>
                      </div>
                      {/* input */}
                      <div className='col-span-1 inline-flex'>
                        <div className="flex items-center justify-center gap-6 px-3 py-1 border border-[#ccc] font-bold">
                          <button
                            onClick={() => {
                              if (quantity > 1) setQuantity(quantity - 1)
                            }}
                            type='button' className='flex items-center outline-none text-bgPrimary font-medium '>
                            <FontAwesomeIcon className='text-[24px] font-medium' icon={faMinus} />
                          </button>
                          <div
                            value={quantity}
                            className='text-bgPrimary outline-none text-center text-[18px] font-medium' > {quantity < 10 ? `0${quantity}` : quantity}
                          </div>
                          <button
                            onClick={() => {
                              //chỉ đc set đến max số lượng tồn kho
                              setQuantity(quantity + 1)
                            }}
                            type='button' className='flex items-center outline-none text-bgPrimary font-medium '>
                            <FontAwesomeIcon className='text-[24px] font-medium' icon={faPlus} />
                          </button>
                        </div>
                      </div>
                      <div className="col-span-2 flex gap-2 ml-4 items-center">
                        <div className="w-[2px] h-6 bg-[#e6e6e6]"></div>
                        <p className='text-[#767676] opacity-80 font-medium'>{product.inventory} sản phẩm có sẵn</p>
                      </div>
                    </div>
                  </Skeleton>
                  {/* <div className="mb-[15px]">
                    <p className='font-medium text-[18px] text-[#1b1b1b] mb-3'>

                    </p>
                  </div> */}
                  <Skeleton loading={loading} className='inline-block mb-[25px] w-[373px] h-[46px] overflow-hidden'>
                    <div className={`${!loading && 'mb-[25px]'} inline-grid grid-cols-12 gap-6 w-[373px] h-[46px]`}>
                      <button
                        onClick={(e) => {
                          if (!logined) navigate('/dang-nhap')
                          else detectUser(handleDetectAdmin, handleAddToCart, e)
                        }}
                        className='col-span-7 h-full px-3 bg-primary text-white text-[16px] leading-[37px] font-bold tracking-[1px] uppercase transition-all ease-in duration-150 focus:outline-none hover:bg-[#a40206]'>
                        {loadingAddtoCart
                          ? <Spinning />
                          : (admin
                            ? <div className="flex gap-2 items-center justify-center">
                              <FontAwesomeIcon className='text-[18px]' icon={faWrench} />
                              Sửa sản phẩm
                            </div>
                            : <div className="flex gap-2 items-center justify-center">
                              <FontAwesomeIcon className='text-[18px]' icon={faCartShopping} />
                              Thêm vào giỏ
                            </div>)}
                      </button>
                    </div>
                  </Skeleton>
                  <Skeleton loading={loading} className={loading && 'overflow-hidden'}>
                    <div className="w-full py-4 px-6 shadow-shadowHover">
                      <p className="font-bold text-[18px] leading-[22px] mt-1 mb-5">Quyền lợi khách hàng & Bảo hành</p>
                      <div className="inline-flex gap-2 my-2">
                        <FontAwesomeIcon className='text-[#6ab87e] text-[22px]' icon={faCircleCheck} />
                        <p className='text-[16px] font-bold'>Chính sách hoàn trả của ShoesPlus</p>
                      </div>
                      <p className='text-[16px] ml-[30px]'>Trả hàng hoàn tiền trong vòng 48 giờ cho các sản phẩm bị lỗi kỹ thuật, bể vỡ, không đúng mô tả hoặc không đúng như đơn đặt hàng.</p>

                      <div className="inline-flex gap-2 my-2">
                        <FontAwesomeIcon className='text-[#6ab87e] text-[22px]' icon={faCircleCheck} />
                        <p className='text-[16px] font-bold'>Chính sách bảo hành của ShoesPlus</p>
                      </div>
                      <p className='text-[16px] ml-[30px]'>Bảo hành bao gồm các lỗi do nhà sản xuất như lỗi về chất liệu, lỗi thiết kế. Không bao gồm các lỗi do sử dụng sai cách hoặc tai nạn gây ra.</p>
                    </div>
                  </Skeleton>
                </div>
              </div>
            </div>
          </div>

          {/* bottom */}
          {!loading && (
            <div className="w-full">
              <div className="max-w-[1230px] h-full px-[15px] mx-auto">
                {/* thong tin bo sung */}
                <div className="w-full h-full pt-[36px] pb-[8px] border border-transparent border-t-[#ddd]">
                  <div className="w-full h-full p-[20px] border border-[#ddd]">
                    <div className="pb-[8px]">
                      <h1 className='font-bold text-[18px] leading-[32px] text-[#1c1c1c] uppercase'>Thông tin bổ sung</h1>
                    </div>
                    <div className="w-[50px] h-[3px] mt-1 mb-3 bg-red-600"></div>
                    <div className="flex flex-col w-full">
                      <div className="grid grid-cols-12 justify-between py-[12px] border border-transparent border-b-[#ddd]">
                        <h1 className='col-span-3 font-bold text-[14px] uppercase leading-[15x] text-[#353535]'>Danh mục</h1>
                        <p className='col-span-9 leading-[24px] text-[#666]'>{solveCategory(product.category)}</p>
                      </div>
                      <div className="grid grid-cols-12 justify-between py-[12px] border border-transparent border-b-[#ddd]">
                        <h1 className='col-span-3 font-bold text-[14px] uppercase leading-[15x] text-[#353535]'>Thương hiệu</h1>
                        <p className='col-span-9 leading-[24px] text-[#666]'>{solveBrand(product.brand)}</p>
                      </div>
                      <div className="grid grid-cols-12 justify-between pt-[12px]">
                        <h1 className='col-span-3 font-bold text-[14px] uppercase leading-[15x] text-[#353535]'>Mô tả sản phẩm</h1>
                        <p className='col-span-9 leading-[24px] text-[#666]'>{product.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* danh gia */}
                <div className="w-full h-full py-[20px] mt-2">
                  <div className="w-full h-full p-[20px] border border-[#ddd]">
                    <div className="pb-2">
                      <h1 className='font-bold text-[18px] leading-[32px] text-[#1c1c1c] uppercase'>Đánh giá sản phẩm</h1>
                    </div>
                    <div className="w-[50px] h-[3px] my-2 bg-red-600"></div>
                    <div className="flex flex-col w-full">
                      {/* no have comment */}
                      {/* <div className="w-full min-h-[200px] flex flex-col gap-4 items-center justify-center">
                      <img src="../../noHaveComment.png" alt="" />
                      <p className='text-[18px] font-medium opacity-75'>Chưa có đánh giá</p>
                    </div> */}
                      {/*comment */}
                      {allReviews.length === 0
                        ? <div className="w-full flex flex-col gap-4 items-center justify-center">
                          <img
                            className=''
                            src="../../noHaveComment.png" alt="" />
                          <p className='text-[17px] text-center'>Hiện chưa có đánh giá nào</p>
                        </div>
                        : (
                          <div className="">
                            {allReviews.map((review, idx) => {
                              return (
                                <div
                                  key={idx}
                                  className={`flex gap-4 pt-5 ${idx < allReviews.length - 1 ? 'border border-transparent border-b-[#ddd] pb-8' : ''}`}>
                                  <div className="w-[50px] h-[50px] rounded-full border border-[#ddd] overflow-hidden">
                                    {/* phải xử lí nếu nó không có avatar thì cho avatar mặc định */}
                                    <img className='w-full h-full object-contain'
                                      src={review.imgAvatar}
                                      alt="" />
                                  </div>
                                  <div className="flex-1 flex flex-col">
                                    <span className='font-medium'>{review.displayName}</span>
                                    <div className="text-[14px] detail-product-star">
                                      <StarsRating
                                        disabled
                                        value={review.rate}
                                      />
                                    </div>
                                    <div className="text-black opacity-50 text-[14px] mt-2">
                                      {`${review.orderDate} ${review.orderTime} | Phân loại hàng: ${solveCategory(product.category)}`}
                                    </div>
                                    <div className="mt-2  ">{review.typeReview}</div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                {/* sp tuong tu */}
                <div className="w-full h-full pt-4 pb-[20px]">
                  <div className="w-full h-full">
                    <div className="ml-5 pb-[8px]">
                      <h1 className='font-bold text-[18px] leading-[32px] text-[#1c1c1c] uppercase'>Sản phẩm tương tự</h1>
                    </div>
                    <div className="ml-5 w-[50px] h-[3px] mt-1 mb-5 bg-red-600"></div>

                    <div
                      onMouseEnter={() => setHoverSimilarProduct(true)}
                      onMouseLeave={() => setHoverSimilarProduct(false)}
                      className="w-full relative">
                      {/* icon left */}
                      <div
                        // 240 là width của từng phần tử, nếu responsive thì thay đổi đi
                        //tức là mỗi lần nhấn thì sang trái 1 phần tử (240px)
                        onClick={() => setTranslateX(translateX - 240)}
                        className={`absolute ${hoverSimilarProduct ? 'w-[60px] h-[60px] shadow-shadowAuth' : 'w-[46px] h-[46px] shadow-shadowAccount'} bg-white text-bgPrimary rounded-full left-[-22px] top-1/2 translate-y-[-60%] flex items-center justify-center cursor-pointer transition-all ease-in-out duration-200 z-30 ${translateX === 0 ? 'hidden' : ''}`}>
                        <FontAwesomeIcon className='text-[20px]' icon={faArrowLeft} />
                      </div>
                      {/* main */}
                      <div className="overflow-hidden whitespace-nowrap h-[309px]">
                        <div
                          style={{
                            transform: `translateX(-${translateX}px)`
                          }}
                          className="w-full transition-all ease-linear duration-300">
                          {similarProducts.map((item, idx) => (
                            <div
                              key={idx}
                              // nếu trên điện thoại thì đổi w-1/5 thành w-1/3 hoặc w-1/2 nhé
                              className="inline-flex w-1/5 px-[10px] pb-5 h-full select-none">
                              <Card width='w-full' >
                                <ProductItem
                                  product={item}
                                  id={item.id}
                                  img={item.imgURL}
                                  name={item.name}
                                  price={solvePrice(item.price)}
                                  idURL={`san-pham/${id}`} //prevLink là id của cái trang hiện tại chứa sp, chứ kp item.id nhé
                                  setLoadingPage={setLoading}
                                  //top
                                  setIdxActive={setIdxActive}
                                  setHoverShowProduct={setHoverShowProduct}
                                  setTranslateShowX={setTranslateShowX}
                                  //2 thằng set bên dưới là xử lí khi ấn vào 1 sp ở similar Products qua sp đó rùi, nhưng nếu không set về 0 và về false thì qua sp mới nó vẫn bị như lúc cũ, bỏ ra chạy thử là biết
                                  setTranslateX={setTranslateX}
                                  setHoverSimilarProduct={setHoverSimilarProduct}
                                  text={admin ? 'Sửa sản phẩm' : 'Thêm vào giỏ'}
                                />
                              </Card>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* icon right */}
                      <div
                        // 240 là width của từng phần tử, nếu responsive thì thay đổi đi
                        //tức là mỗi lần nhấn thì sang phải 1 phần tử (240px)
                        onClick={() => setTranslateX(translateX + 240)}
                        className={`absolute ${hoverSimilarProduct ? 'w-[60px] h-[60px] shadow-shadowAuth' : 'w-[46px] h-[46px] shadow-shadowAccount'} bg-white text-bgPrimary rounded-full right-[-22px] top-1/2 translate-y-[-60%] flex items-center justify-center cursor-pointer transition-all ease-linear duration-200 z-30 ${translateX === (similarProducts.length - 5) * 240 ? 'hidden' : ''}`}>
                        <FontAwesomeIcon className='text-[18px]' icon={faArrowRight} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </OverlayProduct>
    </>
  );
};

export default ProductDetail;