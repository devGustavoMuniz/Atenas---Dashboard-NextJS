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

  const [userData, setUserData] = useState(null);

  useEffect(() => {
      const storedUser = localStorage.getItem('loggedUser');
      if (storedUser) {
          setUserData(JSON.parse(storedUser));
      }
  }, []);

  useEffect(() => {
      if (userData === null) return;

      const fetchData = async () => {
          if (!userData?.isAdm) {
              router.push('/dashboard/gallery');
              return;
          }

          const token = localStorage.getItem('token');
          if (!token) {
              console.log("Token não encontrado!");
              return;
          }

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
      };

      fetchData();
  }, [userData]);

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