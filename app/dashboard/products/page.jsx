"use client"

import Image from "next/image";
import styles from "../../ui/dashboard/products/products.module.css";
import Pagination from "../../ui/dashboard/pagination/pagination";
import Search from "../../ui/dashboard/search/search";
import { useEffect, useState } from 'react';
import { handlerAlbum } from '../../lib';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductsPage = () => {
  // const q = searchParams?.q || "";
  // const page = searchParams?.page || 1;
  // const { count, products } = await fetchProducts(q, page);

  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const handleAlbum = async () => {
      const token = localStorage.getItem('token');
      console.log("antes req");
      const response = await handlerAlbum(token);
      console.log('dfdsf: ', response);
      setAlbums(response);
      console.log('albuns: ', albums);
    }
    handleAlbum();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="Busque por um álbum..." />
        <button className={styles.addButton}>Adicionar Novo</button>
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
            <tr key={album.email}>
              <td>
                <div className={styles.product}>
                  <Image
                    src={"/noproduct.jpg"}
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
                  <button className={`${styles.button} ${styles.view}`}>
                    View
                  </button>
                  <div>
                    <button className={`${styles.button} ${styles.delete}`}>
                      Delete
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer
        position="top-center"
        theme="dark"
      />
      {/* <Pagination count={albums.length} /> */}
    </div>
  );
};

export default ProductsPage;
