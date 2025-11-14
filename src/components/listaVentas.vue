<script setup>
import Header from '@/components/Header.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { obtenerHistorialVentas, eliminarVenta } from '@/venta.js'

const router = useRouter();
const listaVentas = ref([]);
const errorConexion = ref(false);
const cargando = ref(true);

const cargarVentas = async () => {
    errorConexion.value = false;
    cargando.value = true;

    try {
        console.log('🔍 Cargando historial de ventas...');
        const data = await obtenerHistorialVentas();
        listaVentas.value = data;
        console.log('✅ Ventas cargadas exitosamente');
    } catch (error) {
        console.error('❌ Fallo al cargar las ventas:', error);
        errorConexion.value = true;
    } finally {
        cargando.value = false;
    }
};

// Eliminar venta (anular)
const eliminarVentaHandler = async (idVenta, numeroVenta) => {
    if (!confirm(`¿Está seguro de anular la venta #${numeroVenta}? Esta acción no se puede deshacer.`)) {
        return;
    }

    try {
        console.log(`🗑️ Anulando venta #${numeroVenta}...`);
        await eliminarVenta(idVenta);
        console.log('✅ Venta anulada correctamente');
        
        // Recargar la lista
        await cargarVentas();
        alert(`✅ Venta #${numeroVenta} anulada correctamente`);
    } catch (error) {
        console.error('❌ Error anulando venta:', error);
        alert(`❌ Error al anular la venta: ${error.response?.data?.message || error.message}`);
    }
};

// Navegar a edición de venta
const navegarAEdicionVenta = (idVenta) => {
    router.push(`/edicion-venta/${idVenta}`);
};

const navegarAConsultaVenta = (idVenta) => {
    router.push(`/consulta-ventas/${idVenta}`);
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'USD' }).format(value);
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-VE', options);
};

onMounted(() => {
    cargarVentas();
});
</script>

<template>
    <Header />
    <div class="container mt-5">
        <h1 class="text-center mb-4">Historial de Ventas</h1>
        <div class="d-flex justify-content-between mb-4">
            <h5 class="text-muted">Total de Ventas: {{ listaVentas.length }}</h5>
            <button @click="router.push('/facturacion')" class="btn btn-success">
                <i class="bi bi-plus-circle-fill"></i> Registrar Nueva Venta
            </button>
        </div>

        <div v-if="errorConexion" class="alert alert-danger text-center">
            ⚠️ Error de Conexión: No se pudo cargar el historial de ventas.
        </div>

        <div v-else-if="cargando" class="text-center p-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Cargando historial de ventas...</p>
        </div>

        <div v-else-if="listaVentas.length === 0" class="alert alert-info text-center">
            Aún no hay ventas registradas en la base de datos.
        </div>

        <div v-else class="table-responsive">
            <table class="table table-striped table-hover align-middle">
                <thead class="table-dark">
                    <tr>
                        <th scope="col">Número Venta</th>
                        <th scope="col">Fecha</th>
                        <th scope="col">Cliente</th>
                        <th scope="col">Total</th>
                        <th scope="col">Vendedor</th>
                        <th scope="col">Estado</th>
                        <th scope="col" class="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="venta in listaVentas" :key="venta.id_venta">
                        <td>{{ venta.id_venta }}</td>
                        <td>{{ formatDate(venta.fecha) }}</td>
                        <td>{{ venta.cliente ? venta.cliente.nombre : 'Cliente General' }}</td>
                        <td>{{ formatCurrency(venta.total) }}</td>
                        <td>{{ venta.vendedor }}</td>
                        <td>
                            <span :class="['badge', 
                                venta.estado === 'pagada' ? 'bg-success' : 
                                venta.estado === 'anulada' ? 'bg-danger' : 
                                'bg-warning']">
                                {{ venta.estado }}
                            </span>
                        </td>
                        <td class="text-center">
                            <div class="btn-group" role="group">
                                <button
                                    @click="navegarAConsultaVenta(venta.id_venta)"
                                    class="btn btn-sm btn-outline-info"
                                    title="Ver detalles"
                                >
                                    <i class="bi bi-eye-fill"></i> Ver
                                </button>
                                
                                <button
                                    v-if="venta.estado !== 'anulada'"
                                    @click="navegarAEdicionVenta(venta.id_venta)"
                                    class="btn btn-sm btn-outline-warning"
                                    title="Editar venta"
                                >
                                    <i class="bi bi-pencil-square"></i> Editar
                                </button>
                                
                                <button
                                    v-if="venta.estado !== 'anulada'"
                                    @click="eliminarVentaHandler(venta.id_venta, venta.id_venta)"
                                    class="btn btn-sm btn-outline-danger"
                                    title="Anular venta"
                                >
                                    <i class="bi bi-trash-fill"></i> Anular
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
.btn-group .btn {
    margin: 0 2px;
}
</style>