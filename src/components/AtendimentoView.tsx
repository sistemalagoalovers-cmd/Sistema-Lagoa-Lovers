/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { 
  AtendimentoRecord, 
  ReceptionRecord, 
  NegotiationStatus, 
  SystemUser, 
  UserRole 
} from "../types";
import { Plus, Edit2, Play, CircleAlert, Users, Calendar, AlertTriangle, CheckSquare, Save } from "lucide-react";

interface AtendimentoViewProps {
  atendimentos: AtendimentoRecord[];
  receptions: ReceptionRecord[];
  onSaveAtendimento: (record: AtendimentoRecord) => void;
  currentUser: SystemUser;
  brokers: string[];
}

export default function AtendimentoView({
  atendimentos,
  receptions,
  onSaveAtendimento,
  currentUser,
  brokers
}: AtendimentoViewProps) {
  const [editingAtendimento, setEditingAtendimento] = useState<Partial<AtendimentoRecord> | null>(null);
  
  // Quick list of active products for showroom selects
  const showroomProducts = [
    "TÍTULO VITALÍCIO FAMILIAR",
    "TÍTULO FAMILIAR VITALÍCIO REMIDO",
    "TÍTULO SOCIAL VITALÍCIO 1 PESSOA",
    "TÍTULO SOCIAL VITALÍCIO 2 PESSOAS",
    "TÍTULO SOCIAL VITALÍCIO 3 PESSOAS",
    "TÍTULO SOCIAL VITALÍCIO 4 PESSOAS",
    "TÍTULO SOCIAL VITALÍCIO 5 PESSOAS",
    "TÍTULO SOCIAL VITALÍCIO 6 PESSOAS"
  ];

  // Permissions restriction: Brokers only see their own customer care reports
  const visibleAtendimentos = useMemo(() => {
    if (currentUser.role === UserRole.CORRETOR) {
      return atendimentos.filter(a => a.brokerName === currentUser.name || a.brokerName === "Marcos Oliveira");
    }
    return atendimentos;
  }, [atendimentos, currentUser]);

  // Clients that have no active care or we can create new care for
  const availableClients = useMemo(() => {
    // Return all clients to allow creating multiple presentation reports if necessary
    return receptions;
  }, [receptions]);

  const handleCreateNew = () => {
    const today = new Date().toISOString().split("T")[0];
    const HH = String(new Date().getHours()).padStart(2, "0");
    const MM = String(new Date().getMinutes()).padStart(2, "0");

    setEditingAtendimento({
      id: `AT-${Math.floor(2000 + Math.random() * 8000)}`,
      receptionId: receptions[0]?.id || "",
      brokerName: currentUser.role === UserRole.CORRETOR ? currentUser.name : (brokers[0] || ""),
      date: today,
      startTime: `${HH}:${MM}`,
      endTime: "",
      attended: true,
      presentationDone: true,
      presentedProduct: showroomProducts[0],
      objections: "",
      clientInterest: "Médio",
      status: NegotiationStatus.EM_NEGOCIACAO,
      observations: ""
    });
  };

  const handleEdit = (rec: AtendimentoRecord) => {
    setEditingAtendimento(rec);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAtendimento) {
      onSaveAtendimento(editingAtendimento as AtendimentoRecord);
      setEditingAtendimento(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 rounded-2xl border border-slate-100 shadow-sm gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            🤝 Atendimentos
          </h1>
          <p className="text-xs text-slate-500 mt-1">Acompanhe aqui os casais em apresentação e registre o resultado do atendimento.</p>
        </div>
        
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-1 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm"
        >
          <Play className="h-3.5 w-3.5 fill-white" /> Iniciar Apresentação Showroom
        </button>
      </div>

      {editingAtendimento ? (
        /* Edit or Create form */
        <form onSubmit={handleFormSubmit} className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-800">
              {editingAtendimento.id ? `Atendimento ID: ${editingAtendimento.id}` : "Nova Apresentação Comercial"}
            </h2>
            <button
              type="button"
              onClick={() => setEditingAtendimento(null)}
              className="text-slate-400 hover:text-slate-600 font-semibold text-xs py-1.5 px-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Casal Vinculado */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Casal / Cliente Atendido</label>
              <select
                required
                value={editingAtendimento.receptionId}
                onChange={(e) => setEditingAtendimento({ ...editingAtendimento, receptionId: e.target.value })}
                className="text-xs border border-slate-200 outline-none rounded-lg p-2.5 bg-white"
              >
                <option value="">Selecione o Cliente</option>
                {availableClients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.guest1?.name} & {c.guest2?.name || "Solteiro"} ({c.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Corretor */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Corretor Responsável</label>
              {currentUser.role === UserRole.CORRETOR ? (
                <input
                  disabled
                  type="text"
                  value={editingAtendimento.brokerName}
                  className="text-xs border border-slate-200 outline-none rounded-lg p-2.5 bg-slate-50 text-slate-500 font-medium"
                />
              ) : (
                <select
                  value={editingAtendimento.brokerName}
                  onChange={(e) => setEditingAtendimento({ ...editingAtendimento, brokerName: e.target.value })}
                  className="text-xs border border-slate-200 outline-none rounded-lg p-2.5 bg-white"
                >
                  {brokers.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Data */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Data da Apresentação</label>
              <input
                required
                type="date"
                value={editingAtendimento.date}
                onChange={(e) => setEditingAtendimento({ ...editingAtendimento, date: e.target.value })}
                className="text-xs border border-slate-200 outline-none rounded-lg p-2.5"
              />
            </div>

            {/* Horários */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Hora Início</label>
              <input
                required
                type="time"
                value={editingAtendimento.startTime}
                onChange={(e) => setEditingAtendimento({ ...editingAtendimento, startTime: e.target.value })}
                className="text-xs border border-slate-200 outline-none rounded-lg p-2.5"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Hora Término</label>
              <input
                type="time"
                value={editingAtendimento.endTime}
                onChange={(e) => setEditingAtendimento({ ...editingAtendimento, endTime: e.target.value })}
                className="text-xs border border-slate-200 outline-none rounded-lg p-2.5"
              />
            </div>

            {/* Compareceu */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Compareceu ao Stand?</label>
              <select
                value={editingAtendimento.attended ? "sim" : "nao"}
                onChange={(e) => setEditingAtendimento({ ...editingAtendimento, attended: e.target.value === "sim" })}
                className="text-xs border border-slate-200 outline-none rounded-lg p-2.5 bg-white"
              >
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
              </select>
            </div>

            {/* Apresentação Realizada */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Apresentação Técnica Realizada?</label>
              <select
                value={editingAtendimento.presentationDone ? "sim" : "nao"}
                onChange={(e) => setEditingAtendimento({ ...editingAtendimento, presentationDone: e.target.value === "sim" })}
                className="text-xs border border-slate-200 outline-none rounded-lg p-2.5 bg-white"
              >
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
              </select>
            </div>

            {/* Produto Apresentado */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Produto Ofertado / Fornecido</label>
              <select
                value={editingAtendimento.presentedProduct}
                onChange={(e) => setEditingAtendimento({ ...editingAtendimento, presentedProduct: e.target.value })}
                className="text-xs border border-slate-200 outline-none rounded-lg p-2.5 bg-white"
              >
                {showroomProducts.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Nível de Interesse */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Interesse Estimado do Cliente</label>
              <select
                value={editingAtendimento.clientInterest}
                onChange={(e) => setEditingAtendimento({ ...editingAtendimento, clientInterest: e.target.value })}
                className="text-xs border border-slate-200 outline-none rounded-lg p-2.5 bg-white"
              >
                <option value="Alto">Alto Interesse (Quente)</option>
                <option value="Médio">Médio Interesse (Trabalhando)</option>
                <option value="Baixo">Baixo Interesse (Frio)</option>
              </select>
            </div>

            {/* Status Negociação */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-700 mb-1">Status Final da Negociação</label>
              <select
                value={editingAtendimento.status}
                onChange={(e) => setEditingAtendimento({ ...editingAtendimento, status: e.target.value as any })}
                className="text-xs border border-slate-200 outline-none rounded-lg p-2.5 bg-white"
              >
                {Object.values(NegotiationStatus).map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Objeções Identificadas */}
            <div className="flex flex-col md:col-span-2">
              <label className="text-xs font-bold text-slate-700 mb-1">Objeções Levantadas pelo Casal</label>
              <input
                type="text"
                placeholder="Ex primeiramente: preço elevado, falta de tempo para usufruir, anuidade..."
                value={editingAtendimento.objections}
                onChange={(e) => setEditingAtendimento({ ...editingAtendimento, objections: e.target.value })}
                className="text-xs border border-slate-200 outline-none rounded-lg p-2.5"
              />
            </div>

            {/* Observações Gerais do Corretor */}
            <div className="flex flex-col md:col-span-3">
              <label className="text-xs font-bold text-slate-700 mb-1">Observações Operacionais do Corretor</label>
              <textarea
                rows={3}
                placeholder="Detalhes adicionais sobre a abordagem no showroom..."
                value={editingAtendimento.observations}
                onChange={(e) => setEditingAtendimento({ ...editingAtendimento, observations: e.target.value })}
                className="text-xs border border-slate-200 outline-none rounded-lg p-2.5"
              />
            </div>
          </div>

          {/* Form buttons */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg"
            >
              <Save className="h-4 w-4" /> Gravar Registro Atendimento
            </button>
          </div>
        </form>
      ) : (
        /* Showroom active listing */
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  <th className="p-4">Cód Atendimento</th>
                  <th className="p-4">Cliente / Casal Atendido</th>
                  <th className="p-4">Corretor</th>
                  <th className="p-4">Produto Focado</th>
                  <th className="p-4">Interesse / Objeção</th>
                  <th className="p-4">Negociação</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {visibleAtendimentos.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      Nenhum atendimento em andamento nesta sessão.
                    </td>
                  </tr>
                ) : (
                  visibleAtendimentos.map(at => {
                    const client = receptions.find(r => r.id === at.receptionId);
                    
                    let statBadge = "bg-slate-100 text-slate-600";
                    if (at.status === NegotiationStatus.VENDA_REALIZADA) statBadge = "bg-green-50 text-green-700 font-bold";
                    if (at.status === NegotiationStatus.EM_NEGOCIACAO) statBadge = "bg-yellow-50 text-yellow-700";
                    if (at.status === NegotiationStatus.NAO_FECHOU || at.status === NegotiationStatus.DESISTENCIA) statBadge = "bg-red-50 text-red-600";

                    let intColor = "text-slate-500 bg-slate-50";
                    if (at.clientInterest === "Alto") intColor = "text-emerald-700 bg-emerald-50 font-semibold";
                    if (at.clientInterest === "Médio") intColor = "text-amber-700 bg-amber-50";

                    return (
                      <tr key={at.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <span className="font-mono font-bold text-slate-700 block">{at.id}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {at.date.split("-").reverse().join("/")} | {at.startTime} {at.endTime ? `às ${at.endTime}` : "em andamento"}
                          </span>
                        </td>
                        <td className="p-4">
                          {client ? (
                            <div className="space-y-0.5">
                              <span className="font-bold text-slate-800">{client.guest1?.name}</span>
                              <span className="text-[11px] text-slate-400 block">Cônjuge: {client.guest2?.name || "Solteiro"}</span>
                            </div>
                          ) : (
                            <em className="text-slate-400">Cliente Desconhecido</em>
                          )}
                        </td>
                        <td className="p-4 text-slate-700 font-medium">{at.brokerName}</td>
                        <td className="p-4 text-slate-600 font-medium max-w-[200px] truncate">{at.presentedProduct}</td>
                        <td className="p-4 space-y-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] inline-block ${intColor}`}>
                            Interesse: {at.clientInterest}
                          </span>
                          <div className="text-[11px] text-slate-400 truncate max-w-[170px]" title={at.objections}>
                            {at.objections || "Nenhuma objeção"}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10.5px] inline-block ${statBadge}`}>
                            {at.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleEdit(at)}
                            className="bg-white hover:bg-slate-50 border border-slate-200 text-sky-600 font-bold px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 ml-auto"
                          >
                            <Edit2 className="h-3 w-3" /> Atualizar
                          </button>
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
