import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const obtenerTodoElInventario = async () => {
    try {
        const response = await axios.get(`${API_URL}/productos`);
        return response.data; 
    } catch (error) {
        console.error('Error al obtener el inventario:', error);
        throw error; 
    }
};