"use client"

import Card from "../ui/dashboard/card/card";
import styles from "../ui/dashboard/dashboard.module.css";
import { useEffect, useState } from 'react';
import Transactions from "../ui/dashboard/transactions/transactions";
import { handlerUser, validate } from '../lib';
import { redirect, useRouter } from 'next/navigation'

const Dashboard = () => {
  const [cards, setCards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      redirect('/login');
    }

    const tokenVerify = async (token) => {
      const res = await validate(token);
      !res && router.push('/login');
    };
    // tokenVerify(token);
    const fetchData = async () => {
      const allUsersData = await handlerUser(localStorage.getItem('token'));
      setCards([
        {
          id: 1,
          title: "Usuários totais",
          number: allUsersData.length,
        },
        {
          id: 2,
          title: "Usuários totais",
          number: allUsersData.length,
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