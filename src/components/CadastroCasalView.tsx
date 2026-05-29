/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Guest, 
  CoupleRelation, 
  Address, 
  Contacts, 
  FinancialProfile, 
  Vehicles, 
  CoupleInspection, 
  ReceptionRecord,
  RelationType,
  CoupleSource,
  LodgingPlace,
  CaptationPlace,
  AttendanceStatus
} from "../types";
import { Save, User, Heart, MapPin, Phone, DollarSign, Car, Eye, Copy, ArrowRight, ArrowLeft } from "lucide-react";

interface CadastroCasalViewProps {
  onSave: (record: Partial<ReceptionRecord>) => void;
  initialRecord?: ReceptionRecord | null;
  onCancel: () => void;
  brokers: string[];
}

const emptyGuest = (): Guest => ({
  name: "", age: "", birthDate: "", retired: false,
  profession: "", professionObservation: "", cpf: "", rg: "",
  nationality: "Brasileiro(a)", civilStatus: "Casado(a)", schooling: "Ensino Médio",
  company: "", role: "", individualIncome: ""
});

export default function CadastroCasalView({ onSave, initialRecord, onCancel, brokers }: CadastroCasalViewProps) {
  const [activeTab, setActiveTab] = useState<"g1" | "g2" | "family" | "address" | "contacts" | "financial" | "vehicles" | "obs" | "reception">("reception");

  // State definitions matching the sections
  const [recCode, setRecCode] = useState("");
  const [presentationDate, setPresentationDate] = useState("");
  const [receptionTime, setReceptionTime] = useState("");
  const [source, setSource] = useState<CoupleSource>(CoupleSource.HOSPEDAGEM);
  const [lodging, setLodging] = useState<LodgingPlace>(LodgingPlace.LAGOA_QUENTE);
  const [captationPlace, setCaptationPlace] = useState<CaptationPlace>(CaptationPlace.RECEPCAO);
  const [brokerName, setBrokerName] = useState("");
  const [sdrName, setSdrName] = useState("");
  const [status, setStatus] = useState<AttendanceStatus>(AttendanceStatus.CADASTRADO);
  const [observations, setObservations] = useState("");

  const [guest1, setGuest1] = useState<Guest>(emptyGuest());
  const [guest2, setGuest2] = useState<Guest>(emptyGuest());

  const [relation, setRelation] = useState<CoupleRelation>({
    type: RelationType.CASADO,
    timeYears: "0", timeMonths: "0", timeDays: "0",
    childrenCount: "0", childrenNamesAge: "",
    companionCount: "0", companionNames: "", companionRelationship: "",
    familyObservations: ""
  });

  const [address, setAddress] = useState<Address>({
    residenceType: "Sem Informar", hasPropertyInCity: false,
    cep: "", country: "Brasil", state: "", city: "",
    street: "", number: "", complement: "", neighborhood: "", referencePoint: ""
  });

  const [contacts, setContacts] = useState<Contacts>({
    phoneResDDD: "", phoneResNumber: "",
    phoneMobDDD: "", phoneMobNumber: "",
    phoneMob2DDD: "", phoneMob2Number: "",
    phoneComDDD: "", phoneComNumber: "",
    email: "", mainWhatsapp: "", bestTimeToContact: ""
  });

  const [financial, setFinancial] = useState<FinancialProfile>({
    hasCreditCard: false, cardBrand: "", familyIncome: "",
    useCheque: false, activeFinancing: false, creditScore: "", financialObservations: ""
  });

  const [vehicles, setVehicles] = useState<Vehicles>({
    vehicle1Brand: "", vehicle1Model: "", vehicle1Year: "", vehicle1Plate: "",
    vehicle2Brand: "", vehicle2Model: "", vehicle2Year: "", vehicle2Plate: ""
  });

  const [inspection, setInspection] = useState<CoupleInspection>({
    description: "", heardOfVenture: false, commercialObservations: "",
    clientProfile: "", buyingPotential: "Médio", restrictions: ""
  });

  // Load initial record if editing
  useEffect(() => {
    if (initialRecord) {
      setRecCode(initialRecord.id || "");
      setPresentationDate(initialRecord.presentationDate || "");
      setReceptionTime(initialRecord.receptionTime || "");
      setSource(initialRecord.source || CoupleSource.HOSPEDAGEM);
      setLodging(initialRecord.lodging || LodgingPlace.LAGOA_QUENTE);
      setCaptationPlace(initialRecord.captationPlace || CaptationPlace.RECEPCAO);
      setBrokerName(initialRecord.brokerName || "");
      setSdrName(initialRecord.sdrName || "");
      setStatus(initialRecord.status || AttendanceStatus.CADASTRADO);
      setObservations(initialRecord.observations || "");

      if (initialRecord.guest1) setGuest1(initialRecord.guest1);
      if (initialRecord.guest2) setGuest2(initialRecord.guest2);
      if (initialRecord.relation) setRelation(initialRecord.relation);
      if (initialRecord.address) setAddress(initialRecord.address);
      if (initialRecord.contacts) setContacts(initialRecord.contacts);
      if (initialRecord.financial) setFinancial(initialRecord.financial);
      if (initialRecord.vehicles) setVehicles(initialRecord.vehicles);
      if (initialRecord.inspection) setInspection(initialRecord.inspection);
    } else {
      // Default code and dates
      const randId = `REC-${Math.floor(1000 + Math.random() * 9000)}`;
      setRecCode(randId);
      const today = new Date().toISOString().split("T")[0];
      setPresentationDate(today);
      const HH = String(new Date().getHours()).padStart(2, "0");
      const MM = String(new Date().getMinutes()).padStart(2, "0");
      setReceptionTime(`${HH}:${MM}`);
    }
  }, [initialRecord]);

  // Mask Helpers
  const formatCPF = (val: string) => {
    const numeric = val.replace(/\D/g, "");
    if (numeric.length <= 3) return numeric;
    if (numeric.length <= 6) return `${numeric.slice(0, 3)}.${numeric.slice(3)}`;
    if (numeric.length <= 9) return `${numeric.slice(0, 3)}.${numeric.slice(3, 6)}.${numeric.slice(6)}`;
    return `${numeric.slice(0, 3)}.${numeric.slice(3, 6)}.${numeric.slice(6, 9)}-${numeric.slice(9, 11)}`;
  };

  const formatPhone = (val: string) => {
    const numeric = val.replace(/\D/g, "");
    if (numeric.length <= 4) return numeric;
    if (numeric.length <= 8) return `${numeric.slice(0, 4)}-${numeric.slice(4)}`;
    if (numeric.length <= 9) return `${numeric.slice(0, 5)}-${numeric.slice(5)}`;
    return `${numeric.slice(0, 2)} ${numeric.slice(2, 7)}-${numeric.slice(7, 11)}`;
  };

  const formatCurrency = (val: string) => {
    const clean = val.replace(/\D/g, "");
    if (!clean) return "";
    const numeric = parseFloat(clean) / 100;
    return numeric.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const triggerSave = () => {
    const updatedRecord: Partial<ReceptionRecord> = {
      id: recCode,
      createdAt: initialRecord?.createdAt || new Date().toISOString(),
      receptionTime,
      presentationDate,
      source,
      lodging,
      captationPlace,
      brokerName,
      sdrName,
      status,
      observations,
      guest1,
      guest2,
      relation,
      address,
      contacts,
      financial,
      vehicles,
      inspection
    };
    onSave(updatedRecord);
  };

  const fillMockData = () => {
    // Easily generate realistic mock to save time during trials
    setSdrName("Henrique SDR");
    setObservations("Cliente focado em viagens, preencheu todo o questionário de automóvel.");
    
    setGuest1({
      name: "Alexandre Gusmão de Souza",
      age: "42",
      birthDate: "18/07/1983",
      retired: false,
      profession: "Diretor Comercial",
      professionObservation: "Segmento Atacado de Alimentos",
      cpf: "111.222.333-44",
      rg: "SSP-GO-1.233.444",
      nationality: "Brasileiro",
      civilStatus: "Casado(a)",
      schooling: "Superior Completo",
      company: "Gusmão Distribuição",
      role: "Sócio Administrador",
      individualIncome: "R$ 18.500,00"
    });

    setGuest2({
      name: "Mariana Alvez Gusmão",
      age: "39",
      birthDate: "22/10/1986",
      retired: false,
      profession: "Dentista",
      professionObservation: "Odontopediatria renomada",
      cpf: "444.333.222-11",
      rg: "SSP-GO-9.887.777",
      nationality: "Brasileira",
      civilStatus: "Casado(a)",
      schooling: "Especialização",
      company: "Clínica Sorella",
      role: "Dentista Principal",
      individualIncome: "R$ 12.000,00"
    });

    setRelation({
      type: RelationType.CASADO,
      timeYears: "12",
      timeMonths: "0",
      timeDays: "0",
      childrenCount: "2",
      childrenNamesAge: "Enzo, 10 anos; Valentina, 6 anos",
      companionCount: "2",
      companionNames: "Enzo, Valentina",
      companionRelationship: "Filhos",
      familyObservations: "Arthur viaja junto usualmente."
    });

    setAddress({
      residenceType: "Própria",
      hasPropertyInCity: false,
      cep: "74110-100",
      country: "Brasil",
      state: "GO",
      city: "Goiânia",
      street: "Rua do Ouro",
      number: "192",
      complement: "Apto 801",
      neighborhood: "Setor Marista",
      referencePoint: "Atrás do Shopping do Parque"
    });

    setContacts({
      phoneResDDD: "62",
      phoneResNumber: "3233-1122",
      phoneMobDDD: "62",
      phoneMobNumber: "99881-2244",
      phoneMob2DDD: "62",
      phoneMob2Number: "99881-5588",
      phoneComDDD: "62",
      phoneComNumber: "3244-9000",
      email: "alexandre.mkt@comercial.com",
      mainWhatsapp: "62998812244",
      bestTimeToContact: "Tarde de Sábado"
    });

    setFinancial({
      hasCreditCard: true,
      cardBrand: "Visa Infinite",
      familyIncome: "R$ 30.500,00",
      useCheque: false,
      activeFinancing: true,
      creditScore: "Alto (890)",
      financialObservations: "Financiamento de veículos ativo."
    });

    setVehicles({
      vehicle1Brand: "Volkswagen",
      vehicle1Model: "Taos Highline",
      vehicle1Year: "2023",
      vehicle1Plate: "GUS4A12",
      vehicle2Brand: "Honda",
      vehicle2Model: "Civic Touring",
      vehicle2Year: "2022",
      vehicle2Plate: "GUS4B34"
    });

    setInspection({
      description: "Excelentes clientes, classe alta. Buscam lazer unificado.",
      heardOfVenture: true,
      commercialObservations: "Apresentar prioritariamente Título Familiar Vitalício Remido.",
      clientProfile: "Investidores/Familiar",
      buyingPotential: "Alto",
      restrictions: "Nenhuma pendência comercial"
    });
  };

  const tabs = [
    { id: "reception", label: "0. Recepção", icon: Heart },
    { id: "g1", label: "1. Convidado Principal", icon: User },
    { id: "g2", label: "2. Cônjuge / Segundo", icon: User },
    { id: "family", label: "3. Dados Familiares", icon: Heart },
    { id: "address", label: "4. Endereço", icon: MapPin },
    { id: "contacts", label: "5. Contatos", icon: Phone },
    { id: "financial", label: "6. Financeiro", icon: DollarSign },
    { id: "vehicles", label: "7. Veículos", icon: Car },
    { id: "obs", label: "8. Observações", icon: Eye }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-6">
      
      {/* Visual Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-4">
        <div>
          <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
            {initialRecord ? `Editando Ficha: ${recCode}` : "Novo Cadastro Comercial"}
          </span>
          <h1 className="text-xl font-bold text-slate-800 mt-1">
            Ficha Cadastral Multi-Etapas do Casal
          </h1>
          <p className="text-xs text-slate-500">
            Cadastre os dados completos para posterior lançamento de vendas e emissão de contratos.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {!initialRecord && (
            <button
              onClick={fillMockData}
              type="button"
              className="px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 rounded-lg hover:bg-sky-100 border border-sky-100 transition-colors"
            >
              🪄 Simular Ficha Completa
            </button>
          )}
          <button
            onClick={onCancel}
            type="button"
            className="px-3.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 font-semibold border border-slate-200 rounded-lg"
          >
            Voltar
          </button>
          <button
            onClick={triggerSave}
            type="button"
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg"
          >
            <Save className="h-3.5 w-3.5" /> Salvar Ficha Cadastral
          </button>
        </div>
      </div>

      {/* Tab Navigation Menu */}
      <div className="flex flex-nowrap overflow-x-auto pb-2 border-b border-slate-100 gap-1 scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1 px-4 py-2 text-xs font-semibold rounded-lg shrink-0 transition-colors ${
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Forms Area */}
      <div className="space-y-4 pt-2">

        {/* TAB 0: RECEPTION CONTROLS */}
        {activeTab === "reception" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Informações da Recepção</h3>
            </div>
            
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Código Interno</label>
              <input
                type="text"
                disabled
                value={recCode}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 bg-slate-50 text-slate-500 font-mono"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Data do Cadastro</label>
              <input
                type="date"
                value={presentationDate}
                onChange={(e) => setPresentationDate(e.target.value)}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Hora do Cadastro</label>
              <input
                type="time"
                value={receptionTime}
                onChange={(e) => setReceptionTime(e.target.value)}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Origem do Casal</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as any)}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 bg-white"
              >
                {Object.values(CoupleSource).map(src => (
                  <option key={src} value={src}>{src}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Local de Hospedagem</label>
              <select
                value={lodging}
                onChange={(e) => setLodging(e.target.value as any)}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 bg-white"
              >
                {Object.values(LodgingPlace).map(place => (
                  <option key={place} value={place}>{place}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Local da Captação</label>
              <select
                value={captationPlace}
                onChange={(e) => setCaptationPlace(e.target.value as any)}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 bg-white"
              >
                {Object.values(CaptationPlace).map(place => (
                  <option key={place} value={place}>{place}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Corretor Responsável</label>
              <select
                value={brokerName}
                onChange={(e) => setBrokerName(e.target.value)}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 bg-white"
              >
                <option value="">Selecione um Corretor</option>
                {brokers.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">SDR / Captador da Ficha</label>
              <input
                type="text"
                placeholder="Nome do SDR se houver"
                value={sdrName}
                onChange={(e) => setSdrName(e.target.value)}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Status Atendimento</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 bg-white"
              >
                {Object.values(AttendanceStatus).map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col md:col-span-3">
              <label className="text-xs font-bold text-slate-700 mb-1">Observações da Recepção</label>
              <textarea
                rows={3}
                placeholder="Insira detalhes da chegada, comportamento, expectativas..."
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
              />
            </div>
          </div>
        )}

        {/* TAB 1 & 2: GUEST DATA */}
        {(activeTab === "g1" || activeTab === "g2") && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3 flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                {activeTab === "g1" ? "Convidado Principal (Titular)" : "Dados do Cônjuge ou Segundo Convidado"}
              </h3>
              {activeTab === "g2" && (
                <button
                  type="button"
                  onClick={() => {
                    // Quick replication of civilStatus, schooling etc
                    setGuest2(prev => ({
                      ...prev,
                      nationality: guest1.nationality,
                      civilStatus: guest1.civilStatus,
                      schooling: guest1.schooling,
                      company: guest1.company
                    }));
                  }}
                  className="text-[10px] text-sky-600 font-bold hover:underline"
                >
                  Reutilizar Dados Estáticos do Titular
                </button>
              )}
            </div>

            {/* Guest State binding */}
            {(() => {
              const current = activeTab === "g1" ? guest1 : guest2;
              const setC = activeTab === "g1" ? setGuest1 : setGuest2;

              return (
                <>
                  <div className="flex flex-col md:col-span-2">
                    <label className="text-xs font-bold text-slate-700 mb-1">Nome Completo</label>
                    <input
                      type="text"
                      placeholder="Nome do Convidado"
                      value={current.name}
                      onChange={(e) => setC({ ...current, name: e.target.value })}
                      className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
                    />
                  </div>

                  <div className="flex flex-col text-xs">
                    <label className="text-xs font-bold text-slate-700 mb-1">Idade</label>
                    <input
                      type="number"
                      placeholder="Anos"
                      value={current.age}
                      onChange={(e) => setC({ ...current, age: e.target.value })}
                      className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-700 mb-1">Data de Nascimento (DD/MM/AAAA)</label>
                    <input
                      type="text"
                      placeholder="data de nascimento"
                      value={current.birthDate}
                      onChange={(e) => setC({ ...current, birthDate: e.target.value })}
                      className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-700 mb-1">Aposentado(a)</label>
                    <select
                      value={current.retired ? "sim" : "nao"}
                      onChange={(e) => setC({ ...current, retired: e.target.value === "sim" })}
                      className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 bg-white"
                    >
                      <option value="nao">Não</option>
                      <option value="sim">Sim</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-700 mb-1">Nacionalidade</label>
                    <input
                      type="text"
                      value={current.nationality}
                      onChange={(e) => setC({ ...current, nationality: e.target.value })}
                      className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-700 mb-1">Profissão</label>
                    <input
                      type="text"
                      placeholder="Ex: Engenheiro, Dentista"
                      value={current.profession}
                      onChange={(e) => setC({ ...current, profession: e.target.value })}
                      className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
                    />
                  </div>

                  <div className="flex flex-col md:col-span-2">
                    <label className="text-xs font-bold text-slate-700 mb-1">Observação da Profissão</label>
                    <input
                      type="text"
                      placeholder="Ex: Sócio, Autônomo, Concursado"
                      value={current.professionObservation}
                      onChange={(e) => setC({ ...current, professionObservation: e.target.value })}
                      className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-700 mb-1">CPF (com máscara)</label>
                    <input
                      type="text"
                      placeholder="000.000.000-00"
                      value={current.cpf}
                      onChange={(e) => setC({ ...current, cpf: formatCPF(e.target.value) })}
                      className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-700 mb-1">RG</label>
                    <input
                      type="text"
                      placeholder="Registro Geral"
                      value={current.rg}
                      onChange={(e) => setC({ ...current, rg: e.target.value })}
                      className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-700 mb-1">Estado Civil</label>
                    <select
                      value={current.civilStatus}
                      onChange={(e) => setC({ ...current, civilStatus: e.target.value })}
                      className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 bg-white"
                    >
                      <option value="Casado(a)">Casado(a)</option>
                      <option value="União Estável">União Estável</option>
                      <option value="Divorciado(a)">Divorciado(a)</option>
                      <option value="Solteiro(a)">Solteiro(a)</option>
                      <option value="Viúvo(a)">Viúvo(a)</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-700 mb-1">Escolaridade</label>
                    <select
                      value={current.schooling}
                      onChange={(e) => setC({ ...current, schooling: e.target.value })}
                      className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 bg-white"
                    >
                      <option value="Ensino Fundamental">Ensino Fundamental</option>
                      <option value="Ensino Médio">Ensino Médio</option>
                      <option value="Superior Incompleto">Superior Incompleto</option>
                      <option value="Superior Completo">Superior Completo</option>
                      <option value="Pós-Graduação">Pós-Graduação / Especialização</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-700 mb-1">Empresa Onde Trabalha</label>
                    <input
                      type="text"
                      placeholder="Empresa"
                      value={current.company}
                      onChange={(e) => setC({ ...current, company: e.target.value })}
                      className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-700 mb-1">Cargo</label>
                    <input
                      type="text"
                      placeholder="Cargo ocupado"
                      value={current.role}
                      onChange={(e) => setC({ ...current, role: e.target.value })}
                      className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
                    />
                  </div>

                  <div className="flex flex-col text-xs">
                    <label className="text-xs font-bold text-slate-700 mb-1">Renda Individual Mensal</label>
                    <input
                      type="text"
                      placeholder="R$ 0,00"
                      value={current.individualIncome}
                      onChange={(e) => setC({ ...current, individualIncome: formatCurrency(e.target.value) })}
                      className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
                    />
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* TAB 3: RELATION & CHILDREN */}
        {activeTab === "family" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Relacionamento & Família</h3>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Tipo de Relacionamento</label>
              <select
                value={relation.type}
                onChange={(e) => setRelation({ ...relation, type: e.target.value as any })}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 bg-white"
              >
                {Object.values(RelationType).map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="text-xs font-bold text-slate-700 mb-1">Tempo de União / Relacionamento</label>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    placeholder="Ano(s)"
                    value={relation.timeYears}
                    onChange={(e) => setRelation({ ...relation, timeYears: e.target.value })}
                    className="text-xs border border-slate-200 outline-none rounded-lg px-2.5 py-2 w-full"
                  />
                  <span className="text-[10px] text-slate-400">Ano(s)</span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    placeholder="Mê(ses)"
                    value={relation.timeMonths}
                    onChange={(e) => setRelation({ ...relation, timeMonths: e.target.value })}
                    className="text-xs border border-slate-200 outline-none rounded-lg px-2.5 py-2 w-full"
                  />
                  <span className="text-[10px] text-slate-400">Mês(es)</span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    placeholder="Dia(s)"
                    value={relation.timeDays}
                    onChange={(e) => setRelation({ ...relation, timeDays: e.target.value })}
                    className="text-xs border border-slate-200 outline-none rounded-lg px-2.5 py-2 w-full"
                  />
                  <span className="text-[10px] text-slate-400">Dia(s)</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Quantidade de Filhos</label>
              <input
                type="number"
                placeholder="0"
                value={relation.childrenCount}
                onChange={(e) => setRelation({ ...relation, childrenCount: e.target.value })}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="text-xs font-bold text-slate-700 mb-1">Filhos (Nomes e Idades)</label>
              <input
                type="text"
                placeholder="Ex: João (10), Amanda (6)"
                value={relation.childrenNamesAge}
                onChange={(e) => setRelation({ ...relation, childrenNamesAge: e.target.value })}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Acompanhantes (Quantidade)</label>
              <input
                type="number"
                placeholder="0"
                value={relation.companionCount}
                onChange={(e) => setRelation({ ...relation, companionCount: e.target.value })}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Acompanhantes (Nomes)</label>
              <input
                type="text"
                placeholder="Ex: Sogra, Tio"
                value={relation.companionNames}
                onChange={(e) => setRelation({ ...relation, companionNames: e.target.value })}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Grau de Parentesco</label>
              <input
                type="text"
                placeholder="Grau"
                value={relation.companionRelationship}
                onChange={(e) => setRelation({ ...relation, companionRelationship: e.target.value })}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex flex-col md:col-span-3">
              <label className="text-xs font-bold text-slate-700 mb-1">Observações Familiares Adicionais</label>
              <textarea
                rows={2}
                placeholder="Gostos particulares, limitações de saúde..."
                value={relation.familyObservations}
                onChange={(e) => setRelation({ ...relation, familyObservations: e.target.value })}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
              />
            </div>
          </div>
        )}

        {/* TAB 4: ADDRESS DATA */}
        {activeTab === "address" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Endereço de Residência</h3>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Tipo de Residência</label>
              <select
                value={address.residenceType}
                onChange={(e) => setAddress({ ...address, residenceType: e.target.value })}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 bg-white"
              >
                <option value="Própria">Própria</option>
                <option value="Alugada">Alugada</option>
                <option value="Funcional / Cooperativa">Funcional / Cooperativa</option>
                <option value="Família / Cedido">Cedido/Família</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Possui Imóvel na Cidade? (Caldas Novas)</label>
              <select
                value={address.hasPropertyInCity ? "sim" : "nao"}
                onChange={(e) => setAddress({ ...address, hasPropertyInCity: e.target.value === "sim" })}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 bg-white"
              >
                <option value="nao">Não</option>
                <option value="sim">Sim</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">CEP</label>
              <input
                type="text"
                placeholder="74000-000"
                value={address.cep}
                onChange={(e) => setAddress({ ...address, cep: e.target.value })}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Logradouro / Rua</label>
              <input
                type="text"
                placeholder="Avenida, Rua"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex flex-col text-xs">
              <label className="text-xs font-bold text-slate-700 mb-1">Número</label>
              <input
                type="text"
                placeholder="Nº"
                value={address.number}
                onChange={(e) => setAddress({ ...address, number: e.target.value })}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Complemento</label>
              <input
                type="text"
                placeholder="Apto, Bloco, Quadra"
                value={address.complement}
                onChange={(e) => setAddress({ ...address, complement: e.target.value })}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Bairro</label>
              <input
                type="text"
                placeholder="Ex: Jardim, Bueno"
                value={address.neighborhood}
                onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex flex-col col-span-2 md:col-span-1">
              <label className="text-xs font-bold text-slate-700 mb-1">Cidade</label>
              <input
                type="text"
                placeholder="Cidade"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Estado (UF)</label>
              <input
                type="text"
                placeholder="Ex: GO, MG"
                maxLength={2}
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex flex-col md:col-span-3">
              <label className="text-xs font-bold text-slate-700 mb-1">Ponto de Referência</label>
              <input
                type="text"
                placeholder="Ponto histórico, de frente ao..."
                value={address.referencePoint}
                onChange={(e) => setAddress({ ...address, referencePoint: e.target.value })}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
              />
            </div>
          </div>
        )}

        {/* TAB 5: CONTACTS DATA */}
        {activeTab === "contacts" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Canais de Contato</h3>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Telefone Fixo Residencial</label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  maxLength={2}
                  placeholder="DDD"
                  value={contacts.phoneResDDD}
                  onChange={(e) => setContacts({ ...contacts, phoneResDDD: e.target.value })}
                  className="text-xs border border-slate-200 outline-none rounded-lg p-2.5 w-14 text-center"
                />
                <input
                  type="text"
                  placeholder="Número"
                  value={contacts.phoneResNumber}
                  onChange={(e) => setContacts({ ...contacts, phoneResNumber: formatPhone(e.target.value) })}
                  className="text-xs border border-slate-200 outline-none rounded-lg p-2.5 flex-1"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Celular / Celular Principal</label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  maxLength={2}
                  placeholder="DDD"
                  value={contacts.phoneMobDDD}
                  onChange={(e) => setContacts({ ...contacts, phoneMobDDD: e.target.value })}
                  className="text-xs border border-slate-200 outline-none rounded-lg p-2.5 w-14 text-center"
                />
                <input
                  type="text"
                  placeholder="Número celular"
                  value={contacts.phoneMobNumber}
                  onChange={(e) => setContacts({ ...contacts, phoneMobNumber: formatPhone(e.target.value) })}
                  className="text-xs border border-slate-200 outline-none rounded-lg p-2.5 flex-1"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Celular Secundário (Cônjuge)</label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  maxLength={2}
                  placeholder="DDD"
                  value={contacts.phoneMob2DDD}
                  onChange={(e) => setContacts({ ...contacts, phoneMob2DDD: e.target.value })}
                  className="text-xs border border-slate-200 outline-none rounded-lg p-2.5 w-14 text-center"
                />
                <input
                  type="text"
                  placeholder="Número celular"
                  value={contacts.phoneMob2Number}
                  onChange={(e) => setContacts({ ...contacts, phoneMob2Number: formatPhone(e.target.value) })}
                  className="text-xs border border-slate-200 outline-none rounded-lg p-2.5 flex-1"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">WhatsApp Principal</label>
              <input
                type="text"
                placeholder="Ex: 62998812244"
                value={contacts.mainWhatsapp}
                onChange={(e) => setContacts({ ...contacts, mainWhatsapp: e.target.value })}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">E-mail</label>
              <input
                type="email"
                placeholder="exemplo@gmail.com"
                value={contacts.email}
                onChange={(e) => setContacts({ ...contacts, email: e.target.value })}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex flex-col col-span-2 md:col-span-1">
              <label className="text-xs font-bold text-slate-700 mb-1">Melhor Horário para Contato</label>
              <select
                value={contacts.bestTimeToContact}
                onChange={(e) => setContacts({ ...contacts, bestTimeToContact: e.target.value })}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 bg-white"
              >
                <option value="Qualquer hora">Qualquer hora</option>
                <option value="Manhã">Período da Manhã</option>
                <option value="Tarde">Período da Tarde</option>
                <option value="Noite">Período da Noite</option>
                <option value="Fins de Semana">Fins de Semana</option>
              </select>
            </div>
          </div>
        )}

        {/* TAB 6: FINANCIAL DATA */}
        {activeTab === "financial" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Dados Financeiros Comerciais</h3>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Possui Cartão de Crédito?</label>
              <select
                value={financial.hasCreditCard ? "sim" : "nao"}
                onChange={(e) => setFinancial({ ...financial, hasCreditCard: e.target.value === "sim" })}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 bg-white"
              >
                <option value="nao">Não</option>
                <option value="sim">Sim</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Bandeira do Cartão</label>
              <input
                type="text"
                placeholder="Ex: Visa Infinite, Mastercard Black"
                value={financial.cardBrand}
                onChange={(e) => setFinancial({ ...financial, cardBrand: e.target.value })}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex flex-col text-xs">
              <label className="text-xs font-bold text-slate-700 mb-1">Renda Familiar Bruta</label>
              <input
                type="text"
                placeholder="R$ 0,00"
                value={financial.familyIncome}
                onChange={(e) => setFinancial({ ...financial, familyIncome: formatCurrency(e.target.value) })}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Utilizador de Cheque?</label>
              <select
                value={financial.useCheque ? "sim" : "nao"}
                onChange={(e) => setFinancial({ ...financial, useCheque: e.target.value === "sim" })}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 bg-white"
              >
                <option value="nao">Não</option>
                <option value="sim">Sim</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Possui Financiamento Ativo?</label>
              <select
                value={financial.activeFinancing ? "sim" : "nao"}
                onChange={(e) => setFinancial({ ...financial, activeFinancing: e.target.value === "sim" })}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 bg-white"
              >
                <option value="nao">Não</option>
                <option value="sim">Sim</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Score / Perfil Financeiro</label>
              <input
                type="text"
                placeholder="Ex: Excelente, Pontual, Score 850"
                value={financial.creditScore}
                onChange={(e) => setFinancial({ ...financial, creditScore: e.target.value })}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex flex-col md:col-span-3">
              <label className="text-xs font-bold text-slate-700 mb-1">Observações Financeiras</label>
              <textarea
                rows={2}
                placeholder="Apontamentos de renda secundária, limites disponíveis..."
                value={financial.financialObservations}
                onChange={(e) => setFinancial({ ...financial, financialObservations: e.target.value })}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
              />
            </div>
          </div>
        )}

        {/* TAB 7: VEHICLES DATA */}
        {activeTab === "vehicles" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Automóveis da Família</h3>
            </div>

            {/* Vehicle 1 */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 grid grid-cols-2 gap-3">
              <div className="col-span-2 font-semibold text-xs text-slate-600">Veículo 1</div>
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-500 mb-1">Marca</label>
                <input
                  type="text"
                  placeholder="Toyota, VW"
                  value={vehicles.vehicle1Brand}
                  onChange={(e) => setVehicles({ ...vehicles, vehicle1Brand: e.target.value })}
                  className="text-xs border border-slate-200 outline-none rounded-lg p-2 w-full bg-white"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-500 mb-1">Modelo</label>
                <input
                  type="text"
                  placeholder="Corolla, Taos"
                  value={vehicles.vehicle1Model}
                  onChange={(e) => setVehicles({ ...vehicles, vehicle1Model: e.target.value })}
                  className="text-xs border border-slate-200 outline-none rounded-lg p-2 w-full bg-white"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-500 mb-1">Ano</label>
                <input
                  type="text"
                  placeholder="2022"
                  value={vehicles.vehicle1Year}
                  onChange={(e) => setVehicles({ ...vehicles, vehicle1Year: e.target.value })}
                  className="text-xs border border-slate-200 outline-none rounded-lg p-2 w-full bg-white"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-500 mb-1">Placa</label>
                <input
                  type="text"
                  placeholder="ABC-1234"
                  value={vehicles.vehicle1Plate}
                  onChange={(e) => setVehicles({ ...vehicles, vehicle1Plate: e.target.value })}
                  className="text-xs border border-slate-200 outline-none rounded-lg p-2 w-full bg-white"
                />
              </div>
            </div>

            {/* Vehicle 2 */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 grid grid-cols-2 gap-3">
              <div className="col-span-2 font-semibold text-xs text-slate-600">Veículo 2</div>
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-500 mb-1">Marca</label>
                <input
                  type="text"
                  placeholder="Honda, Jeep"
                  value={vehicles.vehicle2Brand}
                  onChange={(e) => setVehicles({ ...vehicles, vehicle2Brand: e.target.value })}
                  className="text-xs border border-slate-200 outline-none rounded-lg p-2 w-full bg-white"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-500 mb-1">Modelo</label>
                <input
                  type="text"
                  placeholder="Civic, Compass"
                  value={vehicles.vehicle2Model}
                  onChange={(e) => setVehicles({ ...vehicles, vehicle2Model: e.target.value })}
                  className="text-xs border border-slate-200 outline-none rounded-lg p-2 w-full bg-white"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-500 mb-1">Ano</label>
                <input
                  type="text"
                  placeholder="2021"
                  value={vehicles.vehicle2Year}
                  onChange={(e) => setVehicles({ ...vehicles, vehicle2Year: e.target.value })}
                  className="text-xs border border-slate-200 outline-none rounded-lg p-2 w-full bg-white"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-500 mb-1">Placa</label>
                <input
                  type="text"
                  placeholder="XYZ-5678"
                  value={vehicles.vehicle2Plate}
                  onChange={(e) => setVehicles({ ...vehicles, vehicle2Plate: e.target.value })}
                  className="text-xs border border-slate-200 outline-none rounded-lg p-2 w-full bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: COMMERCIAL INSPECTION & PROFILE */}
        {activeTab === "obs" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Observações Comerciais & Auditoria</h3>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Já conhece o Empreendimento Lagoa Lovers?</label>
              <select
                value={inspection.heardOfVenture ? "sim" : "nao"}
                onChange={(e) => setInspection({ ...inspection, heardOfVenture: e.target.value === "sim" })}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 bg-white"
              >
                <option value="nao">Não</option>
                <option value="sim">Sim</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Perfil do Cliente</label>
              <input
                type="text"
                placeholder="Ex: Família estável / Lazer frequente"
                value={inspection.clientProfile}
                onChange={(e) => setInspection({ ...inspection, clientProfile: e.target.value })}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex flex-col col-span-2 md:col-span-1">
              <label className="text-xs font-bold text-slate-700 mb-1">Potencial de Compra</label>
              <select
                value={inspection.buyingPotential}
                onChange={(e) => setInspection({ ...inspection, buyingPotential: e.target.value })}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 bg-white"
              >
                <option value="Alto">Alto</option>
                <option value="Médio">Médio</option>
                <option value="Baixo">Baixo</option>
              </select>
            </div>

            <div className="flex flex-col md:col-span-3">
              <label className="text-xs font-bold text-slate-700 mb-1">Restrições ou Pontos de Atenção</label>
              <input
                type="text"
                placeholder="Ex: Compromissos elevados, pressa para sair, restrição ao..."
                value={inspection.restrictions}
                onChange={(e) => setInspection({ ...inspection, restrictions: e.target.value })}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex flex-col md:col-span-3">
              <label className="text-xs font-bold text-slate-700 mb-1">Descrição Geral / Observações Comerciais</label>
              <textarea
                rows={3}
                placeholder="Anotações cruciais para o Corretor fechar a venda..."
                value={inspection.description}
                onChange={(e) => setInspection({ ...inspection, description: e.target.value })}
                className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2"
              />
            </div>
          </div>
        )}
      </div>

      {/* Button Stepper Navigator at bottom */}
      <div className="flex justify-between border-t border-slate-100 pt-4">
        {(() => {
          const currentIndex = tabs.findIndex(t => t.id === activeTab);
          const prevTab = currentIndex > 0 ? tabs[currentIndex - 1] : null;
          const nextTab = currentIndex < tabs.length - 1 ? tabs[currentIndex + 1] : null;

          return (
            <>
              {prevTab ? (
                <button
                  type="button"
                  onClick={() => setActiveTab(prevTab.id as any)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" /> Anterior ({prevTab.label.split(". ")[1]})
                </button>
              ) : (
                <div />
              )}

              {nextTab ? (
                <button
                  type="button"
                  onClick={() => setActiveTab(nextTab.id as any)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-900 rounded-lg text-white transition-colors ml-auto"
                >
                  Próximo ({nextTab.label.split(". ")[1]}) <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={triggerSave}
                  className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg ml-auto transition-colors"
                >
                  <Save className="h-4 w-4" /> Finalizar & Salvar Ficha
                </button>
              )}
            </>
          );
        })()}
      </div>

    </div>
  );
}
