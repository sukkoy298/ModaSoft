<template>

    <Navbar/>
    <div class="container-fluid py-4">
    <h1 class="mb-4 text-center">Stock de Inventario</h1> 
    </div>
    <div class="container mt-4">
    <div class="card shadow">
      <div class="card-body">
        
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
              v-for="item in dataInventario" 
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
                :imageUrl="dataInventario.rutaImagen" 
                :productId="dataInventario.id" 
                />
            </td>
            </tr>
            
            <tr v-if="dataInventario.length === 0">
                <td colspan="7" class="text-center text-muted py-3">No hay productos registrados en el inventario.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  
</template>

<script setup>
import Navbar from './Navbar.vue';
import { reactive, ref } from 'vue';
import MostrarImagenProd from './MostrarImagenProd.vue';

//Data para popular la lista de inventario ficticio
let dataInventario = reactive([
    { id: 101, sku: 'TSM001', nombre: 'T-Shirt Logo', talla: 'M', color: 'Azul', stock: 25, stockMinimo: 10, precioVenta: 25.00, rutaImagen: "@/assets/tshirt.jpg" },
    { id: 102, sku: 'CLJ045', nombre: 'Chaqueta Ligera', talla: 'L', color: 'Negro', stock: 5, stockMinimo: 10, precioVenta: 70.00, rutaImagen: "./assets/chaqueta_ligera.jpg" },
    { id: 103, sku: 'PNB012', nombre: 'Pantalón Negro', talla: '32', color: 'Negro', stock: 12, stockMinimo: 15, precioVenta: 45.00, rutaImagen: "./assets/pantalon_negro.jpg" },
    ]);
</script>