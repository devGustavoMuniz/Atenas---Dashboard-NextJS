"use client";

import { handleAddUser } from "../../../lib";
import styles from "../../../ui/dashboard/users/addUser/addUser.module.css";
import { useState, useCallback } from "react";
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

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

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
  

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      redirect('/login');
    } else {
      const fd = new FormData();
      fd.append('image', croppedImage ? dataURLtoFile(croppedImage, 'profile.jpg') : user.file);
      fd.append('numeroContrato', String(user.numeroContrato));
      fd.append('nomeUsuario', String(user.nomeUsuario));
      fd.append('turma', String(user.turma));
      fd.append('telefone', String(user.telefone));
      fd.append('nomeEscola', String(user.nomeEscola));
      fd.append('email', String(user.email));
      fd.append('senha', String(user.senha));
      fd.append('isAdm', user.isAdm ? 'true' : 'false');
  
      const response = await handleAddUser(token, fd);
      if (response.status === 201) {
        toast("Usuário adicionado com sucesso!");
      } else {
        toast("Erro ao adicionar usuário");
      }
    }
  };
  

  return (
    <div className={styles.container}>
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

        <input type="phone" placeholder="Telefone" name="telefone" onChange={handleChange} />
        <select name="isAdm" id="isAdm" onChange={handleChange}>
          <option value=''>
            Tipo de Usuário
          </option>
          <option value={true}>Administrador</option>
          <option value={false}>Formando</option>
        </select>

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
        <button onClick={handleSubmit}>Adicionar Usuário</button>
      </div>

      <ToastContainer position="top-center" theme="dark" />
    </div>
  );
};

export default AddUserPage;
