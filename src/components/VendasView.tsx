/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { 
  SalesRecord, 
  ReceptionRecord, 
  Product, 
  PaymentMethod, 
  SaleStatus, 
  SystemUser, 
  UserRole,
  RelationType,
  CoupleSource,
  LodgingPlace,
  CaptationPlace,
  AttendanceStatus
} from "../types";
import { Plus, Search, FileText, CheckCircle, UploadCloud, AlertCircle, ShoppingBag, DollarSign, Calendar, Eye, Trash2, ShieldAlert, FileCheck } from "lucide-react";

interface VendasViewProps {
  sales: SalesRecord[];
  receptions: ReceptionRecord[];
  products: Product[];
  onSaveSale: (sale: SalesRecord) => void;
  onSaveReception: (record: ReceptionRecord) => void;
  onGenerateContract: (receptionId: string) => void;
  currentUser: SystemUser;
  brokers: string[];
  preSelectedReceptionId?: string | null;
  onClearPreSelected?: () => void;
  onDeleteSale?: (id: string) => void;
}

export default function VendasView({
  sales,
  receptions,
  products,
  onSaveSale,
  onSaveReception,
  onGenerateContract,
  currentUser,
  brokers,
  preSelectedReceptionId,
  onClearPreSelected,
  onDeleteSale
}: VendasViewProps) {
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingSale, setEditingSale] = useState<Partial<SalesRecord> | null>(null);

  // States for fast new couple injection
  const [createBrokerOnFly, setCreateBrokerOnFly] = useState(false);
  const [flyName, setFlyName] = useState("");
  const [flyCpf, setFlyCpf] = useState("");
  const [flyPhone, setFlyPhone] = useState("");
  const [flyEmail, setFlyEmail] = useState("");

  // Simulated upload state
  const [uploadFileName, setUploadFileName] = useState("");

  // Selected filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Filter sales
  const filteredSales = useMemo(() => {
    return sales.filter(s => {
      const client = receptions.find(r => r.id === s.receptionId);
      const nameMatch = client ? client.guest1.name.toLowerCase().includes(searchQuery.toLowerCase()) : false;
      const idMatch = s.id.toLowerCase().includes(searchQuery.toLowerCase()) || s.receptionId.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (searchQuery && !nameMatch && !idMatch) return false;
      if (statusFilter && s.paymentStatus !== statusFilter) return false;
      return true;
    });
  }, [sales, receptions, searchQuery, statusFilter]);

  // Load preset client if coming from Recepcao sending trigger
  useEffect(() => {
    if (preSelectedReceptionId) {
      handleLaunchNewSale(preSelectedReceptionId);
      if (onClearPreSelected) onClearPreSelected();
    }
  }, [preSelectedReceptionId]);

  const handleLaunchNewSale = (clientId: string) => {
    const today = new Date().toISOString().split("T")[0];
    const client = receptions.find(r => r.id === clientId);

    const defaultProduct = products[0];
    const defaultPlan = defaultProduct.plansByMethod[PaymentMethod.ENTRADA_PARCELAS] || {
      paymentMethod: PaymentMethod.ENTRADA_PARCELAS,
      totalPrice: defaultProduct.basePrice,
      downPayment: 1371.84,
      installmentsCount: 30,
      installmentValue: 274.27
    };

    setEditingSale({
      id: `VND-${Math.floor(4000 + Math.random() * 5999)}`,
      date: today,
      receptionId: clientId,
      brokerName: client?.brokerName || currentUser.name || "Marcos Oliveira",
      productId: defaultProduct.id,
      productName: defaultProduct.name,
      titleType: "Familiar Vitalício",
      peopleCount: "4",
      paymentMethod: PaymentMethod.ENTRADA_PARCELAS,
      totalPrice: defaultPlan.totalPrice,
      downPayment: defaultPlan.downPayment,
      installmentsCount: defaultPlan.installmentsCount,
      installmentValue: defaultPlan.installmentValue,
      remainingBalance: defaultPlan.totalPrice - defaultPlan.downPayment,
      firstDueDate: "2026-06-25",
      paymentStatus: "Aguardando",
      contractStatus: "Aguardando",
      observations: "",
      documents: []
    });
    setIsCreating(true);
  };

  const handleProductChange = (prodId: string, currentSale: Partial<SalesRecord>) => {
    const prod = products.find(p => p.id === prodId);
    if (!prod) return;

    // Prefill with custom plans
    const method = currentSale.paymentMethod || PaymentMethod.A_VISTA;
    const plan = prod.plansByMethod[method] || Object.values(prod.plansByMethod)[0];

    if (plan) {
      setEditingSale({
        ...currentSale,
        productId: prod.id,
        productName: prod.name,
        totalPrice: plan.totalPrice,
        downPayment: plan.downPayment,
        installmentsCount: plan.installmentsCount,
        installmentValue: plan.installmentValue,
        remainingBalance: plan.totalPrice - plan.downPayment
      });
    } else {
      setEditingSale({
        ...currentSale,
        productId: prod.id,
        productName: prod.name,
        totalPrice: prod.basePrice,
        downPayment: 0,
        installmentsCount: 1,
        installmentValue: 0,
        remainingBalance: prod.basePrice
      });
    }
  };

  const handlePaymentMethodChange = (method: PaymentMethod, currentSale: Partial<SalesRecord>) => {
    const prod = products.find(p => p.id === currentSale.productId);
    if (!prod) return;

    const plan = prod.plansByMethod[method] || prod.plansByMethod[PaymentMethod.A_VISTA] || {
      paymentMethod: method,
      totalPrice: prod.basePrice,
      downPayment: 0,
      installmentsCount: 1,
      installmentValue: 0
    };

    setEditingSale({
      ...currentSale,
      paymentMethod: method,
      totalPrice: plan.totalPrice,
      downPayment: plan.downPayment,
      installmentsCount: plan.installmentsCount,
      installmentValue: plan.installmentValue,
      remainingBalance: plan.totalPrice - plan.downPayment
    });
  };

  // Flying client creator
  const triggerCreateFastClient = () => {
    if (!flyName || !flyCpf || !flyPhone) {
      alert("Por favor, preencha nome, CPF e telefone para criar o cadastro rápido.");
      return;
    }

    const newId = `REC-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().split("T")[0];
    const HH = String(new Date().getHours()).padStart(2, "0");
    const MM = String(new Date().getMinutes()).padStart(2, "0");

    const newReception: ReceptionRecord = {
      id: newId,
      createdAt: new Date().toISOString(),
      receptionTime: `${HH}:${MM}`,
      presentationDate: today,
      source: CoupleSource.CAPTACAO_INTERNA,
      lodging: LodgingPlace.CASA_PROPRIA,
      captationPlace: CaptationPlace.RECEPCAO,
      brokerName: currentUser.name || "Marcos Oliveira",
      sdrName: "Cadastro Rápido",
      status: AttendanceStatus.CADASTRADO,
      observations: "Cadastro rápido inserido diretamente pelo módulo de vendas.",
      guest1: {
        name: flyName,
        age: "25",
        birthDate: "01/01/1990",
        retired: false,
        profession: "Empresário",
        professionObservation: "",
        cpf: flyCpf,
        rg: "",
        nationality: "Brasileiro",
        civilStatus: "Solteiro(a)",
        schooling: "Superior Completo",
        company: "",
        role: "",
        individualIncome: ""
      },
      guest2: {
        name: "", age: "", birthDate: "", retired: false,
        profession: "", professionObservation: "", cpf: "", rg: "",
        nationality: "", civilStatus: "", schooling: "", company: "", role: "", individualIncome: ""
      },
      relation: {
        type: RelationType.OUTRO,
        timeYears: "0", timeMonths: "0", timeDays: "0",
        childrenCount: "0", childrenNamesAge: "",
        companionCount: "0", companionNames: "", companionRelationship: "", familyObservations: ""
      },
      address: {
        residenceType: "Própria", hasPropertyInCity: false, cep: "", country: "Brasil",
        state: "", city: "", street: "", number: "", complement: "", neighborhood: "", referencePoint: ""
      },
      contacts: {
        phoneResDDD: "", phoneResNumber: "", phoneMobDDD: "62", phoneMobNumber: flyPhone,
        phoneMob2DDD: "", phoneMob2Number: "", phoneComDDD: "", phoneComNumber: "",
        email: flyEmail, mainWhatsapp: flyPhone, bestTimeToContact: "Qualquer hora"
      },
      financial: {
        hasCreditCard: false, cardBrand: "", familyIncome: "", useCheque: false,
        activeFinancing: false, creditScore: "", financialObservations: ""
      },
      vehicles: {
        vehicle1Brand: "", vehicle1Model: "", vehicle1Year: "", vehicle1Plate: "",
        vehicle2Brand: "", vehicle2Model: "", vehicle2Year: "", vehicle2Plate: ""
      },
      inspection: {
        description: "Injetado via Vendas", heardOfVenture: false, commercialObservations: "",
        clientProfile: "", buyingPotential: "Médio", restrictions: ""
      },
      history: []
    };

    onSaveReception(newReception);
    
    // Clear flying state and initialize sale directly with this client!
    setCreateBrokerOnFly(false);
    setFlyName("");
    setFlyCpf("");
    setFlyPhone("");
    setFlyEmail("");

    // Initiate sale creation for this newly generated client
    handleLaunchNewSale(newId);
  };

  const handleSimulateAttachment = () => {
    if (!uploadFileName) return;
    const fileObj = {
      name: uploadFileName,
      uploadedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`
    };

    setEditingSale(prev => ({
      ...prev,
      documents: [...(prev?.documents || []), fileObj]
    }));
    setUploadFileName("");
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSale) {
      onSaveSale(editingSale as SalesRecord);
      setIsCreating(false);
      setEditingSale(null);
    }
  };

  const triggerContractGeneration = (recId: string) => {
    onGenerateContract(recId);
  };

  return (
    <div className="space-y-6">
      
      {/* Header controls list */}
      {!isCreating && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Lançamento de Vendas</h1>
            <p className="text-sm text-slate-500">Registre propostas, defina planos de parcelamento e gerencie anuidades</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCreateBrokerOnFly(true)}
              className="flex items-center gap-1 border border-sky-200 text-sky-700 bg-sky-50 font-bold text-xs px-3.5 py-2 rounded-lg"
            >
              🪄 Nova Ficha + Venda Direta
            </button>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleLaunchNewSale(e.target.value);
                  e.target.value = "";
                }
              }}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm outline-none cursor-pointer"
            >
              <option value="" className="text-slate-800 font-semibold bg-white text-xs">🚀 Lançar para Casal Existente</option>
              {receptions.map(r => (
                <option key={r.id} value={r.id} className="text-slate-800 bg-white text-xs">
                  {r.guest1?.name} ({r.id})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Fly-in Fast Client Form */}
      {createBrokerOnFly && (
        <div className="bg-sky-50 border border-sky-100 p-5 rounded-xl space-y-4 shadow-sm animate-in fade-in duration-150">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-sky-800 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4" /> Cadastro de Casal em Tempo Real (Venda Direta)
            </h3>
            <button onClick={() => setCreateBrokerOnFly(false)} className="text-slate-400 hover:text-slate-600">
              ✖
            </button>
          </div>
          <p className="text-xs text-sky-700">Insira as informações básicas para cadastrar e iniciar a venda num só clique.</p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="flex flex-col">
              <label className="text-slate-600 font-bold mb-1">Nome do Titular</label>
              <input
                required
                type="text"
                placeholder="Ex Nome Completo"
                value={flyName}
                onChange={(e) => setFlyName(e.target.value)}
                className="p-2 border border-sky-100 outline-none rounded-lg bg-white focus:border-sky-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-slate-600 font-bold mb-1">CPF</label>
              <input
                required
                type="text"
                placeholder="000.000.000-00"
                value={flyCpf}
                onChange={(e) => setFlyCpf(e.target.value)}
                className="p-2 border border-sky-100 outline-none rounded-lg bg-white focus:border-sky-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-slate-600 font-bold mb-1">Telefone Celular</label>
              <input
                required
                type="text"
                placeholder="99999-9999"
                value={flyPhone}
                onChange={(e) => setFlyPhone(e.target.value)}
                className="p-2 border border-sky-100 outline-none rounded-lg bg-white focus:border-sky-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-slate-600 font-bold mb-1">E-mail</label>
              <input
                type="email"
                placeholder="nome@email.com"
                value={flyEmail}
                onChange={(e) => setFlyEmail(e.target.value)}
                className="p-2 border border-sky-100 outline-none rounded-lg bg-white focus:border-sky-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setCreateBrokerOnFly(false)}
              className="text-xs px-3.5 py-1.5 border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              onClick={triggerCreateFastClient}
              className="text-xs px-4 py-1.5 bg-sky-700 hover:bg-sky-850 font-bold text-white rounded-lg block"
            >
              Criar Ficha & Associar Venda
            </button>
          </div>
        </div>
      )}

      {isCreating ? (
        /* Edit or create form */
        <form onSubmit={handleSaveForm} className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold uppercase rounded px-2.5 py-1 tracking-wider font-mono">
                {editingSale.id}
              </span>
              <h2 className="text-base font-bold text-slate-800 mt-1">Lançamento de Dados da Venda</h2>
            </div>
            
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingSale(null);
              }}
              className="text-slate-400 font-bold text-xs py-1.5 px-3 border border-slate-200 hover:bg-slate-50 rounded-lg"
            >
              Voltar à Listagem
            </button>
          </div>

          {/* Form blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700">
            {/* Vínculo Client */}
            <div className="flex flex-col bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-200/80">
              <label className="font-bold text-slate-800 flex items-center gap-1 mb-2">
                <Plus className="h-3.5 w-3.5 text-sky-500" /> Casal Associado à Venda
              </label>
              <select
                disabled
                value={editingSale.receptionId}
                className="p-2 border border-slate-200 bg-slate-100 text-slate-500 outline-none rounded-lg"
              >
                {receptions.map(r => (
                  <option key={r.id} value={r.id}>{r.guest1?.name} ({r.id})</option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 mt-2 font-medium">As informações cadastrais do casal alimentarão automaticamente o contrato gerado.</p>
            </div>

            {/* Corretor e Data */}
            <div className="space-y-3">
              <div className="flex flex-col">
                <label className="font-bold mb-1">Corretor Comissionado</label>
                <select
                  value={editingSale.brokerName}
                  onChange={(e) => setEditingSale({ ...editingSale, brokerName: e.target.value })}
                  className="p-2 border border-slate-200 bg-white outline-none rounded-lg"
                >
                  {brokers.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="font-bold mb-1">Data do Lançamento</label>
                <input
                  required
                  type="date"
                  value={editingSale.date}
                  onChange={(e) => setEditingSale({ ...editingSale, date: e.target.value })}
                  className="p-2 border border-slate-200 outline-none rounded-lg"
                />
              </div>
            </div>

            {/* Produto e Tipo do Título */}
            <div className="space-y-3">
              <div className="flex flex-col">
                <label className="font-bold mb-1">Selecione o Produto Vendido</label>
                <select
                  value={editingSale.productId}
                  onChange={(e) => handleProductChange(e.target.value, editingSale)}
                  className="p-2 border border-slate-200 bg-white outline-none rounded-lg"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col col-span-2">
                <label className="font-bold mb-1 text-slate-700 flex items-center gap-1">
                  <span>📌</span> Do que se trata o Lançamento? (Descrição da transação)
                </label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Valor total do produto, valor da entrada e saldo"
                  value={editingSale.titleType}
                  onChange={(e) => setEditingSale({ ...editingSale, titleType: e.target.value })}
                  className="p-2 border border-slate-200 outline-none rounded-lg bg-white font-medium text-slate-700"
                />
              </div>
            </div>

            {/* Financial Plan Matrix (Dúvidas/Modificações) */}
            <div className="md:col-span-3 bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-emerald-600" /> Detalhes do Plano Financeiro & Forma de Pagamento
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                {/* Method */}
                <div className="flex flex-col">
                  <label className="font-bold mb-1 text-slate-600">Forma de Pagamento</label>
                  <select
                    value={editingSale.paymentMethod}
                    onChange={(e) => handlePaymentMethodChange(e.target.value as PaymentMethod, editingSale)}
                    className="p-2 border border-slate-200 bg-white outline-none rounded-lg"
                  >
                    {Object.values(PaymentMethod).map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* Total price */}
                <div className="flex flex-col">
                  <label className="font-bold mb-1 text-slate-600">Valor Total do Plano (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingSale.totalPrice}
                    onChange={(e) => {
                      const total = parseFloat(e.target.value) || 0;
                      const remain = total - (editingSale.downPayment || 0);
                      const instCount = editingSale.installmentsCount || 1;
                      setEditingSale({ 
                        ...editingSale, 
                        totalPrice: total,
                        remainingBalance: remain,
                        installmentValue: instCount > 0 ? parseFloat((remain / instCount).toFixed(2)) : 0
                      });
                    }}
                    className="p-2 border border-slate-200 outline-none rounded-lg font-semibold text-slate-800"
                  />
                </div>

                {/* DownPayment */}
                <div className="flex flex-col">
                  <label className="font-bold mb-1 text-slate-600">Valor de Entrada / Sinal (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingSale.downPayment}
                    onChange={(e) => {
                      const down = parseFloat(e.target.value) || 0;
                      const remain = (editingSale.totalPrice || 0) - down;
                      const instCount = editingSale.installmentsCount || 1;
                      setEditingSale({ 
                        ...editingSale, 
                        downPayment: down,
                        remainingBalance: remain,
                        installmentValue: instCount > 0 ? parseFloat((remain / instCount).toFixed(2)) : 0
                      });
                    }}
                    className="p-2 border border-slate-200 outline-none rounded-lg text-emerald-600 font-bold"
                  />
                </div>

                {/* Balance Remaining */}
                <div className="flex flex-col">
                  <label className="font-semibold mb-1 text-slate-600">Saldo Restante (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingSale.remainingBalance}
                    onChange={(e) => {
                      const remain = parseFloat(e.target.value) || 0;
                      const total = (editingSale.downPayment || 0) + remain;
                      const instCount = editingSale.installmentsCount || 1;
                      setEditingSale({ 
                        ...editingSale, 
                        remainingBalance: remain,
                        totalPrice: total,
                        installmentValue: instCount > 0 ? parseFloat((remain / instCount).toFixed(2)) : 0
                      });
                    }}
                    className="p-2 border border-slate-200 bg-white text-indigo-700 font-bold outline-none rounded-lg"
                  />
                </div>

                {/* installments */}
                <div className="flex flex-col">
                  <label className="font-bold mb-1 text-slate-600">Quantidade de Parcelas</label>
                  <input
                    type="number"
                    value={editingSale.installmentsCount}
                    onChange={(e) => {
                      const instCount = parseInt(e.target.value) || 1;
                      const instVal = instCount > 0 ? parseFloat(((editingSale.remainingBalance || 0) / instCount).toFixed(2)) : 0;
                      setEditingSale({ 
                        ...editingSale, 
                        installmentsCount: instCount,
                        installmentValue: instVal
                      });
                    }}
                    className="p-2 border border-slate-200 outline-none rounded-lg"
                  />
                </div>

                {/* installment Value */}
                <div className="flex flex-col">
                  <label className="font-bold mb-1 text-slate-600">Valor da Parcela (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingSale.installmentValue}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setEditingSale({ ...editingSale, installmentValue: val });
                    }}
                    className="p-2 border border-slate-200 outline-none rounded-lg font-semibold"
                  />
                </div>

                {/* First Due date */}
                <div className="flex flex-col col-span-2">
                  <label className="font-bold mb-1 text-slate-600">Data do Primeiro Vencimento</label>
                  <input
                    type="date"
                    value={editingSale.firstDueDate}
                    onChange={(e) => setEditingSale({ ...editingSale, firstDueDate: e.target.value })}
                    className="p-2 border border-slate-200 outline-none rounded-lg"
                  />
                </div>

                {/* Payment & Contract Statuses */}
                <div className="flex flex-col">
                  <label className="font-bold mb-1 text-slate-600">Status do Recebimento</label>
                  <select
                    value={editingSale.paymentStatus}
                    onChange={(e) => setEditingSale({ ...editingSale, paymentStatus: e.target.value })}
                    className="p-2 border border-slate-200 bg-white outline-none rounded-lg"
                  >
                    <option value="Aguardando">Aguardando Pagamento</option>
                    <option value="Entrada Paid">Entrada Paga (Sinalizado)</option>
                    <option value="Quitado">Totalmente Pago (Quitado)</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="font-bold mb-1 text-slate-600">Status do Contrato</label>
                  <select
                    value={editingSale.contractStatus}
                    onChange={(e) => setEditingSale({ ...editingSale, contractStatus: e.target.value })}
                    className="p-2 border border-slate-200 bg-white outline-none rounded-lg"
                  >
                    <option value="Aguardando">Aguardando Emissão</option>
                    <option value="Contrato Gerado">Contrato Gerado</option>
                    <option value="Contrato Assinado">Contrato Assinado</option>
                  </select>
                </div>

                <div className="flex flex-col col-span-2">
                  <label className="font-bold mb-1 text-slate-600">Limite Lotação Título (Qtd Pessoas)</label>
                  <input
                    type="number"
                    placeholder="Ex: 4 pessoas"
                    value={editingSale.peopleCount}
                    onChange={(e) => setEditingSale({ ...editingSale, peopleCount: e.target.value })}
                    className="p-2 border border-slate-200 outline-none rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Document attachments simulation box */}
            <div className="md:col-span-3 bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-1">
                <UploadCloud className="h-4 w-4 text-sky-500" /> Anexação de Documentos do Titular (RG, CPF, Residência)
              </h3>
              
              <div className="flex flex-col sm:flex-row gap-3 items-end mb-4">
                <div className="flex-1 flex flex-col text-xs">
                  <label className="mb-1 text-slate-500">Nome do Arquivo a Anexar (Simulado)</label>
                  <input
                    type="text"
                    placeholder="Ex: comprovante_renda_titular.pdf"
                    value={uploadFileName}
                    onChange={(e) => setUploadFileName(e.target.value)}
                    className="p-2 border border-slate-200 bg-white outline-none rounded-lg w-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSimulateAttachment}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 font-bold text-white rounded-lg text-xs"
                >
                  Simular Anexo / Upload
                </button>
              </div>

              {/* List of attachments inside writing state */}
              {editingSale.documents && editingSale.documents.length > 0 ? (
                <div className="space-y-2">
                  {editingSale.documents.map((doc, i) => (
                    <div key={i} className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-100 text-xs">
                      <span className="font-medium text-slate-700">📄 {doc.name} ({doc.size})</span>
                      <span className="text-[10px] text-slate-400">Anexado em {doc.uploadedAt}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 italic">Nenhum documento anexado a esta venda ainda.</p>
              )}
            </div>

            {/* Observations */}
            <div className="md:col-span-3 flex flex-col">
              <label className="font-bold mb-1">Anotações da Proposta de Venda / Descontos Concedidos</label>
              <textarea
                rows={3}
                placeholder="Insira regalias adicionais orçamentárias..."
                value={editingSale.observations}
                onChange={(e) => setEditingSale({ ...editingSale, observations: e.target.value })}
                className="p-3 border border-slate-200 outline-none rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => triggerContractGeneration(editingSale.receptionId || "")}
              className="px-4 py-2 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 font-bold rounded-lg text-xs flex items-center gap-1.5"
            >
              <FileCheck className="h-4 w-4" /> Pré-Visualizar & Gerar Contrato DOCX
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg"
            >
              <CheckCircle className="h-4 w-4" /> Confirmar Lançamento de Venda
            </button>
          </div>
        </form>
      ) : (
        /* Vendas Table listing */
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-center">
            
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Filtrar por nome do casal, ID da venda..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 outline-none rounded-lg bg-white"
              />
            </div>

            {/* Fast status payment filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-slate-200 p-2 bg-white rounded-lg text-slate-600 font-medium w-full sm:w-48 outline-none"
            >
              <option value="">Todos os Pagamentos</option>
              <option value="Aguardando">Aguardando Pagamento</option>
              <option value="Entrada Paga">Entrada Paga</option>
              <option value="Quitado">Quitados</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4">Código / Data de Venda</th>
                  <th className="p-4">Titular / Dependente</th>
                  <th className="p-4">Corretor</th>
                  <th className="p-4">Produto Plano</th>
                  <th className="p-4">Financeiro Plano</th>
                  <th className="p-4">Anexos / Documentos</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Contrato</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-400">
                      Nenhuma transação comercial localizada no sistema.
                    </td>
                  </tr>
                ) : (
                  filteredSales.map(sl => {
                    const client = receptions.find(r => r.id === sl.receptionId);
                    
                    let payBadge = "bg-yellow-50 text-yellow-700";
                    if (sl.paymentStatus === "Entrada Paga" || sl.paymentStatus === "Pago Parcial") payBadge = "bg-blue-50 text-blue-700";
                    if (sl.paymentStatus === "Quitado" || sl.paymentStatus === "Pago") payBadge = "bg-green-50 text-green-700 font-bold";
 
                    let contBadge = "text-slate-500 bg-slate-50 border-slate-100";
                    if (sl.contractStatus === "Contrato Gerado") contBadge = "text-indigo-700 bg-indigo-50 border-indigo-100";
                    if (sl.contractStatus === "Contrato Assinado") contBadge = "text-emerald-700 bg-emerald-50 border-emerald-100 font-bold";
 
                    return (
                      <tr key={sl.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <span className="font-mono font-bold text-slate-800 block">{sl.id}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {sl.date.split("-").reverse().join("/")}
                          </span>
                        </td>
                        <td className="p-4 text-slate-700">
                          {client ? (
                            <div>
                              <div className="font-bold">{client.guest1?.name}</div>
                              <div className="text-[10px] text-slate-400 italic">CPF: {client.guest1?.cpf}</div>
                            </div>
                          ) : (
                            <em className="text-slate-400">Direto / Sincronizando</em>
                          )}
                        </td>
                        <td className="p-4 text-slate-700 font-medium">{sl.brokerName}</td>
                        <td className="p-4">
                          <div className="font-semibold text-slate-800">{sl.productName}</div>
                          <div className="text-[10.5px] text-slate-400 mt-0.5">{sl.titleType} | {sl.peopleCount} pessoas</div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-slate-700">
                            {sl.totalPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {sl.paymentMethod} | Entrada {sl.downPayment.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} + {sl.installmentsCount}x de {sl.installmentValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </div>
                        </td>
                        <td className="p-4 text-slate-500">
                          {sl.documents && sl.documents.length > 0 ? (
                            <div className="space-y-0.5 max-w-[150px]">
                              {sl.documents.map((d, index) => (
                                <div key={index} className="text-[10px] truncate" title={d.name}>📄 {d.name}</div>
                              ))}
                            </div>
                          ) : (
                            <em className="text-slate-400 text-[10px]">Sem anexos</em>
                          )}
                        </td>
                        <td className="p-4 space-y-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] block text-center font-medium ${payBadge}`}>
                            {sl.paymentStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => triggerContractGeneration(sl.receptionId)}
                            className={`px-2.5 py-1 text-[11px] border rounded-lg hover:shadow-sm font-semibold transition-all flex items-center gap-1.5 mx-auto ${contBadge}`}
                          >
                            <FileCheck className="h-3.5 w-3.5" />
                            {sl.contractStatus === "Contrato Assinado" ? "Assinado" : sl.contractStatus === "Contrato Gerado" ? "Gerado / Ver" : "Gerar"}
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1.5 justify-end">
                            <button
                              onClick={() => {
                                setEditingSale(sl);
                                setIsCreating(true);
                              }}
                              className="px-2 py-1 text-[11.5px] bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer"
                              title="Visualizar ou Editar Lançamento"
                            >
                              <Eye className="h-3 w-3" /> Ver
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Deseja realmente excluir o lançamento comercial ${sl.id}?`)) {
                                  if (onDeleteSale) onDeleteSale(sl.id);
                                }
                              }}
                              className="px-2 py-1 text-[11.5px] bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer"
                              title="Excluir Lançamento Comercial"
                            >
                              <Trash2 className="h-3 w-3" /> Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
