import { addDoc, collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Spinning } from '../../../animation-loading';
import { db, storage } from '../../../firebase/config';
import InputForm from '../../inputForm/InputForm';
import UploadSquare from './UploadSquare';
import { useNavigate, useParams } from 'react-router-dom';
import { selectProducts, STORE_PRODUCTS } from '../../../redux-toolkit/slice/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faPlus, faWrench } from '@fortawesome/free-solid-svg-icons';

const initializeFireBase = {
  name: "",
  imgURL: "",
  price: 0,
  inventory: 0,
  category: "", //neu khong chon thi de default la giay nam
  brand: "", //neu khong chon thi de default la Classic
  desc: "",
  //day la link img tren firebase, khong phai link img khi upload len giao dien
  imgPreviewURL1: "",
  imgPreviewURL2: "",
  imgPreviewURL3: "",
  imgPreviewURL4: "",
}

//src đây là link ảnh, tại sao phải để ở thằng cha là vì khi thêm sản phẩm xong, phải setSrc về rỗng để ảnh ở trong khung biến mất
const initializeSrc = {
  imgURL: null,
  imgPreviewURL1: null,
  imgPreviewURL2: null,
  imgPreviewURL3: null,
  imgPreviewURL4: null,
}

const AddProduct = () => {

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch();
  //
  const { id } = useParams()
  // console.log('id: ', id);
  const products = useSelector(selectProducts)

  const prevLink = localStorage.getItem('prevLinkEditProduct')
  const showProduct = JSON.parse(localStorage.getItem('showProduct'))

  //lí do tại sao lại cần lưu products trên local: Khi ấn vào edit sản phẩm thì chắc chắn phải ở View Products thì mới ấn đc đúng k, khi ở view thì products sẽ đc tải trên firebase. NHƯNG, nếu như đang ở 1 link sửa sản phẩm vd:  http://localhost:3000/admin/add-product/ZvCAHm5iTRonenNuX63g mà lại đi ấn reload lại trang, thì lúc này products lại k đc tải mất r, vì nó đang ở Add Product với id là ZvCAHm5iTRonenNuX63g do đó dẫn tới product.name. product.imgURL,... bị lỗi, nên phải lưu trên local strogate để phòng tránh TH này, về sau lưu trên server thì chắc k bị lỗi nàyx
  const productEdit = showProduct || products?.find(item => item.id === id)

  const [src, setSrc] = useState(detectForm(id, initializeSrc, {
    imgURL: productEdit?.imgURL,
    imgPreviewURL1: productEdit?.imgPreviewURL1,
    imgPreviewURL2: productEdit?.imgPreviewURL2,
    imgPreviewURL3: productEdit?.imgPreviewURL3,
    imgPreviewURL4: productEdit?.imgPreviewURL4,
  }))
  const [product, setProduct] = useState(detectForm(id, initializeFireBase, productEdit))

  //tại sao phải cần thằng useEffect này ? vì khi ấn vào edit -> chuyển qua edit, sau đó ấn vào 'Thêm sản phẩm' thì src với product không bị chạy lại cái logic bên trong useState để khởi tạo lại giá trị là rỗng (do ở trang edit với trang add đểu là đang ở component AddProduct vậy nên nó không bị re-render lại khi chuyển qua lại giữa 2 thằng. Chỉ khi re-render thì nó mới chạy lại đc logic trong thằng useState)
  useEffect(() => {
    setSrc(detectForm(id, initializeSrc, {
      imgURL: productEdit?.imgURL,
      imgPreviewURL1: productEdit?.imgPreviewURL1,
      imgPreviewURL2: productEdit?.imgPreviewURL2,
      imgPreviewURL3: productEdit?.imgPreviewURL3,
      imgPreviewURL4: productEdit?.imgPreviewURL4,
    }))
    setProduct(detectForm(id, initializeFireBase, productEdit))
  }, [id])

  const handleInputChange = (e) => {
    e.preventDefault()
    //neu type la price thi phai check nhap vao la so
    if ([e.target.name] == 'price' || [e.target.name] == 'inventory') {
      if (/^\d{0,7}$/.test(e.target.value)) {
        setProduct({
          ...product,
          [e.target.name]: e.target.value
        })
      }
    }
    else {
      setProduct({
        ...product,
        [e.target.name]: e.target.value
      })
    }
  }

  //phát hiện xem form là 'Thêm sản phẩm' hay 'edit sản phẩm' dựa vào id
  //id là ADD thì alf thêm sản phẩm, còn k thì là edit sản phẩm
  function detectForm(id, add, edit) {
    if (id === 'add') {
      // console.log(add);
      return add;
    }
    return edit;
  }

  const handleEditProduct = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // console.log(product);
      await setDoc(doc(db, "products", id), {
        name: product.name,
        imgURL: product.imgURL,
        price: Number(product.price),
        inventory: Number(product.inventory), //thêm số lượng tồn kho
        category: product.category,
        brand: product.brand,
        desc: product.desc,
        imgPreviewURL1: product.imgPreviewURL1,
        imgPreviewURL2: product.imgPreviewURL2,
        imgPreviewURL3: product.imgPreviewURL3,
        imgPreviewURL4: product.imgPreviewURL4,
        creatAt: product.creatAt,
        editedAt: Timestamp.now().toDate().toString()
      });

      //Sửa sản phẩm thì tìm ra sản phẩm đó ròi replace
      const findIndexEdit = products.findIndex(item => item.id === id)
      const newProducts = [...products]
      newProducts[findIndexEdit] = product
      dispatch(STORE_PRODUCTS(newProducts))
      localStorage.setItem('products', JSON.stringify(newProducts))


      setLoading(false)
      toast.success("Sửa sản phẩm thành công", {
        autoClose: 1200
      })
      navigate(prevLink)
      //điều hướng lại trang trước đó rồi thì xóa đi
      localStorage.removeItem('prevLinkEditProduct')
      localStorage.removeItem('showProduct')

    } catch (e) {
      toast.error(e.message, {
        autoClose: 1200
      })
    }
  }

  //Khi 1 ảnh được mở lên, thì sẽ tải ảnh đó lên Strogate của firebase để khi thực hiện thao tác "Thêm sản phẩm" thì ảnh sản phẩm sẽ đc kéo ra từ trong Strogate của firebase đó
  //NHƯNG CÓ 1 VẤN ĐỀ LÀ: bug memory leak: Chọn 1 ảnh ok rồi, nhưng khi chọn qua ảnh khác, thì ảnh 1 không bị xóa bởi firebase mà nó sẽ lấy cả 2 ảnh 
  const handleImageChange = (event, fileImg, setLoading) => {
    const storageRef = ref(storage, `shoesPlus/${Date.now()}${fileImg.name}`);
    const uploadTask = uploadBytesResumable(storageRef, fileImg);
    //xử lí việc nếu chọn 1 ảnh khác thì phải xóa ảnh cũ đi
    if (product[event.target.name]) {
      const desertRef = ref(storage, product[event.target.name]);
      deleteObject(desertRef).then(() => {
        console.log('xoa anh thanh cong');
      }).catch((error) => {
        console.log(error.message);
        console.log('xoa anh that bai');
      });
    }

    setLoading(true)
    uploadTask.on('state_changed',
      (snapshot) => { },
      (e) => {
        toast.error(e.message, {
          autoClose: 1200
        })
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          //dùng Object.assign chỉ để ghi đè thuộc tính mong muốn mà không cần rải state cũ như dòng 87
          setLoading(false)
          setProduct(prevState => {
            return Object.assign({}, prevState, { [event.target.name]: downloadURL });
          })
          // setProduct({
          //   ...product,
          //   [event.target.name]: downloadURL
          // })
        });
      }
    );
  }


  //Khi ấn "Thêm sản phẩm" thì sẽ tải sản phẩm đó lên firebase ở trong firestore database, còn các link ảnh là do nó kéo từ bên Strogate của firebase mà ở handleImageChange function đã xử lí
  const handleAddProduct = (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const docRef = addDoc(collection(db, "products"), {
        name: product.name,
        imgURL: product.imgURL,
        price: Number(product.price),
        inventory: Number(product.inventory), //thêm số lượng tồn kho
        category: product.category,
        brand: product.brand,
        desc: product.desc,
        imgPreviewURL1: product.imgPreviewURL1,
        imgPreviewURL2: product.imgPreviewURL2,
        imgPreviewURL3: product.imgPreviewURL3,
        imgPreviewURL4: product.imgPreviewURL4,
        creatAt: Timestamp.now().toDate().toString()
      });

      const newProducts = [...products]
      newProducts.push(product)
      dispatch(STORE_PRODUCTS(newProducts))
      localStorage.setItem('products', JSON.stringify(newProducts))

      setLoading(false)
      setProduct(initializeFireBase)
      setSrc(initializeSrc);

      toast.success("Thêm sản phẩm thành công", {
        autoClose: 1200
      })

    } catch (e) {
      toast.error(e.message, {
        autoClose: 1200
      })
    }
  }

  return (
    <>
      <form
        onSubmit={detectForm(id, handleAddProduct, handleEditProduct)}
        className="w-full">
        <div className="w-full flex gap-6">
          <div className="w-1/2 flex flex-col gap-6">
            <InputForm
              onChange={handleInputChange}
              name='name'
              value={product.name}
              type='input'
              typeInput='input'
              width='w-full'
              bg='bg-white'
              labelName='Tên sản phẩm'
              placeholder='Nhập vào tên sản phẩm'
              id='product-name' />
            <div className="w-full flex gap-6">
              <UploadSquare
                src={src}
                srcURL={src.imgURL}
                setSrc={setSrc}
                handleImageChange={handleImageChange}
                name='imgURL'
                text='Tải lên ảnh sản phẩm'
                id='upload-product'
                width='w-1/2' />

              <div className="w-1/2 flex flex-col gap-4 flex-1 justify-center">
                <InputForm
                  onChange={handleInputChange}
                  value={product.price}
                  type='input'
                  width='w-full'
                  name='price'
                  bg='bg-white'
                  labelName='Giá'
                  maxLength={7}
                  py='py-[10px]'
                  placeholder='Giá sản phẩm (VNĐ)'
                  id='product-price' />
                <InputForm
                  onChange={handleInputChange}
                  value={product.inventory}
                  type='input'
                  width='w-full'
                  name='inventory'
                  bg='bg-white'
                  labelName='Số lượng tồn kho'
                  maxLength={7}
                  py='py-[10px]'
                  placeholder='Số lượng'
                  id='product-inventory' />
                <InputForm
                  onChange={handleInputChange}
                  type='select'
                  value={product.category}
                  width='w-full'
                  bg='bg-white'
                  name='category'
                  labelName='Loại'
                  placeholder='Loại sản phẩm'
                  id='product-category'>
                  <option key='0' value="">Chọn loại sản phẩm</option>
                  <option key='1' value="giay-nam">Giày nam</option>
                  <option key='2' value="giay-nu">Giày nữ</option>
                  <option key='3' value="giay-tre-em">Giày trẻ em</option>
                </InputForm>
                <InputForm
                  onChange={handleInputChange}
                  type='select'
                  width='w-full'
                  value={product.brand}
                  bg='bg-white'
                  name='brand'
                  labelName='Thương hiệu'
                  placeholder='Thương hiệu sản phẩm'
                  id='product-brand'>
                  <option key='0' value="">Chọn thương hiệu</option>
                  <option key='1' value="classic">Classic</option>
                  <option key='2' value="sunbaked">Sunbaked</option>
                  <option key='3' value="chuck-07s">Chuck 07S</option>
                  <option key='4' value="one-star">One Star</option>
                  <option key='5' value="psy-kicks">PSY Kicks</option>
                </InputForm>
              </div>
            </div>

            <InputForm
              onChange={handleInputChange}
              type='textarea'
              width='w-full'
              value={product.desc}
              bg='bg-white'
              name='desc'
              labelName='Mô tả sản phẩm'
              placeholder='Nhập vào mô tả sản phẩm'
              id='product-desscription' />
          </div>

          <div className="w-1/2 grid grid-cols-2 gap-5 aspect-square ">
            <UploadSquare
              src={src}
              srcURL={src.imgPreviewURL1}
              setSrc={setSrc}
              handleImageChange={handleImageChange}
              name='imgPreviewURL1'
              text='Tải lên ảnh sản phẩm'
              id='product-preview-1' />
            <UploadSquare
              src={src}
              srcURL={src.imgPreviewURL2}
              setSrc={setSrc}
              handleImageChange={handleImageChange}
              name='imgPreviewURL2'
              text='Tải lên ảnh sản phẩm'
              id='product-preview-2' />
            <UploadSquare
              src={src}
              srcURL={src.imgPreviewURL3}
              setSrc={setSrc}
              handleImageChange={handleImageChange}
              name='imgPreviewURL3'
              text='Tải lên ảnh sản phẩm'
              id='product-preview-3' />
            <UploadSquare
              src={src}
              srcURL={src.imgPreviewURL4}
              setSrc={setSrc}
              handleImageChange={handleImageChange}
              name='imgPreviewURL4'
              text='Tải lên ảnh sản phẩm'
              id='product-preview-4' />
          </div>
        </div>
        <button
          type="submit"
          className='mt-[20px] w-[170px] px-[10px] h-10 bg-primary text-white text-[14px] leading-[37px] font-bold tracking-[1px] uppercase transition-all ease-in duration-500 focus:outline-none hover:bg-[#a40206]'>
          {loading ? <Spinning /> : detectForm(id, (
            <div className="flex gap-1 items-center justify-center">
              <FontAwesomeIcon className='text-[18px]' icon={faPlus} />
              Thêm sản phẩm
            </div>
          ), (
            <div className="flex gap-2 items-center justify-center">
              <FontAwesomeIcon className='text-[18px]' icon={faWrench} />
              Sửa sản phẩm
            </div>
          ))}
        </button>
      </form>

    </>
  );
};

export default AddProduct;