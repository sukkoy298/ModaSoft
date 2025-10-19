import { ref } from 'vue';

export const clientes = ref([
    { id: 1, nombre: 'Ana García', telefono: '555-1001', email: 'ana@mail.com', direccion: 'Av. Libertador', tipo: 'Natural', fecha_registro: '2023-08-15' },
    { id: 2, nombre: 'Roberto Pérez', telefono: '555-1002', email: 'roberto@mail.com', direccion: 'Calle El Sol', tipo: 'Jurídico', fecha_registro: '2023-11-20' },
    { id: 3, nombre: 'Carla Soto', telefono: '555-1003', email: 'carla@mail.com', direccion: 'Sector Bella Vista', tipo: 'Jurídico', fecha_registro: '2024-01-10' },
]);
export const nextId = ref(4);

export const existeCliente = (email, telefono) => {
    return clientes.value.some(cliente => 
        cliente.email.toLowerCase() === email.toLowerCase() ||
        cliente.telefono === telefono
    );
};

export const editarCliente = (id, nombre, telefono, email, direccion, tipo) => {
    const index = clientes.value.findIndex(cliente => cliente.id === id);

    if (index !== -1) {
        clientes.value[index].nombre = nombre;
        clientes.value[index].telefono = telefono;
        clientes.value[index].email = email;
        clientes.value[index].direccion = direccion;
        clientes.value[index].tipo = tipo;
        
        return true;
    }
    return false;
};

export const agregarCliente = (nuevoCliente) => {
    nuevoCliente.id = nextId.value++;
    clientes.value.push(nuevoCliente);
};

export const clienteAEditar = ref(null);

export const setClienteAEditar = (cliente) => {
    clienteAEditar.value = { ...cliente };
};

export const eliminarCliente = (id) => {
    const index = clientes.value.findIndex(cliente => cliente.id === id);

    if (index !== -1) {
        clientes.value.splice(index, 1);
        return true;
    }
    return false;
};

export const limpiarClienteAEditar = () => {
    clienteAEditar.value = null;
};