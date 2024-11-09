'use client';

import React, { useState, useRef } from 'react';
import styles from './image_upload.module.css';
import { FaTrash, FaCloudUploadAlt } from 'react-icons/fa';
import Image from 'next/image';

// Define the file type for better type checking
interface SelectedFile extends File {
  preview?: string;
}

export default function UploadPage() {
  // State to manage selected files
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  // Ref for file input to allow resetting
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  // Handle file selection and conversion to base64
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    // Função para converter um arquivo para base64
    const toBase64 = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

    // Processa os arquivos selecionados
    Promise.all(
      files.map(async (file) => {
        // Verifica se é uma imagem e se é menor que 5MB
        if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
          const preview = await toBase64(file);
          return Object.assign(file, { preview });
        }
        return null;
      })
    ).then((results) => {
      // Filtra arquivos válidos e adiciona ao estado
      const validFiles = results.filter((file) => file) as SelectedFile[];
      setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);

      // Reset input para permitir seleção dos mesmos arquivos novamente
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    });
  };


  // Remove a file from the list
  const handleRemoveFile = (indexToRemove: number) => {
    setSelectedFiles(prevFiles => 
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  // Handle file upload (server action)
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file, index) => {
      formData.append(`file-${index}`, file);
    });

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Upload failed: ${errorData.message}`);
      }
      alert('Files uploaded successfully');
      setSelectedFiles([]);
    } catch (error) {
      console.error('Upload error:', error);
      alert('An error occurred during upload');
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Cadastro de fotos no álbum</h1>
        {/* File Input */}
        <div className={styles.inputWrapper}>
          <input 
            type="file" 
            multiple 
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className={styles.fileInput}
            id="file-upload"
          />
          <label 
            htmlFor="file-upload" 
            className={styles.fileLabel}
          >
            <FaCloudUploadAlt className={styles.uploadIcon} />
            <span>Clique para selecionar as fotos</span>
          </label>
        </div>

        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
          <div>
            <h3 className={styles.fileListTitle}>Fotos selecionadas:</h3>
            <div className={styles.fileListContainer}>
              <ul className={styles.fileList}>
                {selectedFiles.map((file, index) => (
                  <li 
                    key={index} 
                    className={styles.fileListItem}
                  >
                    <div className={styles.fileInfo}>
                      <Image src={file.preview} alt={file.name} width="25" height="25" className={styles.filePreview} />
                      <span className={styles.fileName}>{file.name}</span>
                    </div>
                    <button 
                      onClick={() => handleRemoveFile(index)}
                      className={styles.removeButton}
                      aria-label="Remove file"
                    >
                      <FaTrash />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.uploadButtonWrapper}>
              <button 
                onClick={handleUpload}
                className={styles.uploadButton}
              >
                Cadastrar fotos
              </button>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
