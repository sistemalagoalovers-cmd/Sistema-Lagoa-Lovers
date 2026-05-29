/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Lagoa Lovers Contract Module - Coordinate PDF mapping, filling, and management.
 */

import React, { useState, useMemo, useEffect } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { 
  ContractTemplate, 
  ReceptionRecord, 
  SalesRecord, 
  Product, 
  FieldMapping,
  PaymentMethod
} from "../types";
import { INITIAL_PRODUCTS } from "../initialData";
import { 
  FileText, 
  FileDown, 
  CheckCircle, 
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
  ChevronUp,
  Sliders,
  AlertTriangle,
  Locate,
  Save,
  Plus,
  RefreshCw,
  FolderOpen
} from "lucide-react";
import FichaContratoView from "./FichaContratoView";

interface ContratosViewProps {
  templates: ContractTemplate[];
  receptions: ReceptionRecord[];
  sales: SalesRecord[];
  products: Product[];
  onAddTemplate: (t: ContractTemplate) => void;
  onUpdateTemplate: (t: ContractTemplate) => void;
  onDeleteTemplate: (id: string) => void;
  onSaveSale: (s: SalesRecord) => void;
  onDeleteSale: (id: string) => void;
  preSelectedReceptionId?: string | null;
}

// Convert ArrayBuffer to Base64 in a modern, safe environment
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Helper to convert numeric monetary value to words in Portuguese (Extenso)
function valorPorExtenso(valor: number): string {
  if (!valor || isNaN(valor)) return "zero reais";
  
  const centenas = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];
  const dezenas = ["", "dez", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
  const dezenove = ["dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
  const unidades = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"];

  const partes: string[] = [];
  
  const v = Math.floor(valor);
  const centavos = Math.round((valor % 1) * 100);

  function escreverTresAlgarismos(n: number): string {
    if (n === 100) return "cem";
    const c = Math.floor(n / 100);
    const d = Math.floor((n % 100) / 10);
    const u = n % 10;
    
    let res = "";
    if (c > 0) res += centenas[c];
    if (d > 0) {
      if (res) res += " e ";
      if (d === 1 && u >= 0) {
        res += dezenove[u];
        return res;
      } else {
        res += dezenas[d];
      }
    }
    if (u > 0) {
      if (res) res += " e ";
      res += unidades[u];
    }
    return res;
  }

  // Handle millions, thousands, hundreds
  if (v === 0) {
    partes.push("zero reais");
  } else {
    const milhoes = Math.floor(v / 1000000);
    const milhares = Math.floor((v % 1000000) / 1000);
    const centenasUnid = v % 1000;

    if (milhoes > 0) {
      partes.push(escreverTresAlgarismos(milhoes) + (milhoes === 1 ? " milhão" : " milhões"));
    }
    if (milhares > 0) {
      if (partes.length > 0) partes.push("e");
      partes.push(escreverTresAlgarismos(milhares) + " mil");
    }
    if (centenasUnid > 0) {
      if (partes.length > 0) partes.push("e");
      partes.push(escreverTresAlgarismos(centenasUnid));
    }
    partes.push(v === 1 ? "real" : "reais");
  }

  if (centavos > 0) {
    partes.push("e");
    if (centavos === 1) {
      partes.push("um centavo");
    } else {
      partes.push(escreverTresAlgarismos(centavos) + " centavos");
    }
  }

  return partes.join(" ").replace(/\s+/g, " ");
}

// Generate base visual page bytes if template doesn't have an uploaded PDF
async function generateDefaultPdfTemplateBytes(productName: string, templateName: string, fields: FieldMapping[]) {
  const pdfDoc = await PDFDocument.create();
  
  // Create 3 standard A4 pages
  for (let pageNum = 1; pageNum <= 3; pageNum++) {
    const page = pdfDoc.addPage([595, 842]);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    // Header banner (#0B4A34)
    page.drawRectangle({
      x: 0,
      y: 770,
      width: 595,
      height: 72,
      color: rgb(11 / 255, 74 / 255, 52 / 255),
    });
    
    // Gold separator (#D4AF37)
    page.drawRectangle({
      x: 0,
      y: 765,
      width: 595,
      height: 5,
      color: rgb(212 / 255, 175 / 255, 55 / 255),
    });

    // Content headers
    page.drawText("ASSESSORIA COMERCIAL LAGOA LOVERS • CESSÃO DE DIREITO DE USO", {
      x: 30,
      y: 805,
      size: 10,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });
    
    page.drawText(`${templateName.toUpperCase()} - MODELO PADRÃO A4 (PÁGINA ${pageNum})`, {
      x: 30,
      y: 785,
      size: 8,
      font: helvetica,
      color: rgb(0.85, 0.95, 0.85),
    });

    page.drawText("LL", {
      x: 520,
      y: 785,
      size: 30,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });

    // Page Specific Content
    if (pageNum === 1) {
      page.drawText("CONTRATO DE ADESÃO AO PARQUE LAGOA THERMAS CLUBE", {
        x: 80,
        y: 720,
        size: 12,
        font: helveticaBold,
        color: rgb(0.1, 0.1, 0.1),
      });

      page.drawText("CONTRATO Nº: [VENDACONTRATONUMERO] / [VENDAANO]", {
        x: 180,
        y: 700,
        size: 10,
        font: helveticaBold,
      });

      // Frame Box for Customer Info
      page.drawRectangle({
        x: 30,
        y: 560,
        width: 535,
        height: 110,
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 1,
      });

      page.drawText("I. QUALIFICAÇÃO DO PROPONENTE TITULAR (ADERENTE)", {
        x: 40,
        y: 655,
        size: 9,
        font: helveticaBold,
        color: rgb(11/255, 74/255, 52/255),
      });

      page.drawText("Nome Completo: [VENDAPESSOA1NOME]", { x: 45, y: 635, size: 8.5, font: helvetica });
      page.drawText("Nacionalidade: [VENDAPESSOA1NACIONALIDADE]    Estado Civil: [VENDAPESSOA1ESTADOCIVIL]", { x: 45, y: 620, size: 8.5, font: helvetica });
      page.drawText("RG: [VENDAPESSOA1RG]                             CPF: [VENDAPESSOA1CPF]               Profissão: [VENDAPESSOA1PROFISSAO]", { x: 45, y: 605, size: 8.5, font: helvetica });
      page.drawText("Endereço: [VENDAPESSOA1ENDERECO], [VENDAPESSOA1NUMEROENDERECO] - [VENDAPESSOA1BAIRRO]", { x: 45, y: 590, size: 8.5, font: helvetica });
      page.drawText("CEP: [VENDAPESSOA1CEP]                           Cidade: [VENDAPESSOA1CIDADE]       Bairro: [VENDAPESSOA1BAIRRO]      UF: [VENDAPESSOA1ESTADO]", { x: 45, y: 575, size: 8.5, font: helvetica });

      // Dependents info
      page.drawText("II. BENEFICIÁRIOS ADICIONAIS INDICADOS PARA ACESSO", {
        x: 30,
        y: 535,
        size: 9,
        font: helveticaBold,
        color: rgb(11/255, 74/255, 52/255),
      });

      page.drawText("Dependentes Listados: [ATENDIMENTOPESSOA1ACOMPANHANTE1] (Nº 1)", {
        x: 45,
        y: 515,
        size: 8.5,
        font: helvetica,
        color: rgb(0.3, 0.3, 0.3),
      });

      // Payment plans
      page.drawText("III. CONDIÇÕES FINANCEIRAS DA AQUISIÇÃO DO PLANO", {
        x: 30,
        y: 475,
        size: 9,
        font: helveticaBold,
        color: rgb(11/255, 74/255, 52/255),
      });

      page.drawText("Produto Adquirido: " + productName.toUpperCase(), { x: 45, y: 455, size: 8.5, font: helveticaBold });
      page.drawText("Valor de Aquisição Total do Título: [VENDAVALORFINANCIADO] ([VENDAVALORFINANCIADOEXTENSO])", { x: 45, y: 440, size: 8, font: helvetica });
      page.drawText("Valor Pago a Título de Entrada/Sinal: [PARCELAVALOR1]", { x: 45, y: 425, size: 8, font: helvetica });
      page.drawText("Saldo Restante Financiado: [VENDAVALORSALDORESTANTE]", { x: 45, y: 410, size: 8, font: helveticaBold });

      // Table layout
      page.drawRectangle({
        x: 30,
        y: 200,
        width: 535,
        height: 180,
        borderColor: rgb(0.85, 0.85, 0.85),
        borderWidth: 1,
      });

      page.drawRectangle({
        x: 30,
        y: 360,
        width: 535,
        height: 20,
        color: rgb(240/255, 245/255, 242/255),
      });

      page.drawText("TIPO PARCELAMENTO", { x: 40, y: 366, size: 7.5, font: helveticaBold, color: rgb(11/255, 74/255, 52/255) });
      page.drawText("QTDE", { x: 180, y: 366, size: 7.5, font: helveticaBold });
      page.drawText("VALOR UNIT.", { x: 230, y: 366, size: 7.5, font: helveticaBold });
      page.drawText("PROPR. VENCIMENTO", { x: 320, y: 366, size: 7.5, font: helveticaBold });
      page.drawText("DETALHES DO LANÇAMENTO", { x: 410, y: 366, size: 7.5, font: helveticaBold });

      // Row 1
      page.drawText("[PARCELATIPOPARCELA1]", { x: 40, y: 340, size: 8, font: helvetica });
      page.drawText("[PARCELAQUANTIDADE1]", { x: 180, y: 340, size: 8, font: helvetica });
      page.drawText("[PARCELAVALOR1]", { x: 230, y: 340, size: 8, font: helvetica });
      page.drawText("[PARCELAVENCIMENTO1]", { x: 320, y: 340, size: 8, font: helvetica });
      page.drawText("[PARCELADETALHE1]", { x: 410, y: 340, size: 8, font: helvetica });

      // Row 2
      page.drawText("[PARCELATIPOPARCELA2]", { x: 40, y: 310, size: 8, font: helvetica });
      page.drawText("[PARCELAQUANTIDADE2]", { x: 180, y: 310, size: 8, font: helvetica });
      page.drawText("[PARCELAVALOR2]", { x: 230, y: 310, size: 8, font: helvetica });
      page.drawText("[PARCELAVENCIMENTO2]", { x: 320, y: 310, size: 8, font: helvetica });
      page.drawText("[PARCELADETALHE2]", { x: 410, y: 310, size: 8, font: helvetica });

      // Row 3
      page.drawText("Saldo Parcela 3", { x: 40, y: 280, size: 8, font: helvetica });
      page.drawText("1", { x: 180, y: 280, size: 8, font: helvetica });
      page.drawText("[PARCELAVALOR3]", { x: 230, y: 280, size: 8, font: helvetica });
      page.drawText("[PARCELAVENCIMENTO3]", { x: 320, y: 280, size: 8, font: helvetica });
      page.drawText("[PARCELADETALHE3]", { x: 410, y: 280, size: 8, font: helvetica });

      // Row 4
      page.drawText("Sinal / Outros Row 4", { x: 40, y: 250, size: 8, font: helvetica });
      page.drawText("1", { x: 180, y: 250, size: 8, font: helvetica });
      page.drawText("[PARCELAVALOR4]", { x: 230, y: 250, size: 8, font: helvetica });
      page.drawText("[PARCELAVENCIMENTO4]", { x: 320, y: 250, size: 8, font: helvetica });
      page.drawText("[PARCELADETALHE4]", { x: 410, y: 250, size: 8, font: helvetica });

    } else if (pageNum === 2) {
      page.drawText("AUTORIZAÇÃO GERAL PARA EMISSÃO DE CONTRATO COMERCIAL", {
        x: 80,
        y: 720,
        size: 11,
        font: helveticaBold,
        color: rgb(0.1, 0.1, 0.1),
      });

      page.drawText("O presente instrumento formaliza as condições financeiras aceitas pelo comprador.", {
        x: 30,
        y: 690,
        size: 8.5,
        font: helvetica,
        color: rgb(0.2, 0.2, 0.2),
      });

      // Frame Box for Autorização de Emissão placeholders
      page.drawRectangle({
        x: 30,
        y: 320,
        width: 535,
        height: 340,
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 1,
      });

      page.drawText("PARÂMETROS DA UNIDADE E VENDAS RELACIONADAS", {
        x: 40,
        y: 645,
        size: 9,
        font: helveticaBold,
        color: rgb(11/255, 74/255, 52/255),
      });

      page.drawText("No Sala Comercial: [SALA]             SDR/Captador: [CAPTADOR]          Executivo: [EXECUTIVO]", { x: 45, y: 620, size: 8.5, font: helvetica });
      page.drawText("Comprador Titular: [TITULAR]", { x: 45, y: 600, size: 8.5, font: helveticaBold });
      page.drawText("D. Nascimento: [NASCIMENTO]               CPF: [CPF]                         RG: [RG]", { x: 45, y: 585, size: 8.5, font: helvetica });
      page.drawText("Endereço: [ENDERECO]    CEP: [CEP]", { x: 45, y: 570, size: 8.5, font: helvetica });
      page.drawText("Bairro: [BAIRRO]                 Cidade: [CIDADE]             Estado: [UF]", { x: 45, y: 555, size: 8.5, font: helvetica });
      page.drawText("Contatos: [TELEFONE]           Celular/Whats: [CELULAR]           Profissão: [PROFISSÃO]", { x: 45, y: 540, size: 8.5, font: helvetica });
      
      page.drawText("DADOS COMERCIAIS:", { x: 45, y: 510, size: 8.5, font: helveticaBold });
      page.drawText("Plano / Produto: [PRODUTO]", { x: 45, y: 495, size: 8.5, font: helvetica });
      page.drawText("Preço de Concessão Integral: [VALOR_PRODUTO]                     Sinal de Entrada: [VALOR_ENTRADA]", { x: 45, y: 480, size: 8.5, font: helvetica });
      page.drawText("Quantidade de parcelas sinal: [QTDE_PARCELAS_ENTRADA]                     Forma de Entrada: [FORMA_PGTO_ENTRADA]", { x: 45, y: 465, size: 8.5, font: helvetica });
      page.drawText("Financiamento do Saldo Restante: [VALOR_TOTAL_SALDO]               Qtde Mensalidades: [QTDE_PARCELAS_SALDO]", { x: 45, y: 450, size: 8.5, font: helvetica });
      page.drawText("Valor Mensais de Financiamento: [VALOR_PARCELAS_SALDO]                 Forma Pgto Saldo: [FORMA_PGTO_SALDO]", { x: 45, y: 435, size: 8.5, font: helveticaBold });
      page.drawText("Data de vencimento da primeira parcela: [DATA_PRIMEIRA_PARCELA]", { x: 45, y: 420, size: 8.5, font: helvetica });

      page.drawText("Dependentes Vinculados: [DEPENDENTES]", { x: 45, y: 390, size: 8, font: helvetica });
      page.drawText("Dados do Cartão (Tokenizado no Cofre): [CARTAO_DADOS]", { x: 45, y: 375, size: 8, font: helvetica });

      // Signatures
      page.drawRectangle({
        x: 40,
        y: 190,
        width: 230,
        height: 1,
        color: rgb(0.5, 0.5, 0.5),
      });
      page.drawText("ASSINATURA DO PROPONENTE TITULAR", { x: 50, y: 175, size: 7.5, font: helveticaBold });
      page.drawText("[TITULAR]", { x: 50, y: 160, size: 7, font: helvetica });

      page.drawRectangle({
        x: 320,
        y: 190,
        width: 230,
        height: 1,
        color: rgb(0.5, 0.5, 0.5),
      });
      page.drawText("LAGOA THERMAS CLUBE ASSOCIAÇÃO", { x: 330, y: 175, size: 7.5, font: helveticaBold });
      page.drawText("ASSESSORIA ADMINISTRATIVA DE OUTORGA", { x: 330, y: 160, size: 7, font: helvetica });

    } else {
      page.drawText("IV. TERMO DE COMPROMISSO, CESSÃO E REGRAS COLETIVAS", {
        x: 80,
        y: 720,
        size: 11,
        font: helveticaBold,
        color: rgb(0.1, 0.1, 0.1),
      });

      page.drawText("1. O Aderente declara plenamente compreendidos todos os direitos e deveres associativos.", { x: 30, y: 680, size: 8.5, font: helvetica });
      page.drawText("2. É proibido ingressar nos complexos de lazer portando alimentos externos ou bebidas de qualquer natureza.", { x: 30, y: 660, size: 8.5, font: helvetica });
      page.drawText("3. A utilização das diárias promocionais em baixa temporada rege-se de acordo com o regulamento do clube.", { x: 30, y: 640, size: 8.5, font: helvetica });
      page.drawText("4. Caldas Novas - GO, com foro estabelecido e acordado entre as partes signatárias.", { x: 30, y: 620, size: 8.5, font: helvetica });

      page.drawText("Dada ciência em Caldas Novas, estado de Goiás.", {
        x: 180,
        y: 420,
        size: 9,
        font: helveticaBold,
      });

      // Signature blocks
      page.drawRectangle({
        x: 180,
        y: 280,
        width: 235,
        height: 1,
        color: rgb(0.5, 0.5, 0.5),
      });
      page.drawText("ASSINATURA QUALIFICADA DO ADERENTE", { x: 210, y: 265, size: 8, font: helveticaBold });
      page.drawText("[VENDAPESSOA1NOME]", { x: 210, y: 250, size: 7.5, font: helvetica });
    }

    // Lower Footer
    page.drawText("CESSÃO DE DIREITO DE USO - REGISTRO FIDUCIÁRIO • CNPJ: 01.123.456/0001-99", {
      x: 30,
      y: 35,
      size: 7,
      font: helvetica,
      color: rgb(0.6, 0.6, 0.6),
    });

    page.drawText(`PÁGINA ${pageNum} / 3`, {
      x: 520,
      y: 35,
      size: 7.5,
      font: helveticaBold,
      color: rgb(11/255, 74/255, 52/255),
    });
  }

  return await pdfDoc.save();
}

// Overlay exact data on top of original PDF
async function fillPdfData(pdfBytes: Uint8Array, fields: FieldMapping[], substitutes: Record<string, string>) {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  for (const field of fields) {
    if (field.page < 1 || field.page > pages.length) continue;
    const pageIndex = field.page - 1;
    const page = pages[pageIndex];

    // Read the substitute string
    let dId = field.id;
    let replacement = substitutes[dId] || substitutes[dId.toUpperCase()] || substitutes[dId.toLowerCase()] || "";
    
    // Attempt stripped names if brackets are in id
    if (!replacement) {
      const stripped = dId.replace(/[\[\]\{\}]/g, "");
      replacement = substitutes[stripped] || substitutes[stripped.toUpperCase()] || substitutes[stripped.toLowerCase()] || "";
    }

    // If still empty but it's a structural tag, we print the tag so administrators notice it visually
    if (!replacement && dId.startsWith("[")) {
      replacement = dId;
    }

    const textToDraw = String(replacement || " - ");

    const size = field.fontSize || 9;
    
    // Choose font
    const isBold = dId.includes("NOME") || dId.includes("VALOR") || dId.includes("CONTRATO") || dId.includes("TITULAR") || dId.includes("SALDO");
    const font = isBold ? helveticaBold : helvetica;

    // Optional: Draw white overlay to clear original bracket placeholders underneath
    if (field.hideOriginal) {
      const textWidth = font.widthOfTextAtSize(textToDraw, size);
      const boxWidth = field.maxWidth || Math.max(textWidth + 8, 70);
      const boxHeight = size + 3;

      let drawXBox = field.x;
      if (field.alignment === "center") {
        drawXBox = field.x - boxWidth / 2;
      } else if (field.alignment === "right") {
        drawXBox = field.x - boxWidth;
      }

      page.drawRectangle({
        x: drawXBox - 2,
        y: field.y - 2,
        width: boxWidth + 4,
        height: boxHeight,
        color: rgb(1, 1, 1), // white rectangle
      });
    }

    // Alignment offsets calculations
    let drawX = field.x;
    if (field.alignment === "center") {
      const textWidth = font.widthOfTextAtSize(textToDraw, size);
      drawX = field.x - textWidth / 2;
    } else if (field.alignment === "right") {
      const textWidth = font.widthOfTextAtSize(textToDraw, size);
      drawX = field.x - textWidth;
    }

    // Draw text precisely onto coordinates
    page.drawText(textToDraw, {
      x: drawX,
      y: field.y,
      size: size,
      font: font,
      color: rgb(11 / 255, 30 / 255, 43 / 255), // dark corporate navy tint instead of pitch black
    });
  }

  return await pdfDoc.save();
}

export default function ContratosView({
  templates,
  receptions,
  sales,
  products,
  onAddTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  onSaveSale,
  onDeleteSale,
  preSelectedReceptionId
}: ContratosViewProps) {
  
  // Tab states
  const [subTab, setSubTab] = useState<"emitidos" | "ficha" | "mapeamento" | "legislativo">("emitidos");
  
  // Selection states
  const [selectedClientId, setSelectedClientId] = useState<string>(
    preSelectedReceptionId || (receptions[0]?.id || "")
  );

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    templates[0]?.id || "TPL-001"
  );

  // Layout View mode
  const [viewMode, setViewMode] = useState<"stacked" | "paged">("stacked");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSignaturesDone, setIsSignaturesDone] = useState<boolean>(false);

  // Visual layout coordinate active mapping field search & selection
  const [activeMappingTplId, setActiveMappingTplId] = useState<string>(templates[0]?.id || "TPL-001");
  const [selectedFieldId, setSelectedFieldId] = useState<string>("");
  const [mappingPageFilter, setMappingPageFilter] = useState<number>(1);
  const [fieldsSearchText, setFieldsSearchText] = useState<string>("");

  // CRUD launch form active state
  const [showLaunchForm, setShowLaunchForm] = useState<boolean>(false);
  const [launchClient, setLaunchClient] = useState<string>(receptions[0]?.id || "");
  const [launchProduct, setLaunchProduct] = useState<string>(products[0]?.id || "");
  const [launchDescription, setLaunchDescription] = useState<string>("Faturamento Comercial: Cessão de Direito de Uso");
  const [launchTotalPrice, setLaunchTotalPrice] = useState<number>(18000);
  const [launchDownPayment, setLaunchDownPayment] = useState<number>(3000);
  const [launchRemainingBalance, setLaunchRemainingBalance] = useState<number>(15000);
  const [launchInstallmentsCount, setLaunchInstallmentsCount] = useState<number>(24);
  const [launchInstallmentValue, setLaunchInstallmentValue] = useState<number>(625);
  const [launchPaymentMethod, setLaunchPaymentMethod] = useState<string>("Boleto Bancário / Recorrente");

  // PDF Preview Generation States
  const [pdfDataUri, setPdfDataUri] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState<boolean>(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [validationAlerts, setValidationAlerts] = useState<string[]>([]);

  // Update launch product selection pre-fills
  useEffect(() => {
    const linked = products.find(p => p.id === launchProduct);
    if (linked) {
      const price = linked.benefits.includes("Taxa d'Adesão") ? 12000 : 25000;
      setLaunchTotalPrice(price);
      setLaunchDownPayment(Math.round(price * 0.15));
      const bal = price - Math.round(price * 0.15);
      setLaunchRemainingBalance(bal);
      setLaunchInstallmentsCount(24);
      setLaunchInstallmentValue(Math.round(bal / 24));
    }
  }, [launchProduct, products]);

  // Sync selection if pre-selected prop is passed
  useEffect(() => {
    if (preSelectedReceptionId) {
      setSelectedClientId(preSelectedReceptionId);
      const sale = sales.find(s => s.receptionId === preSelectedReceptionId);
      if (sale) {
        const tpl = templates.find(t => t.productId === sale.productId);
        if (tpl) {
          setSelectedTemplateId(tpl.id);
        }
      }
    }
  }, [preSelectedReceptionId, sales, templates]);

  // Handle live mathematical contract launching auto-updates
  const handleLaunchPriceChange = (field: "total" | "down" | "balance" | "count" | "val", numVal: number) => {
    if (field === "total") {
      setLaunchTotalPrice(numVal);
      const newBal = numVal - launchDownPayment;
      setLaunchRemainingBalance(newBal > 0 ? newBal : 0);
      setLaunchInstallmentValue(newBal > 0 ? Math.round(newBal / launchInstallmentsCount) : 0);
    } else if (field === "down") {
      setLaunchDownPayment(numVal);
      const newBal = launchTotalPrice - numVal;
      setLaunchRemainingBalance(newBal > 0 ? newBal : 0);
      setLaunchInstallmentValue(newBal > 0 ? Math.round(newBal / launchInstallmentsCount) : 0);
    } else if (field === "balance") {
      setLaunchRemainingBalance(numVal);
      const newDown = launchTotalPrice - numVal;
      setLaunchDownPayment(newDown > 0 ? newDown : 0);
      setLaunchInstallmentValue(numVal > 0 ? Math.round(numVal / launchInstallmentsCount) : 0);
    } else if (field === "count") {
      const cnt = Math.max(1, numVal);
      setLaunchInstallmentsCount(cnt);
      setLaunchInstallmentValue(Math.round(launchRemainingBalance / cnt));
    } else if (field === "val") {
      setLaunchInstallmentValue(numVal);
      if (numVal > 0) {
        const count = Math.max(1, Math.round(launchRemainingBalance / numVal));
        setLaunchInstallmentsCount(count);
      }
    }
  };

  // Synchronously ensure all templates have basic mapped fields configured (defaults)
  const enrichedTemplates = useMemo(() => {
    return templates.map(tpl => {
      if (tpl.fields && tpl.fields.length > 0) return tpl;
      
      const isAutorizacao = tpl.id === "TPL-008" || tpl.fileName.toLowerCase().includes("modelo") || tpl.name.toLowerCase().includes("autorização") || tpl.id === "TPL-008";
      const list: FieldMapping[] = [];
      
      if (isAutorizacao) {
        // Load Autorização spec fields with beautiful default coordinates
        list.push(
          { id: "SALA", name: "Sala Comercial", page: 2, x: 80, y: 620, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "CAPTADOR", name: "Captador (SDR)", page: 2, x: 260, y: 620, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "EXECUTIVO", name: "Executivo de Vendas", page: 2, x: 380, y: 620, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "TITULAR", name: "Nome do Titular", page: 2, x: 130, y: 600, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "CPF", name: "CPF do Titular", page: 2, x: 300, y: 585, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "RG", name: "RG do Titular", page: 2, x: 74, y: 585, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "NASCIMENTO", name: "Data de Nascimento", page: 2, x: 130, y: 585, fontSize: 8.5, alignment: "left", hideOriginal: true, required: true },
          { id: "NACIONALIDADE", name: "Nacionalidade", page: 2, x: 85, y: 570, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "ENDERECO", name: "Endereço Completo", page: 2, x: 110, y: 570, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "CIDADE", name: "Cidade", page: 2, x: 280, y: 555, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "UF", name: "Estado (UF)", page: 2, x: 440, y: 555, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "BAIRRO", name: "Bairro", page: 2, x: 90, y: 555, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "CEP", name: "CEP do Titular", page: 2, x: 80, y: 570, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "TELEFONE", name: "Telefone Comercial/Res.", page: 2, x: 92, y: 540, fontSize: 9, alignment: "left", hideOriginal: true, required: false },
          { id: "CELULAR", name: "WhatsApp / Celular", page: 2, x: 230, y: 540, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "PROFISSÃO", name: "Profissão do Titular", page: 2, x: 420, y: 540, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "PRODUTO", name: "Produto Vendido", page: 2, x: 130, y: 495, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "VALOR_PRODUTO", name: "Valor Total do Produto", page: 2, x: 175, y: 480, size: 9, alignment: "left", hideOriginal: true, required: true } as any,
          { id: "VALOR_ENTRADA", name: "Valor da Entrada (Sinal)", page: 2, x: 460, y: 480, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "FORMA_PGTO_ENTRADA", name: "Forma de Pgto da Entrada", page: 2, x: 460, y: 465, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "QTDE_PARCELAS_ENTRADA", name: "Qtde Parcelas Entrada", page: 2, x: 180, y: 465, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "VALOR_TOTAL_SALDO", name: "Valor Total do Saldo", page: 2, x: 200, y: 450, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "QTDE_PARCELAS_SALDO", name: "Qtde Parcelas Saldo", page: 2, x: 460, y: 450, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "VALOR_PARCELAS_SALDO", name: "Valor Parcelas Saldo", page: 2, x: 180, y: 435, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "FORMA_PGTO_SALDO", name: "Forma de Pgto do Saldo", page: 2, x: 440, y: 435, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "DATA_PRIMEIRA_PARCELA", name: "Vcto da 1ª Parcela", page: 2, x: 230, y: 420, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "DEPENDENTES", name: "Dependentes / Beneficiários", page: 2, x: 160, y: 390, fontSize: 8.5, alignment: "left", hideOriginal: true, required: false },
          { id: "CARTAO_DADOS", name: "Dados do Cartão (Cofre)", page: 2, x: 230, y: 375, fontSize: 8.5, alignment: "left", hideOriginal: true, required: false }
        );
      } else {
        // Standard General layouts placeholders
        list.push(
          { id: "[VENDACONTRATONUMERO]", name: "Número do Contrato", page: 1, x: 270, y: 700, fontSize: 11, alignment: "left", hideOriginal: true, required: true },
          { id: "[VENDAANO]", name: "Ano da Venda", page: 1, x: 380, y: 700, fontSize: 11, alignment: "left", hideOriginal: true, required: true },
          { id: "[VENDAPESSOA1NOME]", name: "Nome do Adquirente", page: 1, x: 130, y: 635, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "[VENDAPESSOA1NACIONALIDADE]", name: "Nacionalidade do Adquirente", page: 1, x: 120, y: 620, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "[VENDAPESSOA1ESTADOCIVIL]", name: "Estado Civil do Adquirente", page: 1, x: 360, y: 620, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "[VENDAPESSOA1PROFISSAO]", name: "Profissão do Adquirente", page: 1, x: 480, y: 605, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "[VENDAPESSOA1RG]", name: "RG do Adquirente", page: 1, x: 74, y: 605, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "[VENDAPESSOA1CPF]", name: "CPF do Adquirente", page: 1, x: 240, y: 605, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "[VENDAPESSOA1ENDERECO]", name: "Endereço do Adquirente", page: 1, x: 100, y: 590, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "[VENDAPESSOA1NUMEROENDERECO]", name: "Número", page: 1, x: 380, y: 590, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "[VENDAPESSOA1BAIRRO]", name: "Bairro", page: 1, x: 480, y: 590, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "[VENDAPESSOA1CEP]", name: "CEP do Adquirente", page: 1, x: 80, y: 575, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "[VENDAPESSOA1CIDADE]", name: "Cidade do Adquirente", page: 1, x: 210, y: 575, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "[VENDAPESSOA1ESTADO]", name: "Estado (UF)", page: 1, x: 480, y: 575, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "[ATENDIMENTOPESSOA1ACOMPANHANTE1]", name: "Nome do Acompanhante/Dependente", page: 1, x: 160, y: 515, fontSize: 9, alignment: "left", hideOriginal: true, required: false },
          { id: "[VENDAVALORFINANCIADO]", name: "Valor Total d'Aquisição", page: 1, x: 220, y: 440, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "[VENDAVALORFINANCIADOEXTENSO]", name: "Valor Total por Extenso", page: 1, x: 210, y: 440, fontSize: 8, alignment: "left", hideOriginal: true, required: true },
          { id: "[VENDAVALORSALDORESTANTE]", name: "Saldo Restante Financiado", page: 1, x: 180, y: 410, fontSize: 9, alignment: "left", hideOriginal: true, required: true },
          { id: "[PARCELATIPOPARCELA1]", name: "Parcela 1 Tipo", page: 1, x: 40, y: 340, fontSize: 8, alignment: "left", hideOriginal: true, required: true },
          { id: "[PARCELAQUANTIDADE1]", name: "Parcela 1 Qtde", page: 1, x: 180, y: 340, fontSize: 8, alignment: "left", hideOriginal: true, required: true },
          { id: "[PARCELAVALOR1]", name: "Parcela 1 Valor", page: 1, x: 230, y: 340, fontSize: 8, alignment: "left", hideOriginal: true, required: true },
          { id: "[PARCELAVENCIMENTO1]", name: "Parcela 1 Vencimento", page: 1, x: 320, y: 340, fontSize: 8, alignment: "left", hideOriginal: true, required: true },
          { id: "[PARCELADETALHE1]", name: "Parcela 1 Detalhes", page: 1, x: 410, y: 340, fontSize: 8, alignment: "left", hideOriginal: true, required: true },
          { id: "[PARCELATIPOPARCELA2]", name: "Parcela 2 Tipo", page: 1, x: 40, y: 310, fontSize: 8, alignment: "left", hideOriginal: true, required: true },
          { id: "[PARCELAQUANTIDADE2]", name: "Parcela 2 Qtde", page: 1, x: 180, y: 310, fontSize: 8, alignment: "left", hideOriginal: true, required: true },
          { id: "[PARCELAVALOR2]", name: "Parcela 2 Valor", page: 1, x: 230, y: 310, fontSize: 8, alignment: "left", hideOriginal: true, required: true },
          { id: "[PARCELAVENCIMENTO2]", name: "Parcela 2 Vencimento", page: 1, x: 320, y: 310, fontSize: 8, alignment: "left", hideOriginal: true, required: true },
          { id: "[PARCELADETALHE2]", name: "Parcela 2 Detalhes", page: 1, x: 410, y: 310, fontSize: 8, alignment: "left", hideOriginal: true, required: true },
          { id: "[PARCELAVALOR3]", name: "Parcela 3 Valor", page: 1, x: 230, y: 280, fontSize: 8, alignment: "left", hideOriginal: true, required: false },
          { id: "[PARCELAVENCIMENTO3]", name: "Parcela 3 Vencimento", page: 1, x: 320, y: 280, fontSize: 8, alignment: "left", hideOriginal: true, required: false },
          { id: "[PARCELADETALHE3]", name: "Parcela 3 Detalhes", page: 1, x: 410, y: 280, fontSize: 8, alignment: "left", hideOriginal: true, required: false },
          { id: "[PARCELAVALOR4]", name: "Parcela 4 Valor", page: 1, x: 230, y: 250, fontSize: 8, alignment: "left", hideOriginal: true, required: false },
          { id: "[PARCELAVENCIMENTO4]", name: "Parcela 4 Vencimento", page: 1, x: 320, y: 250, fontSize: 8, alignment: "left", hideOriginal: true, required: false },
          { id: "[PARCELADETALHE4]", name: "Parcela 4 Detalhes", page: 1, x: 410, y: 250, fontSize: 8, alignment: "left", hideOriginal: true, required: false }
        );
      }
      
      return { ...tpl, fields: list };
    });
  }, [templates]);

  // Derive active selections
  const activeClient = useMemo(() => {
    return receptions.find(r => r.id === selectedClientId) || receptions[0];
  }, [receptions, selectedClientId]);

  // Find active sale or generate basic default values based on selected client
  const activeSale = useMemo(() => {
    if (!activeClient) return null;
    return sales.find(s => s.receptionId === activeClient.id) || null;
  }, [sales, activeClient]);

  const activeTemplate = useMemo(() => {
    return enrichedTemplates.find(t => t.id === selectedTemplateId) || enrichedTemplates[0];
  }, [enrichedTemplates, selectedTemplateId]);

  const activeProduct = useMemo(() => {
    if (!activeTemplate) return products[0];
    return products.find(p => p.id === activeTemplate.productId) || products[0];
  }, [activeTemplate, products]);

  // Substitutes generator dictionary to match exact fields with zero-error resiliency
  const substitutes = useMemo(() => {
    const s: Record<string, string> = {};
    if (!activeClient) return s;

    // Direct personal details
    s["[VENDAPESSOA1NOME]"] = activeClient.guest1?.name || " - ";
    s["[VENDAPESSOA1NACIONALIDADE]"] = activeClient.guest1?.nationality || "Brasileiro(a)";
    s["[VENDAPESSOA1ESTADOCIVIL]"] = activeClient.guest1?.maritalStatus || "União Estável";
    s["[VENDAPESSOA1PROFISSAO]"] = activeClient.guest1?.profession || " - ";
    s["[VENDAPESSOA1RG]"] = activeClient.guest1?.rg || " - ";
    s["[VENDAPESSOA1CPF]"] = activeClient.guest1?.cpf || " - ";
    
    // Address elements
    s["[VENDAPESSOA1ENDERECO]"] = activeClient.address?.street || " - ";
    s["[VENDAPESSOA1NUMEROENDERECO]"] = activeClient.address?.number || "S/N";
    s["[VENDAPESSOA1BAIRRO]"] = activeClient.address?.neighborhood || " - ";
    s["[VENDAPESSOA1CEP]"] = activeClient.address?.cep || " - ";
    s["[VENDAPESSOA1CIDADE]"] = activeClient.address?.city || "Caldas Novas";
    s["[VENDAPESSOA1ESTADO]"] = activeClient.address?.state || "GO";

    // Companions or Dependents
    s["[ATENDIMENTOPESSOA1ACOMPANHANTE1]"] = activeClient.relation?.companionNames || "Nenhum cadastrado";

    s["[VENDADIA]"] = new Date().getDate().toString();
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    s["[VENDAMES]"] = meses[new Date().getMonth()];

    // Financial overlays if there is an active sale
    if (activeSale) {
      s["[VENDACONTRATONUMERO]"] = activeSale.id;
      s["[VENDAANO]"] = activeSale.date.split("-")[0] || new Date().getFullYear().toString();
      s["[VENDAVALORFINANCIADO]"] = activeSale.totalPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
      s["[VENDAVALORFINANCIADOEXTENSO]"] = valorPorExtenso(activeSale.totalPrice);
      s["[VENDAVALORSALDORESTANTE]"] = activeSale.remainingBalance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

      s["[PARCELATIPOPARCELA1]"] = "Sinal d'Entrada";
      s["[PARCELAQUANTIDADE1]"] = "1";
      s["[PARCELAVALOR1]"] = activeSale.downPayment.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
      s["[PARCELAVENCIMENTO1]"] = activeSale.date.split("-").reverse().join("/");
      s["[PARCELADETALHE1]"] = "Pago via " + activeSale.paymentMethod;

      s["[PARCELATIPOPARCELA2]"] = "Mensalidades do Saldo";
      s["[PARCELAQUANTIDADE2]"] = String(activeSale.installmentsCount);
      s["[PARCELAVALOR2]"] = activeSale.installmentValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
      s["[PARCELAVENCIMENTO2]"] = activeSale.firstDueDate ? activeSale.firstDueDate.split("-").reverse().join("/") : " - ";
      s["[PARCELADETALHE2]"] = `Financiamento parcelado em ${activeSale.installmentsCount} vezes mensais`;

      s["[PARCELAVALOR3]"] = "R$ 0,00";
      s["[PARCELAVENCIMENTO3]"] = " - ";
      s["[PARCELADETALHE3]"] = "Nenhuma";

      s["[PARCELAVALOR4]"] = "R$ 0,00";
      s["[PARCELAVENCIMENTO4]"] = " - ";
      s["[PARCELADETALHE4]"] = "Nenhuma";

      // Autorização para emissão specific extras mappings
      s["SALA"] = activeSale.observations?.includes("Sala:") ? activeSale.observations.split("Sala:")[1].split("|")[0].trim() : "SALA PREMIUM VP";
      s["CAPTADOR"] = activeClient.sdrName || "Gerência";
      s["EXECUTIVO"] = activeSale.brokerName || activeClient.brokerName || "Gerência Lagoa";
      s["TITULAR"] = activeClient.guest1?.name || " - ";
      s["CPF"] = activeClient.guest1?.cpf || " - ";
      s["RG"] = activeClient.guest1?.rg || " - ";
      s["NASCIMENTO"] = activeClient.guest1?.birthDate || " - ";
      s["NACIONALIDADE"] = activeClient.guest1?.nationality || "Brasileira";
      s["ENDERECO"] = (activeClient.address?.street || " - ") + ", " + (activeClient.address?.number || "S/N");
      s["CIDADE"] = activeClient.address?.city || "Caldas Novas";
      s["UF"] = activeClient.address?.state || "GO";
      s["BAIRRO"] = activeClient.address?.neighborhood || " - ";
      s["CEP"] = activeClient.address?.cep || " - ";
      s["TELEFONE"] = activeClient.contacts?.phoneResNumber || " - ";
      s["CELULAR"] = activeClient.contacts?.phoneMobNumber || " - ";
      s["PROFISSÃO"] = activeClient.guest1?.profession || " - ";
      s["PRODUTO"] = activeSale.productName;
      s["VALOR_PRODUTO"] = activeSale.totalPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
      s["VALOR_ENTRADA"] = activeSale.downPayment.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
      s["FORMA_PGTO_ENTRADA"] = activeSale.paymentMethod;
      s["QTDE_PARCELAS_ENTRADA"] = "1 (Sinal)";
      s["VALOR_TOTAL_SALDO"] = activeSale.remainingBalance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
      s["QTDE_PARCELAS_SALDO"] = String(activeSale.installmentsCount);
      s["VALOR_PARCELAS_SALDO"] = activeSale.installmentValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
      s["FORMA_PGTO_SALDO"] = "Cobrança Recorrente Recibo";
      s["DATA_PRIMEIRA_PARCELA"] = activeSale.firstDueDate ? activeSale.firstDueDate.split("-").reverse().join("/") : " - ";
      s["DEPENDENTES"] = activeClient.relation?.companionNames || "Nenhum";
      s["CARTAO_DADOS"] = activeClient.financial?.cardBrand ? `${activeClient.financial.cardBrand} final ${activeClient.financial.cardDigits || "****"}` : "Não informado";
    } else {
      // Empty financial values layout strings fallback
      s["[VENDACONTRATONUMERO]"] = "CON-TEMP-" + activeClient.id;
      s["[VENDAANO]"] = new Date().getFullYear().toString();
      s["[VENDAVALORFINANCIADO]"] = "R$ 0,00";
      s["[VENDAVALORFINANCIADOEXTENSO]"] = "zero reais";
      s["[VENDAVALORSALDORESTANTE]"] = "R$ 0,00";
      s["[PARCELAVALOR1]"] = "R$ 0,00";
      s["[PARCELAVENCIMENTO1]"] = " - ";
      s["[PARCELADETALHE1]"] = "Pendente lançar faturamento";
      s["[PARCELAVALOR2]"] = "R$ 0,00";
      s["[PARCELAVENCIMENTO2]"] = " - ";
      s["[PARCELADETALHE2]"] = "Pendente lançar faturamento";
      s["[PARCELAQUANTIDADE2]"] = "0";

      s["SALA"] = "SALA VP";
      s["CAPTADOR"] = activeClient.sdrName || "Gerência";
      s["EXECUTIVO"] = activeClient.brokerName || "Corretor";
      s["TITULAR"] = activeClient.guest1?.name || " - ";
      s["CPF"] = activeClient.guest1?.cpf || " - ";
      s["RG"] = activeClient.guest1?.rg || " - ";
      s["NASCIMENTO"] = activeClient.guest1?.birthDate || " - ";
      s["NACIONALIDADE"] = activeClient.guest1?.nationality || "Brasileira";
      s["ENDERECO"] = activeClient.address?.street || " - ";
      s["CIDADE"] = activeClient.address?.city || "Caldas Novas";
      s["UF"] = activeClient.address?.state || "GO";
      s["BAIRRO"] = activeClient.address?.neighborhood || " - ";
      s["CEP"] = activeClient.address?.cep || " - ";
      s["TELEFONE"] = activeClient.contacts?.phoneResNumber || " - ";
      s["CELULAR"] = activeClient.contacts?.phoneMobNumber || " - ";
      s["PROFISSÃO"] = activeClient.guest1?.profession || " - ";
      s["PRODUTO"] = "PRODUTO CONCESSÃO VITALÍCIA";
      s["VALOR_PRODUTO"] = "R$ 0,00";
      s["VALOR_ENTRADA"] = "R$ 0,00";
      s["FORMA_PGTO_ENTRADA"] = " - ";
      s["QTDE_PARCELAS_ENTRADA"] = "0";
      s["VALOR_TOTAL_SALDO"] = "R$ 0,00";
      s["QTDE_PARCELAS_SALDO"] = "0";
      s["VALOR_PARCELAS_SALDO"] = "R$ 0,00";
      s["FORMA_PGTO_SALDO"] = " - ";
      s["DATA_PRIMEIRA_PARCELA"] = " - ";
      s["DEPENDENTES"] = "Nenhum";
      s["CARTAO_DADOS"] = "Não informado";
    }

    return s;
  }, [activeClient, activeSale]);

  // Handle live PDF generation & required-field checking
  useEffect(() => {
    let active = true;
    
    async function updatePdfPreview() {
      if (!activeTemplate) return;
      
      // Perform validation check for all required fields in the template mapping
      const missingRequired: string[] = [];
      const fields = activeTemplate.fields || [];
      
      for (const field of fields) {
        if (field.required) {
          let val = substitutes[field.id] || substitutes[field.id.replace(/[\[\]]/g, "")] || "";
          if (!val || val === " - " || val === "Nenhum cadastrado") {
            missingRequired.push(field.name || field.id);
          }
        }
      }
      setValidationAlerts(Array.from(new Set(missingRequired)));

      try {
        setPdfLoading(true);
        setPdfError(null);
        
        // 1. Get raw PDF bytes (either uploaded PDF base64 OR generated template on-the-fly)
        let pdfBytes: Uint8Array;
        if (activeTemplate.pdfBase64) {
          const base64Data = activeTemplate.pdfBase64.split(",")[1] || activeTemplate.pdfBase64;
          const binaryString = window.atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          pdfBytes = bytes;
        } else {
          // Generate a high fidelity standard template PDF with official headings, margins
          pdfBytes = await generateDefaultPdfTemplateBytes(
            activeProduct?.name || "Produto", 
            activeTemplate.name, 
            fields
          );
        }

        // 2. Overlay values by coordinates using helper
        const filledBytes = await fillPdfData(pdfBytes, fields, substitutes);
        
        // 3. Convert to data uri
        const b64 = arrayBufferToBase64(filledBytes.buffer);
        if (active) {
          setPdfDataUri(`data:application/pdf;base64,${b64}`);
        }
      } catch (err: any) {
        console.error(err);
        if (active) {
          setPdfError(err.message || "Erro de renderização do arquivo PDF.");
        }
      } finally {
        if (active) {
          setPdfLoading(false);
        }
      }
    }

    updatePdfPreview();
    return () => {
      active = false;
    };
  }, [activeTemplate, activeProduct, substitutes]);

  // Handle uploading PDF from files
  const handlePdfUpload = (tplId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      const targetTpl = enrichedTemplates.find(t => t.id === tplId);
      if (targetTpl) {
        const updated: ContractTemplate = {
          ...targetTpl,
          pdfBase64: base64,
          pdfFileName: file.name
        };
        onUpdateTemplate(updated);
        alert(`Modelo de PDF Oficial "${file.name}" vinculado com sucesso! O sistema usará as coordenadas por cima deste documento.`);
      }
    };
    reader.readAsDataURL(file);
  };

  const activeMappingTemplate = useMemo(() => {
    return enrichedTemplates.find(t => t.id === activeMappingTplId) || enrichedTemplates[0];
  }, [enrichedTemplates, activeMappingTplId]);

  const activeMappingFieldsFiltered = useMemo(() => {
    if (!activeMappingTemplate) return [];
    return (activeMappingTemplate.fields || []).filter(f => {
      const matchesPage = f.page === mappingPageFilter;
      const matchesSearch = f.name.toLowerCase().includes(fieldsSearchText.toLowerCase()) || f.id.toLowerCase().includes(fieldsSearchText.toLowerCase());
      return matchesPage && matchesSearch;
    });
  }, [activeMappingTemplate, mappingPageFilter, fieldsSearchText]);

  const selectedField = useMemo(() => {
    if (!activeMappingTemplate) return null;
    return (activeMappingTemplate.fields || []).find(f => f.id === selectedFieldId) || null;
  }, [activeMappingTemplate, selectedFieldId]);

  // Click on visual canvas to record coordinate positions directly! (Wysiwyg Helper)
  const handleVisualCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedField || !activeMappingTemplate) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert mouse pixels to 595 x 842 points standard
    const pdfX = Math.round((clickX / rect.width) * 595);
    const pdfY = Math.round(842 - (clickY / rect.height) * 842);

    const updatedFields = (activeMappingTemplate.fields || []).map(f => {
      if (f.id === selectedField.id) {
        return {
          ...f,
          x: pdfX,
          y: pdfY,
          page: mappingPageFilter
        };
      }
      return f;
    });

    onUpdateTemplate({
      ...activeMappingTemplate,
      fields: updatedFields
    });
  };

  const handleUpdateFieldProps = (fieldId: string, updates: Partial<FieldMapping>) => {
    if (!activeMappingTemplate) return;
    const updatedFields = (activeMappingTemplate.fields || []).map(f => {
      if (f.id === fieldId) {
        return { ...f, ...updates };
      }
      return f;
    });
    onUpdateTemplate({
      ...activeMappingTemplate,
      fields: updatedFields
    });
  };

  const handleAddField = () => {
    if (!activeMappingTemplate) return;
    const key = prompt("Digite a chave/tag que deseja mapear no PDF (Ex: [SALA] ou [NOVO_CAMPO]):");
    if (!key) return;
    
    // Check duplication
    const exists = (activeMappingTemplate.fields || []).some(f => f.id === key);
    if (exists) {
      alert("Este identificador de campo já existe neste modelo.");
      return;
    }

    const name = prompt("Digite o nome amigável para este campo:", key.replace(/[\[\]]/g, ""));
    if (!name) return;

    const newField: FieldMapping = {
      id: key,
      name: name,
      page: mappingPageFilter,
      x: 150,
      y: 500,
      fontSize: 9,
      alignment: "left",
      hideOriginal: true,
      required: false
    };

    onUpdateTemplate({
      ...activeMappingTemplate,
      fields: [...(activeMappingTemplate.fields || []), newField]
    });
    setSelectedFieldId(key);
  };

  const handleDeleteField = (fieldId: string) => {
    if (!activeMappingTemplate) return;
    if (confirm("Deseja excluir este mapped field deste modelo?")) {
      const updatedFields = (activeMappingTemplate.fields || []).filter(f => f.id !== fieldId);
      onUpdateTemplate({
        ...activeMappingTemplate,
        fields: updatedFields
      });
      setSelectedFieldId("");
    }
  };

  // Launch Sale form submition
  const handleLaunchSaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rep = receptions.find(r => r.id === launchClient);
    const prod = products.find(p => p.id === launchProduct);
    if (!rep || !prod) {
      alert("Selecione um cliente e um produto válido.");
      return;
    }

    const newSaleId = "SAL-" + Math.floor(1000 + Math.random() * 9000);
    const newMethod = launchPaymentMethod.includes("Boleto") 
      ? PaymentMethod.BOLETO 
      : launchPaymentMethod.includes("Recorrente") 
        ? PaymentMethod.CREDITO_RECORRENTE 
        : PaymentMethod.OUTRO;

    const newSale: SalesRecord = {
      id: newSaleId,
      receptionId: launchClient,
      productId: launchProduct,
      productName: prod.name,
      titleType: prod.benefits.includes("Taxa d'Adesão") ? "Cessão Simples" : "Título Vitalício",
      totalPrice: launchTotalPrice,
      downPayment: launchDownPayment,
      remainingBalance: launchRemainingBalance,
      installmentsCount: launchInstallmentsCount,
      installmentValue: launchInstallmentValue,
      paymentMethod: newMethod,
      brokerName: rep.brokerName || "Gerente Comercial",
      date: new Date().toISOString().split("T")[0],
      observations: `Lançado pelo módulo administrativo. Observação: ${launchDescription} | Sala: SALA PREMIUM VP`,
      peopleCount: rep.relation?.companionNames ? "2+" : "1",
      firstDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      paymentStatus: "Pendente",
      contractStatus: "Gerado",
      documents: []
    };

    onSaveSale(newSale);
    setShowLaunchForm(false);
    setSelectedClientId(launchClient);
    alert(`Contrato faturado e lançado sob o ID comercial: ${newSaleId} com sucesso!`);
  };

  const handleDownloadPdfFile = () => {
    if (!pdfDataUri) {
      alert("PDF ainda está carregando...");
      return;
    }
    const link = document.createElement("a");
    link.href = pdfDataUri;
    link.download = `CONTRATO_${activeClient?.guest1?.name?.toUpperCase() || "ADERENTE"}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <span className="p-1 px-2.5 bg-[#0B4A34] text-white rounded-lg text-sm font-mono">LL</span> Emissão de Contratos
          </h1>
          <p className="text-xs text-slate-500">Geração de contratos por sobreposição de coordenadas em PDF imutável padrão original.</p>
        </div>

        {/* Navigation sub-tabs */}
        <div className="flex flex-wrap bg-slate-100 p-1 rounded-xl self-stretch md:self-auto border border-slate-200">
          <button
            onClick={() => setSubTab("emitidos")}
            className={`py-2 px-3.5 font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === "emitidos" ? "bg-[#0B4A34] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            📋 Lançamentos e Vendas
          </button>
          
          <button
            onClick={() => setSubTab("mapeamento")}
            className={`py-2 px-3.5 font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === "mapeamento" ? "bg-[#0B4A34] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            ⚙️ Mapeamento de Coordenadas
          </button>

          <button
            onClick={() => setSubTab("ficha")}
            className={`py-2 px-3.5 font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === "ficha" ? "bg-[#0B4A34] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            📄 Ficha de Adesão (Frente/Verso)
          </button>

          <button
            onClick={() => setSubTab("legislativo")}
            className={`py-2 px-3.5 font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === "legislativo" ? "bg-[#0B4A34] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            📄 Gerar Contrato Oficial
          </button>
        </div>
      </div>

      {/* Select Client Selector Banner */}
      {subTab !== "emitidos" && subTab !== "mapeamento" && (
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-3.5 print:hidden">
          <span className="font-extrabold text-xs text-slate-600 block shrink-0">Buscar Proponente Relacionado (Titular):</span>
          <select
            value={selectedClientId}
            onChange={(e) => {
              setSelectedClientId(e.target.value);
              setCurrentPage(1);
            }}
            className="p-2 border border-slate-200 outline-none rounded-lg bg-slate-50 text-slate-850 font-bold tracking-tight cursor-pointer text-xs flex-1 w-full"
          >
            {receptions.map(r => (
              <option key={r.id} value={r.id}>
                👤 {r.guest1?.name || "Sem Nome"} ({r.id}) - SDR: {r.sdrName || "Sem SDR"}
              </option>
            ))}
          </select>
          
          {activeSale ? (
            <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 shadow-sm">
              ✓ Comercial Faturado: {activeSale.productName} ({activeSale.id})
            </span>
          ) : (
            <span className="text-[10px] bg-amber-50 border border-amber-200 text-amber-600 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 animate-pulse">
              ⚠️ Nenhuma Venda Comercial ativa (Valores simulados)
            </span>
          )}
        </div>
      )}

      {/* RENDER CRUDS SUBTAB */}
      {subTab === "emitidos" && (
        <div className="space-y-6 print:hidden">
          
          {/* LANÇAMENTOS COMERCIAIS FORM */}
          {showLaunchForm && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-lg space-y-4 relative">
              <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <Sparkles className="h-4.5 w-4.5 text-emerald-600 hover:rotate-12 transition-transform" /> Lançamento de Cessão (Faturar Contrato com Preços e Parcelas Automáticas)
              </h3>
              
              <form onSubmit={handleLaunchSaleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="font-bold text-slate-600">Proponente Titular:</label>
                    <select
                      value={launchClient}
                      onChange={(e) => setLaunchClient(e.target.value)}
                      className="p-2 border border-slate-200 rounded-lg bg-white font-medium cursor-pointer"
                    >
                      {receptions.map(r => (
                        <option key={r.id} value={r.id}>
                          👤 {r.guest1?.name || "Sem Nome"} ({r.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="font-bold text-slate-600">Produto:</label>
                    <select
                      value={launchProduct}
                      onChange={(e) => setLaunchProduct(e.target.value)}
                      className="p-2 border border-slate-200 rounded-lg bg-white font-medium cursor-pointer"
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          📦 {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="font-bold text-slate-600">Forma de Pagamento:</label>
                    <select
                      value={launchPaymentMethod}
                      onChange={(e) => setLaunchPaymentMethod(e.target.value)}
                      className="p-2 border border-slate-200 rounded-lg bg-white font-medium cursor-pointer"
                    >
                      <option value="Boleto Bancário / Recorrente">Boleto Bancário / Recorrente</option>
                      <option value="Cartão de Crédito Recorrente">Cartão de Crédito Recorrente</option>
                      <option value="PIX Direcional">PIX Completo</option>
                      <option value="Cheques pré-datados">Cheques pré-datados</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex flex-col space-y-1">
                    <label className="font-black text-slate-700">Valor Total Produto:</label>
                    <input
                      type="number"
                      required
                      value={launchTotalPrice}
                      onChange={(e) => handleLaunchPriceChange("total", Number(e.target.value))}
                      className="p-2 border border-slate-300 rounded-lg font-bold text-slate-800 bg-white"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="font-black text-slate-700">Valor da Entrada (Sinal):</label>
                    <input
                      type="number"
                      required
                      value={launchDownPayment}
                      onChange={(e) => handleLaunchPriceChange("down", Number(e.target.value))}
                      className="p-2 border border-slate-300 rounded-lg font-bold text-slate-800 bg-white"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="font-black text-[#0B4A34]">Saldo Restante Financiado:</label>
                    <input
                      type="number"
                      required
                      value={launchRemainingBalance}
                      onChange={(e) => handleLaunchPriceChange("balance", Number(e.target.value))}
                      className="p-2 border border-emerald-300 rounded-lg font-extrabold text-[#0B4A34] bg-emerald-50/50"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="font-semibold text-slate-600">Nº de Parcelas Saldo:</label>
                    <input
                      type="number"
                      required
                      value={launchInstallmentsCount}
                      onChange={(e) => handleLaunchPriceChange("count", Number(e.target.value))}
                      className="p-2 border border-slate-300 rounded-lg font-bold text-slate-800 bg-white"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="font-semibold text-slate-600">Valor das Parcelas:</label>
                    <input
                      type="number"
                      required
                      value={launchInstallmentValue}
                      onChange={(e) => handleLaunchPriceChange("val", Number(e.target.value))}
                      className="p-2 border border-slate-300 rounded-lg font-bold text-[#0B4A34] bg-white"
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="font-bold text-slate-600">Do que se trata o lançamento (Descrição):</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Aquisição de Título Familiar Vitalício com sinal em PIX e saldo financiado recorrente."
                    value={launchDescription}
                    onChange={(e) => setLaunchDescription(e.target.value)}
                    className="p-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLaunchForm(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer font-bold"
                  >
                    Voltar / Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0B4A34] text-white rounded-lg hover:bg-[#073324] cursor-pointer font-extrabold shadow-sm"
                  >
                    Confirmar e Lançar Contrato
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ACTIVE SALES LISTS AND DETAILED CRUD */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-emerald-600" /> Vendas Faturadas (Lançamentos de Contratos)
                </h3>
                <p className="text-[11px] text-slate-400">Contratos emitidos com controle financeiro de entrada, saldo e formas de parcelamento integradas.</p>
              </div>

              {!showLaunchForm && (
                <button
                  onClick={() => setShowLaunchForm(true)}
                  className="flex items-center gap-1.5 bg-[#0B4A34] text-white font-extrabold text-xs px-3.5 py-2 rounded-xl hover:bg-[#073324] transition-all cursor-pointer shadow-sm"
                >
                  <Plus className="h-4 w-4" /> Novo Lançamento de Contrato
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-extrabold border-b border-slate-100 text-[10px] uppercase">
                    <th className="p-3">Código / Data</th>
                    <th className="p-3">Titular Comprador</th>
                    <th className="p-3">Produto Outorgado</th>
                    <th className="p-3 text-emerald-700 font-bold">Valor do Produto</th>
                    <th className="p-3 text-indigo-700 font-bold">Entrada (Sinal)</th>
                    <th className="p-3 text-rose-700 font-bold">Saldo Restante</th>
                    <th className="p-3">Forma de Pagamento</th>
                    <th className="p-3 text-right">Ações de Emissão</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sales.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-10 text-center text-slate-400 font-medium">
                        Nenhum contrato ativo faturado no sistema. Clique em "Novo Lançamento" para cadastrar.
                      </td>
                    </tr>
                  ) : (
                    sales.map(s => {
                      const rc = receptions.find(r => r.id === s.receptionId);
                      return (
                        <tr key={s.id} className="hover:bg-slate-100/40 divide-y divide-slate-50/50">
                          <td className="p-3">
                            <span className="font-mono font-bold block text-slate-800">{s.id}</span>
                            <span className="text-[10px] text-slate-400">{s.date.split("-").reverse().join("/")}</span>
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-slate-700">{rc?.guest1?.name || " - "}</div>
                            <div className="text-[10px] text-slate-400">CPF: {rc?.guest1?.cpf || " - "}</div>
                          </td>
                          <td className="p-3">
                            <div className="font-semibold text-slate-800">{s.productName}</div>
                            <div className="text-[10px] text-slate-400">{s.titleType}</div>
                          </td>
                          <td className="p-3 font-semibold font-mono text-[#0B4A34]">
                            {s.totalPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </td>
                          <td className="p-3 font-semibold font-mono text-indigo-700">
                            {s.downPayment.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </td>
                          <td className="p-3 font-serif font-bold text-rose-700">
                            {s.remainingBalance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            <div className="text-[9px] text-slate-400 font-normal">{s.installmentsCount}p x {s.installmentValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
                          </td>
                          <td className="p-3 text-slate-600 font-medium">{s.paymentMethod}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-1.5 justify-end">
                              <button
                                onClick={() => {
                                  setSelectedClientId(s.receptionId);
                                  setSubTab("ficha");
                                }}
                                className="px-2 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg text-[10px] font-black cursor-pointer transition-colors"
                              >
                                Ficha de Adesão
                              </button>
                              
                              <button
                                onClick={() => {
                                  setSelectedClientId(s.receptionId);
                                  const matchingTpl = enrichedTemplates.find(t => t.productId === s.productId);
                                  if (matchingTpl) {
                                    setSelectedTemplateId(matchingTpl.id);
                                  }
                                  setSubTab("legislativo");
                                }}
                                className="px-2 py-1 bg-[#0B4A34] text-white hover:bg-[#073324] rounded-lg text-[10px] font-black cursor-pointer transition-colors"
                              >
                                PDF Oficial
                              </button>
                              
                              <button
                                onClick={() => {
                                  if (confirm(`Deseja excluir permanentemente o lançamento da venda ${s.id}?`)) {
                                    onDeleteSale(s.id);
                                  }
                                }}
                                className="p-1 text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg cursor-pointer transition-all"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
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

          {/* TEMPLATE FILES AND UPLOAD ORIGINAL MODEL PDF */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div>
              <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                <Award className="h-4.5 w-4.5 text-emerald-600" /> Modelos Oficiais de Contratos Ativos
              </h3>
              <p className="text-[11px] text-slate-400">Gerencie os arquivos PDFs originais. Você pode fazer upload de um modelo próprio; caso contrário, o sistema simula um layout de alta qualidade.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 text-[10px] uppercase">
                    <th className="p-3">ID</th>
                    <th className="p-3">Nome do Modelo</th>
                    <th className="p-3 font-semibold text-[#0B4A34]">Arquivo PDF Vinculado</th>
                    <th className="p-3">Produto Associado</th>
                    <th className="p-3">Mapeamentos</th>
                    <th className="p-3 text-right">Upload PDF Original</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {enrichedTemplates.map(tpl => {
                    const linkedProd = products.find(p => p.id === tpl.productId);
                    return (
                      <tr key={tpl.id} className="hover:bg-slate-50/20">
                        <td className="p-3">
                          <span className="p-1 px-1.5 font-mono text-[10px] font-bold bg-slate-100 text-slate-700 rounded">{tpl.id}</span>
                        </td>
                        <td className="p-3 font-bold text-slate-800">{tpl.name}</td>
                        <td className="p-3">
                          {tpl.pdfFileName ? (
                            <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono px-2 py-1 rounded inline-flex items-center gap-1">
                              ✓ {tpl.pdfFileName}
                            </span>
                          ) : (
                            <span className="text-[10px] bg-indigo-50 border border-indigo-150 text-indigo-700 font-semibold px-2 py-1 rounded inline-flex items-center gap-1">
                              ⚡ Layout Padrão A4 Ativado
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          {linkedProd ? (
                            <span className="text-[10px] font-extrabold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                              {linkedProd.name}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium">Geral</span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className="font-mono text-[10px] text-[#0B4A34] font-black bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                            {(tpl.fields || []).length} campos
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setActiveMappingTplId(tpl.id);
                                setSubTab("mapeamento");
                              }}
                              className="px-2 py-1 text-xs text-slate-700 border border-slate-205 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center gap-1 font-bold"
                              title="Configurar posições no editor virtual"
                            >
                              <Sliders className="h-3 w-3" /> Mapear
                            </button>

                            <label className="px-2 py-1 bg-slate-800 text-white rounded-lg hover:bg-slate-900 cursor-pointer text-xs font-extrabold flex items-center gap-1 transition-colors">
                              <Upload className="h-3 w-3" />
                              Upload
                              <input
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                onChange={(e) => handlePdfUpload(tpl.id, e)}
                              />
                            </label>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* RENDER MAPEAMENTO COORDENADAS (PREMIUM EDITOR VISUAL DE PDF) */}
      {subTab === "mapeamento" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:hidden text-xs">
          
          {/* Left panel field settings lists */}
          <div className="lg:col-span-4 space-y-4 flex flex-col justify-start">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <Sliders className="h-4.5 w-4.5 text-[#0B4A34]" /> Modelo & Busca de Campos
              </h3>

              <div className="space-y-3">
                <div className="flex flex-col space-y-1">
                  <label className="font-bold text-slate-600">Escolha o Modelo Contrato:</label>
                  <select
                    value={activeMappingTplId}
                    onChange={(e) => {
                      setActiveMappingTplId(e.target.value);
                      setSelectedFieldId("");
                    }}
                    className="p-2.5 border border-slate-200 outline-none rounded-lg bg-white font-bold cursor-pointer"
                  >
                    {enrichedTemplates.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.id})</option>
                    ))}
                  </select>
                </div>

                <div className="flex bg-slate-150 p-1 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setMappingPageFilter(1)}
                    className={`flex-1 py-1.5 font-bold text-[10px] rounded-lg transition-all ${
                      mappingPageFilter === 1 ? "bg-[#0B4A34] text-white" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Pág. 1
                  </button>
                  <button
                    onClick={() => setMappingPageFilter(2)}
                    className={`flex-1 py-1.5 font-bold text-[10px] rounded-lg transition-all ${
                      mappingPageFilter === 2 ? "bg-[#0B4A34] text-white" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Pág. 2
                  </button>
                  <button
                    onClick={() => setMappingPageFilter(3)}
                    className={`flex-1 py-1.5 font-bold text-[10px] rounded-lg transition-all ${
                      mappingPageFilter === 3 ? "bg-[#0B4A34] text-white" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Pág. 3
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Filtrar campo por nome..."
                  value={fieldsSearchText}
                  onChange={(e) => setFieldsSearchText(e.target.value)}
                  className="p-2 border border-slate-200 rounded-lg w-full outline-none focus:border-slate-400 bg-slate-50 font-medium"
                />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex-1 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-extrabold text-slate-800 uppercase tracking-widest text-[10px]">Campos Filtrados ({activeMappingFieldsFiltered.length})</span>
                <button
                  onClick={handleAddField}
                  className="px-2 py-1 text-[10px] font-extrabold bg-[#0B4A34] hover:bg-[#073324] text-white flex items-center gap-1 rounded-lg cursor-pointer"
                >
                  <Plus className="h-3 w-3" /> Adicionar Tag
                </button>
              </div>

              <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
                {activeMappingFieldsFiltered.length === 0 ? (
                  <div className="text-center p-8 text-slate-400 font-medium">Nenhum campo na Página {mappingPageFilter} corresponde à busca.</div>
                ) : (
                  activeMappingFieldsFiltered.map(f => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFieldId(f.id)}
                      className={`p-2.5 w-full text-left rounded-xl border transition-all flex justify-between items-center cursor-pointer ${
                        selectedFieldId === f.id
                          ? "bg-emerald-50/80 border-emerald-300 text-[#0B4A34] font-bold"
                          : "bg-slate-50 border-slate-150 text-slate-700 hover:bg-slate-100/70"
                      }`}
                    >
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="truncate text-slate-800 font-extrabold">{f.name}</div>
                        <div className="font-mono text-[9px] text-[#0B4A34] truncate">{f.id}</div>
                      </div>
                      <div className="text-[9px] font-mono font-bold text-slate-400 pl-2 text-right">
                        X:{f.x} Y:{f.y}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Right panel coordinate editor & WYSIWYG Canvas sheet editor */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
            
            {/* Visual canvas simulator */}
            <div className="md:col-span-7 bg-slate-200/90 p-5 rounded-2xl flex flex-col items-center justify-center border border-slate-300/65 relative min-h-[500px]">
              <div className="absolute top-3 left-4 text-[9px] bg-slate-800/80 text-white font-mono px-2 py-1 rounded inline-flex items-center gap-1 z-10">
                <Locate className="h-3 w-3 text-emerald-400" />
                Dica: Selecione à esquerda e clique abaixo no papel para reposicionar!
              </div>

              <span className="absolute bottom-3 right-4 font-black text-[10px] text-slate-700 font-mono tracking-widest bg-white p-1.5 rounded-lg border border-slate-300 shadow-sm uppercase">Pág. {mappingPageFilter} de 3</span>

              {/* WHITE A4 BOX WRAPPER */}
              <div
                id="coordCanvas"
                onClick={handleVisualCanvasClick}
                className="bg-white rounded shadow-2xl relative border border-slate-300/40 cursor-crosshair overflow-hidden"
                style={{
                  width: "100%",
                  maxWidth: "410px",
                  aspectRatio: "1/1.414",
                  backgroundImage: "radial-gradient(ellipse at center, rgba(11,74,52,0.03) 0%, rgba(255,255,255,0) 80%)"
                }}
              >
                {/* Simulated Header inside editor canvas for reference */}
                <div className="absolute top-0 inset-x-0 h-10 bg-[#0B4A34] text-white p-2 font-black text-[7px] tracking-wide flex justify-between items-center pointer-events-none opacity-40">
                  <span>ASSESSORIA LAGOA LOVERS • OUTORGA</span>
                  <span>LL</span>
                </div>

                {mappingPageFilter === 1 && (
                  <div className="absolute inset-x-5 top-12 space-y-4 pointer-events-none opacity-20 text-[7px] text-slate-400 font-serif">
                    <div className="font-extrabold text-[10px] text-slate-800 tracking-tight text-center">CONTRATO DE ADESÃO</div>
                    <div>I. QUALIFICAÇÃO DO PROPONENTE TITULAR (ADERENTE)</div>
                    <div className="border border-slate-400 h-16 rounded p-1">
                      <div>Nome: [VENDAPESSOA1NOME]</div>
                      <div>CPF: ____________________   RG: ________________________</div>
                    </div>
                  </div>
                )}

                {/* Plot points of current filtered page mapping fields */}
                {(activeMappingTemplate.fields || [])
                  .filter(f => f.page === mappingPageFilter)
                  .map(f => {
                    const pctX = (f.x / 595) * 100;
                    const pctY = ((842 - f.y) / 842) * 100;
                    const isActive = selectedFieldId === f.id;

                    return (
                      <div
                        key={f.id}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer flex items-center justify-center p-0.5 group z-20 ${
                          isActive 
                            ? "h-4 w-4 bg-emerald-500 ring-4 ring-emerald-500/30 ring-offset-1 anim-pulse" 
                            : "h-3 w-3 bg-indigo-600/85 hover:bg-slate-800"
                        }`}
                        style={{
                          left: `${pctX}%`,
                          top: `${pctY}%`,
                        }}
                        title={`${f.name} (${f.id})`}
                        onClick={(e) => {
                          e.stopPropagation(); // don't trigger click-to-place coordinates
                          setSelectedFieldId(f.id);
                        }}
                      >
                        {/* Interactive floating label overlay */}
                        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 rounded text-[8px] whitespace-nowrap shadow font-bold tracking-tight pointer-events-none transition-all ${
                          isActive 
                            ? "bg-slate-900 border border-slate-950 text-white translate-y-0 opacity-100 activeScale-110" 
                            : "bg-white text-slate-500 scale-90 translate-y-1 opacity-20 group-hover:opacity-100"
                        }`}>
                          {f.name}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Editing Field Parameters Form */}
            <div className="md:col-span-5 flex flex-col bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <span>⚙️</span> Atributos do Campo Selecionado
              </h3>

              {selectedField ? (
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-[11px] space-y-0.5">
                      <div className="font-extrabold text-[#0B4A34]">Identificador Técnico:</div>
                      <div className="font-mono font-bold text-slate-700 break-words">{selectedField.id}</div>
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="font-bold text-slate-600">Rótulo Amigável:</label>
                      <input
                        type="text"
                        value={selectedField.name}
                        onChange={(e) => handleUpdateFieldProps(selectedField.id, { name: e.target.value })}
                        className="p-2 border border-slate-200 rounded-lg text-slate-800 font-bold bg-slate-50 w-full"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col space-y-1">
                        <label className="font-bold text-slate-600">Posição X (pt):</label>
                        <input
                          type="number"
                          value={selectedField.x}
                          onChange={(e) => handleUpdateFieldProps(selectedField.id, { x: Number(e.target.value) })}
                          className="p-2 border border-slate-200 rounded-lg text-slate-800 font-semibold bg-slate-50"
                        />
                      </div>
                      
                      <div className="flex flex-col space-y-1">
                        <label className="font-bold text-slate-600">Posição Y (pt):</label>
                        <input
                          type="number"
                          value={selectedField.y}
                          onChange={(e) => handleUpdateFieldProps(selectedField.id, { y: Number(e.target.value) })}
                          className="p-2 border border-slate-200 rounded-lg text-slate-800 font-semibold bg-slate-50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col space-y-1">
                        <label className="font-bold text-slate-600">Tamanho Fonte (pt):</label>
                        <input
                          type="number"
                          step="0.5"
                          value={selectedField.fontSize}
                          onChange={(e) => handleUpdateFieldProps(selectedField.id, { fontSize: Number(e.target.value) })}
                          className="p-2 border border-slate-200 rounded-lg text-slate-800 font-semibold bg-slate-50"
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="font-bold text-slate-600">Alinhamento:</label>
                        <select
                          value={selectedField.alignment}
                          onChange={(e) => handleUpdateFieldProps(selectedField.id, { alignment: e.target.value as any })}
                          className="p-2 border border-slate-200 rounded-lg text-slate-800 font-bold bg-slate-50 cursor-pointer"
                        >
                          <option value="left">Esquerda</option>
                          <option value="center">Centro</option>
                          <option value="right">Direita</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="font-bold text-slate-600">Largura Máxima (pt):</label>
                      <input
                        type="number"
                        placeholder="Sem limite"
                        value={selectedField.maxWidth || ""}
                        onChange={(e) => handleUpdateFieldProps(selectedField.id, { maxWidth: e.target.value ? Number(e.target.value) : undefined })}
                        className="p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 font-semibold"
                      />
                    </div>

                    <div className="space-y-2.5 pt-2 border-t border-slate-100">
                      <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={selectedField.hideOriginal}
                          onChange={(e) => handleUpdateFieldProps(selectedField.id, { hideOriginal: e.target.checked })}
                          className="rounded text-[#0B4A34] focus:ring-[#0B4A34] h-4 w-4"
                        />
                        <span>Ocultar Placeholder Underneath?</span>
                      </label>
                      <p className="text-[10px] text-slate-400 pl-6">Limpa o texto anterior desenhando um quadrado branco para não encavalar as chaves do original.</p>

                      <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={selectedField.required}
                          onChange={(e) => handleUpdateFieldProps(selectedField.id, { required: e.target.checked })}
                          className="rounded text-[#0B4A34] focus:ring-[#0B4A34] h-4 w-4"
                        />
                        <span className="text-rose-600 flex items-center gap-1">Campo Obrigatório para Emissão? <AlertTriangle className="h-3.5 w-3.5" /></span>
                      </label>
                      <p className="text-[10px] text-slate-400 pl-6">Exibe alertas na emissão caso os dados de faturamento do titular estejam zerados.</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleDeleteField(selectedField.id)}
                      className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-bold border border-rose-200 cursor-pointer transition-colors flex items-center justify-center gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Excluir Campo
                    </button>
                    
                    <button
                      onClick={() => setSelectedFieldId("")}
                      className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold cursor-pointer transition-colors"
                    >
                      Voltar Lista
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-xl text-slate-400 font-medium space-y-2 border border-dashed border-slate-200">
                  <Sliders className="h-8 w-8 text-slate-300" />
                  <div>Nenhum campo selecionado. Clique em uma tag na lista à esquerda ou em um ponto no papel para começar a mapear as posições X/Y.</div>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* RENDER FICHA DE ADESÃO (FRENTE/VERSO) */}
      {subTab === "ficha" && (
        <FichaContratoView activeClient={activeClient} activeSale={activeSale} />
      )}

      {/* RENDER DYNAMIC GENERATED PDF COORD OVERLAY (CONTRATO COMPLETO A4) */}
      {subTab === "legislativo" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs text-slate-700 items-start">
          
          {/* Information & alerts checks side column */}
          <div className="lg:col-span-4 space-y-4 print:hidden">
            
            {/* Box 1: Parameters settings selector */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
                <Building2 className="h-4.5 w-4.5 text-[#0B4A34]" /> Cobertura do Modelo
              </h3>

              <div className="flex flex-col space-y-1">
                <label className="font-bold text-slate-600">Modelo Oficial Legislativo:</label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="p-2.5 border border-slate-200 outline-none rounded-lg bg-white font-bold cursor-pointer"
                >
                  {enrichedTemplates.map(tpl => (
                    <option key={tpl.id} value={tpl.id}>{tpl.name}</option>
                  ))}
                </select>
              </div>

              {activeSale ? (
                <div className="bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-xl space-y-1.5 text-[11px] text-emerald-900">
                  <div className="font-extrabold flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    Valores Faturados Carregados:
                  </div>
                  <div className="pl-5 space-y-0.5">
                    <div>Plano: <span className="font-extrabold">{activeSale.productName}</span></div>
                    <div>Preço de Outorga: <span className="font-extrabold">{activeSale.totalPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span></div>
                    <div>Entrada / Sinal: <span className="font-extrabold">{activeSale.downPayment.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span></div>
                    <div>Saldo Parcelado: <span className="font-extrabold">{activeSale.installmentsCount} parcelas de {activeSale.installmentValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span></div>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50/40 border border-amber-150 p-3.5 rounded-xl text-amber-800 space-y-1">
                  <div className="font-extrabold flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" /> Restrição Comercial:
                  </div>
                  <p className="leading-relaxed">Nenhum faturamento comercial cadastrado para este titular. Os parâmetros financeiros virão em branco ou simulados.</p>
                </div>
              )}
            </div>

            {/* Box 2: Required validation alerts */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
                <span>⚠️</span> Verificação de Campos Obrigatórios
              </h3>

              {validationAlerts.length === 0 ? (
                <div className="bg-emerald-50 text-emerald-800 font-bold p-3 rounded-lg flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                  Todos os campos obrigatórios estão validados!
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="bg-rose-50 text-rose-800 font-extrabold p-3 rounded-lg flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                    Campos em Branco ({validationAlerts.length})
                  </div>
                  <p className="text-[10px] text-slate-400">Preencha os dados do proponente antes de salvar ou baixar para não quebrar.</p>
                  <div className="font-mono text-[9px] bg-slate-50 border border-slate-200 rounded p-2 text-rose-700 max-h-36 overflow-y-auto space-y-1">
                    {validationAlerts.map((ph, idx) => (
                      <div key={idx}>• {ph}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Live HTML PDF output view */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            
            {/* Top Toolbar actions */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3 print:hidden">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">Preview Oficial de Concessão de Uso (PDF)</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 font-bold border border-slate-205 rounded-lg hover:bg-slate-50 flex items-center gap-1 bg-white cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" /> Imprimir
                </button>
                
                <button
                  onClick={handleDownloadPdfFile}
                  className="px-3.5 py-1.5 font-extrabold bg-[#0B4A34] text-white rounded-lg hover:bg-[#073324] flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                >
                  <FileDown className="h-3.5 w-3.5 text-white" /> Baixar Contrato preenchido
                </button>
              </div>
            </div>

            {/* DYNAMIC PDF ELEMENT FRAME CONTAINER */}
            <div className="bg-slate-700/10 p-4 rounded-2xl border border-slate-200/70 overflow-hidden flex justify-center">
              {pdfLoading ? (
                <div className="flex flex-col items-center justify-center p-32 space-y-3 bg-white w-full rounded-xl border">
                  <RefreshCw className="h-10 w-10 text-[#0B4A34] animate-spin" />
                  <span className="text-xs text-slate-500 font-extrabold uppercase animate-pulse">Preenchendo Modelo e Gerando PDF em Alta Definição...</span>
                </div>
              ) : pdfError ? (
                <div className="p-16 text-center text-rose-700 bg-white min-h-[300px] rounded-xl border w-full flex flex-col items-center justify-center space-y-2">
                  <AlertTriangle className="h-10 w-10" />
                  <div className="font-bold">Ocorreu um erro ao processar o PDF.</div>
                  <pre className="text-[10px] bg-slate-50 p-2 rounded max-w-md overflow-x-auto text-left leading-normal">{pdfError}</pre>
                </div>
              ) : pdfDataUri ? (
                <div className="w-full space-y-2">
                  <iframe
                    src={pdfDataUri}
                    className="w-full h-[680px] rounded-xl shadow-2xl border border-slate-350 bg-[#525659]"
                    title="Lagoa Lovers Official Generator PDF"
                  />
                  <div className="text-center text-[10px] text-slate-400 font-medium">Visualizador nativo do navegador. Você pode usá-lo para rolar páginas ou imprimir diretamente do controle de PDF.</div>
                </div>
              ) : (
                <div className="p-16 text-center text-slate-400 bg-white min-h-[300px] rounded-xl border w-full flex items-center justify-center">
                  Aguardando faturamento...
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
