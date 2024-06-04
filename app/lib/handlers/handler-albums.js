import { addAlbum, getAllAlbums, updateAlbum, deleteAlbum } from "../../lib";

export const handlerAlbum = async (token) => {
    const response = await getAllAlbums(token);
    return response.status === 200 ? response.data.albuns : [];
}

export const handleAddAlbum = async (token, fd) => {
    return await addAlbum(token, fd);
}

export const handleUpdateAlbum = async (token, fd) => {
    return await updateAlbum(token, fd);
}

export const handleDeleteAlbum = async (token, album) => {
    return await deleteAlbum(token, album);
}