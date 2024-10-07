"use client";

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

    const blobUrlToBase64 = async (blobUrl) => {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };
      
    
      const showCroppedImage = useCallback(async () => {
        try {
          const croppedImgBlobUrl = await getCroppedImg(imageSrc, croppedAreaPixels);
          const croppedImgBase64 = await blobUrlToBase64(croppedImgBlobUrl);
          setCroppedImage(croppedImgBase64);
          setUser(prevUser => ({
            ...prevUser,
            foto: croppedImgBase64,
          }));
          toast("Imagem cortada com sucesso!");
          setImageSrc(null);
        } catch (e) {
          console.error(e);
          toast("Erro ao cortar a imagem");
        }
      }, [croppedAreaPixels, imageSrc]);

      const dataURLtoFile = (dataurl, filename) => {
        console.log(`data url ${filename}`);
        const arr = dataurl.split(','), 
              mime = arr[0].match(/:(.*?);/)[1],
              bstr = atob(arr[1]), 
              u8arr = new Uint8Array(bstr.length);
              
        for (let i = 0; i < bstr.length; i++) {
          u8arr[i] = bstr.charCodeAt(i);
        }
        
        return new File([u8arr], filename, { type: mime });
      };

    const updateUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            redirect('/login');
        } else {
            const fd = new FormData();
            fd.append('image', croppedImage ? dataURLtoFile(croppedImage, 'profile~'+user.nomeUsuario+'.jpg') : user.file || user.foto.fotoAssinada);
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
