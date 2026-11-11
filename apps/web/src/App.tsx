import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import DeliveryMap from './DeliveryMap'
import './App.css'

type Produto = {
  id: number
  nome: string
  descricao: string
  categoria: string
  preco: number
  imagem: string
}

type Restaurante = {
  id: number
  nome: string
  categoria: string
  avaliacao: string
  tempo: string
  entrega: string
  imagem: string
  destaque?: boolean
  descricao: string
  cardapio: Produto[]
}

type ItemCarrinho = {
  restauranteId: number
  produto: Produto
  quantidade: number
}

type FormaPagamento = 'PIX' | 'Cartão' | 'Dinheiro'

type DadosCEP = {
  logradouro?: string
  bairro?: string
  localidade?: string
  uf?: string
  erro?: boolean
}

const restaurantes: Restaurante[] = [
  {
    id: 1,
    nome: 'Burger House',
    categoria: 'Hambúrguer',
    avaliacao: '4.9',
    tempo: '25–35 min',
    entrega: 'Grátis',
    imagem: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900',
    destaque: true,
    descricao: 'Hambúrgueres artesanais preparados na hora, com ingredientes selecionados.',
    cardapio: [
      { id: 101, nome: 'Classic Burger', descricao: 'Pão brioche, burger 160g, queijo cheddar, alface e molho da casa.', categoria: 'Hambúrgueres', preco: 29.90, imagem: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700' },
      { id: 102, nome: 'Bacon Supreme', descricao: 'Burger 180g, cheddar cremoso, bacon crocante e cebola caramelizada.', categoria: 'Hambúrgueres', preco: 36.90, imagem: 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=700' },
      { id: 103, nome: 'Batata House', descricao: 'Batatas crocantes com páprica e molho especial.', categoria: 'Porções', preco: 18.90, imagem: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=700' },
      { id: 104, nome: 'Brownie com Sorvete', descricao: 'Brownie de chocolate servido com sorvete de creme.', categoria: 'Sobremesas', preco: 19.90, imagem: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=700' },
      { id: 105, nome: 'Refrigerante Lata', descricao: 'Lata 350 ml, sabores variados.', categoria: 'Bebidas', preco: 6.90, imagem: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=700' },
    ],
  },
  {
    id: 2,
    nome: 'Pizza District',
    categoria: 'Pizza',
    avaliacao: '4.8',
    tempo: '30–45 min',
    entrega: 'R$ 4,99',
    imagem: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900',
    descricao: 'Pizzas de fermentação especial, receitas clássicas e combinações exclusivas.',
    cardapio: [
      { id: 201, nome: 'Pizza Margherita', descricao: 'Molho artesanal, mozzarella, tomate e manjericão.', categoria: 'Pizzas', preco: 49.90, imagem: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=700' },
      { id: 202, nome: 'Pizza Pepperoni', descricao: 'Mozzarella, pepperoni e molho especial da casa.', categoria: 'Pizzas', preco: 56.90, imagem: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=700' },
      { id: 203, nome: 'Pão de Alho', descricao: 'Pão artesanal gratinado com alho e queijo.', categoria: 'Porções', preco: 16.90, imagem: 'https://images.unsplash.com/photo-1619531040576-f9416740661c?w=700' },
      { id: 204, nome: 'Pizza de Chocolate', descricao: 'Chocolate cremoso e granulado.', categoria: 'Sobremesas', preco: 39.90, imagem: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=700' },
      { id: 205, nome: 'Suco Natural', descricao: 'Suco de laranja 400 ml.', categoria: 'Bebidas', preco: 9.90, imagem: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=700' },
    ],
  },
  {
    id: 3,
    nome: 'Sushi Lab',
    categoria: 'Japonesa',
    avaliacao: '4.9',
    tempo: '35–50 min',
    entrega: 'R$ 5,99',
    imagem: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=900',
    descricao: 'Comida japonesa feita com cuidado, frescor e apresentação especial.',
    cardapio: [
      { id: 301, nome: 'Combo Sushi 20 peças', descricao: 'Seleção de niguiris, hossomakis e uramakis.', categoria: 'Combos', preco: 54.90, imagem: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=700' },
      { id: 302, nome: 'Temaki Salmão', descricao: 'Cone de alga com arroz, salmão e cream cheese.', categoria: 'Pratos', preco: 27.90, imagem: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=700' },
      { id: 303, nome: 'Guioza 6 unidades', descricao: 'Pastéis japoneses grelhados.', categoria: 'Porções', preco: 22.90, imagem: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=700' },
      { id: 304, nome: 'Mochi', descricao: 'Doce japonês macio com recheio especial.', categoria: 'Sobremesas', preco: 14.90, imagem: 'https://images.unsplash.com/photo-1582450871972-ab5ca641643d?w=700' },
      { id: 305, nome: 'Chá Gelado', descricao: 'Chá gelado 400 ml.', categoria: 'Bebidas', preco: 8.90, imagem: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=700' },
    ],
  },
  {
    id: 4,
    nome: 'Green Bowl',
    categoria: 'Saudável',
    avaliacao: '4.7',
    tempo: '20–30 min',
    entrega: 'Grátis',
    imagem: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900',
    descricao: 'Bowls, saladas e refeições equilibradas para sua rotina.',
    cardapio: [
      { id: 401, nome: 'Bowl Mediterrâneo', descricao: 'Quinoa, folhas, tomate, pepino, grão-de-bico e molho cítrico.', categoria: 'Refeições', preco: 32.90, imagem: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700' },
      { id: 402, nome: 'Frango Grelhado', descricao: 'Frango grelhado, arroz integral e legumes.', categoria: 'Refeições', preco: 34.90, imagem: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=700' },
      { id: 403, nome: 'Salada Tropical', descricao: 'Mix de folhas, manga, cenoura e castanhas.', categoria: 'Saladas', preco: 25.90, imagem: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700' },
      { id: 404, nome: 'Salada de Frutas', descricao: 'Frutas frescas da estação.', categoria: 'Sobremesas', preco: 13.90, imagem: 'https://images.unsplash.com/photo-1490474-823978c2c34?w=700' },
      { id: 405, nome: 'Suco Verde', descricao: 'Couve, limão, maçã e gengibre.', categoria: 'Bebidas', preco: 11.90, imagem: 'https://images.unsplash.com/photo-1610970881699-44a5587dacec?w=700' },
    ],
  },
  {
    id: 5,
    nome: 'Sweet Lab',
    categoria: 'Sobremesas',
    avaliacao: '4.8',
    tempo: '20–35 min',
    entrega: 'R$ 3,99',
    imagem: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=900',
    descricao: 'Doces, sobremesas e pequenas felicidades feitas todos os dias.',
    cardapio: [
      { id: 501, nome: 'Brownie Especial', descricao: 'Brownie artesanal com chocolate meio amargo.', categoria: 'Bolos e doces', preco: 16.90, imagem: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=700' },
      { id: 502, nome: 'Cheesecake de Frutas', descricao: 'Cheesecake cremoso com calda de frutas vermelhas.', categoria: 'Bolos e doces', preco: 19.90, imagem: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=700' },
      { id: 503, nome: 'Milk-shake', descricao: 'Milk-shake cremoso 400 ml.', categoria: 'Bebidas', preco: 18.90, imagem: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=700' },
      { id: 504, nome: 'Cookie Recheado', descricao: 'Cookie artesanal com recheio de chocolate.', categoria: 'Bolos e doces', preco: 12.90, imagem: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=700' },
    ],
  },
  {
    id: 6,
    nome: 'Taco Street',
    categoria: 'Mexicana',
    avaliacao: '4.6',
    tempo: '25–40 min',
    entrega: 'R$ 4,50',
    imagem: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=900',
    descricao: 'Tacos, burritos e sabores mexicanos com personalidade.',
    cardapio: [
      { id: 601, nome: 'Tacos de Carne', descricao: 'Três tacos com carne temperada, pico de gallo e molho.', categoria: 'Pratos', preco: 29.90, imagem: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=700' },
      { id: 602, nome: 'Burrito de Frango', descricao: 'Tortilla recheada com frango, arroz, feijão e queijo.', categoria: 'Pratos', preco: 32.90, imagem: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=700' },
      { id: 603, nome: 'Nachos', descricao: 'Nachos crocantes com cheddar e guacamole.', categoria: 'Porções', preco: 21.90, imagem: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=700' },
      { id: 604, nome: 'Churros', descricao: 'Churros com doce de leite.', categoria: 'Sobremesas', preco: 15.90, imagem: 'https://images.unsplash.com/photo-1624371414361-e670edf4898d?w=700' },
      { id: 605, nome: 'Refrigerante', descricao: 'Lata 350 ml.', categoria: 'Bebidas', preco: 6.90, imagem: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=700' },
    ],
  },
]

const categoriasRestaurante = [
  { nome: 'Todos', icone: '✦' },
  { nome: 'Hambúrguer', icone: '🍔' },
  { nome: 'Pizza', icone: '🍕' },
  { nome: 'Japonesa', icone: '🍣' },
  { nome: 'Saudável', icone: '🥗' },
  { nome: 'Sobremesas', icone: '🍰' },
  { nome: 'Mexicana', icone: '🌮' },
]

const etapasEntrega = [
  { titulo: 'Pagamento aprovado', descricao: 'Seu pedido foi confirmado com sucesso.', icone: '✓' },
  { titulo: 'Preparando seu pedido', descricao: 'O restaurante está preparando seus produtos.', icone: '🍔' },
  { titulo: 'Motoboy a caminho', descricao: 'O entregador está indo buscar seu pedido.', icone: '🏍️' },
  { titulo: 'Saiu para entrega', descricao: 'Seu pedido está a caminho da sua residência.', icone: '🛵' },
  { titulo: 'Pedido entregue', descricao: 'Aproveite seu pedido! Entrega concluída.', icone: '✓' },
]

const formatarPreco = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

function App() {
  const [busca, setBusca] = useState('')
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos')
  const [restauranteSelecionado, setRestauranteSelecionado] = useState<number | null>(null)
  const [categoriaCardapio, setCategoriaCardapio] = useState('Todos')
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([])
  const [carrinhoAberto, setCarrinhoAberto] = useState(false)
  const [checkoutAberto, setCheckoutAberto] = useState(false)
  const [pedidoStatus, setPedidoStatus] = useState<number | null>(null)
  const [apiOnline, setApiOnline] = useState(false)
  const [mensagemCarrinho, setMensagemCarrinho] = useState('')

  const [nomeCliente, setNomeCliente] = useState('')
  const [cep, setCep] = useState('')
  const [rua, setRua] = useState('')
  const [numero, setNumero] = useState('')
  const [complemento, setComplemento] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>('PIX')
  const [cepCarregando, setCepCarregando] = useState(false)
  const [cepErro, setCepErro] = useState('')

  useEffect(() => {
    async function verificarAPI() {
      try {
        const resposta = await fetch('http://localhost:3333/health')
        setApiOnline(resposta.ok)
      } catch {
        setApiOnline(false)
      }
    }
    void verificarAPI()
  }, [])

  useEffect(() => {
    if (!mensagemCarrinho) return
    const temporizador = window.setTimeout(() => setMensagemCarrinho(''), 2500)
    return () => window.clearTimeout(temporizador)
  }, [mensagemCarrinho])

  useEffect(() => {
    if (pedidoStatus === null || pedidoStatus >= etapasEntrega.length - 1) return
    const temporizador = window.setTimeout(() => {
      setPedidoStatus((atual) =>
        atual === null ? null : Math.min(atual + 1, etapasEntrega.length - 1),
      )
    }, 8000)
    return () => window.clearTimeout(temporizador)
  }, [pedidoStatus])

  const restaurantesFiltrados = useMemo(
    () =>
      restaurantes.filter((restaurante) => {
        const correspondeCategoria =
          categoriaAtiva === 'Todos' || restaurante.categoria === categoriaAtiva
        const correspondeBusca = restaurante.nome.toLowerCase().includes(busca.toLowerCase())
        return correspondeCategoria && correspondeBusca
      }),
    [busca, categoriaAtiva],
  )

  const restauranteAtual = restaurantes.find((item) => item.id === restauranteSelecionado) ?? null

  const produtosFiltrados = restauranteAtual
    ? restauranteAtual.cardapio.filter(
        (produto) => categoriaCardapio === 'Todos' || produto.categoria === categoriaCardapio,
      )
    : []

  const quantidadeCarrinho = carrinho.reduce((total, item) => total + item.quantidade, 0)

  const totalCarrinho = carrinho.reduce(
    (total, item) => total + item.produto.preco * item.quantidade,
    0,
  )

  async function consultarCEP(valor: string) {
    const cepLimpo = valor.replace(/\D/g, '')
    if (cepLimpo.length !== 8) return

    setCepCarregando(true)
    setCepErro('')

    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)

      if (!resposta.ok) throw new Error('Não foi possível consultar o CEP.')

      const dados: DadosCEP = await resposta.json()

      if (dados.erro) {
        setCepErro('CEP não encontrado. Confira os números digitados.')
        setRua('')
        setBairro('')
        setCidade('')
        setEstado('')
        return
      }

      setRua(dados.logradouro || '')
      setBairro(dados.bairro || '')
      setCidade(dados.localidade || '')
      setEstado(dados.uf || '')
    } catch {
      setCepErro('Não foi possível consultar o CEP. Tente novamente.')
    } finally {
      setCepCarregando(false)
    }
  }

  function alterarCEP(valor: string) {
    const numeros = valor.replace(/\D/g, '').slice(0, 8)

    setCep(numeros.length > 5 ? `${numeros.slice(0, 5)}-${numeros.slice(5)}` : numeros)
    setCepErro('')

    if (numeros.length === 8) {
      void consultarCEP(numeros)
    } else {
      setRua('')
      setBairro('')
      setCidade('')
      setEstado('')
    }
  }

  function adicionarAoCarrinho(restauranteId: number, produto: Produto) {
    setCarrinho((atual) => {
      const existente = atual.find(
        (item) => item.produto.id === produto.id && item.restauranteId === restauranteId,
      )

      if (existente) {
        return atual.map((item) =>
          item.produto.id === produto.id && item.restauranteId === restauranteId
            ? { ...item, quantidade: item.quantidade + 1 }
            : item,
        )
      }

      return [...atual, { restauranteId, produto, quantidade: 1 }]
    })

    setMensagemCarrinho(`${produto.nome} adicionado ao carrinho!`)
  }

  function alterarQuantidade(restauranteId: number, produtoId: number, variacao: number) {
    setCarrinho((atual) =>
      atual
        .map((item) =>
          item.restauranteId === restauranteId && item.produto.id === produtoId
            ? { ...item, quantidade: item.quantidade + variacao }
            : item,
        )
        .filter((item) => item.quantidade > 0),
    )
  }

  function fecharCarrinho() {
    setCarrinhoAberto(false)
    setCheckoutAberto(false)
  }

  function finalizarPedido(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setCarrinho([])
    setCheckoutAberto(false)
    setPedidoStatus(0)
  }

  function abrirRestaurante(id: number) {
    setRestauranteSelecionado(id)
    setCategoriaCardapio('Todos')

    window.setTimeout(() => {
      document.getElementById('cardapio')?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  return (
    <div className="app">
      {mensagemCarrinho && (
        <div className="cart-toast" role="status" aria-live="polite">
          <span>✓</span>
          {mensagemCarrinho}
        </div>
      )}

      <header className="topbar">
      <a className="logo" href="#inicio" aria-label="Entregaê - Início">
  <img src="/logo-entregae.png" alt="ENTREGAÊ - Delivery Experience" />
</a>

        <nav className="nav-links">
          <a className="nav-active" href="#inicio">Início</a>
          <a href="#restaurantes" onClick={() => setRestauranteSelecionado(null)}>Restaurantes</a>
          <a href="#categorias">Categorias</a>
          <a href="#sobre">Sobre</a>
        </nav>

        <div className="header-actions">
          <div className={`api-status ${apiOnline ? 'online' : 'offline'}`}>
            <span />
            API {apiOnline ? 'online' : 'offline'}
          </div>

          <button
            className="cart-button"
            onClick={() => {
              setCheckoutAberto(false)
              setCarrinhoAberto(true)
            }}
            aria-label="Abrir carrinho"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span>Carrinho</span>
            <b>{quantidadeCarrinho}</b>
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-glow" />

          <div className="hero-content">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              A NOVA EXPERIÊNCIA DE DELIVERY
            </div>

            <h1>
              A FOME NÃO<br />
              <span>ESPERA.</span><br />
              A GENTE TAMBÉM NÃO.
            </h1>

            <p>
              Seus sabores favoritos, seus restaurantes preferidos.
              Tudo conectado em uma experiência diferente.
            </p>

            <a href="#restaurantes" className="primary-button">
              EXPLORAR RESTAURANTES <span>↗</span>
            </a>

            <div className="hero-stats">
              <div><strong>+500</strong><small>OPÇÕES DE SABOR</small></div>
              <div><strong>24/7</strong><small>SEMPRE CONECTADO</small></div>
              <div><strong>100%</strong><small>NA SUA ÁREA</small></div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />

            <div className="hero-food">
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900"
                alt="Hambúrguer artesanal"
              />
            </div>

            <div className="floating-tag tag-top">
              <span>✦</span> SABOR SEM LIMITES
            </div>

            <div className="floating-tag tag-bottom">
              <span>⚡</span> ENTREGA INTELIGENTE
            </div>

            <div className="hero-number">01</div>
          </div>
        </section>

        <section className="search-section">
          <div className="search-heading">
            <div>
              <span className="section-label">ENCONTRE SEU PRÓXIMO FAVORITO</span>
              <h2>O que vamos <span>pedir?</span></h2>
            </div>
            <span className="search-decoration">EXPLORE / DESCUBRA / PEÇA</span>
          </div>

          <div className="search-box">
            <span className="search-icon">⌕</span>
            <input
              type="text"
              placeholder="Busque restaurantes..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <span className="search-shortcut">BUSCAR</span>
          </div>
        </section>

        <section className="categories-section" id="categorias">
          <div className="section-heading">
            <div>
              <span className="section-label">ESCOLHA SEU ESTILO</span>
              <h2>Explore por <span>categoria</span></h2>
            </div>
          </div>

          <div className="category-list">
            {categoriasRestaurante.map((categoria) => (
              <button
                key={categoria.nome}
                className={`category-card ${categoriaAtiva === categoria.nome ? 'selected' : ''}`}
                onClick={() => {
                  setCategoriaAtiva(categoria.nome)
                  setRestauranteSelecionado(null)
                }}
              >
                <span className="category-icon">{categoria.icone}</span>
                <span>{categoria.nome}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="restaurants-section" id="restaurantes">
          {restauranteAtual ? (
            <div className="restaurant-menu-page" id="cardapio">
              <button
                className="back-restaurants"
                onClick={() => setRestauranteSelecionado(null)}
              >
                ← VOLTAR AOS RESTAURANTES
              </button>

              <div className="menu-restaurant-hero">
                <img src={restauranteAtual.imagem} alt={restauranteAtual.nome} />
                <div className="menu-restaurant-overlay" />

                <div className="menu-restaurant-info">
                  <span className="section-label">CARDÁPIO EXCLUSIVO</span>
                  <h2>{restauranteAtual.nome}</h2>
                  <p>{restauranteAtual.descricao}</p>

                  <div className="menu-restaurant-meta">
                    <span>★ {restauranteAtual.avaliacao}</span>
                    <span>◷ {restauranteAtual.tempo}</span>
                    <span>⚡ {restauranteAtual.entrega}</span>
                  </div>
                </div>
              </div>

              <div className="section-heading menu-heading">
                <div>
                  <span className="section-label">ESCOLHA SEUS FAVORITOS</span>
                  <h2>Nosso <span>cardápio</span></h2>
                </div>

                <span className="restaurant-count">
                  {produtosFiltrados.length.toString().padStart(2, '0')} PRODUTOS
                </span>
              </div>

              <div className="menu-category-list">
                {[
                  'Todos',
                  ...Array.from(
                    new Set(restauranteAtual.cardapio.map((produto) => produto.categoria)),
                  ),
                ].map((categoria) => (
                  <button
                    key={categoria}
                    className={categoriaCardapio === categoria ? 'active' : ''}
                    onClick={() => setCategoriaCardapio(categoria)}
                  >
                    {categoria}
                  </button>
                ))}
              </div>

              <div className="product-grid">
                {produtosFiltrados.map((produto) => (
                  <article className="product-card" key={produto.id}>
                    <img src={produto.imagem} alt={produto.nome} />

                    <div className="product-card-info">
                      <span className="product-category">{produto.categoria}</span>
                      <h3>{produto.nome}</h3>
                      <p>{produto.descricao}</p>

                      <div className="product-card-bottom">
                        <strong>{formatarPreco(produto.preco)}</strong>

                        <button
                          onClick={() => adicionarAoCarrinho(restauranteAtual.id, produto)}
                        >
                          ADICIONAR <span>+</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <p className="demo-price-note">
                Preços e cardápios fictícios para demonstração do Entregaê.
              </p>
            </div>
          ) : (
            <>
              <div className="section-heading">
                <div>
                  <span className="section-label">SELEÇÃO ENTREGAÊ</span>
                  <h2>Restaurantes em <span>destaque</span></h2>
                </div>

                <span className="restaurant-count">
                  {restaurantesFiltrados.length.toString().padStart(2, '0')} OPÇÕES
                </span>
              </div>

              {restaurantesFiltrados.length > 0 ? (
                <div className="restaurant-grid">
                  {restaurantesFiltrados.map((restaurante) => (
                    <article className="restaurant-card" key={restaurante.id}>
                      <button
                        className="restaurant-open"
                        onClick={() => abrirRestaurante(restaurante.id)}
                        aria-label={`Ver cardápio de ${restaurante.nome}`}
                      >
                        <div className="restaurant-image">
                          <img src={restaurante.imagem} alt={restaurante.nome} />

                          {restaurante.destaque && (
                            <span className="featured-tag">DESTAQUE</span>
                          )}

                          <span className="rating">★ {restaurante.avaliacao}</span>
                        </div>

                        <div className="restaurant-info">
                          <div className="restaurant-title">
                            <div>
                              <h3>{restaurante.nome}</h3>
                              <p>{restaurante.categoria}</p>
                            </div>
                            <span className="restaurant-arrow">↗</span>
                          </div>

                          <p className="restaurant-description">
                            {restaurante.descricao}
                          </p>

                          <div className="restaurant-details">
                            <span>◷ {restaurante.tempo}</span>
                            <span>⚡ {restaurante.entrega}</span>
                          </div>

                          <span className="add-button">
                            VER CARDÁPIO <span>→</span>
                          </span>
                        </div>
                      </button>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <span>⌕</span>
                  <h3>Nenhum restaurante encontrado</h3>
                  <p>Tente outra busca ou escolha uma categoria diferente.</p>

                  <button
                    className="text-button"
                    onClick={() => {
                      setBusca('')
                      setCategoriaAtiva('Todos')
                    }}
                  >
                    LIMPAR FILTROS
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        <section className="tracking-banner" id="sobre">
          <div className="tracking-glow" />

          <div className="tracking-content">
            <span className="section-label">TECNOLOGIA EM MOVIMENTO</span>
            <h2>
              SEU PEDIDO.<br />
              <span>NO SEU RADAR.</span>
            </h2>
            <p>
              Acompanhe as etapas do seu pedido e visualize o percurso
              da entrega em um mapa integrado.
            </p>
            <span className="coming-soon">RASTREAMENTO INTELIGENTE</span>
          </div>

          <div className="tracking-graphic">
            <div className="map-grid">
              <div className="map-route" />
              <span className="map-pin pin-one">●</span>
              <span className="map-pin pin-two">⌖</span>
              <span className="map-label">SUA ENTREGA</span>
              <span className="map-coordinate">23°33' S · 46°38' W</span>
            </div>
          </div>
        </section>
      </main>

     <footer className="footer">
  <a className="logo" href="#inicio" aria-label="Entregaê - Início">
    <img src="/logo-entregae.png" alt="ENTREGAÊ - Delivery Experience" />
  </a>

  <p>SEU PEDIDO. SEU TEMPO. NOSSO COMPROMISSO.</p>
  <span>© 2026 ENTREGAÊ · TODOS OS DIREITOS RESERVADOS</span>
</footer>

      {carrinhoAberto && (
        <div className="modal-overlay" onClick={fecharCarrinho}>
          <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <div>
                <span className="section-label">
                  {pedidoStatus !== null
                    ? 'ACOMPANHAMENTO DO PEDIDO'
                    : checkoutAberto
                      ? 'FINALIZAÇÃO'
                      : 'SEU PEDIDO'}
                </span>

                <h2>
                  {pedidoStatus !== null
                    ? pedidoStatus === 4
                      ? 'Pedido entregue!'
                      : 'Seu pedido está a caminho'
                    : checkoutAberto
                      ? 'Finalizar pedido'
                      : 'Meu carrinho'}
                </h2>
              </div>

              <button
                className="close-button"
                onClick={fecharCarrinho}
                aria-label="Fechar carrinho"
              >
                ×
              </button>
            </div>

            {pedidoStatus !== null ? (
              <div className="delivery-tracking">
                <div className="tracking-success">
                  <span>✓</span>
                  <div>
                    <strong>{etapasEntrega[pedidoStatus].titulo}</strong>
                    <p>{etapasEntrega[pedidoStatus].descricao}</p>
                  </div>
                </div>

                <div className="delivery-map">
                  <DeliveryMap
                    rua={rua}
                    numero={numero}
                    bairro={bairro}
                    cidade={cidade}
                    estado={estado}
                    cep={cep}
                  />
                </div>

                <div className="courier-card">
                  <div className="courier-avatar">🏍️</div>
                  <div className="courier-info">
                    <strong>Lucas Martins</strong>
                    <span>Entregador demonstrativo</span>
                    <small>Moto Honda CG · Placa ABC-1234</small>
                  </div>
                  <span className="courier-status">SIMULADO</span>
                </div>

                <div className="delivery-steps">
                  {etapasEntrega.map((etapa, indice) => (
                    <div
                      className={`delivery-step ${indice <= pedidoStatus ? 'completed' : ''} ${indice === pedidoStatus ? 'current' : ''}`}
                      key={etapa.titulo}
                    >
                      <span className="step-icon">{etapa.icone}</span>

                      <div>
                        <strong>{etapa.titulo}</strong>
                        <p>{etapa.descricao}</p>
                      </div>

                      {indice < pedidoStatus && (
                        <span className="step-check">✓</span>
                      )}
                    </div>
                  ))}
                </div>

                <p className="cart-note">
                  Mapa com ruas reais do OpenStreetMap. O entregador, sua posição
                  e os horários são demonstrativos e não representam uma entrega
                  ou GPS real.
                </p>

                {pedidoStatus === 4 && (
                  <button className="primary-button checkout-button" onClick={fecharCarrinho}>
                    CONCLUIR E VOLTAR À LOJA
                  </button>
                )}
              </div>
            ) : checkoutAberto ? (
              <form className="checkout-form" onSubmit={finalizarPedido}>
                <label htmlFor="nomeCliente">
                  Nome completo
                  <input
                    id="nomeCliente"
                    type="text"
                    placeholder="Digite seu nome"
                    value={nomeCliente}
                    onChange={(e) => setNomeCliente(e.target.value)}
                    required
                  />
                </label>

                <div className="address-section-title">ENDEREÇO DE ENTREGA</div>

                <label htmlFor="cepEntrega">
                  CEP
                  <input
                    id="cepEntrega"
                    type="text"
                    inputMode="numeric"
                    placeholder="00000-000"
                    value={cep}
                    onChange={(e) => alterarCEP(e.target.value)}
                    onBlur={() => consultarCEP(cep)}
                    maxLength={9}
                    required
                  />
                </label>

                {cepCarregando && (
                  <p className="cep-message">Consultando CEP...</p>
                )}

                {cepErro && <p className="cep-error">{cepErro}</p>}

                <label htmlFor="ruaEntrega">
                  Rua / Avenida
                  <input
                    id="ruaEntrega"
                    type="text"
                    placeholder="Nome da rua"
                    value={rua}
                    onChange={(e) => setRua(e.target.value)}
                    required
                  />
                </label>

                <div className="address-grid">
                  <label htmlFor="numeroEntrega">
                    Número
                    <input
                      id="numeroEntrega"
                      type="text"
                      placeholder="Nº"
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                      required
                    />
                  </label>

                  <label htmlFor="complementoEntrega">
                    Complemento
                    <input
                      id="complementoEntrega"
                      type="text"
                      placeholder="Apto, bloco..."
                      value={complemento}
                      onChange={(e) => setComplemento(e.target.value)}
                    />
                  </label>
                </div>

                <label htmlFor="bairroEntrega">
                  Bairro
                  <input
                    id="bairroEntrega"
                    type="text"
                    placeholder="Bairro"
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    required
                  />
                </label>

                <div className="address-grid">
                  <label htmlFor="cidadeEntrega">
                    Cidade
                    <input
                      id="cidadeEntrega"
                      type="text"
                      placeholder="Cidade"
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                      required
                    />
                  </label>

                  <label htmlFor="estadoEntrega">
                    Estado
                    <input
                      id="estadoEntrega"
                      type="text"
                      placeholder="UF"
                      value={estado}
                      onChange={(e) => setEstado(e.target.value)}
                      maxLength={2}
                      required
                    />
                  </label>
                </div>

                <span className="payment-title">
                  ESCOLHA A FORMA DE PAGAMENTO
                </span>

                <div className="payment-options">
                  {(['PIX', 'Cartão', 'Dinheiro'] as FormaPagamento[]).map((forma) => (
                    <label
                      key={forma}
                      className={`payment-option ${formaPagamento === forma ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="pagamento"
                        value={forma}
                        checked={formaPagamento === forma}
                        onChange={() => setFormaPagamento(forma)}
                      />
                      {forma}
                    </label>
                  ))}
                </div>

                <div className="checkout-total">
                  <span>Total do pedido</span>
                  <strong>{formatarPreco(totalCarrinho)}</strong>
                </div>

                <p className="cart-note">
                  Pagamento de demonstração: nenhuma cobrança real será realizada.
                </p>

                <button
                  className="primary-button checkout-button"
                  type="submit"
                  disabled={cepCarregando}
                >
                  SIMULAR PAGAMENTO <span>→</span>
                </button>

                <button
                  className="text-button back-to-cart"
                  type="button"
                  onClick={() => setCheckoutAberto(false)}
                >
                  VOLTAR AO CARRINHO
                </button>
              </form>
            ) : carrinho.length === 0 ? (
              <div className="cart-empty">
                <span className="empty-cart-icon">🛒</span>
                <h3>Seu carrinho está vazio</h3>
                <p>Explore os restaurantes e escolha seus pratos favoritos.</p>

                <button className="primary-button" onClick={fecharCarrinho}>
                  EXPLORAR RESTAURANTES
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {carrinho.map((item) => {
                    const restaurante = restaurantes.find(
                      (r) => r.id === item.restauranteId,
                    )

                    return (
                      <div
                        className="cart-item"
                        key={`${item.restauranteId}-${item.produto.id}`}
                      >
                        <img src={item.produto.imagem} alt={item.produto.nome} />

                        <div className="cart-product-info">
                          <strong>{item.produto.nome}</strong>
                          <span>
                            {restaurante?.nome} · {formatarPreco(item.produto.preco)}
                          </span>
                        </div>

                        <div className="cart-quantity">
                          <button
                            onClick={() =>
                              alterarQuantidade(item.restauranteId, item.produto.id, -1)
                            }
                            aria-label={`Diminuir ${item.produto.nome}`}
                          >
                            −
                          </button>

                          <strong>{item.quantidade}</strong>

                          <button
                            onClick={() =>
                              alterarQuantidade(item.restauranteId, item.produto.id, 1)
                            }
                            aria-label={`Aumentar ${item.produto.nome}`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="cart-total">
                  <span>Total</span>
                  <strong>{formatarPreco(totalCarrinho)}</strong>
                </div>

                <p className="cart-note">
                  Cardápios e preços fictícios para demonstração.
                  Nenhuma cobrança real será realizada.
                </p>

                <button
                  className="primary-button checkout-button"
                  onClick={() => setCheckoutAberto(true)}
                >
                  IR PARA O PAGAMENTO <span>→</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App