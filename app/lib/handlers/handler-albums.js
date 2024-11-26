import { addAlbum, getAllAlbums, updateAlbum, deleteAlbum } from "../../lib";

export const handlerAlbum = async (token) => {
    const response = await getAllAlbums(token);
    return response.status === 200 ? response.data.albuns : [];
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