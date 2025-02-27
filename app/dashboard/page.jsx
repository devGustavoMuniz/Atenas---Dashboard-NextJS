"use client"

import Card from "../ui/dashboard/card/card";
import styles from "../ui/dashboard/dashboard.module.css";
import { useEffect, useState } from 'react';
import Transactions from "../ui/dashboard/transactions/transactions";
import { handlerUser, handlerAlbum } from '../lib';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const [cards, setCards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const userData = JSON.parse(localStorage.getItem('loggedUser'));
      console.log(userData);
      
      if (!userData.isAdm) {
        router.push('/dashboard/gallery')
      } else {
        const allUsersData = await handlerUser(localStorage.getItem('token'));
        const allAlbumsData = await handlerAlbum(localStorage.getItem('token'));

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