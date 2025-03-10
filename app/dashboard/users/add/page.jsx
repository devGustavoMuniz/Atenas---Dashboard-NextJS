"use client";

import { handleAddUser } from "../../../lib";
import styles from "../../../ui/dashboard/users/addUser/addUser.module.css";
import { useState, useCallback, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { redirect } from 'next/navigation';
import Cropper from 'react-easy-crop';
import getCroppedImg from "../../../lib/getCroppedImg";

const AddUserPage = () => {
  const [user, setUser] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [showPhotoSection, setShowPhotoSection] = useState(false);
  
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
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


  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      redirect('/login');
    }
  
    const fd = new FormData();
    
    // Converte o blob URL em um arquivo, se necessário
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
    fd.append('senha', String(user.senha));
    fd.append('isAdm', user.isAdm);
  
    const response = await handleAddUser(token, fd);
    if (response.status === 201) {
      toast("Usuário adicionado com sucesso!");
    } else {
      toast("Erro ao adicionar usuário");
    }
  };

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.container}>
        {!showPhotoSection ? (
          // Renderização do formulário
          <div className={styles.form}>
            <input type="text" placeholder="Número do Contrato" name="numeroContrato" required onChange={handleChange} />
            <input type="text" placeholder="Nome da escola" name="nomeEscola" required onChange={handleChange} />
            <input type="text" placeholder="Nome" name="nomeUsuario" required onChange={handleChange} />
            <input type="email" placeholder="Email" name="email" required onChange={handleChange} />
            <input type="text" placeholder="Turma" name="turma" required onChange={handleChange} />

            <div className={styles.inputPasswordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                name="senha"
                className={styles.inputPassword}
                required
                onChange={handleChange}
              />
              <label className={styles.labelShowPassword} onClick={() => setShowPassword(!showPassword)}>
                Mostrar
              </label>
            </div>

            <input 
              type="text" 
              id="phone" 
              placeholder="Telefone" 
              name="telefone" 
              value={user.telefone || ''} 
              onChange={handleChange} 
            />
            <select name="isAdm" id="isAdm" onChange={handleChange}>
              <option value=''>Tipo de Usuário</option>
              <option value={true}>Administrador</option>
              <option value={false}>Formando</option>
            </select>
            <button onClick={() => setShowPhotoSection(true)}>Selecionar Foto</button>
          </div>
        ) : (
          // Renderização da seção de foto
          <div className={styles.profilePhotoWrapper}>
            {!imageSrc && (
              <>
                <div
                  id="batata"
                  className={styles.batata}
                  style={{
                    backgroundImage: croppedImage ? `url(${croppedImage})` : 'url(/noavatar.png)',
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
                <button onClick={showCroppedImage}>Selecionar Imagem</button>
              </>
            )}

            <button className={styles.purpleBtn} onClick={() => setShowPhotoSection(false)}>Alterar Dados</button>
            <button className={styles.greenBtn} onClick={handleSubmit}>Adicionar Usuário</button>

          </div>
        )}
        <ToastContainer position="top-center" theme="dark" />
      </div>
    </div>
  );
};

export default AddUserPage;
