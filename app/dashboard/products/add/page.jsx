"use client";

import styles from "../../../ui/dashboard/products/addProduct/addProduct.module.css";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { redirect, useRouter } from 'next/navigation';
import { handleAddAlbum, handlerUser } from "../../../lib";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const AddProductPage = () => {
  const [album, setAlbum] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eventTypes, setEventTypes] = useState({
    passeio: false,
    baile: false,
    missa: false,
    culto: false,
    colacao: false,
    identificacao: false,
  });
  const [label, setLabel] = useState('');

  const router = useRouter();

  useEffect(() => {
    const handleUser = async () => {
      const token = localStorage.getItem('token');
      const response = await handlerUser(token);
      setUsers(response);
    };

    handleUser();
  }, []);

  // Seta os valores dos inputs nos albums
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'contratoEAluno') {
      setLabel(value);
    }
    setAlbum(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  // Seta os tipos de evento de acordo com as checkboxes
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setEventTypes(prevState => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');
    const contratoEAluno = JSON.parse(album.contratoEAluno);
    const eventosSelecionados = Object.keys(eventTypes).filter(event => eventTypes[event]);
    
    const albumG = {
      numeroContrato: contratoEAluno.numeroContrato,
      nomeAluno: contratoEAluno.nome,
      tipoAlbum: album.tipoAlbum,
      minFotos: album.minFotos,
      evento: eventosSelecionados
    }

    

    const response = await handleAddAlbum(token, albumG);
    setLoading(false);
    if (response.status === 201) {
      redirect('/dashboard/products');
    }
    toast("Erro ao adicionar álbum");
  };

  const usersOption = users.map(user => (
    <MenuItem key={user.numeroContrato + user.nomeUsuario} value={JSON.stringify({ nome: user.nomeUsuario, numeroContrato: user.numeroContrato })}>{`${user.nomeUsuario} (${user.numeroContrato})`}</MenuItem>
  ));

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.container}>
        {loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
          </div>
        )}
        <div className={styles.form}>
          <FormControl fullWidth>
            <Select
              name="contratoEAluno"
              className={styles.bgBlack}
              onChange={handleChange}
              displayEmpty
              value={label}
            >
              <MenuItem value="">Selecione o Aluno do Álbum</MenuItem>
              {usersOption}
            </Select>
          </FormControl>

          <div className={styles.numPageWrapper}>
            <input className={styles.input} type="text" placeholder="Mínimo de páginas" name="minFotos" required onChange={handleChange} />
            <input className={styles.input} type="text" placeholder="Tipo do Álbum" name="tipoAlbum" required onChange={handleChange} />
          </div>
          <div className={styles.checkboxArea}>
            <h4>Tipos de Evento:</h4>
            <div className={styles.wrapper}>
              {Object.keys(eventTypes).map((event) => (
                <div key={event} className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    id={event}
                    name={event}
                    className={styles.checkboxInput}
                    checked={eventTypes[event]}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor={event} className={styles.checkboxLabel}>
                    {event}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <button onClick={handleSubmit}>Criar Álbum</button>
        </div>
        <ToastContainer position="top-center" theme="dark" />
      </div>
    </div>
  );
};

export default AddProductPage;
