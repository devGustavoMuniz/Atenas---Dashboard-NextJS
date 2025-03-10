"use client"

import { useEffect, useState } from 'react';
import styles from "../../ui/dashboard/products/singleAlbum/singleAlbum.module.css";
import { handleUpdateAlbum, handlerUser } from '../../lib';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { redirect } from 'next/navigation';
import SearchableDropdown from "../../ui/dropdown/SearchableDropdown";

const SingleAlbumPage = () => {
    const [album, setAlbum] = useState({
        contratoEAluno: "",
        minFotos: "",
        tipoAlbum: "",
        nomeAluno: "",
        numeroContrato: ""
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
    
    // Este state armazena o valor selecionado do dropdown
    const [dropdownValue, setDropdownValue] = useState("");

    useEffect(() => {
        const storedAlbum = JSON.parse(localStorage.getItem('album'));
        if (storedAlbum) {
            setAlbum(storedAlbum);
            // Se o album já possui número e nome do aluno, formata o valor para o dropdown
            if(storedAlbum.numeroContrato && storedAlbum.nomeAluno) {
                setDropdownValue(`${storedAlbum.nomeAluno} (${storedAlbum.numeroContrato})`);
            }

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
        }

        const fetchUsers = async () => {
            const token = localStorage.getItem('token');
            const response = await handlerUser(token);
            setUsers(response);
        };
    
        fetchUsers();
    }, []);

    // Mapeia os usuários para o formato esperado pelo SearchableDropdown
    const usersOption = users.map(user => ({
        id: { nome: user.nomeUsuario, numeroContrato: user.numeroContrato },
        name: `${user.nomeUsuario} (${user.numeroContrato})`
    }));

    // Função para tratar a mudança do dropdown
    const handleDropdownChange = (val) => {
        setDropdownValue(val);
        const regex = /(.*)\s\(([^)]+)\)/;
        const match = val.match(regex);
        if (match) {
            setAlbum(prev => ({
                ...prev,
                nomeAluno: match[1],
                numeroContrato: match[2]
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Se for alteração manual de algum input, atualiza o album
        setAlbum(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setEventTypes(prevState => ({
            ...prevState,
            [name]: checked,
        }));
    };

    const updateAlbum = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            redirect('/login');
            return;
        }
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
        };

        const response = await handleUpdateAlbum(token, albumG);
        setLoading(false);
        if (response.status === 200) {
            toast("Album atualizado com sucesso!");
        } else {
            toast("Erro ao atualizar álbum");
        }
    };

    return (
        <div className={styles.mainWrapper}>
            <div className={styles.container}>
                {loading && <div className={styles.loader}>Carregando...</div>}

                <div className={styles.formContainer}>
                    <div className={styles.form}>
                        <div className={styles.dropdownWrapper}>
                            <label htmlFor="idDropdown">Selecione o aluno:</label>
                            <SearchableDropdown
                                options={usersOption}
                                label="name"
                                id="idDropdown"
                                selectedVal={dropdownValue}
                                handleChange={handleDropdownChange}
                            />
                        </div>

                        <div className={styles.numPageWrapper}>
                            <input 
                                className={styles.input} 
                                type="text" 
                                placeholder="Número mínimo de páginas" 
                                name="minFotos" 
                                value={album.minFotos || ''} 
                                required 
                                onChange={handleChange} 
                            />
                            <input 
                                className={styles.input} 
                                type="text" 
                                placeholder="Tipo do Álbum" 
                                name="tipoAlbum" 
                                value={album.tipoAlbum || ''} 
                                required 
                                onChange={handleChange} 
                            />
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
                <ToastContainer position="top-center" theme="dark" />
            </div>
        </div>
    );
};

export default SingleAlbumPage;
