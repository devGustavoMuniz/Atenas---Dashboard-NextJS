"use client"

import Image from "next/image";
import styles from "./transactions.module.css";
import { useEffect, useState } from 'react';
import { handlerUser } from '../../../lib';

const Transactions = () => {

  const [users, setUsers] = useState([]);
  useEffect(() => {
    const handleUser = async () => {
      const token = localStorage.getItem('token');
      const response = await handlerUser(token, "", 0, 6);
      setUsers(response);
    }
    handleUser();
  }, []);

  const formatDate = (dateString) => {
    const [datePart, timePart] = dateString.split(" ");
    const [day, month, year] = datePart.split("-");
    const shortYear = year.slice(2);
    const [hour, minute] = timePart.split(":");

    return `${day}/${month}/${shortYear} - ${hour}:${minute}h`;
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Últimos Registros</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Name</td>
            <td>Email</td>
            <td>Data de registro</td>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.email}>
              <td>
                <div className={styles.user}>
                  <Image
                    src={user.foto?.fotoAssinada || '/noavatar.png'}
                    alt=""
                    width={40}
                    height={40}
                    className={styles.userImage}
                  />
                  {user.nomeUsuario}
                </div>
              </td>
              <td>
                {user.email}
              </td>
              <td>{formatDate(user.createdAt)}</td>
            </tr>
          ))}
          
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
