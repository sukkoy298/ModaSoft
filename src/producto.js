// src/producto.js

import axios from 'axios';

// URL base de tu backend (Puerto 3000 de Express)
const API_URL = 'http://localhost:3000/api';

/**
 * Obtiene todos los registros del inventario (variantes de producto)
 * del servidor Express.
 * @returns {Promise<Array>} Una promesa que resuelve con la lista del inventario.
 */
export const obtenerTodoElInventario = async () => {
    try {
        const response = await axios.get(`${API_URL}/productos`);
        // La data ya viene limpia y con los JOINs hechos desde el backend
        return response.data; 
    } catch (error) {
        console.error('Error al obtener el inventario:', error);
        // Lanzamos el error para que el componente de Vue lo capture y muestre la alerta
        throw error; 
    }
};

// Puedes añadir aquí otras funciones futuras como:
// export const actualizarStock = async (sku, cantidad) => { ... }
// export const obtenerVariantePorSKU = async (sku) => { ... }