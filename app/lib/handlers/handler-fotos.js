import { uploadFoto, deleteFoto } from "../../lib";

export const handlerUploadFotos = async (token, album, selectedFiles, activeTab) => {
    
    const promiseUpload = selectedFiles.map( async (file) => {
            const newFormData = new FormData();
            newFormData.append('albumId', album.id);
            newFormData.append('evento', activeTab);
            newFormData.append('eventoId', album.eventos[activeTab].id);
            newFormData.append('image', file);
            
            await uploadFoto(token, newFormData);
    });
    await Promise.all(promiseUpload);
};

export const handlerDeleteFoto = async (token, photoId, evento) => {  
    return await deleteFoto(token, {photoId, evento});
};