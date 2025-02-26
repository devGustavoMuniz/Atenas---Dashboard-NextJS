"use client"

import Card from "../ui/dashboard/card/card";
import styles from "../ui/dashboard/dashboard.module.css";
import { useEffect, useState } from 'react';
import Transactions from "../ui/dashboard/transactions/transactions";
import { handlerUser, handlerAlbum } from '../lib';

const Dashboard = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
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