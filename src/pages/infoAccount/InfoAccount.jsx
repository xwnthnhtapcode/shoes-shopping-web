import { auth, db, storage } from '../../firebase/config';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, updateProfile } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Spinning } from '../../animation-loading';
import { SET_DISPLAY_NAME, selectUserID } from '../../redux-toolkit/slice/authSlice';
import UploadSquare from '../../components/admin/addProduct/UploadSquare';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';


const solvePrice = (price) => {
  return Number(price).toLocaleString('vi-VN');
}


const InfoAccount = () => {
  const isGoogleUser = localStorage.getItem('isGoogleUser') === 'true' ? true : false
  //khi reload cần thời gian xác thực xem có đăng nhập hay không thì mới trả về current đc nha
  const currentUser = auth.currentUser;
  let checkInputDone = {
    name: false,
    imgAvatar: false,
    password: false,
    passwordError: false
  }

  const [loading, setLoading] = useState(false);
  const [haveChangeImg, setHaveChangeImg] = useState(false);
  const displayEmail = localStorage.getItem('displayEmail')
  const displayName = localStorage.getItem('displayName')
  //
  const [allOrders, setAllOrders] = useState([])
  const userID = useSelector(selectUserID) || localStorage.getItem('userID')
  // const isGoogleUser = useSelector(state => state.auth.isGoogleUser)
  const dispatch = useDispatch()

  const [fileImg, setFileImg] = useState('')

  const avatar = localStorage.getItem('imgAvatar'); //link avt tren github
  //
  const [vouchers, setVouchers] = useState([])
  const [showVouchers, setShowVouchers] = useState(false)

  // src này `CHỈ ĐỂ KHI MỞ ẢNH MỚI` lên thì nó hiện trong khung, không liên quan gì đến firebase
  //khi reload lại thì phải lấy ảnh trong firebase hiển thị vì cái src này k có tác dụng với internet
  //cái link này không có tác dụng xem trên internet, base64 j đó k nhớ :V thích thì console.log ra mà nhìn
  const [src, setSrc] = useState({
    imgAvatar: "",
  })

  //đây là src ảnh trên firebase
  const [infoChange, setInfoChange] = useState({
    imgAvatar: "",
    name: displayName,
    password: "",
    newPassword: "",
    newPassword2: ""
  })

  const updateInfoChange = (e) => {
    setInfoChange({
      ...infoChange,
      [e.target.name]: e.target.value
    })
  }

  const getVouchers = async () => {
    const productsRef = query(collection(db, "vouchers"), where('userID', '==', userID));
    const q = query(productsRef);
    try {
      const querySnapshot = await getDocs(q);
      const vouchers = querySnapshot.docs.map(doc => ({
        voucherID: doc.id,
        ...doc.data(),
      }))
      setVouchers(vouchers)
      console.log('vouchers: ', vouchers);
    } catch (e) {
      console.log(e.message);
    }
  }

  //kiểm tra đầu vào có đúng chưa, nếu ok hết thì mới cho submit
  const checkInvalidUser = (e) => {
    //Check tên trước, nếu hợp lệ thì mới check 3 ô input password
    if (!(infoChange.name.length >= 5 && infoChange.name.length <= 20)) {
      return {
        notify: "Tên hiển thị phải dài từ 5 đến 20 ký tự",
        status: false,
        changePass: false
      };
    }

    //check 3 ô input password
    let count = 0;
    if (infoChange.password !== "") count++;
    if (infoChange.newPassword !== "") count++;
    if (infoChange.newPassword2 !== "") count++;

    //Nếu không có ô nào được điền
    if (count == 0) {
      return {
        notify: "Thông tin tài khoản đã được cập nhật",
        status: true,
        changePass: false
      };
    }

    //chỉ cần điền 1 ô hoặc 2 ô thì có thông báo 'không được để trông inpout'
    if (count == 1 || count == 2) {
      return {
        notify: "Không được để trống input",
        status: false,
        changePass: false
      };
    }
    //Điền cả 3 ô, phải check điều kiện từng ô một
    else {
      if (!(/^[a-zA-Z0-9]{8,}$/).test(infoChange.newPassword)) {
        return {
          notify: "Mật khẩu mới phải dài ít nhất 8 ký tự và không chứa các ký tự đặc biệt",
          status: false,
          changePass: false
        };
      }

      if (infoChange.newPassword !== infoChange.newPassword2) {
        return {
          notify: "Mật khẩu mới không chính xác",
          status: false,
          changePass: false
        };
      }
      //Nếu cả 3 thằng điền hợp lệ
      // handleChangePassword(e)
      return {
        notify: "Thông tin tài khoản đã được cập nhật",
        status: true,
        changePass: true
      };
    }
  }

  //khi cập nhật phải reset các ô input và update các thông tin, mở ra để đọc
  const resetAndUpdateInput = () => {
    //reset value về ô trống
    console.log('reset');
    setInfoChange({
      ...infoChange,
      password: "",
      newPassword: "",
      newPassword2: ""
    })
  }

  //XỬ LÍ KHI ĐĂNG KÍ THÌ UPLOAD AVATAR DEFAULT LUÔN CHO NHANH
  //LÚC XỬ LÍ CÁI BÌNH LUẬN, NẾU USER NÀO CHƯA CÓ AVATAR THÌ DÙNG CÁI ẢNH DEFAULT AVATAR NHƯ TRÊN FAFCEBOOK

  //sovle việc cập nhật avatar của user trên firebase
  //chỉ khi nào ấn cập nhật thì mới up ảnh lên firebase nhé :v tẹo về xử lí nốt că thằng add product
  const handleUpdateAvatar = async () => {
    return new Promise((resolve, reject) => {
      //nếu có thay đổi avatar (kéo vào ảnh mới thì mới xử lí)
      if (haveChangeImg) {
        const storageRef = ref(storage, `shoesPlus-avatar/${Date.now()}${fileImg.name}`);
        const uploadTask = uploadBytesResumable(storageRef, fileImg);

        //xử lí việc nếu chọn 1 ảnh khác thì phải xóa ảnh cũ đi
        // if ((infoChange.imgAvatar || avatar) && haveChangeImg && avatar !== 'avt-google') {
        //   const desertRef = ref(storage, (infoChange.imgAvatar || avatar));
        //   deleteObject(desertRef).then(() => {
        //     console.log('xoa anh thanh cong');
        //     setHaveChangeImg(false)
        //   }).catch((error) => {
        //     console.log(error.message);
        //     console.log('xoa anh that bai');
        //   });
        // }
        uploadTask.on('state_changed',
          (snapshot) => { },
          (e) => {
            toast.error(e.message, {
              autoClose: 1200
            })
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              //mục đích lưu vào local strogate để khi reload lại nó hiển thị luôn mà không cần tgian load cái ảnh => gây mất thiện cảm người dùng
              //downloadURL là link của ảnh trên firebase
              localStorage.setItem('imgAvatar', downloadURL);
              updateProfile(currentUser, { photoURL: downloadURL })
              setInfoChange(prevState => {
                return Object.assign({}, prevState, { imgAvatar: downloadURL });
              })
              checkInputDone.imgAvatar = true;
              setLoading(false);
              if (!checkInputDone.passwordError) {
                toast.success('Thông tin tài khoản đã được cập nhật', {
                  autoClose: 1200
                })
              }
              resolve()
            });
          }
        );
      }
      else {
        checkInputDone.imgAvatar = true;
        setLoading(false)
        if (!checkInputDone.passwordError) {
          toast.success('Thông tin tài khoản đã được cập nhật', {
            autoClose: 1200
          })
        }
        resolve()
      }
    })
  }

  //solve hiển thị và check xem có đổi avatar không
  const handleUploadAvatar = (event, fileImg, setLoading) => {
    setHaveChangeImg(true)
    setFileImg(fileImg)
  }

  //xử lí việc cập nhật display name
  const handleChangeDisplayName = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(currentUser, { displayName: infoChange.name })
        .then(() => {
          checkInputDone.name = true;

          //update displayName trên localStrogate
          localStorage.setItem('displayName', infoChange.name);
          //lí do phải dispatch SET_DISPLAY_NAME là do khi đổi tên thì nó cập nhật trên firebase ok rồi, nhưng nếu không F5 lại thì nó vẫn hiển thị trên web là tên cũ (VÌ TÊN HIỂN THỊ ĐỀU LẤY RA TỪ REDUX) nên không F5 lại thì redux không thể cập nhật tên mới ( trong onAuthStateChanged/header nhé), nên phải dispatch để nó re-render hết tất cả những thằng có dùng displayName lấy ra từ redux

          //update displayName trên redux
          dispatch(SET_DISPLAY_NAME(infoChange.name))
        })
        .catch((error) => {
          checkInputDone.name = false;
          // console.error("Thay đổi displayName thất bại:", error);
        });
    } catch (error) {
      // toast.error(error.message, {
      //   autoClose: 1200,
      // });
      setLoading(false)
    }
  }

  //xử lí việc cập nhật mật khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(
      user.email,
      infoChange.password
    );

    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, infoChange.newPassword);
      checkInputDone.password = true;
    } catch (error) {
      checkInputDone.passwordError = true;
      toast.error('Mật khẩu hiện tại không đúng', {
        autoClose: 1200,
      });
      setLoading(false)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true);
    const { notify, status, changePass } = checkInvalidUser();

    if (!status && !changePass) {
      toast.error(notify, {
        autoClose: 1500,
      });
      setLoading(false);
    }

    //change displayName nhưng KHÔNG CHANGE PASSWORD
    else if (status && !changePass) {
      await handleChangeDisplayName(e);
      await handleUpdateAvatar()
      await solveOrders()
      await solveReviews()
      solveUsers()
    }

    //CÓ CHANGE PASSWORD & update password thành công
    else if (status && changePass) {
      if (infoChange.password === infoChange.newPassword) {
        setLoading(false);
        toast.error('Mật khẩu mới không được trùng với mật khẩu hiện tại', {
          autoClose: 1200,
        });
      }
      else {
        //await để xử lí việc nếu password hiện tại không đúng thì checkInputDone.passwordError = true và nó sẽ k đổi avt và name
        await handleChangePassword(e) //update password
        if (!checkInputDone.passwordError) {
          await handleChangeDisplayName(e) //update displayName
          await handleUpdateAvatar()
          await solveOrders()
          await solveReviews()
          solveUsers()
          resetAndUpdateInput()
        }
      }
    }
  }

  const solveReviews = async () => {
    const reviewsRef = query(collection(db, "reviews"), where('userID', "==", userID));
    const q = query(reviewsRef);
    try {
      const querySnapshot = await getDocs(q);
      const allReviews = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      Promise.all(
        allReviews.map(async (review) => {
          try {
            await setDoc(doc(db, "reviews", review.id), {
              userID: review.userID,
              imgAvatar: localStorage.getItem('imgAvatar') || currentUser?.photoURL,
              displayName: infoChange.name,
              displayEmail: review.displayEmail,
              productID: review.productID,
              rate: review.rate,
              typeReview: review.typeReview,
              orderID: review.orderID,
              orderDate: review.orderDate,
              orderTime: review.orderTime,
              creatAt: review.creatAt,
            })
          } catch (e) {
            console.log(e.message);
          }
        })
      )
      // setAllOrders(allOrders)
    }
    catch (e) {
      console.log(e.message);
    }
  }

  const solveOrders = async () => {
    const ordersRef = query(collection(db, "orders"), where('userID', "==", userID));
    const q = query(ordersRef);
    try {
      const querySnapshot = await getDocs(q);
      const allOrders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      Promise.all(
        allOrders.map(async (order) => {
          try {
            await setDoc(doc(db, "orders", order.id), {
              userID: order.userID,
              displayName: infoChange.name,
              displayEmail: order.displayEmail,
              imgAvatar: localStorage.getItem('imgAvatar') || currentUser?.photoURL,
              // totalPayment,
              deliveryFee: order.deliveryFee,
              discount: order.discount,
              orderDate: order.orderDate,
              orderTime: order.orderTime,
              orderAmount: order.orderAmount,
              orderStatus: order.orderStatus,
              cartProduct: order.cartProduct,
              shippingAddress: order.shippingAddress,
              creatAt: order.creatAt
            })
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

  const solveUsers = async () => {
    console.log('dsadsds');
    const ordersRef = query(collection(db, "users"), where('userID', "==", userID));
    const q = query(ordersRef);
    try {
      const querySnapshot = await getDocs(q);
      const user = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))[0]
      try {
        await setDoc(doc(db, "users", user.id), {
          userID: user.userID,
          avatar: localStorage.getItem('imgAvatar') || currentUser?.photoURL,
          displayName: infoChange.name,
          displayEmail: user.displayEmail,
        })
      } catch (e) {
        console.log(e.message);
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  useEffect(() => {
    getVouchers()
  }, [])

  return (
    <>
      <div className="my-[30px] max-w-[1230px] mx-auto">
        <div className="px-[15px]">
          <div className="mb-4">
            <span className='text-[#353535] block text-[16px] font-bold uppercase '>Thông tin mã giảm giá</span>
            <button
              onClick={() => {
                setShowVouchers(prev => !prev)
              }}
              className='mt-[20px] w-[250px] h-10 bg-primary text-white text-[15px] leading-[37px] font-bold tracking-[1px] uppercase transition-transform ease-in duration-500 focus:outline-none hover:bg-[#a40206]'>
              {loading ? <Spinning /> : "Xem mã giảm giá hiện có"}
            </button>
            <div
              style={{
                height: `${showVouchers ? vouchers.length * 32 + 38 : 0}px`
              }}
              className={`${showVouchers || 'h-0 opacity-0'} transition-all ease-linear duration-200 mt-4`}>
              <table className='w-[250px]'>
                <thead className='block w-full pb-2 mb-1 border-[3px] border-t-0 border-l-0 border-r-0 border-[#ccc]'>
                  <tr className='flex w-full justify-between'>
                    <td className="">Mã giảm giá</td>
                    <td className="">Giá trị (VNĐ)</td>
                  </tr>
                </thead>
                <tbody className='w-full'>
                  {vouchers.map((voucher) => (
                    <tr
                      key={voucher.voucherID}
                      className="flex justify-between border border-t-0 border-l-0 border-r-0 border-[#ddd] py-1">
                      <td className="">{voucher.code}:</td>
                      <td className="">{solvePrice(voucher.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div style={{
            height: '.1875rem',
            width: '100%',
            backgroundPositionX: '-1.875rem',
            backgroundSize: '7.25rem .1875rem',
            backgroundImage: 'repeating-linear-gradient(45deg,#6fa6d6,#6fa6d6 33px,transparent 0,transparent 41px,#f18d9b 0,#f18d9b 74px,transparent 0,transparent 82px)',
          }} className='my-6'></div>
          <form onSubmit={handleSubmit}>
            <div className="w-full mb-12 text-[#222] text-[14px] flex flex-col gap-5 ">
              <span className='text-[#353535] block text-[16px] font-bold uppercase '>Thông tin tài khoản</span>
              <div className=''>
                <label className='mb-2 font-bold block'>Ảnh hiển thị</label>
                <UploadSquare
                  src={src}
                  srcURL={src.imgAvatar || localStorage.getItem('imgAvatar') || currentUser?.photoURL || ""}
                  setSrc={setSrc}
                  handleImageChange={handleUploadAvatar}
                  name='imgAvatar'
                  text='Tải lên ảnh hiển thị'
                  id='upload-avatar'
                  width='w-[222px]' />
                <span className='block mt-2 text-[#353535] text-[16px] italic'>Ảnh sẽ được tự động cắt theo hình tròn khi tải lên</span>
              </div>
              <p>
                <label className='mb-2 font-bold block' htmlFor="account_display_name">Tên hiển thị *</label>
                <input
                  // || "" là do lúc mới chạy, onAuthStateChanged để trong useEffect (nó gắn liền với dispatch active user) vì thế lúc mới chạy, thằng infoChange.name lấy ra từ redux nó bị "" và thằng localStorage.getItem('displayName') nó cũng bị null do chưa chạy đc vào useEffect(chưa render xong UI), nên cả 2 thằng đó đều falsy thì mình sẽ lấy ""
                  // CÓ BUG: Nếu xóa hết tên thì nó không bị "" , mà sẽ getItem từ localStrogate và set lại value, vì thế nếu muốn đặt tên khác thì phải copy paste vào, THÔI CHỊU KHÓ LAG 1 TÍ CŨNG ĐC :V BỎ THẰNG LOCALSTROGATE ĐI
                  // value={infoChange.name || localStorage.getItem('displayName') || ""}
                  value={infoChange.name}
                  onChange={(e) => updateInfoChange(e)}
                  name="name"
                  className='align-middle bg-white shadow-sm text-[#333] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2 transition-all ease-linear duration-150 focus:shadow-shadowPink focus:border focus:border-[#ea4c8966]' id='account_display_name' type="text" />
                <span className='text-[#353535] text-[16px] italic'>Đây sẽ là cách mà tên của bạn sẽ được hiển thị trong phần tài khoản và trong phần đánh giá</span>
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
            </div>
            {/* HIỆN ĐANG ĐĂNG NHẬP BẰNG TÀI KHOẢN GOOGLE */}
            {/* NÓ BỊ NHẤP NHÁY DO NHẢY TỪ KHÔNG ĐĂNG NHẬP BẰNG GOOGLE -> ĐĂNG NHẬP BẰNG GOOGLE */}
            {/* GIẢI QUYẾT LÀ LƯU BIẾN NÀY VÀO LOCAL STROGATE */}
            {
              isGoogleUser
                ? <div className="w-full text-[#222] text-[14px] flex flex-col gap-5">
                  <span className='text-[#353535] block text-[16px] font-bold uppercase '>Thay đổi mật khẩu</span>
                  <span className='text-[#353535] text-[16px] italic'>Bạn không thể thay đổi mật khẩu do đang đăng nhập bằng tài khoản Google</span>
                </div>
                : <div className="w-full text-[#222] text-[14px] flex flex-col gap-5">
                  <span className='text-[#353535] block text-[16px] font-bold uppercase '>Thay đổi mật khẩu</span>
                  <p>
                    <label className='mb-2 font-bold block' htmlFor="password_current">Mật khẩu hiện tại</label>
                    <input
                      autoComplete="off"
                      name="password"
                      value={infoChange.password}
                      onChange={(e) => updateInfoChange(e)}
                      placeholder='Bỏ trống nếu không đổi'
                      className='placeholder:italic align-middle bg-white shadow-sm text-[#333] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2 transition-all ease-linear duration-150 focus:shadow-shadowPink focus:border focus:border-[#ea4c8966]'
                      id='password_current'
                      type="password" />
                  </p>

                  <p>
                    <label className='mb-2 font-bold block' htmlFor="password_1">Mật khẩu mới</label>
                    <input
                      value={infoChange.newPassword}
                      autoComplete="off"
                      placeholder='Bỏ trống nếu không đổi'
                      name="newPassword"
                      onChange={(e) => updateInfoChange(e)}
                      className='placeholder:italic align-middle bg-white shadow-sm text-[#333] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2 transition-all ease-linear duration-150 focus:shadow-shadowPink focus:border focus:border-[#ea4c8966]'
                      id='password_1'
                      type="password" />
                  </p>

                  <p>
                    <label className='mb-2 font-bold block' htmlFor="password_2">Xác nhận mật khẩu mới</label>
                    <input
                      autoComplete="off"
                      name="newPassword2"
                      value={infoChange.newPassword2}
                      onChange={(e) => updateInfoChange(e)}
                      className='align-middle bg-white shadow-sm text-[#333] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2 transition-all ease-linear duration-150 focus:shadow-shadowPink focus:border focus:border-[#ea4c8966]'
                      id='password_2'
                      type="password" />
                  </p>
                </div>
            }

            <button
              type="submit"
              className='mt-[20px] w-[150px] h-10 bg-primary text-white text-[15px] leading-[37px] font-bold tracking-[1px] uppercase transition-transform ease-in duration-500 focus:outline-none hover:bg-[#a40206]'>
              {loading ? <Spinning /> : "Lưu thay đổi"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default InfoAccount;