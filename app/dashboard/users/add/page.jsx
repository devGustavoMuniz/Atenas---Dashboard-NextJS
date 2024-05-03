"use client";

import { handleAddUser } from "../../../lib";
import styles from "../../../ui/dashboard/users/addUser/addUser.module.css";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { redirect } from 'next/navigation';

const AddUserPage = () => {
  const [user, setUser] = useState([]);

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
        document.getElementById('batata').style.backgroundImage = `url(${reader.result})`;
        setUser(prevUser => ({
        ...prevUser,
            foto: reader.result
        }));
    };

    file && reader.readAsDataURL(file);
  };

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
        const response = await handleAddUser(token, user);
        if (response.status === 201) {
            toast("Usuário atualizado com sucesso!")
            localStorage.setItem('user', JSON.stringify(user))
        } else {
            toast("F")
        }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <input type="text" placeholder="Número do Contrato" name="numeroContrato" required onChange={handleChange} />
        <input type="text" placeholder="Nome da escola" name="nomeEscola" required onChange={handleChange} />
        <input type="text" placeholder="Nome" name="nomeUsuario" required onChange={handleChange} />
        <input type="email" placeholder="Email" name="email" required onChange={handleChange} />
        <input type="text" placeholder="Turma" name="turma" required onChange={handleChange} />
        <input
          type="password"
          placeholder="Senha"
          name="senha"
          required
          onChange={handleChange} />
        <input type="phone" placeholder="Telefone" name="telefone" onChange={handleChange} />
        <select name="isAdm" id="isAdm" onChange={handleChange}>
          <option value={false}>
            É Admin?
          </option>
          <option value={true}>Sim</option>
          <option value={false}>Não</option>
        </select>
        <div className={styles.profilePhotoWrapper}>
          <div id="batata"></div>
          <label htmlFor="profilePhotoInput">Enviar Foto</label>
          <input type="file" id="profilePhotoInput" onChange={handleFileInputChange} hidden />
        </div>
        <button onClick={handleSubmit}>Adicionar Usuário</button>
      </div>
      <ToastContainer
        position="top-center"
        theme="dark"
      />
    </div>
  );
};

export default AddUserPage;
