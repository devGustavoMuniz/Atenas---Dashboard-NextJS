"use client";

import styles from "../../ui/dashboard/users/users.module.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { handleDeleteUser, handlerUser } from '../../lib';
import { useRouter, redirect } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdSearch } from "react-icons/md";
import { useDebouncedCallback } from "use-debounce";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const router = useRouter();

  const handleUser = async () => {
    const token = localStorage.getItem('token');
    const response = await handlerUser(token);
    setUsers(response);
    setFilteredUsers(response);
  };

  useEffect(() => {
    handleUser();
  }, []);

  const setSingleUserOnStorage = ({ nome, email }) => {
    const user = users.find((user) => user.nomeUsuario === nome && user.email === email);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      router.push('/dashboard/user');
    }
  };

  const confirmDeleteUser = (user) => {
    setUserToDelete(user);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      const token = localStorage.getItem('token');
      if (!token) {
        redirect('/login');
      } else {
        const response = await handleDeleteUser(token, { nomeUsuario: userToDelete.nomeUsuario, email: userToDelete.email });
        if (response.status === 200) {
          toast("Usuário excluído com sucesso!");
          const updatedResponse = await handlerUser(token);
          setUsers(updatedResponse);
        } else {
          toast("Erro ao excluir usuário");
        }
        setShowModal(false);
        setUserToDelete(null);
      }
    }
  };
  
  const handleSearch = useDebouncedCallback((e) => {
    const value = e.target.value.trim();
    console.log('value > ', value);
    
    if (value) {
      const filtered = users.filter((user) =>
        user.numeroContrato.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, 300);

  const handleCancelDelete = () => {
    setShowModal(false);
    setUserToDelete(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.search}>
          <MdSearch />
          <input
            type="text"
            placeholder="Busque por um usuário..."
            className={styles.input}
            onChange={handleSearch}
          />
        </div>
        <Link href="/dashboard/users/add">
          <button className={styles.addButton}>Adicionar novo</button>
        </Link>
      </div>

      {filteredUsers.length === 0 ? (<p className={styles.notFound}>Nenhum album encontrado</p>) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <td>N° Contrato</td>
              <td>Nome</td>
              <td>Email</td>
              <td>Telefone</td>
              <td>Ações</td>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.email}>
                <td>
                  <div className={styles.user}>
                    <Image
                      src={user.foto?.fotoAssinada || "/noavatar.png"}
                      alt=""
                      width={40}
                      height={40}
                      className={styles.userImage}
                    />
                    {user.numeroContrato}
                  </div>
                </td>
                <td>{user.nomeUsuario}</td>
                <td>{user.email}</td>
                <td>{user.telefone}</td>
                <td>
                  <div className={styles.buttons}>
                    <button
                      className={`${styles.button} ${styles.view}`}
                      onClick={() => setSingleUserOnStorage({ nome: user.nomeUsuario, email: user.email })}
                    >
                      Ver mais
                    </button>
                    <button
                      className={`${styles.button} ${styles.delete}`}
                      onClick={() => confirmDeleteUser({ nomeUsuario: user.nomeUsuario, email: user.email })}
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal de confirmação */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <p>Tem certeza que deseja excluir o usuário {userToDelete?.nomeUsuario}?</p>
            <div className={styles.modalButtons}>
              <button className={styles.cancelButton} onClick={handleCancelDelete}>Cancelar</button>
              <button className={styles.confirmButton} onClick={handleConfirmDelete}>Confirmar</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" theme="dark" />
    </div>
  );
};

export default UsersPage;
