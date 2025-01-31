import { getAllUsers, updateUser, addUser, deleteUser } from "../../lib";

export const handlerUser = async (token, searchParam, page, limit) => {
    const response = await getAllUsers(token, searchParam, page, limit);
    return response.status === 200 ? response.data.users : [];
}

export const getUserLength = async (token, searchParam, page, limit) => {
    const response = await getAllUsers(token, searchParam, page, limit);
    return response.status === 200 ? response.data.count : 0;
}

export const handleUpdateUser = async (token, fd) => {
    return await updateUser(token, fd);
}

export const handleAddUser = async (token, fd) => {
    return await addUser(token, fd);
}

export const handleDeleteUser = async (token, user) => {
    return await deleteUser(token, user);
}