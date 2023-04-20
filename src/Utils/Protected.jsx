import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

export default function Protected() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"))
  console.log(user);
  useEffect(() => {
    console.log(user);
    if (user === null) {
      navigate('/');
    }
    queryClient.setQueryData(["user"], user)
  }, [queryClient])

  if (user === null) {
    return null;
  }

  return (
    <>
      {user !== null && <Outlet />}
    </>
  )
}