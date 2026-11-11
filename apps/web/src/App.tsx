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
type TipoConta = 'Cliente' | 'Restaurante' | 'Entregador'
type ModoAutenticacao = 'login' | 'cadastro'

type UsuarioDemo = {
  nome: string
  email: string
  telefone: string
  senha: string
  tipo: TipoConta

  cpf?: string

  nomeResponsavel?: string
  cnpj?: string
  semCnpj?: boolean
  categoriaComida?: string

  cep?: string
  rua?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string

  tipoVeiculo?: string
  marcaVeiculo?: string
  modeloVeiculo?: string
  anoVeiculo?: string
  corVeiculo?: string
  placa?: string
  renavam?: string
  numeroCnh?: string
  categoriaCnh?: string
  validadeCnh?: string
}

type StatusPedido = 'Recebido' | 'Aceito' | 'Preparando' | 'Pronto para retirada' | 'Em rota' | 'Entregue' | 'Recusado'

type PedidoDemo = {
  id: number
  restauranteId: number
  restauranteNome: string
  clienteNome: string
  itens: ItemCarrinho[]
  total: number
  cep: string
  rua: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
  formaPagamento: FormaPagamento
  status: StatusPedido
  criadoEm: string
  entregadorNome?: string
  entregadorEmail?: string
}

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
  const [pedidosDemo, setPedidosDemo] = useState<PedidoDemo[]>([])
  const [corridaSelecionada, setCorridaSelecionada] = useState<number | null>(null)

  // Autenticação demonstrativa
  const [loginAberto, setLoginAberto] = useState(false)
  const [modoAutenticacao, setModoAutenticacao] = useState<ModoAutenticacao>('login')
  const [tipoConta, setTipoConta] = useState<TipoConta>('Cliente')

  // Dados comuns
  const [nomeCadastro, setNomeCadastro] = useState('')
  const [telefoneCadastro, setTelefoneCadastro] = useState('')
  const [emailLogin, setEmailLogin] = useState('')
  const [senhaLogin, setSenhaLogin] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')

  // Dados do restaurante
  const [nomeRestaurante, setNomeRestaurante] = useState('')
  const [responsavelRestaurante, setResponsavelRestaurante] = useState('')
  const [cnpjRestaurante, setCnpjRestaurante] = useState('')
  const [semCnpj, setSemCnpj] = useState(false)
  const [categoriaComida, setCategoriaComida] = useState('')
  const [cepRestaurante, setCepRestaurante] = useState('')
  const [ruaRestaurante, setRuaRestaurante] = useState('')
  const [numeroRestaurante, setNumeroRestaurante] = useState('')
  const [complementoRestaurante, setComplementoRestaurante] = useState('')
  const [bairroRestaurante, setBairroRestaurante] = useState('')
  const [cidadeRestaurante, setCidadeRestaurante] = useState('')
  const [estadoRestaurante, setEstadoRestaurante] = useState('')
  const [cepRestauranteCarregando, setCepRestauranteCarregando] = useState(false)
  const [cepRestauranteErro, setCepRestauranteErro] = useState('')

  // Dados do entregador
  const [cpfCadastro, setCpfCadastro] = useState('')
  const [tipoVeiculo, setTipoVeiculo] = useState('Moto')
  const [marcaVeiculo, setMarcaVeiculo] = useState('')
  const [modeloVeiculo, setModeloVeiculo] = useState('')
  const [anoVeiculo, setAnoVeiculo] = useState('')
  const [corVeiculo, setCorVeiculo] = useState('')
  const [placaVeiculo, setPlacaVeiculo] = useState('')
  const [renavamVeiculo, setRenavamVeiculo] = useState('')
  const [numeroCnh, setNumeroCnh] = useState('')
  const [categoriaCnh, setCategoriaCnh] = useState('')
  const [validadeCnh, setValidadeCnh] = useState('')

  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)
  const [mensagemLogin, setMensagemLogin] = useState('')
  const [continuarParaCheckout, setContinuarParaCheckout] = useState(false)

  const [usuariosDemo, setUsuariosDemo] = useState<UsuarioDemo[]>([])
  const [usuarioLogado, setUsuarioLogado] = useState<{
    nome: string
    email: string
    tipo: TipoConta
  } | null>(null)

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

  const restauranteAtual =
    restaurantes.find((item) => item.id === restauranteSelecionado) ?? null

  const produtosFiltrados = restauranteAtual
    ? restauranteAtual.cardapio.filter(
        (produto) => categoriaCardapio === 'Todos' || produto.categoria === categoriaCardapio,
      )
    : []

  const quantidadeCarrinho = carrinho.reduce(
    (total, item) => total + item.quantidade,
    0,
  )

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

  async function consultarCEPRestaurante(valor: string) {
    const cepLimpo = valor.replace(/\D/g, '')
    if (cepLimpo.length !== 8) return

    setCepRestauranteCarregando(true)
    setCepRestauranteErro('')

    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)

      if (!resposta.ok) {
        throw new Error('Não foi possível consultar o CEP.')
      }

      const dados: DadosCEP = await resposta.json()

      if (dados.erro) {
        setCepRestauranteErro('CEP não encontrado. Confira os números digitados.')
        setRuaRestaurante('')
        setBairroRestaurante('')
        setCidadeRestaurante('')
        setEstadoRestaurante('')
        return
      }

      setRuaRestaurante(dados.logradouro || '')
      setBairroRestaurante(dados.bairro || '')
      setCidadeRestaurante(dados.localidade || '')
      setEstadoRestaurante(dados.uf || '')
    } catch {
      setCepRestauranteErro('Não foi possível consultar o CEP. Tente novamente.')
    } finally {
      setCepRestauranteCarregando(false)
    }
  }

  function alterarCEPRestaurante(valor: string) {
    const numeros = valor.replace(/\D/g, '').slice(0, 8)

    setCepRestaurante(
      numeros.length > 5
        ? `${numeros.slice(0, 5)}-${numeros.slice(5)}`
        : numeros,
    )

    setCepRestauranteErro('')

    if (numeros.length === 8) {
      void consultarCEPRestaurante(numeros)
    } else {
      setRuaRestaurante('')
      setBairroRestaurante('')
      setCidadeRestaurante('')
      setEstadoRestaurante('')
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

  function abrirCheckout() {
    if (!usuarioLogado) {
      setContinuarParaCheckout(true)
      setMensagemLogin('Entre ou crie sua conta de cliente para continuar com o pedido.')
      setModoAutenticacao('login')
      setLoginAberto(true)
      return
    }

    if (usuarioLogado.tipo !== 'Cliente') {
      setMensagemLogin('Somente contas de Cliente podem realizar pedidos.')
      setModoAutenticacao('login')
      setLoginAberto(true)
      return
    }

    setNomeCliente(usuarioLogado.nome)
    setCheckoutAberto(true)
  }

  function finalizarPedido(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!usuarioLogado || usuarioLogado.tipo !== 'Cliente') {
      setCheckoutAberto(false)
      setContinuarParaCheckout(true)
      setMensagemLogin('Entre com uma conta de Cliente para finalizar o pedido.')
      setLoginAberto(true)
      return
    }

    const gruposRestaurante = Array.from(new Set(carrinho.map((item) => item.restauranteId)))
    const novosPedidos: PedidoDemo[] = gruposRestaurante.map((restauranteId, indice) => {
      const itensDoRestaurante = carrinho.filter((item) => item.restauranteId === restauranteId)
      const restaurante = restaurantes.find((item) => item.id === restauranteId)

      return {
        id: Date.now() + indice,
        restauranteId,
        restauranteNome: restaurante?.nome ?? `Restaurante ${restauranteId}`,
        clienteNome: usuarioLogado.nome,
        itens: itensDoRestaurante,
        total: itensDoRestaurante.reduce(
          (soma, item) => soma + item.produto.preco * item.quantidade,
          0,
        ),
        cep,
        rua,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        formaPagamento,
        status: 'Recebido',
        criadoEm: new Date().toLocaleString('pt-BR'),
      }
    })

    setPedidosDemo((atuais) => [...atuais, ...novosPedidos])
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

  function abrirLogin() {
    setMensagemLogin('')
    setModoAutenticacao('login')
    setContinuarParaCheckout(false)
    setMostrarSenha(false)
    setMostrarConfirmacao(false)
    setLoginAberto(true)
  }

  function trocarModoAutenticacao(modo: ModoAutenticacao) {
    setModoAutenticacao(modo)
    setMensagemLogin('')
    setMostrarSenha(false)
    setMostrarConfirmacao(false)
  }

  function concluirAcesso(usuario: UsuarioDemo) {
    setUsuarioLogado({
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo,
    })

    setNomeCliente(usuario.nome)
    setEmailLogin(usuario.email)
    setSenhaLogin('')
    setConfirmarSenha('')
    setMensagemLogin('')
    setMostrarSenha(false)
    setMostrarConfirmacao(false)
    setLoginAberto(false)

    if (continuarParaCheckout && usuario.tipo === 'Cliente') {
      setCheckoutAberto(true)
    } else if (continuarParaCheckout && usuario.tipo !== 'Cliente') {
      setMensagemCarrinho('Entre com uma conta de Cliente para realizar pedidos.')
    }

    setContinuarParaCheckout(false)
  }

  function realizarCadastro(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const email = emailLogin.trim().toLowerCase()
    const telefone = telefoneCadastro.trim()

    // O nome principal depende do tipo de conta.
    const nome =
      tipoConta === 'Restaurante'
        ? nomeRestaurante.trim()
        : nomeCadastro.trim()

    if (!nome || !email || !telefone || !senhaLogin || !confirmarSenha) {
      setMensagemLogin('Preencha todos os campos obrigatórios.')
      return
    }

    if (telefone.replace(/\D/g, '').length < 10) {
      setMensagemLogin('Informe um telefone válido com DDD.')
      return
    }

    if (senhaLogin.length < 8) {
      setMensagemLogin('A senha precisa ter pelo menos 8 caracteres.')
      return
    }

    if (senhaLogin !== confirmarSenha) {
      setMensagemLogin('As senhas não são iguais. Confira os dois campos.')
      return
    }

    const emailExistente = usuariosDemo.some(
      (usuario) => usuario.email.toLowerCase() === email,
    )

    if (emailExistente) {
      setMensagemLogin('Este e-mail já possui cadastro. Faça login.')
      return
    }

    const dadosAdicionais: Partial<UsuarioDemo> = {}

    if (tipoConta === 'Restaurante') {
      const cnpjLimpo = cnpjRestaurante.replace(/\D/g, '')
      const cepLimpo = cepRestaurante.replace(/\D/g, '')

      if (!responsavelRestaurante.trim()) {
        setMensagemLogin('Informe o nome do responsável pelo restaurante.')
        return
      }

      if (!semCnpj && cnpjLimpo.length !== 14) {
        setMensagemLogin('Informe um CNPJ válido ou marque "Não tenho CNPJ".')
        return
      }

      if (semCnpj && cnpjRestaurante.trim()) {
        setMensagemLogin('Apague o CNPJ ou desmarque a opção "Não tenho CNPJ".')
        return
      }

      if (!categoriaComida) {
        setMensagemLogin('Selecione a categoria de comida do restaurante.')
        return
      }

      if (
        cepLimpo.length !== 8 ||
        !ruaRestaurante.trim() ||
        !numeroRestaurante.trim() ||
        !bairroRestaurante.trim() ||
        !cidadeRestaurante.trim() ||
        !estadoRestaurante.trim()
      ) {
        setMensagemLogin('Preencha o endereço completo do restaurante.')
        return
      }

      dadosAdicionais.nomeResponsavel = responsavelRestaurante.trim()
      dadosAdicionais.cnpj = semCnpj ? '' : cnpjLimpo
      dadosAdicionais.semCnpj = semCnpj
      dadosAdicionais.categoriaComida = categoriaComida
      dadosAdicionais.cep = cepLimpo
      dadosAdicionais.rua = ruaRestaurante.trim()
      dadosAdicionais.numero = numeroRestaurante.trim()
      dadosAdicionais.complemento = complementoRestaurante.trim()
      dadosAdicionais.bairro = bairroRestaurante.trim()
      dadosAdicionais.cidade = cidadeRestaurante.trim()
      dadosAdicionais.estado = estadoRestaurante.trim()
    }

    if (tipoConta === 'Entregador') {
      const cpfLimpo = cpfCadastro.replace(/\D/g, '')
      const anoAtual = new Date().getFullYear()
      const anoInformado = Number(anoVeiculo)

      if (!nomeCadastro.trim()) {
        setMensagemLogin('Informe seu nome completo.')
        return
      }

      if (cpfLimpo.length !== 11) {
        setMensagemLogin('Informe um CPF válido com 11 números.')
        return
      }

      if (
        !tipoVeiculo ||
        !marcaVeiculo.trim() ||
        !modeloVeiculo.trim() ||
        !anoVeiculo.trim() ||
        !corVeiculo.trim()
      ) {
        setMensagemLogin('Preencha todos os dados do veículo.')
        return
      }

      if (
        !Number.isInteger(anoInformado) ||
        anoInformado < 1900 ||
        anoInformado > anoAtual + 1
      ) {
        setMensagemLogin('Informe um ano válido para o veículo.')
        return
      }

      if (tipoVeiculo !== 'Bicicleta') {
        if (!placaVeiculo.trim()) {
          setMensagemLogin('Informe a placa do veículo.')
          return
        }

        if (!numeroCnh.trim() || !categoriaCnh || !validadeCnh) {
          setMensagemLogin('Preencha os dados da sua CNH.')
          return
        }
      }

      dadosAdicionais.cpf = cpfLimpo
      dadosAdicionais.tipoVeiculo = tipoVeiculo
      dadosAdicionais.marcaVeiculo = marcaVeiculo.trim()
      dadosAdicionais.modeloVeiculo = modeloVeiculo.trim()
      dadosAdicionais.anoVeiculo = anoVeiculo
      dadosAdicionais.corVeiculo = corVeiculo.trim()
      dadosAdicionais.placa = tipoVeiculo === 'Bicicleta' ? '' : placaVeiculo.trim()
      dadosAdicionais.renavam = renavamVeiculo.trim()
      dadosAdicionais.numeroCnh = tipoVeiculo === 'Bicicleta' ? '' : numeroCnh.trim()
      dadosAdicionais.categoriaCnh = tipoVeiculo === 'Bicicleta' ? '' : categoriaCnh
      dadosAdicionais.validadeCnh = tipoVeiculo === 'Bicicleta' ? '' : validadeCnh
    }

    const novoUsuario: UsuarioDemo = {
      nome,
      email,
      telefone,
      senha: senhaLogin,
      tipo: tipoConta,
      ...dadosAdicionais,
    }

    setUsuariosDemo((atuais) => [...atuais, novoUsuario])
    concluirAcesso(novoUsuario)
  }

  function realizarLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const identificador = emailLogin.trim().toLowerCase()
    const identificadorNumerico = identificador.replace(/\D/g, '')

    if (!identificador || !senhaLogin) {
      setMensagemLogin('Preencha seu e-mail, CPF ou CNPJ e sua senha.')
      return
    }

    const usuario = usuariosDemo.find((item) => {
      if (item.tipo !== tipoConta || item.senha !== senhaLogin) {
        return false
      }

      const emailCorresponde = item.email.toLowerCase() === identificador
      const cpfCorresponde =
        tipoConta === 'Entregador' &&
        !!item.cpf &&
        item.cpf.replace(/\D/g, '') === identificadorNumerico
      const cnpjCorresponde =
        tipoConta === 'Restaurante' &&
        !!item.cnpj &&
        item.cnpj.replace(/\D/g, '') === identificadorNumerico

      return emailCorresponde || cpfCorresponde || cnpjCorresponde
    })

    if (!usuario) {
      setMensagemLogin(
        'Conta não encontrada ou dados incorretos. Confira as informações ou crie uma conta.',
      )
      return
    }

    concluirAcesso(usuario)
  }

  function sairDaConta() {
    setUsuarioLogado(null)
    setEmailLogin('')
    setSenhaLogin('')
    setConfirmarSenha('')
    setNomeCadastro('')
    setTelefoneCadastro('')
    setTipoConta('Cliente')
    setContinuarParaCheckout(false)
    setCorridaSelecionada(null)
    setMensagemLogin('')
  }

  function atualizarStatusPedido(pedidoId: number, status: StatusPedido) {
    setPedidosDemo((atuais) =>
      atuais.map((pedido) => pedido.id === pedidoId ? { ...pedido, status } : pedido),
    )
  }

  function aceitarCorrida(pedidoId: number) {
    if (!usuarioLogado || usuarioLogado.tipo !== 'Entregador') return

    setPedidosDemo((atuais) =>
      atuais.map((pedido) =>
        pedido.id === pedidoId && pedido.status === 'Pronto para retirada'
          ? {
              ...pedido,
              status: 'Em rota',
              entregadorNome: usuarioLogado.nome,
              entregadorEmail: usuarioLogado.email,
            }
          : pedido,
      ),
    )
    setCorridaSelecionada(pedidoId)
  }

  const pedidosDoRestaurante = usuarioLogado?.tipo === 'Restaurante'
    ? pedidosDemo.filter((pedido) => pedido.restauranteNome.toLowerCase() === usuarioLogado.nome.toLowerCase())
    : []

  const corridasDisponiveis = pedidosDemo.filter((pedido) => pedido.status === 'Pronto para retirada')
  const minhasCorridas = usuarioLogado?.tipo === 'Entregador'
    ? pedidosDemo.filter((pedido) => pedido.status === 'Em rota' && pedido.entregadorEmail === usuarioLogado.email)
    : []
  const corridaAtual = pedidosDemo.find((pedido) => pedido.id === corridaSelecionada) ?? minhasCorridas[0] ?? null

  const estilosPainel = `
    .role-dashboard { min-height: 100vh; padding: 34px 7%; color: #f5f5f7; background: radial-gradient(ellipse at 85% 0%, rgba(139,92,255,.08), transparent 34%), #101014; }
    .role-topbar { display:flex; align-items:center; justify-content:space-between; gap:20px; padding:18px 7%; border-bottom:1px solid rgba(255,255,255,.09); background:#101014; }
    .role-brand { color:#b7ff35; font-size:22px; font-weight:900; letter-spacing:1px; }
    .role-user { display:flex; align-items:center; gap:14px; color:#aaa; font-size:13px; }
    .role-logout { padding:10px 15px; border:1px solid rgba(255,255,255,.16); border-radius:8px; background:transparent; color:#fff; cursor:pointer; }
    .role-heading { display:flex; align-items:flex-end; justify-content:space-between; gap:20px; margin:10px 0 28px; }
    .role-eyebrow { color:#b7ff35; font-size:10px; font-weight:900; letter-spacing:2px; }
    .role-heading h1 { margin:9px 0; font-size:clamp(28px,4vw,42px); font-weight:900; }
    .role-heading p { color:#9999a4; font-size:13px; }
    .role-stats { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:14px; margin-bottom:26px; }
    .role-stat,.role-card { padding:20px; border:1px solid rgba(255,255,255,.09); border-radius:14px; background:#191920; }
    .role-stat span { display:block; color:#9999a4; font-size:11px; }
    .role-stat strong { display:block; margin-top:10px; color:#b7ff35; font-size:28px; }
    .role-section-title { margin:28px 0 14px; font-size:18px; }
    .role-orders { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px; }
    .role-card-head { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:14px; }
    .role-card h3 { font-size:16px; }
    .role-muted { color:#9999a4; font-size:12px; line-height:1.7; }
    .role-status { padding:6px 9px; border-radius:20px; color:#b7ff35; background:rgba(183,255,53,.1); font-size:10px; font-weight:800; white-space:nowrap; }
    .role-items { margin:14px 0; padding:12px 0; border-top:1px solid rgba(255,255,255,.08); border-bottom:1px solid rgba(255,255,255,.08); color:#ddd; font-size:12px; line-height:1.9; }
    .role-actions { display:flex; flex-wrap:wrap; gap:9px; margin-top:16px; }
    .role-primary,.role-secondary,.role-danger { padding:11px 14px; border:0; border-radius:8px; font-size:11px; font-weight:900; cursor:pointer; }
    .role-primary { color:#101014; background:#b7ff35; }
    .role-secondary { color:#ddd; background:#30303a; }
    .role-danger { color:#ff9292; background:rgba(255,75,75,.12); }
    .role-empty { padding:35px 20px; border:1px dashed rgba(255,255,255,.16); border-radius:14px; color:#9999a4; text-align:center; line-height:1.8; }
    .courier-layout { display:grid; grid-template-columns:minmax(300px,.9fr) minmax(0,1.1fr); gap:18px; align-items:start; }
    .courier-list { display:grid; gap:12px; }
    .courier-map { min-height:420px; overflow:hidden; border:1px solid rgba(255,255,255,.1); border-radius:14px; background:#191920; }
    .courier-map-title { padding:17px 19px; color:#b7ff35; font-size:11px; font-weight:900; letter-spacing:1px; }
    .role-dashboard .delivery-map { height:390px; min-height:390px; }
    @media(max-width:800px) { .role-dashboard {padding:24px 5%;} .role-topbar {padding:16px 5%;} .role-orders,.courier-layout {grid-template-columns:1fr;} .role-stats {grid-template-columns:1fr;} .role-heading {align-items:flex-start; flex-direction:column;} }
  `

  if (usuarioLogado?.tipo === 'Restaurante') {
    const recebidos = pedidosDoRestaurante.filter((pedido) => pedido.status === 'Recebido').length
    const emPreparo = pedidosDoRestaurante.filter((pedido) => ['Aceito', 'Preparando'].includes(pedido.status)).length
    const concluidos = pedidosDoRestaurante.filter((pedido) => pedido.status === 'Entregue').length

    return (
      <div className="app">
        <style>{estilosPainel}</style>
        <header className="role-topbar">
          <div className="role-brand">ENTREGAÊ <span style={{color:'#fff'}}>· PAINEL DO RESTAURANTE</span></div>
          <div className="role-user"><span>{usuarioLogado.nome}</span><button className="role-logout" onClick={sairDaConta}>Sair</button></div>
        </header>
        <main className="role-dashboard">
          <div className="role-heading">
            <div><span className="role-eyebrow">ÁREA DO ESTABELECIMENTO</span><h1>Olá, {usuarioLogado.nome}!</h1><p>Acompanhe os pedidos e atualize cada etapa da preparação.</p></div>
          </div>
          <div className="role-stats">
            <div className="role-stat"><span>Pedidos recebidos</span><strong>{recebidos}</strong></div>
            <div className="role-stat"><span>Em preparação</span><strong>{emPreparo}</strong></div>
            <div className="role-stat"><span>Entregues</span><strong>{concluidos}</strong></div>
          </div>
          <h2 className="role-section-title">Pedidos do estabelecimento</h2>
          {pedidosDoRestaurante.length === 0 ? (
            <div className="role-empty">Nenhum pedido recebido ainda.<br/>Quando um cliente fizer um pedido neste estabelecimento, ele aparecerá aqui.</div>
          ) : (
            <div className="role-orders">
              {pedidosDoRestaurante.slice().reverse().map((pedido) => (
                <article className="role-card" key={pedido.id}>
                  <div className="role-card-head"><h3>Pedido #{pedido.id.toString().slice(-6)}</h3><span className="role-status">{pedido.status}</span></div>
                  <p className="role-muted">Cliente: <strong>{pedido.clienteNome}</strong><br/>Recebido em: {pedido.criadoEm}</p>
                  <div className="role-items">{pedido.itens.map((item) => <div key={item.produto.id}>{item.quantidade}x {item.produto.nome} — {formatarPreco(item.produto.preco * item.quantidade)}</div>)}</div>
                  <p className="role-muted">Total: <strong style={{color:'#b7ff35'}}>{formatarPreco(pedido.total)}</strong><br/>Pagamento: {pedido.formaPagamento}<br/>Entrega: {pedido.rua}, {pedido.numero} — {pedido.bairro}, {pedido.cidade}/{pedido.estado}</p>
                  <div className="role-actions">
                    {pedido.status === 'Recebido' && <><button className="role-primary" onClick={() => atualizarStatusPedido(pedido.id, 'Aceito')}>Aceitar pedido</button><button className="role-danger" onClick={() => atualizarStatusPedido(pedido.id, 'Recusado')}>Recusar</button></>}
                    {pedido.status === 'Aceito' && <button className="role-primary" onClick={() => atualizarStatusPedido(pedido.id, 'Preparando')}>Iniciar preparo</button>}
                    {pedido.status === 'Preparando' && <button className="role-primary" onClick={() => atualizarStatusPedido(pedido.id, 'Pronto para retirada')}>Pedido pronto</button>}
                    {pedido.status === 'Pronto para retirada' && <span className="role-muted">Aguardando um entregador aceitar a corrida.</span>}
                    {pedido.status === 'Em rota' && <span className="role-muted">Entregador: {pedido.entregadorNome || 'A caminho'}.</span>}
                    {pedido.status === 'Entregue' && <span className="role-muted">Entrega concluída.</span>}
                    {pedido.status === 'Recusado' && <span className="role-muted">Pedido recusado.</span>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    )
  }

  if (usuarioLogado?.tipo === 'Entregador') {
    return (
      <div className="app">
        <style>{estilosPainel}</style>
        <header className="role-topbar">
          <div className="role-brand">ENTREGAÊ <span style={{color:'#fff'}}>· CENTRAL DO ENTREGADOR</span></div>
          <div className="role-user"><span>{usuarioLogado.nome}</span><button className="role-logout" onClick={sairDaConta}>Sair</button></div>
        </header>
        <main className="role-dashboard">
          <div className="role-heading"><div><span className="role-eyebrow">ÁREA DO PARCEIRO</span><h1>Olá, {usuarioLogado.nome}!</h1><p>Encontre corridas, aceite entregas e acompanhe os destinos pelo mapa.</p></div></div>
          <div className="role-stats">
            <div className="role-stat"><span>Corridas disponíveis</span><strong>{corridasDisponiveis.length}</strong></div>
            <div className="role-stat"><span>Minhas entregas</span><strong>{minhasCorridas.length}</strong></div>
            <div className="role-stat"><span>Veículo</span><strong style={{fontSize:18}}>{usuariosDemo.find((u) => u.email === usuarioLogado.email)?.tipoVeiculo || '—'}</strong></div>
          </div>
          <div className="courier-layout">
            <section>
              <h2 className="role-section-title">Corridas disponíveis</h2>
              <div className="courier-list">
                {corridasDisponiveis.length === 0 ? <div className="role-empty">Nenhuma corrida disponível no momento.<br/>Quando um restaurante marcar um pedido como pronto, a corrida aparecerá aqui.</div> : corridasDisponiveis.map((pedido) => (
                  <article className="role-card" key={pedido.id}>
                    <div className="role-card-head"><h3>Corrida #{pedido.id.toString().slice(-6)}</h3><span className="role-status">Disponível</span></div>
                    <p className="role-muted">Retirada: <strong>{pedido.restauranteNome}</strong><br/>Entrega: {pedido.rua}, {pedido.numero} — {pedido.bairro}, {pedido.cidade}/{pedido.estado}<br/>Cliente: {pedido.clienteNome}</p>
                    <p style={{marginTop:12,color:'#b7ff35',fontWeight:800}}>{formatarPreco(pedido.total)}</p>
                    <div className="role-actions"><button className="role-secondary" onClick={() => setCorridaSelecionada(pedido.id)}>Ver mapa</button><button className="role-primary" onClick={() => aceitarCorrida(pedido.id)}>Aceitar corrida</button></div>
                  </article>
                ))}
              </div>
              <h2 className="role-section-title">Minhas corridas</h2>
              <div className="courier-list">
                {minhasCorridas.length === 0 ? <div className="role-empty">Você ainda não aceitou nenhuma corrida.</div> : minhasCorridas.map((pedido) => (
                  <article className="role-card" key={pedido.id}>
                    <div className="role-card-head"><h3>Pedido #{pedido.id.toString().slice(-6)}</h3><span className="role-status">Em rota</span></div>
                    <p className="role-muted">Retirada: {pedido.restauranteNome}<br/>Destino: {pedido.rua}, {pedido.numero} — {pedido.bairro}, {pedido.cidade}/{pedido.estado}</p>
                    <div className="role-actions"><button className="role-secondary" onClick={() => setCorridaSelecionada(pedido.id)}>Ver mapa</button><button className="role-primary" onClick={() => atualizarStatusPedido(pedido.id, 'Entregue')}>Confirmar entrega</button></div>
                  </article>
                ))}
              </div>
            </section>
            <section className="courier-map">
              <div className="courier-map-title">MAPA DA ENTREGA {corridaAtual ? `· PEDIDO #${corridaAtual.id.toString().slice(-6)}` : ''}</div>
              {corridaAtual ? <DeliveryMap rua={corridaAtual.rua} numero={corridaAtual.numero} bairro={corridaAtual.bairro} cidade={corridaAtual.cidade} estado={corridaAtual.estado} cep={corridaAtual.cep} /> : <div className="role-empty" style={{margin:18}}>Selecione uma corrida para visualizar o endereço de entrega no mapa.</div>}
            </section>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <style>{`
        .login-overlay {
          position: fixed;
          inset: 0;
          z-index: 3000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow-y: auto;
          background: rgba(0, 0, 0, 0.82);
          backdrop-filter: blur(12px);
        }

        .login-modal {
          position: relative;
          width: 100%;
          max-width: 560px;
          max-height: calc(100vh - 40px);
          overflow-y: auto;
          padding: 38px;
          border: 1px solid rgba(183, 255, 53, 0.2);
          border-radius: 22px;
          background: #191920;
          box-shadow: 0 25px 90px rgba(0, 0, 0, 0.55);
        }

        .login-close {
          position: absolute;
          top: 16px;
          right: 18px;
          width: 36px;
          height: 36px;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 10px;
          background: transparent;
          color: white;
          font-size: 25px;
          cursor: pointer;
        }

        .login-brand {
          margin-bottom: 28px;
          color: #b7ff35;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 3px;
        }

        .login-modal h2 {
          margin: 0 0 10px;
          color: #fff;
          font-size: 30px;
          font-weight: 800;
        }

        .login-description {
          margin: 0 0 26px;
          color: #a5a5ad;
          font-size: 14px;
          line-height: 1.6;
        }

        .login-role-title {
          display: block;
          margin-bottom: 12px;
          color: #ddd;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .login-roles {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 22px;
        }

        .login-role {
          padding: 13px 5px;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 10px;
          background: #222229;
          color: #aaa;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: .2s;
        }

        .login-role.active {
          border-color: #b7ff35;
          background: rgba(183,255,53,.1);
          color: #b7ff35;
        }

        .login-field {
          display: block;
          margin-bottom: 17px;
          color: #ddd;
          font-size: 13px;
          font-weight: 600;
        }

        .login-field input,
        .login-field select {
          display: block;
          width: 100%;
          box-sizing: border-box;
          margin-top: 8px;
          padding: 14px;
          border: 1px solid rgba(255,255,255,.13);
          border-radius: 10px;
          outline: none;
          background: #101014;
          color: white;
          font: inherit;
        }

        .login-field select {
          cursor: pointer;
        }

        .login-field input:focus,
        .login-field select:focus {
          border-color: #b7ff35;
          box-shadow: 0 0 0 2px rgba(183,255,53,.1);
        }

        .login-field input:disabled {
          opacity: .5;
          cursor: not-allowed;
        }

        .password-input-wrap {
          position: relative;
          margin-top: 8px;
        }

        .password-input-wrap input {
          width: 100%;
          box-sizing: border-box;
          margin: 0;
          padding: 14px 48px 14px 14px;
          border: 1px solid rgba(255,255,255,.13);
          border-radius: 10px;
          outline: none;
          background: #101014;
          color: white;
          font: inherit;
        }

        .password-input-wrap input:focus {
          border-color: #b7ff35;
          box-shadow: 0 0 0 2px rgba(183,255,53,.1);
        }

        .password-eye {
          position: absolute;
          top: 50%;
          right: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          transform: translateY(-50%);
          border: 0;
          background: transparent;
          color: #a5a5ad;
          cursor: pointer;
        }

        .password-eye:hover {
          color: #b7ff35;
        }

        .password-eye svg {
          width: 20px;
          height: 20px;
        }

        .login-submit {
          width: 100%;
          margin-top: 8px;
          padding: 15px;
          border: 0;
          border-radius: 10px;
          background: #b7ff35;
          color: #101014;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 1px;
          cursor: pointer;
          transition: .2s;
        }

        .login-submit:hover {
          transform: translateY(-2px);
          filter: brightness(1.08);
        }

        .login-error {
          margin: 0 0 12px;
          color: #ff7777;
          font-size: 13px;
          line-height: 1.5;
        }

        .login-demo-note {
          margin: 18px 0 0;
          color: #85858e;
          font-size: 11px;
          line-height: 1.5;
          text-align: center;
        }

        .login-switch {
          margin: 20px 0 0;
          color: #aaa;
          font-size: 13px;
          text-align: center;
        }

        .login-switch button {
          border: 0;
          background: transparent;
          color: #b7ff35;
          font: inherit;
          font-weight: 800;
          cursor: pointer;
        }

        .login-header-button {
          padding: 11px 17px;
          border: 1px solid #b7ff35;
          border-radius: 9px;
          background: transparent;
          color: #b7ff35;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: .2s;
        }

        .login-header-button:hover {
          background: #b7ff35;
          color: #101014;
        }

        .login-user-info {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #ddd;
          font-size: 12px;
        }

        .login-user-info strong {
          color: #b7ff35;
        }

        .login-logout-button {
          padding: 8px 10px;
          border: 1px solid rgba(255,255,255,.15);
          border-radius: 8px;
          background: transparent;
          color: #ddd;
          font-size: 11px;
          cursor: pointer;
        }

        .register-section {
          margin: 22px 0;
          padding: 18px;
          border: 1px solid rgba(183,255,53,.15);
          border-radius: 12px;
          background: rgba(255,255,255,.025);
        }

        .register-section-title {
          margin: 0 0 16px;
          color: #b7ff35;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .register-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0 14px;
        }

        .register-grid .login-field {
          min-width: 0;
        }

        .register-checkbox {
          display: flex;
          align-items: center;
          gap: 9px;
          margin: -5px 0 17px;
          color: #ccc;
          font-size: 12px;
          cursor: pointer;
        }

        .register-checkbox input {
          width: 16px;
          height: 16px;
          margin: 0;
          accent-color: #b7ff35;
        }

        .register-message {
          margin: 0 0 16px;
          padding: 12px;
          border-radius: 9px;
          background: rgba(183,255,53,.08);
          color: #b7ff35;
          font-size: 12px;
          line-height: 1.5;
        }

        .register-help {
          margin: -8px 0 16px;
          color: #92929b;
          font-size: 11px;
          line-height: 1.5;
        }

        @media (max-width: 760px) {
          .login-modal {
            padding: 30px 22px;
          }

          .login-user-info {
            flex-wrap: wrap;
            justify-content: flex-end;
          }

          .login-header-button {
            padding: 9px 12px;
          }

          .register-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

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

          {usuarioLogado ? (
            <div className="login-user-info">
              <span>
                Olá, <strong>{usuarioLogado.nome}</strong>
              </span>
              <button className="login-logout-button" onClick={sairDaConta}>
                Sair
              </button>
            </div>
          ) : (
            <button className="login-header-button" onClick={abrirLogin}>
              ENTRAR
            </button>
          )}

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

      {/* MODAL DE LOGIN E CADASTRO */}
      {loginAberto && (
        <div
          className="login-overlay"
          onClick={() => {
            setLoginAberto(false)
            setContinuarParaCheckout(false)
          }}
        >
          <div
            className="login-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-title"
          >
            <button
              className="login-close"
              onClick={() => {
                setLoginAberto(false)
                setContinuarParaCheckout(false)
              }}
              aria-label="Fechar acesso"
            >
              ×
            </button>

            <div className="login-brand">ENTREGAÊ / ACESSO</div>

            <h2 id="login-title">
              {modoAutenticacao === 'login' ? 'Bem-vindo!' : 'Criar minha conta'}
            </h2>

            <p className="login-description">
              {modoAutenticacao === 'login'
                ? 'Entre na sua conta para aproveitar sua experiência no Entregaê.'
                : 'Preencha seus dados para fazer parte do Entregaê.'}
            </p>

            <form
              onSubmit={modoAutenticacao === 'login' ? realizarLogin : realizarCadastro}
            >
              <span className="login-role-title">TIPO DE CONTA</span>

              <div className="login-roles">
                {(['Cliente', 'Restaurante', 'Entregador'] as TipoConta[]).map((tipo) => (
                  <button
                    key={tipo}
                    type="button"
                    className={`login-role ${tipoConta === tipo ? 'active' : ''}`}
                    onClick={() => {
                      setTipoConta(tipo)
                      setMensagemLogin('')
                    }}
                  >
                    {tipo}
                  </button>
                ))}
              </div>

              {modoAutenticacao === 'cadastro' && (
                <>
                  {/* CADASTRO DE CLIENTE */}
                  {tipoConta === 'Cliente' && (
                    <>
                      <label className="login-field" htmlFor="nomeCadastro">
                        Nome completo
                        <input
                          id="nomeCadastro"
                          type="text"
                          placeholder="Digite seu nome completo"
                          value={nomeCadastro}
                          onChange={(e) => setNomeCadastro(e.target.value)}
                          autoComplete="name"
                          required
                        />
                      </label>

                      <label className="login-field" htmlFor="telefoneCadastro">
                        Telefone
                        <input
                          id="telefoneCadastro"
                          type="tel"
                          placeholder="(11) 99999-9999"
                          value={telefoneCadastro}
                          onChange={(e) => setTelefoneCadastro(e.target.value)}
                          autoComplete="tel"
                          required
                        />
                      </label>
                    </>
                  )}

                  {/* CADASTRO DE RESTAURANTE */}
                  {tipoConta === 'Restaurante' && (
                    <div className="register-section">
                      <h3 className="register-section-title">
                        DADOS DO RESTAURANTE
                      </h3>

                      <label className="login-field" htmlFor="nomeRestaurante">
                        Nome do estabelecimento
                        <input
                          id="nomeRestaurante"
                          type="text"
                          placeholder="Ex.: Restaurante Sabor da Casa"
                          value={nomeRestaurante}
                          onChange={(e) => setNomeRestaurante(e.target.value)}
                          required
                        />
                      </label>

                      <label className="login-field" htmlFor="responsavelRestaurante">
                        Nome do responsável
                        <input
                          id="responsavelRestaurante"
                          type="text"
                          placeholder="Nome completo do responsável"
                          value={responsavelRestaurante}
                          onChange={(e) => setResponsavelRestaurante(e.target.value)}
                          required
                        />
                      </label>

                      <label className="login-field" htmlFor="cnpjRestaurante">
                        CNPJ
                        <input
                          id="cnpjRestaurante"
                          type="text"
                          inputMode="numeric"
                          placeholder="00.000.000/0000-00"
                          value={cnpjRestaurante}
                          onChange={(e) =>
                            setCnpjRestaurante(e.target.value.replace(/\D/g, '').slice(0, 14))
                          }
                          disabled={semCnpj}
                          required={!semCnpj}
                        />
                      </label>

                      <label className="register-checkbox">
                        <input
                          type="checkbox"
                          checked={semCnpj}
                          onChange={(e) => {
                            setSemCnpj(e.target.checked)
                            if (e.target.checked) setCnpjRestaurante('')
                          }}
                        />
                        Não tenho CNPJ
                      </label>

                      <label className="login-field" htmlFor="categoriaComida">
                        Tipo de comida
                        <select
                          id="categoriaComida"
                          value={categoriaComida}
                          onChange={(e) => setCategoriaComida(e.target.value)}
                          required
                        >
                          <option value="">Selecione uma categoria</option>
                          <option value="Hambúrguer">Hambúrguer</option>
                          <option value="Pizza">Pizza</option>
                          <option value="Japonesa">Comida japonesa</option>
                          <option value="Brasileira">Comida brasileira</option>
                          <option value="Lanches">Lanches</option>
                          <option value="Italiana">Comida italiana</option>
                          <option value="Mexicana">Comida mexicana</option>
                          <option value="Saudável">Comida saudável</option>
                          <option value="Sobremesas">Sobremesas</option>
                          <option value="Outros">Outros</option>
                        </select>
                      </label>

                      <h3 className="register-section-title">
                        ENDEREÇO DO ESTABELECIMENTO
                      </h3>

                      <label className="login-field" htmlFor="cepRestaurante">
                        CEP
                        <input
                          id="cepRestaurante"
                          type="text"
                          inputMode="numeric"
                          placeholder="00000-000"
                          value={cepRestaurante}
                          onChange={(e) => alterarCEPRestaurante(e.target.value)}
                          onBlur={() => consultarCEPRestaurante(cepRestaurante)}
                          maxLength={9}
                          required
                        />
                      </label>

                      {cepRestauranteCarregando && (
                        <p className="register-help">Consultando CEP...</p>
                      )}

                      {cepRestauranteErro && (
                        <p className="login-error">{cepRestauranteErro}</p>
                      )}

                      <label className="login-field" htmlFor="ruaRestaurante">
                        Rua / Avenida
                        <input
                          id="ruaRestaurante"
                          type="text"
                          placeholder="Rua do estabelecimento"
                          value={ruaRestaurante}
                          onChange={(e) => setRuaRestaurante(e.target.value)}
                          required
                        />
                      </label>

                      <div className="register-grid">
                        <label className="login-field" htmlFor="numeroRestaurante">
                          Número
                          <input
                            id="numeroRestaurante"
                            type="text"
                            placeholder="Número"
                            value={numeroRestaurante}
                            onChange={(e) => setNumeroRestaurante(e.target.value)}
                            required
                          />
                        </label>

                        <label className="login-field" htmlFor="complementoRestaurante">
                          Complemento
                          <input
                            id="complementoRestaurante"
                            type="text"
                            placeholder="Sala, loja..."
                            value={complementoRestaurante}
                            onChange={(e) => setComplementoRestaurante(e.target.value)}
                          />
                        </label>
                      </div>

                      <label className="login-field" htmlFor="bairroRestaurante">
                        Bairro
                        <input
                          id="bairroRestaurante"
                          type="text"
                          placeholder="Bairro"
                          value={bairroRestaurante}
                          onChange={(e) => setBairroRestaurante(e.target.value)}
                          required
                        />
                      </label>

                      <div className="register-grid">
                        <label className="login-field" htmlFor="cidadeRestaurante">
                          Cidade
                          <input
                            id="cidadeRestaurante"
                            type="text"
                            placeholder="Cidade"
                            value={cidadeRestaurante}
                            onChange={(e) => setCidadeRestaurante(e.target.value)}
                            required
                          />
                        </label>

                        <label className="login-field" htmlFor="estadoRestaurante">
                          Estado
                          <input
                            id="estadoRestaurante"
                            type="text"
                            placeholder="UF"
                            value={estadoRestaurante}
                            onChange={(e) => setEstadoRestaurante(e.target.value)}
                            maxLength={2}
                            required
                          />
                        </label>
                      </div>

                      <label className="login-field" htmlFor="telefoneCadastroRestaurante">
                        Telefone do restaurante
                        <input
                          id="telefoneCadastroRestaurante"
                          type="tel"
                          placeholder="(11) 99999-9999"
                          value={telefoneCadastro}
                          onChange={(e) => setTelefoneCadastro(e.target.value)}
                          required
                        />
                      </label>
                    </div>
                  )}

                  {/* CADASTRO DE ENTREGADOR */}
                  {tipoConta === 'Entregador' && (
                    <div className="register-section">
                      <h3 className="register-section-title">
                        DADOS PESSOAIS
                      </h3>

                      <label className="login-field" htmlFor="nomeEntregador">
                        Nome completo
                        <input
                          id="nomeEntregador"
                          type="text"
                          placeholder="Digite seu nome completo"
                          value={nomeCadastro}
                          onChange={(e) => setNomeCadastro(e.target.value)}
                          autoComplete="name"
                          required
                        />
                      </label>

                      <label className="login-field" htmlFor="cpfCadastro">
                        CPF
                        <input
                          id="cpfCadastro"
                          type="text"
                          inputMode="numeric"
                          placeholder="000.000.000-00"
                          value={cpfCadastro}
                          onChange={(e) =>
                            setCpfCadastro(e.target.value.replace(/\D/g, '').slice(0, 11))
                          }
                          required
                        />
                      </label>

                      <label className="login-field" htmlFor="telefoneCadastroEntregador">
                        Telefone
                        <input
                          id="telefoneCadastroEntregador"
                          type="tel"
                          placeholder="(11) 99999-9999"
                          value={telefoneCadastro}
                          onChange={(e) => setTelefoneCadastro(e.target.value)}
                          required
                        />
                      </label>

                      <h3 className="register-section-title">
                        DADOS DO VEÍCULO
                      </h3>

                      <label className="login-field" htmlFor="tipoVeiculo">
                        Tipo de veículo
                        <select
                          id="tipoVeiculo"
                          value={tipoVeiculo}
                          onChange={(e) => setTipoVeiculo(e.target.value)}
                          required
                        >
                          <option value="Moto">Moto</option>
                          <option value="Bicicleta">Bicicleta</option>
                          <option value="Carro">Carro</option>
                        </select>
                      </label>

                      <div className="register-grid">
                        <label className="login-field" htmlFor="marcaVeiculo">
                          Marca
                          <input
                            id="marcaVeiculo"
                            type="text"
                            placeholder="Ex.: Honda"
                            value={marcaVeiculo}
                            onChange={(e) => setMarcaVeiculo(e.target.value)}
                            required
                          />
                        </label>

                        <label className="login-field" htmlFor="modeloVeiculo">
                          Modelo
                          <input
                            id="modeloVeiculo"
                            type="text"
                            placeholder="Ex.: CG 160"
                            value={modeloVeiculo}
                            onChange={(e) => setModeloVeiculo(e.target.value)}
                            required
                          />
                        </label>
                      </div>

                      <div className="register-grid">
                        <label className="login-field" htmlFor="anoVeiculo">
                          Ano
                          <input
                            id="anoVeiculo"
                            type="number"
                            placeholder="Ex.: 2022"
                            min="1900"
                            max={new Date().getFullYear() + 1}
                            value={anoVeiculo}
                            onChange={(e) => setAnoVeiculo(e.target.value)}
                            required
                          />
                        </label>

                        <label className="login-field" htmlFor="corVeiculo">
                          Cor
                          <input
                            id="corVeiculo"
                            type="text"
                            placeholder="Ex.: Preto"
                            value={corVeiculo}
                            onChange={(e) => setCorVeiculo(e.target.value)}
                            required
                          />
                        </label>
                      </div>

                      {tipoVeiculo !== 'Bicicleta' ? (
                        <>
                          <h3 className="register-section-title">
                            DOCUMENTAÇÃO DO VEÍCULO
                          </h3>

                          <label className="login-field" htmlFor="placaVeiculo">
                            Placa
                            <input
                              id="placaVeiculo"
                              type="text"
                              placeholder="ABC1D23"
                              value={placaVeiculo}
                              onChange={(e) =>
                                setPlacaVeiculo(e.target.value.toUpperCase().slice(0, 7))
                              }
                              required
                            />
                          </label>

                          <label className="login-field" htmlFor="renavamVeiculo">
                            RENAVAM (opcional)
                            <input
                              id="renavamVeiculo"
                              type="text"
                              inputMode="numeric"
                              placeholder="Número do RENAVAM"
                              value={renavamVeiculo}
                              onChange={(e) =>
                                setRenavamVeiculo(e.target.value.replace(/\D/g, '').slice(0, 11))
                              }
                            />
                          </label>

                          <h3 className="register-section-title">
                            CARTEIRA NACIONAL DE HABILITAÇÃO
                          </h3>

                          <label className="login-field" htmlFor="numeroCnh">
                            Número da CNH
                            <input
                              id="numeroCnh"
                              type="text"
                              inputMode="numeric"
                              placeholder="Número da CNH"
                              value={numeroCnh}
                              onChange={(e) =>
                                setNumeroCnh(e.target.value.replace(/\D/g, '').slice(0, 11))
                              }
                              required
                            />
                          </label>

                          <div className="register-grid">
                            <label className="login-field" htmlFor="categoriaCnh">
                              Categoria da CNH
                              <select
                                id="categoriaCnh"
                                value={categoriaCnh}
                                onChange={(e) => setCategoriaCnh(e.target.value)}
                                required
                              >
                                <option value="">Selecione</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="AB">AB</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                                <option value="E">E</option>
                              </select>
                            </label>

                            <label className="login-field" htmlFor="validadeCnh">
                              Validade da CNH
                              <input
                                id="validadeCnh"
                                type="date"
                                value={validadeCnh}
                                onChange={(e) => setValidadeCnh(e.target.value)}
                                required
                              />
                            </label>
                          </div>
                        </>
                      ) : (
                        <p className="register-message">
                          Para entregadores que utilizam bicicleta, não é necessário
                          informar placa, RENAVAM ou CNH.
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}

              <label className="login-field" htmlFor="emailLogin">
                {modoAutenticacao === 'cadastro'
                  ? 'E-mail'
                  : tipoConta === 'Entregador'
                    ? 'E-mail ou CPF'
                    : tipoConta === 'Restaurante'
                      ? 'E-mail ou CNPJ'
                      : 'E-mail'}
                <input
                  id="emailLogin"
                  type={modoAutenticacao === 'cadastro' ? 'email' : 'text'}
                  placeholder={
                    modoAutenticacao === 'cadastro'
                      ? 'seuemail@exemplo.com'
                      : tipoConta === 'Entregador'
                        ? 'Digite seu e-mail ou CPF'
                        : tipoConta === 'Restaurante'
                          ? 'Digite seu e-mail ou CNPJ'
                          : 'Digite seu e-mail'
                  }
                  value={emailLogin}
                  onChange={(e) => setEmailLogin(e.target.value)}
                  autoComplete={modoAutenticacao === 'login' ? 'username' : 'email'}
                  required
                />
              </label>

              <label className="login-field" htmlFor="senhaLogin">
                Senha
                <div className="password-input-wrap">
                  <input
                    id="senhaLogin"
                    type={mostrarSenha ? 'text' : 'password'}
                    placeholder={modoAutenticacao === 'cadastro' ? 'Crie uma senha' : 'Digite sua senha'}
                    value={senhaLogin}
                    onChange={(e) => setSenhaLogin(e.target.value)}
                    autoComplete={modoAutenticacao === 'login' ? 'current-password' : 'new-password'}
                    minLength={modoAutenticacao === 'cadastro' ? 8 : undefined}
                    required
                  />

                  <button
                    className="password-eye"
                    type="button"
                    onClick={() => setMostrarSenha((atual) => !atual)}
                    aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                    title={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {mostrarSenha ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 3l18 18" />
                        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                        <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.1-2.2 3.1" />
                        <path d="M6.2 6.2C3.9 7.6 2.8 9.7 2.5 12c.6 1.5 3.8 7 9.5 7 1.2 0 2.3-.2 3.3-.7" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </label>

              {modoAutenticacao === 'cadastro' && (
                <label className="login-field" htmlFor="confirmarSenha">
                  Confirmar senha
                  <div className="password-input-wrap">
                    <input
                      id="confirmarSenha"
                      type={mostrarConfirmacao ? 'text' : 'password'}
                      placeholder="Digite a senha novamente"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      autoComplete="new-password"
                      minLength={8}
                      required
                    />

                    <button
                      className="password-eye"
                      type="button"
                      onClick={() => setMostrarConfirmacao((atual) => !atual)}
                      aria-label={mostrarConfirmacao ? 'Ocultar confirmação da senha' : 'Mostrar confirmação da senha'}
                      title={mostrarConfirmacao ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      {mostrarConfirmacao ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 3l18 18" />
                          <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                          <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.1-2.2 3.1" />
                          <path d="M6.2 6.2C3.9 7.6 2.8 9.7 2.5 12c.6 1.5 3.8 7 9.5 7 1.2 0 2.3-.2 3.3-.7" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </label>
              )}

              {mensagemLogin && (
                <p className="login-error" role="alert">
                  {mensagemLogin}
                </p>
              )}

              <button className="login-submit" type="submit">
                {modoAutenticacao === 'login'
                  ? 'ENTRAR NA MINHA CONTA →'
                  : 'CRIAR MINHA CONTA →'}
              </button>

              <p className="login-switch">
                {modoAutenticacao === 'login' ? (
                  <>
                    Ainda não possui conta?{' '}
                    <button type="button" onClick={() => trocarModoAutenticacao('cadastro')}>
                      Cadastre-se
                    </button>
                  </>
                ) : (
                  <>
                    Já possui cadastro?{' '}
                    <button type="button" onClick={() => trocarModoAutenticacao('login')}>
                      Fazer login
                    </button>
                  </>
                )}
              </p>

              <p className="login-demo-note">
                Cadastro demonstrativo: as contas ficam disponíveis somente enquanto
                esta página estiver aberta. A autenticação real será conectada ao banco
                de dados em uma próxima etapa.
              </p>
            </form>
          </div>
        </div>
      )}

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
                  onClick={abrirCheckout}
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