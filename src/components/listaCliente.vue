<script setup>
import Header from '@/components/Header.vue'
import { useRouter } from 'vue-router'
import { clientes, setClienteAEditar, eliminarCliente } from '@/cliente.js' 

const router = useRouter();

const iniciarEdicion = (cliente) => {
    setClienteAEditar(cliente);
    
    router.push('/registro'); 
};

const manejarEliminacion = (id, nombre) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar permanentemente al cliente ${nombre} (ID: ${id})? Esta acción es irreversible.`)) {
        
        const exito = eliminarCliente(id); 

        if (exito) {
            alert(`✅ Cliente ${nombre} eliminado correctamente.`);
        } else {
            alert('❌ Error: El cliente no pudo ser encontrado en la base de datos.');
        }
    }
};
</script>

<template>
    <Header />
    <div class="container mt-5">
        <h1 class="text-center mb-4">Administración de Clientes</h1>
        <div class="d-flex justify-content-between mb-4">
            <h5 class="text-muted">Total de Clientes: {{ clientes.length }}</h5>
        </div>

        <div v-if="clientes.length === 0" class="alert alert-info text-center">
            Aún no hay clientes registrados.
        </div>

        <div v-else class="table-responsive">
            <table class="table table-striped table-hover align-middle">
                <thead class="table-dark">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Teléfono</th>
                        <th scope="col">Email</th>
                        <th scope="col">Tipo</th>
                        <th scope="col">F. Registro</th>
                        <th scope="col" class="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="cliente in clientes" :key="cliente.id">
                        <td>{{ cliente.id }}</td>
                        <td>{{ cliente.nombre }}</td>
                        <td>{{ cliente.telefono }}</td>
                        <td>{{ cliente.email }}</td>
                        <td>{{ cliente.tipo }}</td>
                        <td>{{ cliente.fecha_registro }}</td>
                        <td class="text-center">
                            <button @click="iniciarEdicion(cliente)" class="btn btn-sm btn-outline-primary me-2">
                                <i class="bi bi-pencil-square"></i> Editar
                            </button>
                            <button @click="manejarEliminacion(cliente.id, cliente.nombre)" class="btn btn-sm btn-outline-danger">
                                <i class="bi bi-trash-fill"></i> Eliminar
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>