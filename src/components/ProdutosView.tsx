/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Product, PaymentMethod, ProductPricePlan } from "../types";
import { Plus, Tag, HelpCircle, ToggleLeft, ToggleRight, Edit, Save, Trash, Shield, Sparkles } from "lucide-react";

interface ProdutosViewProps {
  products: Product[];
  onSaveProduct: (p: Product) => void;
}

export default function ProdutosView({ products, onSaveProduct }: ProdutosViewProps) {
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newBenefit, setNewBenefit] = useState("");

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingProduct({
      id: `PROD-${Math.floor(100 + Math.random() * 899)}`,
      name: "",
      basePrice: 0,
      active: true,
      benefits: [],
      plansByMethod: {
        [PaymentMethod.A_VISTA]: {
          paymentMethod: PaymentMethod.A_VISTA,
          totalPrice: 0,
          downPayment: 0,
          installmentsCount: 1,
          installmentValue: 0
        }
      }
    });
    setIsCreating(true);
    setNewBenefit("");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onSaveProduct(editingProduct as Product);
      setEditingProduct(null);
      setIsCreating(false);
    }
  };

  const toggleProductActive = (p: Product) => {
    onSaveProduct({
      ...p,
      active: !p.active
    });
  };

  const addBenefit = () => {
    if (!newBenefit.trim() || !editingProduct) return;
    const list = editingProduct.benefits || [];
    setEditingProduct({
      ...editingProduct,
      benefits: [...list, newBenefit.trim()]
    });
    setNewBenefit("");
  };

  const removeBenefit = (index: number) => {
    if (!editingProduct) return;
    const list = [...(editingProduct.benefits || [])];
    list.splice(index, 1);
    setEditingProduct({
      ...editingProduct,
      benefits: list
    });
  };

  const updatePlanInfo = (method: PaymentMethod, field: keyof ProductPricePlan, value: number) => {
    if (!editingProduct) return;
    const plans = { ...(editingProduct.plansByMethod || {}) };
    const current = plans[method] || {
      paymentMethod: method,
      totalPrice: editingProduct.basePrice || 0,
      downPayment: 0,
      installmentsCount: 1,
      installmentValue: 0
    };

    const updated = {
      ...current,
      [field]: value
    };

    if (field === "totalPrice" && method === PaymentMethod.A_VISTA) {
      editingProduct.basePrice = value;
    }

    plans[method] = updated;
    setEditingProduct({
      ...editingProduct,
      plansByMethod: plans
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tabela de Produtos</h1>
          <p className="text-sm text-slate-500">Cadastre e configure títulos de lazer vitalício, faixas de preços e regulamentos de diárias</p>
        </div>
        
        <button
          onClick={handleCreate}
          className="flex items-center gap-1 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm"
        >
          <Plus className="h-4 w-4" /> Novo Título de Lazer
        </button>
      </div>

      {editingProduct ? (
        /* Edit or create form */
        <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-800">
              {isCreating ? "Novo Produto para Lançamento" : `Editando Produto: ${editingProduct.id}`}
            </h2>
            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                setIsCreating(false);
              }}
              className="text-slate-500 hover:text-slate-800 border border-slate-200 hover:bg-slate-50 py-1.5 px-3 rounded-lg text-xs font-semibold"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700">
            {/* General naming */}
            <div className="flex flex-col">
              <label className="font-bold mb-1">Nome Comercial do Título</label>
              <input
                required
                type="text"
                placeholder="Ex: TÍTULO FAMILIAR VITALÍCIO PREMIUM"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value.toUpperCase() })}
                className="p-2 border border-slate-200 outline-none rounded-lg"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-bold mb-1">Preço Base de Referência (R$)</label>
              <input
                required
                type="number"
                step="0.1"
                placeholder="Ex: 9600"
                value={editingProduct.basePrice}
                onChange={(e) => setEditingProduct({ ...editingProduct, basePrice: parseFloat(e.target.value) || 0 })}
                className="p-2 border border-slate-200 outline-none rounded-lg"
              />
            </div>

            <div className="flex flex-col col-span-2 sm:col-span-1">
              <label className="font-bold mb-1">Status Ativação</label>
              <select
                value={editingProduct.active ? "sim" : "nao"}
                onChange={(e) => setEditingProduct({ ...editingProduct, active: e.target.value === "sim" })}
                className="p-2 border border-slate-200 outline-none rounded-lg bg-white"
              >
                <option value="sim">Ativo (Permitir Lançamento de Venda)</option>
                <option value="nao">Inativo (Bloqueado temporariamente)</option>
              </select>
            </div>

            {/* Plans Configuration Block */}
            <div className="md:col-span-3 bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                <Tag className="h-4 w-4 text-emerald-600" /> Planos de Desconto / Condições de Pagamento Disponíveis
              </h3>
              
              <div className="space-y-4">
                {[PaymentMethod.A_VISTA, PaymentMethod.CARTAO_DIRETO, PaymentMethod.CREDITO_RECORRENTE, PaymentMethod.BOLETO, PaymentMethod.ENTRADA_PARCELAS].map((method) => {
                  const plan = editingProduct.plansByMethod?.[method] || {
                    paymentMethod: method,
                    totalPrice: editingProduct.basePrice || 0,
                    downPayment: 0,
                    installmentsCount: 1,
                    installmentValue: 0
                  };

                  return (
                    <div key={method} className="bg-white p-3.5 rounded-xl border border-slate-100 flex flex-col sm:flex-row items-center gap-3 text-xs">
                      <div className="w-full sm:w-44 font-bold text-slate-600">{method}</div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 flex-1 w-full">
                        <div className="flex flex-col">
                          <label className="text-[10px] text-slate-400 font-medium mb-0.5">Preço Total do Plano (R$)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={plan.totalPrice}
                            onChange={(e) => updatePlanInfo(method, "totalPrice", parseFloat(e.target.value) || 0)}
                            className="p-1 border border-slate-100 rounded focus:border-sky-500 font-medium"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[10px] text-slate-400 font-medium mb-0.5">Sinal de Entrada (R$)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={plan.downPayment}
                            onChange={(e) => updatePlanInfo(method, "downPayment", parseFloat(e.target.value) || 0)}
                            className="p-1 border border-slate-100 rounded focus:border-sky-500"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[10px] text-slate-400 font-medium mb-0.5">Nº de Parcelas</label>
                          <input
                            type="number"
                            value={plan.installmentsCount}
                            onChange={(e) => updatePlanInfo(method, "installmentsCount", parseInt(e.target.value) || 1)}
                            className="p-1 border border-slate-100 rounded focus:border-sky-500"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[10px] text-slate-400 font-medium mb-0.5">Valor da Parcela (R$)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={plan.installmentValue}
                            onChange={(e) => updatePlanInfo(method, "installmentValue", parseFloat(e.target.value) || 0)}
                            className="p-1 border border-slate-100 rounded focus:border-sky-500 text-sky-600 font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Benefits Builder */}
            <div className="md:col-span-3 bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-sky-500" /> Vantagens e Benefícios Oferecidos no Título (Cláusulas)
              </h3>
              
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Ex: 50% de desconto no estacionamento próprio"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  className="p-2 border border-slate-200 bg-white outline-none rounded-lg flex-1"
                />
                <button
                  type="button"
                  onClick={addBenefit}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-950 font-bold text-white rounded-lg text-xs shrink-0"
                >
                  Adicionar Vantagem
                </button>
              </div>

              {editingProduct.benefits && editingProduct.benefits.length > 0 ? (
                <div className="space-y-1.5">
                  {editingProduct.benefits.map((benefit, i) => (
                    <div key={i} className="flex justify-between items-center bg-white p-2 border border-slate-100 rounded-lg text-xs">
                      <span>• {benefit}</span>
                      <button
                        type="button"
                        onClick={() => removeBenefit(i)}
                        className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded transition-all"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 italic">Nenhum benefício cadastrado. Adicione pelo menos uma vantagem.</p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1"
            >
              <Save className="h-4 w-4" /> Gravar Definição de Título
            </button>
          </div>
        </form>
      ) : (
        /* Listings of active/inactive products in grid form - clean visual cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((prod) => (
            <div
              key={prod.id}
              className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between ${
                !prod.active ? "opacity-65" : ""
              }`}
            >
              {/* Product Card Header */}
              <div className="p-5 border-b border-slate-100 flex-1">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono text-slate-400">{prod.id}</span>
                  <button
                    onClick={() => toggleProductActive(prod)}
                    className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      prod.active ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                    }`}
                  >
                    {prod.active ? "Ativo" : "Suspenso"}
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-800 mt-2 truncate" title={prod.name}>
                  {prod.name}
                </h3>
                <p className="text-xl font-bold text-slate-800 mt-1">
                  {prod.basePrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  <span className="text-[10px] text-slate-400 font-normal"> preço base</span>
                </p>

                {/* Benefits Bullet Points */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <p className="text-[10.5px] uppercase tracking-wider font-bold text-slate-400">Benefícios inclusos:</p>
                  <ul className="space-y-1.5">
                    {prod.benefits.slice(0, 4).map((bf, idx) => (
                      <li key={idx} className="text-[11px] text-slate-600 flex items-start gap-1">
                        <span className="text-emerald-500 font-bold shrink-0">✓</span>
                        <span className="truncate">{bf}</span>
                      </li>
                    ))}
                    {prod.benefits.length > 4 && (
                      <li className="text-[10px] text-slate-400 italic">E mais {prod.benefits.length - 4} vantagens adicionais...</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Action panel at bottom */}
              <div className="bg-slate-50 p-3 flex justify-between items-center text-xs border-t border-slate-100">
                <span className="text-[10.5px] font-medium text-slate-400">
                  {Object.keys(prod.plansByMethod).length} Modelos de Acordo
                </span>
                
                <button
                  onClick={() => handleEdit(prod)}
                  className="flex items-center gap-1 border border-slate-200 bg-white hover:bg-slate-50 px-2.5 py-1 rounded-lg text-xs text-sky-600 font-bold"
                >
                  <Edit className="h-3 w-3" /> Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
