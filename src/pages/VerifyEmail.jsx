import React, { useEffect, useLayoutEffect, useState } from 'react'
import { sendEmailVerification } from "firebase/auth";
import { auth, db } from '../Utils/firebase';
import { toast } from 'react-toastify';
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useQueryClient } from '@tanstack/react-query';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const queryCLient = useQueryClient()
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")))

  if (user && user.isVerified === true) {
    return navigate('/')
  }

  const [time, setTime] = useState(60);
  useEffect(() => {
    setInterval(() => {
      if (time > 0) {
        setTime((time) => time - 1)
      }
    }, 1000)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      auth.currentUser?.reload()
        .then(async () => {
          if (auth.currentUser?.emailVerified) {
            const documentRef = doc(db, "users", auth.currentUser.uid);
            await updateDoc(documentRef, { isVerified: true });
            const d = await getDoc(documentRef);
            let data = {
              ...d.data()
            }
            localStorage.setItem("user", JSON.stringify(data));
            queryCLient.setQueryData(['user'], data);

            navigate("/booking");
          }
        })
    }, 1000)

    return () => {
      clearInterval(interval);
    };
  }, [])

  const resendMailHandler = async () => {
    sendEmailVerification(auth?.currentUser).then(() => {
      setTime(60);
    }).catch((err) => {
      toast.error("Error resending verification mail");
    })
  }

  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='flex flex-col gap-4 mt-10'>
        <h1 className='text-2xl'>Verify Email</h1>
        <p>A verification email has been sent to: </p>
        <p className='font-bold'>{auth?.currentUser?.email}</p>
        <button onClick={resendMailHandler} disabled={time > 0} className='px-6 h-8 mt-2 rounded-md m-auto bg-cyan-600 text-xl text-white'>
          {`Resend Email  ${time > 0 ? "in " + time : ""}`}
        </button>
      </div>
    </div>
  )
}
