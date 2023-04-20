import React, { useEffect, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { AiOutlineBell } from "react-icons/ai"
import { ImUser } from "react-icons/im";
import ProfileDropDown from './ProfileDropDown';
import { useQueryClient } from '@tanstack/react-query';

export default function Navbar() {
  const [showDropDown, setShowDropDown] = useState(false);
  const queryClient = useQueryClient();

  const [user, setUser] = useState();

  useEffect(() => {
    setUser(queryClient.getQueryData(['user']))
  }, [queryClient])

  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      setUser(queryClient.getQueryData(['user']))
    });
    return () => {
      unsubscribe();
    };
  }, [location.pathname, queryClient])

  console.log(user);

  return (
    <>
      <nav className='w-full py-8 px-4 border-b-2 border-slate-100'>
        <div className='max-w-7xl mx-auto flex items-center justify-between'>
          <Link to='/'>
            <h1 className='font-[700] text-2xl'>LOGO</h1>
          </Link>
          <div className='flex gap-4'>
            <NavLink className={({ isActive }) => isActive ? "text-cyan-600 font-[500]" : ""} to='/about-us'>
              <p className='h-8 font-[500]'>About us</p>
            </NavLink>
            {user && user?.isVerified &&
              <NavLink className={({ isActive }) => isActive ? "text-cyan-600 font-[500]" : ""} to='/profile'>
                <p className='h-8 font-[500]'>Profile</p>
              </NavLink>
            }
            <NavLink className={({ isActive }) => isActive ? "text-cyan-600 font-[500]" : ""} to='/'>
              <p className='h-8 font-[500]'>Login</p>
            </NavLink>
            <NavLink className={({ isActive }) => isActive ? "text-cyan-600 font-[500]" : ""} to='/signup'>
              <p className='h-8 font-[500]'>Signup</p>
            </NavLink>
          </div>
          {user && user?.isVerified &&
            <div className='flex items-center gap-4'>
              <AiOutlineBell className='text-[27px]' />
              <div className='relative'>
                <div onClick={(e) => { setShowDropDown(!showDropDown); e.stopPropagation() }} className='bg-[#237EE8] overflow-hidden border-[1px] border-[#237EE8] w-[35px] h-[35px] rounded-full flex justify-center items-center' >
                  <ImUser className='text-white text-[150px] mt-[5px]' />
                </div>
                {showDropDown &&
                  <div className='relative bg-[aqua]'>
                    <ProfileDropDown hideDropDown={() => setShowDropDown(false)}></ProfileDropDown>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  )
}
