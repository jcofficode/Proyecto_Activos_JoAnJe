import React, { useState, useRef } from 'react'
import video_jc from '../../assets/videoactivosoff.mp4'
const VideoDemo = () => {
  const [reproduciendo, setReproduciendo] = useState(false)
  const [progreso, setProgreso] = useState(0)
  const [tiempoActual, setTiempoActual] = useState('00:00')
  const [duracion, setDuracion] = useState('00:00')
  const [volumen, setVolumen] = useState(1)
  const [silenciado, setSilenciado] = useState(false)
  const videoRef = useRef(null)

  const formatearTiempo_jc = (segundos) => {
    const min = Math.floor(segundos / 60)
    const seg = Math.floor(segundos % 60)
    return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`
  }

  const toggleVideo_jc = (e) => {
    if (e.target.closest('.video-controles')) return

    if (!videoRef.current) return
    if (reproduciendo) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
  }

  const manejarProgreso_jc = () => {
    const video = videoRef.current
    if (!video) return
    const porcentaje = (video.currentTime / video.duration) * 100
    setProgreso(porcentaje || 0)
    setTiempoActual(formatearTiempo_jc(video.currentTime))
  }

  const manejarMetadata_jc = () => {
    if (videoRef.current) {
      setDuracion(formatearTiempo_jc(videoRef.current.duration))
    }
  }

  const cambiarTiempo_jc = (e) => {
    const video = videoRef.current
    if (!video) return
    const nuevoTiempo = (e.target.value / 100) * video.duration
    video.currentTime = nuevoTiempo
    setProgreso(e.target.value)
  }

  const manejarVolumen_jc = (e) => {
    const nuevoVolumen = parseFloat(e.target.value)
    setVolumen(nuevoVolumen)
    if (videoRef.current) {
      videoRef.current.volume = nuevoVolumen
      videoRef.current.muted = nuevoVolumen === 0
      setSilenciado(nuevoVolumen === 0)
    }
  }

  const toggleSilencio_jc = () => {
    if (!videoRef.current) return
    const nuevoEstado = !silenciado
    setSilenciado(nuevoEstado)
    videoRef.current.muted = nuevoEstado
    if (!nuevoEstado && volumen === 0) {
      setVolumen(0.5)
      videoRef.current.volume = 0.5
    }
  }

  return (
    <section className="seccion video-demo">
      <div className="contenedor">
        <div className="video-demo-encabezado">
          <span className="badge-video">▶ Sistema en vivo</span>
          <h2 className="seccion-titulo">Nuestro Sistema en Acción</h2>
          <p className="video-subtitulo">
            Observa cómo funciona nuestro sistema de préstamos de activos.
          </p>
        </div>

        <div className="video-wrapper" onPointerDown={toggleVideo_jc}>
          <video
            ref={videoRef}
            src={video_jc}
            className="video-player"
            onTimeUpdate={manejarProgreso_jc}
            onLoadedMetadata={manejarMetadata_jc}
            onEnded={() => setReproduciendo(false)}
            onPlay={() => setReproduciendo(true)}
            onPause={() => setReproduciendo(false)}
            playsInline
          />

          {!reproduciendo && (
            <div className="video-overlay">
              <div className="video-play-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="video-overlay-texto">Haz clic para reproducir</p>
            </div>
          )}

          <div className="video-controles">
            <button className="ctrl-btn" onClick={() => (reproduciendo ? videoRef.current.pause() : videoRef.current.play())}>
              {reproduciendo ? (
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <div className="progreso-contenedor">
              <input
                type="range"
                className="video-slider"
                min="0"
                max="100"
                step="0.1"
                value={progreso}
                onChange={cambiarTiempo_jc}
              />
              <div className="video-progreso-llenado" style={{ width: `${progreso}%` }}></div>
            </div>

            <div className="video-tiempo">
              <span>{tiempoActual}</span>
              <span className="separador">/</span>
              <span>{duracion}</span>
            </div>

            <div className="volumen-contenedor">
              <button className="ctrl-btn" onClick={toggleSilencio_jc}>
                {silenciado || volumen === 0 ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77zM3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" opacity=".3" />
                    <path d="M4.27 3L3 4.27l9 9v.01l8.73 8.72L22 20.73l-9-9L4.27 3zM12 4L9.91 6.09L12 8.18V4zM7 9l-1.09 1.09L7 11.18V9zm5 11l-3.32-3.32L12 11.36V20z" />
                  </svg>
                ) : volumen < 0.5 ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M7 9v6h4l5 5V4L11 9H7zm11.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>
              <div className="volumen-slider-wrapper">
                <input
                  type="range"
                  className="volumen-slider"
                  min="0"
                  max="1"
                  step="0.01"
                  value={silenciado ? 0 : volumen}
                  onChange={manejarVolumen_jc}
                />
                <div className="volumen-llenado" style={{ width: `${(silenciado ? 0 : volumen) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="video-features">
          {[
            { icono: '⚡', texto: 'Alta velocidad de procesamiento' },
            { icono: '🔒', texto: 'Acceso seguro con QR/NFC' },
            { icono: '📊', texto: 'Reportes en tiempo real' },
            
          ].map((f, i) => (
            <div key={i} className="video-feature-item">
              <span className="video-feature-icono">{f.icono}</span>
              <span>{f.texto}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default VideoDemo
