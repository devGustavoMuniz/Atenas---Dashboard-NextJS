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
    const res = await axios.get(`${baseUrl}/v1/user/getAll/1/10`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('res', res);
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

export const addAlbum = async (token, fd) => {
  try{
    console.log('passou aq');
    const res = await axios.post(`${baseUrl}/v1/albuns`, fd, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return res;
  } catch (err) {
    console.error('err: ', err);
  }
};

export const getAllAlbums = async (token) => {
  try{
    const res = await axios.get(`${baseUrl}/v1/albuns/getAll/1/10`, {
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
    fd.forEach((value, key) => {
      let valueType;
      if (value instanceof File) {
        valueType = 'File';
      } else if (value instanceof Blob) {
        valueType = 'Blob';
      } else {
        valueType = typeof value;
      }
      console.log(key, value, valueType);
    });
    return await axios.put(`${baseUrl}/v1/albuns`, fd, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
  } catch (err) {
    console.error('err: ', err);
  }
};