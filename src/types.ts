/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum RelationType {
  CASADO = "Casado(a)",
  UNIAO_ESTAVEL = "União Estável",
  NAMORO = "Namoro",
  NOIVADO = "Noivado",
  OUTRO = "Outro"
}

export enum CoupleSource {
  INDICACAO = "Indicação",
  HOSPEDAGEM = "Hospedagem",
  CAPTACAO_INTERNA = "Captação Interna",
  CAPTACAO_EXTERNA = "Captação Externa",
  REDES_SOCIAIS = "Redes Sociais",
  WHATSAPP = "WhatsApp",
  PARCEIRO = "Parceiro",
  EVENTO = "Evento",
  OUTRO = "Outro"
}

export enum LodgingPlace {
  LAGOA_QUENTE = "Lagoa Quente Hotel",
  LAGOA_ECO_TOWERS = "Lagoa Eco Towers",
  LAGOA_JARDINS = "Lagoa Jardins",
  DI_ROMA = "DiRoma",
  HOTEL_EXTERNO = "Hotel Externo",
  CASA_PROPRIA = "Casa Própria",
  CASA_FAMILIARES = "Casa de Familiares",
  OUTRO = "Outro"
}

export enum CaptationPlace {
  RECEPCAO = "Recepção",
  PARQUE = "Parque",
  HOTEL = "Hotel",
  WHATSAPP = "WhatsApp",
  INSTAGRAM = "Instagram",
  FACEBOOK = "Facebook",
  INDICACAO = "Indicação",
  ABORDAGEM_EXTERNA = "Abordagem Externa",
  OUTRO = "Outros"
}

export enum AttendanceStatus {
  CADASTRADO = "Cadastrado",
  EM_ATENDIMENTO = "Em atendimento",
  APRESENTACAO_REALIZADA = "Apresentação realizada",
  VENDA_LANCADA = "Venda lançada",
  CONTRATO_GERADO = "Contrato gerado",
  VENDA_CANCELADA = "Venda cancelada",
  NAO_CONVERTIDO = "Não convertido"
}

export enum NegotiationStatus {
  EM_NEGOCIACAO = "Em negociação",
  VENDA_REALIZADA = "Venda realizada",
  NAO_FECHOU = "Não fechou",
  REMARCAR = "Remarcar atendimento",
  SEM_PERFIL = "Cliente sem perfil",
  SEM_CREDITO = "Cliente sem crédito",
  DESISTENCIA = "Desistência",
  OUTRO = "Outro"
}

export enum PaymentMethod {
  A_VISTA = "À vista",
  CARTAO_DIRETO = "Cartão de crédito direto",
  CREDITO_RECORRENTE = "Crédito recorrente",
  BOLETO = "Boleto",
  ENTRADA_PARCELAS = "Entrada + parcelas",
  OUTRO = "Outro"
}

export enum SaleStatus {
  EM_PREENCHIMENTO = "Em preenchimento",
  VENDA_LANCADA = "Venda lançada",
  AGUARDANDO_PAGAMENTO = "Aguardando pagamento",
  ENTRADA_PAGA = "Entrada paga",
  CONTRATO_GERADO = "Contrato gerado",
  CONTRATO_ASSINADO = "Contrato assinado",
  CANCELADA = "Cancelada"
}

export enum UserRole {
  ADMIN = "Administrador",
  RECEPCAO = "Recepção",
  CORRETOR = "Corretor",
  GERENTE = "Gerente",
  FINANCEIRO = "Financeiro"
}

export interface Guest {
  name: string;
  age: string;
  birthDate: string;
  retired: boolean;
  profession: string;
  professionObservation: string;
  cpf: string;
  rg: string;
  nationality: string;
  civilStatus: string;
  schooling: string;
  company: string;
  role: string;
  individualIncome: string; // stored as string formatted (R$ 0,00) or raw numeric
}

export interface CoupleRelation {
  type: RelationType;
  timeYears: string;
  timeMonths: string;
  timeDays: string;
  childrenCount: string;
  childrenNamesAge: string;
  companionCount: string;
  companionNames: string;
  companionRelationship: string;
  familyObservations: string;
}

export interface Address {
  residenceType: string;
  hasPropertyInCity: boolean;
  cep: string;
  country: string;
  state: string;
  city: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  referencePoint: string;
}

export interface Contacts {
  phoneResDDD: string;
  phoneResNumber: string;
  phoneMobDDD: string;
  phoneMobNumber: string;
  phoneMob2DDD: string;
  phoneMob2Number: string;
  phoneComDDD: string;
  phoneComNumber: string;
  email: string;
  mainWhatsapp: string;
  bestTimeToContact: string;
}

export interface FinancialProfile {
  hasCreditCard: boolean;
  cardBrand: string;
  familyIncome: string;
  useCheque: boolean;
  activeFinancing: boolean;
  creditScore: string;
  financialObservations: string;
}

export interface Vehicles {
  vehicle1Brand: string;
  vehicle1Model: string;
  vehicle1Year: string;
  vehicle1Plate: string;
  vehicle2Brand: string;
  vehicle2Model: string;
  vehicle2Year: string;
  vehicle2Plate: string;
}

export interface CoupleInspection {
  description: string;
  heardOfVenture: boolean;
  commercialObservations: string;
  clientProfile: string;
  buyingPotential: string;
  restrictions: string;
}

export interface ReceptionRecord {
  id: string; // "REC-XXXX"
  createdAt: string; // date timestamp
  receptionTime: string; // HH:MM
  presentationDate: string; // DD/MM/AAAA
  source: CoupleSource;
  lodging: LodgingPlace;
  captationPlace: CaptationPlace;
  brokerName: string;
  sdrName: string;
  status: AttendanceStatus;
  observations: string;
  
  guest1: Guest;
  guest2: Guest;
  relation: CoupleRelation;
  address: Address;
  contacts: Contacts;
  financial: FinancialProfile;
  vehicles: Vehicles;
  inspection: CoupleInspection;
  
  history: Array<{
    date: string;
    user: string;
    description: string;
  }>;
}

export interface AtendimentoRecord {
  id: string; // "AT-XXXX"
  receptionId: string;
  brokerName: string;
  date: string;
  startTime: string;
  endTime: string;
  attended: boolean;
  presentationDone: boolean;
  presentedProduct: string;
  objections: string;
  clientInterest: string; // e.g. "Alto", "Médio", "Baixo"
  status: NegotiationStatus;
  observations: string;
}

export interface ProductPricePlan {
  paymentMethod: PaymentMethod;
  totalPrice: number;
  downPayment: number;
  installmentsCount: number;
  installmentValue: number;
}

export interface Product {
  id: string;
  name: string;
  basePrice: number;
  active: boolean;
  benefits: string[];
  plansByMethod: Partial<Record<PaymentMethod, ProductPricePlan>>;
}

export interface SalesRecord {
  id: string; // "VND-XXXX"
  date: string;
  receptionId: string;
  brokerName: string;
  productId: string;
  productName: string;
  titleType: string;
  peopleCount: string;
  paymentMethod: PaymentMethod;
  totalPrice: number;
  downPayment: number;
  installmentsCount: number;
  installmentValue: number;
  remainingBalance: number;
  firstDueDate: string;
  paymentStatus: string; // "Pendente", "Pago Parcial", "Pago"
  contractStatus: string; // "Aguardando", "Gerado", "Assinado"
  observations: string;
  documents: Array<{
    name: string;
    uploadedAt: string;
    size: string;
  }>;
}

export interface ContractTemplate {
  id: string;
  name: string;
  productId: string;
  fileName: string;
  placeholders: string[];
  content: string; // Simulation template markdown/text
}

export interface ContractRecord {
  id: string; // "CON-XXXX"
  saleId: string;
  receptionId: string;
  templateId: string;
  createdAt: string;
  buyerName: string;
  pdfUrl?: string;
  signedFile?: string;
  status: "Pendente" | "Assinado";
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  permissions?: Record<string, boolean>;
}
