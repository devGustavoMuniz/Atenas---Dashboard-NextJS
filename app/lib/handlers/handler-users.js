import { getAllUsers, updateUser, addUser, deleteUser } from "../../lib";

export const handlerUser = async (token) => {
    const response = await getAllUsers(token);
    return response.status === 200 ? response.data.users : [];
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