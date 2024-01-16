import Image from "next/image";
import styles from "./transactions.module.css";
import { fetchUsers } from "../../../lib/data";

const Transactions = async () => {
  const { count, users } = await fetchUsers("", 1);
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Últimos Registros</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Name</td>
            <td>Email</td>
            <td>Status</td>
            <td>Data de registro</td>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <div className={styles.user}>
                  <Image
                    src="/noavatar.png"
                    alt=""
                    width={40}
                    height={40}
                    className={styles.userImage}
                  />
                  {user.username}
                </div>
              </td>
              <td>
                {user.email}
              </td>
              <td>
                <span className={`${styles.status} ${user.isActive ? styles.done : styles.cancelled}`}>
                  {user.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td>{user.createdAt?.toString().slice(4, 16)}</td>
            </tr>
          ))}
          
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
