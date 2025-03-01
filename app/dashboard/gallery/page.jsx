"use client";

import { getAlbumByContract, getUserByUsername } from "@libs";
import styles from "../../ui/gallery/gallery.module.css";
import jwt from 'jsonwebtoken';
import { useEffect, useState } from "react";

const Gallery = () => {
  const [photosByEvent, setPhotosByEvent] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [imageClasses, setImageClasses] = useState({});


  const eventNamesMap = {
    baile: "Baile",
    colacao: "Colação",
    culto: "Culto",
    identificacao: "Identificação",
    missa: "Missa",
    passeio: "Passeio"
  };
  

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

        const selectedEventLS = localStorage.getItem('event');
        if (selectedEventLS) setSelectedEvent(selectedEventLS);
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

  useEffect(() => {
    const classifyImages = () => {
      const newClasses = {};
      Object.values(photosByEvent).flat().forEach((src, index) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          newClasses[src] = img.width < img.height ? styles.portrait : "";
          setImageClasses(prev => ({ ...prev, ...newClasses }));
        };
      });
    };

    if (Object.keys(photosByEvent).length > 0) classifyImages();
  }, [photosByEvent]);

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
              {eventNamesMap[eventName] || eventName}
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
                className={`${styles.photo} ${imageClasses[src] || ""}`}
                onClick={() => setFullScreenImage(src)}
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
