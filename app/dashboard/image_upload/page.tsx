'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './image_upload.module.css';
import { FaTrash, FaCloudUploadAlt } from 'react-icons/fa';
import Image from 'next/image';
import { deleteFoto, handlerDeleteFoto, handlerUploadFotos } from '../../lib';
import { redirect } from 'next/navigation';

interface SelectedFile extends File {
  preview?: string;
}

interface Foto {
  filename: string;
  fotoAssinada: string;
  id: string;
  _id: string;
  evento: string;
}

interface Evento {
  id: string;
  isExist: boolean;
  fotos: Foto[];
}

interface Album {
  id: string;
  numeroContrato: string;
  nomeAluno: string;
  tipoAlbum: string;
  createdAt: string;
  minFotos: number;
  eventos: {
      passeio?: Evento;
      baile?: Evento;
      missa?: Evento;
  };
}

export default function UploadPage() {
  const [eventTypes, setEventTypes] = useState({
    passeio: false,
    baile: false,
    missa: false,
    culto: false,
    colacao: false,
    identificacao: false,
  });
  const [selectedFilesByEvent, setSelectedFilesByEvent] = useState<Record<string, SelectedFile[]>>({});
  const [album, setAlbum] = useState<Album>();
  const [activeTab, setActiveTab] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedAlbum = JSON.parse(localStorage.getItem('album')) as Album;
    setAlbum(storedAlbum);
    console.log(storedAlbum);
    
  
    // Identificar os eventos habilitados
    const eventosComIsExist = Object.entries(storedAlbum.eventos)
      .filter(([_, evento]) => evento.isExist)
      .map(([nomeEvento]) => nomeEvento);
  
    // Atualizar o estado de eventTypes
    const updatedEventTypes = {
      passeio: eventosComIsExist.includes('passeio'),
      baile: eventosComIsExist.includes('baile'),
      missa: eventosComIsExist.includes('missa'),
      culto: eventosComIsExist.includes('culto'),
      colacao: eventosComIsExist.includes('colacao'),
      identificacao: eventosComIsExist.includes('identificacao'),
    };
    setEventTypes(updatedEventTypes);
  
    // Inicializar as listas de arquivos apenas para eventos habilitados
    const enabledEventFiles = Object.keys(updatedEventTypes)
      .filter((type) => updatedEventTypes[type])
      .reduce((acc, type) => {
        acc[type] = [];
        return acc;
      }, {} as Record<string, SelectedFile[]>);
  
    setSelectedFilesByEvent(enabledEventFiles);
  
    // Definir a primeira aba habilitada como ativa
    const firstEnabledTab = Object.keys(updatedEventTypes).find((type) => updatedEventTypes[type]);
    if (firstEnabledTab) setActiveTab(firstEnabledTab);
  }, []);
  

  

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    const toBase64 = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

    Promise.all(
      files.map(async (file) => {
        if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
          const preview = await toBase64(file);
          return Object.assign(file, { preview });
        }
        return null;
      })
    ).then((results) => {
      const validFiles = results.filter((file) => file) as SelectedFile[];
      setSelectedFilesByEvent((prevFiles) => ({
        ...prevFiles,
        [activeTab]: [...(prevFiles[activeTab] || []), ...validFiles],
      }));

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    });
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setSelectedFilesByEvent((prevFiles) => ({
      ...prevFiles,
      [activeTab]: prevFiles[activeTab].filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveTab(event.target.value);
  };

  const handleUpload = async () => {
    if (!selectedFilesByEvent[activeTab] || selectedFilesByEvent[activeTab].length === 0) {
      alert(`Nenhuma foto adicionada para o evento ${activeTab}.`);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await handlerUploadFotos(token, album, selectedFilesByEvent[activeTab], activeTab);
      
      alert('Fotos enviadas com sucesso!');
      setSelectedFilesByEvent((prevFiles) => ({
        ...prevFiles,
        [activeTab]: [],
      }));
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao enviar as fotos.');
    }
  };

  const handleDeleteImage = async (foto: Foto) => {
    const token = localStorage.getItem('token');
    if (!token) {
      redirect('/login');
      return;
    }
  
    try {
      // Chama a função para deletar a foto
      await handlerDeleteFoto(token, foto.id, foto.evento);
      console.log('Foto deletada com sucesso.');
  
      // Atualiza o estado do álbum, removendo a foto correspondente
      setAlbum((prevAlbum) => {
        if (!prevAlbum) return prevAlbum;
  
        const updatedEventos = {
          ...prevAlbum.eventos,
          [foto.evento]: {
            ...prevAlbum.eventos[foto.evento],
            fotos: prevAlbum.eventos[foto.evento].fotos.filter((f) => f.id !== foto.id),
          },
        };
  
        return { ...prevAlbum, eventos: updatedEventos };
      });
    } catch (error) {
      console.error('Erro ao deletar a foto:', error);
      alert('Não foi possível excluir a foto. Tente novamente.');
    }
  };
  

  return (
    <div className={styles.mainWrapper}>
      {isEditing && (
      <div className={styles.container}>
        <h1 className={styles.title}>Álbum de {album?.nomeAluno}</h1>

        <div className={styles.tabWrapper}>
          <select
          name="numeroContrato"
          required
          onChange={handleSelectChange}
          >
              <option value="" disabled>Selecione um Evento</option>
              {eventTypes &&
              Object.keys(eventTypes)
              .filter((type) => eventTypes[type])
              .map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
          </select>
          <button className={styles.uploadButton} onClick={() => setIsEditing(false)}>
            Ver fotos cadastradas
          </button>
        </div>

        {/* Input de arquivos */}
        <div className={styles.inputWrapper}>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className={styles.fileInput}
            id="file-upload"
          />
          <label htmlFor="file-upload" className={styles.fileLabel}>
            <FaCloudUploadAlt className={styles.uploadIcon} />
            <span>Adicionar fotos para {activeTab}</span>
          </label>
        </div>

        {/* Lista de arquivos */}
        {selectedFilesByEvent[activeTab]?.length > 0 && (
          <div>
            <h3 className={styles.fileListTitle}>Fotos selecionadas para {activeTab}:</h3>
            <ul className={styles.fileList}>
              {selectedFilesByEvent[activeTab].map((file, index) => (
                <li key={index} className={styles.fileListItem}>
                  <div className={styles.fileInfo}>
                    <Image src={file.preview} alt={file.name} width="25" height="25" className={styles.filePreview} />
                    <span className={styles.fileName}>{file.name}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className={styles.removeButton}
                    aria-label="Remover foto"
                  >
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
            <div className={styles.uploadButtonWrapper}>
              <button onClick={handleUpload} className={styles.uploadButton}>
                Cadastrar fotos de {activeTab}
              </button>
            </div>
          </div>
        )}
      </div>
      )}

      {!isEditing && (
        <div className={styles.container}>
          <h1 className={styles.title}>Álbum de {album?.nomeAluno}</h1>

          <div className={styles.tabWrapper}>
            <select
            name="numeroContrato"
            required
            onChange={handleSelectChange}
            >
                <option value="" disabled>Selecione um Evento</option>
                {eventTypes &&
                Object.keys(eventTypes)
                .filter((type) => eventTypes[type])
                .map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
            </select>
            <button className={styles.uploadButton} onClick={() => setIsEditing(true)}>
              Cadastrar novas fotos
            </button>
          </div>

          <div className={styles.fotosWrapper}>
            {album?.eventos[activeTab].fotos.map((foto) => (
              <div key={foto.id} className={styles.imageContainer}>
              <Image loading="lazy" src={foto.fotoAssinada} alt={foto.filename} width={100} height={100} />
              <button 
                className={styles.deleteButton} 
                onClick={() => handleDeleteImage(foto)}
              >
                <FaTrash />
              </button>
              </div>
            ))}
          </div>
        </div>
        )}
    </div>
  );
}
