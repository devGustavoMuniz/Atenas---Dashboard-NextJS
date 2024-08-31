"use client"

import { useEffect, useState } from 'react';
import styles from "../../ui/dashboard/users/singleUser/singleUser.module.css";
import { handleUpdateUser } from '../../lib';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { redirect } from 'next/navigation'


const SingleUserPage = () => {

    const [user, setUser] = useState([]);

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('user')));
    }, []);


    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
    
        reader.onloadend = () => {
            document.getElementById('batata').style.backgroundImage = `url(${reader.result})`;
            setUser(prevUser => ({
            ...prevUser,
                foto: reader.result,
                file: file
            }));
        };
    
        file && reader.readAsDataURL(file);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };

    const updateUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            redirect('/login');
        } else {
            const fd = new FormData();
            fd.append('image', user.file || user.foto);
            fd.append('numeroContrato', String(user.numeroContrato));
            fd.append('nomeUsuario', String(user.nomeUsuario));
            fd.append('turma', String(user.turma));
            fd.append('telefone', String(user.telefone));
            fd.append('nomeEscola', String(user.nomeEscola));
            fd.append('email', String(user.email));
            fd.append('isAdm', user.isAdm ? true : false);
            const response = await handleUpdateUser(token, fd);
            if (response.status === 200) {
                toast("Usuário atualizado com sucesso!")
                localStorage.setItem('user', JSON.stringify(user))
            } else {
                toast("F")
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.infoContainer}>
                <div className={styles.profilePhotoWrapper}>
                    <div id="batata" style={{backgroundImage: `url(${user.foto})`}}></div>
                    <label htmlFor="profilePhotoInput">Enviar Foto</label>
                    <input type="file" id="profilePhotoInput" onChange={handleFileInputChange} hidden />
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
