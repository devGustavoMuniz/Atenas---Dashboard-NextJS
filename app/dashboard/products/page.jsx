"use client";

import Image from "next/image";
import styles from "../../ui/dashboard/products/products.module.css";
import Search from "../../ui/dashboard/search/search";
import { useEffect, useState } from 'react';
import Link from "next/link";
import { handleDeleteAlbum, handlerAlbum } from '../../lib';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter, redirect } from 'next/navigation';

const ProductsPage = () => {
  const [albums, setAlbums] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const handleAlbum = async () => {
      const token = localStorage.getItem('token');
      const response = await handlerAlbum(token);
      setAlbums(response);
    };
    handleAlbum();
  }, []);


  console.log(albums);
  

  const setSingleAlbumOnStorage = ({ nomeAluno, numeroContrato }) => {
    const album = albums.find((album) => album.nomeAluno === nomeAluno && album.numeroContrato === numeroContrato);
    if (album) {
      localStorage.setItem('album', JSON.stringify(album));
      router.push('/dashboard/album');
    }
  };

  const setSingleAlbumOnStorageToPhoto = ({ nomeAluno, numeroContrato }) => {
    const album = albums.find((album) => album.nomeAluno === nomeAluno && album.numeroContrato === numeroContrato);
    if (album) {
      localStorage.setItem('album', JSON.stringify(album));
      router.push('/dashboard/image_upload');
    }
  };

  const confirmDeleteAlbum = (album) => {
    setAlbumToDelete(album);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (albumToDelete) {
      const token = localStorage.getItem('token');
      if (!token) {
        redirect('/login');
      } else {
        const response = await handleDeleteAlbum(token, { nomeAluno: albumToDelete.nomeAluno, numeroContrato: albumToDelete.numeroContrato });
        if (response.status === 200) {
          toast("Álbum excluído com sucesso!");
          const updatedResponse = await handlerAlbum(token);
          setAlbums(updatedResponse);
        } else {
          toast("Erro ao excluir álbum");
        }
        setShowModal(false);
        setAlbumToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setAlbumToDelete(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="Busque por um álbum..." />
        <Link href="/dashboard/products/add">
          <button className={styles.addButton}>Adicionar novo</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>N° Contrato</td>
            <td>Nome do Aluno</td>
            <td>Tipo do Álbum</td>
            <td>Cadastrado em</td>
            <td>Ações</td>
          </tr>
        </thead>
        <tbody>
          {albums.map((album) => (
            <tr key={album.nomeAluno}>
              <td>
                <div className={styles.product}>
                  <Image
                    src={"/logoAtenas.jpg"}
                    alt=""
                    width={40}
                    height={40}
                    className={styles.productImage}
                  />
                  {album.numeroContrato}
                </div>
              </td>
              <td>{album.nomeAluno}</td>
              <td>{album.tipoAlbum}</td>
              <td>{album.createdAt}</td>
              <td>
                <div className={styles.buttons}>
                  <button
                    className={`${styles.button} ${styles.view}`}
                    onClick={() => setSingleAlbumOnStorageToPhoto({ nomeAluno: album.nomeAluno, numeroContrato: album.numeroContrato })}
                  >
                    Adicionar Fotos
                  </button>
                  <button
                    className={`${styles.button} ${styles.view}`}
                    onClick={() => setSingleAlbumOnStorage({ nomeAluno: album.nomeAluno, numeroContrato: album.numeroContrato })}
                  >
                    Ver mais
                  </button>
                  <button
                    className={`${styles.button} ${styles.delete}`}
                    onClick={() => confirmDeleteAlbum({ nomeAluno: album.nomeAluno, numeroContrato: album.numeroContrato })}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de confirmação */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <p>Tem certeza que deseja excluir o álbum de {albumToDelete?.nomeAluno}?</p>
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

export default ProductsPage;
