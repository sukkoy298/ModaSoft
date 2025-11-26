// src/reportes.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/reportes';

// 1. Obtener top clientes
export const obtenerTopClientes = async (limite = 10, fechaInicio = null, fechaFin = null) => {
    try {
        const params = new URLSearchParams();
        params.append('limite', limite);
        if (fechaInicio) params.append('fechaInicio', fechaInicio);
        if (fechaFin) params.append('fechaFin', fechaFin);

        const response = await axios.get(`${API_URL}/clientes/top?${params}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener top clientes:', error);
        throw error;
    }
};

// 2. Obtener clientes por tipo
export const obtenerClientesPorTipo = async (tipo = null) => {
    try {
        const params = new URLSearchParams();
        if (tipo) params.append('tipo', tipo);

        const response = await axios.get(`${API_URL}/clientes/por-tipo?${params}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener clientes por tipo:', error);
        throw error;
    }
};

// 3. Obtener historial de compras de un cliente
export const obtenerHistorialComprasCliente = async (cedula, fechaInicio = null, fechaFin = null) => {
    try {
        const params = new URLSearchParams();
        if (fechaInicio) params.append('fechaInicio', fechaInicio);
        if (fechaFin) params.append('fechaFin', fechaFin);

        const response = await axios.get(`${API_URL}/clientes/historial/${cedula}?${params}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener historial de compras:', error);
        throw error;
    }
};