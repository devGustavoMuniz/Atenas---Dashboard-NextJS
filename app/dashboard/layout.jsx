"use client"
import Navbar from "../ui/dashboard/navbar/navbar"
import Sidebar from "../ui/dashboard/sidebar/sidebar"
import styles from "../ui/dashboard/dashboard.module.css"
import Footer from "../ui/dashboard/footer/footer"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { validate } from '../lib';

const Layout = ({children}) => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('token');
    !token && router.push('/login');

    const tokenVerify = async (token) => {
      const res = await validate(token);
      !res && router.push('/login');
    };
    tokenVerify(token);
  }, [router]);
  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <Sidebar/>
      </div>
      <div className={styles.content}>
        <Navbar/>
        <div className={styles.mainContent}>{children}</div>
        <Footer/>
      </div>
    </div>
  )
}

export default Layout