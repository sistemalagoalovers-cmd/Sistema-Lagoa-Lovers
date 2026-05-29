/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { ReceptionRecord, AttendanceStatus, CoupleSource, LodgingPlace, CaptationPlace } from "../types";
import { 
  Plus, 
  Search, 
  Eye, 
  Edit3, 
  ShoppingBag, 
  FileCheck, 
  Filter, 
  FileText, 
  UserCheck, 
  Check, 
  Trash2, 
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign
} from "lucide-react";
import CadastroCasalView from "./CadastroCasalView";

interface RecepcaoViewProps {
  receptions: ReceptionRecord[];
  onSaveReception: (record: ReceptionRecord) => void;
  onDeleteReception?: (id: string) => void;
  onSendToSale: (receptionId: string) => void;
  onGenerateContract: (receptionId: string) => void;
  brokers: string[];
}

export default function RecepcaoView({
  receptions,
  onSaveReception,
  onDeleteReception,
  onSendToSale,
  onGenerateContract,
  brokers
}: RecepcaoViewProps) {
  
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ReceptionRecord | null>(null);
  const [viewingProfile, setViewingProfile] = useState<ReceptionRecord | null>(null);

  // Search parameters
  const [searchText, setSearchText] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [selectedLodging, setSelectedLodging] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const clearFilters = () => {
    setSearchText("");
    setSelectedSource("");
    setSelectedLodging("");
    setSelectedStatus("");
  };

  // Filter logic
  const filteredReceptions = useMemo(() => {
    return receptions.filter(rec => {
      // Search matching Name, CPF, Phone, Email
      if (searchText) {
        const query = searchText.toLowerCase();
        const g1Name = (rec.guest1?.name || "").toLowerCase();
        const g2Name = (rec.guest2?.name || "").toLowerCase();
        const g1Cpf = (rec.guest1?.cpf || "").replace(/\D/g, "");
        const g2Cpf = (rec.guest2?.cpf || "").replace(/\D/g, "");
        const rawQuery = query.replace(/\D/g, "");

        const g1Phone = `${rec.contacts?.phoneMobDDD}${rec.contacts?.phoneMobNumber}`.replace(/\D/g, "");
        const g2Phone = `${rec.contacts?.phoneMob2DDD}${rec.contacts?.phoneMob2Number}`.replace(/\D/g, "");
        const email = (rec.contacts?.email || "").toLowerCase();

        const matchesName = g1Name.includes(query) || g2Name.includes(query);
        const matchesCpf = (g1Cpf && g1Cpf.includes(rawQuery)) || (g2Cpf && g2Cpf.includes(rawQuery));
        const matchesPhone = (g1Phone && g1Phone.includes(rawQuery)) || (g2Phone && g2Phone.includes(rawQuery));
        const matchesEmail = email.includes(query);

        if (!matchesName && !matchesCpf && !matchesPhone && !matchesEmail) {
          return false;
        }
      }

      // Dropdowns
      if (selectedSource && rec.source !== selectedSource) return false;
      if (selectedLodging && rec.lodging !== selectedLodging) return false;
      if (selectedStatus && rec.status !== selectedStatus) return false;

      return true;
    });
  }, [receptions, searchText, selectedSource, selectedLodging, selectedStatus]);

  // Handle edit launch
  const handleEdit = (rec: ReceptionRecord) => {
    setSelectedRecord(rec);
    setIsEditing(true);
  };

  // Handle new record launch
  const handleNew = () => {
    setSelectedRecord(null);
    setIsEditing(true);
  };

  const handleSaveForm = (updated: Partial<ReceptionRecord>) => {
    // If we're updating
    if (selectedRecord) {
      onSaveReception({ ...selectedRecord, ...updated } as ReceptionRecord);
    } else {
      // Create new
      onSaveReception(updated as ReceptionRecord);
    }
    setIsEditing(false);
    setSelectedRecord(null);
  };

  return (
    <div className="space-y-6">
      
      {/* If in edit/creation layout, display the sub-form */}
      {isEditing ? (
        <CadastroCasalView
          onSave={handleSaveForm}
          initialRecord={selectedRecord}
          onCancel={() => setIsEditing(false)}
          brokers={brokers}
        />
      ) : (
        <>
          {/* Header controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Recepção de Casais</h1>
              <p className="text-sm text-slate-500">Cadastre e monitore os convidados antes do atendimento de vendas</p>
            </div>
            <button
              onClick={handleNew}
              className="flex items-center gap-1 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all shrink-0"
            >
              <Plus className="h-4 w-4" /> Novo Pré-Cadastro
            </button>
          </div>

          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              {/* Search match Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Pesquisar por Nome, CPF, Telefone ou E-mail..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 outline-none rounded-lg focus:border-sky-500"
                />
              </div>

              {/* Source Dropdown */}
              <div className="w-full md:w-48">
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="w-full text-xs border border-slate-200 outline-none rounded-lg p-2 bg-white text-slate-600 font-medium focus:border-sky-500"
                >
                  <option value="">Todas as Origens</option>
                  {Object.values(CoupleSource).map(src => (
                    <option key={src} value={src}>{src}</option>
                  ))}
                </select>
              </div>

              {/* Lodging Dropdown */}
              <div className="w-full md:w-48">
                <select
                  value={selectedLodging}
                  onChange={(e) => setSelectedLodging(e.target.value)}
                  className="w-full text-xs border border-slate-200 outline-none rounded-lg p-2 bg-white text-slate-600 font-medium focus:border-sky-500"
                >
                  <option value="">Todas as Hospedagens</option>
                  {Object.values(LodgingPlace).map(place => (
                    <option key={place} value={place}>{place}</option>
                  ))}
                </select>
              </div>

              {/* Status Dropdown */}
              <div className="w-full md:w-48">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full text-xs border border-slate-200 outline-none rounded-lg p-2 bg-white text-slate-600 font-medium focus:border-sky-500"
                >
                  <option value="">Todos os Status</option>
                  {Object.values(AttendanceStatus).map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* Reset filter button */}
              {(searchText || selectedSource || selectedLodging || selectedStatus) && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-red-600 font-bold hover:underline px-2"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>

          {/* Grid listing */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <th className="p-4">Cód / Apresentação</th>
                    <th className="p-4">Titular / Cônjuge (Convidado 2)</th>
                    <th className="p-4">Contato</th>
                    <th className="p-4">Origem / Captação</th>
                    <th className="p-4">Hospedagem</th>
                    <th className="p-4">Corretor</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Ações Rápidas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredReceptions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400">
                        Nenhum pré-cadastro localizado com os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    filteredReceptions.map(rec => {
                      let statusBadge = "bg-slate-50 text-slate-500";
                      if (rec.status === AttendanceStatus.VENDA_LANCADA) statusBadge = "bg-emerald-50 text-emerald-600";
                      if (rec.status === AttendanceStatus.CONTRATO_GERADO) statusBadge = "bg-sky-50 text-sky-600";
                      if (rec.status === AttendanceStatus.EM_ATENDIMENTO) statusBadge = "bg-amber-50 text-amber-600";
                      if (rec.status === AttendanceStatus.VENDA_CANCELADA) statusBadge = "bg-red-50 text-red-600 font-semibold";

                      const dateFormatted = rec.presentationDate 
                        ? rec.presentationDate.split("-").reverse().join("/") 
                        : "Não agendado";

                      return (
                        <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 font-medium text-slate-800">
                            <span className="font-mono text-slate-500 block text-[11px]">{rec.id}</span>
                            <span className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold mt-0.5">
                              <Calendar className="h-3 w-3" />
                              {dateFormatted} - {rec.receptionTime}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-slate-700">{rec.guest1?.name || "Não informado"}</div>
                            <div className="text-[11px] text-slate-400 italic">
                              Cônjuge: {rec.guest2?.name || "Inexistente / Solteiro"}
                            </div>
                          </td>
                          <td className="p-4 text-slate-600">
                            <div>({rec.contacts?.phoneMobDDD}) {rec.contacts?.phoneMobNumber}</div>
                            <div className="text-[11px] text-slate-400">{rec.contacts?.email}</div>
                          </td>
                          <td className="p-4">
                            <span className="bg-slate-50 text-slate-700 px-2 py-0.5 rounded-full inline-block font-semibold text-[10px]">
                              {rec.source}
                            </span>
                            <span className="text-slate-400 block text-[10.5px] mt-0.5">
                              Captação: {rec.captationPlace}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-slate-500 text-[11px]">
                            {rec.lodging}
                          </td>
                          <td className="p-4 text-slate-700 font-medium">
                            {rec.brokerName || <em className="text-slate-400 text-[11px]">Não atribuído</em>}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${statusBadge}`}>
                              {rec.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-1.5">
                              {/* Visualizar profile */}
                              <button
                                onClick={() => setViewingProfile(rec)}
                                title="Visualizar Ficha"
                                className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors border border-slate-100 bg-white"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </button>

                              {/* Editar profile */}
                              <button
                                onClick={() => handleEdit(rec)}
                                title="Editar Cadastro"
                                className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors border border-sky-100 bg-white"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>

                              {/* Enviar para Venda button */}
                              <button
                                onClick={() => onSendToSale(rec.id)}
                                title="Lançar Venda"
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-100 bg-white"
                              >
                                <ShoppingBag className="h-3.5 w-3.5" />
                              </button>

                              {/* Gerar contrato */}
                              <button
                                onClick={() => onGenerateContract(rec.id)}
                                title="Emitir Contrato"
                                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-indigo-100 bg-white"
                              >
                                <FileCheck className="h-3.5 w-3.5" />
                              </button>

                              {/* Excluir (optional but good for managing mockup data) */}
                              {onDeleteReception && (
                                <button
                                  onClick={() => {
                                    if (confirm(`Tem certeza de que deseja remover o cadastro de ${rec.guest1?.name}?`)) {
                                      onDeleteReception(rec.id);
                                    }
                                  }}
                                  title="Excluir Ficha"
                                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-100 bg-white"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
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
        </>
      )}

      {/* Visualizar Ficha Cadastral PopUp Modal */}
      {viewingProfile && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded uppercase font-mono">
                  FICHA COMPLETA: {viewingProfile.id}
                </span>
                <h2 className="text-lg font-bold text-slate-800 mt-1">
                  {viewingProfile.guest1?.name || "Sem Nome"} e {viewingProfile.guest2?.name || "Sem Cônjuge"}
                </h2>
              </div>
              <button 
                onClick={() => setViewingProfile(null)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content divided into realistic blocs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              
              {/* Box 1: Guest 1 & Guest 2 */}
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                  <h4 className="font-bold text-sky-600 text-xs flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5" /> Titular (Convidado 1)
                  </h4>
                  <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-[11px] text-slate-600">
                    <div><strong>Nome:</strong> {viewingProfile.guest1?.name}</div>
                    <div><strong>Idade:</strong> {viewingProfile.guest1?.age} anos</div>
                    <div><strong>CPF:</strong> {viewingProfile.guest1?.cpf}</div>
                    <div><strong>RG:</strong> {viewingProfile.guest1?.rg}</div>
                    <div><strong>Nascimento:</strong> {viewingProfile.guest1?.birthDate || "Sem data"}</div>
                    <div><strong>Aposentado:</strong> {viewingProfile.guest1?.retired ? "Sim" : "Não"}</div>
                    <div><strong>Profissão:</strong> {viewingProfile.guest1?.profession} ({viewingProfile.guest1?.professionObservation})</div>
                    <div><strong>Renda Individual:</strong> <span className="font-medium text-emerald-600">{viewingProfile.guest1?.individualIncome}</span></div>
                    <div><strong>Empresa / Cargo:</strong> {viewingProfile.guest1?.company || "-"} / {viewingProfile.guest1?.role || "-"}</div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                  <h4 className="font-bold text-indigo-600 text-xs flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5" /> Segundo Convidado / Cônjuge
                  </h4>
                  <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-[11px] text-slate-600">
                    <div><strong>Nome:</strong> {viewingProfile.guest2?.name || "Não atribuído"}</div>
                    <div><strong>Idade:</strong> {viewingProfile.guest2?.age ? `${viewingProfile.guest2?.age} anos` : "-"}</div>
                    <div><strong>CPF:</strong> {viewingProfile.guest2?.cpf || "-"}</div>
                    <div><strong>RG:</strong> {viewingProfile.guest2?.rg || "-"}</div>
                    <div><strong>Nascimento:</strong> {viewingProfile.guest2?.birthDate || "-"}</div>
                    <div><strong>Aposentado:</strong> {viewingProfile.guest2?.retired ? "Sim" : "Não"}</div>
                    <div><strong>Profissão:</strong> {viewingProfile.guest2?.profession || "-"} ({viewingProfile.guest2?.professionObservation || "-"})</div>
                    <div><strong>Renda Individual:</strong> <span className="font-medium text-emerald-600">{viewingProfile.guest2?.individualIncome || "-"}</span></div>
                    <div><strong>Empresa / Cargo:</strong> {viewingProfile.guest2?.company || "-"} / {viewingProfile.guest2?.role || "-"}</div>
                  </div>
                </div>
              </div>

              {/* Box 2: Address, contacts, finance, vehicles */}
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                  <h4 className="font-bold text-emerald-600 text-xs flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> Endereços & Contatos
                  </h4>
                  <div className="grid grid-cols-1 gap-y-1.5 text-[11px] text-slate-600">
                    <div>
                      <strong>Imóvel em Caldas Novas:</strong> {viewingProfile.address?.hasPropertyInCity ? "Sim" : "Não"} | 
                      <strong> Tipo Residência:</strong> {viewingProfile.address?.residenceType}
                    </div>
                    <div><strong>Endereço Completo:</strong> {viewingProfile.address?.street}, Nº {viewingProfile.address?.number}, {viewingProfile.address?.complement || "-"}, CEP {viewingProfile.address?.cep} - {viewingProfile.address?.neighborhood}, {viewingProfile.address?.city}-{viewingProfile.address?.state}</div>
                    <div><strong>Ponto de Ref:</strong> {viewingProfile.address?.referencePoint || "-"}</div>
                    <div className="border-t border-slate-200/60 my-1 pt-1.5">
                      <strong>Telefone Fixo:</strong> {viewingProfile.contacts?.phoneResDDD ? `(${viewingProfile.contacts.phoneResDDD}) ${viewingProfile.contacts.phoneResNumber}` : "-"}
                    </div>
                    <div><strong>Whats / Celular:</strong> {viewingProfile.contacts?.mainWhatsapp} / ({viewingProfile.contacts?.phoneMobDDD}) {viewingProfile.contacts?.phoneMobNumber}</div>
                    <div><strong>E-mail:</strong> {viewingProfile.contacts?.email}</div>
                    <div><strong>Melhor horário de contato Skype:</strong> {viewingProfile.contacts?.bestTimeToContact}</div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                  <h4 className="font-bold text-amber-600 text-xs flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5" /> Dados Financeiros & Veículos
                  </h4>
                  <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-[11px] text-slate-600">
                    <div><strong>Renda Familiar:</strong> <span className="font-bold text-emerald-600">{viewingProfile.financial?.familyIncome}</span></div>
                    <div><strong>Tem Cartão?</strong> {viewingProfile.financial?.hasCreditCard ? "Sim" : "Não"} ({viewingProfile.financial?.cardBrand || "-"})</div>
                    <div><strong>Usa Cheque?</strong> {viewingProfile.financial?.useCheque ? "Sim" : "Não"}</div>
                    <div><strong>Tem Financiamento?</strong> {viewingProfile.financial?.activeFinancing ? "Sim" : "Não"}</div>
                    <div className="col-span-2"><strong>Score Mercadológico:</strong> {viewingProfile.financial?.creditScore}</div>
                    <div className="col-span-2"><strong>Refs Financeiras:</strong> {viewingProfile.financial?.financialObservations || "Nenhuma registrada"}</div>
                    
                    <div className="col-span-2 border-t border-slate-200/60 pt-1.5 mt-1 font-semibold text-slate-500">Veículos do Casal:</div>
                    <div className="col-span-2">
                      <div>🚗 <strong>1º:</strong> {viewingProfile.vehicles?.vehicle1Brand} {viewingProfile.vehicles?.vehicle1Model} ({viewingProfile.vehicles?.vehicle1Year}) - {viewingProfile.vehicles?.vehicle1Plate || "-"}</div>
                      {viewingProfile.vehicles?.vehicle2Brand && (
                        <div className="mt-1">🚗 <strong>2º:</strong> {viewingProfile.vehicles?.vehicle2Brand} {viewingProfile.vehicles?.vehicle2Model} ({viewingProfile.vehicles?.vehicle2Year}) - {viewingProfile.vehicles?.vehicle2Plate || "-"}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 3: Family and relations */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 col-span-1 md:col-span-2">
                <h4 className="font-bold text-pink-600 text-xs">👨‍👩‍👧‍👦 Relacionamento & Observações Familiares</h4>
                <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600">
                  <div><strong>Estado Civil/Relacionamento:</strong> {viewingProfile.relation?.type}</div>
                  <div><strong>Tempo de Relacionamento:</strong> {viewingProfile.relation?.timeYears} anos, {viewingProfile.relation?.timeMonths} meses e {viewingProfile.relation?.timeDays} dias</div>
                  <div><strong>Qtd de filhos:</strong> {viewingProfile.relation?.childrenCount} total</div>
                  <div className="col-span-3"><strong>Filhos:</strong> {viewingProfile.relation?.childrenNamesAge || "Não informado / sem filhos"}</div>
                  {viewingProfile.relation?.companionCount && (
                    <div className="col-span-3"><strong>Acompanhantes com o Casal:</strong> {viewingProfile.relation.companionCount} familiares ({viewingProfile.relation.companionNames}) - Grau: {viewingProfile.relation.companionRelationship}</div>
                  )}
                  <div className="col-span-3"><strong>Anotações familiares:</strong> {viewingProfile.relation?.familyObservations || "Sem particularidades familiares registradas."}</div>
                </div>
              </div>

              {/* Box 4: Commercial Audit */}
              <div className="bg-sky-50/50 p-4 rounded-xl border border-sky-100/50 space-y-2 col-span-1 md:col-span-2">
                <h4 className="font-bold text-sky-800 text-xs">📊 Auditoria Comercial na recepção</h4>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                  <div><strong>Conhecia o clube?</strong> {viewingProfile.inspection?.heardOfVenture ? "Sim" : "Não"}</div>
                  <div><strong>Perfil do Comprador:</strong> {viewingProfile.inspection?.clientProfile || "Não especificado"}</div>
                  <div><strong>Potencial de fechamento:</strong> <span className="font-bold text-green-700">{viewingProfile.inspection?.buyingPotential}</span></div>
                  <div><strong>Restrições ou Alertas:</strong> <span className="text-red-700">{viewingProfile.inspection?.restrictions || "Nenhuma restrição registrada"}</span></div>
                  <div className="col-span-2"><strong>Anotações gerais do SDR:</strong> {viewingProfile.inspection?.description || "Simulação padrão sem anomalias."}</div>
                </div>
              </div>

            </div>

            {/* Modal Bottom control buttons */}
            <div className="flex justify-between items-center border-t border-slate-100 pt-4">
              <span className="text-[11px] text-slate-400 font-medium">Recepção Lagoa Lovers - LGPD protegida</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    handleEdit(viewingProfile);
                    setViewingProfile(null);
                  }}
                  className="flex items-center gap-1 text-sky-600 hover:text-sky-800 hover:bg-slate-50 font-bold text-xs px-3.5 py-2 border border-slate-200 rounded-lg"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Editar Cadastro
                </button>
                <button
                  onClick={() => {
                    onSendToSale(viewingProfile.id);
                    setViewingProfile(null);
                  }}
                  className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 font-bold text-xs px-4 py-2 text-white rounded-lg"
                >
                  <ShoppingBag className="h-3.5 w-3.5" /> Enviar para Venda
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
