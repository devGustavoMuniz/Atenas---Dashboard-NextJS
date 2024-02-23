"use client";

import { addUser } from "../../../lib/actions";
import styles from "../../../ui/dashboard/users/addUser/addUser.module.css";
import React from "react";

const AddUserPage = () => {
  const [profilePhotoBase64, setProfilePhotoBase64] = React.useState('');

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setProfilePhotoBase64(reader.result);
      document.getElementById('batata').style.backgroundImage = `url(${reader.result})`;
      console.log(reader.result);
    };

    file && reader.readAsDataURL(file);
  };

  return (
    <div className={styles.container}>
      <form action={addUser} className={styles.form}>
        <input type="text" placeholder="Número do Contrato" name="contractId" required />
        <input type="text" placeholder="Nome da escola" name="schoolName" required />
        <input type="text" placeholder="Nome" name="username" required />
        <input type="email" placeholder="Email" name="email" required />
        <input type="text" placeholder="Turma" name="schoolClass" required />
        <input
          type="password"
          placeholder="Senha"
          name="password"
          required
        />
        <input type="phone" placeholder="Telefone" name="phone" />
        <select name="isAdmin" id="isAdmin">
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
        <input type="text" name="profilePhoto" defaultValue={profilePhotoBase64} id="batata" hidden />
        <button type="submit">Adicionar Usuário</button>
      </form>
    </div>
  );
};

export default AddUserPage;
