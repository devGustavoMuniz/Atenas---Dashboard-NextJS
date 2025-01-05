"use client";

import Image from "next/image";
import styles from "../../ui/dashboard/products/products.module.css";
import { useEffect, useState } from 'react';
import Link from "next/link";
import { handleDeleteAlbum, handlerAlbum } from '../../lib';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter, redirect } from 'next/navigation';
import { MdSearch } from "react-icons/md";
import { useDebouncedCallback } from "use-debounce";

const ProductsPage = () => {
  const [albums, setAlbums] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState(null);
  const router = useRouter();

  const handleAlbum = async () => {
    const token = localStorage.getItem('token');
    const response = await handlerAlbum(token);
    setAlbums(response);
    setFilteredAlbums(response);
  };

  useEffect(() => {
    handleAlbum();
  }, []);

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
          setFilteredAlbums(updatedResponse);
        } else {
          toast("Erro ao excluir álbum");
        }
        setShowModal(false);
        setAlbumToDelete(null);
      }
    }
  };

  const handleSearch = useDebouncedCallback((e) => {
    const value = e.target.value.toLowerCase();
    if (value) {
      const filtered = albums.filter((album) =>
        album.numeroContrato.toLowerCase().includes(value)
      );
      setFilteredAlbums(filtered);
    } else {
      setFilteredAlbums(albums);
    }
  }, 300);

  const handleCancelDelete = () => {
    setShowModal(false);
    setAlbumToDelete(null);
  };

  const formatDate = (dateString) => {
    const [datePart, timePart] = dateString.split(" ");
    const [day, month, year] = datePart.split("-");
    const shortYear = year.slice(2);
    const [hour, minute] = timePart.split(":");

    return `${day}/${month}/${shortYear} - ${hour}:${minute}h`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.search}>
          <MdSearch />
          <input
            type="text"
            placeholder="Busque por um álbum..."
            className={styles.input}
            onChange={handleSearch}
          />
        </div>
        <Link href="/dashboard/products/add">
          <button className={styles.addButton}>Adicionar novo</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>N° Contrato</td>
            <td>Nome do Usuário</td>
            <td>Tipo do Álbum</td>
            <td>Cadastrado em</td>
            <td>Ações</td>
          </tr>
        </thead>
        <tbody>
          {filteredAlbums.map((album) => (
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
              <td>{formatDate(album.createdAt)}</td>
              <td>
                <div className={styles.buttons}>
                  <button
                    className={`${styles.button} ${styles.view}`}
                    onClick={() => setSingleAlbumOnStorageToPhoto({ nomeAluno: album.nomeAluno, numeroContrato: album.numeroContrato })}
                  >
                    Ver fotos
                  </button>
                  <button
                    className={`${styles.button} ${styles.view}`}
                    onClick={() => setSingleAlbumOnStorage({ nomeAluno: album.nomeAluno, numeroContrato: album.numeroContrato })}
                  >
                    Ver dados
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
