export function qrImageUrl(data, size = 240) {
  const encoded = encodeURIComponent(data)
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}`
}

export function qrDataForProduct(product) {
  // minimal payload for demo; backend will define canonical format
  return JSON.stringify({ id: product.id, sku: product.sku, name: product.nombre })
}
