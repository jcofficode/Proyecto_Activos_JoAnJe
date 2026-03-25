// ============================================================
// KpiCard_jja.jsx — Tarjeta de indicador clave (KPI)
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { useState, useEffect, useRef } from 'react'

const KpiCard_jja = ({ icono, valor = 0, etiqueta, color = 'var(--kpi-1-jja)', bgColor = 'var(--kpi-1-bg-jja)', tendencia, tendenciaTexto }) => {
  const [valorAnimado_jja, setValorAnimado_jja] = useState(0)
  const ref_jja = useRef(null)
  const animado_jja = useRef(false)

  useEffect(() => {
    const valorNum = typeof valor === 'number' ? valor : parseInt(valor) || 0
    if (valorNum === 0) { 
        setValorAnimado_jja(0)
        return 
    }

    const duracion = 800
    const incremento = valorNum / (duracion / 16)
    let actual = 0

    const timer = setInterval(() => {
      actual += incremento
      if (actual >= valorNum) {
        setValorAnimado_jja(valorNum)
        clearInterval(timer)
      } else {
        setValorAnimado_jja(Math.floor(actual))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [valor])

  return (
    <div className="kpi-card-jja animar-conteo-jja" ref={ref_jja}>
      <div className="kpi-icono-jja" style={{ background: bgColor, color }}>
        {icono}
      </div>
      <div className="kpi-info-jja">
        <div className="kpi-valor-jja">{valorAnimado_jja}</div>
        <div className="kpi-etiqueta-jja">{etiqueta}</div>
        {tendenciaTexto && (
          <div className={`kpi-tendencia-jja ${tendencia === 'arriba' ? 'positiva-jja' : 'negativa-jja'}`}>
            {tendencia === 'arriba' ? '↑' : '↓'} {tendenciaTexto}
          </div>
        )}
      </div>
    </div>
  )
}

export default KpiCard_jja
