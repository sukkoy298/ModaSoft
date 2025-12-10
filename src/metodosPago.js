import axios from 'axios';

const API_URL = 'http://localhost:3000/api/metodos-pago';

export const obtenerMetodosPago = async () => {
  try {
    const resp = await axios.get(API_URL);
    return resp.data;
  } catch (error) {
    console.error('Error al obtener métodos de pago:', error);
    throw error;
  }
};
