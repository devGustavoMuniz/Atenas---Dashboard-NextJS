"use client";

import styles from "../../../ui/dashboard/products/addProduct/addProduct.module.css";
import { useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { redirect } from 'next/navigation';
import { handleAddAlbum, handlerUser } from "../../../lib";
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';

const AddProductPage = () => {
  const [album, setAlbum] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eventTypes, setEventTypes] = useState({
    Passeio: false,
    Baile: false,
    Missa: false,
    Culto: false,
    Colação: false,
    Identificação: false,
  });

  const [files, setFiles] = useState({
    Passeio: [],
    Baile: [],
    Missa: [],
    Culto: [],
    Colação: [],
    Identificação: [],
  });

  useEffect(() => {
    const handleUser = async () => {
      const token = localStorage.getItem('token');
      const response = await handlerUser(token);
      setUsers(response);
    };

    handleUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlbum(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      redirect('/login');
    } else {
      const fd = new FormData();
      
      Object.keys(files).forEach(event => {
        files[event].forEach((file, index) => {
          const customFileName = `${event}~${file.name}`;
          const customFile = new File([file], customFileName, { type: file.type });
          fd.append('image', customFile);
          fd.append('evento[]', event);
        });
      });
  
      fd.append('numeroContrato', 2323);
      fd.append('nomeAluno', 'teste');
      fd.append('tipoAlbum', album.tipoAlbum);
      fd.append('minFotos', album.minFotos);
  
      const response = await handleAddAlbum(token, fd);
      setLoading(false); 

      if (response.status === 201) {
        toast("Album adicionado com sucesso!");
      } else {
        toast("Erro ao adicionar álbum");
      }
    }
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setEventTypes(prevState => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const onDrop = useCallback((acceptedFiles, eventType) => {
    setFiles(prevFiles => ({
      ...prevFiles,
      [eventType]: [...prevFiles[eventType], ...acceptedFiles],
    }));
  }, []);

  // Componente separado para Dropzone
  const DropzoneField = ({ eventType, files, onDrop }) => {
    const { getRootProps, getInputProps } = useDropzone({
      onDrop: (acceptedFiles) => onDrop(acceptedFiles, eventType),
    });

    const images = files.map(file => {
      const imageUrl = URL.createObjectURL(file);
      return (
        <div key={file.path}>
          <Image
            src={imageUrl}
            alt={file.path}
            width={100}
            height={100}
          />
        </div>
      );
    });

    return (
      <div key={eventType}>
        <h4>{eventType}</h4>
        <label className={styles.dropzone}>
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            {images.length === 0 && <p>Arraste as imagens aqui ou clique para selecioná-las</p>}
          </div>
          <aside>
            {images.length > 0 && (
              <div className={styles.imagesWrapper}>
                {images}
              </div>
            )}
          </aside>
        </label>
      </div>
    );
  };

  const usersOption = users.map(user => (
    <option key={user.numeroContrato + user.nomeUsuario} value={JSON.stringify({ nome: user.nomeUsuario, numeroContrato: user.numeroContrato })}>{`${user.nomeUsuario} (${user.numeroContrato})`}</option>
  ));

  return (
    <div className={styles.container}>
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
        </div>
      )}
      <div className={styles.form}>
        <select name="contratoEAluno" required onChange={handleChange}>
          <option value="">Selecione o Aluno do Álbum</option>
          {usersOption}
        </select>
        <div className={styles.numPageWrapper}>
          <input className={styles.input} type="number" placeholder="Número máximo de páginas" name="minFotos" required onChange={handleChange} />
          <input className={styles.input} type="text" placeholder="Tipo do Álbum" name="tipoAlbum" required onChange={handleChange} />
        </div>
        <div className={styles.checkboxArea}>
          <h4>Tipos de Evento:</h4>
          <div className={styles.wrapper}>
            {Object.keys(eventTypes).map((event) => (
              <div key={event}>
                <label>
                  <input
                    type="checkbox"
                    name={event}
                    checked={eventTypes[event]}
                    onChange={handleCheckboxChange}
                  />
                  {event}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.dropzonesSection}>
          {Object.keys(eventTypes).map((eventType) => (
            eventTypes[eventType] && (
              <DropzoneField
                key={eventType}
                eventType={eventType}
                files={files[eventType]}
                onDrop={onDrop}
              />
            )
          ))}
        </div>
        <button onClick={handleSubmit}>Adicionar Álbum</button>
      </div>
      <ToastContainer position="top-center" theme="dark" />
    </div>
  );
};

export default AddProductPage;
