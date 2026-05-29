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
import { Check, ClipboardList, User, Users, MapPin, CheckCircle2, ArrowRight, ArrowLeft, Wand2 } from "lucide-react";

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
  // 5 Steps of our Wizard
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [registrationCompleted, setRegistrationCompleted] = useState<boolean>(false);

  // Reception Core Fields
  const [recCode, setRecCode] = useState("");
  const [presentationDate, setPresentationDate] = useState("");
  const [receptionTime, setReceptionTime] = useState("");
  const [source, setSource] = useState<CoupleSource>(CoupleSource.HOSPEDAGEM);
  const [lodging, setLodging] = useState<LodgingPlace>(LodgingPlace.LAGOA_QUENTE);
  const [captationPlace, setCaptationPlace] = useState<CaptationPlace>(CaptationPlace.RECEPCAO);
  const [brokerName, setBrokerName] = useState("");
  const [sdrName, setSdrName] = useState("");
  const [observations, setObservations] = useState("");

  // Guest Objects
  const [guest1, setGuest1] = useState<Guest>(emptyGuest());
  const [guest2, setGuest2] = useState<Guest>(emptyGuest());

  // Address
  const [address, setAddress] = useState<Address>({
    residenceType: "Própria", hasPropertyInCity: false,
    cep: "", country: "Brasil", state: "", city: "",
    street: "", number: "", complement: "", neighborhood: "", referencePoint: ""
  });

  // Contacts
  const [contacts, setContacts] = useState<Contacts>({
    phoneResDDD: "62", phoneResNumber: "",
    phoneMobDDD: "62", phoneMobNumber: "",
    phoneMob2DDD: "62", phoneMob2Number: "",
    phoneComDDD: "62", phoneComNumber: "",
    email: "", mainWhatsapp: "", bestTimeToContact: "Qualquer horário"
  });

  // Default empty objects to satisfy ts types in background
  const [relation] = useState<CoupleRelation>({
    type: RelationType.CASADO, timeYears: "0", timeMonths: "0", timeDays: "0",
    childrenCount: "0", childrenNamesAge: "", companionCount: "0", companionNames: "Sim",
    companionRelationship: "Cônjuge", familyObservations: ""
  });
  const [financial] = useState<FinancialProfile>({
    hasCreditCard: true, cardBrand: "Visa", familyIncome: "Estipulado",
    useCheque: false, activeFinancing: false, creditScore: "700", financialObservations: ""
  });
  const [vehicles] = useState<Vehicles>({
    vehicle1Brand: "", vehicle1Model: "", vehicle1Year: "", vehicle1Plate: "",
    vehicle2Brand: "", vehicle2Model: "", vehicle2Year: "", vehicle2Plate: ""
  });
  const [inspection] = useState<CoupleInspection>({
    description: "", heardOfVenture: true, commercialObservations: "",
    clientProfile: "Família", buyingPotential: "Alto", restrictions: ""
  });

  // Load initial record
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
      setObservations(initialRecord.observations || "");

      if (initialRecord.guest1) setGuest1(initialRecord.guest1);
      if (initialRecord.guest2) setGuest2(initialRecord.guest2);
      if (initialRecord.address) setAddress(initialRecord.address);
      if (initialRecord.contacts) setContacts(initialRecord.contacts);
    } else {
      const randId = `REC-${Math.floor(1000 + Math.random() * 9000)}`;
      setRecCode(randId);
      setPresentationDate(new Date().toISOString().split("T")[0]);
      const HH = String(new Date().getHours()).padStart(2, "0");
      const MM = String(new Date().getMinutes()).padStart(2, "0");
      setReceptionTime(`${HH}:${MM}`);
    }
  }, [initialRecord]);

  // Mask helper for CFP number
  const formatCPF = (val: string) => {
    const numeric = val.replace(/\D/g, "");
    if (numeric.length <= 3) return numeric;
    if (numeric.length <= 6) return `${numeric.slice(0, 3)}.${numeric.slice(3)}`;
    if (numeric.length <= 9) return `${numeric.slice(0, 3)}.${numeric.slice(3, 6)}.${numeric.slice(6)}`;
    return `${numeric.slice(0, 3)}.${numeric.slice(3, 6)}.${numeric.slice(6, 9)}-${numeric.slice(9, 11)}`;
  };

  const handleCpfChange = (guest: "g1" | "g2", rawVal: string) => {
    const formatted = formatCPF(rawVal);
    if (guest === "g1") {
      setGuest1(prev => ({ ...prev, cpf: formatted }));
    } else {
      setGuest2(prev => ({ ...prev, cpf: formatted }));
    }
  };

  const fillMockData = () => {
    setSdrName("Marcos SDR");
    setBrokerName(brokers[0] || "Marcos Oliveira");
    setObservations("Casal de turistas muito receptivos, buscam bem-estar familiar.");
    
    setGuest1({
      name: "Guilherme Santos Pereira",
      age: "36",
      birthDate: "1988-10-15",
      retired: false,
      profession: "Analista de TI",
      professionObservation: "Empresa Sênior Tech",
      cpf: "192.481.591-10",
      rg: "6.812.591-PR",
      nationality: "Brasileiro",
      civilStatus: "Casado(a)",
      schooling: "Superior Completo",
      company: "Sênior Tech",
      role: "Coordenador",
      individualIncome: "R$ 9.500,00"
    });

    setGuest2({
      name: "Fernanda Almeida Ramos",
      age: "34",
      birthDate: "1990-05-22",
      retired: false,
      profession: "Psicóloga Clínical",
      professionObservation: "Consultório próprio",
      cpf: "482.910.284-88",
      rg: "9.281.482-PR",
      nationality: "Brasileira",
      civilStatus: "Casado(a)",
      schooling: "Especialização",
      company: "Clínica Vida",
      role: "Socia",
      individualIncome: "R$ 7.200,00"
    });

    setAddress({
      residenceType: "Própria",
      hasPropertyInCity: false,
      cep: "81200-100",
      country: "Brasil",
      state: "PR",
      city: "Curitiba",
      street: "Avenida Visconde de Guarapuava",
      number: "1550",
      complement: "Apto 101",
      neighborhood: "Batel",
      referencePoint: "Próximo à Praça do Japão"
    });

    setContacts({
      phoneResDDD: "41",
      phoneResNumber: "3322-1100",
      phoneMobDDD: "41",
      phoneMobNumber: "99881-1122",
      phoneMob2DDD: "41",
      phoneMob2Number: "99881-4455",
      phoneComDDD: "41",
      phoneComNumber: "",
      email: "guilherme.santos@email.com",
      mainWhatsapp: "41998811122",
      bestTimeToContact: "Qualquer horário"
    });
  };

  const triggerSaveAndSend = (toAtendimento: boolean) => {
    const updatedRecord: Partial<ReceptionRecord> = {
      id: recCode,
      createdAt: initialRecord?.createdAt || new Date().toISOString(),
      receptionTime,
      presentationDate,
      source,
      lodging,
      captationPlace,
      brokerName: brokerName || "Gerente Comercial",
      sdrName,
      status: toAtendimento ? AttendanceStatus.EM_ATENDIMENTO : AttendanceStatus.CADASTRADO,
      observations,
      guest1,
      guest2,
      relation,
      address,
      contacts: {
        ...contacts,
        phoneResNumber: contacts.phoneResNumber,
        phoneMobNumber: contacts.phoneMobNumber,
        phoneMob2Number: contacts.phoneMob2Number,
        mainWhatsapp: contacts.mainWhatsapp || contacts.phoneMobNumber,
        email: contacts.email
      },
      financial,
      vehicles,
      inspection
    };

    onSave(updatedRecord);
    setRegistrationCompleted(true);
  };

  const stepTitles = [
    { num: 1, label: "Dados da Apresentação", icon: ClipboardList },
    { num: 2, label: "Titular", icon: User },
    { num: 3, label: "Cônjuge/Acompanhante", icon: Users },
    { num: 4, label: "Contato e Endereço", icon: MapPin },
    { num: 5, label: "Finalizar", icon: Check }
  ];

  if (registrationCompleted) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-2xl mx-auto p-12 text-center space-y-6 my-10 animate-fade-in">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-md">
          <CheckCircle2 className="h-12 w-12" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Cadastro Concluído!</h2>
          <p className="text-sm text-slate-600">
            O casal <strong className="text-slate-950">{guest1.name || "Titular"}</strong> foi registrado com absoluto sucesso no banco do Lagoa Lovers.
          </p>
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs text-emerald-800 font-bold max-w-sm mx-auto mt-4">
            “Cadastro concluído. Agora este casal está disponível em Atendimentos.”
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6 max-w-md mx-auto">
          <button
            onClick={onCancel}
            className="flex-1 px-5 py-3 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Voltar para a Lista
          </button>
          <button
            onClick={() => {
              // Redirect and trigger internal attendance launch
              // By setting registration completed, this component close and triggerSaveAndSend will handle it
              onCancel();
            }}
            className="flex-1 px-5 py-3 text-xs font-black text-white bg-[#0B4A34] hover:bg-[#073022] rounded-xl shadow-lg shadow-emerald-950/15 transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            Ir para Atendimentos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-6 md:p-8 space-y-8 animate-fade-in">
      
      {/* Header Wizard Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-5 gap-4">
        <div>
          <span className="text-[10px] font-extrabold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-wider">
            {initialRecord ? `Editando Código: ${recCode}` : "Novo Pré-Cadastro de Casal"}
          </span>
          <h1 className="text-xl font-bold font-sans text-slate-800 mt-1.5 tracking-tight">
            Etapas da Recepção
          </h1>
          <p className="text-xs text-slate-500">Fluxo guiado de alta conversão sem campos repetitivos.</p>
        </div>

        <div className="flex items-center gap-2">
          {!initialRecord && (
            <button
              onClick={fillMockData}
              type="button"
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-extrabold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-lg transition-all cursor-pointer"
            >
              <Wand2 className="h-3 w-3" /> Simular Dados Completos
            </button>
          )}
          <button
            onClick={onCancel}
            type="button"
            className="px-3.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 font-bold border border-slate-200 rounded-lg cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>

      {/* Progress Stepper Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 border-b border-slate-100 pb-6">
        {stepTitles.map(step => {
          const IconObj = step.icon;
          const isDone = currentStep > step.num;
          const isCurrent = currentStep === step.num;
          
          return (
            <div 
              key={step.num}
              onClick={() => setCurrentStep(step.num)}
              className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
                isCurrent 
                  ? "border-[#0B4A34] bg-emerald-50/40 text-[#0B4A34]" 
                  : isDone 
                    ? "border-emerald-200 bg-emerald-50/10 text-emerald-700" 
                    : "border-slate-100 bg-slate-50/50 text-slate-400 hover:bg-slate-50"
              }`}
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-[11px] font-extrabold shrink-0 ${
                isCurrent 
                  ? "bg-[#0B4A34] text-white animate-pulse" 
                  : isDone 
                    ? "bg-emerald-600 text-white" 
                    : "bg-slate-200 text-slate-500"
              }`}>
                {isDone ? "✓" : step.num}
              </div>
              <div className="text-[10px] sm:text-[11px] leading-tight font-extrabold tracking-tight">
                {step.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* STEP FIELDS CONTENT */}
      <div className="pt-2">
        
        {/* STEP 1: Dados da Apresentação */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-sky-600 rounded"></span> Informações da Apresentação
            </h2>
            <p className="text-slate-500 text-xs">Preencha as informações básicas do acolhimento na recepção do clube.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-3">
              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-700 mb-1">Código da Ficha</label>
                <input
                  type="text"
                  disabled
                  value={recCode}
                  className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 bg-slate-50 text-slate-400 font-mono font-semibold"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-700 mb-1">Data da Apresentação *</label>
                <input
                  type="date"
                  value={presentationDate}
                  onChange={(e) => setPresentationDate(e.target.value)}
                  className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 focus:border-sky-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-700 mb-1">Origem do Casal *</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as any)}
                  className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 bg-white focus:border-sky-500 cursor-pointer font-bold text-slate-750"
                >
                  {Object.values(CoupleSource).map(src => (
                    <option key={src} value={src}>{src}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-700 mb-1">Local da Hospedagem *</label>
                <select
                  value={lodging}
                  onChange={(e) => setLodging(e.target.value as any)}
                  className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 bg-white focus:border-sky-500 cursor-pointer font-bold text-slate-750"
                >
                  {Object.values(LodgingPlace).map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-700 mb-1">Local de Captação *</label>
                <select
                  value={captationPlace}
                  onChange={(e) => setCaptationPlace(e.target.value as any)}
                  className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 bg-white focus:border-sky-500 cursor-pointer font-bold text-slate-750"
                >
                  {Object.values(CaptationPlace).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-700 mb-1">Captador / SDR</label>
                <input
                  type="text"
                  placeholder="Ex: Henrique SDR"
                  value={sdrName}
                  onChange={(e) => setSdrName(e.target.value)}
                  className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 focus:border-sky-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-700 mb-1">Corretor Responsável</label>
                <select
                  value={brokerName}
                  onChange={(e) => setBrokerName(e.target.value)}
                  className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 bg-white focus:border-sky-500 cursor-pointer font-bold text-slate-750"
                >
                  <option value="">Selecione o corretor...</option>
                  {brokers.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col md:col-span-3">
                <label className="text-xs font-bold text-slate-700 mb-1">Observações Operacionais</label>
                <textarea
                  rows={3}
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Detone aqui qualquer detalhe sobre o perfil ou chegada do casal..."
                  className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 focus:border-sky-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Dados do Titular */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-sky-600 rounded"></span> Dados do Convidado Titular
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="flex flex-col md:col-span-2">
                <label className="text-xs font-bold text-slate-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  value={guest1.name}
                  onChange={(e) => setGuest1({ ...guest1, name: e.target.value })}
                  placeholder="Nome do titular"
                  className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 focus:border-sky-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-700 mb-1">CPF *</label>
                <input
                  type="text"
                  maxLength={14}
                  value={guest1.cpf}
                  onChange={(e) => handleCpfChange("g1", e.target.value)}
                  placeholder="000.000.000-00"
                  className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 focus:border-sky-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-700 mb-1">RG</label>
                <input
                  type="text"
                  value={guest1.rg}
                  onChange={(e) => setGuest1({ ...guest1, rg: e.target.value })}
                  placeholder="Ex: 5.123.456-0"
                  className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 focus:border-sky-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-700 mb-1">Data de Nascimento</label>
                <input
                  type="date"
                  value={guest1.birthDate}
                  onChange={(e) => setGuest1({ ...guest1, birthDate: e.target.value })}
                  className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 focus:border-sky-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-700 mb-1">Nacionalidade</label>
                <input
                  type="text"
                  value={guest1.nationality}
                  onChange={(e) => setGuest1({ ...guest1, nationality: e.target.value })}
                  className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 focus:border-sky-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-700 mb-1">Estado Civil</label>
                <select
                  value={guest1.civilStatus}
                  onChange={(e) => setGuest1({ ...guest1, civilStatus: e.target.value })}
                  className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 bg-white focus:border-sky-500 font-bold"
                >
                  <option value="Casado(a)">Casado(a)</option>
                  <option value="União Estável">União Estável</option>
                  <option value="Solteiro(a)">Solteiro(a)</option>
                  <option value="Divorciado(a)">Divorciado(a)</option>
                  <option value="Viúvo(a)">Viúvo(a)</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-700 mb-1">Profissão</label>
                <input
                  type="text"
                  value={guest1.profession}
                  onChange={(e) => setGuest1({ ...guest1, profession: e.target.value })}
                  placeholder="Ex: Engenheiro"
                  className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 focus:border-sky-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-700 mb-1">Telefone Res/Com</label>
                <input
                  type="text"
                  placeholder="Telefone fixo ou contato"
                  value={contacts.phoneResNumber}
                  onChange={(e) => setContacts({ ...contacts, phoneResNumber: e.target.value })}
                  className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 focus:border-sky-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-700 mb-1">Celular / WhatsApp *</label>
                <input
                  type="text"
                  placeholder="Número de WhatsApp com DDD"
                  value={contacts.mainWhatsapp}
                  onChange={(e) => setContacts({ ...contacts, mainWhatsapp: e.target.value, phoneMobNumber: e.target.value })}
                  className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 focus:border-sky-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-700 mb-1">E-mail Titular *</label>
                <input
                  type="email"
                  placeholder="exemplo@email.com"
                  value={contacts.email}
                  onChange={(e) => setContacts({ ...contacts, email: e.target.value })}
                  className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 focus:border-sky-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Dados do Cônjuge ou Acompanhante */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-sky-600 rounded"></span> Dados do Cônjuge / Acompanhante
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="flex flex-col md:col-span-2">
                <label className="text-xs font-bold text-slate-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={guest2.name}
                  onChange={(e) => setGuest2({ ...guest2, name: e.target.value })}
                  placeholder="Nome do cônjuge/acompanhante"
                  className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 focus:border-sky-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-700 mb-1">CPF</label>
                <input
                  type="text"
                  maxLength={14}
                  value={guest2.cpf}
                  onChange={(e) => handleCpfChange("g2", e.target.value)}
                  placeholder="000.000.000-00"
                  className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 focus:border-sky-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-700 mb-1">RG</label>
                <input
                  type="text"
                  value={guest2.rg}
                  onChange={(e) => setGuest2({ ...guest2, rg: e.target.value })}
                  placeholder="Ex: 9.876.543-2"
                  className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 focus:border-sky-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-700 mb-1">Data de Nascimento</label>
                <input
                  type="date"
                  value={guest2.birthDate}
                  onChange={(e) => setGuest2({ ...guest2, birthDate: e.target.value })}
                  className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 focus:border-sky-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-700 mb-1">Nacionalidade</label>
                <input
                  type="text"
                  value={guest2.nationality}
                  onChange={(e) => setGuest2({ ...guest2, nationality: e.target.value })}
                  className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 focus:border-sky-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-700 mb-1">Estado Civil</label>
                <select
                  value={guest2.civilStatus}
                  onChange={(e) => setGuest2({ ...guest2, civilStatus: e.target.value })}
                  className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 bg-white focus:border-sky-500 font-bold"
                >
                  <option value="Casado(a)">Casado(a)</option>
                  <option value="União Estável">União Estável</option>
                  <option value="Solteiro(a)">Solteiro(a)</option>
                  <option value="Divorciado(a)">Divorciado(a)</option>
                  <option value="Viúvo(a)">Viúvo(a)</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-700 mb-1">Profissão</label>
                <input
                  type="text"
                  value={guest2.profession}
                  onChange={(e) => setGuest2({ ...guest2, profession: e.target.value })}
                  placeholder="Ex: Médica"
                  className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 focus:border-sky-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-700 mb-1">Telefone Celular</label>
                <input
                  type="text"
                  placeholder="Número de celular"
                  value={contacts.phoneMobNumber}
                  onChange={(e) => setContacts({ ...contacts, phoneMobNumber: e.target.value })}
                  className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 focus:border-sky-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-700 mb-1">WhatsApp de Emergência</label>
                <input
                  type="text"
                  placeholder="WhatsApp de contato"
                  value={contacts.phoneMob2DDD}
                  onChange={(e) => setContacts({ ...contacts, phoneMob2DDD: e.target.value })}
                  className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 focus:border-sky-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Endereço do Casal */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-sm font-extrabold text-[#014A34] uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-sky-600 rounded"></span> Endereço Residencial do Casal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-700 mb-1">CEP</label>
                <input
                  type="text"
                  value={address.cep}
                  onChange={(e) => setAddress({ ...address, cep: e.target.value })}
                  placeholder="00000-000"
                  className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 focus:border-sky-500 font-mono"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-700 mb-1">Estado (UF)</label>
                <input
                  type="text"
                  maxLength={2}
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  placeholder="Ex: GO"
                  className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 focus:border-sky-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-700 mb-1">Cidade</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  placeholder="Ex: Caldas Novas"
                  className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 focus:border-sky-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-700 mb-1">Bairro</label>
                <input
                  type="text"
                  value={address.neighborhood}
                  onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                  placeholder="Bairro"
                  className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 focus:border-sky-500"
                />
              </div>

              <div className="flex flex-col md:col-span-2">
                <label className="text-xs font-bold text-slate-700 mb-1">Logradouro / Rua</label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  placeholder="Rua, Avenida, Praça..."
                  className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 focus:border-sky-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-700 mb-1">Número</label>
                <input
                  type="text"
                  value={address.number}
                  onChange={(e) => setAddress({ ...address, number: e.target.value })}
                  placeholder="Número"
                  className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 focus:border-sky-500 font-mono"
                />
              </div>

              <div className="flex flex-col md:col-span-2">
                <label className="text-xs font-bold text-slate-700 mb-1">Complemento</label>
                <input
                  type="text"
                  value={address.complement}
                  onChange={(e) => setAddress({ ...address, complement: e.target.value })}
                  placeholder="Ex: Bloco B, Apto 502"
                  className="text-xs border border-slate-200 outline-none rounded-lg px-3 py-2 focus:border-sky-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Finalizar */}
        {currentStep === 5 && (
          <div className="space-y-5 py-2">
            <div className="p-5 bg-[#0B4A34]/5 rounded-2xl border border-[#0B4A34]/15 space-y-3">
              <h2 className="text-sm font-extrabold text-[#0B4A34] uppercase tracking-wider flex items-center gap-2">
                ✓ Resumo dos Dados Coletados
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-700">
                <div className="space-y-1">
                  <div><span className="text-slate-400 font-bold">Titular:</span> {guest1.name || "Não informado"}</div>
                  <div><span className="text-slate-400 font-bold">CPF Titular:</span> {guest1.cpf || "Não informado"}</div>
                  <div><span className="text-slate-400 font-bold">WhatsApp:</span> {contacts.mainWhatsapp || "Não informado"}</div>
                  <div><span className="text-slate-400 font-bold">Cidade:</span> {address.city || "Não informada"} - {address.state || "UF"}</div>
                </div>
                <div className="space-y-1">
                  <div><span className="text-slate-400 font-bold">Cônjuge:</span> {guest2.name || "Não informado"}</div>
                  <div><span className="text-slate-400 font-bold">CPF Cônjuge:</span> {guest2.cpf || "Não informado"}</div>
                  <div><span className="text-slate-400 font-bold">Corretor:</span> {brokerName || "Gerente Comercial"}</div>
                  <div><span className="text-slate-400 font-bold">Origem:</span> {source}</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50/70 border border-amber-200 text-amber-900 rounded-xl text-xs space-y-1">
              <strong>Pronto para Atendimento Showroom:</strong>
              <p>Ao salvar e concluir o cadastro, o casal entrará no Showroom de corretores com o status "Aguardando atendimento".</p>
            </div>
          </div>
        )}

      </div>

      {/* FOOTER WIZARD NAVIGATION CONTROLS */}
      <div className="flex justify-between items-center border-t border-slate-100 pt-5 print:hidden">
        <button
          onClick={() => {
            if (currentStep > 1) {
              setCurrentStep(prev => prev - 1);
            }
          }}
          disabled={currentStep === 1}
          type="button"
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>

        {currentStep < 5 ? (
          <button
            onClick={() => {
              if (currentStep === 2 && !guest1.name) {
                alert("Por favor, preencha pelo menos o Nome do Convidado Titular para avançar!");
                return;
              }
              setCurrentStep(prev => prev + 1);
            }}
            type="button"
            className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-black text-white bg-[#0B4A34] hover:bg-[#073022] rounded-xl shadow-lg shadow-emerald-900/15 transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            Avançar <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={() => triggerSaveAndSend(true)}
            type="button"
            className="flex items-center gap-2 px-6 py-3 text-xs font-black text-white bg-[#0B4A34] hover:bg-[#073022] rounded-xl shadow-xl shadow-emerald-900/20 hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <Check className="h-4 w-4" /> Enviar para Atendimento
          </button>
        )}
      </div>

    </div>
  );
}
