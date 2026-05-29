/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { SystemUser, UserRole } from "../types";
import { Plus, Shield, Mail, Edit2, CheckCircle, HelpCircle, Save, Trash2, KeyRound } from "lucide-react";

interface UsuariosViewProps {
  users: SystemUser[];
  onSaveUser: (u: SystemUser) => void;
  onDeleteUser?: (id: string) => void;
}

export default function UsuariosView({ users, onSaveUser, onDeleteUser }: UsuariosViewProps) {
  const [editingUser, setEditingUser] = useState<Partial<SystemUser> | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleEdit = (u: SystemUser) => {
    setEditingUser(u);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingUser({
      id: `USR-${Math.floor(100 + Math.random() * 899)}`,
      name: "",
      email: "",
      role: UserRole.CORRETOR,
      active: true,
      permissions: {
        canViewDashboard: true,
        canCreateReceptions: true,
        canEditReceptions: true,
        canDeleteReceptions: false,
        canViewAtendimento: true,
        canCreateAtendimento: true,
        canManageSales: true,
        canViewReports: false,
        canManageContracts: false,
        canManageUsers: false
      }
    });
    setIsCreating(true);
  };

  const handleRoleChangeInForm = (role: UserRole) => {
    if (!editingUser) return;
    
    // Automatically preset logical permissions by typical staff job roles
    const perms = {
      canViewDashboard: true,
      canCreateReceptions: false,
      canEditReceptions: false,
      canDeleteReceptions: false,
      canViewAtendimento: false,
      canCreateAtendimento: false,
      canManageSales: false,
      canViewReports: false,
      canManageContracts: false,
      canManageUsers: false
    };

    if (role === UserRole.ADMIN) {
      perms.canCreateReceptions = true;
      perms.canEditReceptions = true;
      perms.canDeleteReceptions = true;
      perms.canViewAtendimento = true;
      perms.canCreateAtendimento = true;
      perms.canManageSales = true;
      perms.canViewReports = true;
      perms.canManageContracts = true;
      perms.canManageUsers = true;
    } else if (role === UserRole.GERENTE) {
      perms.canCreateReceptions = true;
      perms.canEditReceptions = true;
      perms.canViewAtendimento = true;
      perms.canCreateAtendimento = true;
      perms.canManageSales = true;
      perms.canViewReports = true;
      perms.canManageContracts = true;
    } else if (role === UserRole.FINANCEIRO) {
      perms.canManageSales = true;
      perms.canViewReports = true;
      perms.canManageContracts = true;
    } else if (role === UserRole.RECEPCAO) {
      perms.canCreateReceptions = true;
      perms.canEditReceptions = true;
      perms.canViewAtendimento = true;
    } else if (role === UserRole.CORRETOR) {
      perms.canCreateReceptions = true;
      perms.canEditReceptions = true;
      perms.canViewAtendimento = true;
      perms.canCreateAtendimento = true;
      perms.canManageSales = true;
    }

    setEditingUser({
      ...editingUser,
      role,
      permissions: perms
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      onSaveUser(editingUser as SystemUser);
      setEditingUser(null);
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Controle de Usuários</h1>
          <p className="text-sm text-slate-500">Cadastre corretores e gerencie alçadas e chaves de segurança por cargo de acesso</p>
        </div>
        
        <button
          onClick={handleCreate}
          className="flex items-center gap-1 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm"
        >
          <Plus className="h-4.5 w-4.5" /> Adicionar Colaborador
        </button>
      </div>

      {editingUser ? (
        /* Edit or create form */
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-6 text-xs text-slate-700">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-800">
              {isCreating ? "Novo Colaborador do Sistema" : `Ajustar Acesso do Usuário: ${editingUser.id}`}
            </h2>
            <button
              type="button"
              onClick={() => {
                setEditingUser(null);
                setIsCreating(false);
              }}
              className="text-slate-500 border border-slate-200 hover:bg-slate-50 py-1.5 px-3 rounded-lg font-semibold"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Name */}
            <div className="flex flex-col md:col-span-2">
              <label className="font-bold mb-1 col-span-2">Nome Completo</label>
              <input
                required
                type="text"
                placeholder="Ex: Carlos Eduardo de Oliveira"
                value={editingUser.name}
                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                className="p-2 border border-slate-200 outline-none rounded-lg text-xs"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col md:col-span-2">
              <label className="font-bold mb-1">E-mail Corporativo</label>
              <input
                required
                type="email"
                placeholder="Ex. carlos@lagoalovers.com.br"
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value.toLowerCase() })}
                className="p-2 border border-slate-200 outline-none rounded-lg text-xs"
              />
            </div>

            {/* Role selection & active status */}
            <div className="flex flex-col md:col-span-2">
              <label className="font-bold mb-1">Perfil de Acesso (Nível)</label>
              <select
                value={editingUser.role}
                onChange={(e) => handleRoleChangeInForm(e.target.value as UserRole)}
                className="p-2 border border-slate-200 outline-none rounded-lg bg-white"
              >
                {Object.values(UserRole).map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="font-bold mb-1">Status da Conta</label>
              <select
                value={editingUser.active ? "sim" : "nao"}
                onChange={(e) => setEditingUser({ ...editingUser, active: e.target.value === "sim" })}
                className="p-2 border border-slate-200 outline-none rounded-lg bg-white"
              >
                <option value="sim">Ativo (Permite Login)</option>
                <option value="nao">Inativo (Bloqueado)</option>
              </select>
            </div>

            {/* Specific permissions matrix checklist */}
            <div className="md:col-span-4 bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
              <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 border-b border-slate-200/60 pb-2">
                <KeyRound className="h-4 w-4 text-sky-500" /> Matriz de Permissões Granulares (Ajustes Sob-medida)
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {editingUser.permissions && Object.keys(editingUser.permissions).map((permKey) => {
                  const labelMap: Record<string, string> = {
                    canViewDashboard: "Visualizar Painel Estatístico (Dashboard)",
                    canCreateReceptions: "Cadastrar Recepções",
                    canEditReceptions: "Editar Recepções",
                    canDeleteReceptions: "Excluir Registros de Recepção",
                    canViewAtendimento: "Acessar Showroom & Atendimento",
                    canCreateAtendimento: "Lançar Apresentações",
                    canManageSales: "Operar Módulo de Vendas",
                    canViewReports: "Acessar Relatórios Detalhados",
                    canManageContracts: "Auditar e Emitir Contratos",
                    canManageUsers: "Anotar e Controlar Usuários"
                  };

                  const isChecked = (editingUser.permissions as any)[permKey];

                  return (
                    <label key={permKey} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const perms = { ...editingUser.permissions };
                          (perms as any)[permKey] = e.target.checked;
                          setEditingUser({ ...editingUser, permissions: perms as any });
                        }}
                        className="rounded border-slate-250 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                      />
                      <span className="text-[11px] text-slate-600">{labelMap[permKey] || permKey}</span>
                    </label>
                  );
                })}
              </div>
            </div>

          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1"
            >
              <Save className="h-4 w-4" /> Gravar Dados de Cadastro
            </button>
          </div>
        </form>
      ) : (
        /* List users table grid */
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4">Cód Usuário</th>
                  <th className="p-4">Colaborador</th>
                  <th className="p-4">E-mail Corporativo</th>
                  <th className="p-4">Nível de Acesso</th>
                  <th className="p-4">Ações Permitidas (Resumo)</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {users.map(u => {
                  let roleColor = "bg-slate-50 text-slate-600 border-slate-100";
                  if (u.role === UserRole.ADMIN) roleColor = "bg-red-50 text-red-600 border-red-100 font-bold";
                  if (u.role === UserRole.GERENTE) roleColor = "bg-amber-50 text-amber-600 border-amber-100 font-semibold";
                  if (u.role === UserRole.RECEPCAO) roleColor = "bg-pink-50 text-pink-600 border-pink-100";
                  if (u.role === UserRole.FINANCEIRO) roleColor = "bg-emerald-50 text-emerald-600 border-emerald-100";
                  if (u.role === UserRole.CORRETOR) roleColor = "bg-sky-50 text-sky-600 border-sky-100";

                  // Extract count of permission values set to true
                  const permsCount = Object.values(u.permissions || {}).filter(p => !!p).length;

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-mono font-medium text-slate-500 text-[11px]">{u.id}</td>
                      <td className="p-4 font-bold text-slate-800">{u.name}</td>
                      <td className="p-4 text-slate-500">{u.email}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded border text-[10px] inline-block uppercase font-medium ${roleColor}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full inline-block">
                          🔒 {permsCount} de 10 Permissões Habilitadas
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`h-2.5 w-2.5 rounded-full inline-block ${u.active ? "bg-emerald-500" : "bg-red-500"}`} title={u.active ? "Ativo" : "Desativado"}></span>
                        <span className="text-slate-500 font-medium ml-1.5">{u.active ? "Ativo" : "Bloqueado"}</span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleEdit(u)}
                            className="bg-white border border-slate-200 hover:bg-slate-50 text-indigo-500 p-1.5 rounded-lg transition-colors"
                            title="Ajustar Usuário"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          
                          {onDeleteUser && u.email !== "sistemalagoalovers@gmail.com" && (
                            <button
                              onClick={() => {
                                if (confirm(`Tem certeza de que realmente deseja revogar permanentemente o acesso do colaborador ${u.name}?`)) {
                                  onDeleteUser(u.id);
                                }
                              }}
                              className="bg-white border border-red-100 hover:bg-red-50 text-red-500 p-1.5 rounded-lg transition-colors"
                              title="Revogar Acesso"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
