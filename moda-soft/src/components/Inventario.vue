<template>

    <Navbar/>
    <div class="container-fluid py-4">
    <h1 class="mb-4 text-center text-dark">
    <i class="bi bi-box-seam me-3 text-secondary"></i> 
    <span class="fw-light">Gestión de </span><span class="fw-bold">Stock de Inventario</span>
    </h1> 
    </div>
    <div class="container mt-4">
    <div class="card shadow">
      <div class="card-body">

        <div class="row mb-3">
        <div class="col-md-4">
            <div class="input-group">
                <span class="input-group-text"><i class="bi bi-search"></i></span>
                <input 
                    type="text" 
                    class="form-control" 
                    placeholder="Buscar por SKU, Nombre, Talla o Color..."
                    v-model="valorBusqueda" >
            </div>
        </div>
        </div>
        
        <table class="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Producto</th>
              <th>Variante (Talla/Color)</th>
              <th class="text-center">Stock Mínimo</th>
              <th class="text-center">Stock Actual</th>
              <th>Precio Venta</th>
              <th class="text-center">Estado</th>
              <th class="text-center">Imagen</th>
            </tr>
          </thead>
          
          <tbody>
            <tr 
              v-for="item in inventarioFiltrado" 
              :key="item.id"
              :class="{'table-danger': item.stock < 5, 'table-warning': item.stock >= 5 && item.stock <= item.stockMinimo}"
            >
              <td><small class="text-muted">{{ item.sku }}</small></td>
              <td class="fw-bold">{{ item.nombre }}</td>
              <td>{{ item.talla }} / {{ item.color }}</td>
              <td class="text-center text-muted">{{ item.stockMinimo }}</td>
              <td class="text-center">
                <span class="badge rounded-pill fs-6" 
                  :class="{'bg-danger': item.stock < 5, 'bg-warning': item.stock >= 5 && item.stock <= item.stockMinimo, 'bg-success': item.stock > item.stockMinimo}"
                >
                  {{ item.stock }}
                </span>
              </td>
              <td>${{ item.precioVenta.toFixed(2) }}</td>
              <td class="text-center">
                <span v-if="item.stock <= item.stockMinimo" class="text-danger fw-bold">
                  <i class="bi bi-exclamation-triangle-fill"></i> REORDENAR
                </span>
                <span v-else class="text-success">
                  Suficiente
                </span>
              </td>
              <td class="text-center">
                <MostrarImagenProd 
                :imageUrl="item.rutaImagen" 
                :productId="item.id" 
                />
              </td>
            </tr>
            
            
          </tbody>
        </table>
        <div v-if="inventarioFiltrado.length === 0" class="alert alert-info text-center mt-3">
            No se encontraron productos que coincidan con "{{ valorBusqueda }}" o el inventario esta vacio.
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup>
import Navbar from './Navbar.vue';
import { ref, computed } from 'vue';
import MostrarImagenProd from './MostrarImagenProd.vue';

//Data para popular la lista de inventario ficticio
const dataInventario = ref([
    { id: 101, sku: 'TSM001', nombre: 'T-Shirt Logo', talla: 'M', color: 'Azul', stock: 25, stockMinimo: 10, precioVenta: 25.00, rutaImagen: "/tshirt.jpg" },
    { id: 102, sku: 'CLJ045', nombre: 'Chaqueta Ligera', talla: 'L', color: 'Negro', stock: 5, stockMinimo: 10, precioVenta: 70.00, rutaImagen: "/chaqueta_ligera.jpg" },
    { id: 103, sku: 'PNB012', nombre: 'Pantalón Negro', talla: '32', color: 'Negro', stock: 12, stockMinimo: 15, precioVenta: 45.00, rutaImagen: "/patalon_negro.jpg" }
    ]);

  //funcionalidad para poder filtrar valores en la tabla con computed
  const valorBusqueda = ref('');
  const inventarioFiltrado = computed(() => {
    if (!valorBusqueda.value.trim()) {
        return dataInventario.value;
    }

    const term = valorBusqueda.value.toLowerCase().trim();
    return dataInventario.value.filter(item => {
        const itemData = `${item.sku} ${item.nombre} ${item.talla} ${item.color}`.toLowerCase();
        return itemData.includes(term);
    });
  });
</script>