import axios from 'axios';

const baseUrl = 'https://back-atenas-be3942560054.herokuapp.com';

export const login = async ({ username, password }) => {
    const response = await axios.post(`${baseUrl}/v1/autenticar`, {}, {
      auth: {
        username,
        password
      }
    });

    return response.data;
};

export const validate = async ({token}) => {
  const response = await axios.post(`${baseUrl}/v1/autenticar`, {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.status == 200 ? true : false;
};

export const getAllUsers = async (token) => {
  try{
    const res = await axios.get(`${baseUrl}/v1/user/getAll`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('aaaaaa:', res);
    return res;
  } catch (err) {
    console.error('err: ', err);
  }
};

export const addUser = async (token, user) => {
  try{
    const response = await axios.post(`${baseUrl}/v1/user`, user, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (err) {
    console.error('err: ', err);
  }
};

export const updateUser = async (token, user) => {
  try{
    return await axios.put(`${baseUrl}/v1/user`, user, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (err) {
    console.error('err: ', err);
  }
};

export const deleteUser = async (token, {nomeUsuario, email}) => {
  try{
    return await axios.patch(`${baseUrl}/v1/user`, {nomeUsuario, email}, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imd1c3Rhdm9AZXhhbXBsZS5jb20iLCJub21lVXN1YXJpbyI6Ikd1c3Rhdm9vb28iLCJpYXQiOjE3MTQ3NjA3NTIsImV4cCI6MTcxNDgwMzk1Mn0.uWg3O93pCPdPP-ghcpC3GU5e5c52i9Kcjh6EZKhtKV4`
      }
    });
  } catch (err) {
    console.error('err: ', err);
  }
};

export const getAllAlbums = async (token) => {
  try{
    const res = await axios.post(`${baseUrl}/v1/albuns/getAll`, {limit: 0, skip: 1}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("resasas: ", res);
    return res;
  } catch (err) {
    console.error('err: ', err);
  }
};