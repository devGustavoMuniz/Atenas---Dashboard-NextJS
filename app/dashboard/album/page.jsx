"use client"

import { useEffect, useState } from 'react';
import styles from "../../ui/dashboard/products/singleAlbum/singleAlbum.module.css";
import { handleUpdateAlbum } from '../../lib';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handlerUser } from "../../lib";
import { redirect } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

const SingleAlbumPage = () => {
    const [album, setAlbum] = useState([]);
    const [fotosPorEvento, setFotosPorEvento] = useState([]);
    const [users, setUsers] = useState([]);
    const [isUpdateImages, setIsUpdateImages] = useState(false);
    const [loading, setLoading] = useState(false); // Estado para o loader
    const [eventTypes, setEventTypes] = useState({
        Passeio: false,
        Baile: false,
        Missa: false,
        Culto: false,
        Colação: false,
        Identificação: false,
    });

    useEffect(() => {
        const storedAlbum = JSON.parse(localStorage.getItem('album'));
        setAlbum(storedAlbum);
        console.log('album', storedAlbum);
    
        if (storedAlbum && storedAlbum.evento) {
            const updatedEventTypes = { ...eventTypes };
            storedAlbum.evento.forEach(evento => {
                if (Object.prototype.hasOwnProperty.call(updatedEventTypes, evento)) {
                    updatedEventTypes[evento] = true;
                }
            });
            setEventTypes(updatedEventTypes);
        }
    
        const groupFotosByEvent = (fotos, eventos) => {
            const groupedFotos = {};
    
            fotos.forEach((foto, index) => {
                const eventFromFilename = foto.filename.split('/')[1].split('~')[0];
    
                const eventFromList = eventos[index];
    
                const eventName = eventFromFilename || eventFromList;
    
                if (!groupedFotos[eventName]) {
                    groupedFotos[eventName] = [];
                }
                groupedFotos[eventName].push(foto);
            });
    
            return groupedFotos;
        };
    
        if (storedAlbum && storedAlbum.fotos && storedAlbum.evento) {
            const fotosPorEvento = groupFotosByEvent(storedAlbum.fotos, storedAlbum.evento);
            console.log('Fotos separadas por evento', fotosPorEvento);
            setFotosPorEvento(fotosPorEvento); // Supondo que você tenha um state para armazenar isso
        }
    
        const handleUser = async () => {
            const token = localStorage.getItem('token');
            const response = await handlerUser(token);
            setUsers(response);
        };
    
        handleUser();
    }, []);
    

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            document.getElementById('batata').style.backgroundImage = `url(${reader.result})`;
            setAlbum(prevUser => ({
                ...prevUser,
                foto: reader.result,
                file: file
            }));
        };

        file && reader.readAsDataURL(file);
    };

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAlbum(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };

    const updateAlbum = async () => {
        setLoading(true); // Exibe o loader
        const token = localStorage.getItem('token');
        if (!token) {
            redirect('/login');
        } else {
            const fd = new FormData();
            if (images.length > 0) {
                acceptedFiles.forEach((file) => {
                    fd.append('image', file);
                });
            }
            const selectedUser = album.contratoEAluno ? JSON.parse(album.contratoEAluno) : null;
            selectedUser ? fd.append('numeroContrato', selectedUser.numeroContrato) : fd.append('numeroContrato', album.numeroContrato);
            selectedUser ? fd.append('nomeAluno', selectedUser.nome) : fd.append('nomeAluno', album.nomeAluno);
            Object.keys(eventTypes).forEach((key) => {
                if (eventTypes[key]) {
                    fd.append('evento[]', key);
                }
            });
            fd.append('tipoAlbum', album.tipoAlbum);
            fd.append('minFotos', album.minFotos);
            const response = await handleUpdateAlbum(token, fd);
            setLoading(false);
            if (response.status === 200) {
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

    const handleToggleDropzone = () => {
        setIsUpdateImages(true);
    }

    const usersOption = users.map(user => {
        const isSelected = (album.nomeAluno === user.nomeUsuario && album.numeroContrato === user.numeroContrato);
        return (
            <option
                key={user.numeroContrato + user.nomeUsuario}
                value={JSON.stringify({ nome: user.nomeUsuario, numeroContrato: user.numeroContrato })}
                selected={isSelected}
            >
                {`${user.nomeUsuario} (${user.numeroContrato})`}
            </option>
        );
    });

    const imagesWrapper = album.fotos && album.fotos.map((foto, index) => (
        <Image
            key={index}
            src={foto}
            alt='noavatar'
            width={150}
            height={150}
        />
    ));

    return (
        <div className={styles.container}>
            {loading && <div className={styles.loader}>Carregando...</div>} {/* Loader */}

            <div className={styles.formContainer}>
                <div className={styles.form}>
                    <label>Aluno do Álbum:</label>
                    <select disabled name="contratoEAluno" required onChange={handleChange}>
                        {usersOption}
                    </select>

                    <label>Tipo do Álbum:</label>
                    <div className={styles.numPageWrapper}>
                        <input disabled className={styles.input} type="number" placeholder="Número mínimo de páginas" name="minFotos" value={album.minFotos} required onChange={handleChange} />
                    </div>

                    <label>Tipo do Álbum:</label>
                    <input disabled className={styles.input} type="text" value={album.tipoAlbum} placeholder="Tipo do Álbum" name="tipoAlbum" required onChange={handleChange} />

                    <div className={styles.checkboxArea}>
                        <h4>Tipos de Evento:</h4>
                        <div className={styles.wrapper}>
                            <label>
                                <input
                                    disabled
                                    type="checkbox"
                                    name="Passeio"
                                    checked={eventTypes.Passeio}
                                    onChange={handleCheckboxChange}
                                />
                                Passeio
                            </label>
                            <label>
                                <input
                                    disabled
                                    type="checkbox"
                                    name="Baile"
                                    checked={eventTypes.Baile}
                                    onChange={handleCheckboxChange}
                                />
                                Baile
                            </label>
                            <label>
                                <input
                                    disabled
                                    type="checkbox"
                                    name="Missa"
                                    checked={eventTypes.Missa}
                                    onChange={handleCheckboxChange}
                                />
                                Missa
                            </label>
                            <label>
                                <input
                                    disabled
                                    type="checkbox"
                                    name="Culto"
                                    checked={eventTypes.Culto}
                                    onChange={handleCheckboxChange}
                                />
                                Culto
                            </label>
                            <label>
                                <input
                                    disabled
                                    type="checkbox"
                                    name="Colação"
                                    checked={eventTypes.Colação}
                                    onChange={handleCheckboxChange}
                                />
                                Colação
                            </label>
                            <label>
                                <input
                                    disabled
                                    type="checkbox"
                                    name="Identificação"
                                    checked={eventTypes.Identificação}
                                    onChange={handleCheckboxChange}
                                />
                                Identificação
                            </label>
                        </div>
                    </div>

                    {/* <button onClick={updateAlbum}>Atualizar Dados</button> */}
                </div>
                <div>
                    {!isUpdateImages && (
                        <>
                            {/* Passeio */}
                            {fotosPorEvento.Passeio && fotosPorEvento.Passeio.length > 0 && (
                                <div className={styles.eventSection}>
                                    <p>Passeio</p>
                                    <div className={styles.fotoContainer}>
                                        {fotosPorEvento.Passeio.map((foto, index) => {
                                            const filename = foto.filename.split('~')[1];

                                            return (
                                                <div key={index} className={styles.fotoItem}>
                                                    <Image
                                                        src={foto.fotoAssinada}
                                                        alt={`Foto Passeio ${index}`}
                                                        width={150}
                                                        height={150}
                                                    />
                                                    <p className={styles.filename}>{filename}</p> {/* Exibe o nome do arquivo aqui */}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
        
                            {/* Baile */}
                            {fotosPorEvento.Baile && fotosPorEvento.Baile.length > 0 && (
                                <div className={styles.eventSection}>
                                    <p>Baile</p>
                                    <div className={styles.fotoContainer}>
                                        {fotosPorEvento.Baile.map((foto, index) => {
                                            const filename = foto.filename.split('~')[1];

                                            return (
                                                <div key={index} className={styles.fotoItem}>
                                                    <Image
                                                        src={foto.fotoAssinada}
                                                        alt={`Foto Baile ${index}`}
                                                        width={150}
                                                        height={150}
                                                    />
                                                    <p className={styles.filename}>{filename}</p> {/* Exibe o nome do arquivo aqui */}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
        
                            {/* Missa */}
                            {fotosPorEvento.Missa && fotosPorEvento.Missa.length > 0 && (
                                <div className={styles.eventSection}>
                                    <p>Missa</p>
                                    <div className={styles.fotoContainer}>
                                        {fotosPorEvento.Missa.map((foto, index) => {
                                            const filename = foto.filename.split('~')[1];

                                            return (
                                                <div key={index} className={styles.fotoItem}>
                                                    <Image
                                                        src={foto.fotoAssinada}
                                                        alt={`Foto Missa ${index}`}
                                                        width={150}
                                                        height={150}
                                                    />
                                                    <p className={styles.filename}>{filename}</p> {/* Exibe o nome do arquivo aqui */}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
        
                            {/* Culto */}
                            {fotosPorEvento.Culto && fotosPorEvento.Culto.length > 0 && (
                                <div className={styles.eventSection}>
                                    <p>Culto</p>
                                    <div className={styles.fotoContainer}>
                                        {fotosPorEvento.Culto.map((foto, index) => {
                                            const filename = foto.filename.split('~')[1];

                                            return (
                                                <div key={index} className={styles.fotoItem}>
                                                    <Image
                                                        src={foto.fotoAssinada}
                                                        alt={`Foto Culto ${index}`}
                                                        width={150}
                                                        height={150}
                                                    />
                                                    <p className={styles.filename}>{filename}</p> {/* Exibe o nome do arquivo aqui */}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
        
                            {/* Colação */}
                            {fotosPorEvento.Colação && fotosPorEvento.Colação.length > 0 && (
                                <div className={styles.eventSection}>
                                    <p>Colação</p>
                                    <div className={styles.fotoContainer}>
                                        {fotosPorEvento.Colação.map((foto, index) => {
                                            const filename = foto.filename.split('~')[1];

                                            return (
                                                <div key={index} className={styles.fotoItem}>
                                                    <Image
                                                        src={foto.fotoAssinada}
                                                        alt={`Foto Colação ${index}`}
                                                        width={150}
                                                        height={150}
                                                    />
                                                    <p className={styles.filename}>{filename}</p> {/* Exibe o nome do arquivo aqui */}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
        
                            {/* Identificação */}
                            {fotosPorEvento.Identificação && fotosPorEvento.Identificação.length > 0 && (
                                <div className={styles.eventSection}>
                                    <p>Identificação</p>
                                    <div className={styles.fotoContainer}>
                                        {fotosPorEvento.Identificação.map((foto, index) => {
                                            const filename = foto.filename.split('~')[1];

                                            return (
                                                <div key={index} className={styles.fotoItem}>
                                                    <Image
                                                        src={foto.fotoAssinada}
                                                        alt={`Foto Colação ${index}`}
                                                        width={150}
                                                        height={150}
                                                    />
                                                    <p className={styles.filename}>{filename}</p> {/* Exibe o nome do arquivo aqui */}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            
           
    
            <ToastContainer
                position="top-center"
                theme="dark"
            />
        </div>
    );
    
};

export default SingleAlbumPage;
