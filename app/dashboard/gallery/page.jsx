"use client";

import { getAlbumByContract, getUserByUsername } from "@libs";
import styles from "../../ui/gallery/gallery.module.css";
import jwt from 'jsonwebtoken';
import { useEffect, useState } from "react";

const Gallery = () => {
  const [photosByEvent, setPhotosByEvent] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const decodedToken = jwt.decode(token);
      const userData = await getUserByUsername(token, decodedToken.nomeUsuario);
      localStorage.setItem('loggedUser', JSON.stringify(userData));
      const albumData = await getAlbumByContract(localStorage.getItem("token"), userData);

      if (albumData.length > 0) {
        const album = albumData[0];
        const formattedPhotos = {};

        Object.entries(album.eventos || {}).forEach(([eventName, evento]) => {
          if (evento.isExist && evento.fotos) {
            formattedPhotos[eventName] = evento.fotos.map(foto => foto.fotoAssinada);
          }
        });

        setPhotosByEvent(formattedPhotos);

        // Define automaticamente o primeiro evento como selecionado
        const firstEvent = Object.keys(formattedPhotos)[0];
        if (firstEvent) setSelectedEvent(firstEvent);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setFullScreenImage(null);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Navegação de eventos */}
        <p>Selecione um evento:</p>

        <div className={styles.eventTabs}>
          {Object.keys(photosByEvent).map(eventName => (
            <button
              key={eventName}
              className={selectedEvent === eventName ? styles.activeTab : styles.tab}
              onClick={() => setSelectedEvent(eventName)}
            >
              {eventName}
            </button>
          ))}
        </div>

        {/* Exibição das fotos do evento selecionado */}
        <div className={styles.gallery}>
          {selectedEvent && photosByEvent[selectedEvent] ? (
            photosByEvent[selectedEvent].map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Foto ${index}`}
                className={styles.photo}
                onClick={() => setFullScreenImage(src)} // Ao clicar, exibe a imagem em tela cheia
              />
            ))
          ) : (
            <p>Nenhuma foto disponível</p>
          )}
        </div>
      </div>
      {fullScreenImage && (
        <div className={styles.modal} onClick={() => setFullScreenImage(null)}>
          <img src={fullScreenImage} alt="Imagem em tela cheia" className={styles.fullScreenImage} />
        </div>
      )}
    </div>
    
  );
};

export default Gallery;
