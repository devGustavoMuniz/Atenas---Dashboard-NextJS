import { addAlbum, getAllAlbums } from "../../lib";

export const handlerAlbum = async (token) => {
    const response = await getAllAlbums(token);
    return response.status === 201 ? response.data : [];
}

export const handleAddAlbum = async (token, fd) => {
    return await addAlbum(token, fd);
}