import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// 1. Ventas reales
export const obtenerReporteVentas = async (fechaInicio = '', fechaFin = '') => {
    try {
        const params = new URLSearchParams();
        if (fechaInicio) params.append('fechaInicio', fechaInicio);
        if (fechaFin) params.append('fechaFin', fechaFin);
        
        const url = `${API_URL}/ventas?${params}`;
        console.log('🔗 Llamando API ventas:', url);
        
        const response = await axios.get(url);
        console.log('✅ Respuesta ventas:', response.data?.length, 'registros');
        return response.data;
    } catch (error) {
        console.error('❌ Error obteniendo ventas:', error.response?.data || error.message);
        throw error;
    }
};

// 2. Productos más vendidos - USANDO TU RUTA EXISTENTE
export const obtenerTopProductosVendidos = async (limite = 10, fechaInicio = '', fechaFin = '') => {
    try {
        const params = new URLSearchParams();
        if (fechaInicio) params.append('fechaInicio', fechaInicio);
        if (fechaFin) params.append('fechaFin', fechaFin);
        params.append('limite', limite);
        
        const url = `${API_URL}/productos/mas-vendidos?${params}`;
        console.log('🔗 Llamando API productos:', url);
        
        const response = await axios.get(url);
        console.log('✅ Respuesta productos:', response.data);
        return response.data.data;
    } catch (error) {
        console.error('❌ Error obteniendo productos:', error.response?.data || error.message);
        throw error;
    }
};

// 3. Compras reales
export const obtenerReporteCompras = async (fechaInicio = '', fechaFin = '') => {
    try {
        const params = new URLSearchParams();
        if (fechaInicio) params.append('fechainicio', fechaInicio);
        if (fechaFin) params.append('fechafin', fechaFin);
        
        const url = `${API_URL}/compras?${params}`;
        console.log('🔗 Llamando API compras:', url);
        
        const response = await axios.get(url);
        console.log('✅ Respuesta compras:', response.data?.length, 'registros');
        
        const comprasCorregidas = response.data.map(compra => {
            if ((!compra.subtotal || compra.subtotal === 0) && compra.total > 0) {
                const IVA_PORCENTAJE = 0.16;
                const subtotal = compra.total / (1 + IVA_PORCENTAJE);
                const iva = compra.total - subtotal;
                
                return {
                    ...compra,
                    subtotal: parseFloat(subtotal.toFixed(2)),
                    iva: parseFloat(iva.toFixed(2))
                };
            }
            return compra;
        });
        
        return comprasCorregidas;
    } catch (error) {
        console.error('❌ Error obteniendo compras:', error.response?.data || error.message);
        throw error;
    }
};

// 4. Proyecciones
export const obtenerProyeccionVentas = async (meses = 3) => {
    try {
        // Obtener ventas de los últimos 6 meses
        const fechaFin = new Date().toISOString().split('T')[0];
        const fechaInicio = new Date();
        fechaInicio.setMonth(fechaInicio.getMonth() - 6);
        const fechaInicioStr = fechaInicio.toISOString().split('T')[0];
        
        const ventas = await obtenerReporteVentas(fechaInicioStr, fechaFin);
        
        // Agrupar por mes
        const ventasPorMes = {};
        ventas.forEach(v => {
            if (v.fecha) {
                const mes = v.fecha.substring(0, 7); // YYYY-MM
                if (!ventasPorMes[mes]) ventasPorMes[mes] = 0;
                ventasPorMes[mes] += parseFloat(v.total || 0);
            }
        });
        
        // Función para convertir número de mes a nombre abreviado
        const getMesAbreviado = (mesNumero) => {
            const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
                          'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            
            // Si mesNumero es un número (1-12) o string con leading zeros
            const mesNum = parseInt(mesNumero);
            if (mesNum >= 1 && mesNum <= 12) {
                return meses[mesNum - 1];
            }
            return mesNumero;
        };
        
        // Convertir a array con meses abreviados
        const historico = Object.entries(ventasPorMes)
            .map(([mesCompleto, ventas]) => {
                const mesNumero = mesCompleto.split('-')[1]; // "02", "11", etc.
                const mesAbreviado = getMesAbreviado(mesNumero);
                
                return { 
                    mes: mesAbreviado,
                    ventas: Math.round(ventas)
                };
            })
            .sort((a, b) => {
                // Ordenar por fecha original (mes completo)
                const indexA = Object.keys(ventasPorMes).findIndex(key => 
                    key.includes(a.mes) || 
                    getMesAbreviado(key.split('-')[1]) === a.mes
                );
                const indexB = Object.keys(ventasPorMes).findIndex(key => 
                    key.includes(b.mes) || 
                    getMesAbreviado(key.split('-')[1]) === b.mes
                );
                return indexA - indexB;
            });
        
        // Calcular proyección simple con meses futuros
        const proyeccion = [];
        if (historico.length > 0) {
            const crecimiento = 0.08; // 8% mensual
            const fechaActual = new Date();
            
            for (let i = 1; i <= meses; i++) {
                // Calcular mes futuro
                const fechaFutura = new Date(fechaActual);
                fechaFutura.setMonth(fechaActual.getMonth() + i);
                const mesFuturo = fechaFutura.getMonth(); // 0-11
                
                // Obtener nombre abreviado del mes futuro
                const mesesNombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
                                     'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                const mesAbreviado = mesesNombres[mesFuturo];
                
                // Calcular venta proyectada basada en el último mes histórico
                const ultimoMesVentas = historico[historico.length - 1].ventas;
                const ventaProyectada = ultimoMesVentas * (1 + crecimiento * i);
                
                proyeccion.push({
                    mes: mesAbreviado,
                    ventas: Math.round(ventaProyectada)
                });
            }
        }
        
        return { historico, proyeccion };
    } catch (error) {
        console.error('Error obteniendo proyección:', error);
        throw error;
    }
};

// 5. Necesidades de inventario
export const obtenerNecesidadesInventario = async () => {
    try {
        const response = await axios.get(`${API_URL}/inventario`);
        const inventario = response.data || [];
        
        return inventario
            .filter(item => (item.stock_actual || 0) < (item.stock_minimo || 10))
            .map(item => ({
                producto: {
                    codigo_barras: item.Variante?.codigo_barras || 'N/A',
                    nombre: item.Variante?.ProductoPrincipal?.nombre || 'Producto'
                },
                cantidad_necesaria: (item.stock_minimo || 10) - (item.stock_actual || 0),
                stock_actual: item.stock_actual || 0,
                stock_minimo: item.stock_minimo || 10
            }))
            .slice(0, 10);
    } catch (error) {
        console.error('Error obteniendo inventario:', error);
        throw error;
    }
};