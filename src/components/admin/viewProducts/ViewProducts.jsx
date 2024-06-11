import { faEdit, faSearch, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { collection, deleteDoc, doc, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Spinning } from '../../../animation-loading';
import { db, storage } from '../../../firebase/config';
import Pagination from '../../pagination/Pagination';
import { useNavigate } from 'react-router-dom';
import { deleteObject, ref } from 'firebase/storage';
import { useDispatch, useSelector } from 'react-redux';
import Notiflix from 'notiflix';
import { STORE_PRODUCTS, selectProducts } from '../../../redux-toolkit/slice/productSlice';
import "../../lineClamp.scss"
import { selectUserID } from '../../../redux-toolkit/slice/authSlice';

const ViewProducts = () => {
  const itemsPerPage = 3;
  const quantity = 5;

  const [loading, setLoading] = useState(false);

  const filterRef = useRef()
  const queryRef = useRef()

  const [notFound, setNotFound] = useState(false);
  const [searchByName, setSearchByName] = useState('');
  const [products, setProducts] = useState([]); //all products

  const [currentPage, setCurrentPage] = useState(1)
  const [pageProducts, setPageProducts] = useState([]); //products every page (use slice to cut all products)
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const productsRedux = useSelector(selectProducts)
  const userID = useSelector(selectUserID) || localStorage.getItem('userID')

  //thật ra đã lấy đc tất cả sản phẩm từ firebase về ở lúc vào web rồi nhưng vẫn để getProducts ở đây nữa để làm cái laoding cho nó đẹp :v chứ vào cái hiện luôn ra thì xấu hihi
  const getProducts = async () => {
    setLoading(true)
    // const productsRef = query(collection(db, "products"), where("name", "==", 'Chuck Taylor All'));
    const productsRef = collection(db, "products");
    const q = query(productsRef, orderBy('creatAt', 'desc'));
    try {
      const querySnapshot = await getDocs(q);
      const allProducts = querySnapshot.docs.map((doc) => {
        // const productItem = Object.assign({}, doc.data(), { creatAt: doc.data().creatAt.toString() })
        return {
          id: doc.id,
          ...doc.data()
        }
      })

      //vì createAt lúc tạo sp là dạng string :v thì nếu tạo ngày 14 sẽ bị nhỏ hơn ngày 3 (so sánh string mà) nên phải convert về Date
      const allProductsConverted = allProducts
        .sort((productA, productB) => (new Date(productB.creatAt)) - (new Date(productA.creatAt)))
      //init
      setProducts(allProductsConverted)
      setPageProducts(allProductsConverted.slice(0, itemsPerPage))
      setLoading(false)
      //save products to redux
      dispatch(STORE_PRODUCTS(allProductsConverted))
    }
    catch (e) {
      toast.error(e.message, {
        autoClose: 1000
      })
    }
  }

  //...img này bao gồm 1 img và 4 img preview
  const confirmDelete = (id, ...img) => {
    Notiflix.Confirm.show(
      'Xóa sản phẩm',
      'Bạn có muốn xóa sản phẩm này ?',
      'Xóa',
      'Hủy bỏ',
      function okCb() {
        handleDeleteProduct(id, img)
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

  //hàm này để xóa đi sản phẩm trong Cart Product
  const handleDeleteCartProduct = async (idProduct) => {
    const productsRef = query(collection(db, "cartProducts"))
    const q = query(productsRef);
    try {
      const querySnapshot = await getDocs(q);
      // console.log(querySnapshot.docs);
      const allIdCartProductsDelete = querySnapshot.docs.filter((doc) => doc.data().id === idProduct)
      // console.log(allIdCartProductsDelete);
      Promise.all(
        allIdCartProductsDelete.map(async (idCartProductsDelete) => {
          try {
            await deleteDoc(doc(db, "cartProducts", idCartProductsDelete.id));
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

  const handleDeleteProduct = async (id, img) => {
    try {
      await deleteDoc(doc(db, "products", id));

      try {
        await handleDeleteCartProduct(id); //khi xóa 1 sản phẩm thì xóa luôn cả cartProduct (những sản phẩm trong giỏ hàng)
      } catch (e) {
        console.log(e.message);
      }
      if (img) { //delete image (neu co anh thi moi xoa, co TH add product nhung k add anh)
        img.forEach(async (item) => {
          if (item) {
            const desertRef = ref(storage, item);
            await deleteObject(desertRef)
          }
        })
      }

      //set lại products trên locaStorage và trên redux
      console.log(([...productsRedux].filter(product => product.id !== id)));
      dispatch(STORE_PRODUCTS([...productsRedux].filter(product => product.id !== id)))
      localStorage.setItem('products', JSON.stringify([...productsRedux].filter(product => product.id !== id)))

      //reset default
      filterRef.current.value = 'default'
      queryRef.current.value = 'default'

      let newProducts;
      //khi mà products tức cả toàn trang chỉ có 1 sản phẩm
      //có 2 TH, 1 là cả shop chỉ còn 1 sp rồi ấn xóa, cái này lười kh solve :V
      //2 là khi search ra 1 sp, ấn xóa phải reset về trang đầu tiên
      // console.log(products.length);
      if (products.length === 1) {
        newProducts = [...productsRedux].filter(product => product.id !== id)
        setCurrentPage(1)
        setProducts(newProducts)
        setPageProducts(newProducts.slice(0, itemsPerPage))
      }
      else {
        newProducts = products.filter(product => product.id !== id)
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, newProducts.length);
        //nếu 1 sp ở 1 trang, ấn xóa thì số trang phải lùi về 1
        if (startIndex > newProducts.length - 1) setCurrentPage(currentPage - 1)
        setProducts(newProducts);
        setPageProducts(newProducts.slice(startIndex, endIndex));
      }

      toast.success('Xóa sản phẩm thành công', {
        autoClose: 1000
      })
    } catch (e) {
      toast.error(e.message, {
        autoClose: 1000
      })
      // toast.error('Sản phẩm đã bị xóa', {
      //   autoClose: 1000
      // })
    }
  }

  const handleSearchByName = (e) => {
    console.log(productsRedux);
    e.preventDefault()
    //reset input and query
    setCurrentPage(1)
    setSearchByName('');
    filterRef.current.value = 'default'
    queryRef.current.value = 'default'

    const searchProducts = productsRedux.filter(product => product.name.toLowerCase().includes(searchByName.toLowerCase()))
    // console.log('searchProducts: ', searchProducts);

    //vì thằng getProducts là async nên chưa kịp get về thì nó đã chạy handleSearchByName rồi nên phải có điều kiện products.length !== 0 (sản phẩm đâ được get về)
    if (searchProducts.length === 0 && products.length !== 0) {
      setNotFound(true)
      return;
    }

    //Có 2 TH searchByName bị rỗng: 1 là khi mới vào thì searchByName == "", 2 là khi nhập xong xóa thì searchByName == ""
    // 1. Nếu sản phẩm đã get về thành công và nhập vào ô search by name, mà có searchProducts.length > 0 thì hiển thị
    // 2. Nếu sản phẩm đã get về thành công và nhập vào ô search by name XONG XÓA đi làm cho ô search bị rỗng, mà có searchProducts.length > 0 thì hiển thị
    else if (searchByName !== "" && products.length !== 0 && searchProducts.length > 0
      || (searchByName === "" && searchProducts.length > 0)) {
      setProducts(searchProducts)
      setNotFound(false)
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

  const handleFilterProduct = (e) => {
    if (e.target.value !== 'default') {
      queryRef.current.value = 'default'
      setNotFound(false)
      setCurrentPage(1)
      if (e.target.value == 'all') setProducts(productsRedux)
      else setProducts([...productsRedux].filter(item => (item.brand === e.target.value)));
    }
  }

  const handleQueryProduct = (e) => {
    if (e.target.value !== 'default') {
      const { field, order } = solveQuery(e.target.value)
      if (field === 'creatAt') {
        setProducts([...products].sort((a, b) => {
          if ((new Date(a[field])) > (new Date(b[field]))) return order
          return (order) * (-1)
        }));
      }
      else {
        setProducts([...products].sort((a, b) => {
          if (a[field] > b[field]) return order
          return (order) * (-1)
        }));
      }
    }
  }

  useEffect(() => {
    getProducts()
  }, [])

  return (
    <>
      <div className='w-full'>
        <span className='text-bgPrimary block text-[16px] mb-4'>
          <p className='font-bold inline-block text-[16px]'>Số lượng</p>
          : {notFound ? "0" : products.length} sản phẩm
        </span>
        <div className='border border-transparent pb-6 border-b-[#bbb] flex justify-between items-center'>
          <div className="">
            <select
              ref={filterRef}
              onChange={handleFilterProduct}
              className='outline-none float-left bg-slate-100 px-3 py-2 text-bgPrimary cursor-pointer border border-solid border-[#ddd] shadow-shadowSearch'
              name="sort-by" id="">
              <option key='0' value="default">Lọc sản phẩm theo</option>
              <option key='1' value="all">Tất cả</option>
              <option key='2' value="classic">Classic</option>
              <option key='3' value="sunbaked">Sunbaked</option>
              <option key='4' value="chuck-07s">Chuck 07S</option>
              <option key='5' value="one-star">One Star</option>
              <option key='6' value="psy-kicks">PSY Kicks</option>
            </select>
          </div>
          <form
            onSubmit={handleSearchByName}
            className="flex gap-4 items-center">
            <div className="px-[15px] overflow-hidden inline-flex gap-2 items-center border border-solid border-bgPrimary ">
              <input
                required
                value={searchByName}
                onChange={(e) => setSearchByName(e.target.value)}
                className='block py-[6px] text-[16px] text-bgPrimary outline-none'
                placeholder='Tìm kiếm theo tên'
                autoComplete='off'
                type="text" name="" id="" />
            </div>
            <button
              type='submit'
              className='text-white  bg-bgPrimary opacity-80 hover:opacity-100 transition-all ease-linear duration-300 px-4 py-[8px] text-[16px]'>
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>
          <div className="">
            <select
              ref={queryRef}
              onChange={handleQueryProduct}
              className='outline-none float-right bg-slate-100 px-3 py-2 text-bgPrimary cursor-pointer border border-solid border-[#ddd] shadow-shadowSearch'
              name="sort-by" id="">
              <option key='0' value="default">Sắp xếp sản phẩm theo</option>
              <option key='1' value="latest">Mới nhất</option>
              <option key='2' value="oldest">Cũ nhất</option>
              <option key='3' value="lowest-price">Giá tăng dần</option>
              <option key='4' value="highest-price">Giá giảm dần</option>
              <option key='5' value="a-z">A - Z</option>
              <option key='6' value="z-a">Z - A</option>
            </select>
          </div>
        </div>

        {
          notFound
            ? <div className='flex flex-col items-center'>
              <img
                className='w-[350px] object-cover'
                src="../../notFound.jpg" alt=""
              />
              <h1 className='text-[20px] text-center text-bgPrimary'>Không tìm thấy sản phẩm phù hợp</h1>
            </div>
            : <>
              <div
                style={{
                  height: `${itemsPerPage * 148 + 20}px`
                }}
                className="w-full text-bgPrimary">
                {loading
                  ? <Spinning color='#1f2028' size='28px' />
                  : (
                    <table className='w-full'>
                      <thead>
                        <tr
                          className='border border-transparent border-b-[#bbb] grid gap-5 grid-cols-12 mb-4 text-[16px] font-bold py-[10px]'>
                          <td className='col-span-1'>Thứ tự</td>
                          <td className='col-span-5'>Thông tin sản phẩm</td>
                          <td className='col-span-2'>Phân loại</td>
                          <td className='col-span-2'>Giá</td>
                          <td className='col-span-2'>Thao tác</td>
                        </tr>
                      </thead>
                      <tbody>
                        {pageProducts.map((product, idx) => (
                          <tr
                            key={product.id}
                            className='grid gap-5 grid-cols-12 mb-4 rounded-[4px] py-[10px] shadow-md'>
                            <td className='col-span-1 flex items-center justify-center'>
                              <span className='text-[18px] font-medium'>
                                {(idx + 1) + itemsPerPage * (currentPage - 1)}
                              </span>
                            </td>
                            <td className='col-span-5 grid grid-cols-7 gap-4'>
                              <img
                                onClick={() => navigate(`/san-pham/${product.id}`)}
                                className='col-span-3 rounded-[4px] h-[100px] w-full object-cover cursor-pointer'
                                src={product.imgURL} alt="" />
                              <div className="col-span-4 flex flex-col mt-4">
                                <span
                                  onClick={() => navigate(`/san-pham/${product.id}`)}
                                  className='text-[18px] font-medium text-bgPrimary line-clamp-1 cursor-pointer'>{product.name}</span>
                                <span className='text-[#888] line-clamp-2 text-[16px]'>{product.desc}</span>
                              </div>
                            </td>
                            <td className='col-span-2 flex items-center'>
                              <span className='text-[16px] bg-[#d9d6d6] rounded-[4px] px-2 py-1'>{solveCategory(product.category)}</span>
                            </td>
                            <td className='col-span-2 flex items-center'>
                              <span className='text-[16px] font-medium'>
                                {solvePrice(product.price)}
                                <p className='inline-block text-[16px] align-top ml-[2px]'>₫</p>
                              </span>
                            </td>
                            <td className='col-span-2 flex items-center gap-5'>
                              <button
                                onClick={() => {
                                  navigate(`/admin/add-product/${product.id}`)
                                  localStorage.setItem('prevLinkEditProduct', '/admin/view-products/')
                                  localStorage.setItem('showProduct', JSON.stringify(product))
                                }}>
                                <FontAwesomeIcon className='text-[18px] cursor-pointer text-bgPrimary hover:text-green-600 transition-all ease-linear duration-100' icon={faEdit} />
                              </button>
                              <button
                                onClick={() => confirmDelete(product.id, product.imgURL, product.imgPreviewURL1, product.imgPreviewURL2, product.imgPreviewURL3, product.imgPreviewURL4)}
                                className=''>
                                <FontAwesomeIcon className='text-[18px] cursor-pointer text-bgPrimary hover:text-primary transition-all ease-linear duration-100' icon={faTrashAlt} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
              </div>

              {!loading &&
                (<div className="">
                  <Pagination
                    products={products}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    quantity={quantity}
                    setPageProducts={setPageProducts} />
                </div>)
              }
            </>
        }

      </div>
    </>
  );
};

export default ViewProducts;