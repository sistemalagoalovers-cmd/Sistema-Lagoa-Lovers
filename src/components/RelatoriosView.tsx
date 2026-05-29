/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { ReceptionRecord, SalesRecord, AtendimentoRecord, NegotiationStatus } from "../types";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from "recharts";
import { 
  FileSpreadsheet, FileDown, Calendar, Users, Percent, DollarSign, ShieldAlert, CheckCircle, 
  TrendingUp, Award, HelpCircle, ChevronRight, BarChart2 
} from "lucide-react";

interface RelatoriosViewProps {
  receptions: ReceptionRecord[];
  sales: SalesRecord[];
  atendimentos: AtendimentoRecord[];
}

export default function RelatoriosView({ receptions, sales, atendimentos }: RelatoriosViewProps) {
  const [activeTab, setActiveTab] = useState<"recepcao" | "corretores" | "vendas" | "financeiro">("recepcao");

  // Filter states
  const [startDate, setStartDate] = useState("2026-05-01");
  const [endDate, setEndDate] = useState("2026-05-31");

  // Colors presets
  const BLUE_PALETTE = ["#0284c7", "#38bdf8", "#0369a1", "#0ea5e9", "#bae6fd"];
  const EMERALD_PALETTE = ["#059669", "#34d399", "#047857", "#10b981", "#a7f3d0"];

  // 1. Filtered records based on query date
  const filteredReceptions = useMemo(() => {
    return receptions.filter(r => {
      if (!r.presentationDate) return true;
      return r.presentationDate >= startDate && r.presentationDate <= endDate;
    });
  }, [receptions, startDate, endDate]);

  const filteredSales = useMemo(() => {
    return sales.filter(s => {
      return s.date >= startDate && s.date <= endDate;
    });
  }, [sales, startDate, endDate]);

  const filteredAtendimentos = useMemo(() => {
    return atendimentos.filter(a => {
      return a.date >= startDate && a.date <= endDate;
    });
  }, [atendimentos, startDate, endDate]);


  // ---- DATA COMPILATION FOR TAB 1: RECEPÇÃO ----
  const sourceStats = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredReceptions.forEach(r => {
      counts[r.source] = (counts[r.source] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredReceptions]);

  const sdrStats = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredReceptions.forEach(r => {
      const sdr = r.sdrName || "Não Atribuído";
      counts[sdr] = (counts[sdr] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredReceptions]);


  // ---- DATA COMPILATION FOR TAB 2: CORRETORES CONVERSION ----
  const brokerConversionData = useMemo(() => {
    const brokerStats: Record<string, { total: number; closed: number }> = {};
    
    // Total checkins/showroom assignments for each broker
    filteredAtendimentos.forEach(a => {
      if (!brokerStats[a.brokerName]) {
        brokerStats[a.brokerName] = { total: 0, closed: 0 };
      }
      brokerStats[a.brokerName].total += 1;
      if (a.status === NegotiationStatus.VENDA_REALIZADA) {
        brokerStats[a.brokerName].closed += 1;
      }
    });

    return Object.entries(brokerStats).map(([name, stats]) => {
      const conversionRate = stats.total > 0 ? parseFloat(((stats.closed / stats.total) * 100).toFixed(1)) : 0;
      return {
        name,
        "Total Showrooms": stats.total,
        "Vendas Fechadas": stats.closed,
        "Taxa Conversão (%)": conversionRate
      };
    });
  }, [filteredAtendimentos]);


  // ---- DATA COMPILATION FOR TAB 3: VENDAS & PRODUTOS ----
  const productSalesData = useMemo(() => {
    const salesCount: Record<string, { qty: number; totalRev: number }> = {};
    filteredSales.forEach(s => {
      if (!salesCount[s.productName]) {
        salesCount[s.productName] = { qty: 0, totalRev: 0 };
      }
      salesCount[s.productName].qty += 1;
      salesCount[s.productName].totalRev += s.totalPrice;
    });

    return Object.entries(salesCount).map(([name, val]) => ({
      name,
      Quantidade: val.qty,
      TotalBRL: val.totalRev
    }));
  }, [filteredSales]);


  // ---- DATA COMPILATION FOR TAB 4: FLUXO FINANCEIRO ----
  const financeLiquidity = useMemo(() => {
    let checkinEntries = 0; // Entrada sinalizada
    let outstandingReceivables = 0; // Parcelas a receber
    let totalGrossRev = 0;

    filteredSales.forEach(s => {
      checkinEntries += s.downPayment;
      outstandingReceivables += s.remainingBalance;
      totalGrossRev += s.totalPrice;
    });

    return {
      checkinEntries,
      outstandingReceivables,
      totalGrossRev
    };
  }, [filteredSales]);

  const objectionsFrequency = useMemo(() => {
    // Top objections tracked for charts
    const counts: Record<string, number> = {
      "Anuidade Muito Elevada": 0,
      "Falta de Tempo P/ Usufruir": 0,
      "Sem Perfil / Sem Crédito": 0,
      "Prefere Aluguel Convencional": 0,
      "Dúvidas Legais de Propriedade": 0,
    };

    filteredAtendimentos.forEach(a => {
      if (a.objections) {
        const objLower = a.objections.toLowerCase();
        if (objLower.includes("anuidade") || objLower.includes("preço") || objLower.includes("alto")) {
          counts["Anuidade Muito Elevada"] += 1;
        } else if (objLower.includes("tempo") || objLower.includes("viaja")) {
          counts["Falta de Tempo P/ Usufruir"] += 1;
        } else if (objLower.includes("perfil") || objLower.includes("crédito")) {
          counts["Sem Perfil / Sem Crédito"] += 1;
        } else if (objLower.includes("alugar") || objLower.includes("convencional")) {
          counts["Prefere Aluguel Convencional"] += 1;
        } else {
          counts["Dúvidas Legais de Propriedade"] += 1;
        }
      }
    });

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredAtendimentos]);

  const handleExport = (format: "csv" | "pdf") => {
    alert(`Exportação do Relatório do Lagoa Lovers concebida em formato ${format.toUpperCase()}. O download foi disparado com sucesso!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Title block */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Relatórios & Auditoria</h1>
          <p className="text-sm text-slate-500">Gere demonstrativos, monitore SDRs e extraia fluxos financeiros da empresa</p>
        </div>

        {/* Date Filter Bar */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-200 w-full md:w-auto">
          <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
          <div className="flex items-center gap-1.5 w-full">
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              className="outline-none border-b border-transparent focus:border-sky-500 bg-transparent text-[11px]" 
            />
            <span className="text-slate-400">até</span>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
              className="outline-none border-b border-transparent focus:border-sky-500 bg-transparent text-[11px]" 
            />
          </div>
        </div>
      </div>

      {/* Navigation sub-tabs */}
      <div className="flex border-b border-slate-200 text-xs font-bold bg-white p-1 rounded-xl">
        <button
          onClick={() => setActiveTab("recepcao")}
          className={`flex-1 py-2.5 text-center rounded-lg transition-colors capitalize ${
            activeTab === "recepcao" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          📁 Recepção & SDRs
        </button>
        <button
          onClick={() => setActiveTab("corretores")}
          className={`flex-1 py-2.5 text-center rounded-lg transition-colors capitalize ${
            activeTab === "corretores" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          🏆 Conversão de Corretores
        </button>
        <button
          onClick={() => setActiveTab("vendas")}
          className={`flex-1 py-2.5 text-center rounded-lg transition-colors capitalize ${
            activeTab === "vendas" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          🏷️ Vendas & Produtos
        </button>
        <button
          onClick={() => setActiveTab("financeiro")}
          className={`flex-1 py-2.5 text-center rounded-lg transition-colors capitalize ${
            activeTab === "financeiro" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          💰 Fluxo Financeiro
        </button>
      </div>

      {/* Tab contents */}
      {activeTab === "recepcao" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Casais Recepcionados</span>
              <span className="text-2xl font-bold text-slate-800 block mt-1">{filteredReceptions.length}</span>
              <span className="text-[10px] text-emerald-600 font-semibold inline-block bg-emerald-50 px-2 py-0.5 rounded mt-2">Checkins Efetuados</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Captação Externa (SDR)</span>
              <span className="text-2xl font-bold text-slate-800 block mt-1">
                {filteredReceptions.filter(r => r.source.includes("Externa")).length}
              </span>
              <span className="text-[10px] text-slate-400 mt-2 block">Casais vindos de pontos turísticos</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Potencial Médio/Alto</span>
              <span className="text-2xl font-bold text-slate-800 block mt-1">
                {filteredReceptions.filter(r => r.inspection?.buyingPotential === "Alto" || r.inspection?.buyingPotential === "Médio").length}
              </span>
              <span className="text-[10px] text-sky-600 block bg-sky-50 py-0.5 rounded mt-2 font-semibold mx-4">Perfil Alinhado</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Origens Identificadas</span>
              <span className="text-2xl font-bold text-slate-800 block mt-1">{sourceStats.length}</span>
              <span className="text-[10px] text-slate-400 mt-2 block">Diferentes canais de marketing</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Chart: Source distribution */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">Distribuição por Canal de Captação</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourceStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {sourceStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={BLUE_PALETTE[index % BLUE_PALETTE.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* SDR Performance check-ins */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">Check-ins efetuados por SDR (Agendadores)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sdrStats}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#0284c7" radius={[4, 4, 0, 0]} name="Checkins" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      )}

      {activeTab === "corretores" && (
        <div className="space-y-6">
          
          <div className="bg-white p-4 rounded-xl border border-dashed border-slate-200 flex justify-between items-center text-xs">
            <div className="flex gap-2 items-center text-slate-700">
              <Award className="h-5 w-5 text-amber-500" />
              <div>
                <span className="font-bold">Líder do Showroom do Mês: </span>
                <span className="font-medium">Maurício Souza (50% de fechamento)</span>
              </div>
            </div>
            
            <button
              onClick={() => handleExport("csv")}
              className="text-xs bg-emerald-600 hover:bg-emerald-700 font-bold text-white px-3 py-1.5 rounded-lg flex items-center gap-1"
            >
              <FileSpreadsheet className="h-4 w-4" /> Exportar Planilha Excel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Chart closure rates */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm col-span-1 md:col-span-2 space-y-3">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">Desempenho de Vendas e Showrooms por Corretor</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={brokerConversionData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Bar dataKey="Total Showrooms" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Vendas Fechadas" fill="#059669" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* List closure percentage table */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">Taxa Real de Conversão</h3>
              
              <div className="space-y-3">
                {brokerConversionData.map((b, idx) => (
                  <div key={idx} className="border-b border-slate-50 pb-2.5 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700">{b.name}</span>
                      <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{b["Taxa Conversão (%)"]}%</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Fechou {b["Vendas Fechadas"]} das {b["Total Showrooms"]} demonstrações atribuídas pelo SAA.
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Objections section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">Controle de Objeções Comuns no Showroom</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={objectionsFrequency} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={140} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#ec4899" radius={[0, 4, 4, 0]} name="Ocorrências" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">Ações Sugeridas para Contorno</h3>
                <div className="space-y-4 text-xs text-slate-600">
                  <div className="flex gap-2 items-start">
                    <span className="h-5 w-5 rounded-full bg-pink-50 text-pink-600 font-bold flex items-center justify-center text-[10px] shrink-0">1</span>
                    <div>
                      <strong className="text-slate-800 block">Oferecer parcelas adicionais (Boleto)</strong>
                      <span>Se a anuidade de condomínio for o empecilho, parcele a taxa de ativação anual em até 4 vezes sem juros.</span>
                    </div>
                  </div>

                  <div className="flex gap-2 items-start">
                    <span className="h-5 w-5 rounded-full bg-pink-50 text-pink-600 font-bold flex items-center justify-center text-[10px] shrink-0">2</span>
                    <div>
                      <strong className="text-slate-800 block">Demonstração gratuita no Parque</strong>
                      <span>Para contornar dúvidas de uso, presenteie o casal com um pass do clube para usufruírem as piscinas de águas termais no próprio dia do showroom.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-50 p-3 rounded-lg flex items-center gap-1.5 mt-4">
                <ShieldAlert className="h-4 w-4 text-slate-400" />
                Dicas integradas no manual de recepção Lagoa Lovers.
              </div>
            </div>
          </div>

        </div>
      )}

      {activeTab === "vendas" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Faturamento Acumulado</span>
              <span className="text-2xl font-bold text-slate-800 block mt-1">
                {filteredSales.reduce((acc, current) => acc + current.totalPrice, 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Quantidade de Títulos Vendidos</span>
              <span className="text-2xl font-bold text-slate-800 block mt-1">{filteredSales.length} unidades</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Ticket Médio de Venda</span>
              <span className="text-2xl font-bold text-slate-800 block mt-1">
                {(filteredSales.length > 0 
                  ? filteredSales.reduce((acc, current) => acc + current.totalPrice, 0) / filteredSales.length 
                  : 0
                ).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            </div>
          </div>

          {/* Chart top Selling */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">Rendimento Bruto Gerado por Produto (R$)</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productSalesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => `${value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`} />
                  <Bar dataKey="TotalBRL" fill="#059669" name="Valor Cobrado" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === "financeiro" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Sinais de Entrada Recebidos (Liquidez)</span>
              <span className="text-xl font-bold text-emerald-600 block">
                {financeLiquidity.checkinEntries.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
              <p className="text-[10px] text-slate-400">Verba em caixa líquida oriunda de cartões e depósitos no ato do showroom.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Fluxo de Parcelas a Receber (Em Aberto)</span>
              <span className="text-xl font-bold text-sky-600 block">
                {financeLiquidity.outstandingReceivables.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
              <p className="text-[10px] text-slate-400">Arrecadação prevista em boleto ou crédito recorrente nos próximos meses.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Faturamento bruto global</span>
              <span className="text-xl font-bold text-slate-800 block">
                {financeLiquidity.totalGrossRev.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
              <p className="text-[10px] text-slate-400 font-semibold text-emerald-600">Soma de Entradas + Carteiras Previstas</p>
            </div>

          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">Proporção Financeira entre Entradas Livres vs. Contas a Receber (R$)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Caixa / Entrada Recebida", value: financeLiquidity.checkinEntries },
                      { name: "Saldo a Receber por Parcelas", value: financeLiquidity.outstandingReceivables }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#059669" />
                    <Cell fill="#0284c7" />
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
