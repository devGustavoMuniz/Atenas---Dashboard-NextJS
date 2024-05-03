import { getAllAlbums } from "../../lib";

export const handlerAlbum = async (token) => {
    const response = await getAllAlbums(token);
    return response.status === 201 ? response.data : [];
}