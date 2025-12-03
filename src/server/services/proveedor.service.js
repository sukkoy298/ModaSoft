import ProveedorModel from '../../models/ProveedorModel.js';
import CompraModel from '../../models/CompraModel.js';
import { Op } from 'sequelize';

export const obtenerTodosLosProveedores = async () => {
    try {
        const proveedores = await ProveedorModel.findAll({
            attributes: ['doc_identidad', 'nombre', 'telefono', 'email', 'direccion'],
            order: [['nombre', 'ASC']]
        });
        return proveedores;
    } catch (error) {
        console.error("Error al obtener los proveedores:", error);
        throw new Error("No se pudo obtener la lista de proveedores.");
    }
};

export const obtenerProveedorPorDoc = async (doc_identidad) => {
    try {
        const proveedor = await ProveedorModel.findByPk(doc_identidad);
        return proveedor;
    } catch (error) {
        console.error("Error al obtener proveedor por documento:", error);
        throw new Error("Error en la base de datos.");
    }
};

export const registrarProveedor = async (data) => {
    try {
        if (!data.doc_identidad || !data.nombre) {
            throw new Error("Documento de identidad y nombre son obligatorios.");
        }

        const nuevoProveedor = await ProveedorModel.create(data);
        return nuevoProveedor;
    } catch (error) {
        console.error("Error al registrar proveedor:", error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error(`El proveedor con documento '${data.doc_identidad}' ya existe.`);
        }
        throw error;
    }
};

export const actualizarProveedor = async (doc_identidad, datos) => {
    try {
        const [filasActualizadas] = await ProveedorModel.update(datos, {
            where: { doc_identidad },
        });

        if (filasActualizadas === 0) {
            const proveedor = await ProveedorModel.findByPk(doc_identidad);
            if (!proveedor) {
                throw new Error(`Proveedor no encontrado.`);
            }
            return { message: "Datos del proveedor sin cambios." };
        }

        const proveedorActualizado = await ProveedorModel.findByPk(doc_identidad);
        return proveedorActualizado;
    } catch (error) {
        console.error("Error al actualizar proveedor:", error);
        throw error;
    }
};

export const eliminarProveedor = async (doc_identidad) => {
    try {
        const resultado = await ProveedorModel.destroy({
            where: { doc_identidad }
        });

        if (resultado === 0) {
            throw new Error(`Proveedor con documento ${doc_identidad} no encontrado.`);
        }
        return { message: `Proveedor eliminado con éxito.` };
    } catch (error) {
        console.error("Error al eliminar proveedor:", error);
        throw error;
    }
};

export const obtenerComprasPorProveedor = async (doc_identidad, fechaInicio, fechaFin) => {
    try {
        console.log('Service recibió:', { fechaInicio, fechaFin });
        
        const whereClause = { 
            cedula_proveedor: doc_identidad 
        };
        
        if (fechaInicio && fechaFin) {
            // Asegurar que las fechas tengan formato correcto
            const inicio = new Date(fechaInicio);
            const fin = new Date(fechaFin);
            
            console.log('Fechas como Date:', { inicio, fin });
            
            // Si alguna fecha es inválida, usar sin filtro
            if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
                console.log('Fechas inválidas, buscando TODAS las compras');
            } else {
                whereClause.fecha = {
                    [Op.between]: [inicio, fin]
                };
            }
        }
        
        console.log('Cláusula WHERE:', whereClause);
        
        const compras = await CompraModel.findAll({
            where: whereClause,
            order: [['fecha', 'DESC']],
            attributes: [
                ['id_compra', 'id'],
                'fecha',
                ['nro_factura', 'numero_factura'],
                'subtotal',
                'iva',
                'total',
                'cedula_proveedor'
            ]
        });
        
        console.log(`Encontradas ${compras.length} compras`);
        
        // Formatear fechas
        const comprasFormateadas = compras.map(compra => {
            const data = compra.toJSON();
            
            let fechaCorregida = '';
            if (data.fecha) {
                if (typeof data.fecha === 'string') {
                    const [year, month, day] = data.fecha.split('-');
                    fechaCorregida = `${day}/${month}/${year}`;
                } else {
                    const fecha = new Date(data.fecha);
                    const dia = fecha.getDate().toString().padStart(2, '0');
                    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
                    const año = fecha.getFullYear();
                    fechaCorregida = `${dia}/${mes}/${año}`;
                }
            }
            
            return {
                id: data.id,
                fecha: data.fecha, 
                fecha_corregida: fechaCorregida,
                numero_factura: data.numero_factura,
                subtotal: parseFloat(data.subtotal) || 0,
                iva: parseFloat(data.iva) || 0,
                total: parseFloat(data.total) || 0,
                cedula_proveedor: data.cedula_proveedor
            };
        });
        
        return comprasFormateadas;
    } catch (error) {
        console.error("Error:", error.message);
        throw new Error(`No se pudo obtener las compras: ${error.message}`);
    }
};
export const obtenerComprasPorRangoFechas = async (fecha_inicio, fecha_fin) => {
    try {
        if (!fecha_inicio || !fecha_fin) {
            throw new Error("Las fechas de inicio y fin son requeridas.");
        }
        
        console.log(`Buscando compras entre ${fecha_inicio} y ${fecha_fin}`);
        
        const inicio = new Date(fecha_inicio);
        inicio.setHours(0, 0, 0, 0);
        
        const fin = new Date(fecha_fin);
        fin.setHours(23, 59, 59, 999);
        
        const compras = await CompraModel.findAll({
            where: {
                fecha: {
                    [Op.between]: [inicio, fin]
                }
            },
            include: [{
                model: ProveedorModel,
                attributes: ['nombre', 'doc_identidad'],
                foreignKey: 'cedula_proveedor', // Relación por cédula
                targetKey: 'doc_identidad',
                required: false
            }],
            order: [['fecha', 'DESC']],
            attributes: [
                ['id_compra', 'id'],
                'fecha',
                ['nro_factura', 'numero_factura'],
                'subtotal',
                'iva',
                'total',
                'cedula_proveedor'
            ]
        });
        
        console.log(`Compras en rango encontradas: ${compras.length}`);
        
        // Formatear respuesta
        const comprasFormateadas = compras.map(compra => {
            const data = compra.toJSON();
            return {
                id: data.id,
                fecha: data.fecha ? data.fecha.toString() : null,
                numero_factura: data.numero_factura,
                subtotal: data.subtotal ? parseFloat(data.subtotal) : 0,
                iva: data.iva ? parseFloat(data.iva) : 0,
                total: data.total ? parseFloat(data.total) : 0,
                proveedor_nombre: data.Proveedor ? data.Proveedor.nombre : null,
                proveedor_doc: data.cedula_proveedor
            };
        });
        
        return comprasFormateadas;
    } catch (error) {
        console.error("Error en obtenerComprasPorRangoFechas:", error.message);
        throw new Error(`No se pudo obtener las compras: ${error.message}`);
    }
};

// Función para formatear precios correctamente
export const formatearPrecio = (monto) => {
    // Convertir a número si es string
    const numero = typeof monto === 'string' 
        ? parseFloat(monto.replace(',', '.').replace('USD', '').trim())
        : monto;
    
    // Formatear con separador decimal correcto
    return `USD ${numero.toFixed(2).replace('.', ',')}`;
};

// Función para parsear precios del frontend
export const parsearPrecio = (precioString) => {
    return parseFloat(precioString
        .replace('USD', '')
        .replace(',', '.')
        .trim());
};