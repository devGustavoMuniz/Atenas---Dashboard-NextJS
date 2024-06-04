"use client"

import { useEffect, useState } from 'react';
import styles from "../../ui/dashboard/products/singleAlbum/singleAlbum.module.css";
import { handleUpdateAlbum } from '../../lib';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handlerUser } from "../../lib";
import { redirect } from 'next/navigation'
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';


const SingleAlbumPage = () => {

    const [album, setAlbum] = useState([]);
    const [users, setUsers] = useState([]);
    const [isUpdateImages, setIsUpdateImages] = useState(false);
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
    
        if (storedAlbum && storedAlbum.evento) {
          const updatedEventTypes = { ...eventTypes };
          storedAlbum.evento.forEach(evento => {
            if (Object.prototype.hasOwnProperty.call(updatedEventTypes, evento)) {
              updatedEventTypes[evento] = true;
            }
          });
          setEventTypes(updatedEventTypes);
        }

        const handleUser = async () => {
          const token = localStorage.getItem('token');
          const response = await handlerUser(token);
          setUsers(response);
        };
    
        handleUser();

    }, []);

    console.log('albumFotos > ', album.fotos);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAlbum(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };

    const updateAlbum = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            redirect('/login');
        } else {
            const fd = new FormData();
            if (images.length > 0) {
              acceptedFiles.forEach((file) => {
                fd.append('image', file);
              });
            } else {
              album.fotos.forEach((file) => {
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
            fd.append('minPage', album.minPage);
            fd.append('maxPage', album.maxPage);
            const response = await handleUpdateAlbum(token, fd);
            if (response.status === 201) {
              toast("Album adicionado com sucesso!")
            } else {
              toast("F")
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
            <div>
                {!isUpdateImages && <>
                  <div className={styles.infoContainer}>
                    {imagesWrapper}
                  </div>
                  <button onClick={handleToggleDropzone} className={styles.addButton}>Alterar fotos</button>
                </>}
                {isUpdateImages && <div className={styles.infoContainer}>
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
                  </div>}
            </div>
            <div className={styles.formContainer}>
                <div className={styles.form}>
                    <label>Aluno do Álbum:</label>
                    <select name="contratoEAluno" required onChange={handleChange}>
                      {usersOption}
                    </select>

                    <label>Tipo do Álbum:</label>
                    <div className={styles.numPageWrapper}>
                      <input className={styles.input} type="number" placeholder="Número mínimo de páginas" name="minPage" required onChange={handleChange} />
                      <input className={styles.input} type="number" placeholder="Número máximo de páginas" name="maxPage" required onChange={handleChange} />
                    </div>

                    <label>Tipo do Álbum:</label>
                    <input className={styles.input} type="text" value={album.tipoAlbum} placeholder="Tipo do Álbum" name="tipoAlbum" required onChange={handleChange} />
                    
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

                    <button onClick={updateAlbum}>Atualizar Dados</button>
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
