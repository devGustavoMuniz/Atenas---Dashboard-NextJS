"use client";

// Removi as polyfills de Promise e Uint8Array, pois vamos evitar o uso dessas funções diretamente.

import { useEffect, useState, useCallback } from 'react';
import styles from "../../ui/dashboard/users/singleUser/singleUser.module.css";
import { handleUpdateUser } from '../../lib';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { redirect } from 'next/navigation';
import Cropper from 'react-easy-crop';
import getCroppedImg from "../../lib/getCroppedImg";

const SingleUserPage = () => {
    const [user, setUser] = useState([]);
    const [imageSrc, setImageSrc] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isCropping, setIsCropping] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('user')));
    }, []);

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
    
        reader.onloadend = () => {
            setImageSrc(reader.result); // Exibe a imagem no Cropper
            setUser(prevUser => ({
              ...prevUser,
              file: file
            }));
        };
      
        if (file) {
            reader.readAsDataURL(file); // Lê o arquivo como base64
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    // Função modificada para evitar o uso de Promise, utilizando callbacks
    const blobUrlToBase64 = (blobUrl, callback) => {
        if (typeof window !== "undefined") {
            fetch(blobUrl)
                .then(response => response.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.onloadend = () => callback(null, reader.result);
                    reader.onerror = (err) => callback(err, null);
                    reader.readAsDataURL(blob);
                })
                .catch(err => callback(err, null));
        }
    };

    const showCroppedImage = useCallback(() => {
        getCroppedImg(imageSrc, croppedAreaPixels)
            .then(croppedImgBlobUrl => {
                blobUrlToBase64(croppedImgBlobUrl, (err, croppedImgBase64) => {
                    if (err) {
                        console.error(err);
                        toast("Erro ao cortar a imagem");
                        return;
                    }
                    setCroppedImage(croppedImgBase64);
                    setUser(prevUser => ({
                        ...prevUser,
                        foto: croppedImgBase64,
                    }));
                    toast("Imagem cortada com sucesso!");
                    setImageSrc(null);
                });
            })
            .catch(e => {
                console.error(e);
                toast("Erro ao cortar a imagem");
            });
    }, [croppedAreaPixels, imageSrc]);

    // Função modificada para evitar o uso de Uint8Array
    const dataURLtoFile = (dataurl, filename) => {
        if (typeof window !== "undefined") {
            const arr = dataurl.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const binary = atob(arr[1]);
            let binaryString = '';

            // Criação da string binária
            for (let i = 0; i < binary.length; i++) {
                binaryString += String.fromCharCode(binary.charCodeAt(i));
            }

            // Criação do arquivo usando a string binária em vez de Uint8Array
            return new File([binaryString], filename, { type: mime });
        }
    };

    const updateUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            redirect('/login');
        } else {
            const fd = new FormData();
            if (croppedImage || user.file) {
                fd.append('image', dataURLtoFile(croppedImage, 'profile~' + user.nomeUsuario + '.jpg') || user.file);
            }   
            fd.append('numeroContrato', String(user.numeroContrato));
            fd.append('nomeUsuario', String(user.nomeUsuario));
            fd.append('turma', String(user.turma));
            fd.append('telefone', String(user.telefone));
            fd.append('nomeEscola', String(user.nomeEscola));
            fd.append('email', String(user.email));
            fd.append('isAdm', user.isAdm ? true : false);
            const response = await handleUpdateUser(token, fd);
            if (response.status === 200) {
                toast("Usuário atualizado com sucesso!");
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                toast("Erro ao atualizar usuário");
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.infoContainer}>
                <div className={styles.profilePhotoWrapper}>
                    {!imageSrc && (
                    <>
                        <div
                            id="batata"
                            className={styles.batata}
                            style={{
                                backgroundImage: croppedImage 
                                ? `url(${croppedImage})` 
                                : user.foto && user.foto.fotoAssinada 
                                    ? `url(${user.foto.fotoAssinada})` 
                                    : 'url(/public/noavatar.png)', // Imagem placeholder quando não houver foto
                            }}
                        ></div>
                        <label htmlFor="profilePhotoInput">Enviar Foto</label>
                        <input type="file" id="profilePhotoInput" onChange={handleFileInputChange} hidden />
                    </>
                    )}
                    {imageSrc && (
                    <>
                        <div className={styles.cropperContainer}>
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                            style={{
                            containerStyle: {
                                width: "100%",
                                height: "100%",
                                position: "relative"
                            },
                            }}
                        />
                        </div>
                        <button onClick={showCroppedImage}>Cortar e Usar</button>
                    </>
                )}
                </div>
                {user.nomeUsuario}
            </div>
            <div className={styles.formContainer}>
                <div className={styles.form}>
                    <label>Número do contrato:</label>
                    <input type="text" name="numeroContrato" value={user.numeroContrato} onChange={handleChange} />

                    <label>Nome da escola:</label>
                    <input type="text" name="nomeEscola" value={user.nomeEscola} onChange={handleChange} />

                    <label>Turma:</label>
                    <input type="text" name="turma" value={user.turma} onChange={handleChange} />

                    <label>Nome:</label>
                    <input type="text" name="nomeUsuario" value={user.nomeUsuario} onChange={handleChange} />

                    <label>Email:</label>
                    <input type="email" name="email" value={user.email} onChange={handleChange} />

                    <label>Telefone:</label>
                    <input type="text" name="telefone" value={user.telefone} onChange={handleChange} />

                    <label>Tipo de Usuário</label>
                    <select name="isAdm" id="isAdm" value={user.isAdm} onChange={handleChange}>
                        <option value={true}>Administrador</option>
                        <option value={false}>Formando</option>
                    </select>

                    <label>Alterar Senha:</label>
                    <input type="text" name="senha" onChange={handleChange} />

                    <button onClick={updateUser}>Atualizar Dados</button>
                </div>
            </div>
            <ToastContainer
                position="top-center"
                theme="dark"
            />
        </div>
    );
};

export default SingleUserPage;
