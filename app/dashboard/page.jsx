"use client"

import Card from "../ui/dashboard/card/card";
import styles from "../ui/dashboard/dashboard.module.css";
import { useEffect, useState } from 'react';
import Transactions from "../ui/dashboard/transactions/transactions";
import { handlerUser, handlerAlbum, getUserByUsername } from '../lib';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';

const Dashboard = () => {
  const [cards, setCards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');

      const decodedToken = jwt.decode(token);
      const userData = await getUserByUsername(token, decodedToken.nomeUsuario);

      console.log(userData);
      
      if (!userData.isAdm) {
        router.push('/dashboard/gallery')
      } else {
        const allUsersData = await handlerUser(token);
        const allAlbumsData = await handlerAlbum(token);

        setCards([
          {
            id: 1,
            title: "Usuários totais",
            number: allUsersData.length,
          },
          {
            id: 2,
            title: "Álbuns totais",
            number: allAlbumsData.length,
          },
        ]);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <div className={styles.cards}>
          {cards.map((item) => (
            <Card item={item} key={item.id} />
          ))}
        </div>
        <Transactions />
      </div>
    </div>
  );
};

export default Dashboard;