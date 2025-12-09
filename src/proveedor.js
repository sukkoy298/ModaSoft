import axios from 'axios';

const API_URL = 'http://localhost:3000/api/proveedores';

// 1. Obtener todos los proveedores
export const obtenerTodosLosProveedores = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error al obtener lista de proveedores:', error);
        throw error;
    }
};

// 2. Obtener un proveedor por documento
export const obtenerProveedorPorDocIdentidad = async (doc_identidad) => {
    try {
        const response = await axios.get(`${API_URL}/${doc_identidad}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener proveedor ${doc_identidad}:`, error);
        
        if (error.response?.status === 404) {
            throw new Error('Proveedor no encontrado');
        }
        
        throw error;
    }
};

// 3. Actualizar proveedor
export const editarProveedor = async (doc_identidad, datos) => {
    try {
        const response = await axios.put(`${API_URL}/${doc_identidad}`, datos);
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar proveedor ${doc_identidad}:`, error);
        throw error;
    }
};

// 4. Registrar nuevo proveedor
export const agregarProveedor = async (nuevoProveedor) => {
    try {
        const response = await axios.post(API_URL, nuevoProveedor);
        return response.data;
    } catch (error) {
        console.error('Error al registrar proveedor:', error);
        throw error;
    }
};

// 5. Eliminar proveedor
export const eliminarProveedor = async (doc_identidad) => {
    try {
        const response = await axios.delete(`${API_URL}/${doc_identidad}`);
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar proveedor ${doc_identidad}:`, error);
        throw error;
    }
};

// 6. Buscar proveedores
export const buscarProveedores = async (termino) => {
    try {
        const response = await axios.get(`${API_URL}/buscar/${termino}`);
        return response.data;
    } catch (error) {
        console.error('Error al buscar proveedores:', error);
        throw error;
    }
};