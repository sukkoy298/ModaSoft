// reportes.js - Funciones para consumir APIs de reportes
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/reportes';

// Reporte de Ventas
export const obtenerReporteVentas = async (fechaInicio, fechaFin, limite = 10) => {
    try {
        const params = new URLSearchParams();
        if (fechaInicio) params.append('fechaInicio', fechaInicio);
        if (fechaFin) params.append('fechaFin', fechaFin);
        if (limite) params.append('limite', limite);
        
        const response = await axios.get(`${API_URL}/ventas?${params}`);
        return response.data;
    } catch (error) {
        console.error('Error obteniendo reporte de ventas:', error);
        throw error;
    }
};

// Reporte de Compras
export const obtenerReporteCompras = async (fechaInicio, fechaFin, limite = 10) => {
    try {
        const params = new URLSearchParams();
        if (fechaInicio) params.append('fechaInicio', fechaInicio);
        if (fechaFin) params.append('fechaFin', fechaFin);
        if (limite) params.append('limite', limite);
        
        const response = await axios.get(`${API_URL}/compras?${params}`);
        return response.data;
    } catch (error) {
        console.error('Error obteniendo reporte de compras:', error);
        throw error;
    }
};

// Productos Más Vendidos
export const obtenerProductosMasVendidos = async (fechaInicio, fechaFin, limite = 10) => {
    try {
        const params = new URLSearchParams();
        if (fechaInicio) params.append('fechaInicio', fechaInicio);
        if (fechaFin) params.append('fechaFin', fechaFin);
        if (limite) params.append('limite', limite);
        
        const response = await axios.get(`${API_URL}/productos-mas-vendidos?${params}`);
        return response.data;
    } catch (error) {
        console.error('Error obteniendo productos más vendidos:', error);
        throw error;
    }
};

// Proyecciones
export const obtenerProyecciones = async () => {
    try {
        const response = await axios.get(`${API_URL}/proyecciones`);
        return response.data;
    } catch (error) {
        console.error('Error obteniendo proyecciones:', error);
        throw error;
    }
};

// Estadísticas Generales
export const obtenerEstadisticasGenerales = async () => {
    try {
        const response = await axios.get(`${API_URL}/estadisticas`);
        return response.data;
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        throw error;
    }
};

// Funciones adicionales que ya tenías para reportes de clientes
export const obtenerTopClientes = async (limite = 10, fechaInicio = '', fechaFin = '') => {
    try {
        const params = new URLSearchParams();
        if (fechaInicio) params.append('fechaInicio', fechaInicio);
        if (fechaFin) params.append('fechaFin', fechaFin);
        params.append('limite', limite);
        
        const response = await axios.get(`${API_URL}/top-clientes?${params}`);
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
        
        const response = await axios.get(`${API_URL}/clientes-tipo?${params}`);
        return response.data;
    } catch (error) {
        console.error('Error obteniendo clientes por tipo:', error);
        throw error;
    }
};