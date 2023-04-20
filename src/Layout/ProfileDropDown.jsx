import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../Utils/firebase'
import { useQueryClient } from '@tanstack/react-query'

export default function ProfileDropDown({hideDropDown}) {
  const queryClient=useQueryClient();
  const [user,setUser]=useState();
  const navigate=useNavigate();

  useEffect(()=>{
    setUser(queryClient.getQueryData(["user"]));
  },[queryClient])

  const handleSignout = () => {
    signOut(auth).then(()=>{
      localStorage.clear();
      queryClient.resetQueries();
      hideDropDown();
      navigate('/')
    })
  }

  useEffect(()=>{
    window.addEventListener("click",hideProfileDropDown)

    return ()=>{
      window.removeEventListener("click",hideProfileDropDown)
    }
  })

  const hideProfileDropDown=()=>{
    hideDropDown();
  }

  return (
    <div onClick={(e)=>e.stopPropagation()} className={`max-w-[200px] z-50 bg-white top-2 right-[30%] absolute rounded-md border border-slate-200 shadow transition`}>
      <div className='flex flex-col px-4 border-b-2 border-slate-100 py-3 gap-2'>
        <p className='text-gray-700 leading-none truncate'>{user?.name}</p>
        <p className='text-gray-500 text-sm leading-none truncate '>{user?.email}</p>
      </div>
      <ul className='flex flex-col py-3'>
        <Link>
          <li className='hover:bg-slate-100 px-4 py-2 text-gray-700 text-[15px] leading-none'>
            My Profile
          </li>
        </Link>
        <Link>
          <li className='hover:bg-slate-100 px-4 py-2 text-gray-700 text-[15px] leading-none'>
            Reservations
          </li>
        </Link>
        <Link>
          <li onClick={() => handleSignout()} className='hover:bg-slate-100 px-4 py-2 text-gray-700 text-[15px] leading-none'>Sign Out</li>
        </Link>
      </ul>
    </div>
  )
}
