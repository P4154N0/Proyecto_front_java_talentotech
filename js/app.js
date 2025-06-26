// URL base de la API
const API_URL = "http://localhost:8080/api/articulos";

// Cuando se carga la página, mostramos el listado
document.addEventListener("DOMContentLoaded", listarArticulos);

// Manejador del formulario
document.getElementById("form-articulo").addEventListener("submit", guardarArticulo);

// Botón para cancelar edición
document.getElementById("cancelar").addEventListener("click", () => {
    document.getElementById("form-articulo").reset();
    document.getElementById("idArticulo").value = "";
});

// === Listar todos los artículos ===
function listarArticulos() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById("tabla-articulos");
            tbody.innerHTML = ""; // Limpiar tabla
            data.forEach(articulo => {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${articulo.id}</td>
                    <td>${articulo.nombre}</td>
                    <td>${articulo.precio.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarArticulo(${articulo.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarArticulo(${articulo.id})">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(fila);
            });
        })
        .catch(error => console.error("Error al listar artículos:", error));
}

// === Guardar o actualizar un artículo ===
function guardarArticulo(event) {
    event.preventDefault();

    const id = document.getElementById("idArticulo").value;
    const nombre = document.getElementById("nombre").value.trim();
    const precio = parseFloat(document.getElementById("precio").value);

    // Validación
    if (!nombre || isNaN(precio) || precio < 0) {
        alert("Por favor complete correctamente los campos.");
        return;
    }

    const articulo = { nombre, precio };
    const url = id ? `${API_URL}/${id}` : API_URL;
    const metodo = id ? "PUT" : "POST";

    fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articulo)
    })
    .then(response => {
        if (!response.ok) throw new Error("Error al guardar");
        return response.json();
    })
    .then(() => {
        document.getElementById("form-articulo").reset();
        document.getElementById("idArticulo").value = "";
        listarArticulos();
    })
    .catch(error => console.error("Error al guardar artículo:", error));
}

// === Cargar artículo en el formulario para edición ===
function editarArticulo(id) {
    fetch(`${API_URL}/${id}`)
        .then(response => response.json())
        .then(articulo => {
            document.getElementById("idArticulo").value = articulo.id;
            document.getElementById("nombre").value = articulo.nombre;
            document.getElementById("precio").value = articulo.precio;
        })
        .catch(error => console.error("Error al obtener artículo:", error));
}

// === Eliminar un artículo ===
function eliminarArticulo(id) {
    if (confirm("¿Deseás eliminar este artículo?")) {
        fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        })
        .then(response => {
            if (!response.ok) throw new Error("Error al eliminar");
            listarArticulos();
        })
        .catch(error => console.error("Error al eliminar artículo:", error));
    }
}
