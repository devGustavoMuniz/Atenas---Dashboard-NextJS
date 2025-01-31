import axios from 'axios';

const baseUrl = 'https://atenas-formaturas-5jarkngkqq-rj.a.run.app';

export const login = async ({ username, password }) => {
    const response = await axios.post(`${baseUrl}/v1/autenticar`, {}, {
      auth: {
        username,
        password
      }
    });

    return response.data;
};

export const validate = async (token) => {
  try {
    const response = await axios.get(`${baseUrl}/v1/autenticar`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.status == 200 ? true : false;
  } catch (error) {
    return false;
  }
};

export const getAllUsers = async (token, searchParam, offset,  limit,) => {
  try{
    const res = await axios.get(`${baseUrl}/v1/user/getAll/${offset}/${limit}?numContrato=${searchParam}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res;
  } catch (err) {
    console.error('err: ', err);
  }
};

export const addUser = async (token, fd) => {
  try{
    const response = await axios.post(`${baseUrl}/v1/user`, fd, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response;
  } catch (err) {
    console.error('err: ', err);
  }
};

export const updateUser = async (token, fd) => {
  try{
    return await axios.put(`${baseUrl}/v1/user`, fd, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
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
        Authorization: `Bearer ${token}`
      }
    });
  } catch (err) {
    console.error('err: ', err);
  }
};

export const addAlbum = async (token, album) => {
  try{
    const res = await axios.post(`${baseUrl}/v1/albuns/create-album`, album, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return res;
  } catch (err) {
    console.error('err: ', err);
  }
};

export const getAllAlbums = async (token) => {
  try{
    const res = await axios.get(`${baseUrl}/v1/albuns/getAll`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return res;
  } catch (err) {
    console.error('err: ', err);
  }
};

export const deleteAlbum = async (token, {nomeAluno, numeroContrato}) => {
  try{
    return await axios.patch(`${baseUrl}/v1/albuns`, {nomeAluno, numeroContrato}, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
  } catch (err) {
    console.error('err: ', err);
  }
};

export const updateAlbum = async (token, fd) => {  
  try{
    return await axios.put(`${baseUrl}/v1/albuns`, fd, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    console.error('err: ', err);
  }
};

export const uploadFoto = async (token, fd) => {  
  try{
    
    return await axios.post(`${baseUrl}/v1/albuns/set-photo`, fd, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/formdata'
      }
    });
  } catch (err) {
    console.error('err: ', err);
  }
};

export const deleteFoto = async (token, fd) => {  
  try{
    
    return await axios.patch(`${baseUrl}/v1/albuns/delete-photo`, fd, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    console.error('err: ', err);
  }
};