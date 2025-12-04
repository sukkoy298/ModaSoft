import axios from 'axios';

const API_URL = 'http://localhost:3000/api/reportes';

// Funciones adicionales para reportes de clientes
export const obtenerTopClientes = async (limite = 10, fechaInicio = '', fechaFin = '') => {
    try {
        const params = new URLSearchParams();
        if (fechaInicio) params.append('fechaInicio', fechaInicio);
        if (fechaFin) params.append('fechaFin', fechaFin);
        params.append('limite', limite);
        
        const response = await axios.get(`${API_URL}/clientes/top?${params}`);
        return response.data;
    } catch (error) {
        console.error('Error obteniendo top clientes:', error);
        throw error;
    }
};

export const obtenerClientesPorTipo = async (tipo = '', fechaInicio = '', fechaFin = '') => {
    try {
        const params = new URLSearchParams();
        if (tipo) params.append('tipo', tipo);
        if (fechaInicio) params.append('fechaInicio', fechaInicio);
        if (fechaFin) params.append('fechaFin', fechaFin);
        
        const response = await axios.get(`${API_URL}/clientes/por-tipo?${params}`);
        return response.data;
    } catch (error) {
        console.error('Error obteniendo clientes por tipo:', error);
        throw error;
    }
};