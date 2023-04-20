import React, { useRef } from 'react'
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../Utils/firebase';
import { toast } from 'react-toastify';
import { sendEmailVerification } from "firebase/auth";

export default function Login() {

  const navigate = useNavigate();
  const formRef = useRef();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (data) => {
      const result = await signInWithEmailAndPassword(auth, data.email, data.password);
      console.log(result)
      const userRef = doc(db, "users", result.user.uid);
      const user = await getDoc(userRef);
      return user.data()
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data);
      localStorage.setItem("user", JSON.stringify(data));
      if (data.isVerified && auth.currentUser.emailVerified) {
        toast.success("Login successful!");
        navigate("/booking");
      } else {
        sendEmailVerification(auth.currentUser)
          .then(() => {
            navigate("/verify-email")
          }).catch((err) => {
            toast.error("Error sending verification mail");
          })
      }
    },
    onError: (error) => {
      console.log(error.code)
      if (error.code === "auth/user-not-found") {
        toast.error("User not found");
        return
      }
      if (error.code === "auth/wrong-password") {
        toast.error("Wrong password");
        return
      }
      toast.error("Wrong credentials");
    }
  })

  const loginFormHandler = (e) => {
    e.preventDefault();
    let data = {
      email: formRef.current.email.value,
      password: formRef.current.password.value,
    }
    loginMutation.mutate(data);
  }

  return (
    <form onSubmit={loginFormHandler} ref={formRef} className='py-8 flex flex-col gap-4 w-[25%] m-auto text-[#595659]'>
      <input className='border-[1px] h-8 p-2 rounded-sm' placeholder='Email' name='email' />
      <input className='border-[1px] h-8 p-2 rounded-sm' placeholder='Password' name='password' />
      {!loginMutation.isLoading &&
        <button type='submit' className='w-24 h-8 mt-2 rounded-md m-auto bg-cyan-600 text-lg text-white'>Submit</button>
      }
      {loginMutation.isLoading &&
        <button type='button' disabled className='w-24 h-8 mt-2 rounded-md m-auto bg-cyan-600 text-xl text-white'><img className='w-[20px] m-auto' src='/WhiteLoading.svg' /></button>
      }
    </form>
  )
}
