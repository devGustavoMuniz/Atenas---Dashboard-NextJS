"use client"

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
  // const q = searchParams?.q || "";
  // const page = searchParams?.page || 1;
  // const { count, products } = await fetchProducts(q, page);

  const [albums, setAlbums] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const handleAlbum = async () => {
      const token = localStorage.getItem('token');
      const response = await handlerAlbum(token);
      setAlbums(response);
    }
    handleAlbum();
  }, []);

  const setSingleAlbumOnStorage = ({ nomeAluno, numeroContrato }) => {
    const album = albums.find((album) => album.nomeAluno === nomeAluno && album.numeroContrato === numeroContrato);
    if (album) {
      localStorage.setItem('album', JSON.stringify(album));
      router.push('/dashboard/album');
    }
  };

  const deleteUser = async ({ nomeAluno, numeroContrato }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      redirect('/login');
    } else {
      const response = await handleDeleteAlbum(token, { nomeAluno, numeroContrato });
      if (response.status === 200) {
        toast("Usuário excluído com sucesso!");
        const updatedResponse = await handlerAlbum(token);
        setAlbums(updatedResponse);
      } else {
        toast("Erro ao excluir usuário");
      }
    }
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
                    onClick={() => setSingleAlbumOnStorage({ nomeAluno: album.nomeAluno, numeroContrato: album.numeroContrato })}
                  >
                    View
                  </button>
                  <div>
                    <button
                      className={`${styles.button} ${styles.delete}`}
                      onClick={() => deleteUser({ nomeAluno: album.nomeAluno, numeroContrato: album.numeroContrato })}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer position="top-center" theme="dark" />
      {/* <Pagination count={albums.length} /> */}
    </div>
  );
};

export default ProductsPage;
