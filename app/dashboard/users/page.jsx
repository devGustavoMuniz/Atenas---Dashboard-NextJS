"use client";

import styles from "../../ui/dashboard/users/users.module.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { handleDeleteUser, handlerUser, getUserLength } from '../../lib';
import { useRouter, redirect } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdSearch } from "react-icons/md";
import Pagination from '@mui/material/Pagination';
import { useDebouncedCallback } from "use-debounce";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [offset, setOffset] = useState(0);
  const [searchParam, setSearchParam] = useState("");
  const [countUsers, setCountUsers] = useState(0);
  const router = useRouter();

  const MAX_USERS_PER_PAGE = 9;

  

  useEffect(() => {
    const handleUser = async () => {
      const token = localStorage.getItem('token');
      const response = await handlerUser(token, searchParam, offset, MAX_USERS_PER_PAGE);
      setUsers(response);
    };
    handleUser();

    const handlerUserLength = async () => {
      const token = localStorage.getItem('token');
      const response = await getUserLength(token, searchParam, offset, MAX_USERS_PER_PAGE);
  
      setCountUsers(response);
    };
    handlerUserLength();
  }, [offset, searchParam]);

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

  const handleCancelDelete = () => {
    setShowModal(false);
    setUserToDelete(null);
  };
  
  const handleSearch = useDebouncedCallback((e) => {
    const value = e.target.value.trim();
    
    if (value) {
      setSearchParam(value);
      return;
    }
    setSearchParam("");
  }, 300);

  const handlePagination = (e, value) => {
    setOffset((value - 1) * MAX_USERS_PER_PAGE);
  }

  return (
    <div className={styles.container}>
      <div>
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

        {users.length === 0 ? (<p className={styles.notFound}>Nenhum usuário encontrado</p>) : (
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
              {users.map((user) => (
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
        <ToastContainer position="top-center" theme="dark" />
      </div>

      {users.length > 0 && (
        <div className={styles.teste}>
          <Pagination count={Math.ceil(countUsers / MAX_USERS_PER_PAGE)} onChange={handlePagination} variant="outlined" shape="rounded" />
        </div>
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

      
    </div>
  );
};

export default UsersPage;
