console.log('Testing sessionStorage...');

// Simular login
sessionStorage.setItem('token_jja', 'test_token_123');
console.log('Token guardado:', sessionStorage.getItem('token_jja'));

// Simular navegación
setTimeout(() => {
  console.log('Después de timeout - Token:', sessionStorage.getItem('token_jja'));
  
  // Simular verificación
  const token = sessionStorage.getItem('token_jja');
  console.log('Token en verificación:', token ? 'PRESENTE' : 'AUSENTE');
}, 100);
