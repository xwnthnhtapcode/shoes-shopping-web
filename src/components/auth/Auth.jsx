import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React, { memo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth, db } from '../../firebase/config';
import "./auth.scss"
import SignIn from './SignIn';
import SignUp from './SignUp';
import Reset from './Reset';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';

// Responsive: Truyền cả 2 thằng là false để nó đều cùng ở bên trái dễ responsive
// - signIn: Truyền <SignIn signUp={false} /> là false để nó bay sang bên phải (để cùng bên phải với signUp tiện cho việc làm responsive)
// - signUp: Truyền <SignUp signUp={false} /> là false và đổi opacity-0 thành opacity-100 ở thằng cha để nó hiện

//setSignUp thành true để hiện ra sign up, thành false để hiện ra sign in
const Auth = () => {
  const [resetPassword, setResetPassword] = useState(false);
  const [signUp, setSignUp] = useState(false);
  const navigate = useNavigate();

  const addCurrentUser = async (avatar, displayName, displayEmail, userID, provider) => {
    const productsRef = query(collection(db, "users"), where("userID", "==", userID));
    const q = query(productsRef);
    try {
      const querySnapshot = await getDocs(q);
      const user = querySnapshot.docs.map(doc => ({ ...doc.data() }))
      if (user.length === 0) {
        try {
          const docRef = addDoc(collection(db, "users"), {
            userID,
            avatar,
            displayName,
            displayEmail,
            provider,
          });
        } catch (e) {
          console.log(e.message);
        }
      }
    }
    catch (e) {
      console.log(e.message);
    }
  }

  const provider = new GoogleAuthProvider();
  const signInWithGoogle = useCallback(() => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        await addCurrentUser(
          user.photoURL,
          user.displayName?.slice(0, 20) || (user.email.slice(0, -10).charAt(0).toUpperCase() + (user.email.slice(0, -10)).slice(1)),
          user.email,
          user.uid,
          'google'
        )
        toast.success('Đăng nhập thành công', {
          autoClose: 1200,
        });
        navigate("/")
      }).catch((e) => {
        console.log(e.message);
        toast.error(e.message, {
          autoClose: 1200,
        })
      });
  })

  return (
    <>
      <div className={`my-[35px] mx-auto bg-white shadow-shadowAuth relative overflow-hidden w-[768px] max-w-full min-h-[480px] ${signUp ? "right-panel-active" : ""}`} id="container">
        {
          resetPassword
            ? <Reset signUp={signUp} setResetPassword={setResetPassword} />
            : <SignIn signUp={signUp} signInWithGoogle={signInWithGoogle} setResetPassword={setResetPassword} />
        }
        <SignUp signUp={signUp} setSignUp={setSignUp} signInWithGoogle={signInWithGoogle} />
        {/* overlay */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="absolute flex items-center justify-center flex-col px-10 text-center top-0 h-full w-1/2 translate-x-0 transition-transform ease-in-out duration-[0.6s] overlay-left">
              <h1 className="font-bold m-0 text-[25px]">Đăng nhập vào Shoes Plus</h1>
              <p className="text-[14px] font-[300] leading-5 tracking-[0.5px] mt-5 mb-[30px]">Đã có tài khoản? Vui lòng đăng nhập ở đây</p>
              <button
                onClick={() => setSignUp(false)}
                className="  border border-solid border-white bg-transparent text-white text-[13px] font-bold py-3 px-[45px] tracking-[1px] uppercase transition-transform ease-in duration-[80ms] active:scale-95 focus:outline-none"
                id="signIn"
              >
                Đăng nhập
              </button>
            </div>
            <div className="absolute flex items-center justify-center flex-col px-10 text-center top-0 h-full w-1/2 translate-x-0 transition-transform ease-in-out duration-[0.6s] overlay-right">
              <h1 className="font-bold m-0 text-[25px]">Chưa có tài khoản?</h1>
              <p className="text-[14px] font-[300] leading-5 tracking-[0.5px] mt-5 mb-[30px]">Nhập thông tin của bạn để thỏa sức mua sắm với Shoes Plus</p>
              <button
                onClick={() => setSignUp(true)}
                className="border border-solid border-white bg-transparent text-white text-[13px] font-bold py-3 px-[45px] tracking-[1px] uppercase transition-transform ease-in duration-[80ms] active:scale-95 focus:outline-none"
                id="signUp"
              >
                Đăng ký
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default memo(Auth);