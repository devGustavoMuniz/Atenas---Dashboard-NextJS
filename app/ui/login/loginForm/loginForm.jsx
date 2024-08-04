"use client"

import { useState } from 'react';
import styles from "./loginForm.module.css";
import { login } from "../../../lib";
import { useRouter } from 'next/navigation';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleLogin = async () => {
    try {
      const { token } = await login({ username, password });
      localStorage.setItem('token', token);
      router.push('/dashboard');
    } catch (error) {
      setError('Erro ao fazer login: ' + error.message);
    }
  }

  return (
    <div className={styles.form}>
      <h1>Login</h1>
      <input 
        type="text" 
        placeholder="Nome de Usuário" 
        name="username" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
      />
      <div className={styles.passwordWrapper}>
        <input 
          type={showPassword ? "text" : "password"}
          placeholder="Senha" 
          name="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <label className={styles.labelShowPassword}>
          <input 
            type="checkbox" 
            checked={showPassword} 
            onChange={() => setShowPassword(!showPassword)} 
          />
          Exibir senha
        </label>
      </div>
      <button onClick={handleLogin}>Login</button>
      <a href='/'>Voltar para Home</a>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default LoginForm;
