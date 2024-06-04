"use client";

import styles from "../../../ui/dashboard/products/addProduct/addProduct.module.css";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { redirect } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { handleAddAlbum, handlerUser } from "../../../lib";
import Image from 'next/image';

const AddProductPage = () => {
  const [album, setAlbum] = useState([]);
  const [users, setUsers] = useState([]);
  const [eventTypes, setEventTypes] = useState({
    Passeio: false,
    Baile: false,
    Missa: false,
    Culto: false,
    Colação: false,
    Identificação: false,
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
    const token = localStorage.getItem('token');
    if (!token) {
        redirect('/login');
    } else {
        const fd = new FormData();
        acceptedFiles.forEach((file) => {
          fd.append('image', file);
        });
        const selectedUser = JSON.parse(album.contratoEAluno);
        fd.append('numeroContrato', selectedUser.numeroContrato);
        fd.append('nomeAluno', selectedUser.nome);
        Object.keys(eventTypes).forEach((key) => {
          if (eventTypes[key]) {
            fd.append('evento[]', key);
          }
        });
        fd.append('tipoAlbum', album.tipoAlbum);
        fd.append('minFotos', album.minFotos);
        fd.append('maxFotos', album.maxFotos);
        const response = await handleAddAlbum(token, fd);
        if (response.status === 201) {
          toast("Album adicionado com sucesso!")
        } else {
          toast("F")
        }
    }
  }

  const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
  const images = acceptedFiles.map(file => {
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

  const usersOption = users.map(user => (
    <option key={user.numeroContrato + user.nomeUsuario} value={JSON.stringify({ nome: user.nomeUsuario, numeroContrato: user.numeroContrato })}>{`${user.nomeUsuario} (${user.numeroContrato})`}</option>
  ));

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setEventTypes(prevState => ({
      ...prevState,
      [name]: checked,
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <select name="contratoEAluno" required onChange={handleChange}>
          <option value="">Selecione o Aluno do Álbum</option>
          {usersOption}
        </select>
        <div className={styles.numPageWrapper}>
          <input className={styles.input} type="number" placeholder="Número mínimo de páginas" name="minFotos" required onChange={handleChange} />
          <input className={styles.input} type="number" placeholder="Número máximo de páginas" name="maxFotos" required onChange={handleChange} />
        </div>
        <input className={styles.input} type="text" placeholder="Tipo do Álbum" name="tipoAlbum" required onChange={handleChange} />
        <div className={styles.checkboxArea}>
          <h4>Tipos de Evento:</h4>
          <div className={styles.wrapper}>
            <label>
              <input
                type="checkbox"
                name="Passeio"
                checked={eventTypes.Passeio}
                onChange={handleCheckboxChange}
              />
              Passeio
            </label>
            <label>
              <input
                type="checkbox"
                name="Baile"
                checked={eventTypes.Baile}
                onChange={handleCheckboxChange}
              />
              Baile
            </label>
            <label>
              <input
                type="checkbox"
                name="Missa"
                checked={eventTypes.Missa}
                onChange={handleCheckboxChange}
              />
              Missa
            </label>
            <label>
              <input
                type="checkbox"
                name="Culto"
                checked={eventTypes.Culto}
                onChange={handleCheckboxChange}
              />
              Culto
            </label>
            <label>
              <input
                type="checkbox"
                name="Colação"
                checked={eventTypes.Colação}
                onChange={handleCheckboxChange}
              />
              Colação
            </label>
            <label>
              <input
                type="checkbox"
                name="Identificação"
                checked={eventTypes.Identificação}
                onChange={handleCheckboxChange}
              />
              Identificação
            </label>
          </div>
        </div>
        <label className={styles.dropzone}>
          <div {...getRootProps({className: 'dropzone'})}>
            <input {...getInputProps()} />
            {images.length === 0 && <p>Arraste as imagens aqui ou clique para selecioná-las</p>}
          </div>
          <aside>
            {images.length > 0 && (
                <div className={styles.imagesWrapper}>
                  <Image 
                    src={'/addmais.png'} 
                    alt={'noavatar'} 
                    width={100} 
                    height={100} 
                  />
                  {images}
                </div>
              )
            }
          </aside>
        </label>
        <button onClick={handleSubmit}>Adicionar Usuário</button>
      </div>
      <ToastContainer
        position="top-center"
        theme="dark"
      />
    </div>
  );
};

export default AddProductPage;
