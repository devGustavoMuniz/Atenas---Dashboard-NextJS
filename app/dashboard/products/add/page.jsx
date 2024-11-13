"use client";

import styles from "../../../ui/dashboard/products/addProduct/addProduct.module.css";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { handleAddAlbum, handlerUser } from "../../../lib";

const AddProductPage = () => {
  const [album, setAlbum] = useState('aaaaa');
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
      tipoAlbum: contratoEAluno.tipoAlbum,
      minFotos: contratoEAluno.minFotos,
      evento: eventosSelecionados
    }

    const response = await handleAddAlbum(token, albumG);
    setLoading(false);
    if (response.status === 201) {
      toast("Album adicionado com sucesso!");
    } else {
      toast("Erro ao adicionar álbum");
    }
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
          <input className={styles.input} type="number" placeholder="Mínimo de páginas" name="minFotos" required onChange={handleChange} />
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
        <button onClick={handleSubmit}>Criar Álbum</button>
      </div>
      <ToastContainer position="top-center" theme="dark" />
    </div>
  );
};

export default AddProductPage;
