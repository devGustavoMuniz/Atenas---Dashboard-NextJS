"use client";

import styles from "../../../ui/dashboard/products/addProduct/addProduct.module.css";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { redirect, useRouter } from 'next/navigation';
import { handleAddAlbum, handlerUser } from "../../../lib";
import SearchableDropdown from "../../../ui/dropdown/SearchableDropdown";

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
  const [value, setValue] = useState("");

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
    const eventosSelecionados = Object.keys(eventTypes).filter(event => eventTypes[event]);

    const regex = /(.*)\s\(([^)]+)\)/;
    const match = value.match(regex);

    let albumG;
    if (match) {
      albumG = {
        numeroContrato: match[2],
        nomeAluno: match[1],
        tipoAlbum: album.tipoAlbum,
        minFotos: album.minFotos,
        evento: eventosSelecionados
      };

      console.log(albumG);
    }
    
    
    
    

    const response = await handleAddAlbum(token, albumG);
    setLoading(false);
    if (response.status === 201) {
      redirect('/dashboard/products');
    }
    toast("Erro ao adicionar álbum");
  };

  const usersOption = users.map(user => ({
    id: { nome: user.nomeUsuario, numeroContrato: user.numeroContrato },
    name: `${user.nomeUsuario} (${user.numeroContrato})`
  }));

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.container}>
        {loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
          </div>
        )}
        <div className={styles.form}>
          <div className={styles.dropdownWrapper}>
            <label htmlFor="idDropdown">Selecione o aluno:</label>
            <SearchableDropdown
              options={usersOption}
              label="name"
              id="idDropdown"
              selectedVal={value}
              handleChange={(val) => setValue(val)}
            />
          </div>

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
