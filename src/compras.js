import axios from 'axios';

const API_URL = 'http://localhost:3000/api/compras';
const API_PRODUCTOS = 'http://localhost:3000/api/productos';

// 1. Obtener todas las compras
export const obtenerTodasLasCompras = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error al obtener lista de compras:', error);
        throw error;
    }
};

// 2. Obtener una compra por ID
export const obtenerCompraPorId = async (id_compra) => {
    try {
        const response = await axios.get(`${API_URL}/${id_compra}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener compra ${id_compra}:`, error);
        
        if (error.response?.status === 404) {
            throw new Error('Compra no encontrada');
        }
        
        throw error;
    }
};

// 3. Registrar nueva compra
export const registrarCompra = async (datosCompra) => {
  try {
    
    const response = await axios.post(API_URL, datosCompra);
    
    return response.data;
  } catch (error) {
    
    if (error.response) {
      console.error('Detalles del error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    }
    
    throw error;
  }
};

// 4. Eliminar compra
export const eliminarCompra = async (id_compra) => {
    try {
        const response = await axios.delete(`${API_URL}/${id_compra}`);
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar compra ${id_compra}:`, error);
        throw error;
    }
};

// 5. Obtener compras por proveedor
export const obtenerComprasPorProveedor = async (cedula_proveedor) => {
    try {
        const response = await axios.get(`${API_URL}/proveedor/${cedula_proveedor}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener compras por proveedor:', error);
        throw error;
    }
};

// 6. Obtener compras por fecha
export const obtenerComprasPorFecha = async (fecha_inicio, fecha_fin) => {
    try {
        const response = await axios.get(`${API_URL}/filtro/fecha`, {
            params: { fecha_inicio, fecha_fin }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener compras por fecha:', error);
        throw error;
    }
};

// 7. Buscar productos por código o nombre
export const buscarProductosParaCompra = async (termino) => {
    try {
        const response = await axios.get(`${API_PRODUCTOS}/buscar/${termino}`);
        return response.data;
    } catch (error) {
        console.error('Error al buscar productos:', error);
        throw error;
    }
};

// 8. Obtener productos con stock bajo
export const obtenerProductosBajoStock = async () => {
    try {
        const response = await axios.get(`${API_PRODUCTOS}/bajo-stock`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener productos bajo stock:', error);
        throw error;
    }
};

// 9. Obtener compras de hoy
export const obtenerComprasHoy = async () => {
    try {
        const response = await axios.get(`${API_URL}/hoy`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener compras de hoy:', error);
        throw error;
    }
};

// 10. Obtener compras del mes
export const obtenerComprasEsteMes = async () => {
    try {
        const response = await axios.get(`${API_URL}/mes`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener compras del mes:', error);
        throw error;
    }
};

// 11. Buscar producto por código de barras
export const buscarProductoPorCodigo = async (codigo_barras) => {
    try {
        const response = await axios.get(`${API_PRODUCTOS}/codigo/${codigo_barras}`);
        return response.data;
    } catch (error) {
        console.error(`Error al buscar producto ${codigo_barras}:`, error);
        throw error;
    }
};