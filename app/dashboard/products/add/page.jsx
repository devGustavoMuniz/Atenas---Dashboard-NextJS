"use client";

import styles from "../../../ui/dashboard/products/addProduct/addProduct.module.css";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { redirect } from 'next/navigation';
import {useDropzone} from 'react-dropzone';
import { handleAddAlbum } from "../../../lib";

const AddProductPage = () => {
  const [user, setUser] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
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
        fd.append('numeroContrato', user.numeroContrato);
        fd.append('nomeAluno', user.nomeAluno);
        fd.append('evento[]', ['missa', 'casamento']);
        fd.append('tipoAlbum', user.tipoAlbum);
        const response = await handleAddAlbum(token, fd);
        console.log('res form: ', response);
    }
  }

  const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <input type="text" placeholder="Número do Contrato" name="numeroContrato" required onChange={handleChange} />
        <input type="text" placeholder="Nome do Aluno" name="nomeAluno" required onChange={handleChange} />
        <input type="text" placeholder="Tipo do Álbum" name="tipoAlbum" required onChange={handleChange} />
        <div>
        <input type="text" placeholder="Evento" name="evento" required onChange={handleChange} />
        </div>
        <section className={styles.dropzone}>
          <div {...getRootProps({className: 'dropzone'})}>
            <input {...getInputProps()} />
            {files.length === 0 && <p>Arraste as imagens aqui ou clique para selecioná-las</p>}
          </div>
          <aside>
            <h4>Imagens:</h4>
            <ul>{files}</ul>
          </aside>
        </section>
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
