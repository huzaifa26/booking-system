import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react'
import { auth } from '../../Utils/firebase';
import { toast } from 'react-toastify';

export default function ForgotPassword({hideModal}) {
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(false)

  const sendPasswordResetMail = () => {
    setLoading(true);
    sendPasswordResetEmail(auth, email).then((a) => {
      toast.success("Password reset mail sent");
      setLoading(false)
    }).catch((err) => {
      toast.error("Error sending Password reset mail");
      setLoading(false)
    })
  }

  return (
    <div onClick={()=>hideModal()} className='absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.25)] backdrop-blur-[4px] flex justify-center items-center'>
      <div onClick={(e)=>e.stopPropagation()} className='w-[30%] h-44 bg-white rounded-md divide-y-2'>
        <h1 className='text-xl py-3 px-4'>Enter email to send password reset mail.</h1>
        <div className='flex flex-col px-4 pt-6'>
          <input onChange={(e) => setEmail(e.target.value)} className='border-[1px] h-8 p-2 rounded-sm' placeholder='Email' name='email' />
          {!loading ? <button onClick={sendPasswordResetMail} type='button' className='w-24 h-8 rounded-md m-auto mt-4 bg-cyan-600 text-lg text-white'>Send mail</button>
            : <button type='button' className='w-24 h-8 rounded-md m-auto mt-4 bg-cyan-600 text-lg text-white'><img src='/WhiteLoading.svg' className='m-auto w-[25px]' /></button>}
        </div>
      </div>
    </div>
  )
}
