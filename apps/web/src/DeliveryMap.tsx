
import { useEffect, useState } from 'react'
import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './DeliveryMap.css'

type DeliveryMapProps = {
  rua: string
  numero: string
  bairro: string
  cidade: string
  estado: string
  cep: string
}

type ResultadoGeocodificacao = {
  lat: string
  lon: string
}

type Coordenadas = [number, number]

type ResultadoRota = {
  code: string
  routes: {
    geometry: {
      coordinates: [number, number][]
    }
  }[]
}

const iconeMotoboy = L.divIcon({
  className: 'delivery-marker-wrapper',
  html: `
    <div class="delivery-person-marker">
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="12" cy="34" r="7" fill="none" stroke="currentColor" stroke-width="3" />
        <circle cx="37" cy="34" r="7" fill="none" stroke="currentColor" stroke-width="3" />
        <path
          d="M12 34 L19 22 L29 34 L37 34 L31 20 L23 20 L19 26 L15 26"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <circle cx="25" cy="10" r="4" fill="currentColor" />
        <path
          d="M24 15 L20 22 L29 22 L32 17"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M34 17 L39 17"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
        />
      </svg>
    </div>
  `,
  iconSize: [48, 48],
  iconAnchor: [24, 24],
})

function MapaComRota({
  rota,
  destino,
}: {
  rota: Coordenadas[]
  destino: Coordenadas
}) {
  const mapa = useMap()
  const [progresso, setProgresso] = useState(0)

  useEffect(() => {
    if (rota.length > 1) {
      mapa.fitBounds(L.latLngBounds(rota), {
        padding: [45, 45],
        maxZoom: 17,
        animate: true,
      })
    }
  }, [mapa, rota])

  useEffect(() => {
    setProgresso(0)

    if (rota.length < 2) return

    const intervalo = window.setInterval(() => {
      setProgresso((atual) => {
        if (atual >= 1) {
          window.clearInterval(intervalo)
          return 1
        }

        return Math.min(atual + 0.004, 1)
      })
    }, 250)

    return () => window.clearInterval(intervalo)
  }, [rota])

  let posicaoMotoboy = destino
  let segmentoAtual = 0

  if (rota.length > 1) {
    const indice = progresso * (rota.length - 1)

    segmentoAtual = Math.min(
      Math.floor(indice),
      rota.length - 2,
    )

    const fracao = indice - segmentoAtual

    const inicio = rota[segmentoAtual]
    const fim = rota[segmentoAtual + 1]

    posicaoMotoboy = [
      inicio[0] + (fim[0] - inicio[0]) * fracao,
      inicio[1] + (fim[1] - inicio[1]) * fracao,
    ]
  }

  // Mantém somente o trecho que o motoboy ainda precisa percorrer.
  const rotaRestante: Coordenadas[] =
    rota.length > 1
      ? [posicaoMotoboy, ...rota.slice(segmentoAtual + 1)]
      : []

  return (
    <>
      {/* Base escura da rota */}
      {rota.length > 1 && (
        <Polyline
          positions={rota}
          pathOptions={{
            color: '#101014',
            weight: 9,
            opacity: 0.75,
          }}
        />
      )}

      {/* Linha verde que desaparece conforme o motoboy avança */}
      {rotaRestante.length > 1 && progresso < 1 && (
        <Polyline
          positions={rotaRestante}
          pathOptions={{
            color: '#B7FF35',
            weight: 5,
            opacity: 0.95,
          }}
        />
      )}

      <CircleMarker
        center={destino}
        radius={7}
        pathOptions={{
          color: '#ffffff',
          weight: 3,
          fillColor: '#8B5CFF',
          fillOpacity: 1,
        }}
      >
        <Popup>
          <strong>Destino da entrega</strong>
        </Popup>
      </CircleMarker>

      {rota.length > 1 && (
        <Marker
          position={posicaoMotoboy}
          icon={iconeMotoboy}
          zIndexOffset={1000}
        >
          <Popup>
            <strong>Motoboy a caminho!</strong>
            <br />
            Entrega simulada em andamento.
          </Popup>
        </Marker>
      )}
    </>
  )
}

function DeliveryMap({
  rua,
  numero,
  bairro,
  cidade,
  estado,
  cep,
}: DeliveryMapProps) {
  const [coordenadas, setCoordenadas] =
    useState<Coordenadas | null>(null)

  const [rota, setRota] = useState<Coordenadas[]>([])
  const [carregando, setCarregando] = useState(true)
  const [carregandoRota, setCarregandoRota] = useState(false)
  const [erro, setErro] = useState('')
  const [erroRota, setErroRota] = useState('')

  useEffect(() => {
    const controlador = new AbortController()

    async function localizarEndereco() {
      setCarregando(true)
      setErro('')
      setCoordenadas(null)
      setRota([])
      setErroRota('')

      if (!rua || !cidade || !estado) {
        setErro('Preencha o endereço para localizar o mapa.')
        setCarregando(false)
        return
      }

      try {
        const consulta = [
          rua,
          numero,
          bairro,
          cidade,
          estado,
          cep,
          'Brasil',
        ]
          .filter(Boolean)
          .join(', ')

        const url =
          'https://nominatim.openstreetmap.org/search?' +
          new URLSearchParams({
            format: 'jsonv2',
            limit: '1',
            countrycodes: 'br',
            q: consulta,
          }).toString()

        const resposta = await fetch(url, {
          signal: controlador.signal,
          headers: {
            'Accept-Language': 'pt-BR',
          },
        })

        if (!resposta.ok) {
          throw new Error('Não foi possível consultar o mapa.')
        }

        const resultados: ResultadoGeocodificacao[] =
          await resposta.json()

        if (resultados.length === 0) {
          throw new Error(
            'Não encontramos esse endereço no mapa. Confira os dados informados.',
          )
        }

        const latitude = Number(resultados[0].lat)
        const longitude = Number(resultados[0].lon)

        if (
          !Number.isFinite(latitude) ||
          !Number.isFinite(longitude)
        ) {
          throw new Error('O mapa retornou uma localização inválida.')
        }

        setCoordenadas([latitude, longitude])
      } catch (erroConsulta) {
        if (
          erroConsulta instanceof Error &&
          erroConsulta.name === 'AbortError'
        ) {
          return
        }

        setErro(
          erroConsulta instanceof Error
            ? erroConsulta.message
            : 'Erro ao localizar o endereço.',
        )
      } finally {
        if (!controlador.signal.aborted) {
          setCarregando(false)
        }
      }
    }

    void localizarEndereco()

    return () => controlador.abort()
  }, [rua, numero, bairro, cidade, estado, cep])

  useEffect(() => {
    if (!coordenadas) return

    const destino: Coordenadas = coordenadas
    const controlador = new AbortController()

    async function buscarRota() {
      setCarregandoRota(true)
      setErroRota('')
      setRota([])

      try {
        const inicio: Coordenadas = [
          destino[0] + 0.006,
          destino[1] - 0.006,
        ]

        const url =
          `https://router.project-osrm.org/route/v1/driving/` +
          `${inicio[1]},${inicio[0]};${destino[1]},${destino[0]}` +
          '?overview=full&geometries=geojson&steps=false'

        const resposta = await fetch(url, {
          signal: controlador.signal,
        })

        if (!resposta.ok) {
          throw new Error('Não foi possível calcular a rota.')
        }

        const resultado: ResultadoRota = await resposta.json()

        if (
          resultado.code !== 'Ok' ||
          !resultado.routes?.[0]?.geometry?.coordinates?.length
        ) {
          throw new Error('Não foi encontrada uma rua para essa rota.')
        }

        const pontos = resultado.routes[0].geometry.coordinates.map(
          ([longitude, latitude]) =>
            [latitude, longitude] as Coordenadas,
        )

        setRota(pontos)
      } catch (erroConsulta) {
        if (
          erroConsulta instanceof Error &&
          erroConsulta.name === 'AbortError'
        ) {
          return
        }

        setErroRota(
          erroConsulta instanceof Error
            ? erroConsulta.message
            : 'Não foi possível carregar a rota.',
        )
      } finally {
        if (!controlador.signal.aborted) {
          setCarregandoRota(false)
        }
      }
    }

    void buscarRota()

    return () => controlador.abort()
  }, [coordenadas])

  return (
    <div className="real-map-container">
      {carregando && (
        <div className="real-map-message">
          <span className="map-loading-icon">⌖</span>
          <strong>LOCALIZANDO SEU ENDEREÇO</strong>
          <p>Consultando ruas e avenidas no mapa...</p>
        </div>
      )}

      {!carregando && erro && (
        <div className="real-map-message map-error">
          <span className="map-loading-icon">!</span>
          <strong>ENDEREÇO NÃO LOCALIZADO</strong>
          <p>{erro}</p>
          <small>
            A localização depende dos dados disponíveis no OpenStreetMap.
          </small>
        </div>
      )}

      {coordenadas && (
        <MapContainer
          center={coordenadas}
          zoom={17}
          scrollWheelZoom
          className="real-leaflet-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapaComRota
            rota={rota}
            destino={coordenadas}
          />
        </MapContainer>
      )}

      {coordenadas && carregandoRota && (
        <div className="route-status">
          CALCULANDO ROTA DO MOTOBOY...
        </div>
      )}

      {coordenadas && !carregandoRota && rota.length > 1 && (
        <div className="route-status">
          <span className="route-status-dot" />
          MOTOBOY EM MOVIMENTO
        </div>
      )}

      {coordenadas && !carregandoRota && erroRota && (
        <div className="route-status route-status-error">
          ROTA SIMULADA INDISPONÍVEL
        </div>
      )}

      <div className="real-map-credit">
        MAPA REAL · OPENSTREETMAP
      </div>
    </div>
  )
}

export default DeliveryMap
