export const PACIENTES = [
  {
    id: 1,
    nome: 'Maria Silva',
    idade: 34,
    dataNascimento: '15/03/1992',
    plano: 'Convênio',
    contato: {
      telefone: '31981234567',
      email: 'maria.silva@email.com',
      indicadoPor: 'Dra. Beatriz Nunes',
      endereco: {
        cep: '30112-000',
        rua: 'Rua das Acácias',
        numero: '120',
        complemento: 'Sala 302',
        bairro: 'Centro',
      },
    },
  },
  {
    id: 2,
    nome: 'Ana Clara',
    idade: 41,
    dataNascimento: '10/02/1985',
    plano: 'Particular',
    contato: {
      telefone: '11988123344',
      email: 'ana.clara@email.com',
      indicadoPor: '',
      endereco: {
        cep: '01425-000',
        rua: 'Avenida Brasil',
        numero: '855',
        complemento: '',
        bairro: 'Jardim Paulista',
      },
    },
  },
  {
    id: 3,
    nome: 'Lucia Gomes',
    idade: 57,
    dataNascimento: '30/01/1969',
    plano: 'Convênio',
    contato: {
      telefone: '21995551010',
      email: 'lucia.gomes@email.com',
      indicadoPor: 'Rede Amigas',
      endereco: {
        cep: '20031-030',
        rua: 'Rua da Consolação',
        numero: '340',
        complemento: 'Apto 91',
        bairro: 'Bela Vista',
      },
    },
  },
  {
    id: 4,
    nome: 'Amanda Pires',
    idade: 7,
    dataNascimento: '11/03/2019',
    plano: 'Convênio',
    contato: {
      telefone: '41996742210',
      email: 'responsavel.amanda@email.com',
      indicadoPor: 'Dra. Helena Prado',
      endereco: {
        cep: '80420-000',
        rua: 'Rua das Palmeiras',
        numero: '45',
        complemento: '',
        bairro: 'Batel',
      },
    },
  },
  {
    id: 5,
    nome: 'Carolina Nogueira',
    idade: 26,
    dataNascimento: '25/07/2000',
    plano: 'Particular',
    contato: {
      telefone: '11933445566',
      email: 'carolina.nogueira@email.com',
      indicadoPor: '',
      endereco: {
        cep: '04101-000',
        rua: 'Rua Vergueiro',
        numero: '2100',
        complemento: 'Conj. 12',
        bairro: 'Vila Mariana',
      },
    },
  },
  {
    id: 6,
    nome: 'João Pedro Martins',
    idade: 19,
    dataNascimento: '14/02/2007',
    plano: 'Particular',
    contato: {
      telefone: '11922334455',
      email: 'joao.martins@email.com',
      indicadoPor: 'Amigo da família',
      endereco: {
        cep: '05435-000',
        rua: 'Rua Harmonia',
        numero: '77',
        complemento: '',
        bairro: 'Pinheiros',
      },
    },
  },
];

export const PLANOS = [
  'Particular',
  'Convênio',
  'Unimed',
  'Amil',
  'SulAmérica',
  'Bradesco Saúde',
  'Outro',
];

export const buscarPaciente = (id) =>
  PACIENTES.find((paciente) => String(paciente.id) === String(id)) ?? null;

export const buscarPacientePorNome = (nome) =>
  PACIENTES.find((paciente) => paciente.nome === nome) ?? null;

export const nomeDoPaciente = (id) => buscarPaciente(id)?.nome ?? '';
