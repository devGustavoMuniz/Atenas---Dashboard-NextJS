import { addAlbum, getAllAlbums, updateAlbum, deleteAlbum, getAllUsers } from "../../lib";

export const handlerAlbum = async (token, searchParam, page, limit) => {
    const response = await getAllAlbums(token, searchParam, page, limit);
    const users = await getAllUsers(token);    

    if (response.status !== 200) return [];

    return response.data.albuns.map(album => {
        const user = users.data.users.find(
            user => 
                user.numeroContrato === album.numeroContrato && 
                user.nomeUsuario === album.nomeAluno
        );
        return { ...album, foto: user ? user.foto.fotoAssinada : null };
    });
};


export const handlerAlbumLength = async (token, searchParam, page, limit) => {
    const response = await getAllAlbums(token, searchParam, page, limit);
    
    return response.status === 200 ? response.data.count : 0;
}

export const handleAddAlbum = async (token, album) => {
    return await addAlbum(token, album);
}

export const handleUpdateAlbum = async (token, fd) => {
    const res = await updateAlbum(token, fd);
    return res;
}

export const handleDeleteAlbum = async (token, album) => {
    return await deleteAlbum(token, album);
}

export const getAlbumById = async (token, albumId) => {
    const { data } = await getAllAlbums(token);
    return data.albuns.filter((album) => album.id == albumId);
}

export const getAlbumByContract = async (token, user) => {
    const { data } = await getAllAlbums(token);
    
    return data.albuns.filter((album) =>
        user.numeroContrato === album.numeroContrato && 
        user.nomeUsuario === album.nomeAluno
    );
}