<template>
  <Header />
  <div class="container moda-main-container mt-5 mb-5">
    <h1 class="moda-title text-center mb-4">Administración de Proveedores</h1>

    <!-- Encabezado con contador y botón -->
    <div class="moda-header-card mb-4">
      <div class="d-flex justify-content-between align-items-center p-3">
        <div>
          <h5 class="moda-subtitle mb-0">
            Total de Proveedores: 
            <span class="moda-counter">{{ proveedores.length }}</span>
          </h5>
        </div>
        <button @click="navegarARegistro" class="btn btn-moda-primary">
          <i class="bi bi-person-plus-fill me-2"></i> Nuevo Proveedor
        </button>
      </div>
    </div>

    <!-- Barra de búsqueda -->
    <div class="moda-search-bar mb-4">
      <div class="input-group">
        <span class="input-group-text moda-search-icon">
          <i class="bi bi-search"></i>
        </span>
        <input 
          type="text" 
          class="form-control moda-input" 
          placeholder="Buscar proveedor por nombre, documento o email..."
          v-model="terminoBusqueda"
          @input="filtrarProveedores"
        >
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="cargando" class="moda-loading-state">
      <div class="moda-spinner"></div>
      <p class="mt-3 moda-subtitle">Cargando proveedores...</p>
    </div>

    <!-- Error de conexión -->
    <div v-else-if="errorConexion" class="moda-alert moda-alert-error">
      <i class="bi bi-exclamation-triangle me-2"></i>
      Error de Conexión: El servidor no respondió o fue inaccesible.
    </div>

    <!-- Tabla de Proveedores -->
    <div v-else>
      <div v-if="proveedoresFiltrados.length === 0" class="moda-alert moda-alert-info text-center">
        <i class="bi bi-info-circle me-2"></i>
        {{ terminoBusqueda ? 'No hay proveedores que coincidan con la búsqueda' : 'No hay proveedores registrados' }}
      </div>

      <div v-else class="moda-table-container">
        <table class="moda-table">
          <thead>
            <tr>
              <th scope="col">Documento</th>
              <th scope="col">Nombre</th>
              <th scope="col">Teléfono</th>
              <th scope="col">Email</th>
              <th scope="col">Dirección</th>
              <th scope="col" class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="proveedor in proveedoresFiltrados" :key="proveedor.doc_identidad">
              <td>
                <strong class="moda-documento">{{ proveedor.doc_identidad || 'N/A' }}</strong>
              </td>
              <td>{{ proveedor.nombre || 'N/A' }}</td>
              <td>
                <span v-if="proveedor.telefono" class="moda-telefono">
                  <i class="bi bi-telephone me-1"></i>{{ proveedor.telefono }}
                </span>
                <span v-else class="text-muted">Sin teléfono</span>
              </td>
              <td>
                <span v-if="proveedor.email" class="moda-email">{{ proveedor.email }}</span>
                <span v-else class="text-muted">Sin email</span>
              </td>
              <td>
                <span v-if="proveedor.direccion" class="moda-direccion">
                  {{ proveedor.direccion.length > 30 ? proveedor.direccion.substring(0, 30) + '...' : proveedor.direccion }}
                </span>
                <span v-else class="text-muted">Sin dirección</span>
              </td>
              <td class="moda-actions">
                <button 
                  @click="navegarAEdicion(proveedor.doc_identidad)" 
                  class="btn btn-moda-action btn-edit"
                  title="Editar proveedor"
                >
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button 
                  @click="manejarEliminacion(proveedor.doc_identidad, proveedor.nombre)" 
                  class="btn btn-moda-action btn-delete"
                  title="Eliminar proveedor"
                >
                  <i class="bi bi-trash-fill"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Estadísticas -->
      <div class="row mt-4">
        <div class="col-md-3">
          <div class="moda-stat-card">
            <div class="moda-stat-icon bg-primary">
              <i class="bi bi-person-fill"></i>
            </div>
            <div class="moda-stat-info">
              <div class="moda-stat-number">{{ proveedores.length }}</div>
              <div class="moda-stat-label">Total Proveedores</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="moda-stat-card">
            <div class="moda-stat-icon bg-success">
              <i class="bi bi-telephone-fill"></i>
            </div>
            <div class="moda-stat-info">
              <div class="moda-stat-number">{{ proveedoresConTelefono }}</div>
              <div class="moda-stat-label">Con Teléfono</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="moda-stat-card">
            <div class="moda-stat-icon bg-warning">
              <i class="bi bi-envelope-fill"></i>
            </div>
            <div class="moda-stat-info">
              <div class="moda-stat-number">{{ proveedoresConEmail }}</div>
              <div class="moda-stat-label">Con Email</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="moda-stat-card">
            <div class="moda-stat-icon bg-info">
              <i class="bi bi-geo-alt-fill"></i>
            </div>
            <div class="moda-stat-info">
              <div class="moda-stat-number">{{ proveedoresConDireccion }}</div>
              <div class="moda-stat-label">Con Dirección</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  obtenerTodosLosProveedores, 
  eliminarProveedor 
} from '@/proveedor.js'

const router = useRouter();
const proveedores = ref([]);
const proveedoresFiltrados = ref([]);
const errorConexion = ref(false);
const cargando = ref(true);
const terminoBusqueda = ref('');

// Computed properties para estadísticas
const proveedoresConTelefono = computed(() => {
  return proveedores.value.filter(p => p.telefono).length;
});

const proveedoresConEmail = computed(() => {
  return proveedores.value.filter(p => p.email).length;
});

const proveedoresConDireccion = computed(() => {
  return proveedores.value.filter(p => p.direccion).length;
});

// Cargar proveedores
const cargarProveedores = async () => {
  errorConexion.value = false;
  cargando.value = true;
  try {
    const data = await obtenerTodosLosProveedores();
    proveedores.value = data;
    proveedoresFiltrados.value = data;
  } catch (error) {
    console.error('Error al cargar proveedores:', error);
    errorConexion.value = true;
  } finally {
    cargando.value = false;
  }
};

// Filtrar proveedores
const filtrarProveedores = () => {
  if (!terminoBusqueda.value) {
    proveedoresFiltrados.value = proveedores.value;
    return;
  }

  const termino = terminoBusqueda.value.toLowerCase();
  proveedoresFiltrados.value = proveedores.value.filter(p => 
    (p.doc_identidad && p.doc_identidad.toLowerCase().includes(termino)) ||
    (p.nombre && p.nombre.toLowerCase().includes(termino)) ||
    (p.email && p.email.toLowerCase().includes(termino)) ||
    (p.telefono && p.telefono.toLowerCase().includes(termino))
  );
};

// Navegación
const navegarAEdicion = (doc_identidad) => {
  router.push({ name: 'edicion-proveedor', params: { doc_identidad: doc_identidad } });
};

const navegarARegistro = () => {
  router.push('/proveedor/nuevo');
};

// Eliminación
const manejarEliminacion = async (doc_identidad, nombre) => { 
  if (!window.confirm(`¿Está seguro de eliminar al proveedor ${nombre} (${doc_identidad})?`)) {
    return;
  }

  try {
    const resultado = await eliminarProveedor(doc_identidad);
    
    alert(`✅ Proveedor ${nombre} eliminado correctamente.`);
    cargarProveedores();
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Error al eliminar el proveedor.';
    alert(`❌ Fallo: ${errorMsg}`); 
  }
};

onMounted(() => {
  cargarProveedores();
});
</script>

<style scoped>
/* Contenedor principal */
.moda-main-container {
  background-color: #FFFDFB;
  border-radius: 14px;
  border: 1px solid #D6CFC8;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(74, 59, 52, 0.1);
}

/* Títulos */
.moda-title {
  color: #3A2E2A;
  font-weight: 700;
  font-size: 1.8rem;
  margin-bottom: 2rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #D6CFC8;
}

.moda-subtitle {
  color: #8B7355;
  font-weight: 500;
  font-size: 1rem;
}

.moda-counter {
  color: #4A3B34;
  font-weight: 700;
  font-size: 1.2rem;
}

/* Encabezado */
.moda-header-card {
  background-color: #F8F5F2;
  border-radius: 10px;
  border: 1px solid #D6CFC8;
}

/* Barra de búsqueda */
.moda-search-bar {
  background-color: #F8F5F2;
  border-radius: 10px;
  padding: 1rem;
  border: 1px solid #D6CFC8;
}

.moda-search-icon {
  background-color: #FFFDFB;
  border-color: #D6CFC8;
  border-right: none;
}

.moda-input {
  border-left: none;
}

/* Botones */
.btn-moda-primary {
  background-color: #4A3B34 !important;
  border-color: #4A3B34 !important;
  color: white !important;
  border-radius: 8px;
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-moda-primary:hover {
  background-color: #352822 !important;
  border-color: #352822 !important;
  transform: translateY(-2px);
}

/* Estados */
.moda-loading-state {
  text-align: center;
  padding: 3rem;
}

.moda-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #D6CFC8;
  border-top-color: #4A3B34;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Alertas */
.moda-alert {
  padding: 1rem 1.5rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  border: 1px solid;
  display: flex;
  align-items: center;
}

.moda-alert-error {
  background-color: rgba(220, 53, 69, 0.1);
  border-color: #dc3545;
  color: #dc3545;
}

.moda-alert-info {
  background-color: rgba(139, 115, 85, 0.1);
  border-color: #8B7355;
  color: #8B7355;
}

/* Tabla */
.moda-table-container {
  background-color: #FFFDFB;
  border-radius: 10px;
  border: 1px solid #D6CFC8;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(74, 59, 52, 0.08);
}

.moda-table {
  width: 100%;
  border-collapse: collapse;
}

.moda-table thead {
  background: linear-gradient(135deg, #4A3B34, #5D4A3A);
}

.moda-table thead th {
  color: white;
  padding: 1rem;
  font-weight: 600;
  text-align: left;
  border: none;
}

.moda-table tbody tr {
  border-bottom: 1px solid #D6CFC8;
  transition: all 0.2s ease;
}

.moda-table tbody tr:hover {
  background-color: rgba(139, 115, 85, 0.05);
}

.moda-table tbody td {
  padding: 1rem;
  color: #3A2E2A;
  vertical-align: middle;
}

/* Campos especiales */
.moda-documento {
  color: #4A3B34;
  font-family: monospace;
  font-size: 0.9rem;
}

.moda-telefono {
  color: #198754;
  font-weight: 500;
}

.moda-email {
  color: #0d6efd;
  font-size: 0.9rem;
}

.moda-direccion {
  color: #6c757d;
  font-size: 0.85rem;
}

/* Acciones */
.moda-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
}

.btn-moda-action {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  transition: all 0.2s ease;
}

.btn-edit {
  background-color: rgba(74, 59, 52, 0.1);
  color: #4A3B34;
}

.btn-edit:hover {
  background-color: #4A3B34;
  color: white;
  transform: translateY(-2px);
}

.btn-delete {
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.btn-delete:hover {
  background-color: #dc3545;
  color: white;
  transform: translateY(-2px);
}

/* Tarjetas de estadísticas */
.moda-stat-card {
  background-color: #F8F5F2;
  border-radius: 10px;
  padding: 1.5rem;
  border: 1px solid #D6CFC8;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.moda-stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(74, 59, 52, 0.1);
}

.moda-stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.bg-primary { background-color: #4A3B34; }
.bg-success { background-color: #198754; }
.bg-warning { background-color: #ffc107; }
.bg-info { background-color: #0dcaf0; }

.moda-stat-info {
  flex: 1;
}

.moda-stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3A2E2A;
}

.moda-stat-label {
  font-size: 0.85rem;
  color: #8B7355;
  margin-top: 0.25rem;
}

/* Responsive */
@media (max-width: 768px) {
  .moda-main-container {
    padding: 1rem;
  }
  
  .moda-table-container {
    overflow-x: auto;
  }
  
  .moda-table {
    min-width: 800px;
  }
  
  .moda-stat-card {
    margin-bottom: 1rem;
  }
  
  .moda-header-card .d-flex {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch !important;
  }
  
  .moda-header-card .btn {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .moda-title {
    font-size: 1.5rem;
  }
  
  .moda-table thead th,
  .moda-table tbody td {
    padding: 0.75rem 0.5rem;
  }
}
</style>