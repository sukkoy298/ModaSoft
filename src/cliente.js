import axios from 'axios';
import { ref } from 'vue'; 

const API_URL = 'http://localhost:3000/api/clientes'; 
export const clienteAEditar = ref(null);

// --- FUNCIONES ASÍNCRONAS (CRUD usando Axios) ---

// 1. Obtener todos los clientes ACTIVOS
export const obtenerTodosLosClientes = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data; 
    } catch (error) {
        console.error('Error al obtener lista de clientes:', error);
        throw error;
    }
};

// 2. Obtener un cliente ACTIVO por Cédula
export const obtenerClientePorCedula = async (cedula) => {
    try {
        const response = await axios.get(`${API_URL}/${cedula}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener cliente ${cedula}:`, error);
        
        if (error.response?.status === 404 || error.response?.status === 400) {
            throw new Error('Cliente no encontrado o está inactivo');
        }
        
        throw error;
    }
};

// 3. Actualizar cliente
export const editarCliente = async (cedula, datos) => {
    try {
        const response = await axios.put(`${API_URL}/${cedula}`, datos);
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar cliente ${cedula}:`, error);
        throw error;
    }
};

// 4. Registrar nuevo cliente
export const agregarCliente = async (nuevoCliente) => {
    try {
        const response = await axios.post(API_URL, nuevoCliente);
        return response.data; 
    } catch (error) {
        console.error('Error al registrar cliente:', error);
        throw error;
    }
};

// 5. Eliminar cliente (híbrido: físico si no hay ventas, soft delete si hay ventas)
export const eliminarCliente = async (cedula) => {
    try {
        const response = await axios.delete(`${API_URL}/${cedula}`);
        return response.data; 
    } catch (error) {
        console.error(`Error al eliminar cliente ${cedula}:`, error);
        throw error;
    }
};

// 6. Obtener clientes inactivos
export const obtenerClientesInactivos = async () => {
    try {
        const response = await axios.get(`${API_URL}/inactivos`);
        return response.data; 
    } catch (error) {
        console.error('Error al obtener clientes inactivos:', error);
        throw error;
    }
};

// 7. Restaurar cliente
export const restaurarCliente = async (cedula) => {
    try {
        const response = await axios.post(`${API_URL}/${cedula}/restaurar`);
        return response.data; 
    } catch (error) {
        console.error(`Error al restaurar cliente ${cedula}:`, error);
        throw error;
    }
};

// --- FUNCIONES AUXILIARES DE ESTADO ---
export const limpiarClienteAEditar = () => {
    clienteAEditar.value = null;
};

export const setClienteAEditar = (cliente) => {
    clienteAEditar.value = { ...cliente }; 
};