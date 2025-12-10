import CatalogoCuentaModel from '../../models/CatalogoCuentaModel.js';

export const obtenerCatalogoCuentas = async () => {
    try {
        const cuentas = await CatalogoCuentaModel.findAll({
            where: { activa: true },
            order: [['codigo', 'ASC']],
            attributes: ['id_cuenta', 'codigo', 'nombre', 'tipo']
        });
        return cuentas;
    } catch (error) {
        console.error('Error al obtener catálogo de cuentas:', error);
        throw error;
    }
};

export const obtenerCuentaPorCodigo = async (codigo) => {
    try {
        const cuenta = await CatalogoCuentaModel.findOne({
            where: { codigo, activa: true },
            attributes: ['id_cuenta', 'codigo', 'nombre', 'tipo']
        });
        return cuenta;
    } catch (error) {
        console.error('Error al obtener cuenta por código:', error);
        throw error;
    }
};

export const crearCuenta = async (data) => {
    try {
        if (!data.codigo || !data.nombre || !data.tipo) {
            throw new Error('Código, nombre y tipo son requeridos');
        }

        const cuenta = await CatalogoCuentaModel.create({
            codigo: data.codigo,
            nombre: data.nombre,
            tipo: data.tipo,
            activa: data.activa !== undefined ? data.activa : true
        });

        return cuenta;
    } catch (error) {
        console.error('Error al crear cuenta:', error);
        throw error;
    }
};

export const actualizarCuenta = async (id, data) => {
    try {
        const cuenta = await CatalogoCuentaModel.findByPk(id);
        if (!cuenta) {
            throw new Error('Cuenta no encontrada');
        }

        await cuenta.update(data);
        return cuenta;
    } catch (error) {
        console.error('Error al actualizar cuenta:', error);
        throw error;
    }
};

export const desactivarCuenta = async (id) => {
    try {
        const cuenta = await CatalogoCuentaModel.findByPk(id);
        if (!cuenta) {
            throw new Error('Cuenta no encontrada');
        }

        await cuenta.update({ activa: false });
        return cuenta;
    } catch (error) {
        console.error('Error al desactivar cuenta:', error);
        throw error;
    }
};