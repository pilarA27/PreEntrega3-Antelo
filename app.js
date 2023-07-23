// PRODUCTOS

const divProductos = document.querySelector("#productos")

// FUNCIONES

function actualizarCantidadProductos() {
  const totalProductosElemento = document.querySelector("#totalProductos");
  const cantidadProductos = carrito.reduce((total, producto) => total + producto.cantidad, 0);
  totalProductosElemento.textContent = cantidadProductos.toString();
}

async function obtenerProductosDesdeAPI() {
  try {
    const response = await fetch('https://fakestoreapi.com/products/category/jewelery');
    if (!response.ok) {
      throw new Error('Error al obtener los productos.');
    }
    const productos = await response.json();
    return productos;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}


let productos = [];

async function mostrarProductos() {
  productos = await obtenerProductosDesdeAPI();
  divProductos.innerHTML = "";
  for (const producto of productos) {
    divProductos.innerHTML += `
      <div class="card">
        <img class="cardImg" src="${producto.image}" />
        <div class="cardBody">
          <h2 class="cardName">${producto.title}</h2>
          <p class="cardPrice">USD$${producto.price}</p>
          <a class="cardBtn" data-id="${producto.id}">Agregar al carrito</a>
        </div>
      </div>
    `;
  }

  actualizarCarrito();
  actualizarCantidadProductos();
  actualizarTotalPrecio();
}


// HTML

mostrarProductos(); 

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

function actualizarCarrito() {
  const carritoElemento = document.querySelector("#carrito");
  carritoElemento.innerHTML = "";

  for (const producto of carrito) {
    const li = document.createElement("li");
    li.textContent = `${producto.title} (${producto.cantidad})`;

    const eliminarBtn = document.createElement("button");
    eliminarBtn.textContent = "Eliminar";
    eliminarBtn.classList.add("btnEliminar");
    eliminarBtn.setAttribute("data-id", producto.id);
    eliminarBtn.addEventListener("click", () => eliminarProducto(producto.id));

    li.appendChild(eliminarBtn);
    carritoElemento.appendChild(li);
  }
}

function agregarAlCarrito(event) {
  event.preventDefault();
  if (event.target.classList.contains('cardBtn')) {
    const productoId = event.target.getAttribute('data-id');
    const productoEnCarrito = carrito.find((item) => item.id === parseInt(productoId));

    if (productoEnCarrito) {
      productoEnCarrito.cantidad++;
    } else {
      const producto = productos.find((producto) => producto.id === parseInt(productoId));
      if (producto) {
        carrito.push({ ...producto, cantidad: 1 });
      }
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
    actualizarTotalPrecio();
    guardarCarritoEnLocalStorage();
  }
}

function actualizarTotalPrecio() {
  const totalPrecioElemento = document.querySelector("#totalPrecio");
  const precioTotal = carrito.reduce((total, producto) => {
    return total + parseFloat(producto.price) * producto.cantidad;
  }, 0);
  totalPrecioElemento.textContent = precioTotal.toFixed(2);
}

function eliminarProducto(id) {
  const indice = carrito.findIndex((producto) => producto.id === id);
  if (indice !== -1) {
    const productoEnCarrito = carrito[indice];
    if (productoEnCarrito.cantidad > 1) {
      productoEnCarrito.cantidad--;
    } else {
      carrito.splice(indice, 1);
    }
    actualizarCarrito();
    actualizarCantidadProductos();
    actualizarTotalPrecio();
    guardarCarritoEnLocalStorage();
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
    const productoEnCarrito = carrito[indice];
    if (productoEnCarrito.cantidad > 1) {
      productoEnCarrito.cantidad--;
    } else {
      carrito.splice(indice, 1);
    }

    actualizarCarrito();
    actualizarCantidadProductos();
    actualizarTotalPrecio();
    guardarCarritoEnLocalStorage();
  }
}
