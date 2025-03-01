"use client"

import Card from "../ui/dashboard/card/card";
import styles from "../ui/dashboard/dashboard.module.css";
import { useEffect, useState } from 'react';
import Transactions from "../ui/dashboard/transactions/transactions";
import { handlerUser, handlerAlbum, getUserByUsername, getAlbumByContract } from '../lib';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';

const Dashboard = () => {
  const [cards, setCards] = useState([]);
  const router = useRouter();
  const [user, setUser] = useState({});
  const [baile, setBaile] = useState(false);
  const [colacao, setColacao] = useState(false);
  const [culto, setCulto] = useState(false);
  const [identificacao, setIdentificacao] = useState(false);
  const [missa, setMissa] = useState(false);
  const [passeio, setPasseio] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');

      const decodedToken = jwt.decode(token);
      const userData = await getUserByUsername(token, decodedToken.nomeUsuario);

      setUser(user);

      if (!userData.isAdm) {
        const albumData = await getAlbumByContract(token, userData);
        console.log(albumData);
        const eventos = albumData[0].eventos;

        if (eventos.baile.fotos.length > 0) {
          setBaile(eventos.baile.fotos[0].fotoAssinada)
        }

        if (eventos.colacao.fotos.length > 0) {
          setColacao(eventos.colacao.fotos[0].fotoAssinada)
        }

        if (eventos.culto.fotos.length > 0) {
          setCulto(eventos.culto.fotos[0].fotoAssinada)
        }

        if (eventos.identificacao.fotos.length > 0) {
          setIdentificacao(eventos.identificacao.fotos[0].fotoAssinada)
        }

        if (eventos.missa.fotos.length > 0) {
          setMissa(eventos.missa.fotos[0].fotoAssinada)
        }

        if (eventos.passeio.fotos.length > 0) {
          setPasseio(eventos.passeio.fotos[0].fotoAssinada)
        }
      }
      
      if (userData.isAdm) {
        const allUsersData = await handlerUser(token);
        const allAlbumsData = await handlerAlbum(token);
        setCards([
          {
            id: 1,
            title: "Usuários totais",
            number: allUsersData.length,
          },
          {
            id: 2,
            title: "Álbuns totais",
            number: allAlbumsData.length,
          },
        ]);
      }
    }
    fetchData();
  }, []);

  const goToGallery = (event) => {
    return () => {
      localStorage.setItem('event', event);
      router.push(`/dashboard/gallery`);
    }
  }

  if (user.isAdm) {
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
  }

  if (!user.isAdm) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.mainFormando}>
          <p>Selecione o Evento</p>
          <div className={styles.mainFormando2}>
            {baile && (
              <div className={styles.mainFormando3}>
                <div className={styles.mainFormando4} onClick={goToGallery('baile')}>
                  <img src={baile} alt="Baile" />
                </div>
                <p>Baile</p>
                
              </div>
            )}
            {colacao && (
              <div className={styles.mainFormando3}>
                <div className={styles.mainFormando4} onClick={goToGallery('colacao')}>
                  <img src={colacao} alt="Colação" />
                </div>
                <p>Colação</p>
                
              </div>
            )}
            {culto && (
              <div className={styles.mainFormando3}>
                <div className={styles.mainFormando4} onClick={goToGallery('culto')}>
                  <img src={culto} alt="Culto" />
                </div>
                <p>Culto</p>
                
              </div>
            )}
            {identificacao && (
              <div className={styles.mainFormando3}>
                <div className={styles.mainFormando4} onClick={goToGallery('identificacao')}>
                  <img src={identificacao} alt="Identificação" />
                </div>
                <p>Identificação</p>
                
              </div>
            )}
            {missa && (
              <div className={styles.mainFormando3}>
                <div className={styles.mainFormando4} onClick={goToGallery('missa')}>
                  <img src={missa} alt="Missa" />
                </div>
                <p>Missa</p>
                
              </div>
            )}
            {passeio && (
              <div className={styles.mainFormando3}>
                <div className={styles.mainFormando4} onClick={goToGallery('passeio')}>
                  <img src={passeio} alt="Passeio" />
                </div>
                <p>Passeio</p>
                
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default Dashboard;