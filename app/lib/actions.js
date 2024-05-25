import axios from 'axios';

const baseUrl = 'https://atenas-formaturas-5jarkngkqq-rj.a.run.app/';

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
        Authorization: `Bearer ${token}`
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
    return res;
  } catch (err) {
    console.error('err: ', err);
  }
};