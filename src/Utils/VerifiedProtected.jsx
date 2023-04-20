import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from "firebase/auth";


export default function VerifiedProtected() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.emailVerified === false) {
        navigate('/');
      }
    });
    return () => {
      unsubscribe();
    }
  }, []) 

  return (
    <>
      {<Outlet />}
    </>
  )
}