import React, { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

export default function Map() {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    let mounted = true
    async function init() {
      const L = await import('leaflet')
      // ensure icons load correctly with bundlers (Vite)
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: markerIcon2x,
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
      })

      if (!mounted || !mapRef.current) return
      const lat = 10.48853231012531
      const lng = -66.81584234351293
      mapInstanceRef.current = L.map(mapRef.current).setView([lat, lng], 15)
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
      }).addTo(mapInstanceRef.current)
      L.marker([lat, lng]).addTo(mapInstanceRef.current).bindPopup('JoAnJe Coders 💻').openPopup()
    }
    init()
    return () => {
      mounted = false
      if (mapInstanceRef.current) mapInstanceRef.current.remove()
    }
  }, [])

  return <div ref={mapRef} style={{ height: 300, width: '100%' }} />
}
