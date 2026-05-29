import { createClient } from "@supabase/supabase-js";
import { 
  ReceptionRecord, 
  AtendimentoRecord, 
  SalesRecord, 
  ContractRecord, 
  Product, 
  SystemUser, 
  ContractTemplate 
} from "./types";

// Read Supabase credentials from import.meta.env
const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || "https://xxxxprajzwihteuugnwp.supabase.co";
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || "sb_publishable_3PJe2f1erbVe7MA0WM0Eww_HQov7l_Y";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SupabaseConfigStatus {
  url: string;
  isConfigured: boolean;
  isConnected: boolean;
  error?: string;
  tablesStatus: Record<string, boolean>;
}

// Check if we can safely talk to Supabase and see if tables are available
export async function checkSupabaseConnection(): Promise<SupabaseConfigStatus> {
  const status: SupabaseConfigStatus = {
    url: supabaseUrl,
    isConfigured: Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes("YOUR-") && !supabaseUrl.includes("some-")),
    isConnected: false,
    tablesStatus: {
      products: false,
      users: false,
      receptions: false,
      atendimentos: false,
      sales: false,
      contracts: false,
      templates: false,
    }
  };

  if (!status.isConfigured) {
    return status;
  }

  try {
    // Check tables one by one (using 1 limit to check existence without overhead)
    const tables = ["products", "users", "receptions", "atendimentos", "sales", "contracts", "templates"];
    let anyConnected = false;

    for (const table of tables) {
      const { error } = await supabase.from(table).select("id").limit(1);
      if (!error) {
        status.tablesStatus[table] = true;
        anyConnected = true;
      } else if (error.code === "PGRST116" || error.code === "PGRST204" || error.message.includes("does not exist") === false) {
        // Table exists but is empty or blocked by RLS
        status.tablesStatus[table] = true;
        anyConnected = true;
      }
    }

    status.isConnected = anyConnected;
  } catch (err: any) {
    status.error = err?.message || String(err);
    status.isConnected = false;
  }

  return status;
}

// SQL query helper to help user bootstrap tables in Supabase SQL editor
export const GENERATED_BOOTSTRAP_SQL = `-- LAGOA LOVERS • SCRIPT DE CRIAÇÃO DAS TABELAS SUPABASE
-- Execute este script no editor SQL do seu painel do Supabase (SQL Editor -> New Query)

-- 1. Tabela de PRODUTOS
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  base_price NUMERIC NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  benefits JSONB,
  plans_by_method JSONB
);

-- 2. Tabela de USUÁRIOS DO SISTEMA
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  role TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  permissions JSONB
);

-- 3. Tabela de RECEPÇÃO & CASAIS
CREATE TABLE IF NOT EXISTS public.receptions (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  reception_time TEXT,
  presentation_date TEXT,
  source TEXT,
  lodging TEXT,
  captation_place TEXT,
  broker_name TEXT,
  sdr_name TEXT,
  status TEXT,
  observations TEXT,
  guest1 JSONB,
  guest2 JSONB,
  relation JSONB,
  address JSONB,
  contacts JSONB,
  financial JSONB,
  vehicles JSONB,
  inspection JSONB,
  history JSONB
);

-- 4. Tabela de ATENDIMENTOS (CORRETORES)
CREATE TABLE IF NOT EXISTS public.atendimentos (
  id TEXT PRIMARY KEY,
  reception_id TEXT NOT NULL REFERENCES public.receptions(id) ON DELETE CASCADE,
  broker_name TEXT,
  date TEXT,
  start_time TEXT,
  end_time TEXT,
  attended BOOLEAN NOT NULL DEFAULT false,
  presentation_done BOOLEAN NOT NULL DEFAULT false,
  presented_product TEXT,
  objections TEXT,
  client_interest TEXT,
  status TEXT,
  observations TEXT
);

-- 5. Tabela de VENDAS REALIZADAS
CREATE TABLE IF NOT EXISTS public.sales (
  id TEXT PRIMARY KEY,
  date TEXT,
  reception_id TEXT NOT NULL REFERENCES public.receptions(id) ON DELETE CASCADE,
  broker_name TEXT,
  product_id TEXT NOT NULL REFERENCES public.products(id),
  product_name TEXT,
  title_type TEXT,
  people_count TEXT,
  payment_method TEXT,
  total_price NUMERIC,
  down_payment NUMERIC,
  installments_count INT,
  installment_value NUMERIC,
  remaining_balance NUMERIC,
  first_due_date TEXT,
  payment_status TEXT,
  contract_status TEXT,
  observations TEXT,
  documents JSONB
);

-- 6. Tabela de CONTRATOS EMITIDOS
CREATE TABLE IF NOT EXISTS public.contracts (
  id TEXT PRIMARY KEY,
  sale_id TEXT REFERENCES public.sales(id) ON DELETE CASCADE,
  reception_id TEXT REFERENCES public.receptions(id) ON DELETE SET NULL,
  template_id TEXT,
  created_at TEXT,
  buyer_name TEXT,
  pdf_url TEXT,
  signed_file TEXT,
  status TEXT NOT NULL DEFAULT 'Pendente'
);

-- 7. Tabela de MODELOS DE CONTRATOS (TEMPLATES)
CREATE TABLE IF NOT EXISTS public.templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  product_id TEXT,
  file_name TEXT,
  placeholders JSONB,
  content TEXT
);

-- Habilitar leitura pública ou desabilitar RLS para sincronização rápida de teste
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.receptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.atendimentos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates DISABLE ROW LEVEL SECURITY;
`;

// Direct push of local storage state to Supabase (Batch Upsert)
export async function exportLocalDataToSupabase(state: {
  receptions: ReceptionRecord[];
  atendimentos: AtendimentoRecord[];
  sales: SalesRecord[];
  contracts: ContractRecord[];
  products: Product[];
  users: SystemUser[];
  templates: ContractTemplate[];
}) {
  const results = {
    products: 0,
    users: 0,
    receptions: 0,
    atendimentos: 0,
    sales: 0,
    contracts: 0,
    templates: 0,
    errors: [] as string[]
  };

  // 1. Export Products
  if (state.products?.length) {
    const formattedProducts = state.products.map(p => ({
      id: p.id,
      name: p.name,
      base_price: p.basePrice,
      active: p.active,
      benefits: p.benefits,
      plans_by_method: p.plansByMethod
    }));
    const { error } = await supabase.from("products").upsert(formattedProducts);
    if (error) results.errors.push(`Erro products: ${error.message}`);
    else results.products = state.products.length;
  }

  // 2. Export Users
  if (state.users?.length) {
    const formattedUsers = state.users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      active: u.active,
      permissions: u.permissions
    }));
    const { error } = await supabase.from("users").upsert(formattedUsers);
    if (error) results.errors.push(`Erro users: ${error.message}`);
    else results.users = state.users.length;
  }

  // 3. Export Receptions
  if (state.receptions?.length) {
    const formattedReceptions = state.receptions.map(r => ({
      id: r.id,
      reception_time: r.receptionTime,
      presentation_date: r.presentationDate,
      source: r.source,
      lodging: r.lodging,
      captation_place: r.captationPlace,
      broker_name: r.brokerName,
      sdr_name: r.sdrName,
      status: r.status,
      observations: r.observations,
      guest1: r.guest1,
      guest2: r.guest2,
      relation: r.relation,
      address: r.address,
      contacts: r.contacts,
      financial: r.financial,
      vehicles: r.vehicles,
      inspection: r.inspection,
      history: r.history
    }));
    const { error } = await supabase.from("receptions").upsert(formattedReceptions);
    if (error) results.errors.push(`Erro receptions: ${error.message}`);
    else results.receptions = state.receptions.length;
  }

  // 4. Export Atendimentos
  if (state.atendimentos?.length) {
    const formattedAtendimentos = state.atendimentos.map(a => ({
      id: a.id,
      reception_id: a.receptionId,
      broker_name: a.brokerName,
      date: a.date,
      start_time: a.startTime,
      end_time: a.endTime,
      attended: a.attended,
      presentation_done: a.presentationDone,
      presented_product: a.presentedProduct,
      objections: a.objections,
      client_interest: a.clientInterest,
      status: a.status,
      observations: a.observations
    }));
    const { error } = await supabase.from("atendimentos").upsert(formattedAtendimentos);
    if (error) results.errors.push(`Erro atendimentos: ${error.message}`);
    else results.atendimentos = state.atendimentos.length;
  }

  // 5. Export Sales
  if (state.sales?.length) {
    const formattedSales = state.sales.map(s => ({
      id: s.id,
      date: s.date,
      reception_id: s.receptionId,
      broker_name: s.brokerName,
      product_id: s.productId,
      product_name: s.productName,
      title_type: s.titleType,
      people_count: s.peopleCount,
      payment_method: s.paymentMethod,
      total_price: s.totalPrice,
      down_payment: s.downPayment,
      installments_count: s.installmentsCount,
      installment_value: s.installmentValue,
      remaining_balance: s.remainingBalance,
      first_due_date: s.firstDueDate,
      payment_status: s.paymentStatus,
      contract_status: s.contractStatus,
      observations: s.observations,
      documents: s.documents
    }));
    const { error } = await supabase.from("sales").upsert(formattedSales);
    if (error) results.errors.push(`Erro sales: ${error.message}`);
    else results.sales = state.sales.length;
  }

  // 6. Export Contracts
  if (state.contracts?.length) {
    const formattedContracts = state.contracts.map(c => ({
      id: c.id,
      sale_id: c.saleId,
      reception_id: c.receptionId,
      template_id: c.templateId,
      created_at: c.createdAt,
      buyer_name: c.buyerName,
      pdf_url: c.pdfUrl,
      signed_file: c.signedFile,
      status: c.status
    }));
    const { error } = await supabase.from("contracts").upsert(formattedContracts);
    if (error) results.errors.push(`Erro contracts: ${error.message}`);
    else results.contracts = state.contracts.length;
  }

  // 7. Export Templates
  if (state.templates?.length) {
    const formattedTemplates = state.templates.map(t => ({
      id: t.id,
      name: t.name,
      product_id: t.productId,
      file_name: t.fileName,
      placeholders: t.placeholders,
      content: t.content
    }));
    const { error } = await supabase.from("templates").upsert(formattedTemplates);
    if (error) results.errors.push(`Erro templates: ${error.message}`);
    else results.templates = state.templates.length;
  }

  return results;
}

// Bulk Import from Supabase
export async function importDataFromSupabase() {
  const data = {
    receptions: [] as ReceptionRecord[],
    atendimentos: [] as AtendimentoRecord[],
    sales: [] as SalesRecord[],
    contracts: [] as ContractRecord[],
    products: [] as Product[],
    users: [] as SystemUser[],
    templates: [] as ContractTemplate[],
    errors: [] as string[]
  };

  // 1. Fetch Products
  const { data: dbProducts, error: errP } = await supabase.from("products").select("*");
  if (errP) {
    data.errors.push(`Products: ${errP.message}`);
  } else if (dbProducts) {
    data.products = dbProducts.map(p => ({
      id: p.id,
      name: p.name,
      basePrice: Number(p.base_price),
      active: Boolean(p.active),
      benefits: Array.isArray(p.benefits) ? p.benefits : [],
      plansByMethod: p.plans_by_method || {}
    }));
  }

  // 2. Fetch Users
  const { data: dbUsers, error: errU } = await supabase.from("users").select("*");
  if (errU) {
    data.errors.push(`Users: ${errU.message}`);
  } else if (dbUsers) {
    data.users = dbUsers as SystemUser[];
  }

  // 3. Fetch Receptions
  const { data: dbReceptions, error: errR } = await supabase.from("receptions").select("*");
  if (errR) {
    data.errors.push(`Receptions: ${errR.message}`);
  } else if (dbReceptions) {
    data.receptions = dbReceptions.map(r => ({
      id: r.id,
      createdAt: r.created_at || new Date().toISOString(),
      receptionTime: r.reception_time || "",
      presentationDate: r.presentation_date || "",
      source: r.source,
      lodging: r.lodging,
      captationPlace: r.captation_place,
      brokerName: r.broker_name || "",
      sdrName: r.sdr_name || "",
      status: r.status,
      observations: r.observations || "",
      guest1: r.guest1 || { name: "", age: "", birthDate: "", retired: false, profession: "", professionObservation: "", cpf: "", rg: "", nationality: "", civilStatus: "", schooling: "", company: "", role: "", individualIncome: "" },
      guest2: r.guest2 || { name: "", age: "", birthDate: "", retired: false, profession: "", professionObservation: "", cpf: "", rg: "", nationality: "", civilStatus: "", schooling: "", company: "", role: "", individualIncome: "" },
      relation: r.relation || { type: "Outro", timeYears: "", timeMonths: "", timeDays: "", childrenCount: "", childrenNamesAge: "", companionCount: "", companionNames: "", companionRelationship: "", familyObservations: "" },
      address: r.address || { residenceType: "", hasPropertyInCity: false, cep: "", country: "", state: "", city: "", street: "", number: "", complement: "", neighborhood: "", referencePoint: "" },
      contacts: r.contacts || { phoneResDDD: "", phoneResNumber: "", phoneMobDDD: "", phoneMobNumber: "", phoneMob2DDD: "", phoneMob2Number: "", phoneComDDD: "", phoneComNumber: "", email: "", mainWhatsapp: "", bestTimeToContact: "" },
      financial: r.financial || { hasCreditCard: false, cardBrand: "", familyIncome: "", useCheque: false, activeFinancing: false, creditScore: "", financialObservations: "" },
      vehicles: r.vehicles || { vehicle1Brand: "", vehicle1Model: "", vehicle1Year: "", vehicle1Plate: "", vehicle2Brand: "", vehicle2Model: "", vehicle2Year: "", vehicle2Plate: "" },
      inspection: r.inspection || { description: "", heardOfVenture: false, commercialObservations: "", clientProfile: "", buyingPotential: "", restrictions: "" },
      history: Array.isArray(r.history) ? r.history : []
    }));
  }

  // 4. Fetch Atendimentos
  const { data: dbAtendimentos, error: errA } = await supabase.from("atendimentos").select("*");
  if (errA) {
    data.errors.push(`Atendimentos: ${errA.message}`);
  } else if (dbAtendimentos) {
    data.atendimentos = dbAtendimentos.map(a => ({
      id: a.id,
      receptionId: a.reception_id,
      brokerName: a.broker_name || "",
      date: a.date || "",
      startTime: a.start_time || "",
      endTime: a.end_time || "",
      attended: Boolean(a.attended),
      presentationDone: Boolean(a.presentation_done),
      presentedProduct: a.presented_product || "",
      objections: a.objections || "",
      clientInterest: a.client_interest || "",
      status: a.status,
      observations: a.observations || ""
    }));
  }

  // 5. Fetch Sales
  const { data: dbSales, error: errS } = await supabase.from("sales").select("*");
  if (errS) {
    data.errors.push(`Sales: ${errS.message}`);
  } else if (dbSales) {
    data.sales = dbSales.map(s => ({
      id: s.id,
      date: s.date || "",
      receptionId: s.reception_id,
      brokerName: s.broker_name || "",
      productId: s.product_id,
      productName: s.product_name || "",
      titleType: s.title_type || "",
      peopleCount: s.people_count || "",
      paymentMethod: s.payment_method,
      totalPrice: Number(s.total_price),
      downPayment: Number(s.down_payment),
      installmentsCount: Number(s.installments_count),
      installmentValue: Number(s.installment_value),
      remainingBalance: Number(s.remaining_balance),
      firstDueDate: s.first_due_date || "",
      paymentStatus: s.payment_status || "Pendente",
      contractStatus: s.contract_status || "Aguardando",
      observations: s.observations || "",
      documents: Array.isArray(s.documents) ? s.documents : []
    }));
  }

  // 6. Fetch Contracts
  const { data: dbContracts, error: errC } = await supabase.from("contracts").select("*");
  if (errC) {
    data.errors.push(`Contracts: ${errC.message}`);
  } else if (dbContracts) {
    data.contracts = dbContracts.map(c => ({
      id: c.id,
      saleId: c.sale_id || "",
      receptionId: c.reception_id || "",
      templateId: c.template_id || "",
      createdAt: c.created_at || "",
      buyerName: c.buyer_name || "",
      pdfUrl: c.pdf_url || "#",
      signedFile: c.signed_file,
      status: c.status
    }));
  }

  // 7. Fetch Templates
  const { data: dbTemplates, error: errT } = await supabase.from("templates").select("*");
  if (errT) {
    data.errors.push(`Templates: ${errT.message}`);
  } else if (dbTemplates) {
    data.templates = dbTemplates as ContractTemplate[];
  }

  return data;
}

// Single item inserts for live updates if connection is active
export async function uploadSingleReception(r: ReceptionRecord) {
  const formatted = {
    id: r.id,
    reception_time: r.receptionTime,
    presentation_date: r.presentationDate,
    source: r.source,
    lodging: r.lodging,
    captation_place: r.captationPlace,
    broker_name: r.brokerName,
    sdr_name: r.sdrName,
    status: r.status,
    observations: r.observations,
    guest1: r.guest1,
    guest2: r.guest2,
    relation: r.relation,
    address: r.address,
    contacts: r.contacts,
    financial: r.financial,
    vehicles: r.vehicles,
    inspection: r.inspection,
    history: r.history
  };
  return supabase.from("receptions").upsert(formatted);
}

export async function uploadSingleAtendimento(a: AtendimentoRecord) {
  const formatted = {
    id: a.id,
    reception_id: a.receptionId,
    broker_name: a.brokerName,
    date: a.date,
    start_time: a.startTime,
    end_time: a.endTime,
    attended: a.attended,
    presentation_done: a.presentationDone,
    presented_product: a.presentedProduct,
    objections: a.objections,
    client_interest: a.clientInterest,
    status: a.status,
    observations: a.observations
  };
  return supabase.from("atendimentos").upsert(formatted);
}

export async function uploadSingleSale(s: SalesRecord) {
  const formatted = {
    id: s.id,
    date: s.date,
    reception_id: s.receptionId,
    broker_name: s.brokerName,
    product_id: s.productId,
    product_name: s.productName,
    title_type: s.titleType,
    people_count: s.peopleCount,
    payment_method: s.paymentMethod,
    total_price: s.totalPrice,
    down_payment: s.downPayment,
    installments_count: s.installmentsCount,
    installment_value: s.installmentValue,
    remaining_balance: s.remainingBalance,
    first_due_date: s.firstDueDate,
    payment_status: s.paymentStatus,
    contract_status: s.contractStatus,
    observations: s.observations,
    documents: s.documents
  };
  return supabase.from("sales").upsert(formatted);
}

export async function uploadSingleContract(c: ContractRecord) {
  const formatted = {
    id: c.id,
    sale_id: c.saleId,
    reception_id: c.receptionId,
    template_id: c.templateId,
    created_at: c.createdAt,
    buyer_name: c.buyerName,
    pdf_url: c.pdfUrl,
    signed_file: c.signedFile,
    status: c.status
  };
  return supabase.from("contracts").upsert(formatted);
}
