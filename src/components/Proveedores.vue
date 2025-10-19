<script setup>
    import Header from '@/components/Header.vue';
    import { ref, reactive, nextTick, onMounted } from 'vue';

    const proveedores = ref([
        { nombre: 'Suministros Tech S.A.', identificacion: 'V31132365', especialidad: 'Franelas de Algodon', marca: 'Adidas' },
        { nombre: 'Moda Express C.A.', identificacion: 'G3343221', especialidad: 'Pantalones', marca: 'Nike' },
        { nombre: 'Materiales Globales', identificacion: 'J23231243', especialidad: 'Chaqueta', marca: 'Under Armour' },
        { nombre: 'Distribuidora Fénix', identificacion: 'T98765432', especialidad: 'Zapatos', marca: 'Nike' },
    ]);

    const nuevoProveedor = reactive({
        nombre: '',
        identificacion: '',
        especialidad: '',
        marca: '',
    });

    let proveedorModal = null;

    onMounted(() => {
        nextTick(() => {
            if (typeof bootstrap !== 'undefined' && document.getElementById('agregarProveedorModal')) {
                proveedorModal = new bootstrap.Modal(document.getElementById('agregarProveedorModal'));
            }
        });
    });

    const agregarNuevoProveedor = () => {
        if (!nuevoProveedor.nombre || !nuevoProveedor.identificacion || !nuevoProveedor.especialidad || !nuevoProveedor.marca) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        const nuevo = { ...nuevoProveedor };
        
        proveedores.value.unshift(nuevo);

        nuevoProveedor.nombre = '';
        nuevoProveedor.identificacion = '';
        nuevoProveedor.especialidad = '';
        nuevoProveedor.marca = '';
        
        if (proveedorModal) {
            proveedorModal.hide();
        }
    };
</script>

<template>
    <Header />
    <div class="container mt-5">
        <div class="container py-4">
            <div class="row">
                <div class="col-12 col-md-2"></div>
                <div class="col-12 col-md-6">
                    <input type="text" class="form-control" placeholder="Buscar Proveedor">
                </div>
                <div class="col-12 col-md-2"></div>
                <div class="col-12 col-md-2">
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#agregarProveedorModal">Agregar Proveedor</button>
                </div>
            </div>
        </div>
    </div>
    <div class="w-75 mx-auto">
        <div class="row row-cols-4 border border-2">
            <div class="col mt-3 mb-3" v-for="proveedor in proveedores":key="proveedor.identificacion">
                <div class="card border-dark" style="max-width: 18rem;">
                    <div class="card-header h6 text-center p-3">{{ proveedor.nombre }}</div>
                    <div class="card-body text-center row">
                        <label class="h6 mt-1">Identificacion: {{ proveedor.identificacion }}</label>
                        <label class="h6 mt-1">Especialidad: {{ proveedor.especialidad }}</label>
                        <label class="h6 mt-1">Marca: {{ proveedor.marca }}</label>
                        <div class="btn-group mt-1">
                            <button class="btn btn-outline-success">Editar</button>
                            <button class="btn btn-outline-danger">Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-if="proveedores.length === 0" class="col-12 text-center p-5 text-muted">
        No hay proveedores registrados.
    </div>

    <!-- Modal -->
    <div class="modal fade modal-xl" id="agregarProveedorModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Agregar Proveedor</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="agregarNuevoProveedor">
                        <div class="row mb-2">
                            <div class="col-12 col-md-3">
                                <label for="nombre" class="form-label h6">Nombre del Proveedor:</label>
                                <input id="nombre" class="form-control" v-model="nuevoProveedor.nombre" required>
                            </div>
                            <div class="col-12 col-md-3">
                                <label for="identificacion" class="form-label h6">Identificación:</label>
                                <input id="identificacion" class="form-control" v-model="nuevoProveedor.identificacion" required>
                            </div>
                            <!-- Especialidad del Proveedor (Select con v-model) -->
                            <div class="col-12 col-md-3">
                                <label for="especialidad" class="form-label h6">Especialidad del Proveedor:</label>
                                <select id="especialidad" class="form-select" v-model="nuevoProveedor.especialidad">
                                    <option value="" disabled>Seleccione una opción</option>
                                    <option value="Pantalones">Pantalones</option>
                                    <option value="Franelas">Franelas</option>
                                    <option value="Chaquetas">Chaquetas</option>
                                    <option value="Sueteres">Suéteres</option>
                                </select>
                            </div>
                            <div class="col-12 col-md-3">
                                <label for="marca" class="form-label h6">Marca del Proveedor:</label>
                                <select id="marca" class="form-select" v-model="nuevoProveedor.marca" required>
                                    <option value="" disabled>Seleccione una opción</option>
                                    <option value="Nike">Nike</option>
                                    <option value="Adidas">Adidas</option>
                                    <option value="Under Armour">Under Armour</option>
                                    <option value="Puma">Puma</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" @click="agregarNuevoProveedor">Agregar</button>
                </div>
            </div>
        </div>
    </div>
</template>