/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { ContractTemplate, ReceptionRecord, SalesRecord, Product } from "../types";
import { INITIAL_PRODUCTS } from "../initialData";
import { 
  FileText, 
  FileDown, 
  CheckCircle, 
  RefreshCw, 
  Upload, 
  Sparkles, 
  Building2, 
  Printer, 
  Eye, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Award,
  ShieldCheck,
  Check,
  Trash2,
  ListCollapse,
  ChevronUp
} from "lucide-react";
import FichaContratoView from "./FichaContratoView";

interface ContratosViewProps {
  templates: ContractTemplate[];
  receptions: ReceptionRecord[];
  sales: SalesRecord[];
  products: Product[];
  onAddTemplate: (t: ContractTemplate) => void;
  onDeleteTemplate: (id: string) => void;
  onDeleteSale: (id: string) => void;
  preSelectedReceptionId?: string | null;
}

// Helper to convert numeric monetary value to words in Portuguese (Extenso)
function valorPorExtenso(valor: number): string {
  if (!valor || isNaN(valor)) return "zero reais";
  
  const centenas = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];
  const dezenas = ["", "dez", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
  const dezenove = ["dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
  const unidades = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"];

  const numWords = (n: number): string => {
    if (n === 0) return "";
    if (n === 100) return "cem";
    if (n < 10) return unidades[n];
    if (n < 20) return dezenove[n - 10];
    if (n < 100) {
      const d = Math.floor(n / 10);
      const u = n % 10;
      return dezenas[d] + (u > 0 ? " e " + unidades[u] : "");
    }
    const c = Math.floor(n / 100);
    const rest = n % 100;
    return centenas[c] + (rest > 0 ? " e " + numWords(rest) : "");
  };

  const valorInteiro = Math.floor(valor);
  const centavos = Math.round((valor - valorInteiro) * 100);

  let extenso = "";
  if (valorInteiro > 0) {
    if (valorInteiro < 1000) {
      extenso = numWords(valorInteiro);
    } else if (valorInteiro < 1000000) {
      const milhar = Math.floor(valorInteiro / 1000);
      const restoMilhar = valorInteiro % 1000;
      const milharText = milhar === 1 ? "um mil" : numWords(milhar) + " mil";
      extenso = milharText + (restoMilhar > 0 ? (restoMilhar < 100 || restoMilhar % 100 === 0 ? " e " : " ") + numWords(restoMilhar) : "");
    } else {
      extenso = valorInteiro.toString(); // fallback for huge numbers
    }
    extenso += " reais";
  }

  if (centavos > 0) {
    extenso += (valorInteiro > 0 ? " e " : "") + numWords(centavos) + " centavos";
  }
  return extenso;
}

// Mini parsing helper for bold Markdown text
function parseLine(line: string): React.ReactNode[] | string {
  if (!line) return "";
  const boldRx = /\*\*(.*?)\*\*/g;
  const els: React.ReactNode[] = [];
  let lastIdx = 0;
  let match;
  
  // Clean checkbox format [ ] or ( ) to pretty checkable items in live view
  let cleanLine = line;
  cleanLine = cleanLine.replace(/\[\s*\]/g, "☐");
  cleanLine = cleanLine.replace(/\(\s*\)/g, "◯");

  while ((match = boldRx.exec(cleanLine)) !== null) {
    if (match.index > lastIdx) {
      els.push(cleanLine.substring(lastIdx, match.index));
    }
    els.push(
      <strong key={match.index} className="font-extrabold text-emerald-900 border-b border-emerald-150">
        {match[1]}
      </strong>
    );
    lastIdx = boldRx.lastIndex;
  }
  
  if (lastIdx < cleanLine.length) {
    els.push(cleanLine.substring(lastIdx));
  }
  
  return els.length > 0 ? els : cleanLine;
}

// Custom AST-like Markdown block parser to generate perfect styled tables and paragraphs
function parseMarkdownToReact(markdown: string): React.ReactNode[] {
  if (!markdown) return [];
  const lines = markdown.split("\n");
  const parsedElements: React.ReactNode[] = [];
  let tableRows: string[][] = [];
  let isInsideTable = false;

  const flushTable = (key: number) => {
    if (tableRows.length === 0) return;
    const hasHeader = tableRows.length > 1;
    const headers = tableRows[0];
    const dataRows = tableRows.slice(hasHeader ? 1 : 0);
    const cleanDataRows = dataRows.filter(r => !r.every(cell => cell.trim().startsWith("---") || cell.trim() === ""));

    parsedElements.push(
      <div key={`table-${key}`} className="my-4 overflow-x-auto border border-emerald-200/80 rounded-xl shadow-sm bg-white">
        <table className="w-full text-left border-collapse font-sans text-[11px]">
          {hasHeader && (
            <thead>
              <tr className="bg-[#0B4A34] text-white">
                {headers.map((h, i) => (
                  <th key={i} className="p-2 px-3 font-bold uppercase tracking-wider border-r border-[#083626] last:border-0">{h.trim()}</th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="bg-white divide-y divide-emerald-105">
            {cleanDataRows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-emerald-50/20"}>
                {row.map((cell, ci) => (
                  <td key={ci} className="p-2 px-3 border-r border-emerald-55 last:border-0 font-medium text-slate-700">{parseLine(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
    isInsideTable = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Table parsing
    if (line.startsWith("|")) {
      isInsideTable = true;
      const cells = line.split("|").slice(1, -1);
      if (cells.every(c => c.trim().startsWith("-"))) {
        continue;
      }
      tableRows.push(cells);
      continue;
    } else if (isInsideTable) {
      flushTable(i);
    }

    // Header 1
    if (line.startsWith("# ")) {
      parsedElements.push(
        <h1 key={i} className="text-base font-extrabold text-[#0B4A34] text-center uppercase tracking-wide border-b-2 border-emerald-700/10 pb-2 mt-6 mb-3">
          {parseLine(line.substring(2))}
        </h1>
      );
    }
    // Header 2
    else if (line.startsWith("## ")) {
      parsedElements.push(
        <h2 key={i} className="text-sm font-extrabold text-slate-805 text-center uppercase tracking-wider mt-4 mb-2">
          {parseLine(line.substring(3))}
        </h2>
      );
    }
    // Header 3
    else if (line.startsWith("### ")) {
      parsedElements.push(
        <h3 key={i} className="text-[12px] font-bold text-[#0B4A34] border-l-4 border-[#0B4A34] pl-2.5 mt-5 mb-2.5 uppercase tracking-wide">
          {parseLine(line.substring(4))}
        </h3>
      );
    }
    // Bullets List Item
    else if (line.startsWith("* ")) {
      parsedElements.push(
        <div key={i} className="flex items-start gap-2 pl-4 my-1 sm:my-2 text-justify leading-relaxed">
          <span className="text-[#0B4A34] font-extrabold shrink-0 mt-0.5">•</span>
          <span className="text-[11px] text-slate-700 font-serif leading-relaxed">{parseLine(line.substring(2))}</span>
        </div>
      );
    }
    // Separator line
    else if (line.startsWith("---") && !line.includes("PAGE_BREAK")) {
      parsedElements.push(
        <hr key={i} className="my-5 border-t border-double border-emerald-700/20" />
      );
    }
    // Empty line
    else if (line === "") {
      parsedElements.push(<div key={i} className="h-2" />);
    }
    // Standard paragraph
    else {
      parsedElements.push(
        <p key={i} className="text-[11px] text-slate-700 font-serif leading-relaxed text-justify indent-5 my-1.5 antialiased">
          {parseLine(line)}
        </p>
      );
    }
  }

  // Final flush
  if (isInsideTable) {
    flushTable(888);
  }

  return parsedElements;
}

export default function ContratosView({
  templates,
  receptions,
  sales,
  products,
  onAddTemplate,
  onDeleteTemplate,
  onDeleteSale,
  preSelectedReceptionId
}: ContratosViewProps) {
  
  const [selectedClientId, setSelectedClientId] = useState<string>(preSelectedReceptionId || receptions[0]?.id || "");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || "");
  const [selectedProductIdForNewTemplate, setSelectedProductIdForNewTemplate] = useState<string>(products[0]?.id || "PROD-001");
  const [customFileTemplateName, setCustomFileTemplateName] = useState("");
  const [isSignaturesDone, setIsSignaturesDone] = useState(false);
  const [subTab, setSubTab] = useState<"ficha" | "legislativo" | "emitidos">("emitidos");
  
  // Multi-page display options
  const [viewMode, setViewMode] = useState<"stacked" | "paged">("stacked");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Active records
  const activeClient = useMemo(() => {
    return receptions.find(r => r.id === selectedClientId);
  }, [receptions, selectedClientId]);

  const activeSale = useMemo(() => {
    return sales.find(s => s.receptionId === selectedClientId);
  }, [sales, selectedClientId]);

  const activeTemplate = useMemo(() => {
    return templates.find(t => t.id === selectedTemplateId);
  }, [templates, selectedTemplateId]);

  // Auto-link and select the contract template belonging to the client's purchased product
  React.useEffect(() => {
    if (activeSale) {
      const match = templates.find(t => t.productId === activeSale.productId);
      if (match) {
        setSelectedTemplateId(match.id);
      }
    }
  }, [selectedClientId, activeSale, templates]);

  // Simulates custom word templates uploads
  const handleUploadTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFileTemplateName) return;

    const newT: ContractTemplate = {
      id: `TPL-${Math.floor(100 + Math.random() * 899)}`,
      name: customFileTemplateName,
      productId: selectedProductIdForNewTemplate,
      fileName: customFileTemplateName.toLowerCase().endsWith(".docx") ? customFileTemplateName : `${customFileTemplateName}.docx`,
      placeholders: ["GUEST1_NAME", "GUEST1_CPF", "PRODUCT_NAME", "TOTAL_PRICE"],
      content: `---PAGE_BREAK---
# ANEXO ADICIONAL DE TERMOS
## INSTRUMENTO CONTRATUAL COMPLEMENTAR: [VENDAPESSOA1NOME]

### OBJETO
Complemento de contrato corporativo emitido em Caldas Novas.
Adquirente titular devidamente qualificado: **[VENDAPESSOA1NOME]**, CPF: **[VENDAPESSOA1CPF]**.

### PLANO E VALORES
Produto adquirido: [PRODUCT_NAME].
Preço total das cessões de uso: [VENDAVALORFINANCIADO] ([VENDAVALORFINANCIADOEXTENSO]).
Sinal de entrada pago: [PARCELAVALOR1] na data correspondente de registro.

Assinado eletronicamente sob proteção jurídica em Caldas Novas, [VENDADIA] de [VENDAMES] de [VENDAANO].
`
    };

    onAddTemplate(newT);
    setSelectedTemplateId(newT.id);
    setCustomFileTemplateName("");
  };

  // Substitute both PDF [PLACEHOLDER] brackets style and standard dynamic template ones
  const substitutes = useMemo(() => {
    const guest1Name = activeClient?.guest1?.name || "ADQUIRENTE TITULAR";
    const guest1Cpf = activeClient?.guest1?.cpf || "___.___.___-__";
    const guest1Rg = activeClient?.guest1?.rg || "_________";
    const guest1Nationality = activeClient?.guest1?.nationality || "Brasileiro(a)";
    const guest1CivilStatus = activeClient?.guest1?.civilStatus || "Casado(a)";
    const guest1Profession = activeClient?.guest1?.profession || "Profissional Liberal";

    const street = activeClient?.address?.street || "_____________________";
    const num = activeClient?.address?.number || "S/N";
    const neighborhood = activeClient?.address?.neighborhood || "_____________________";
    const cep = activeClient?.address?.cep || "_____-___";
    const city = activeClient?.address?.city || "_____________________";
    const state = activeClient?.address?.state || "GO";

    const guest2Name = activeClient?.guest2?.name || "NÃO INFORMADO";
    const guest2Cpf = activeClient?.guest2?.cpf || "___.___.___-__";

    const prodName = activeSale?.productName || "Plano Familiar Premium";
    const totalVal = activeSale?.totalPrice || 18900;
    const downVal = activeSale?.downPayment || 3000;
    const remainVal = activeSale?.remainingBalance || 15900;
    const installmentsNo = activeSale?.installmentsCount || 36;
    const instVal = activeSale?.installmentValue || 441.66;
    const dueDate = activeSale?.firstDueDate || "IMEDIATO";

    const totalPriceStr = totalVal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    const downPaymentStr = downVal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    const remainingBalanceStr = remainVal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    const installmentValueStr = instVal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    const planInfoStr = `Entrada de ${downPaymentStr} mais ${installmentsNo} prestações mensais de ${installmentValueStr}`;

    const today = new Date();
    const todayDay = today.getDate().toString();
    const months = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    const todayMonthName = months[today.getMonth()];
    const todayYear = today.getFullYear().toString();

    const todayDateStr = `${todayDay} de ${todayMonthName} de ${todayYear}`;

    const contractNumber = activeSale?.id 
      ? activeSale.id.replace(/\D/g, "") 
      : activeClient ? `10${activeClient.id}` : "7212";

    // Matching translations
    return {
      "\\[VENDACONTRATONUMERO\\]": contractNumber,
      "\\[VENDAANO\\]": todayYear,
      "\\[VENDADIA\\]": todayDay,
      "\\[VENDAMES\\]": todayMonthName,
      "\\[VENDAPESSOA1NOME\\]": guest1Name.toUpperCase(),
      "\\[VENDAPESSOA1NACIONALIDADE\\]": guest1Nationality,
      "\\[VENDAPESSOA1ESTADOCIVIL\\]": guest1CivilStatus,
      "\\[VENDAPESSOA1PROFISSAO\\]": guest1Profession,
      "\\[VENDAPESSOA1RG\\]": guest1Rg,
      "\\[VENDAPESSOA1CPF\\]": guest1Cpf,
      "\\[VENDAPESSOA1ENDERECO\\]": street.toUpperCase(),
      "\\[VENDAPESSOA1NUMEROENDERECO\\]": num,
      "\\[VENDAPESSOA1BAIRRO\\]": neighborhood.toUpperCase(),
      "\\[VENDAPESSOA1CEP\\]": cep,
      "\\[VENDAPESSOA1CIDADE\\]": city.toUpperCase(),
      "\\[VENDAPESSOA1ESTADO\\]": state.toUpperCase(),
      "\\[ATENDIMENTOPESSOA1ACOMPANHANTE1\\]": guest2Name.toUpperCase(),
      "\\[VENDAVALORFINANCIADO\\]": totalPriceStr,
      "\\[VENDAVALORFINANCIADOEXTENSO\\]": valorPorExtenso(totalVal),
      "\\[PARCELATIPOPARCELA1\\]": "Entrada / Sinal de Garantia",
      "\\[PARCELAQUANTIDADE1\\]": "1",
      "\\[PARCELAVALOR1\\]": downPaymentStr,
      "\\[PARCELAVENCIMENTO1\\]": "IMEDIATO",
      "\\[PARCELADETALHE1\\]": activeSale ? activeSale.paymentMethod : "PIX / CARTÃO",
      "\\[PARCELATIPOPARCELA2\\]": "Parcelamento Mensal",
      "\\[PARCELAQUANTIDADE2\\]": `${installmentsNo}x`,
      "\\[PARCELAVALOR2\\]": installmentValueStr,
      "\\[PARCELAVENCIMENTO2\\]": dueDate,
      "\\[PARCELADETALHE2\\]": "Cartão Recorrente / Boleto",
      "\\[VENDAVALORSALDORESTANTE\\]": "Saldo Restante Financiado",
      "\\[PARCELAVALOR3\\]": remainingBalanceStr,
      "\\[PARCELAVENCIMENTO3\\]": dueDate,
      "\\[PARCELADETALHE3\\]": "Boleto Bancário / Recorrente",
      "\\[PARCELAVALOR4\\]": "R$ 0,00",
      "\\[PARCELAVENCIMENTO4\\]": "-",
      "\\[PARCELADETALHE4\\]": "-",

      // Match classic fallback double curly braces as well
      "\\{\\{GUEST1_NAME\\}\\}": guest1Name.toUpperCase(),
      "\\{\\{GUEST1_CPF\\}\\}": guest1Cpf,
      "\\{\\{GUEST1_RG\\}\\}": guest1Rg,
      "\\{\\{GUEST1_ADDRESS\\}\\}": `${street} ${num}, ${neighborhood}`.toUpperCase(),
      "\\{\\{GUEST1_PROFESSION\\}\\}": guest1Profession.toUpperCase(),
      "\\{\\{GUEST2_NAME\\}\\}": guest2Name.toUpperCase(),
      "\\{\\{GUEST2_CPF\\}\\}": guest2Cpf,
      "\\{\\{PRODUCT_NAME\\}\\}": prodName.toUpperCase(),
      "\\{\\{TOTAL_PRICE\\}\\}": totalPriceStr,
      "\\{\\{INSTALLMENTS_PLAN\\}\\}": planInfoStr,
      "\\{\\{DATE_NOW\\}\\}": todayDateStr,
    };
  }, [activeClient, activeSale]);

  const activeProduct = useMemo(() => {
    if (activeSale?.productId) {
      return activeSale.productId;
    }
    if (activeTemplate?.productId) {
      return activeTemplate.productId;
    }
    return "PROD-001";
  }, [activeSale, activeTemplate]);

  const productSpecs = useMemo(() => {
    const pId = activeProduct;
    let isFamiliar = pId === "PROD-001" || pId === "PROD-002";
    let titleDescription = "TÍTULO FAMILIAR VITALÍCIO";
    let diariasText = "08 (oito) diárias";
    let capacidadeText = "06 (seis) pessoas";
    let periodoDiarias = "Utilizável ao longo de 02 (dois) períodos de 04 (quatro) dias cada. As diárias disponíveis são entre Domingo e Quinta-feira;";
    let prazoTroca = "36 (trinta seis)";
    let anuidadeParcelas = "03 (três) vezes";
    let beneficiariosIntro = "Para usufruir dos benefícios do Título adquirido, o(a) ADERENTE indica, como BENEFICIÁRIOS:";
    let hasSecondRow = true;
    let titleAcquisitionClause = "“TÍTULO FAMILIAR VITALÍCIO”";
    
    if (pId === "PROD-003") { // 1 PESSOA
      isFamiliar = false;
      titleDescription = "TÍTULO SOCIAL VITALÍCIO";
      diariasText = "04 (quatro) diárias";
      capacidadeText = "04 (quatro) pessoas";
      periodoDiarias = "As diárias disponíveis são entre Domingo e Quinta-feira;";
      prazoTroca = "12 (doze)";
      anuidadeParcelas = "parceladas em até 12 (doze) prestações mensais, mediante cobrança recorrente autorizada pelo(a) ADERENTE.";
      beneficiariosIntro = "Para usufruir dos benefícios do Título adquirido, o(a) ADERENTE adquire o direito individual, descrito como BENEFICIÁRIOS:";
      hasSecondRow = false;
      titleAcquisitionClause = "“TÍTULO SOCIAL VITALÍCIO”";
    } else if (pId === "PROD-004") { // 2 PESSOAS
      isFamiliar = false;
      titleDescription = "TÍTULO SOCIAL VITALÍCIO";
      diariasText = "04 (quatro) diárias";
      capacidadeText = "04 (quatro) pessoas";
      periodoDiarias = "As diárias disponíveis são entre Domingo e Quinta-feira;";
      prazoTroca = "12 (doze)";
      anuidadeParcelas = "parceladas em até 12 (doze) prestações mensais, mediante cobrança recorrente autorizada pelo(a) ADERENTE.";
      beneficiariosIntro = "Para usufruir dos benefícios do Título adquirido, adquire o direito eleger até 02 (duas) pessoas, descrito como BENEFICIÁRIOS:";
      hasSecondRow = true;
      titleAcquisitionClause = "“TÍTULO SOCIAL VITALÍCIO”";
    } else if (pId === "PROD-005") { // 3 PESSOAS
      isFamiliar = false;
      titleDescription = "TÍTULO SOCIAL VITALÍCIO";
      diariasText = "04 (quatro) diárias";
      capacidadeText = "04 (quatro) pessoas";
      periodoDiarias = "As diárias disponíveis são entre Domingo e Quinta-feira;";
      prazoTroca = "12 (doze)";
      anuidadeParcelas = "parceladas em até 12 (doze) prestações mensais, mediante cobrança recorrente autorizada pelo(a) ADERENTE.";
      beneficiariosIntro = "Para usufruir dos benefícios do Título adquirido, adquire o direito eleger até 03 (três) pessoas, descrito como BENEFICIÁRIOS:";
      hasSecondRow = true;
      titleAcquisitionClause = "“TÍTULO SOCIAL VITALÍCIO”";
    } else if (pId === "PROD-006") { // 4 PESSOAS
      isFamiliar = false;
      titleDescription = "TÍTULO SOCIAL VITALÍCIO";
      diariasText = "04 (quatro) diárias";
      capacidadeText = "04 (quatro) pessoas";
      periodoDiarias = "As diárias disponíveis são entre Domingo e Quinta-feira;";
      prazoTroca = "12 (doze)";
      anuidadeParcelas = "parceladas em até 12 (doze) prestações mensais, mediante cobrança recorrente autorizada pelo(a) ADERENTE.";
      beneficiariosIntro = "Para usufruir dos benefícios do Título adquirido, adquire o direito eleger até 04 (quatro) pessoas, descrito como BENEFICIÁRIOS:";
      hasSecondRow = true;
      titleAcquisitionClause = "“TÍTULO SOCIAL VITALÍCIO”";
    } else if (pId === "PROD-007") { // 5 PESSOAS
      isFamiliar = false;
      titleDescription = "TÍTULO SOCIAL VITALÍCIO";
      diariasText = "06 (seis) diárias";
      capacidadeText = "06 (seis) pessoas";
      periodoDiarias = "Utilizável ao longo de 02 (dois) períodos de 03 (três) dias cada. As diárias disponíveis são entre Domingo e Quarta-feira;";
      prazoTroca = "12 (doze)";
      anuidadeParcelas = "parceladas em até 12 (doze) prestações mensais, mediante cobrança recorrente autorizada pelo(a) ADERENTE.";
      beneficiariosIntro = "Para usufruir dos benefícios do Título adquirido, adquire o direito eleger até 05 (cinco) pessoas, descrito como BENEFICIÁRIOS:";
      hasSecondRow = true;
      titleAcquisitionClause = "“TÍTULO SOCIAL VITALÍCIO”";
    } else if (pId === "PROD-008") { // 6 PESSOAS
      isFamiliar = false;
      titleDescription = "TÍTULO SOCIAL VITALÍCIO";
      diariasText = "06 (seis) diárias";
      capacidadeText = "06 (seis) pessoas";
      periodoDiarias = "Utilizável ao longo de 02 (dois) períodos of 03 (três) dias cada. As diárias disponíveis são entre Domingo e Quarta-feira;";
      prazoTroca = "12 (doze)";
      anuidadeParcelas = "parceladas em até 12 (doze) prestações mensais, mediante cobrança recorrente autorizada pelo(a) ADERENTE.";
      beneficiariosIntro = "Para usufruir dos benefícios do Título adquirido, adquire o direito eleger até 06 (seis) pessoas, descrito como BENEFICIÁRIOS:";
      hasSecondRow = true;
      titleAcquisitionClause = "“TÍTULO SOCIAL VITALÍCIO”";
    }

    return {
      isFamiliar,
      titleDescription,
      diariasText,
      capacidadeText,
      periodoDiarias,
      prazoTroca,
      anuidadeParcelas,
      beneficiariosIntro,
      hasSecondRow,
      titleAcquisitionClause
    };
  }, [activeProduct]);

  const renderedContractContent = useMemo(() => {
    if (!activeTemplate) return "Selecione um modelo de contrato para pré-visualizar.";
    let txt = activeTemplate.content || "";
    
    // 1. Dynamic product adaptation
    txt = txt.replace(/TÍTULO FAMILIAR VITALÍCIO/g, productSpecs.titleDescription);
    txt = txt.replace(/TÍTULO SOCIAL VITALÍCIO/g, productSpecs.titleDescription);
    txt = txt.replace(/“TÍTULO FAMILIAR VITALÍCIO”/g, productSpecs.titleAcquisitionClause);
    txt = txt.replace(/“TÍTULO SOCIAL VITALÍCIO”/g, productSpecs.titleAcquisitionClause);
    txt = txt.replace(/08 \(oito\) diárias/g, productSpecs.diariasText);
    txt = txt.replace(/04 \(quatro\) diárias/g, productSpecs.diariasText);
    txt = txt.replace(/06 \(seis\) diárias/g, productSpecs.diariasText);
    txt = txt.replace(/06\(seis\) pessoas/g, productSpecs.capacidadeText);
    txt = txt.replace(/04 \(quatro\) pessoas/g, productSpecs.capacidadeText);
    txt = txt.replace(/06 \(seis\) pessoas/g, productSpecs.capacidadeText);
    
    txt = txt.replace(/Utilizável ao longo de 02 \(dois\) períodos de 04 \(quatro\) dias cada\. As diárias disponíveis são entre Domingo e Quinta-feira;/g, productSpecs.periodoDiarias);
    txt = txt.replace(/As diárias disponíveis são entre Domingo e Quinta-feira;/g, productSpecs.periodoDiarias);
    
    txt = txt.replace(/36 \(trinta seis\) meses/g, `${productSpecs.prazoTroca} meses`);
    txt = txt.replace(/12 \(doze\) meses/g, `${productSpecs.prazoTroca} meses`);
    txt = txt.replace(/03 \(três\) vezes no cartão de crédito/g, productSpecs.anuidadeParcelas.includes("até 12") ? "crédito recorrente" : "03 (três) vezes no cartão de crédito");
    txt = txt.replace(/parcelada em 03 \(três\) vezes/g, productSpecs.anuidadeParcelas.includes("até 12") ? "parcelada em até 12 (doze) vezes" : "parcelada em 03 (três) vezes");
    
    txt = txt.replace(/Para usufruir dos benefícios do Título adquirido, o\(a\) ADERENTE indica, como BENEFICIÁRIOS:/g, productSpecs.beneficiariosIntro);
    txt = txt.replace(/Para usufruir dos benefícios do Título adquirido, o\(a\) ADERENTE adquire o direito individual, descrito como BENEFICIÁRIOS:/g, productSpecs.beneficiariosIntro);
    
    if (!productSpecs.hasSecondRow) {
      txt = txt.replace(/\| 2 \| \[ATENDIMENTOPESSOA1ACOMPANHANTE1\] \| \|/g, "");
    }

    // 2. Exact placeholder translations with bracket-resiliency
    for (const [key, replacementVal] of Object.entries(substitutes)) {
      const cleanKey = key.replace(/\\/g, ""); // e.g. "[VENDAPESSOA1NOME]"
      const plainWord = cleanKey.replace(/[\[\]\{\}]/g, ""); // e.g. "VENDAPESSOA1NOME"

      // Replace Case-Insensitive Brackets [PLACEHOLDER]
      try {
        const rxBracket = new RegExp(`\\[\\s*${plainWord}\\s*\\]`, "gi");
        txt = txt.replace(rxBracket, String(replacementVal));
      } catch(e) {}

      // Replace Case-Insensitive Curly {{PLACEHOLDER}}
      try {
        const rxCurly = new RegExp(`\\{\\{\\s*${plainWord}\\s*\\}\\}`, "gi");
        txt = txt.replace(rxCurly, String(replacementVal));
      } catch(e) {}

      // Fallback exact matching loops
      while (txt.includes(cleanKey)) {
        txt = txt.replace(cleanKey, String(replacementVal));
      }
      while (txt.toLocaleUpperCase().includes(cleanKey.toLocaleUpperCase())) {
        const startIdx = txt.toLocaleUpperCase().indexOf(cleanKey.toLocaleUpperCase());
        if (startIdx === -1) break;
        txt = txt.substring(0, startIdx) + String(replacementVal) + txt.substring(startIdx + cleanKey.length);
      }
    }
    return txt;
  }, [activeTemplate, substitutes, productSpecs]);

  // Splits replaced string by ---PAGE_BREAK--- to offer clean pages
  const contractPages = useMemo(() => {
    if (!renderedContractContent) return [];
    const rawPages = renderedContractContent.split("---PAGE_BREAK---");
    return rawPages.map(page => page.trim()).filter(page => page.length > 0);
  }, [renderedContractContent]);

  const handleSimulateDownload = () => {
    alert("Pronto! Download do Contrato Legislativo (PDF/DOCX) preenchido em alta definição concluído!");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Upper main heading header (HIDDEN ON PRINT) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <span className="p-1 px-2.5 bg-[#0B4A34] text-white rounded-lg text-sm font-mono">LL</span> Emissão de Contratos
          </h1>
          <p className="text-xs text-slate-500">Módulo integrado para faturamento, impressão de fichas de adesão e termos de concessão</p>
        </div>

        {/* Sub-tabs toggles */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl self-stretch md:self-auto border border-slate-200">
          <button
            onClick={() => setSubTab("emitidos")}
            className={`flex-1 sm:flex-none py-2.5 px-4 font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === "emitidos"
                ? "bg-[#0B4A34] text-white shadow-md shadow-emerald-700/25"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            📋 Lançamentos e Modelos (CRUD)
          </button>
          <button
            onClick={() => setSubTab("ficha")}
            className={`flex-1 sm:flex-none py-2.5 px-4 font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === "ficha"
                ? "bg-[#0B4A34] text-white shadow-md shadow-emerald-700/25"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            📋 Ficha de Adesão (Frente/Verso)
          </button>
          <button
            onClick={() => setSubTab("legislativo")}
            className={`flex-1 sm:flex-none py-2.5 px-4 font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === "legislativo"
                ? "bg-[#0B4A34] text-white shadow-md shadow-emerald-700/25"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            📄 Contrato Completo (A4)
          </button>
        </div>
      </div>

      {/* Select client strip ribbon (HIDDEN DURING PRINT) */}
      {subTab !== "emitidos" && (
        <div className="bg-white p-4.5 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-3.5 print:hidden">
          <span className="font-extrabold text-xs text-slate-600 block shrink-0">Buscar Proponente Relacionado:</span>
          <select
            value={selectedClientId}
            onChange={(e) => {
              setSelectedClientId(e.target.value);
              setCurrentPage(1); // reset active page
            }}
            className="p-2.5 px-3 border border-slate-200 outline-none rounded-lg bg-slate-50 text-slate-800 font-bold tracking-tight cursor-pointer text-xs flex-1 w-full"
          >
            {receptions.map(r => (
              <option key={r.id} value={r.id}>
                👤 {r.guest1?.name || "Sem Nome"} ({r.id}) - Consultor: {r.brokerName || r.sdrName || "Sem Corretor"}
              </option>
            ))}
          </select>
          
          {activeSale ? (
            <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 shadow-sm">
              ✓ Direito de Uso Ativo: {activeSale.productName} ({activeSale.id})
            </span>
          ) : (
            <span className="text-[10px] bg-amber-50 border border-amber-200 text-amber-600 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0">
              ⚠️ Nenhuma Ficha de Venda ativa vinculada
            </span>
          )}
        </div>
      )}

      {subTab === "emitidos" ? (
        <div className="space-y-6 print:hidden">
          {/* Contracts List Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-emerald-600" /> Histórico de Contratos Emitidos (Vendas Lançadas)
                </h3>
                <p className="text-[11px] text-slate-400">Exibição dedicada das transações comerciais faturadas com entrada e saldo apartados.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 text-[10px] uppercase">
                    <th className="p-3">ID / Data</th>
                    <th className="p-3">Adquirente Titular</th>
                    <th className="p-3">Produto Relacionado</th>
                    <th className="p-3 font-semibold text-emerald-700">Entrada (Valor)</th>
                    <th className="p-3 font-semibold text-indigo-700">Saldo Financiado</th>
                    <th className="p-3">Forma de Pagamento</th>
                    <th className="p-3 text-right">Ações / Visualização</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-105">
                  {sales.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-10 text-center text-slate-400 font-medium">
                        Nenhum contrato ativo localizado para faturamento comercial no momento.
                      </td>
                    </tr>
                  ) : (
                    sales.map(s => {
                      const rc = receptions.find(r => r.id === s.receptionId);
                      return (
                        <tr key={s.id} className="hover:bg-slate-50/40">
                          <td className="p-3">
                            <span className="font-mono font-bold block text-slate-800">{s.id}</span>
                            <span className="text-[10px] text-slate-400">{s.date.split("-").reverse().join("/")}</span>
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-slate-700">{rc?.guest1?.name || "Qualificado"}</div>
                            <div className="text-[10px] text-slate-400">CPF: {rc?.guest1?.cpf || "___.___.___-__"}</div>
                          </td>
                          <td className="p-3">
                            <div className="font-semibold text-slate-800">{s.productName}</div>
                            <div className="text-[10px] text-slate-400">{s.titleType}</div>
                          </td>
                          <td className="p-3 text-emerald-750 font-bold font-mono">
                            {s.downPayment.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </td>
                          <td className="p-3 text-indigo-750 font-bold font-mono">
                            {s.remainingBalance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            <div className="text-[9px] text-slate-400 normal-case font-normal">{s.installmentsCount} parcelas de {s.installmentValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
                          </td>
                          <td className="p-3 font-medium text-slate-600">{s.paymentMethod}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-1.5 justify-end">
                              <button
                                onClick={() => {
                                  setSelectedClientId(s.receptionId);
                                  setSubTab("ficha");
                                }}
                                className="px-2 py-1.5 bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                                title="Visualizar Ficha Frente/Verso de Adesão"
                              >
                                <Eye className="h-3.5 w-3.5" /> Ficha
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedClientId(s.receptionId);
                                  // Auto find and switch to matching template
                                  const matchingTemplate = templates.find(t => t.productId === s.productId);
                                  if (matchingTemplate) {
                                    setSelectedTemplateId(matchingTemplate.id);
                                  }
                                  setSubTab("legislativo");
                                }}
                                className="px-2 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-100 hover:bg-emerald-100 hover:border-emerald-200 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                                title="Visualizar Páginas de Contrato A4"
                              >
                                <BookOpen className="h-3.5 w-3.5" /> Contrato
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Excluir permanentemente o faturamento comercial ${s.id}? Esta operação é irreversível.`)) {
                                    onDeleteSale(s.id);
                                  }
                                }}
                                className="px-2 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                                title="Excluir Lançamento"
                              >
                                <Trash2 className="h-3.5 w-3.5" /> Excluir
                              </button>
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

          {/* Templates Model Configurator Card with proper Product Links */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div>
              <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                <Award className="h-4.5 w-4.5 text-emerald-600" /> Modelos de Instrumentos de Contrato Cadastrados (Templates DOCX)
              </h3>
              <p className="text-[11px] text-slate-400">Cada modelo é vinculado a um produto específico para garantir preenchimento dinâmico sem desconfiguração.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 text-[10px] uppercase">
                    <th className="p-3">Código</th>
                    <th className="p-3">Nome do Modelo</th>
                    <th className="p-3">Arquivo Base</th>
                    <th className="p-3">Produto Vinculado</th>
                    <th className="p-3">Substituições Propostas</th>
                    <th className="p-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {templates.map(tpl => {
                    const linkedProduct = products.find(p => p.id === tpl.productId);
                    return (
                      <tr key={tpl.id} className="hover:bg-slate-50/40">
                        <td className="p-3">
                          <span className="font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px]">{tpl.id}</span>
                        </td>
                        <td className="p-3 font-bold text-slate-700">{tpl.name}</td>
                        <td className="p-3 text-slate-500 font-mono text-[10px]">{tpl.fileName}</td>
                        <td className="p-3">
                          {linkedProduct ? (
                            <span className="px-2.5 py-1 bg-emerald-50 text-[#0B4A34] text-[10px] font-bold rounded-lg border border-emerald-100">
                              ✓ {linkedProduct.name}
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-lg border border-amber-100">
                              ⚠️ Geral ({tpl.productId})
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {tpl.placeholders.slice(0, 3).map((ph, idx) => (
                              <span key={idx} className="bg-slate-100 text-slate-600 font-mono text-[9px] px-1 py-0.5 rounded">[{ph}]</span>
                            ))}
                            {tpl.placeholders.length > 3 && <span className="text-slate-400 font-mono text-[9px] px-1 py-0.5 font-bold">+{tpl.placeholders.length - 3}</span>}
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedTemplateId(tpl.id);
                                if (receptions.length > 0) {
                                  // Attempt to find a guest who belongs to this template's product
                                  const perfectSale = sales.find(s => s.productId === tpl.productId);
                                  if (perfectSale) {
                                    setSelectedClientId(perfectSale.receptionId);
                                  }
                                }
                                setSubTab("legislativo");
                              }}
                              className="px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-705 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1"
                              title="Configurar Parâmetros de Impressão"
                            >
                              <Printer className="h-3 w-3" /> Personalizar
                            </button>
                            <button
                              onClick={() => {
                                if (templates.length <= 1) {
                                  alert("Não é permitido excluir o único modelo de contrato disponível.");
                                  return;
                                }
                                if (confirm(`Confirmar exclusão definitiva do modelo ${tpl.name}?`)) {
                                  onDeleteTemplate(tpl.id);
                                }
                              }}
                              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1"
                              title="Remover este Instrumento Contratual"
                            >
                              <Trash2 className="h-3 w-3" /> Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* New template register panel and form */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <Upload className="h-4.5 w-4.5 text-emerald-600" /> Cadastrar Novo Termo Contratual Personalizado / Plano (.DOCX)
            </h3>
            <form onSubmit={handleUploadTemplate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="font-semibold text-slate-600">Descrição / Título do Instrumento:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Termo de Adesão e Regulamento Lagoa Lovers"
                    value={customFileTemplateName}
                    onChange={(e) => setCustomFileTemplateName(e.target.value)}
                    className="p-2.5 border border-slate-200 outline-none bg-white rounded-lg font-medium text-slate-700 focus:border-emerald-500"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="font-semibold text-slate-600">Vincular para qual Produto / Plano:</label>
                  <select
                    value={selectedProductIdForNewTemplate}
                    onChange={(e) => setSelectedProductIdForNewTemplate(e.target.value)}
                    className="p-2.5 border border-slate-200 outline-none bg-white rounded-lg font-bold cursor-pointer"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-[#0B4A34] hover:bg-[#083626] text-white font-extrabold text-xs px-5 py-2.5 rounded-lg transition-all cursor-pointer shadow-md"
                >
                  <CheckCircle className="h-4 w-4" /> Cadastrar Modelo para Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : subTab === "ficha" ? (
        /* Double-page printable Form Sheet Component */
        <FichaContratoView activeClient={activeClient} activeSale={activeSale} />
      ) : (
        /* Legislative template editor and text generator */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs text-slate-700">
          
          {/* Left side: parameters selection */}
          <div className="lg:col-span-4 space-y-5 print:hidden">
            
            {/* Box 1: Select Template */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
                <Building2 className="h-4 w-4 text-emerald-600" /> Parâmetros de Contrato
              </h3>

              <div className="flex flex-col space-y-1">
                <label className="font-bold text-slate-600 text-[11px]">Modelo Legislativo:</label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => {
                    setSelectedTemplateId(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="p-3 border border-slate-200 outline-none rounded-lg bg-white text-slate-705 font-bold cursor-pointer"
                >
                  {templates.map(tpl => (
                    <option key={tpl.id} value={tpl.id}>{tpl.name}</option>
                  ))}
                </select>
              </div>

              {activeSale ? (
                <div className="bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-xl text-[11px] text-emerald-800 space-y-1.5">
                  <div className="font-extrabold flex items-center gap-1 text-emerald-900">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    Valores Financeiros Carregados:
                  </div>
                  <div className="pl-5 space-y-0.5 font-medium">
                    <div>Plano: <span className="font-bold">{activeSale.productName}</span></div>
                    <div>Valor de Aquisição: <span className="font-bold">{activeSale.totalPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span></div>
                    <div>Sinal / Entrada: <span className="font-bold">{activeSale.downPayment.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span></div>
                    <div>Financiado: <span className="font-bold">{activeSale.installmentsCount} parcelas de {activeSale.installmentValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span></div>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50/40 border border-amber-100 p-3.5 rounded-xl text-[11px] text-amber-800">
                  ⚠️ Nenhuma venda registrada para este cliente. Os campos de valores da cessão virão em branco.
                </div>
              )}
            </div>

            {/* Box 2: Upload Custom DOCX contract template (Simulador) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
                <Upload className="h-4 w-4 text-emerald-600" /> Cadastrar Termo Adicional
              </h3>
              
              <p className="text-[11px] text-slate-400">Insira um novo regulamento ou termo anexo em formato .DOCX para preenchimento dinâmico de placeholders.</p>
              
              <form onSubmit={handleUploadTemplate}>
                <div className="flex flex-col space-y-2">
                  <input
                    required
                    type="text"
                    placeholder="Ex: Regulamento de Reserva de Chalé da Lagoa"
                    value={customFileTemplateName}
                    onChange={(e) => setCustomFileTemplateName(e.target.value)}
                    className="p-2.5 border border-slate-200 outline-none rounded-lg text-xs font-medium"
                  />
                  <button
                    type="submit"
                    className="bg-slate-800 hover:bg-slate-900 font-bold text-white py-2 rounded-lg text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="h-3 w-3 text-emerald-400" /> Confirmar Cadastro
                  </button>
                </div>
              </form>
            </div>

            {/* Box 3: Available Placeholder Guide */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 space-y-2">
              <h4 className="font-extrabold text-slate-800 flex items-center gap-1">
                <span>📋</span> Guia de Mapeamento Técnico de Placeholders:
              </h4>
              <p className="text-[10px] text-slate-400 leading-normal">O sistema realiza conversão em tempo real de chaves PDF e chaves clássicas.</p>
              <div className="grid grid-cols-1 gap-1.5 font-mono text-[9px] text-emerald-800 bg-white p-2 px-3 rounded border border-slate-150 max-h-48 overflow-y-auto">
                <div className="border-b border-slate-100 pb-1 font-bold text-slate-500">Chaves de Contrato Oficial:</div>
                <div>[VENDACONTRATONUMERO]</div>
                <div>[VENDAPESSOA1NOME]</div>
                <div>[VENDAPESSOA1CPF]</div>
                <div>[VENDAPESSOA1RG]</div>
                <div>[VENDAPESSOA1ENDERECO]</div>
                <div>[VENDAVALORFINANCIADO]</div>
                <div>[VENDAVALORFINANCIADOEXTENSO]</div>
                <div>[PARCELAVALOR1] (Sinal)</div>
                <div>[VENDAVALORSALDORESTANTE]</div>
              </div>
            </div>

          </div>

          {/* Right side: Modern live rendering A4 sheet */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            
            {/* Preview action bar */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 print:hidden">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-extrabold text-xs text-rose-500 uppercase tracking-widest bg-rose-50 px-2 py-1 rounded">Visualização de Instrumentos A4</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                
                {/* Print button */}
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 font-extrabold text-[11px] py-1.5 px-3 rounded-lg cursor-pointer transition-all"
                  title="Abre a caixa de diálogo de impressão do navegador com estilos otimizados para papel A4"
                >
                  <Printer className="h-3.5 w-3.5 text-slate-500" /> Imprimir Papel
                </button>

                <button
                  onClick={handleSimulateDownload}
                  className="flex items-center gap-1.5 text-slate-700 bg-[#E8F5E9] hover:bg-[#C8E6C9] border border-emerald-250 font-extrabold text-[11px] py-1.5 px-3 rounded-lg cursor-pointer transition-all"
                >
                  <FileDown className="h-3.5 w-3.5 text-emerald-600" /> Baixar (.docx)
                </button>
                
                <button
                  onClick={() => {
                    setIsSignaturesDone(true);
                    alert("Aviso técnica de Assinatura Eletrônica: Disparado envio de links para autenticação via Zap e Mail aos proponentes!");
                  }}
                  className={`flex items-center gap-1.5 font-bold text-[11px] py-1.5 px-3.5 rounded-lg text-white shadow-sm cursor-pointer transition-all ${
                    isSignaturesDone ? "bg-emerald-600 shadow-emerald-600/10" : "bg-[#0B4A34] hover:bg-[#073324]"
                  }`}
                >
                  {isSignaturesDone ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-white" /> Links Enviados
                    </>
                  ) : (
                    "Disparar Chave de Assinatura"
                  )}
                </button>
              </div>
            </div>

            {/* View Mode controls Toolbar */}
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-3 print:hidden">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="font-extrabold text-xs text-slate-500 text-[11px] shrink-0">Layout no Painel:</span>
                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 w-full sm:w-auto">
                  <button
                    onClick={() => setViewMode("stacked")}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 font-bold text-[10px] rounded transition-all cursor-pointer ${
                      viewMode === "stacked"
                        ? "bg-white text-[#0B4A34] shadow-sm font-black"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Eye className="h-3 w-3" /> Todas as Páginas ({contractPages.length})
                  </button>
                  <button
                    onClick={() => setViewMode("paged")}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 font-bold text-[10px] rounded transition-all cursor-pointer ${
                      viewMode === "paged"
                        ? "bg-white text-[#0B4A34] shadow-sm font-black"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <BookOpen className="h-3 w-3" /> Página Única
                  </button>
                </div>
              </div>

              {/* Pagination indicators when in segmented page view */}
              {viewMode === "paged" && (
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="p-1 px-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed font-bold cursor-pointer"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </button>
                  
                  <select
                    value={currentPage}
                    onChange={(e) => setCurrentPage(Number(e.target.value))}
                    className="p-1 px-1.5 text-center font-bold text-slate-700 bg-white border border-slate-200 rounded outline-none"
                  >
                    {contractPages.map((_, idx) => (
                      <option key={idx + 1} value={idx + 1}>Pág. {idx + 1} de {contractPages.length}</option>
                    ))}
                  </select>

                  <button
                    disabled={currentPage === contractPages.length}
                    onClick={() => setCurrentPage(prev => Math.min(contractPages.length, prev + 1))}
                    className="p-1 px-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed font-bold cursor-pointer"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Simulated document pages frame */}
            <div className="bg-slate-500/10 p-4 sm:p-8 rounded-2xl flex flex-col items-center gap-8 border border-slate-200/60 overflow-x-auto print:bg-transparent print:p-0 print:border-none print:shadow-none">
              
              {/* Stacked loop rendering or individual page rendering */}
              {contractPages.map((pageContent, idx) => {
                const pageNumber = idx + 1;
                
                // If in Paged Mode, skip showing pages other than the active slide
                if (viewMode === "paged" && pageNumber !== currentPage) {
                  return null;
                }

                return (
                  <div 
                    key={idx}
                    className="print:break-after-page print:m-0 print:shadow-none print:border-none w-full max-w-[21cm] min-h-[29.7cm] bg-white text-slate-850 shadow-2xl p-7 sm:p-12 border border-slate-250/70 font-sans flex flex-col justify-between relative relative"
                    style={{ aspectRatio: "1/1.414" }}
                  >
                    {/* Header bar */}
                    <div>
                      <div className="border-b-2 border-emerald-900/10 pb-2.5 flex justify-between items-center text-slate-400 font-bold uppercase tracking-wider text-[9px] font-sans">
                        <span className="text-[#0B4A34] font-black flex items-center gap-2">
                          <img 
                            src="https://i.postimg.cc/L5SxKwZW/Whats-App-Image-2026-05-28-at-12-57-51.png" 
                            alt="Lagoa Lovers Logo" 
                            className="h-5 w-5 object-contain"
                            referrerPolicy="no-referrer"
                          />
                          LAGOA THERMAS CLUBE • GESTÃO DE CONCESSÕES
                        </span>
                        <span className="bg-emerald-50 text-[#0B4A34] px-2 py-0.5 rounded-full text-[9px] border border-emerald-100 font-mono">
                          FOLHA {pageNumber} de {contractPages.length}
                        </span>
                      </div>
                      
                      {/* Rich Green banner design strictly for Page 1 */}
                      {pageNumber === 1 && (
                        <div className="mt-4 bg-[#0B4A34] text-white p-5 rounded-xl shadow-lg border border-[#083626] relative overflow-hidden flex flex-col items-center text-center">
                          <img 
                            src="https://i.postimg.cc/L5SxKwZW/Whats-App-Image-2026-05-28-at-12-57-51.png" 
                            alt="Lagoa Lovers Banner Logo" 
                            className="h-12 w-auto object-contain bg-white rounded-lg p-1 mb-3.5 shadow-md"
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-200">Instrumento Particular de Adesão</span>
                          <h2 className="text-[13px] sm:text-base font-extrabold uppercase mt-1 tracking-wider">
                            CESSÃO DE DIREITO DE USO - {activeTemplate?.name ? activeTemplate.name.replace("Cessão de Direito de Uso - ", "") : "TÍTULO VITALÍCIO"}
                          </h2>
                          <div className="w-12 h-1 bg-emerald-400 mt-2.5 rounded"></div>
                        </div>
                      )}
                    </div>

                    {/* Parser rendered core content */}
                    <div className="my-5 flex-1 min-h-[18cm] flex flex-col justify-start">
                      {parseMarkdownToReact(pageContent)}
                    </div>

                    {/* Minimalist legal footer */}
                    <div className="border-t border-slate-100 pt-3.5 flex justify-between items-center text-[9px] text-slate-400 font-medium">
                      <span>Documento de via única fiduciária de {activeClient?.guest1?.name ? activeClient.guest1.name.toUpperCase() : "QUALIFICADO TITULAR"}.</span>
                      <span className="font-mono">PÁG. {pageNumber} / {contractPages.length}</span>
                    </div>
                  </div>
                );
              })}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
