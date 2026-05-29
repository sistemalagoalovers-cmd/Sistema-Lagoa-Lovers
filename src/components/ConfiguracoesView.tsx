/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import UsuariosView from "./UsuariosView";
import SupabaseSyncView from "./SupabaseSyncView";
import { SystemUser, UserRole, ReceptionRecord, AtendimentoRecord, SalesRecord, ContractRecord, Product, ContractTemplate } from "../types";
import { Users, Database, HelpCircle } from "lucide-react";

interface ConfiguracoesViewProps {
  users: SystemUser[];
  onSaveUser: (u: SystemUser) => void;
  onDeleteUser?: (id: string) => void;
  
  // Supabase Sync Props
  receptions: ReceptionRecord[];
  atendimentos: AtendimentoRecord[];
  sales: SalesRecord[];
  contracts: ContractRecord[];
  products: Product[];
  templates: ContractTemplate[];
  onLoadAllData: (data: {
    receptions: ReceptionRecord[];
    atendimentos: AtendimentoRecord[];
    sales: SalesRecord[];
    contracts: ContractRecord[];
    products: Product[];
    users: SystemUser[];
    templates: ContractTemplate[];
  }) => void;
}

export default function ConfiguracoesView({
  users,
  onSaveUser,
  onDeleteUser,
  receptions,
  atendimentos,
  sales,
  contracts,
  products,
  templates,
  onLoadAllData
}: ConfiguracoesViewProps) {
  const [innerTab, setInnerTab] = useState<"users" | "supabase">("users");

  return (
    <div className="space-y-6">
      
      {/* Explanation text on top as requested */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            ⚙️ Configurações
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gerencie usuários, permissões de acesso corporativo e recursos de sincronização em nuvem do sistema.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 mt-4 border-t border-slate-100 pt-4">
          <button
            onClick={() => setInnerTab("users")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              innerTab === "users"
                ? "bg-[#0B4A34] text-white"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Users className="h-4 w-4" /> Colaboradores e Acessos
          </button>
          
          <button
            onClick={() => setInnerTab("supabase")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              innerTab === "supabase"
                ? "bg-[#0B4A34] text-white"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Database className="h-4 w-4" /> Sincronia Supabase (Nuvem)
          </button>
        </div>
      </div>

      {/* Conditional rendering of sub-views */}
      {innerTab === "users" ? (
        <UsuariosView 
          users={users} 
          onSaveUser={onSaveUser} 
          onDeleteUser={onDeleteUser} 
        />
      ) : (
        <SupabaseSyncView
          receptions={receptions}
          atendimentos={atendimentos}
          sales={sales}
          contracts={contracts}
          products={products}
          users={users}
          templates={templates}
          onLoadAllData={onLoadAllData}
        />
      )}

    </div>
  );
}
