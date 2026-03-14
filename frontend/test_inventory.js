// Simular lo que hace el componente Inventory
const API_URL = 'http://localhost:8000/api/v1';

// Simular login
fetch(API_URL + '/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    correo: 'admin@activoscontroljoanje.com',
    contrasena: 'JoAnJe2026!'
  })
})
.then(res => res.json())
.then(data => {
  console.log('Login exitoso:', data.exito);
  const token = data.datos.token;
  console.log('Token obtenido');
  
  // Simular petición a /activos
  return fetch(API_URL + '/activos', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
})
.then(res => {
  console.log('Status de /activos:', res.status);
  return res.json();
})
.then(data => {
  console.log('Respuesta de /activos:', JSON.stringify(data, null, 2));
})
.catch(err => {
  console.log('Error:', err.message);
});
