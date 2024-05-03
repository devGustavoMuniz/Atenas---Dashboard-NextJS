import { getAllUsers, updateUser, addUser, deleteUser } from "../../lib";

export const handlerUser = async (token) => {
    const response = await getAllUsers(token);
    return response.status === 200 ? response.data : [];
}

export const handleUpdateUser = async (token, user) => {
    return await updateUser(token, user);
}

export const handleAddUser = async (token, user) => {
    return await addUser(token, user);
}

export const handleDeleteUser = async (token, user) => {
    return await deleteUser(token, user);
}