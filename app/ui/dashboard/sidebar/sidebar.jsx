"use client"

import Image from "next/image";
import MenuLink from "./menuLink/menuLink";
import styles from "./sidebar.module.css";
import jwt from 'jsonwebtoken';
import { useEffect, useState } from "react";
import { redirect } from 'next/navigation';
import {
  MdDashboard,
  MdSupervisedUserCircle,
  MdShoppingBag,
  MdLogout,
  MdPhotoLibrary,
} from "react-icons/md";
import { useRouter } from 'next/navigation';
import { getUserByUsername } from "../../../lib";

const Sidebar = () => {
  const [user, setUser] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      !token && redirect('/login');
      const decodedToken = jwt.decode(token);
      const user = await getUserByUsername(token, decodedToken.nomeUsuario);
      
      localStorage.setItem('loggedUser', JSON.stringify(user));
      setUser({
        username: decodedToken.nomeUsuario,
        foto: decodedToken.foto,
        isAdm: user.isAdm
      })

      
    }
    fetchData();
  }, [])

  const router = useRouter();

  const menuItems = [
    {
      title: "Menu",
      list: user?.isAdm
        ? [
            {
              title: "Dashboard",
              path: "/dashboard",
              icon: <MdDashboard />,
            },
            {
              title: "Usuários",
              path: "/dashboard/users",
              icon: <MdSupervisedUserCircle />,
            },
            {
              title: "Álbuns",
              path: "/dashboard/products",
              icon: <MdShoppingBag />,
            },
          ]
        : [
            {
              title: "Galeria",
              path: "/dashboard/gallery",
              icon: <MdPhotoLibrary />,
            },
          ],
    },
  ];

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  }

  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <Image
          className={styles.userImage}
          src={user.foto || '/logoAtenas.jpg'}
          alt=""
          width="50"
          height="50"
        />
        <div className={styles.userDetail}>
          <span className={styles.username}>{user.username}</span>
        </div>
      </div>
      <ul className={styles.list}>
        {menuItems.map((cat) => (
          <li key={cat.title}>
            <span className={styles.cat}>{cat.title}</span>
            {cat.list.map((item) => (
              <MenuLink item={item} key={item.title} />
            ))}
          </li>
        ))}
      </ul>
        <button className={styles.logout} onClick={logout}>
          <MdLogout />
          Sair
        </button>
    </div>
  );
};

export default Sidebar;
