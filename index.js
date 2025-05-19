const url = 'https://fakestoreapi.com/products';

const args = process.argv.slice(2);

const getProducts = async (id) => {
  try {
    const res = await fetch(id ? `${url}/${id}` : url);
    if (!res.ok) throw new Error('Error al obtener los productos');

    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

const createProduct = async (title, price, category) => {
  try {
    const priceNumber = parseFloat(price);
    if (isNaN(priceNumber)) {
      console.log('Precio invalido');
      return;
    }

    const newProduct = {
      title,
      price: priceNumber,
      category,
    };

    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(newProduct),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) throw new Error('Error al crear el producto');

    const { id } = await res.json();
    console.log(`Producto creado con el ID: ${id}`);
  } catch (error) {
    console.log(error);
  }
};

const deleteProduct = async (id) => {
  try {
    const res = await fetch(`${url}/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error('No se pudo eliminar el producto');

    const data = await res.json();
    console.log('Producto eliminado:', data);
  } catch (error) {
    console.log(error);
  }
};

const updateProduct = async (id, title, price, category) => {
  try {
    const priceNumber = parseFloat(price);
    if (isNaN(priceNumber)) {
      console.log('Precio invalido');
      return;
    }

    const newProduct = {
      title,
      price: priceNumber,
      category,
    };

    const res = await fetch(`${url}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(newProduct),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) throw new Error('Error al actualizar el producto');

    const data = await res.json();
    console.log('Producto actualizado:', data);
  } catch (error) {
    console.log(error);
  }
};

const fetchProducts = async (method, path, title, price, category) => {
  const httpMethod = method.toLowerCase();
  const [resource, id] = path.split('/');

  if (resource !== 'products') {
    console.log('Recurso no soportado');
    return;
  }

  try {
    switch (httpMethod) {
      case 'get': {
        await getProducts(id);
        break;
      }

      case 'post': {
        if (!title || !price || !category) {
          console.log('Faltan datos para crear al producto');
          return;
        }

        await createProduct(title, price, category);
        break;
      }

      case 'put':
      case 'update': {
        if (!id || !title || !price || !category) {
          console.log('Faltan datos para actualizar al producto');
          return;
        }

        await updateProduct(id, title, price, category);
        break;
      }

      case 'delete': {
        if (!id) {
          console.log('Proporciona el ID para eliminar el producto');
          return;
        }

        await deleteProduct(id);
        break;
      }

      default:
        console.log('Metodo no soportado');
    }
  } catch (error) {
    console.log('Error:', error.message);
  }
};

fetchProducts(...args);
