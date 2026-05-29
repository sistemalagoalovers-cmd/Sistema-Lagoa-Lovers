/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  getLocalStorageState, 
  saveLocalStorageState, 
  INITIAL_USERS 
} from "./initialData";
import { 
  ReceptionRecord, 
  AtendimentoRecord, 
  SalesRecord, 
  ContractTemplate, 
  ContractRecord, 
  Product, 
  SystemUser, 
  UserRole 
} from "./types";

// Import modules
import DashboardView from "./components/DashboardView";
import RecepcaoView from "./components/RecepcaoView";
import AtendimentoView from "./components/AtendimentoView";
import VendasView from "./components/VendasView";
import ProdutosView from "./components/ProdutosView";
import ContratosView from "./components/ContratosView";
import RelatoriosView from "./components/RelatoriosView";
import ConfiguracoesView from "./components/ConfiguracoesView";

// Icons 
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  ShoppingBag, 
  Tag, 
  Key, 
  BarChart2, 
  FileSignature, 
  PlaySquare, 
  LogOut, 
  Fingerprint,
  Info,
  Database
} from "lucide-react";

export default function App() {
  // Load state
  const initialState = getLocalStorageState();

  const [receptions, setReceptions] = useState<ReceptionRecord[]>(initialState.receptions);
  const [atendimentos, setAtendimentos] = useState<AtendimentoRecord[]>(initialState.atendimentos);
  const [sales, setSales] = useState<SalesRecord[]>(initialState.sales);
  const [contracts, setContracts] = useState<ContractRecord[]>(initialState.contracts);
  const [products, setProducts] = useState<Product[]>(initialState.products);
  const [users, setUsers] = useState<SystemUser[]>(initialState.users);
  
  // Impersonating session
  const [currentUser, setCurrentUser] = useState<SystemUser>(initialState.currentUser);
  const [templates, setTemplates] = useState<ContractTemplate[]>(initialState.templates);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<"dashboard" | "recepcao" | "atendimento" | "vendas" | "contratos" | "produtos" | "relatorios" | "configuracoes">("dashboard");

  // Inter-tab redirection buffers
  const [salePreSelectClient, setSalePreSelectClient] = useState<string | null>(null);
  const [contractPreSelectClient, setContractPreSelectClient] = useState<string | null>(null);

  // Save changes to localStorage automatically on state mutation
  useEffect(() => {
    saveLocalStorageState({
      receptions,
      atendimentos,
      sales,
      contracts,
      products,
      users,
      currentUser,
      templates
    });
  }, [receptions, atendimentos, sales, contracts, products, users, currentUser, templates]);

  // List of unique brokers for select boxes
  const brokerList = ["Marcos Oliveira", "Fernando Souza", "Maurício Souza", "Patrícia Costa"];

  // Helper callbacks
  const handleLoadAllData = (data: {
    receptions: ReceptionRecord[];
    atendimentos: AtendimentoRecord[];
    sales: SalesRecord[];
    contracts: ContractRecord[];
    products: Product[];
    users: SystemUser[];
    templates: ContractTemplate[];
  }) => {
    setReceptions(data.receptions);
    setAtendimentos(data.atendimentos);
    setSales(data.sales);
    setContracts(data.contracts);
    setProducts(data.products);
    setUsers(data.users);
    setTemplates(data.templates);
  };

  const handleSaveReception = (record: ReceptionRecord) => {
    setReceptions(prev => {
      const idx = prev.findIndex(r => r.id === record.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = record;
        return next;
      } else {
        return [record, ...prev];
      }
    });
  };

  const handleDeleteReception = (id: string) => {
    setReceptions(prev => prev.filter(r => r.id !== id));
  };

  const handleSaveAtendimento = (record: AtendimentoRecord) => {
    setAtendimentos(prev => {
      const idx = prev.findIndex(a => a.id === record.id);
      const updated = [...prev];
      if (idx > -1) {
        updated[idx] = record;
      } else {
        updated.unshift(record);
      }
      return updated;
    });
  };

  const handleSaveSale = (sale: SalesRecord) => {
    setSales(prev => {
      const idx = prev.findIndex(s => s.id === sale.id);
      const updated = [...prev];
      if (idx > -1) {
        updated[idx] = sale;
      } else {
        updated.unshift(sale);
      }
      return updated;
    });

    // Automatically flag client reception status to VENDA_LANCADA
    setReceptions(prev => {
      const idx = prev.findIndex(r => r.id === sale.receptionId);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          status: "Venda Lançada" as any
        };
        return copy;
      }
      return prev;
    });
  };

  const handleSaveProduct = (p: Product) => {
    setProducts(prev => {
      const idx = prev.findIndex(prod => prod.id === p.id);
      const updated = [...prev];
      if (idx > -1) {
        updated[idx] = p;
      } else {
        updated.unshift(p);
      }
      return updated;
    });
  };

  const handleAddTemplate = (newT: ContractTemplate) => {
    setTemplates(prev => [...prev, newT]);
  };

  const handleUpdateTemplate = (updated: ContractTemplate) => {
    setTemplates(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const handleDeleteSale = (id: string) => {
    setSales(prev => prev.filter(s => s.id !== id));
  };

  const handleSaveUser = (u: SystemUser) => {
    setUsers(prev => {
      const idx = prev.findIndex(usr => usr.id === u.id);
      const updated = [...prev];
      if (idx > -1) {
        updated[idx] = u;
      } else {
        updated.unshift(u);
      }
      return updated;
    });
  };

  const handleDeleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  // Cross-navigation redirects
  const handleSendToSale = (receptionId: string) => {
    setSalePreSelectClient(receptionId);
    setActiveTab("vendas");
  };

  const handleGenerateContract = (receptionId: string) => {
    setContractPreSelectClient(receptionId);
    setActiveTab("contratos");
  };

  // Check if current user is allowed to access specific views
  const hasAccess = (tab: typeof activeTab) => {
    const role = currentUser.role;
    if (role === UserRole.ADMIN) return true;

    switch (tab) {
      case "dashboard":
        return true;
      case "recepcao":
        return [UserRole.RECEPCAO, UserRole.GERENTE, UserRole.CORRETOR].includes(role);
      case "atendimento":
        return [UserRole.CORRETOR, UserRole.RECEPCAO, UserRole.GERENTE].includes(role);
      case "vendas":
        return [UserRole.CORRETOR, UserRole.FINANCEIRO, UserRole.GERENTE].includes(role);
      case "produtos":
        return [UserRole.GERENTE].includes(role);
      case "contratos":
        return [UserRole.FINANCEIRO, UserRole.GERENTE, UserRole.CORRETOR].includes(role);
      case "relatorios":
        return [UserRole.GERENTE, UserRole.FINANCEIRO].includes(role);
      case "configuracoes":
        return [UserRole.ADMIN, UserRole.GERENTE, UserRole.FINANCEIRO].includes(role);
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* LEFT SIDEBAR: Branding and Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
        
        {/* Luxury Top Branding logo */}
        <div className="p-4 border-b border-slate-800/80 flex items-center gap-3">
          <img 
            src="https://i.postimg.cc/L5SxKwZW/Whats-App-Image-2026-05-28-at-12-57-51.png" 
            alt="Lagoa Lovers" 
            className="h-10 w-10 rounded-xl object-contain bg-white p-0.5 shadow-md shadow-sky-500/15"
            referrerPolicy="no-referrer"
          />
          <div>
            <span className="font-extrabold text-white text-base tracking-tight block font-sans">LAGOA LOVERS</span>
            <span className="text-[10px] text-sky-400 font-bold uppercase tracking-widest mt-0.5 block">SISTEMA INTEGRADO</span>
          </div>
        </div>

        {/* Impersonated staff box */}
        <div className="p-4 mx-4 my-3 bg-slate-800/40 border border-slate-800/50 rounded-xl space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-sky-400">
            <Fingerprint className="h-3.5 w-3.5" /> Sessão Ativa
          </div>
          <div>
            <div className="text-xs font-bold text-white max-w-[170px] truncate">{currentUser.name}</div>
            <div className="text-[9.5px] text-slate-400 mt-0.5 font-semibold uppercase">{currentUser.role}</div>
          </div>
        </div>

        {/* Main navigation menu */}
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: "dashboard", label: "Início", icon: LayoutDashboard },
            { id: "recepcao", label: "Recepção", icon: Users },
            { id: "atendimento", label: "Atendimentos", icon: PlaySquare },
            { id: "vendas", label: "Vendas", icon: ShoppingBag },
            { id: "contratos", label: "Contratos", icon: FileSignature },
            { id: "produtos", label: "Produtos", icon: Tag },
            { id: "relatorios", label: "Relatórios", icon: BarChart2 },
            { id: "configuracoes", label: "Configurações", icon: Key }
          ].map(item => {
            const isTabActive = activeTab === item.id;
            const isAllowed = hasAccess(item.id as any);
            const IconComp = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (isAllowed) {
                    setActiveTab(item.id as any);
                  } else {
                    alert(`O nível de acesso "${currentUser.role}" não possui permissão para acessar o módulo de ${item.label}. Impersonar administrador no topo direito para liberar.`);
                  }
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  isTabActive 
                    ? "bg-sky-600 text-white font-bold" 
                    : !isAllowed 
                      ? "text-slate-600 opacity-45 cursor-not-allowed" 
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComp className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {!isAllowed && (
                  <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-rose-400">🔒</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info branding */}
        <div className="p-4 border-t border-slate-800 text-[10px] text-slate-500 text-center font-medium mt-auto">
          © 2026 Lagoa Lovers Club <br /> LGPD e Criptografia Ativas
        </div>
      </aside>

      {/* RIGHT PRINCIPAL SCREEN CANVAS */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP INTERACTIVE HEADBAR */}
        <header className="bg-white h-16 border-b border-slate-100 flex items-center justify-between px-6 z-20 shrink-0">
          
          <div className="flex items-center gap-3">
            <img 
              src="https://i.postimg.cc/L5SxKwZW/Whats-App-Image-2026-05-28-at-12-57-51.png" 
              alt="Lagoa Lovers" 
              className="h-8 w-8 rounded-lg object-contain bg-slate-50 border border-slate-100 p-0.5" 
              referrerPolicy="no-referrer"
            />
            <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
              Lagoa Lovers recepção, vendas de alta conversão & contratos automáticos DOCX
            </span>
          </div>

          {/* Quick Impersonating simulator dropdown selection */}
          <div className="flex items-center gap-3">
            <div className="text-[11px] text-slate-400 font-bold text-right hidden lg:block">
              <span className="text-slate-500">Impersonação de Teste (Simulador):</span>
            </div>
            
            <select
              value={currentUser.id}
              onChange={(e) => {
                const found = INITIAL_USERS.find(usr => usr.id === e.target.value);
                if (found) {
                  setCurrentUser(found);
                  // Default path resetting upon change
                  setActiveTab("dashboard");
                }
              }}
              className="text-xs border border-slate-200 outline-none p-1.5 rounded-lg bg-slate-50 text-slate-700 font-bold cursor-pointer hover:border-slate-350 focus:border-indigo-500"
            >
              {INITIAL_USERS.map(usr => (
                <option key={usr.id} value={usr.id}>
                  🔑 {usr.name} ({usr.role})
                </option>
              ))}
            </select>
          </div>

        </header>

        {/* BODY TAB VIEWS ROUTING CONTAINER */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto space-y-6">
          
          {/* Dashboard Module */}
          {activeTab === "dashboard" && (
            <DashboardView
              receptions={receptions}
              sales={sales}
              atendimentos={atendimentos}
              products={products}
            />
          )}

          {/* Recepcao Module */}
          {activeTab === "recepcao" && (
            <RecepcaoView
              receptions={receptions}
              onSaveReception={handleSaveReception}
              onDeleteReception={handleDeleteReception}
              onSendToSale={handleSendToSale}
              onGenerateContract={handleGenerateContract}
              brokers={brokerList}
            />
          )}

          {/* Atendimento Module */}
          {activeTab === "atendimento" && (
            <AtendimentoView
              atendimentos={atendimentos}
              receptions={receptions}
              onSaveAtendimento={handleSaveAtendimento}
              currentUser={currentUser}
              brokers={brokerList}
            />
          )}

          {/* Vendas Module */}
          {activeTab === "vendas" && (
            <VendasView
              sales={sales}
              receptions={receptions}
              products={products}
              onSaveSale={handleSaveSale}
              onSaveReception={handleSaveReception}
              onGenerateContract={handleGenerateContract}
              currentUser={currentUser}
              brokers={brokerList}
              preSelectedReceptionId={salePreSelectClient}
              onClearPreSelected={() => setSalePreSelectClient(null)}
              onDeleteSale={handleDeleteSale}
            />
          )}

          {/* Produtos Module */}
          {activeTab === "produtos" && (
            <ProdutosView
              products={products}
              onSaveProduct={handleSaveProduct}
            />
          )}

          {/* Contratos Module */}
          {activeTab === "contratos" && (
            <ContratosView
              templates={templates}
              receptions={receptions}
              sales={sales}
              products={products}
              onAddTemplate={handleAddTemplate}
              onUpdateTemplate={handleUpdateTemplate}
              onDeleteTemplate={handleDeleteTemplate}
              onSaveSale={handleSaveSale}
              onDeleteSale={handleDeleteSale}
              preSelectedReceptionId={contractPreSelectClient}
            />
          )}

          {/* Relatorios Module */}
          {activeTab === "relatorios" && (
            <RelatoriosView
              receptions={receptions}
              sales={sales}
              atendimentos={atendimentos}
            />
          )}

          {/* Configurações Module */}
          {activeTab === "configuracoes" && (
            <ConfiguracoesView
              users={users}
              onSaveUser={handleSaveUser}
              onDeleteUser={handleDeleteUser}
              receptions={receptions}
              atendimentos={atendimentos}
              sales={sales}
              contracts={contracts}
              products={products}
              templates={templates}
              onLoadAllData={handleLoadAllData}
            />
          )}

        </main>
      </div>

    </div>
  );
}
