import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export async function obtenerCatalogoCuentas() {
    try {
        const res = await axios.get(`${API_URL}/catalogo-cuentas`);
        return res.data?.data || [];
    } catch (err) {
        console.error('Error obtenerCatalogoCuentas:', err);
        return [];
    }
}

export async function obtenerCuentaPorCodigo(codigo) {
    try {
        const res = await axios.get(`${API_URL}/catalogo-cuentas/${codigo}`);
        return res.data?.data || null;
    } catch (err) {
        console.error('Error obtenerCuentaPorCodigo:', err);
        return null;
    }
}

export async function crearCuenta(cuentaData) {
    try {
        const res = await axios.post(`${API_URL}/catalogo-cuentas`, cuentaData);
        return res.data;
    } catch (err) {
        console.error('Error crearCuenta:', err);
        throw err;
    }
}