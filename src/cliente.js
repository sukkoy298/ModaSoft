import axios from 'axios';
import { ref } from 'vue'; 

// URL base para el endpoint de la API de Clientes
const API_URL = 'http://localhost:3000/api/clientes'; 

// Estado reactivo para transferir el cliente a editar
export const clienteAEditar = ref(null);

// --- FUNCIONES ASÍNCRONAS (CRUD usando Axios) ---

// 1. Obtener todos los clientes (LISTAR)
export const obtenerTodosLosClientes = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data; 
    } catch (error) {
        console.error('Error al obtener lista de clientes:', error);
        throw error;
    }
};

// 2. ✅ CORREGIDO: Obtener un cliente por Cédula (usando API REST)
export const obtenerClientePorCedula = async (cedula) => {
    try {
        const response = await axios.get(`${API_URL}/${cedula}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener cliente ${cedula}:`, error);
        
        // Si es error 404, lanzar mensaje específico
        if (error.response?.status === 404) {
            throw new Error('Cliente no encontrado');
        }
        
        throw error;
    }
};

// 3. ✅ CORREGIDO: Actualizar cliente (usando API REST)
export const editarCliente = async (cedula, datos) => {
    try {
        const response = await axios.put(`${API_URL}/${cedula}`, datos);
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar cliente ${cedula}:`, error);
        throw error;
    }
};

// 4. Registrar un nuevo cliente (REGISTRAR)
export const agregarCliente = async (nuevoCliente) => {
    try {
        const response = await axios.post(API_URL, nuevoCliente);
        return response.data; 
    } catch (error) {
        console.error('Error al registrar cliente:', error);
        throw error;
    }
};

// 5. Eliminar un cliente (ELIMINAR)
export const eliminarCliente = async (cedula) => {
    try {
        const response = await axios.delete(`${API_URL}/${cedula}`);
        return response.data; 
    } catch (error) {
        console.error(`Error al eliminar cliente ${cedula}:`, error);
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