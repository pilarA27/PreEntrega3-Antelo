// PRODUCTOS


class Producto {
    constructor(id, nombre, precio, categoria, imagen = false){
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria
        this.imagen = imagen
    }
}

class BaseDeDatos{

    constructor(){

        this.productos = [];

        //Sonido

        this.agregarProducto (1, "Auricular verde", 17, "Sonido", "auris1.png" )
        this.agregarProducto (2, "Auricular Logitech negro", 20, "Sonido", "auris2.png" )
        this.agregarProducto (3, "Auricular Logitech blanco", 20, "Sonido", "auris3.png" )
        this.agregarProducto (4, "Auricular Fantech rosado", 50, "Sonido", "auris4.png" )

        //Teclados

        this.agregarProducto (5, "Teclado", 30, "Teclado rosado pokemon", "teclado1.png" )
        this.agregarProducto (6, "Auriculares", 32, "Teclado violeta evangelion", "teclado2.png" )
        this.agregarProducto (7, "Auriculares", 25, "Teclado gris", "teclado3.png" )
        this.agregarProducto (8, "Auriculares", 30, "Teclado amarillo pokemon", "teclado4.jpg")

        //Mouse

        this.agregarProducto (9, "Mouse Logitech negro y dorado", 21, "Mouse", "mouse1.png" )
        this.agregarProducto (10, "Mouse Logitech violeta", 27, "Mouse", "mouse2.png" )
        this.agregarProducto (11, "Mouse Logitech rosado y blanco", 21, "Mouse", "mouse3.png" )
        this.agregarProducto (12, "Mouse Fantech negro", 25, "Mouse", "mouse4.png" )

    }

    agregarProducto (id, nombre, precio, categoria, imagen){
        const producto = new Producto(id, nombre, precio, categoria, imagen);
        this.productos.push(producto);
    }

    traerProductos(){
        return this.productos;
    }

}

const BdD = new BaseDeDatos

// FUNCIONES

function mostrarProductos(){
    const productos = BdD.traerProductos();
    divProductos.innerHTML =""
    for (const producto of productos) {
        divProductos.innerHTML += `
        <div class="card">
            <img class="cardImg" src="img/${producto.imagen}"/>
            <div class="cardBody">
            <h2 class="cardName">${producto.nombre}</h2>
            <p class="cardText">USD$${producto.precio}</p>
            <a href="#" class="cardBtn" data-id="${producto.id}">Agregar al carrito</a>
            </div>
        </div>
    `;
    }
}

// HTML

const divProductos = document.querySelector("#productos")
mostrarProductos(BdD.traerProductos);

//CARRITO

divProductos.addEventListener('click', agregarAlCarrito);

const carrito = obtenerCarritoDelLocalStorage();
actualizarCarrito();
function obtenerCarritoDelLocalStorage() {
  const carritoJSON = localStorage.getItem("carrito");
  return carritoJSON ? JSON.parse(carritoJSON) : [];
}
  
function guardarCarritoEnLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarAlCarrito(event) {
  if (event.target.classList.contains('cardBtn')) {
    const productoId = event.target.getAttribute('data-id');
    const producto = BdD.traerProductos().find((producto) => producto.id === parseInt(productoId));

    if (producto) {
      const productoEnCarrito = carrito.find((item) => item.id === producto.id);
      if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
      } else {
        carrito.push({ ...producto, cantidad: 1 });
      }

      localStorage.setItem("carrito", JSON.stringify(carrito));
      actualizarCarrito();
      actualizarCantidadProductos();
      actualizarTotalPrecio();
      guardarCarritoEnLocalStorage();
    }
  }
}

function actualizarCantidadProductos() {
  const totalProductosElemento = document.querySelector("#totalProductos");
  const cantidadProductos = carrito.reduce((total, producto) => total + producto.cantidad, 0);
  totalProductosElemento.textContent = cantidadProductos.toString();
}

function actualizarTotalPrecio() {
  const totalPrecioElemento = document.querySelector("#totalPrecio");
  const precioTotal = carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
  totalPrecioElemento.textContent = precioTotal.toString();
}

function actualizarCarrito() {
  const carritoElemento = document.querySelector("#carrito");
  carritoElemento.innerHTML = "";

  for (const producto of carrito) {
    const li = document.createElement("li");
    li.textContent = producto.nombre;

    const cantidadSpan = document.createElement("span");
    cantidadSpan.textContent = `(${producto.cantidad})`;

    const eliminarBtn = document.createElement("button");
    eliminarBtn.textContent = "Eliminar";
    eliminarBtn.classList.add("btnEliminar");
    eliminarBtn.addEventListener("click", () => eliminarProducto(producto.id));

    li.appendChild(cantidadSpan);
    li.appendChild(eliminarBtn);

    carritoElemento.appendChild(li);
  }
}
divProductos.addEventListener("click", agregarAlCarrito);

function listar() {
  const carritoElemento = document.querySelector("#carrito");
  carritoElemento.innerHTML = "";

  for (const producto of carrito) {
    const li = document.createElement("li");
    li.textContent = producto.nombre;
    if (producto.cantidad > 1) {
      li.textContent += ` (${producto.cantidad})`;
    }
    carritoElemento.appendChild(li);
  }
}

function eliminarProducto(id) {
  const indice = carrito.findIndex((producto) => producto.id === id);
  if (indice !== -1) {
    carrito.splice(indice, 1);
    actualizarCarrito();
    actualizarCantidadProductos();
    actualizarTotalPrecio();
    guardarCarritoEnLocalStorage();
  }
}