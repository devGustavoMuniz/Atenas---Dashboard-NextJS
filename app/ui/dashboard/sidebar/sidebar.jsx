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
} from "react-icons/md";
import { useRouter } from 'next/navigation';

const menuItems = [
  {
    title: "Menu",
    list: [
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
      {
        title: "Álbuns Físicos",
        path: "/dashboard/album",
        icon: <MdShoppingBag />,
      },
    ],
  },
];

const Sidebar = () => {
  const [user, setUser] = useState('');
  
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    !token && redirect('/login');
    const decodedToken = jwt.decode(token);
    setUser({
      username: decodedToken.nomeUsuario
    })
  }, [])

  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  }

  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <Image
          className={styles.userImage}
          src={'/logoAtenas.jpg'}
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
