"use client"

import { useEffect, useState } from 'react';
import styles from "../../ui/dashboard/products/singleAlbum/singleAlbum.module.css";
import { handleUpdateAlbum } from '../../lib';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handlerUser } from "../../lib";
import { redirect } from 'next/navigation';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const SingleAlbumPage = () => {
    const [album, setAlbum] = useState({
        contratoEAluno: "",
        minFotos: "",
        tipoAlbum: "",
        nomeAluno: "",
        numeroContrato: "",
    });
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

    useEffect(() => {
        const storedAlbum = JSON.parse(localStorage.getItem('album'));
        setAlbum(storedAlbum);        


        const eventosComIsExist = Object.entries(storedAlbum.eventos)
        .filter(([_, evento]) => evento.isExist)
        .map(([nomeEvento]) => nomeEvento);

        
        
        
        setEventTypes({
            passeio: eventosComIsExist.includes('passeio'),
            baile: eventosComIsExist.includes('baile'),
            missa: eventosComIsExist.includes('missa'),
            culto: eventosComIsExist.includes('culto'),
            colacao: eventosComIsExist.includes('colacao'),
            identificacao: eventosComIsExist.includes('identificacao'),
        });

    
        const handleUser = async () => {
            const token = localStorage.getItem('token');
            const response = await handlerUser(token);
            setUsers(response);
        };
    
        handleUser();
    }, []);

    
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name == 'numeroContrato') {
            setLabel(value);
            users.map((user) => {
                if (user.numeroContrato == value) {
                    setAlbum(prevUser => ({
                        ...prevUser,
                        "numeroContrato": value,
                        "nomeAluno": user.nomeUsuario
                    }));
                }
            })
            return;
        }
        
        setAlbum(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };

    const updateAlbum = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            redirect('/login');
        } else {
            const selectedEventos = Object.keys(eventTypes).reduce((acc, key) => {
                if (eventTypes[key]) {
                    acc.push(key.toLowerCase());
                }
                return acc;
            }, []);

            
            const albumG = {
                id: album.id,
                numeroContrato: album.numeroContrato,
                nomeAluno: album.nomeAluno,
                tipoAlbum: album.tipoAlbum,
                minFotos: album.minFotos,
                evento: selectedEventos
            }

            
            
            const response = await handleUpdateAlbum(token, albumG);
            setLoading(false);
            if (response.status === 200) {
                toast("Album atualizado com sucesso!");
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

    const usersOption = users.map(user => (
        <MenuItem key={user.numeroContrato} value={user.numeroContrato}>{`${user.nomeUsuario} (${user.numeroContrato})`}</MenuItem>
    ));

    return (
        <div className={styles.mainWrapper}>
            <div className={styles.container}>
                {loading && <div className={styles.loader}>Carregando...</div>}

                <div className={styles.formContainer}>
                    <div className={styles.form}>
                        <FormControl fullWidth>
                            <Select
                            name="numeroContrato"
                            className={styles.bgBlack}
                            onChange={handleChange}
                            displayEmpty
                            value={album.numeroContrato || ""}
                            >
                            <MenuItem value="">Selecione o Aluno do Álbum</MenuItem>
                            {usersOption}
                            </Select>
                        </FormControl>

                        <div className={styles.numPageWrapper}>
                            <input className={styles.input} type="text" placeholder="Número mínimo de páginas" name="minFotos" value={album.minFotos} required onChange={handleChange} />
                            <input className={styles.input} type="text" value={album.tipoAlbum} placeholder="Tipo do Álbum" name="tipoAlbum" required onChange={handleChange} />
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

                        <button onClick={updateAlbum}>Atualizar Dados</button>
                    </div>
                </div>
                <ToastContainer
                    position="top-center"
                    theme="dark"
                />
            </div>
        </div>
    );
    
};

export default SingleAlbumPage;
