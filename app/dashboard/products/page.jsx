"use client"

import Image from "next/image";
import styles from "../../ui/dashboard/products/products.module.css";
import Search from "../../ui/dashboard/search/search";
import { useEffect, useState } from 'react';
import Link from "next/link";
import { handlerAlbum } from '../../lib';

const ProductsPage = () => {
  // const q = searchParams?.q || "";
  // const page = searchParams?.page || 1;
  // const { count, products } = await fetchProducts(q, page);

  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const handleAlbum = async () => {
      const token = localStorage.getItem('token');
      const response = await handlerAlbum(token);
      setAlbums(response);
    }
    handleAlbum();
  }, []);

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
      {/* <Pagination count={albums.length} /> */}
    </div>
  );
};

export default ProductsPage;
