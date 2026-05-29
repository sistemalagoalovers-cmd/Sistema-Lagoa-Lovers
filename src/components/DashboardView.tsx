/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import {
  ReceptionRecord,
  AtendimentoRecord,
  SalesRecord,
  Product,
  CoupleSource,
  LodgingPlace,
  CaptationPlace,
  AttendanceStatus,
  PaymentMethod
} from "../types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Users, 
  Presentation, 
  TrendingUp, 
  FileText, 
  Filter, 
  RefreshCw, 
  PieChart as PieIcon, 
  MapPin, 
  Compass, 
  DollarSign 
} from "lucide-react";

interface DashboardViewProps {
  receptions: ReceptionRecord[];
  atendimentos: AtendimentoRecord[];
  sales: SalesRecord[];
  products?: Product[];
}

const COLORS = ["#0284c7", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#3b82f6"];

export default function DashboardView({ receptions, atendimentos, sales, products = [] }: DashboardViewProps) {
  // Filters
  const [filterDateStart, setFilterDateStart] = useState("");
  const [filterDateEnd, setFilterDateEnd] = useState("");
  const [filterBroker, setFilterBroker] = useState("");
  const [filterSource, setFilterSource] = useState("");
  const [filterLodging, setFilterLodging] = useState("");
  const [filterCaptation, setFilterCaptation] = useState("");
  const [filterProduct, setFilterProduct] = useState("");

  const resetFilters = () => {
    setFilterDateStart("");
    setFilterDateEnd("");
    setFilterBroker("");
    setFilterSource("");
    setFilterLodging("");
    setFilterCaptation("");
    setFilterProduct("");
  };

  // List of unique brokers for filter
  const brokers = useMemo(() => {
    const list = new Set<string>();
    receptions.forEach(r => { if (r.brokerName) list.add(r.brokerName); });
    return Array.from(list);
  }, [receptions]);

  // Filtered Receptions
  const filteredReceptions = useMemo(() => {
    return receptions.filter(r => {
      if (filterDateStart && r.presentationDate < filterDateStart) return false;
      if (filterDateEnd && r.presentationDate > filterDateEnd) return false;
      if (filterBroker && r.brokerName !== filterBroker) return false;
      if (filterSource && r.source !== filterSource) return false;
      if (filterLodging && r.lodging !== filterLodging) return false;
      if (filterCaptation && r.captationPlace !== filterCaptation) return false;
      return true;
    });
  }, [receptions, filterDateStart, filterDateEnd, filterBroker, filterSource, filterLodging, filterCaptation]);

  // Filtered Sales
  const filteredSales = useMemo(() => {
    return sales.filter(s => {
      // Find matching reception to check secondary filters
      const rc = receptions.find(r => r.id === s.receptionId);
      if (filterDateStart && s.date < filterDateStart) return false;
      if (filterDateEnd && s.date > filterDateEnd) return false;
      if (filterBroker && s.brokerName !== filterBroker) return false;
      if (filterProduct && s.productId !== filterProduct) return false;
      
      if (rc) {
        if (filterSource && rc.source !== filterSource) return false;
        if (filterLodging && rc.lodging !== filterLodging) return false;
        if (filterCaptation && rc.captationPlace !== filterCaptation) return false;
      } else {
        // If no linked reception, exclude if filtering on these
        if (filterSource || filterLodging || filterCaptation) return false;
      }
      return true;
    });
  }, [sales, receptions, filterDateStart, filterDateEnd, filterBroker, filterProduct, filterSource, filterLodging, filterCaptation]);

  // Filtered Atendimentos
  const filteredAtendimentos = useMemo(() => {
    return atendimentos.filter(a => {
      const rc = receptions.find(r => r.id === a.receptionId);
      if (filterDateStart && a.date < filterDateStart) return false;
      if (filterDateEnd && a.date > filterDateEnd) return false;
      if (filterBroker && a.brokerName !== filterBroker) return false;
      if (rc) {
        if (filterSource && rc.source !== filterSource) return false;
        if (filterLodging && rc.lodging !== filterLodging) return false;
        if (filterCaptation && rc.captationPlace !== filterCaptation) return false;
      }
      return true;
    });
  }, [atendimentos, receptions, filterBroker, filterDateStart, filterDateEnd, filterSource, filterLodging, filterCaptation]);

  // KPIs
  const totalCasais = filteredReceptions.length;
  const totalApresentacoes = filteredAtendimentos.filter(a => a.attended && a.presentationDone).length;
  const totalVendas = filteredSales.length;
  const valorVendido = filteredSales.reduce((acc, s) => acc + s.totalPrice, 0);
  const totalContratos = filteredSales.filter(s => s.contractStatus === "Contrato Gerado" || s.contractStatus === "Contrato Assinado").length;

  const conversaoGeral = totalApresentacoes > 0 ? ((totalVendas / totalApresentacoes) * 100).toFixed(1) + "%" : "0.0%";

  // Conversion per broker
  const brokerConversionData = useMemo(() => {
    const map: Record<string, { broker: string; presentations: number; sales: number }> = {};
    
    // Sum presentations
    filteredAtendimentos.forEach(a => {
      if (!a.brokerName) return;
      if (!map[a.brokerName]) map[a.brokerName] = { broker: a.brokerName, presentations: 0, sales: 0 };
      if (a.attended && a.presentationDone) {
        map[a.brokerName].presentations += 1;
      }
    });

    // Sum sales
    filteredSales.forEach(s => {
      if (!s.brokerName) return;
      if (!map[s.brokerName]) map[s.brokerName] = { broker: s.brokerName, presentations: 0, sales: 0 };
      map[s.brokerName].sales += 1;
    });

    return Object.values(map).map(item => {
      const convRate = item.presentations > 0 ? Math.round((item.sales / item.presentations) * 100) : 0;
      return {
        ...item,
        Conversão: convRate,
        Vendas: item.sales,
        Apresentações: item.presentations
      };
    });
  }, [filteredAtendimentos, filteredSales]);

  // Sales per product
  const salesByProductData = useMemo(() => {
    const map: Record<string, { name: string; value: number }> = {};
    filteredSales.forEach(s => {
      if (!map[s.productName]) map[s.productName] = { name: s.productName, value: 0 };
      map[s.productName].value += s.totalPrice;
    });
    return Object.values(map);
  }, [filteredSales]);

  // Origin distribution (Origem)
  const sourceData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredReceptions.forEach(r => {
      map[r.source] = (map[r.source] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredReceptions]);

  // Captation places distribution
  const captationData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredReceptions.forEach(r => {
      map[r.captationPlace] = (map[r.captationPlace] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredReceptions]);

  // Sales by payment methods
  const paymentMethodData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredSales.forEach(s => {
      map[s.paymentMethod] = (map[s.paymentMethod] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredSales]);

  // Attendance status distribution
  const statusCounts = useMemo(() => {
    const map: Record<string, number> = {};
    filteredReceptions.forEach(r => {
      map[r.status] = (map[r.status] || 0) + 1;
    });
    return map;
  }, [filteredReceptions]);

  return (
    <div className="space-y-6">
      {/* Header and Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Painel Geral</h1>
          <p className="text-sm text-slate-500">Indicadores de desempenho e acompanhamento em tempo real</p>
        </div>
        <button 
          onClick={resetFilters} 
          className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-800 font-medium px-3 py-1.5 border border-sky-100 rounded-lg hover:bg-sky-50 transition-colors"
        >
          <RefreshCw className="h-3 w-3" /> Limpar Filtros
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Date From */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
            <Filter className="h-3 w-3 text-slate-400" /> Início
          </label>
          <input
            type="date"
            value={filterDateStart}
            onChange={(e) => setFilterDateStart(e.target.value)}
            className="text-xs border border-slate-200 outline-none rounded-lg px-2.5 py-1.5 focus:border-sky-500"
          />
        </div>

        {/* Date To */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
            <Filter className="h-3 w-3 text-slate-400" /> Fim
          </label>
          <input
            type="date"
            value={filterDateEnd}
            onChange={(e) => setFilterDateEnd(e.target.value)}
            className="text-xs border border-slate-200 outline-none rounded-lg px-2.5 py-1.5 focus:border-sky-500"
          />
        </div>

        {/* Broker Select */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-slate-500 mb-1">Corretor</label>
          <select
            value={filterBroker}
            onChange={(e) => setFilterBroker(e.target.value)}
            className="text-xs border border-slate-200 outline-none rounded-lg px-2 py-1.5 focus:border-sky-500 bg-white"
          >
            <option value="">Todos</option>
            {brokers.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Source Select */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-slate-500 mb-1">Origem</label>
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="text-xs border border-slate-200 outline-none rounded-lg px-2 py-1.5 focus:border-sky-500 bg-white"
          >
            <option value="">Todas</option>
            {Object.values(CoupleSource).map(src => (
              <option key={src} value={src}>{src}</option>
            ))}
          </select>
        </div>

        {/* Lodging Select */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-slate-500 mb-1">Hospedagem</label>
          <select
            value={filterLodging}
            onChange={(e) => setFilterLodging(e.target.value)}
            className="text-xs border border-slate-200 outline-none rounded-lg px-2 py-1.5 focus:border-sky-500 bg-white"
          >
            <option value="">Todas</option>
            {Object.values(LodgingPlace).map(place => (
              <option key={place} value={place}>{place}</option>
            ))}
          </select>
        </div>

        {/* Captation Place */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-slate-500 mb-1">Captação</label>
          <select
            value={filterCaptation}
            onChange={(e) => setFilterCaptation(e.target.value)}
            className="text-xs border border-slate-200 outline-none rounded-lg px-2 py-1.5 focus:border-sky-500 bg-white"
          >
            <option value="">Todas</option>
            {Object.values(CaptationPlace).map(place => (
              <option key={place} value={place}>{place}</option>
            ))}
          </select>
        </div>

        {/* Product Select */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-slate-500 mb-1">Produto</label>
          <select
            value={filterProduct}
            onChange={(e) => setFilterProduct(e.target.value)}
            className="text-xs border border-slate-200 outline-none rounded-lg px-2 py-1.5 focus:border-sky-500 bg-white"
          >
            <option value="">Todos</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Total Registrations */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="bg-sky-50 p-2.5 rounded-lg text-sky-600">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Casais Cadastrados</p>
            <h3 className="text-lg font-bold text-slate-800">{totalCasais}</h3>
          </div>
        </div>

        {/* Total Presentations */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="bg-indigo-50 p-2.5 rounded-lg text-indigo-600">
            <Presentation className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Apresentações</p>
            <h3 className="text-lg font-bold text-slate-800">{totalApresentacoes}</h3>
          </div>
        </div>

        {/* Total Sales */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="bg-emerald-50 p-2.5 rounded-lg text-emerald-600">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Vendas Fechadas</p>
            <h3 className="text-lg font-bold text-slate-800">{totalVendas}</h3>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="bg-amber-50 p-2.5 rounded-lg text-amber-600">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Valor total em Vendas</p>
            <h3 className="text-lg font-bold text-slate-800">
              {valorVendido.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </h3>
          </div>
        </div>

        {/* Conversion rate */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="bg-teal-50 p-2.5 rounded-lg text-teal-600">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Conversão de Atend.</p>
            <h3 className="text-lg font-bold text-slate-800">{conversaoGeral}</h3>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales by Product */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm col-span-1 lg:col-span-2 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-sky-500" /> Faturamento por Produto Comercializado
            </h2>
            <span className="text-[10px] font-semibold bg-sky-50 text-sky-600 px-2 py-0.5 rounded-full">Financeiro</span>
          </div>
          <div className="w-full h-64">
            {salesByProductData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-xs text-slate-400">Nenhum dado selecionado neste período</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesByProductData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} interval={0} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <Tooltip formatter={(value) => Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} />
                  <Bar dataKey="value" fill="#0284c7" radius={[4, 4, 0, 0]} label={{ position: 'top', fontSize: 9, fill: "#334155" }} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Status Division */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5">
              <PieIcon className="h-4 w-4 text-emerald-500" /> Status do Fluxo de Atendimento
            </h2>
            <div className="space-y-3">
              {Object.values(AttendanceStatus).map((status, idx) => {
                const count = statusCounts[status] || 0;
                const percentage = totalCasais > 0 ? ((count / totalCasais) * 100).toFixed(0) : 0;
                
                let colorClass = "bg-slate-100 text-slate-600";
                if (status === AttendanceStatus.VENDA_LANCADA) colorClass = "bg-emerald-50 text-emerald-600";
                if (status === AttendanceStatus.CONTRATO_GERADO) colorClass = "bg-sky-50 text-sky-600";
                if (status === AttendanceStatus.EM_ATENDIMENTO) colorClass = "bg-amber-50 text-amber-600";
                if (status === AttendanceStatus.VENDA_CANCELADA) colorClass = "bg-red-50 text-red-600";

                return (
                  <div key={status} className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 font-medium">{status}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full ${
                            status === AttendanceStatus.VENDA_LANCADA ? "bg-emerald-500" :
                            status === AttendanceStatus.CONTRATO_GERADO ? "bg-sky-500" :
                            status === AttendanceStatus.EM_ATENDIMENTO ? "bg-amber-500" :
                            status === AttendanceStatus.VENDA_CANCELADA ? "bg-red-500" : "bg-slate-400"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className={`px-2 py-0.5 rounded-full font-bold ${colorClass}`}>
                        {count} ({percentage}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="border-t border-slate-50 pt-3 text-[11px] text-slate-400 text-center">
            Total de {totalCasais} casais ativos no pipeline
          </div>
        </div>
      </div>

      {/* Secondary Row (Origin + Captação + Conversion) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Source breakdown */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between h-80">
          <h2 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5">
            <Compass className="h-4 w-4 text-indigo-500" /> Origem Captação (Distribuição)
          </h2>
          <div className="flex-1 min-h-[160px] flex items-center justify-center">
            {sourceData.length === 0 ? (
              <span className="text-xs text-slate-400">Nenhum dado cadastrado</span>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="flex flex-wrap gap-2 justify-center text-[10px] text-slate-500 font-medium">
            {sourceData.map((item, index) => (
              <span key={item.name} className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                {item.name}: {item.value}
              </span>
            ))}
          </div>
        </div>

        {/* Location of Captation */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between h-80">
          <h2 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-indigo-500" /> Local de Abordagem / Captação
          </h2>
          <div className="flex-1 min-h-[160px] flex items-center justify-center">
            {captationData.length === 0 ? (
              <span className="text-xs text-slate-400">Nenhum dado cadastrado</span>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={captationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={65}
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {captationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="flex flex-wrap gap-2 justify-center text-[10px] text-slate-500 font-medium">
            {captationData.map((item, index) => (
              <span key={item.name} className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[(index + 3) % COLORS.length] }} />
                {item.name}: {item.value}
              </span>
            ))}
          </div>
        </div>

        {/* Conversion Rate by Broker */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between h-80 overflow-y-auto">
          <div>
            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-500" /> Taxa de Conversão por Corretor
            </h2>
            <div className="space-y-3.5">
              {brokerConversionData.length === 0 ? (
                <div className="text-center text-xs text-slate-400 py-8">Nenhum corretor com atendimentos no momento.</div>
              ) : (
                brokerConversionData.map(item => (
                  <div key={item.broker} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700">{item.broker}</span>
                      <span className="text-sky-600 font-bold">{item.Conversão}% <span className="text-slate-400 font-normal">({item.Vendas} v / {item.Apresentações} ap)</span></span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-sky-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${item.Conversão}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="text-[10px] text-slate-400 italic text-center pt-2">
            Taxa Calculada: (Vendas / Apresentações realizadas)
          </div>
        </div>
      </div>
    </div>
  );
}
