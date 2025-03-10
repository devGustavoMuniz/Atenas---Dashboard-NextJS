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
    const [showPhotoSection, setShowPhotoSection] = useState(false);

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('user')));
    }, []);

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
    
        reader.onloadend = () => {
          setImageSrc(reader.result);
          setUser(prevUser => ({
            ...prevUser,
            file: file
          }));
        };
    
        if (file) {
          reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;
    
        if (name === 'telefone') {
        processedValue = formatPhoneNumber(value);
        }
    
        setUser(prevUser => ({
        ...prevUser,
        [name]: processedValue
        }));
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
      }, []);

    const showCroppedImage = useCallback(async () => {
        try {
          const croppedImgBlobUrl = await getCroppedImg(imageSrc, croppedAreaPixels);
          setCroppedImage(croppedImgBlobUrl);
          setUser(prevUser => ({
            ...prevUser,
            foto: croppedImgBlobUrl,
          }));
          toast("Imagem cortada com sucesso!");
          setImageSrc(null);
        } catch (e) {
          console.error(e);
          toast("Erro ao cortar a imagem");
        }
      }, [croppedAreaPixels, imageSrc]);

    const updateUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            redirect('/login');
        } else {
            const fd = new FormData();

            if (croppedImage) {
                const response = await fetch(croppedImage);
                const blob = await response.blob();
                fd.append('image', new File([blob], 'profile.jpg', { type: blob.type }));
            } else if (user.file) {
                fd.append('image', user.file);
            }
   
            fd.append('numeroContrato', String(user.numeroContrato));
            fd.append('nomeUsuario', String(user.nomeUsuario));
            fd.append('turma', String(user.turma));
            fd.append('telefone', String(user.telefone));
            fd.append('nomeEscola', String(user.nomeEscola));
            fd.append('email', String(user.email));
            fd.append('isAdm', user.isAdm);
            if (user.senha) fd.append('senha', user.senha);
            const response = await handleUpdateUser(token, fd);
            if (response.status === 200) {
                toast("Usuário atualizado com sucesso!");
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                toast("Erro ao atualizar usuário");
            }
        }
    };

    const formatPhoneNumber = (value) => {
        const cleaned = value.replace(/\D/g, ''); // Remove todos os não dígitos
        let formatted = '';
    
        if (cleaned.length <= 2) {
            return `(${cleaned}`;
        }
        
        const ddd = cleaned.substring(0, 2);
        const isMobile = cleaned.length > 10; // Celular tem 11 dígitos
        const part1 = cleaned.substring(2, isMobile ? 7 : 6);
        const part2 = cleaned.substring(isMobile ? 7 : 6);
    
        formatted = `(${ddd})`;
        if (part1) {
            formatted += ` ${part1}`;
        }
        if (part2) {
            formatted += `-${part2}`;
        }
    
        return formatted;
    };
    

    return (
        <div className={styles.mainWrapper}>
            <div className={styles.container}>
                {!showPhotoSection ? (
                    <div className={styles.form}>
                        <div>
                            <label>Número do contrato:</label>
                            <input type="text" name="numeroContrato" value={user.numeroContrato} onChange={handleChange} />
                        </div>

                        <div>
                            <label>Nome da escola:</label>
                            <input type="text" name="nomeEscola" value={user.nomeEscola} onChange={handleChange} />
                        </div>

                        <div>
                            <label>Turma:</label>
                            <input type="text" name="turma" value={user.turma} onChange={handleChange} />
                        </div>

                        <div>
                            <label>Nome:</label>
                            <input type="text" name="nomeUsuario" value={user.nomeUsuario} onChange={handleChange} />
                        </div>

                        <div>
                            <label>Email:</label>
                            <input type="email" name="email" value={user.email} onChange={handleChange} />
                        </div>

                        <div>
                            <label>Telefone:</label>
                            <input 
                                type="text" 
                                id="phone" 
                                name="telefone" 
                                value={user.telefone || ''} 
                                onChange={handleChange} 
                            />
                        </div>

                        <div>
                            <label>Tipo de Usuário</label>
                            <select name="isAdm" id="isAdm" value={user.isAdm} onChange={handleChange}>
                                <option value={true}>Administrador</option>
                                <option value={false}>Formando</option>
                            </select>
                        </div>

                        <div>
                            <label>Alterar Senha:</label>
                            <input type="text" name="senha" onChange={handleChange} />
                        </div>

                        <button onClick={() => setShowPhotoSection(true)}>Selecionar Foto</button>
                    </div>
                ) : (
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
                                        : 'url(/public/noavatar.png)',
                                }}
                            ></div>

                            <label htmlFor="profilePhotoInput">Selecionar Imagem</label>
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

                        <button className={styles.purpleBtn} onClick={() => setShowPhotoSection(false)}>Alterar Dados</button>
                        <button className={styles.greenBtn} onClick={updateUser}>Atualizar Usuário</button>

                    </div>

                )}
                
                <ToastContainer
                    position="top-center"
                    theme="dark"
                />
            </div>
        </div>
    );
};

export default SingleUserPage;
