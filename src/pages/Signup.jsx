import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword,sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../Utils/firebase';


export default function Signup() {
  const formRef = useRef();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(()=>{localStorage.clear()},[])

  const signupMutation = useMutation({
    mutationFn: async (data) => {
      return createUserWithEmailAndPassword(auth, data.email, data.password)
        .then(async (userCredentials) => {
          delete data.password;
          data.uid = userCredentials.user.uid
          await setDoc(doc(db, "users", userCredentials.user.uid), data);
          localStorage.setItem("user", JSON.stringify(data));
          queryClient.setQueryData(['user'], data);
          sendEmailVerification(auth.currentUser)
            .then(()=>{
              toast.success("User created successfully");
              navigate("/verify-email")
            }).catch((err)=>{
              if(err.code ==="auth/too-many-requests"){
                toast.error("Too many requests");
              }
              toast.error("Error sending verification mail");
            })
        })
        .catch((error) => {
          console.log(error);
        })
    },
    onSuccess: () => {
      // toast.success("User created successfully");
    },
    onError: () => {
      toast.error("Error creating user");
    }
  });


  const formSubmitHandler = async (e) => {
    e.preventDefault();
    if(formRef.current.password.value !== formRef.current.confirmPassword.value){
      toast.error("Passwords doesnot match");
      return
    }
    let data = {
      name: formRef.current.name.value,
      email: formRef.current.email.value,
      password: formRef.current.password.value,
      isVerified:false
    }

    signupMutation.mutate(data);
  }


  return (
    <form onSubmit={formSubmitHandler} ref={formRef} className='py-8 flex flex-col gap-4 w-[25%] m-auto text-[#595659]'>
      <input className='border-[1px] h-8 p-2 rounded-sm' placeholder='Name' name='name' />
      <input className='border-[1px] h-8 p-2 rounded-sm' placeholder='Email' name='email' />
      <input className='border-[1px] h-8 p-2 rounded-sm' placeholder='Password' name='password' />
      <input className='border-[1px] h-8 p-2 rounded-sm' placeholder='Confirm Password' name='confirmPassword' />
      {!signupMutation.isLoading &&
        <button type='submit' className='w-24 h-8 mt-2 rounded-md m-auto bg-cyan-600 text-lg text-white'>Submit</button>
      }
      {signupMutation.isLoading &&
        <button type='button' disabled className='w-24 h-8 mt-2 rounded-md m-auto bg-cyan-600 text-xl text-white'><img className='w-[20px] m-auto' src='/WhiteLoading.svg' /></button>
      }
    </form>
  )
}
