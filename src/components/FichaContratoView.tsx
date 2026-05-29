/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ReceptionRecord, SalesRecord } from "../types";
import { Printer, RefreshCw, FileCheck, CreditCard, Users, DollarSign, Edit3, HelpCircle } from "lucide-react";

interface FichaContratoViewProps {
  activeClient?: ReceptionRecord;
  activeSale?: SalesRecord;
}

export interface DependentItem {
  id: number;
  nome: string;
  dataNasc: string;
  cpf: string;
  celular: string;
  parentesco: "Pai" | "Mãe" | "Filho(a)" | "Cônjuge" | "Sogro" | "Sogra" | "";
}

export default function FichaContratoView({ activeClient, activeSale }: FichaContratoViewProps) {
  // Page 1 Sheet Inputs
  const [sala, setSala] = useState("SALA SHOWROOM - CALDAS NOVAS");
  const [captador, setCaptador] = useState("");
  const [executivoVendas, setExecutivoVendas] = useState("");

  // Personal data states
  const [titular, setTitular] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [org, setOrg] = useState("SSP");
  const [profissao, setProfissao] = useState("");
  const [nacionalidade, setNacionalidade] = useState("Brasileiro(a)");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [endereco, setEndereco] = useState("");
  const [bairro, setBairro] = useState("");
  const [cep, setCep] = useState("");
  const [telefone, setTelefone] = useState("");
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");

  // Credit Card states
  const [cardNome, setCardNome] = useState("");
  const [cardNumero, setCardNumero] = useState("");
  const [cardValidade, setCardValidade] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardCpf, setCardCpf] = useState("");

  // Payment states
  const [produto, setProduto] = useState("");
  const [valorProduto, setValorProduto] = useState("0,00");
  const [valorEntrada, setValorEntrada] = useState("0,00");
  const [parcelasEntrada, setParcelasEntrada] = useState("1");
  const [formaPagamentoEntrada, setFormaPagamentoEntrada] = useState("Cartão de Crédito");
  const [segundaParcelaEntradaData, setSegundaParcelaEntradaData] = useState("");
  const [valorSaldo, setValorSaldo] = useState("0,00");
  const [divididoEm, setDivididoEm] = useState("1");
  const [valorParcelas, setValorParcelas] = useState("0,00");
  const [formaPagamentoSaldo, setFormaPagamentoSaldo] = useState("Boleto Bancário");
  const [primeiraParcelaSaldoData, setPrimeiraParcelaSaldoData] = useState("");

  // Observations
  const [observacoes, setObservacoes] = useState("");

  // Page 2 Dependents list
  const [dependentes, setDependentes] = useState<DependentItem[]>([]);

  // Toggle editor guide helper
  const [showGuide, setShowGuide] = useState(true);

  // Monitor and update parameters whenever selected client or sale changes
  useEffect(() => {
    if (activeClient) {
      const g1 = activeClient.guest1;
      const g2 = activeClient.guest2;
      const addr = activeClient.address;
      const cont = activeClient.contacts;

      // Defaults
      setSala(activeClient.inspection?.description || "SALÃO PRINCIPAL");
      setCaptador(activeClient.sdrName || "Não Informado");
      setExecutivoVendas(activeSale?.brokerName || activeClient.brokerName || "Não Informado");

      setTitular(g1?.name || "");
      setDataNascimento(g1?.birthDate || "");
      setCpf(g1?.cpf || "");
      setRg(g1?.rg || "");
      setOrg("SSP");
      setProfissao(g1?.profession || "");
      setNacionalidade(g1?.nationality || "Brasileiro(a)");
      setCidade(addr?.city || "");
      setUf(addr?.state || "");
      
      const fullAddress = `${addr?.street || ""}${addr?.number ? ", " + addr.number : ""}${addr?.complement ? " - " + addr.complement : ""}`;
      setEndereco(fullAddress);
      setBairro(addr?.neighborhood || "");
      setCep(addr?.cep || "");
      
      const telRes = cont?.phoneResNumber ? `(${cont.phoneResDDD || "64"}) ${cont.phoneResNumber}` : "";
      setTelefone(telRes);
      
      const telMob = cont?.phoneMobNumber ? `(${cont.phoneMobDDD || "64"}) ${cont.phoneMobNumber}` : "";
      setCelular(telMob);
      
      setEmail(cont?.email || "");

      // Initial credit card guesswork based on financial status
      setCardNome(g1?.name ? g1.name.toUpperCase() : "");
      setCardNumero("");
      setCardValidade("");
      setCardCvv("");
      setCardCpf(g1?.cpf || "");

      if (activeSale) {
        setProduto(activeSale.productName || "");
        setValorProduto(activeSale.totalPrice?.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) || "0,00");
        setValorEntrada(activeSale.downPayment?.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) || "0,00");
        setParcelasEntrada("1");
        
        let methodPt = "Cartão de Crédito";
        if (activeSale.paymentMethod?.toLowerCase().includes("boleto")) methodPt = "Boleto";
        if (activeSale.paymentMethod?.toLowerCase().includes("vista")) methodPt = "Pix";
        setFormaPagamentoEntrada(methodPt);
        
        setSegundaParcelaEntradaData("");
        setValorSaldo(activeSale.remainingBalance?.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) || "0,00");
        setDivididoEm(activeSale.installmentsCount?.toString() || "1");
        setValorParcelas(activeSale.installmentValue?.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) || "0,00");
        setFormaPagamentoSaldo(activeSale.paymentMethod || "Boleto");
        
        // Due Date converter
        if (activeSale.firstDueDate) {
          const parts = activeSale.firstDueDate.split("-");
          if (parts.length === 3) {
            setPrimeiraParcelaSaldoData(`${parts[2]}/${parts[1]}/${parts[0]}`);
          } else {
            setPrimeiraParcelaSaldoData(activeSale.firstDueDate);
          }
        } else {
          setPrimeiraParcelaSaldoData("");
        }

        setObservacoes(activeSale.observations || activeClient.observations || "");
      } else {
        setProduto("Produto de Demonstração");
        setValorProduto("15.000,00");
        setValorEntrada("1.500,00");
        setParcelasEntrada("1");
        setFormaPagamentoEntrada("Cartão de Crédito");
        setSegundaParcelaEntradaData("");
        setValorSaldo("13.500,00");
        setDivididoEm("30");
        setValorParcelas("450,00");
        setFormaPagamentoSaldo("Boleto Recorrente");
        setPrimeiraParcelaSaldoData("10/06/2026");
        setObservacoes(activeClient.observations || "");
      }

      // Prepopulate list of up to 8 dependents
      const initialDeps: DependentItem[] = Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        nome: "",
        dataNasc: "",
        cpf: "",
        celular: "",
        parentesco: ""
      }));

      // Auto-assign Guest 2 (Cônjuge) to Dependent 1 which is standard behavior
      if (g2?.name) {
        initialDeps[0] = {
          id: 1,
          nome: g2.name,
          dataNasc: g2.birthDate || "",
          cpf: g2.cpf || "",
          celular: cont?.phoneMob2Number ? `(${cont.phoneMob2DDD || "64"}) ${cont.phoneMob2Number}` : telMob,
          parentesco: "Cônjuge"
        };
      }

      // Map Children to next indexes
      if (activeClient.relation?.childrenNamesAge) {
        const list = activeClient.relation.childrenNamesAge.split(",").map(x => x.trim()).filter(Boolean);
        list.forEach((childName, idx) => {
          const insertIdx = g2?.name ? idx + 1 : idx;
          if (insertIdx < 8) {
            initialDeps[insertIdx] = {
              id: insertIdx + 1,
              nome: childName,
              dataNasc: "",
              cpf: "",
              celular: "",
              parentesco: "Filho(a)"
            };
          }
        });
      }

      setDependentes(initialDeps);
    }
  }, [activeClient, activeSale]);

  const handlePrint = () => {
    window.print();
  };

  const updateDependent = (index: number, field: keyof DependentItem, value: any) => {
    setDependentes(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Interactive print control bar (HIDDEN DURING BROWSER window.print()) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 bg-sky-100 text-sky-800 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider">
              FISCAL & FINANCEIRO
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-400 text-xs font-semibold">Integridade de Dados Ativa</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mt-1">Ficha de Autorização para Emissão de Contrato</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Visualize o espelho idêntico da ficha física. Digite diretamente nos campos e clique em Imprimir para gerar as vias físicas.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center justify-center gap-1.5 border border-slate-200 text-slate-600 bg-white font-bold text-xs py-2 px-3.5 rounded-xl hover:bg-slate-50 cursor-pointer"
          >
            <HelpCircle className="h-4 w-4" /> {showGuide ? "Ocultar Guia" : "Ver Dicas"}
          </button>
          
          <button
            onClick={handlePrint}
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-xs py-2 px-5 rounded-xl shadow-lg shadow-sky-600/10 cursor-pointer transition-all"
          >
            <Printer className="h-4 w-4" /> IMPRIMIR FICHA OFICIAL (PDF)
          </button>
        </div>
      </div>

      {showGuide && (
        <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200/60 p-4 rounded-xl space-y-2 text-xs text-amber-800 print:hidden animate-in fade-in">
          <p className="font-bold flex items-center gap-1.5">
            💡 Dicas de Emissão de Contrato:
          </p>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-900/90 font-medium">
            <li>Os dados pessoais e financeiros do casal foram **vinculados automaticamente** dos módulos de Recepção e Ficha de Vendas.</li>
            <li>Qualquer modificação feita nesta tela é interativa (temporária para impressão rápida). Para persistir permanentemente, altere o cadastro original no cliente ou venda correspondente.</li>
            <li>Quando você clica em **"Imprimir Ficha Oficial"**, o sistema oculta todos os botões, menus laterais e cabeçalhos do sistema, configurando as duas páginas consecutivas perfeitamente para folhas A4.</li>
          </ul>
        </div>
      )}

      {/* STYLES FOR BROWSER PRINT LAYOUT FOR EXACT PAGE-BREAK (DOUBLE-PAGE SHEET REPLICA) */}
      <style>{`
        @media print {
          /* Hide sidebar, topbar, and control elements */
          body * {
            visibility: hidden;
          }
          
          /* Show only our document element and children */
          #lagoa-lovers-printable-contract-sheet, 
          #lagoa-lovers-printable-contract-sheet * {
            visibility: visible;
          }
          
          /* Set absolute start inside screen */
          #lagoa-lovers-printable-contract-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            margin: 0;
            background: white !important;
            box-shadow: none !important;
            border: none !important;
          }
          
          .print-break-page {
            page-break-after: always;
            break-after: page;
            height: 100%;
            margin: 0 !important;
            padding: 2.5cm 1.5cm 2cm 1.5cm !important;
            border: none !important;
            box-shadow: none !important;
          }

          /* Hide styling inputs visual frames to match empty sheet */
          input[type="text"], input[type="date"], textarea, select {
            border: none !important;
            background: transparent !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            box-shadow: none !important;
            outline: none !important;
            font-weight: bold !important;
            color: #000000 !important;
          }

          /* Hide select arrows during printing */
          select {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
          }
        }
      `}</style>

      {/* DOUBLE PAGE SYSTEM VIEWER CONTAINER */}
      <div id="lagoa-lovers-printable-contract-sheet" className="space-y-12">
        
        {/* PAGE 1: DADOS, CARTÃO E PAGAMENTO */}
        <div className="print-break-page bg-white text-slate-800 shadow-xl border border-slate-200 p-8 sm:p-12 w-full max-w-[21cm] mx-auto min-h-[29.7cm] font-sans flex flex-col relative">
          
          {/* Header page 1: Logo and Room table */}
          <div className="flex justify-between items-start border-b border-slate-100 pb-4">
            
            {/* Logo replicated */}
            <div className="flex items-center gap-3">
              <img 
                src="https://i.postimg.cc/L5SxKwZW/Whats-App-Image-2026-05-28-at-12-57-51.png" 
                alt="Lagoa Lovers" 
                className="h-14 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="leading-none">
                <span className="font-extrabold text-slate-900 text-[13px] tracking-tight block">LAGOA LOVERS</span>
                <span className="text-[9px] text-sky-600 font-bold uppercase tracking-widest mt-0.5 block">CLUBE DE FÉRIAS</span>
              </div>
            </div>

            {/* Sala info */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wider">Sala:</span>
              <input
                type="text"
                value={sala}
                onChange={(e) => setSala(e.target.value)}
                placeholder="Ex. 04 / Comercial"
                className="font-bold text-slate-800 outline-none pb-0.5 border-b border-transparent hover:border-slate-300 focus:border-sky-500 min-w-[150px] text-right"
              />
            </div>
          </div>

          {/* DOCUMENT MAIN HEADING */}
          <div className="text-center my-5 space-y-0.5">
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight uppercase">
              Autorização para Emissão de Contrato Lagoa Lovers
            </h1>
            <div className="h-0.5 w-16 bg-sky-500 mx-auto rounded-full"></div>
          </div>

          {/* MEDIATORS DATA */}
          <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-3 mb-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-600">Captador:</span>
              <input
                type="text"
                value={captador}
                onChange={(e) => setCaptador(e.target.value)}
                placeholder="Nome do sdr"
                className="font-semibold text-slate-800 outline-none flex-1 border-b border-transparent hover:border-slate-200 focus:border-sky-500"
              />
            </div>

            <div className="flex items-center gap-2 justify-end">
              <span className="font-bold text-slate-600 flex items-center gap-1">
                <span className="h-3 w-3 inline-block rounded-sm bg-sky-100 border border-sky-300"></span>
                Executivo de Vendas:
              </span>
              <input
                type="text"
                value={executivoVendas}
                onChange={(e) => setExecutivoVendas(e.target.value)}
                placeholder="Nome do corretor"
                className="font-semibold text-slate-800 outline-none w-48 border-b border-transparent hover:border-slate-200 focus:border-sky-500 text-right"
              />
            </div>
          </div>

          {/* DADOS PESSOAIS SECTION */}
          <div className="space-y-3">
            <div className="bg-slate-700 text-white font-bold text-[11px] uppercase tracking-wider px-3 py-1.5 flex justify-between items-center rounded-sm">
              <span>Dados Pessoais</span>
              <span className="text-[9px] text-slate-200 font-mono">Página 1 de 2</span>
            </div>

            <div className="grid grid-cols-12 gap-x-3 gap-y-2 text-[11px]">
              
              {/* Titular e Data de Nascimento */}
              <div className="col-span-9 flex flex-col border-b border-slate-100 pb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Titular</span>
                <input
                  type="text"
                  value={titular}
                  onChange={(e) => setTitular(e.target.value)}
                  className="font-semibold text-slate-850 p-0.5 outline-none bg-transparent"
                />
              </div>

              <div className="col-span-3 flex flex-col border-b border-slate-100 pb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Data de Nascimento</span>
                <input
                  type="text"
                  placeholder="DD/MM/AAAA"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  className="font-semibold text-slate-850 p-0.5 outline-none bg-transparent"
                />
              </div>

              {/* CPF, RG, Org, Profissao */}
              <div className="col-span-3 flex flex-col border-b border-slate-100 pb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">CPF</span>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  className="font-semibold text-slate-850 p-0.5 outline-none bg-transparent"
                />
              </div>

              <div className="col-span-3 flex flex-col border-b border-slate-100 pb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">RG</span>
                <input
                  type="text"
                  value={rg}
                  onChange={(e) => setRg(e.target.value)}
                  className="font-semibold text-slate-850 p-0.5 outline-none bg-transparent"
                />
              </div>

              <div className="col-span-2 flex flex-col border-b border-slate-100 pb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Org Emissor</span>
                <input
                  type="text"
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  className="font-semibold text-slate-850 p-0.5 outline-none bg-transparent"
                />
              </div>

              <div className="col-span-4 flex flex-col border-b border-slate-100 pb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Profissão</span>
                <input
                  type="text"
                  value={profissao}
                  onChange={(e) => setProfissao(e.target.value)}
                  className="font-semibold text-slate-850 p-0.5 outline-none bg-transparent"
                />
              </div>

              {/* Nacionalidade, Cidade, UF */}
              <div className="col-span-4 flex flex-col border-b border-slate-100 pb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Nacionalidade</span>
                <input
                  type="text"
                  value={nacionalidade}
                  onChange={(e) => setNacionalidade(e.target.value)}
                  className="font-semibold text-slate-850 p-0.5 outline-none bg-transparent"
                />
              </div>

              <div className="col-span-6 flex flex-col border-b border-slate-100 pb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Cidade</span>
                <input
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="font-semibold text-slate-850 p-0.5 outline-none bg-transparent"
                />
              </div>

              <div className="col-span-2 flex flex-col border-b border-slate-100 pb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">UF</span>
                <input
                  type="text"
                  value={uf}
                  onChange={(e) => setUf(e.target.value)}
                  className="font-semibold text-slate-850 p-0.5 outline-none bg-transparent text-center"
                />
              </div>

              {/* Endereco, Bairro */}
              <div className="col-span-8 flex flex-col border-b border-slate-100 pb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Endereço Residencial</span>
                <input
                  type="text"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  className="font-semibold text-slate-850 p-0.5 outline-none bg-transparent"
                />
              </div>

              <div className="col-span-4 flex flex-col border-b border-slate-100 pb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Bairro</span>
                <input
                  type="text"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  className="font-semibold text-slate-850 p-0.5 outline-none bg-transparent"
                />
              </div>

              {/* CEP, Telefone, Celular */}
              <div className="col-span-4 flex flex-col border-b border-slate-100 pb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">CEP</span>
                <input
                  type="text"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  className="font-semibold text-slate-850 p-0.5 outline-none bg-transparent"
                />
              </div>

              <div className="col-span-4 flex flex-col border-b border-slate-100 pb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Telefone Fixo</span>
                <input
                  type="text"
                  placeholder="(00) 0000-0000"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="font-semibold text-slate-850 p-0.5 outline-none bg-transparent"
                />
              </div>

              <div className="col-span-4 flex flex-col border-b border-slate-100 pb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Celular</span>
                <input
                  type="text"
                  placeholder="(00) 00000-0000"
                  value={celular}
                  onChange={(e) => setCelular(e.target.value)}
                  className="font-semibold text-slate-850 p-0.5 outline-none bg-transparent"
                />
              </div>

              {/* Email de acesso */}
              <div className="col-span-12 flex flex-col border-b border-slate-100 pb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">E-mail de acesso</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="font-semibold text-slate-850 p-0.5 outline-none bg-transparent"
                />
              </div>

            </div>
          </div>

          {/* SECTOR: CREDIT CARD DATA */}
          <div className="space-y-3 mt-6">
            <div className="bg-slate-700 text-white font-bold text-[11px] uppercase tracking-wider px-3 py-1.5 flex justify-between items-center rounded-sm">
              <span className="flex items-center gap-1">
                <CreditCard className="h-3.5 w-3.5" /> Informações do Cartão de Crédito e Recorrente
              </span>
            </div>

            <div className="grid grid-cols-12 gap-x-3 gap-y-2 text-[11px]">
              
              {/* Nome descrito no cartao */}
              <div className="col-span-12 flex flex-col border-b border-slate-100 pb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Nome Escrito no Cartão</span>
                <input
                  type="text"
                  placeholder="EX. MARCOS DE OLIVEIRA SILVA"
                  value={cardNome}
                  onChange={(e) => setCardNome(e.target.value)}
                  className="font-semibold text-slate-850 p-0.5 outline-none bg-transparent uppercase"
                />
              </div>

              {/* Numero do cartao, validade, cvv */}
              <div className="col-span-6 flex flex-col border-b border-slate-100 pb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Número do Cartão</span>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumero}
                  onChange={(e) => setCardNumero(e.target.value)}
                  className="font-semibold text-slate-850 p-0.5 outline-none bg-transparent"
                />
              </div>

              <div className="col-span-3 flex flex-col border-b border-slate-100 pb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Validade</span>
                <input
                  type="text"
                  placeholder="MM/AA"
                  value={cardValidade}
                  onChange={(e) => setCardValidade(e.target.value)}
                  className="font-semibold text-slate-850 p-0.5 outline-none bg-transparent text-center"
                />
              </div>

              <div className="col-span-3 flex flex-col border-b border-slate-100 pb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Código de Segurança (CVV)</span>
                <input
                  type="text"
                  placeholder="123"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  className="font-semibold text-slate-850 p-0.5 outline-none bg-transparent text-center"
                />
              </div>

              {/* CPF do titular */}
              <div className="col-span-12 flex flex-col border-b border-slate-100 pb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">CPF do Titular do Cartão</span>
                <input
                  type="text"
                  value={cardCpf}
                  onChange={(e) => setCardCpf(e.target.value)}
                  className="font-semibold text-slate-850 p-0.5 outline-none bg-transparent"
                />
              </div>

            </div>
          </div>

          {/* SECTOR: PAYMENT WAY */}
          <div className="space-y-3 mt-6">
            <div className="bg-slate-700 text-white font-bold text-[11px] uppercase tracking-wider px-3 py-1.5 flex justify-between items-center rounded-sm">
              <span className="flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5" /> Forma de Pagamento
              </span>
            </div>

            <div className="grid grid-cols-12 gap-x-3 gap-y-2 text-[11px]">
              
              {/* Produto e Valor do produto */}
              <div className="col-span-8 flex flex-col border-b border-slate-100 pb-0.5">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Produto</span>
                <input
                  type="text"
                  value={produto}
                  onChange={(e) => setProduto(e.target.value)}
                  className="font-bold text-slate-850 p-0.5 outline-none bg-transparent"
                />
              </div>

              <div className="col-span-4 flex flex-col border-b border-slate-100 pb-0.5">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Valor do Produto (R$)</span>
                <input
                  type="text"
                  value={valorProduto}
                  onChange={(e) => setValorProduto(e.target.value)}
                  className="font-bold text-slate-850 p-0.5 outline-none bg-transparent text-right"
                />
              </div>

              {/* Valor total entrada / Qtd parcelas da entrada */}
              <div className="col-span-7 flex flex-col border-b border-slate-100 pb-0.5">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Valor Total da Entrada / Sinal</span>
                <input
                  type="text"
                  value={valorEntrada}
                  onChange={(e) => setValorEntrada(e.target.value)}
                  className="font-semibold text-slate-850 p-0.5 outline-none bg-transparent"
                />
              </div>

              <div className="col-span-5 flex flex-col border-b border-slate-100 pb-0.5">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Quantidade de Parcela(s) da Entrada</span>
                <input
                  type="text"
                  value={parcelasEntrada}
                  onChange={(e) => setParcelasEntrada(e.target.value)}
                  className="font-semibold text-slate-850 p-0.5 outline-none bg-transparent text-center"
                />
              </div>

              {/* Forma de pagamento da entrada / 2a parcela da entrada */}
              <div className="col-span-12 flex flex-col border-b border-slate-100 pb-0.5">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Forma de Pagamento da Entrada / Sinal</span>
                <input
                  type="text"
                  placeholder="Ex. 1x Pix, ou Parcelado no Cartão de Crédito"
                  value={formaPagamentoEntrada}
                  onChange={(e) => setFormaPagamentoEntrada(e.target.value)}
                  className="font-semibold text-slate-850 p-0.5 outline-none bg-transparent"
                />
              </div>

              <div className="col-span-12 flex flex-col border-b border-slate-100 pb-0.5">
                <span className="text-[9px] text-slate-400 font-bold uppercase">2ª Parcela da Entrada (Data p/ passar o cartão / sinal adicional)</span>
                <input
                  type="text"
                  placeholder="Ex. Cobrar sinal recorrente em 15/06/2026 ou Em aberto"
                  value={segundaParcelaEntradaData}
                  onChange={(e) => setSegundaParcelaEntradaData(e.target.value)}
                  className="font-semibold text-slate-850 p-0.5 outline-none bg-transparent"
                />
              </div>

              {/* Valor total do saldo / Dividido em / Valor das parcelas */}
              <div className="col-span-5 flex flex-col border-b border-slate-100 pb-0.5">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Valor Total do Saldo (Financiamento)</span>
                <input
                  type="text"
                  value={valorSaldo}
                  onChange={(e) => setValorSaldo(e.target.value)}
                  className="font-semibold text-slate-850 p-0.5 outline-none bg-transparent"
                />
              </div>

              <div className="col-span-3 flex flex-col border-b border-slate-100 pb-0.5">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Dividido em</span>
                <input
                  type="text"
                  value={divididoEm}
                  onChange={(e) => setDivididoEm(e.target.value)}
                  className="font-semibold text-slate-850 p-0.5 outline-none bg-transparent text-center"
                />
              </div>

              <div className="col-span-4 flex flex-col border-b border-slate-100 pb-0.5">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Valor das Parcelas</span>
                <input
                  type="text"
                  value={valorParcelas}
                  onChange={(e) => setValorParcelas(e.target.value)}
                  className="font-semibold text-slate-850 p-0.5 outline-none bg-transparent text-right"
                />
              </div>

              {/* Forma de pagamento do saldo / 1a parcela para */}
              <div className="col-span-7 flex flex-col border-b border-slate-100 pb-0.5">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Forma de Pagamento do Saldo</span>
                <input
                  type="text"
                  value={formaPagamentoSaldo}
                  onChange={(e) => setFormaPagamentoSaldo(e.target.value)}
                  className="font-semibold text-slate-850 p-0.5 outline-none bg-transparent"
                />
              </div>

              <div className="col-span-5 flex flex-col border-b border-slate-100 pb-0.5">
                <span className="text-[9px] text-slate-400 font-bold uppercase">1ª Parcela do Saldo para</span>
                <input
                  type="text"
                  value={primeiraParcelaSaldoData}
                  onChange={(e) => setPrimeiraParcelaSaldoData(e.target.value)}
                  className="font-bold text-slate-905 p-0.5 outline-none bg-transparent text-right"
                />
              </div>

            </div>
          </div>

          {/* OBSERVATIONS AREA */}
          <div className="flex-1 flex flex-col mt-5">
            <span className="text-[9px] text-slate-400 font-bold uppercase">Observações</span>
            <textarea
              rows={4}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Digite quaisquer observações internas para a equipe de faturamento e registro de contrato..."
              className="w-full text-[11px] p-2 border border-slate-200 rounded-lg outline-none resize-none flex-1 mt-1 focus:border-sky-500"
            />
          </div>

          {/* SIGNATURE SECTION BOTTOM PAGE 1 */}
          <div className="pt-8 mt-auto border-t border-slate-100">
            <div className="flex justify-between items-center text-[10px] text-slate-500">
              <div className="w-1/2 text-left">
                <span className="font-semibold">Lagoa Lovers Empreendimentos s/a</span>
                <div className="text-[9px] text-slate-400 mt-1">Selo de Integridade Comercial Lagoa Lovers</div>
              </div>
              <div className="w-1/2 flex flex-col items-end">
                <div className="border-b border-slate-400 w-4/5 pt-6"></div>
                <div className="font-extrabold text-slate-850 mt-1 uppercase text-right">Titular Assinatura</div>
              </div>
            </div>
          </div>

        </div>

        {/* PAGE 2: DEPENDENTES DE 1 A 8 */}
        <div className="print-break-page bg-white text-slate-800 shadow-xl border border-slate-200 p-8 sm:p-12 w-full max-w-[21cm] mx-auto min-h-[29.7cm] font-sans flex flex-col relative">
          
          {/* Header page 2: Logo and Room table */}
          <div className="flex justify-between items-start border-b border-slate-100 pb-4">
            
            {/* Logo replicated */}
            <div className="flex items-center gap-3">
              <img 
                src="https://i.postimg.cc/L5SxKwZW/Whats-App-Image-2026-05-28-at-12-57-51.png" 
                alt="Lagoa Lovers" 
                className="h-14 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="leading-none">
                <span className="font-extrabold text-slate-900 text-[13px] tracking-tight block">LAGOA LOVERS</span>
                <span className="text-[9px] text-sky-600 font-bold uppercase tracking-widest mt-0.5 block">CLUBE DE FÉRIAS</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wider">Sala:</span>
              <span className="font-bold text-slate-850 p-0.5">{sala || "SALA PRINCIPAL"}</span>
            </div>
          </div>

          {/* PAGE 2 MAIN TITLE */}
          <div className="text-center my-4 space-y-0.5">
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight uppercase">
              Lista de Dependentes Autorizados
            </h1>
            <div className="h-0.5 w-16 bg-sky-500 mx-auto rounded-full"></div>
            <p className="text-[10px] text-slate-500 font-medium">Informe até 08 (oito) dependentes para vinculação aos direitos de uso do título</p>
          </div>

          {/* DEPENDENTS LOOP */}
          <div className="space-y-4 my-2 flex-1">
            
            {dependentes.map((dep, idx) => {
              return (
                <div key={dep.id} className="border border-slate-200 rounded-lg p-2.5 bg-slate-50/50 space-y-2">
                  
                  {/* Dependent Heading */}
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                    <span className="font-bold text-slate-800 text-[10.5px]">
                      Dependente 0{dep.id}:
                    </span>
                    
                    {/* Dependent inline text name input */}
                    <input
                      type="text"
                      placeholder="Nome Completo do Dependente"
                      value={dep.nome}
                      onChange={(e) => updateDependent(idx, "nome", e.target.value)}
                      className="font-bold text-slate-800 text-[11px] bg-transparent outline-none flex-1 ml-3 p-0 border-b border-transparent hover:border-slate-300 focus:border-sky-500 max-w-sm"
                    />
                  </div>

                  {/* Dependent details grid row */}
                  <div className="grid grid-cols-12 gap-2 text-[10px]">
                    <div className="col-span-3 flex flex-col border-r border-slate-200 pr-2">
                      <span className="text-[8.5px] text-slate-400 font-bold uppercase">Data Nasc:</span>
                      <input
                        type="text"
                        placeholder="DD/MM/AAAA"
                        value={dep.dataNasc}
                        onChange={(e) => updateDependent(idx, "dataNasc", e.target.value)}
                        className="font-semibold text-slate-850 p-px outline-none bg-transparent"
                      />
                    </div>

                    <div className="col-span-3 flex flex-col border-r border-slate-200 pr-2">
                      <span className="text-[8.5px] text-slate-400 font-bold uppercase">CPF:</span>
                      <input
                        type="text"
                        placeholder="000.000.000-00"
                        value={dep.cpf}
                        onChange={(e) => updateDependent(idx, "cpf", e.target.value)}
                        className="font-semibold text-slate-850 p-px outline-none bg-transparent"
                      />
                    </div>

                    <div className="col-span-3 flex flex-col border-r border-slate-200 pr-2">
                      <span className="text-[8.5px] text-slate-400 font-bold uppercase">Celular:</span>
                      <input
                        type="text"
                        placeholder="(00) 00000-0000"
                        value={dep.celular}
                        onChange={(e) => updateDependent(idx, "celular", e.target.value)}
                        className="font-semibold text-slate-850 p-px outline-none bg-transparent"
                      />
                    </div>

                    {/* Relationship checkboxes */}
                    <div className="col-span-3 flex flex-col pl-1">
                      <span className="text-[8.5px] text-slate-400 font-bold uppercase mb-1">Parentesco:</span>
                      <select
                        value={dep.parentesco}
                        onChange={(e) => updateDependent(idx, "parentesco", e.target.value as any)}
                        className="font-bold text-sky-700 bg-white border border-slate-200 rounded p-0.5 text-[9px] outline-none"
                      >
                        <option value="">Selecione...</option>
                        <option value="Pai">Pai</option>
                        <option value="Mãe">Mãe</option>
                        <option value="Filho(a)">Filho(a)</option>
                        <option value="Cônjuge">Cônjuge</option>
                        <option value="Sogro">Sogro</option>
                        <option value="Sogra">Sogra</option>
                      </select>
                    </div>

                  </div>

                  {/* Grau de Parentesco visual checks to match the printed layout identically */}
                  <div className="flex gap-2.5 text-[8.5px] font-bold text-slate-500 pt-0.5">
                    {(["Pai", "Mãe", "Filho(a)", "Cônjuge", "Sogro", "Sogra"] as const).map(pRel => {
                      const isSelected = dep.parentesco === pRel;
                      return (
                        <span
                          key={pRel}
                          onClick={() => updateDependent(idx, "parentesco", isSelected ? "" : pRel)}
                          className={`flex items-center gap-1 cursor-pointer select-none ${isSelected ? "text-sky-700 font-extrabold" : ""}`}
                        >
                          <span className={`h-3 w-3 rounded-sm flex items-center justify-center border transition-all ${
                            isSelected ? "border-sky-500 bg-sky-50 text-sky-700 font-black text-[9px]" : "border-slate-300 bg-white"
                          }`}>
                            {isSelected && "✓"}
                          </span>
                          {pRel}
                        </span>
                      );
                    })}
                  </div>

                </div>
              );
            })}

          </div>

          {/* SIGNATURE SECTION BOTTOM PAGE 2 */}
          <div className="pt-10 mt-auto border-t border-slate-100">
            <div className="flex justify-between items-center text-[10px] text-slate-500">
              <div className="w-1/2 text-left">
                <span className="font-semibold">Lagoa Lovers Empreendimentos s/a</span>
                <div className="text-[9px] text-slate-400 mt-1">Vias e Lista de Dependentes Certificados</div>
              </div>
              <div className="w-1/2 flex flex-col items-end">
                <div className="border-b border-slate-400 w-4/5 pt-6"></div>
                <div className="font-extrabold text-slate-850 mt-1 uppercase text-right">Titular Assinatura</div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
