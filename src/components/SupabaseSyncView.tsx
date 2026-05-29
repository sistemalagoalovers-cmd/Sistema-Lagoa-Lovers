import React, { useState, useEffect } from "react";
import { 
  checkSupabaseConnection, 
  exportLocalDataToSupabase, 
  importDataFromSupabase, 
  GENERATED_BOOTSTRAP_SQL, 
  SupabaseConfigStatus 
} from "../supabaseClient";
import { 
  Database, 
  CloudLightning, 
  RefreshCw, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle, 
  XCircle, 
  Copy, 
  Terminal, 
  Check, 
  Server,
  Play
} from "lucide-react";
import { 
  ReceptionRecord, 
  AtendimentoRecord, 
  SalesRecord, 
  ContractRecord, 
  Product, 
  SystemUser, 
  ContractTemplate 
} from "../types";

interface SupabaseSyncViewProps {
  receptions: ReceptionRecord[];
  atendimentos: AtendimentoRecord[];
  sales: SalesRecord[];
  contracts: ContractRecord[];
  products: Product[];
  users: SystemUser[];
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

export default function SupabaseSyncView({
  receptions,
  atendimentos,
  sales,
  contracts,
  products,
  users,
  templates,
  onLoadAllData
}: SupabaseSyncViewProps) {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<SupabaseConfigStatus | null>(null);
  const [exportResult, setExportResult] = useState<any | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const runConnectionCheck = async () => {
    setChecking(true);
    setFeedbackMsg("Verificando conexão com as tabelas Supabase...");
    try {
      const res = await checkSupabaseConnection();
      setStatus(res);
      if (res.isConnected) {
        setFeedbackMsg("Conexão ativa! Todas ou algumas tabelas foram localizadas.");
      } else {
        setFeedbackMsg("Conectado ao endpoint Supabase, mas tabelas não foram detectadas no esquema público. Siga o passo a passo abaixo para criá-las.");
      }
    } catch (err: any) {
      setFeedbackMsg(`Erro ao estabelecer conexão: ${err?.message || err}`);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    runConnectionCheck();
  }, []);

  const handleExport = async () => {
    setLoading(true);
    setExportResult(null);
    setFeedbackMsg("Exportando dados locais (push) para o Supabase...");
    try {
      const res = await exportLocalDataToSupabase({
        receptions,
        atendimentos,
        sales,
        contracts,
        products,
        users,
        templates
      });
      setExportResult(res);
      if (res.errors.length === 0) {
        setFeedbackMsg("Dados locais exportados com absoluto sucesso!");
      } else {
        setFeedbackMsg("Exportação concluída com avisos residuais (verifique se todas as tabelas foram criadas).");
      }
    } catch (err: any) {
      setFeedbackMsg(`Erro na exportação: ${err?.message || err}`);
    } finally {
      setLoading(false);
      runConnectionCheck();
    }
  };

  const handleImport = async () => {
    setLoading(true);
    setFeedbackMsg("Importando dados do Supabase (pull) para o navegador...");
    try {
      const res = await importDataFromSupabase();
      
      const totalImported = 
        res.receptions.length + 
        res.atendimentos.length + 
        res.sales.length + 
        res.contracts.length + 
        res.products.length + 
        res.users.length + 
        res.templates.length;

      if (totalImported > 0) {
        // Only load if actual datasets are brought back
        onLoadAllData({
          receptions: res.receptions.length ? res.receptions : receptions,
          atendimentos: res.atendimentos.length ? res.atendimentos : atendimentos,
          sales: res.sales.length ? res.sales : sales,
          contracts: res.contracts.length ? res.contracts : contracts,
          products: res.products.length ? res.products : products,
          users: res.users.length ? res.users : users,
          templates: res.templates.length ? res.templates : templates
        });
        setFeedbackMsg(`Importação concluída com sucesso! ${totalImported} registros sincronizados.`);
      } else {
        setFeedbackMsg("Importação finalizada, mas nenhuma tabela retornou registros. Verifique se as tabelas contêm dados.");
      }
    } catch (err: any) {
      setFeedbackMsg(`Erro na importação: ${err?.message || err}`);
    } finally {
      setLoading(false);
      runConnectionCheck();
    }
  };

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(GENERATED_BOOTSTRAP_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-sky-50 text-sky-600 rounded-xl">
              <Database className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Sincronia na Nuvem Supabase</h1>
              <p className="text-xs text-slate-500 font-medium">Configure e sincronize o banco de dados Lagoa Lovers em tempo real com seu projeto Supabase</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runConnectionCheck}
            disabled={checking || loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${checking ? "animate-spin" : ""}`} />
            Diagnosticar Conexão
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left main area: Status & Direct Actions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Status Card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <CloudLightning className="h-4 w-4 text-amber-500 animate-pulse" />
              Estado da Conexão em Tempo Real
            </h2>

            {status?.isConfigured ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100/50">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Endpoint API</span>
                  <code className="text-xs font-mono font-semibold text-slate-700 block select-all break-all mt-1">
                    {status.url}
                  </code>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100/50 flex flex-col justify-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Status Geral</span>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {status.isConnected ? (
                      <>
                        <span className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-ping absolute" />
                        <span className="h-2.5 w-2.5 bg-emerald-500 rounded-full relative" />
                        <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">Conectado Live</span>
                      </>
                    ) : (
                      <>
                        <span className="h-2.5 w-2.5 bg-amber-500 rounded-full" />
                        <span className="text-xs font-extrabold text-amber-600 uppercase tracking-wider">Credenciais ok • Sem Tabelas</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-xs">
                As propriedades da API do Supabase não estão definidas ou contêm placeholders genéricos no .env.
              </div>
            )}

            {/* Error panel if any */}
            {status?.error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 text-xs font-mono">
                {status.error}
              </div>
            )}

            {/* System Status Tracker message */}
            {feedbackMsg && (
              <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl text-sky-800 text-xs font-semibold flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-sky-500 rounded-full animate-bounce shrink-0" />
                {feedbackMsg}
              </div>
            )}
          </div>

          {/* Sync operations Dashboard */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Painel de Sincronização de Dados
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Push Action wrapper */}
              <div className="border border-slate-100 rounded-xl p-4.5 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase">
                    <ArrowUpRight className="h-4 w-4 text-sky-500" />
                    Enviar Banco Local (Push)
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    Pega todo o conjunto de dados atual do seu navegador (<strong>{receptions.length}</strong> casais, <strong>{sales.length}</strong> vendas, <strong>{products.length}</strong> produtos, etc.) e envia em lote para seu Supabase via Upsert.
                  </p>
                </div>
                <button
                  onClick={handleExport}
                  disabled={loading || checking}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50 mt-3"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  {loading ? "Sincronizando..." : "Exportar para Supabase"}
                </button>
              </div>

              {/* Pull Action wrapper */}
              <div className="border border-slate-100 rounded-xl p-4.5 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase">
                    <ArrowDownLeft className="h-4 w-4 text-teal-600" />
                    Importar do Banco Nuvem (Pull)
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    Busca todos os registros salvos em seu projeto Supabase atualizado e popula o contexto local do seu clube de férias, sobrescrevendo eventuais duplicados já existentes.
                  </p>
                </div>
                <button
                  onClick={handleImport}
                  disabled={loading || checking}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50 mt-3"
                >
                  <ArrowDownLeft className="h-3.5 w-3.5" />
                  {loading ? "Processando..." : "Importar do Supabase"}
                </button>
              </div>

            </div>

            {/* Display operation feedback figures if loaded */}
            {exportResult && (
              <div className="bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl p-4 transition-colors">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-2">Resultados da última Transação</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-[11px]">
                  <div className="bg-white p-2 rounded border border-slate-100">
                    <span className="font-bold text-slate-600">Recepções:</span> <span className="font-mono text-sky-600 font-extrabold">{exportResult.receptions}</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-100">
                    <span className="font-bold text-slate-600">Atendimentos:</span> <span className="font-mono text-sky-600 font-extrabold">{exportResult.atendimentos}</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-100">
                    <span className="font-bold text-slate-600">Vendas:</span> <span className="font-mono text-sky-600 font-extrabold">{exportResult.sales}</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-100">
                    <span className="font-bold text-slate-600">Contratos:</span> <span className="font-mono text-sky-600 font-extrabold">{exportResult.contracts}</span>
                  </div>
                </div>
                {exportResult.errors?.length > 0 && (
                  <div className="mt-3 text-red-600 text-[10px] font-mono list-decimal pl-4">
                    {exportResult.errors.map((e: string, idx: number) => (
                      <div key={idx}>{e}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Setup Guide via CLI Section */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="h-4 w-4 text-sky-600" />
              Guia de Integração Local & CLI Supabase
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Siga os comandos abaixos em seu ambiente de terminal para vincular este projeto via Supabase CLI:
            </p>

            <div className="space-y-3 font-mono text-[11.5px]">
              <div className="bg-slate-900 text-slate-350 p-3.5 rounded-xl border border-slate-800 relative">
                <span className="text-[9px] text-slate-500 font-bold uppercase absolute top-2 right-3">Comando 1</span>
                <span className="text-sky-400 block">$ supabase login</span>
                <span className="text-slate-500 block"># Valida sua conta com o token Supabase</span>
              </div>

              <div className="bg-slate-900 text-slate-350 p-3.5 rounded-xl border border-slate-800 relative">
                <span className="text-[9px] text-slate-500 font-bold uppercase absolute top-2 right-3">Comando 2</span>
                <span className="text-sky-400 block">$ supabase init</span>
                <span className="text-slate-500 block"># Inicializa o repositório local do Supabase</span>
              </div>

              <div className="bg-slate-900 text-slate-350 p-3.5 rounded-xl border border-slate-800 relative">
                <span className="text-[9px] text-slate-500 font-bold uppercase absolute top-2 right-3">Comando 3</span>
                <span className="text-sky-450 block">$ supabase link --project-ref xxxxprajzwihteuugnwp</span>
                <span className="text-slate-500 block"># Associa este repositório ao projeto oficial na nuvem</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right side panel: Table Checklist & DB SQL copy */}
        <div className="space-y-6">
          
          {/* Table List Checklist */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Diagnóstico das Tabelas
            </h2>
            <p className="text-[11px] text-slate-500">
              O sistema sincroniza estas tabelas essenciais para gerenciar recepção, showroom e emissões de DOCX.
            </p>

            <div className="space-y-2">
              {[
                { key: "products", name: "Produtos do Clube (products)" },
                { key: "users", name: "Acessos do Sistema (users)" },
                { key: "receptions", name: "Controle da Recepção (receptions)" },
                { key: "atendimentos", name: "Atendimentos de Corretores (atendimentos)" },
                { key: "sales", name: "Fichas de Vendas (sales)" },
                { key: "contracts", name: "Contratos de Uso DOCX (contracts)" },
                { key: "templates", name: "Modelos Customizados (templates)" },
              ].map(table => {
                const detected = status?.tablesStatus[table.key] || false;
                return (
                  <div key={table.key} className="flex items-center justify-between p-2.5 bg-slate-50/50 hover:bg-slate-50 rounded-lg text-xs font-semibold border border-slate-100/50 transition-colors">
                    <span className="text-slate-700">{table.name}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {detected ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wide">Mapeada</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-amber-500" />
                          <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wide">Ausente</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SQL Editor copy instruction */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Server className="h-4 w-4 text-teal-600" />
                Script SQL de Bootstrap
              </h2>
              <button
                onClick={copySqlToClipboard}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                title="Copiar Script SQL"
              >
                {copiedSql ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Use o botão copiar acima e execute as intruções em seu <span className="font-semibold text-slate-700">Supabase SQL Editor</span> para criar automaticamente todas as tabelas perfeitamente integradas.
            </p>

            <div className="relative">
              <pre className="text-[9px] bg-slate-900 text-slate-350 p-3 rounded-lg overflow-x-auto max-h-[220px] font-mono leading-relaxed select-all">
                {GENERATED_BOOTSTRAP_SQL.substring(0, 400)}...
              </pre>
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none rounded-b-lg" />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
