"use client"

import { useEffect } from 'react';
import { redirect } from 'next/navigation'

const Homepage = () => {
  
  useEffect(() => {
    redirect('/home');
  }, []);

  return (
    <></>
  )
}

export default Homepage