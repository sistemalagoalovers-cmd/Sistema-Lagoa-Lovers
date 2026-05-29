/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Product,
  SystemUser,
  UserRole,
  ReceptionRecord,
  AtendimentoRecord,
  SalesRecord,
  ContractTemplate,
  ContractRecord,
  RelationType,
  CoupleSource,
  LodgingPlace,
  CaptationPlace,
  AttendanceStatus,
  PaymentMethod,
  NegotiationStatus,
  SaleStatus
} from "./types";

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "PROD-001",
    name: "TÍTULO VITALÍCIO FAMILIAR",
    basePrice: 9600,
    active: true,
    benefits: [
      "Título familiar vitalício",
      "Inclusão do Titular + cônjuge",
      "Inclusão de pai, mãe, sogro, sogra e filhos até 24 anos",
      "2 convites mensais, não cumulativos, após quitação do título",
      "8 diárias para utilizar com família ou convidados, conforme regulamento",
      "1ª anuidade de carteirinhas grátis para titular e agregados",
      "50% de desconto no estacionamento do parque",
      "10% de desconto no Réveillon"
    ],
    plansByMethod: {
      [PaymentMethod.A_VISTA]: {
        paymentMethod: PaymentMethod.A_VISTA,
        totalPrice: 9600,
        downPayment: 9600,
        installmentsCount: 1,
        installmentValue: 0
      },
      [PaymentMethod.ENTRADA_PARCELAS]: {
        paymentMethod: PaymentMethod.ENTRADA_PARCELAS,
        totalPrice: 9600,
        downPayment: 1371.84,
        installmentsCount: 30,
        installmentValue: 274.27
      }
    }
  },
  {
    id: "PROD-002",
    name: "TÍTULO FAMILIAR VITALÍCIO REMIDO",
    basePrice: 18000,
    active: true,
    benefits: [
      "Isento de taxa de manutenção mensal para sempre",
      "Inclusão do Titular + cônjuge",
      "Inclusão de filhos até 21 anos ou até 24 anos cursando faculdade",
      "Inclusão de pai, mãe, sogro e sogra",
      "2 convites mensais, não cumulativos, após quitação do título",
      "50% de desconto no estacionamento",
      "10% de desconto no Réveillon",
      "12 diárias de hospedagem fracionadas em até 3 vezes (domingo a quinta, exceto férias/feriados)",
      "Diárias de boas-vindas com utilização única"
    ],
    plansByMethod: {
      [PaymentMethod.CARTAO_DIRETO]: {
        paymentMethod: PaymentMethod.CARTAO_DIRETO,
        totalPrice: 18000,
        downPayment: 0,
        installmentsCount: 12,
        installmentValue: 1500
      },
      [PaymentMethod.CREDITO_RECORRENTE]: {
        paymentMethod: PaymentMethod.CREDITO_RECORRENTE,
        totalPrice: 18900,
        downPayment: 2835.00,
        installmentsCount: 30,
        installmentValue: 535.50
      },
      [PaymentMethod.BOLETO]: {
        paymentMethod: PaymentMethod.BOLETO,
        totalPrice: 20700,
        downPayment: 3105.00,
        installmentsCount: 30,
        installmentValue: 586.50
      }
    }
  },
  {
    id: "PROD-003",
    name: "TÍTULO SOCIAL VITALÍCIO 1 PESSOA",
    basePrice: 2526.30,
    active: true,
    benefits: [
      "1º ano de carteirinha grátis para o titular",
      "2 convites mensais depois do título quitado, não cumulativos",
      "50% de desconto no estacionamento",
      "4 diárias de hospedagem (domingo a quinta, exceto férias/feriados)",
      "Diárias de boas-vindas com utilização única"
    ],
    plansByMethod: {
      [PaymentMethod.A_VISTA]: {
        paymentMethod: PaymentMethod.A_VISTA,
        totalPrice: 2526.30,
        downPayment: 2526.30,
        installmentsCount: 1,
        installmentValue: 0
      },
      [PaymentMethod.CARTAO_DIRETO]: {
        paymentMethod: PaymentMethod.CARTAO_DIRETO,
        totalPrice: 2666.65,
        downPayment: 0,
        installmentsCount: 12,
        installmentValue: 222.22
      },
      [PaymentMethod.CREDITO_RECORRENTE]: {
        paymentMethod: PaymentMethod.CREDITO_RECORRENTE,
        totalPrice: 2807.00,
        downPayment: 401.00,
        installmentsCount: 30,
        installmentValue: 80.20
      },
      [PaymentMethod.BOLETO]: {
        paymentMethod: PaymentMethod.BOLETO,
        totalPrice: 3087.70,
        downPayment: 441.10,
        installmentsCount: 30,
        installmentValue: 88.22
      }
    }
  },
  {
    id: "PROD-004",
    name: "TÍTULO SOCIAL VITALÍCIO 2 PESSOAS",
    basePrice: 4421.00,
    active: true,
    benefits: [
      "1º ano de carteirinha grátis",
      "2 convites mensais após título quitado, não cumulativos",
      "50% de desconto no estacionamento",
      "4 diárias de hospedagem (domingo a quinta, exceto férias/feriados)",
      "Diárias de boas-vindas com utilização única"
    ],
    plansByMethod: {
      [PaymentMethod.A_VISTA]: {
        paymentMethod: PaymentMethod.A_VISTA,
        totalPrice: 4421.00,
        downPayment: 4421.00,
        installmentsCount: 1,
        installmentValue: 0
      },
      [PaymentMethod.CARTAO_DIRETO]: {
        paymentMethod: PaymentMethod.CARTAO_DIRETO,
        totalPrice: 4667.35,
        downPayment: 0,
        installmentsCount: 12,
        installmentValue: 388.94
      },
      [PaymentMethod.CREDITO_RECORRENTE]: {
        paymentMethod: PaymentMethod.CREDITO_RECORRENTE,
        totalPrice: 4913.00,
        downPayment: 701.86,
        installmentsCount: 30,
        installmentValue: 140.37
      },
      [PaymentMethod.BOLETO]: {
        paymentMethod: PaymentMethod.BOLETO,
        totalPrice: 5404.30,
        downPayment: 772.04,
        installmentsCount: 30,
        installmentValue: 154.41
      }
    }
  },
  {
    id: "PROD-005",
    name: "TÍTULO SOCIAL VITALÍCIO 3 PESSOAS",
    basePrice: 6317.10,
    active: true,
    benefits: [
      "1º ano de carteirinha grátis",
      "2 convites mensais após quitação do título, não cumulativos",
      "50% de desconto no estacionamento",
      "4 diárias de hospedagem (domingo a quinta, exceto férias/feriados)",
      "Diárias de boas-vindas com utilização única"
    ],
    plansByMethod: {
      [PaymentMethod.A_VISTA]: {
        paymentMethod: PaymentMethod.A_VISTA,
        totalPrice: 6317.10,
        downPayment: 6317.10,
        installmentsCount: 1,
        installmentValue: 0
      },
      [PaymentMethod.CARTAO_DIRETO]: {
        paymentMethod: PaymentMethod.CARTAO_DIRETO,
        totalPrice: 6668.05,
        downPayment: 0,
        installmentsCount: 12,
        installmentValue: 555.67
      },
      [PaymentMethod.CREDITO_RECORRENTE]: {
        paymentMethod: PaymentMethod.CREDITO_RECORRENTE,
        totalPrice: 7019.00,
        downPayment: 1002.71,
        installmentsCount: 30,
        installmentValue: 200.54
      },
      [PaymentMethod.BOLETO]: {
        paymentMethod: PaymentMethod.BOLETO,
        totalPrice: 7720.90,
        downPayment: 1102.98,
        installmentsCount: 30,
        installmentValue: 220.59
      }
    }
  },
  {
    id: "PROD-006",
    name: "TÍTULO SOCIAL VITALÍCIO 4 PESSOAS",
    basePrice: 7520.40,
    active: true,
    benefits: [
      "1º ano de carteirinha grátis",
      "2 convites mensais após quitação do título, não cumulativos",
      "50% de desconto no estacionamento",
      "4 diárias de hospedagem (domingo a quinta, exceto férias/feriados)",
      "Diárias de boas-vindas com utilização única"
    ],
    plansByMethod: {
      [PaymentMethod.A_VISTA]: {
        paymentMethod: PaymentMethod.A_VISTA,
        totalPrice: 7520.40,
        downPayment: 7520.40,
        installmentsCount: 1,
        installmentValue: 0
      },
      [PaymentMethod.CARTAO_DIRETO]: {
        paymentMethod: PaymentMethod.CARTAO_DIRETO,
        totalPrice: 7958.20,
        downPayment: 0,
        installmentsCount: 12,
        installmentValue: 663.18
      },
      [PaymentMethod.CREDITO_RECORRENTE]: {
        paymentMethod: PaymentMethod.CREDITO_RECORRENTE,
        totalPrice: 8356.00,
        downPayment: 1193.71,
        installmentsCount: 30,
        installmentValue: 238.74
      },
      [PaymentMethod.BOLETO]: {
        paymentMethod: PaymentMethod.BOLETO,
        totalPrice: 9191.60,
        downPayment: 1313.08,
        installmentsCount: 30,
        installmentValue: 262.61
      }
    }
  },
  {
    id: "PROD-007",
    name: "TÍTULO SOCIAL VITALÍCIO 5 PESSOAS",
    basePrice: 8442.20,
    active: true,
    benefits: [
      "1º ano de carteirinha grátis",
      "2 convites mensais após quitação do título, não cumulativos",
      "50% de desconto no estacionamento",
      "6 diárias de hospedagem (domingo a quinta, exceto férias/feriados)",
      "Diárias de boas-vindas com utilização única"
    ],
    plansByMethod: {
      [PaymentMethod.A_VISTA]: {
        paymentMethod: PaymentMethod.A_VISTA,
        totalPrice: 8442.20,
        downPayment: 8442.20,
        installmentsCount: 1,
        installmentValue: 0
      },
      [PaymentMethod.CARTAO_DIRETO]: {
        paymentMethod: PaymentMethod.CARTAO_DIRETO,
        totalPrice: 8890.10,
        downPayment: 0,
        installmentsCount: 12,
        installmentValue: 740.84
      },
      [PaymentMethod.CREDITO_RECORRENTE]: {
        paymentMethod: PaymentMethod.CREDITO_RECORRENTE,
        totalPrice: 9358.00,
        downPayment: 1336.86,
        installmentsCount: 30,
        installmentValue: 267.37
      },
      [PaymentMethod.BOLETO]: {
        paymentMethod: PaymentMethod.BOLETO,
        totalPrice: 10293.80,
        downPayment: 1470.54,
        installmentsCount: 30,
        installmentValue: 294.10
      }
    }
  },
  {
    id: "PROD-008",
    name: "TÍTULO SOCIAL VITALÍCIO 6 PESSOAS",
    basePrice: 8843.40,
    active: true,
    benefits: [
      "1º ano de carteirinha grátis",
      "2 convites mensais após quitação do título, não cumulativos",
      "50% de desconto no estacionamento",
      "6 diárias de hospedagem (domingo a quinta, exceto férias/feriados)",
      "Diárias de boas-vindas com utilização única"
    ],
    plansByMethod: {
      [PaymentMethod.A_VISTA]: {
        paymentMethod: PaymentMethod.A_VISTA,
        totalPrice: 8843.40,
        downPayment: 8843.40,
        installmentsCount: 1,
        installmentValue: 0
      },
      [PaymentMethod.CARTAO_DIRETO]: {
        paymentMethod: PaymentMethod.CARTAO_DIRETO,
        totalPrice: 9334.70,
        downPayment: 0,
        installmentsCount: 12,
        installmentValue: 777.89
      },
      [PaymentMethod.CREDITO_RECORRENTE]: {
        paymentMethod: PaymentMethod.CREDITO_RECORRENTE,
        totalPrice: 9826.00,
        downPayment: 1403.70,
        installmentsCount: 30,
        installmentValue: 280.74
      },
      [PaymentMethod.BOLETO]: {
        paymentMethod: PaymentMethod.BOLETO,
        totalPrice: 10808.60,
        downPayment: 1544.80,
        installmentsCount: 30,
        installmentValue: 308.81
      }
    }
  }
];

export const INITIAL_USERS: SystemUser[] = [
  { id: "USER-001", name: "Carlos Silva (Admin)", email: "admin@lagoalovers.com", role: UserRole.ADMIN, active: true },
  { id: "USER-002", name: "Roberta Costa (Recepção)", email: "recepcao@lagoalovers.com", role: UserRole.RECEPCAO, active: true },
  { id: "USER-003", name: "Marcos Oliveira", email: "marcos@lagoalovers.com", role: UserRole.CORRETOR, active: true },
  { id: "USER-004", name: "Fernando Souza", email: "fernando@lagoalovers.com", role: UserRole.CORRETOR, active: true },
  { id: "USER-005", name: "Amanda Souza (Gerente)", email: "gerente@lagoalovers.com", role: UserRole.GERENTE, active: true },
  { id: "USER-006", name: "Flávia Santos (Financeiro)", email: "financeiro@lagoalovers.com", role: UserRole.FINANCEIRO, active: true },
];

export const CONTRACT_TEMPLATES: ContractTemplate[] = [
  {
    id: "TEMP-001",
    name: "Cessão de Direito de Uso - TÍTULO FAMILIAR VITALÍCIO",
    productId: "PROD-001",
    fileName: "contrato_familiar_vitalicio.docx",
    placeholders: [
      "[VENDACONTRATONUMERO]", "[VENDAANO]", "[VENDADIA]", "[VENDAMES]",
      "[VENDAPESSOA1NOME]", "[VENDAPESSOA1NACIONALIDADE]", "[VENDAPESSOA1ESTADOCIVIL]",
      "[VENDAPESSOA1PROFISSAO]", "[VENDAPESSOA1RG]", "[VENDAPESSOA1CPF]",
      "[VENDAPESSOA1ENDERECO]", "[VENDAPESSOA1NUMEROENDERECO]", "[VENDAPESSOA1BAIRRO]",
      "[VENDAPESSOA1CEP]", "[VENDAPESSOA1CIDADE]", "[VENDAPESSOA1ESTADO]",
      "[ATENDIMENTOPESSOA1ACOMPANHANTE1]", "[VENDAVALORFINANCIADO]",
      "[VENDAVALORFINANCIADOEXTENSO]", "[PARCELATIPOPARCELA1]", "[PARCELAQUANTIDADE1]",
      "[PARCELAVALOR1]", "[PARCELAVENCIMENTO1]", "[PARCELADETALHE1]",
      "[PARCELATIPOPARCELA2]", "[PARCELAQUANTIDADE2]", "[PARCELAVALOR2]",
      "[PARCELAVENCIMENTO2]", "[PARCELADETALHE2]", "[VENDAVALORSALDORESTANTE]"
    ],
    content: `---PAGE_BREAK---
# INSTRUMENTO PARTICULAR DE CESSÃO DE DIREITO DE USO
## TÍTULO FAMILIAR VITALÍCIO Nº [VENDACONTRATONUMERO]/[VENDAANO]

### ASSOCIAÇÃO
LAGOA THERMAS CLUBE, TURISMO, LAZER E ECOLOGIA, associação privada sem fins lucrativos, regida pela legislação vigente e seu Estatuto Social, inscrita no CNPJ sob o nº 05.620.609/0001-87, estabelecida à Avenida Lagoa Quente, s/n, Bairro Lagoa Quente, em Caldas Novas – GO, CEP 75.692-580, representada neste ato nos termos de seus Atos Constitutivos ou por seu representante legal devidamente constituído.

### ADERENTE
**[VENDAPESSOA1NOME]**, [VENDAPESSOA1NACIONALIDADE], [VENDAPESSOA1ESTADOCIVIL], [VENDAPESSOA1PROFISSAO], R.G. nº [VENDAPESSOA1RG] e CPF/MF nº [VENDAPESSOA1CPF]. Residente e domiciliado à [VENDAPESSOA1ENDERECO] , [VENDAPESSOA1NUMEROENDERECO], [VENDAPESSOA1BAIRRO], CEP [VENDAPESSOA1CEP], [VENDAPESSOA1CIDADE], [VENDAPESSOA1ESTADO].

O presente Termo de Adesão confere ao(à) ADERENTE e seus BENEFICIÁRIOS o direito de utilizar as dependências dos complexos de lazer **Lagoa Termas Parque** e **Lagoa Eco Praia (Parques)**, assim como o ambiente denominado “Rio Lento” por período vitalício, consoante as regras de utilização, preço de aquisição e taxa de emissão de carteira de acesso (emissão e renovação) abaixo descritas e quando aplicáveis, celebrado entre as partes ora qualificadas, conforme as cláusulas e condições constantes deste instrumento e seus eventuais anexos.

---

Para usufruir dos benefícios do Título adquirido, o(a) ADERENTE indica, como BENEFICIÁRIOS:

| | NOME | CPF |
|---|---|---|
| 1 | [VENDAPESSOA1NOME] | [VENDAPESSOA1CPF] |
| 2 | [ATENDIMENTOPESSOA1ACOMPANHANTE1] | |

---

### CONDIÇÕES DE PAGAMENTO
O valor da presente transação é feito pelo preço total de **[VENDAVALORFINANCIADO] ([VENDAVALORFINANCIADOEXTENSO])**, que serão pagos conforme condições abaixo delineadas:

| Qntd. Parcela | Valor | Vencimento | Tipo de Pagamento |
|---|---|---|---|
| ([PARCELATIPOPARCELA1]) - [PARCELAQUANTIDADE1] | [PARCELAVALOR1] | [PARCELAVENCIMENTO1] | [PARCELADETALHE1] |
| ([PARCELATIPOPARCELA2]) - [PARCELAQUANTIDADE2] | [PARCELAVALOR2] | [PARCELAVENCIMENTO2] | [PARCELADETALHE2] |
| Saldo Restante | [VENDAVALORSALDORESTANTE] | | |

* **Emissão - Taxa de Emissão da Carteira de Acesso:** R$ 00,00  
* **Renovação - Taxa Anual de Emissão de Carteira de Acesso:** conforme tabela de precificação vigente à época.

Estou ciente e de acordo com o plano de pagamento assinalado nesta página em relação à aquisição do “TÍTULO FAMILIAR VITALÍCIO” e a adesão de eventuais BENEFICIÁRIOS, assim como com as condições de pagamento aplicáveis.

---PAGE_BREAK---
### ( ) OPÇÃO DE PAGAMENTO ATRAVÉS DE BOLETO BANCÁRIO
Autorizo a cobrança do valor de R$ ___________________ (________________________) através da emissão de Boletos Bancários divididos em ___(_______) parcelas de R$ ___________________ (________________________) tendo a 1ª parcela emitida no dia __/__/___ e as demais parcelas com vencimento no mesmo dia dos meses subsequentes. Autorizo ainda que esta opção de pagamento seja utilizada para a cobrança de eventuais taxas, como para emissão e renovação da carteira de acesso, nos prazos, preços e condições previstas neste contrato.

### ( ) OPÇÃO DE PAGAMENTO ATRAVÉS DE CARTÃO DE CRÉDITO OU CRÉDITO RECORRENTE
Eu, _____________________________________________________________________ CPF __________________________, autorizo a cobrança do valor acima descrito no cartão de crédito de minha titularidade, dados:  
**Cartão nº** ________________________________, **Bandeira:** ( ) Visa / ( ) Mastercard / ( ) Elo / ( ) Outras (_________________________)  
**Validade (mês/ano):** _________  

Na condição de titular do Cartão de Crédito indicado, autorizo a cobrança do valor de R$ ___________________ (________________________) divididos em ____(____________) a ser debitada a 1ª parcela no dia ___/_____________/________ e as demais parcelas com vencimento no mesmo dia dos meses subsequentes. Autorizo ainda que esta opção de pagamento seja utilizada para a cobrança de eventuais taxas, como para emissão e renovação da carteira de acesso, nos prazos, preços e condições previstas neste contrato.

---

________________________________________             ____________________________________________
**Assinatura do titular do cartão**                   **Assinatura do(a) Aderente [VENDAPESSOA1NOME]**

---

## CONDIÇÕES CONTRATUAIS

### 1. OBJETO CONTRATUAL
**1.1.** O presente contrato tem por objeto a aquisição do **“TÍTULO FAMILIAR VITALÍCIO”** indicado no preâmbulo deste instrumento, através do qual o(a) **ADERENTE** se torna detentor do direito de acesso e fruição das instalações e atrações dos complexos de lazer *Lagoa Termas Parque* e *Lagoa Eco Praia*, bem como do ambiente denominado *“Rio Lento”* sob administração da **ASSOCIAÇÃO**, que dá direito a si e seu(s) **BENEFICIÁRIO(S)** a ingressarem nas dependências dos complexos de lazer (parques e Rio Lento), nos dias e horários em que estiver aberto ao público, podendo fazer uso de suas instalações, atrações recreativas ao público e equipamentos aquáticos, desde que adimplentes em suas obrigações.

**1.1.1.** São características específicas do Título, bem como benefícios e vantagens:
* **a) Beneficiários ilimitados:** Respeitado o grau de parentesco comprovado com o(a) **ADERENTE**, limitando-se a cônjuge ou companheira(o), pai, mãe, sogros e filhos solteiros com idade até 21 (vinte e um) anos, ou até 24 (vinte e quatro) anos desde que cursando graduação, devidamente comprovada;
* **b) 08 (oito) diárias:** Conforme descrito no item 1.1.1.1, abaixo;
* **c) 02 (dois) acessos extras (não cumulativos):** Os 02 (dois) acessos mensais extras (não cumulativos) estarão disponíveis a partir da quitação integral do contrato e deverão ser retirados de forma presencial e exclusivamente pelo ADERENTE;
* **d) Carteira de Acesso:** A emissão da carteira de acesso será cobrada conforme estabelecido no preâmbulo. Em todo caso, será devida a Taxa Anual de Emissão (Renovação), independentemente de uso pelo ADERENTE e/ou BENEFICIÁRIOS.

---PAGE_BREAK---
* **d.1)** A Taxa Anual de Emissão (Renovação) da carteira de acesso será parcelada em 03 (três) vezes no cartão de crédito ou recorrente conforme autorização desde já concedida pelo ADERENTE e reafirmada no preâmbulo deste instrumento.
* **e) Estacionamento:** Apresentando a Carteira de Acesso válida, terá direito a desconto de 50% (cinquenta por cento) sobre o valor do estacionamento. Desconto concedido na portaria do estacionamento;
* **f) Ingressos Réveillon:** Limitado ao número de Usuários (Aderente + Beneficiários), que terão até 10% (dez por cento) de desconto na compra do ingresso para o Réveillon.
* **g) Beneficiários agregados:** Além do número de beneficiários já permitido para este plano, o(a) ADERENTE poderá adquirir até 02 (duas) posições adicionais chamadas de “Beneficiários Agregados”, mediante pagamento do valor equivalente a cada posição, conforme tabela vigente à época da aquisição, em até 10 (dez) parcelas mensais no cartão de crédito.
* **g.1)** Salvo disposição em contrário, os Beneficiários Agregados – quanto e se tais posições forem adquiridas terão os mesmos direitos e deveres atribuídos aos BENEFICIÁRIOS, nos termos deste instrumento.

**1.1.1.1.** Para utilização das 08 (oito) diárias a que se refere o item 1.1.1, “b”, acima, o ADERENTE e seus BENEFICIÁRIOS devem se atentar as seguintes condições:
* **a)** Utilizável ao longo de 02 (dois) períodos de 04 (quatro) dias cada. As diárias disponíveis são entre Domingo e Quinta-feira;
* **b)** A utilização estará condicionada à disponibilidade de vagas nos empreendimentos “EcoTowers” e/ou “Jardins da Lagoa”, e são limitadas ao período considerado de “baixa temporada”;
* **c)** As diárias disponibilizadas, conforme este item, não incluem alimentação;
* **d)** O imóvel disponibilizado para uso das diárias aqui descritas terá capacidade para até 06 (seis) pessoas, independentemente da idade;
* **e)** As diárias somente poderão ser usufruídas pelos BENEFICIÁRIOS, quando acompanhados pelo(a) ADERENTE, sendo intransferíveis para terceiros, ainda que familiares não qualificados como BENEFICIÁRIOS;
* **f)** Para utilização dos pacotes de hospedagem o ADERENTE deverá ter integralização mínima:
  * **a.** Para o primeiro pacote de hospedagem: 40% (quarenta por cento) do valor do contrato.
  * **b.** Para o segundo pacote de hospedagem: 60% (sessenta por cento) do valor do contrato.
* **g)** Estas Diárias deverão ser utilizadas dentro do período de até 24 (vinte e quatro) meses contados da data de assinatura deste instrumento.

**1.2.** O direito de acesso ora concedido limita-se exclusivamente aos parques *Lagoa Termas Parque* e *Lagoa Eco Praia*, bem como ao ambiente denominado *Rio Lento*, não sendo extensível a quaisquer outras áreas ou atrações já criadas e/ou que venham a ser criadas pela **ASSOCIAÇÃO**.

**1.3.** O(A) ADERENTE supra qualificado(a), de livre arbítrio, firma com a ASSOCIAÇÃO a aquisição do “TÍTULO” por prazo vitalício, para uso de suas instalações de lazer, em caráter pessoal, irrevogável e irretratável.

**1.4.** A natureza de “Título Familiar Vitalício” não confere ao(à) ADERENTE e aos seus BENEFICIÁRIOS o poder de voto, deliberação e gerência em relação à ASSOCIAÇÃO ou aos Parques.

**1.5.** A ASSOCIAÇÃO, em razão de sua natureza associativa, atua sem fins lucrativos, visando promover o interesse coletivo e o bem-estar de seus associados, motivo pelo qual não se aplica o Código de Defesa do Consumidor (CDC), uma vez que sua destinação é voltada ao cumprimento de seus objetivos sociais e não para a prestação de serviços típicos de consumo.

### 2. BENEFICIÁRIOS
**2.1. Familiar Vitalício.** O “TÍTULO” concederá em favor do(s) BENEFICIÁRIO(S) os mesmos benefícios atribuídos ao(à) ADERENTE, observado o disposto no item 1.1.1.1, “e”, os quais devem ter grau de parentesco comprovado com o titular, mediante apresentação de documentos.

---PAGE_BREAK---
apresentação de documentos pessoais, limitando-se a cônjuge ou companheira(o), pai, mãe, sogros e filhos solteiros com idade até 21 (vinte e um) anos ou, até 24 (vinte e quatro) anos, desde que estejam cursando faculdade e seja devidamente comprovado, os quais serão cadastrados para fazerem jus ao direito de acesso às dependências dos complexos de lazer (parques e Rio Lento) mediante apresentação da Carteira de Acesso (“Carteira”) a ser emitida.

**2.2.** No ato de cada substituição / exclusão / troca de BENEFICIÁRIO(S), o que será permitido tão somente nos termos dispostos neste instrumento, será devido o custo de emissão da respectiva Carteirinha individual, conforme tabela de precificação vigente no momento da requisição. ADERENTE e BENEFICIÁRIO(S) serão designados doravante, quando em conjunto, como “USUÁRIOS”.

**2.2.1.** A substituição/troca de Beneficiários “Agregados”, quando tais posições forem adquiridas pelo ADERENTE, só será permitida a cada período de 36 (trinta seis) meses, contados da inclusão do(s) beneficiário(s) anterior(es) que estiver(em) sendo substituído. Para tanto, o ADERENTE deverá estar adimplente com as obrigações deste instrumento, assim como realizar o pagamento da emissão da Carteira de Acesso nos termos acima descritos.

### 3. DA UTILIZAÇÃO DAS DEPENDÊNCIAS DOS PARQUES
**3.1.** O “TÍTULO” adquirido não contempla gratuidade ou isenção em atividades consideradas extraordinárias, as quais estarão sujeitas à cobrança adicional (p.ex.: alimentação, bebidas, locação de espaço para eventos, utilização de bangalôs, quadras esportivas, shows artísticos, produtos e serviços oferecidos nos bares e restaurantes ou pelo próprio parque, dentre outras), assim como de estabelecimentos parceiros porventura instalados nas dependências da ASSOCIAÇÃO.

**3.1.1.** A ASSOCIAÇÃO poderá, sem que isto configure uma obrigação, oferecer por si ou através de relacionamento com parceiros, descontos e condições especiais para alimentação e bebida, além de eventos e experiências especialmente pensadas para o(a)(s) ADERENTE(S). A concessão de descontos e condições especiais durará por tempo determinado e poderá ser cancelada sem a necessidade de comunicação prévia, não gerando qualquer espécie de direito adquirido ou cumulatividade.

**3.2.** A ASSOCIAÇÃO confere ao(à) ADERENTE o direito de utilizar os Parques e Rio Lento nos termos das cláusulas a seguir e conforme as normativas próprias da associação, tratadas no item 07. A ASSOCIAÇÃO reserva-se ao direito de, a qualquer momento, alterar os dias de funcionamento do parque sem necessidade de prévia comunicação ao(à) ADERENTE, bem como tornar indisponíveis atrações, por motivo de reforma, manutenção preventiva e corretiva, visando assegurar a segurança e a qualidade dos serviços prestados. Dias e horários de funcionamento poderão ser consultados nos canais de comunicação da ASSOCIAÇÃO.

**3.3.** O direito de utilizar os Parques não compreende a compra ou promessa de compra e venda da propriedade, do todo ou em parte, nem na venda de títulos patrimoniais ou não.

### 4. DO PRAZO
**4.1.** O prazo de vigência deste contrato é de tempo indeterminado, em razão do caráter vitalício do Título adquirido, desde que o(a) ADERENTE tenha quitado integralmente o valor do presente contrato e esteja honrando com os pagamentos da(s) Taxa(s) devida(s), especialmente a Taxa de Emissão da Carteira de Acesso (Renovação), quando aplicável, além de estar em estrito cumprimento quanto às normas e regulamentações internas da ASSOCIAÇÃO.

### 5. DOS VALORES CONTRATADOS E CONDIÇÕES DE PAGAMENTO
**5.1.** Os valores deste contrato e suas condições de pagamento estão especificados no preâmbulo deste instrumento, e as partes declaram pleno conhecimento e concordância com o seu conteúdo.

**5.2.** Além disso, o(a) ADERENTE se compromete a manter os dados do cartão de crédito atualizados perante a ASSOCIAÇÃO, em quaisquer circunstâncias de substituição, tais como: perda, roubo, troca, validade vencida, solicitação de segunda via, ou qualquer situação.

---PAGE_BREAK---
qualquer situação que dificulte ou impossibilite a continuidade da operação até que se conclua o pagamento integral. Compromete-se, ainda, a manter saldo suficiente no cartão de crédito para acolher os referidos débitos.

**5.3.** Além do valor relativo ao contrato, referente ao preço de aquisição do título, o(a) ADERENTE deverá arcar obrigatoriamente, conforme disposto no preâmbulo, com a **(i)** Taxa de Emissão de Carteira de Acesso; **(ii)** Renovação - Taxa Anual de Emissão de Carteira de Acesso cobrada a cada ano aniversário do contrato, contado a partir de sua assinatura, a ser paga pelo(s) ADERENTE / BENEFICIÁRIO(S), no valor estipulado na tabela de precificação vigente à época da renovação. O valor relativo a tais taxas poderá ser reajustado anualmente, com base na variação do Indicador Geral de Preços do Mercado (IGP-M/FGV), independentemente de qualquer notificação ou aviso extra; **(iii)** Comissão de Intermediação a ser paga diretamente à ASSOCIAÇÃO.

**5.4.** O atraso no pagamento de qualquer valor previsto neste contrato, incluindo-se a(s) Taxa(s), implicará na imposição de multa moratória de 10% (dez por cento), juros moratórios de 1% (um por cento) ao mês e atualização monetária calculada de acordo com a variação positiva do IGP-M/FGV, incidente desde a data de vencimento da obrigação e até a de seu pagamento, além de honorários advocatícios de 20% (vinte por cento) sobre o valor do débito em atraso em caso de cobrança judicial ou extrajudicial.

**5.4.1.** A ASSOCIAÇÃO poderá, ainda, promover a negativação do nome do(a) ADERENTE perante os órgãos de proteção ao crédito.

### 6. DA SUSPENSÃO, CANCELAMENTO E TOLERÂNCIA

**6.1. Suspensão.** Considerar-se-á suspenso o direito de acesso concedido através da aquisição deste título ante **(i)** a inadimplência de 01 (uma) parcela do preço de aquisição estabelecido no preâmbulo, ressalvado prazo de tolerância de 01 (um) dia após o vencimento; **(ii)** o não pagamento de quaisquer Taxas previstas neste instrumento.

**6.1.1.** A suspensão se estenderá durante a vigência contratual, a partir da data seguinte ao vencimento da parcela / taxa inadimplida, período em que o(a) ADERENTE e/ou o(s) BENEFICIÁRIO(S) terão a oportunidade de regularizar sua inadimplência, pagando a(s) parcela(s) e/ou taxa(s) em atraso, devidamente atualizada pelo IGPM-FGV, além dos demais encargos devidos.

**6.1.2.** Decorridos 60 (sessenta) dias de suspensão, a ASSOCIAÇÃO poderá optar pela rescisão deste instrumento, sem prejuízo da cobrança das parcelas ou taxas que estiverem em atraso, bem como dos encargos aplicados em razão da mora. Neste caso, não haverá restituição de valores pagos, uma vez que o direito de uso esteve disponível durante o período de regularidade contratual.

**6.2. Cancelamento.** A ASSOCIAÇÃO se reserva ao direito de cancelar a validade da Carteira de Acesso dos USUÁRIOS quando estes, no uso e gozo de seus direitos, atentarem contra os instrumentos normativos (item 7), colocarem em risco sua segurança ou de outros na utilização dos equipamentos; nos casos de inobservância das normas vigentes no estabelecimento da ASSOCIAÇÃO; nos casos que atentarem contra o pudor; comportamento inadequado; bem como os que afrontem a moral e aos bons costumes; ou que fraudem ou que venham a fraudar os sistemas de admissão e controle da ASSOCIAÇÃO.

**6.2.1.** Caso o ato praticado pelo(s) USUÁRIO(S) represente alto grau de repúdio e ataque a preceitos éticos, morais e de urbanidade, a ASSOCIAÇÃO poderá banir o responsável por qualquer meio de acesso às dependências dos parques ou de outras unidades do Grupo Lagoa.

**6.2.2.** Fica também estabelecido, de acordo com as normas da ASSOCIAÇÃO, que não é permitido o ingresso nos parques e Rio Lento com alimentos e bebidas de qualquer espécie, instrumentos musicais e equipamentos de som, ou qualquer tipo de equipamento que possa vir perturbar o ambiente e o bem-estar das demais pessoas. Sendo que, a ASSOCIAÇÃO reserva-se o direito de em caso de perturbação e/ou mau procedimento, realizar o cancelamento do “TÍTULO” dos USUÁRIOS e/ou BENEFICIÁRIO(S), bem como solicitar sua imediata retirada das dependências dos Parques / Rio Lento.

---PAGE_BREAK---
**6.2.3.** O cancelamento nas hipóteses previstas nesta cláusula, não implicará em qualquer tipo de reembolso, indenização ou restituição de valores pagos pelos USUÁRIOS, a qualquer título, tendo em vista o inadimplemento das normas estabelecidas pela ASSOCIAÇÃO.

### 7. DOS INSTRUMENTOS NORMATIVOS
**7.1** Ao firmar o presente instrumento contratual o(a) ADERENTE, por si e por seu(s) BENEFICIÁRIO(S), declara, sob as penas da lei que conheceu, compreendeu e está de pleno acordo com todas as Cláusulas deste instrumento, regulamentos complementares e/ou regras de uso existentes da ASSOCIAÇÃO, especialmente o Regimento Interno e a Política Lagoa Termas Parques e Hotéis, as quais foram previa e formalmente disponibilizados ao(à) ADERENTE, obrigando-se, este, a cumpri-las.

**7.2** O(A) ADERENTE, por si e por seu(s) BENEFICIÁRIO(S), declara ainda que lhe foi esclarecido e devidamente aceito que a ASSOCIAÇÃO não reconhece, nem se responsabiliza por quaisquer declarações e/ou promessas oriundas de terceiros que sejam divergentes do conteúdo deste contrato e das normas aqui referidas.

### 8. DOS DIREITOS E OBRIGAÇÕES DO(A) ADERENTE E SEU(S) BENEFICIÁRIO(S)
**8.1.** O(A) ADERENTE e seu(s) BENEFICIÁRIO(S) poderão utilizar as dependências dos Parques e Rio Lento em qualquer época, mediante apresentação da Carteira de Acesso, que poderá ter nomenclaturas de fantasia, e é de caráter pessoal e intransferível, onde poderão desfrutar da infraestrutura dos Parques e Rio Lento conforme disposto neste instrumento.

**8.2.** O(A) ADERENTE declara, para todos os fins de direito que: **(a)** passa a responder SOLIDARIAMENTE pelo(s) seu(s) BENEFICIÁRIO(S), previstos neste contrato, cabendo responder por eventuais situações ocorridas dentro dos parques, de ordem cível ou criminal, bem como por infrações a dispositivos neste contrato, suas alterações e dispositivos legais; **(b)** o repasse, pelo(a) ADERENTE ou seu(s) BENEFICIÁRIO(S) da Carteira de Acesso à terceiros, sujeitará a apreensão e bloqueio do uso por 180 (cento e oitenta) dias a contar da data da apreensão, podendo haver rescisão contratual em caso de reincidência; **(c)** a Carteira de Acesso retida somente poderá ser retirado pelo titular mediante assinatura de termo de ciência e responsabilidade sobre a utilização indevida do cartão.

**8.3.** Os direitos de uso dos Parques, conferidos ao(à) ADERENTE e seu(s) BENEFICIÁRIO(S) através da Carteira de Acesso são equiparados aos direitos dos usuários adquirentes de ingressos avulsos dos Parques e Rio Lento, não promocionais, de modo que deverão ser observadas as regras de uso e restrições impostas pela ASSOCIAÇÃO, especialmente no que se referir aos dias e horários de funcionamento, bem como a possibilidade de suspensão de funcionamento de qualquer das atrações dos Parques, em casos de força maior ou necessidade de manutenções, sem prévio aviso, visando a segurança dos Usuários.

**8.4.** Não estão inclusos nesta contratação o acesso e/ou participação em eventos de qualquer natureza organizados pela ASSOCIAÇÃO e/ou terceiros, especialmente shows artísticos, devendo ser adquiridos ingressos específicos para tais eventos. O mesmo critério se aplica a gastos relacionados com alimentos e bebidas em geral, em qualquer loja ou pontos de vendas do empreendimento, bem como aos demais serviços e produtos disponibilizados pela ASSOCIAÇÃO e/ou seus parceiros, salvo expressa permissão da ASSOCIAÇÃO.

**8.5. Cessão.** O(A) ADERENTE titular poderá promover a cessão do “TÍTULO” ora adquirido a qualquer pessoa, desde que mediante pagamento da taxa de cessão, conforme tabela de precificação vigende e disponibilizada pela ASSOCIAÇÃO. Cedido o “TÍTULO” pelo ADERENTE, os BENEFICIÁRIOS perderão os direitos de uso a ele (TÍTULO) vinculados.

**8.6.** Falecendo o(a) ADERENTE, esse poderá ser substituído por um herdeiro legal, devendo a titularidade do “Título” ser transferida, observado os termos e condições dispostos no Regimento Interno e outras regulamentações emitidas pela ASSOCIAÇÃO, para aquele que apresentar o documento de Inventário e Partilha de Bens ou outro correspondente, acompanhado da certidão de óbito do Titular. Caso não haja herdeiro legal, este contrato será extinto automaticamente, alcançando-se o término de sua vigência ao(s) BENEFICIÁRIO(S) mantida a possibilidade de Cessão descrita no item acima.

---PAGE_BREAK---
**8.7.** Todos os Usuários estão com o acesso subordinado à capacidade máxima de pessoas que os Parques comportam, o qual está disposto nos meios de comunicação da ASSOCIAÇÃO e fixado na entrada. Caso a capacidade máxima seja atingida, a entrada do usuário fica submisso à saída de outro usuário.

### 9. DA CARTEIRA DE ACESSO
**9.1.** A Carteira de Acesso será emitida na forma individual pela ASSOCIAÇÃO, na Central de Sócios, mediante pagamento de taxa expressa neste instrumento, quando aplicável, mediante apresentação deste contrato e dos documentos do(a) ADERENTE e BENEFICIÁRIO(S) relacionado(s) neste instrumento.

**9.2.** Para acesso às dependências dos parques e Rio Lento é indispensável, obrigatório a apresentação da Carteira de Acesso e, em caso de perda e/ou extravio, deverá o(a) ADERENTE pagar a taxa para reemissão, conforme tabela de precificação vigente e disponibilizada pela ASSOCIAÇÃO.

**9.3.** Fica expressamente proibida a venda dos acessos e/ou da Carteira de Acesso, de propriedade do(a) ADERENTE e/ou BENEFICIÁRIO(S) e AGREGADO(S), sendo claro que o fornecimento desses acessos/carteiras em troca de qualquer pecúnia ou vantagem econômica será considerado como mau uso, incorrendo nas penalidades previstas neste instrumento.

**9.4.** Não será permitida a entrada do(a) ADERENTE e BENEFICIÁRIO(S) sem a Carteira de Acesso, os quais, neste caso, estarão sujeitos a cobrança de ingresso Day Use conforme tarifário vigente na data, bem como não poderão usufruir dos descontos e benefícios relacionados a este instrumento.

**9.5.** Deverá o(a) ADERENTE e seu(s) BENEFICIÁRIO(S) zelar pelo uso correto e pessoal do Título e da Carteira de Acesso. O uso indevido por terceiros, poderá ocasionar advertência, suspensão e até exclusão, conforme sanções previstas neste instrumento ou demais normativas descritas no item 7.

### 10. DA TAXA DE EMISSÃO DE CARTEIRA DE ACESSO
**10.1.** Será devida pelo(a) ADERENTE a TAXA DE EMISSÃO DE CARTEIRA DE ACESSO, originada pela **(i)** emissão de Carteira de Acesso quando da adesão deste instrumento, desde que aplicável; **(ii)** pela renovação da Carteira de Acesso, anualmente cobrada, contada da assinatura deste contrato, conforme aplicável, a qual terá, portanto, o prazo de validade de 01 (um) ano e valor fixado conforme tabela de precificação vigente à época da renovação, reajustada anualmente pelo IGPM-FGV ou por outro índice que venha o substituir.

**10.2.** A Taxa Anual de Emissão (Renovação) da carteira de acesso será parcelada em até 03 (três) vezes no cartão de crédito ou recorrente, conforme autorização desde já concedida pelo ADERENTE e reafirmada no item 1.1.1, d.1 e no preâmbulo deste instrumento.

**10.3.** Salvo previsão em contrário e por mera liberalidade da ASSOCIAÇÃO, poderá considerar outras formas de pagamento das taxas.

**10.4.** O(A) ADERENTE autoriza o lançamento automático, pela ASSOCIAÇÃO, das Taxas aqui tratada em seu cartão de crédito previamente informado, devendo, por conseguinte, manter seus dados atualizados caso haja alteração.

---

____________________________________________
**[VENDAPESSOA1NOME]**

---PAGE_BREAK---
### 11. DA RESCISÃO
**11.1.** Na hipótese de pedido de cancelamento do “TÍTULO” pelo(a) ADERENTE, antes de integralizado o preço de aquisição descrito no preâmbulo, não haverá restituição das importâncias pagas. Além disso, será aplicada multa no importe de 30% (trinta por cento) sobre o saldo remanescente pendente de pagamento (saldo vincendo), a fim de suportar os custos de taxa(s) administrativa(s) e impostos.

**11.2.** O presente Instrumento também poderá ser rescindido de pleno direito, sem prévia notificação, nas seguintes hipóteses abaixo descriminadas: **(i)** Falência decretada, liquidação judicial ou extrajudicial, recuperação judicial ou extrajudicial deferida, ou insolvência de qualquer das partes demonstrada pelo descumprimento generalizado de obrigações de qualquer natureza; **(ii)** A constatação pela ASSOCIAÇÃO da utilização de qualquer espécie de artifício ou expediente que resulte em simulação ou fraude em documentos de identificação do(a) ADERENTE e ou Beneficiário(s) deste; **(iii)** atentado contra os instrumentos normativos, mencionados no item 7, que coloquem em risco a segurança dos usuários dos Parques e Rio Lento.

**11.3.** Havendo a integralização do preço de aquisição do Título, o(a) ADERENTE não poderá exigir a restituição de nenhum dos valores pagos, por se tratar de ato jurídico perfeito, de modo que fica garantido à ASSOCIAÇÃO a retenção integral dos valores pagos, isentando o(a) ADERENTE apenas de eventual(is) taxa(s) futuras.

---

____________________________________________
**[VENDAPESSOA1NOME]**

---

**11.4.** Eventual pedido de cancelamento do Título só poderá ocorrer mediante requisição expressa do(a) ADERENTE, justificando o motivo do cancelamento, condicionado à total adimplência da(s) Taxa(s) devida(s) por força deste instrumento. O pedido de cancelamento deverá ser entregue pessoalmente na Central de Sócios ou através de outro meio hábil disponibilizado por essa, sendo certo que o cancelamento não afasta a obrigação do(a) ADERENTE de pagar a(s) taxa(s) que esteja(m) eventualmente em atraso.

### 12. RESPONSABILIZAÇÃO DA ASSOCIAÇÃO
**12.1.** A ASSOCIAÇÃO não se responsabiliza por promessas e/ou declarações em desacordo com os termos e cláusulas do presente instrumento, assim como em desacordo com as informações do material oficial de divulgação, nem será admitida qualquer alteração ao texto do presente contrato, sem prévia e expressa anuência da ASSOCIAÇÃO.

### 13. DAS DISPOSIÇÕES GERAIS
**13.1. Irrevogabilidade e Irretratabilidade.** O presente instrumento é celebrado sob a condição expressa de sua irrevocabilidade e irretratabilidade, renunciando as partes expressamente, à faculdade de arrependimento concedida pelo Artigo 420 do Código Civil.

**13.2. Alteração.** Este instrumento não poderá ser modificado, nem haverá renúncia de suas disposições, exceto por meio de aditamento e consentimento, por escrito, de todas as partes signatárias, observando o disposto na legislação aplicável. A decretação de invalidade, ilegalidade ou inexequibilidade de quaisquer premissas ou disposições contidas neste instrumento por qualquer tribunal ou outro órgão competente, não invalida as demais premissas ou disposições, as quais permanecerão válidas e em pleno vigor.

**13.3. Tolerância ou Novação.** Caso qualquer uma das partes deixe de exigir o cumprimento pontual ou integral das obrigações decorrentes deste instrumento, ou deixe de exercer qualquer direito ou faculdade que lhe seja atribuído, tal fato será interpretado como mera tolerância, a título de liberalidade, e não importará em renúncia aos direitos e faculdades não exercidos, nem em precedente, novação ou revogação de qualquer premissa ou condição.

---PAGE_BREAK---
**13.4. Notificações e Comunicações.** Todas as notificações e comunicações relacionadas a este instrumento deverão ser encaminhadas por escrito, via e-mail com comprovação de recebimento, por cartório de títulos e documentos ou por via judicial, dirigidos e/ou entregues às partes nos endereços indicados, obrigando-se, desde já, a informar por escrito, quaisquer alterações em seus endereços.

**13.5. LGPD.** As partes autorizam aqueles que estejam vinculados direta ou indiretamente ao presente instrumento, a armazenar informações, documentos ou dados, a fim de execução e cumprimento do objeto, se comprometendo a gerenciar os dados coletados por meio de sistema que garanta o tratamento e descarte baseando-se nos princípios da boa-fé, finalidade, adequação, necessidade, livre acesso, qualidade dos dados, transparência, segurança, prevenção, não discriminação, responsabilização e prestação de contas, nos termos do art. 6º da Lei Geral de Proteção de Dados.

**13.6. Assinatura Eletrônica.** As partes afirmam e declaram que o presente instrumento poderá ser assinado por meio eletrônico, sendo consideradas válidas as referidas assinaturas, inclusive àquelas de seus representantes, nos termos do art. 10, parágrafo 2º, da MP2200-2/2001.

### 14. DO FORO
**14.1.** As Partes elegem o Foro da Comarca de Caldas Novas - GO, para dirimir quaisquer dúvidas porventura oriundas deste Contrato, renunciando expressamente a qualquer outro, por mais privilegiado que seja.

E por estarem assim acordadas, as partes declaram que o presente instrumento atende aos princípios da boa-fé, em cumprimento à função social do contrato e não importa, em hipótese alguma, em abuso de direito, a qualquer título, razão pela qual o firmam em 02 (duas) vias idênticas, por si, seus herdeiros e/ou sucessores, ratificando todas as cláusulas e condições impressas e manuscritas, na presença da testemunha de estilo.

Caldas Novas/GO, **[VENDADIA] de [VENDAMES] de [VENDAANO]**.

---

_________________________________________________________  
**[VENDAPESSOA1NOME] - ADERENTE**

  
**LAGOA THERMAS CLUBE, TURISMO, LAZER E ECOLOGIA**  
*CEDENTE*

---

#### Testemunhas:
__________________________________________  
**Nome:**  
**CPF:**  

__________________________________________  
**Nome:**  
**CPF:**  
`
  },
  {
    id: "TEMP-002",
    name: "Cessão de Direito de Uso - TÍTULO SOCIAL VITALÍCIO",
    productId: "PROD-003",
    fileName: "contrato_social_vitalicio.docx",
    placeholders: [
      "[VENDACONTRATONUMERO]", "[VENDAANO]", "[VENDADIA]", "[VENDAMES]",
      "[VENDAPESSOA1NOME]", "[VENDAPESSOA1NACIONALIDADE]", "[VENDAPESSOA1ESTADOCIVIL]",
      "[VENDAPESSOA1PROFISSAO]", "[VENDAPESSOA1RG]", "[VENDAPESSOA1CPF]",
      "[VENDAPESSOA1ENDERECO]", "[VENDAPESSOA1NUMEROENDERECO]", "[VENDAPESSOA1BAIRRO]",
      "[VENDAPESSOA1CEP]", "[VENDAPESSOA1CIDADE]", "[VENDAPESSOA1ESTADO]",
      "[ATENDIMENTOPESSOA1ACOMPANHANTE1]", "[VENDAVALORFINANCIADO]",
      "[VENDAVALORFINANCIADOEXTENSO]", "[PARCELATIPOPARCELA1]", "[PARCELAQUANTIDADE1]",
      "[PARCELAVALOR1]", "[PARCELAVENCIMENTO1]", "[PARCELADETALHE1]",
      "[PARCELATIPOPARCELA2]", "[PARCELAQUANTIDADE2]", "[PARCELAVALOR2]",
      "[PARCELAVENCIMENTO2]", "[PARCELADETALHE2]", "[VENDAVALORSALDORESTANTE]"
    ],
    content: `---PAGE_BREAK---
# INSTRUMENTO PARTICULAR DE CESSÃO DE DIREITO DE USO
## TÍTULO SOCIAL VITALÍCIO - Nº [VENDACONTRATONUMERO]/[VENDAANO]

### ASSOCIAÇÃO
LAGOA THERMAS CLUBE, TURISMO, LAZER E ECOLOGIA, associação privada sem fins lucrativos, regida pela legislação vigente e seu Estatuto Social, inscrita no CNPJ sob o nº 05.620.609/0001-87, estabelecida à Avenida Lagoa Quente, s/n, Bairro Lagoa Quente, em Caldas Novas – GO, CEP 75.692-580, representada neste ato nos termos de seus Atos Constitutivos ou por seu representante legal devidamente constituído.

### ADERENTE
**[VENDAPESSOA1NOME]**, [VENDAPESSOA1NACIONALIDADE], [VENDAPESSOA1ESTADOCIVIL], [VENDAPESSOA1PROFISSAO], R.G. nº [VENDAPESSOA1RG] e CPF/MF nº [VENDAPESSOA1CPF]. Residente e domiciliado à [VENDAPESSOA1ENDERECO] , [VENDAPESSOA1NUMEROENDERECO], [VENDAPESSOA1BAIRRO], CEP [VENDAPESSOA1CEP], [VENDAPESSOA1CIDADE], [VENDAPESSOA1ESTADO].

O presente Termo de Adesão confere ao(à) ADERENTE e seus BENEFICIÁRIOS, caso contratadas posições para estes, o direito de utilizar as dependências dos complexos de lazer *Lagoa Termas Parque* e *Lagoa Eco Praia* (Parques), assim como o ambiente denominado “Rio Lento” por período vitalício, consoante as regras de utilização, preço de aquisição e taxa de emissão de carteira de acesso (emissão e renovação) abaixo descritas e quando aplicáveis, celebrado entre as partes ora qualificadas, conforme as cláusulas e condições constantes deste instrumento e seus eventuais anexos.

---

Para usufruir dos benefícios do Título adquirido, o(a) ADERENTE adquire o direito eleger até 02 (duas) pessoas, descrito como BENEFICIÁRIOS:

| | NOME | CPF |
|---|---|---|
| 1 | [VENDAPESSOA1NOME] | [VENDAPESSOA1CPF] |

---

### CONDIÇÕES DE PAGAMENTO
O valor da presente transação é feito pelo preço total de **[VENDAVALORFINANCIADO] ([VENDAVALORFINANCIADOEXTENSO])**, que serão pagos conforme condições abaixo delineadas:

| Qntd. Parcela | Valor | Vencimento | Tipo de Pagamento |
|---|---|---|---|
| ([PARCELATIPOPARCELA1]) - [PARCELAQUANTIDADE1] | [PARCELAVALOR1] | [PARCELAVENCIMENTO1] | [PARCELADETALHE1] |
| ([PARCELATIPOPARCELA2]) - [PARCELAQUANTIDADE2] | [PARCELAVALOR2] | [PARCELAVENCIMENTO2] | [PARCELADETALHE2] |
| Saldo Restante | [VENDAVALORSALDORESTANTE] | | |

* **Emissão- Taxa de Emissão da Carteira de Acesso\*:** R$ 00,00  
* **Renovação - Taxa Anual de Emissão de Carteira de Acesso:** conforme tabela de precificação vigente à época.

Estou ciente e de acordo com o plano de pagamento assinalado nesta página em relação à aquisição do “TÍTULO SOCIAL VITALÍCIO” e a adesão de eventuais BENEFICIÁRIOS, assim como com as condições de pagamento aplicáveis.

---PAGE_BREAK---
### ( ) OPÇÃO DE PAGAMENTO ATRAVÉS DE BOLETO BANCÁRIO
Autorizo a cobrança do valor de R$ ___________________ (________________________) através da emissão de Boletos Bancários divididos em ___(_______) parcelas de R$ ___________________ (________________________) tendo a 1ª parcela emitida no dia __/__/___ e as demais parcelas com vencimento no mesmo dia dos meses subsequentes. Autorizo ainda que esta opção de pagamento seja utilizada para a cobrança de eventuais taxas, como para emissão e renovação da carteira de acesso, nos prazos, preços e condições previstas neste contrato.

### ( ) OPÇÃO DE PAGAMENTO ATRAVÉS DE CARTÃO DE CRÉDITO OU CRÉDITO RECORRENTE
Eu, _____________________________________________________________________ CPF __________________________, autorizo a cobrança do valor acima descrito no cartão de crédito de minha titularidade, dados:  
**Cartão nº** ________________________________, **Bandeira:** ( ) Visa / ( ) Mastercard / ( ) Elo / ( ) Outras (_________________________)  
**Validade (mês/ano):** _________  

Na condição de titular do Cartão de Crédito indicado, autorizo a cobrança do valor de R$ ___________________ (________________________) divididos em ____(____________) a ser debitada a 1ª parcela no dia ___/_____________/________ e as demais parcelas com vencimento no mesmo dia dos meses subsequentes. Autorizo ainda que esta opção de pagamento seja utilizada para a cobrança de eventuais taxas, como para emissão e renovação da carteira de acesso, nos prazos, preços e condições previstas neste contrato.

---

________________________________________             ____________________________________________
**Assinatura do titular do cartão**                   **Assinatura do(a) Aderente [VENDAPESSOA1NOME]**

---

## CONDIÇÕES CONTRATUAIS

### 1. OBJETO CONTRATUAL
**1.1.** O presente contrato tem por objeto a aquisição do **“TÍTULO SOCIAL VITALÍCIO”** indicado no preâmbulo deste instrumento, através do qual o(a) **ADERENTE** se torna detentor do direito de acesso e fruição das instalações e atrações dos complexos de lazer *Lagoa Termas Parque* e *Lagoa Eco Praia*, bem como do ambiente denominado *“Rio Lento”* sob administração da **ASSOCIAÇÃO**, que dá direito a si e seu(s) **BENEFICIÁRIO(S)** (caso contratadas posições para estes) a ingressarem nas dependências dos complexos de lazer (parques e Rio Lento), nos dias e horários em que estiver aberto ao público, podendo fazer uso de suas instalações, atrações recreativas ao público e equipamentos aquáticos, desde que adimplentes em suas obrigações.

**1.1.1.** São características específicas do Título, bem como benefícios e vantagens:
* **a) 04 (quatro) diárias:** Conforme descrito no item 1.1.1.1, abaixo;
* **b) 02 (dois) acessos extras (não cumulativos):** Os 02 (dois) acessos mensais extras (não cumulativos) estarão disponíveis a partir da quitação integral do contrato e deverão ser retirados de forma presencial e exclusivamente pelo ADERENTE;
* **c) Carteira de Acesso:** A emissão da carteira de acesso será cobrada conforme estabelecido no preâmbulo. Em todo caso, será devida a Taxa Anual de Emissão (Renovação), independentemente de uso pelo ADERENTE e BENEFICIÁRIOS, além de, caso seja perdida, cobrança pela reimpressão, conforme tabela de precificação vigente à época. A Carteira de Acesso é feita na central de sócio presencial;
* **d) Estacionamento:** Apresentando Carteira de Acesso válida, terá direito a desconto de 50% (cinquenta por cento) sobre o valor do estacionamento. Desconto concedido na portaria do estacionamento;

---PAGE_BREAK---
**1.1.1.1.** Para utilização das 04 (quatro) diárias a que se refere o item 1.1.1, “b”, acima, o **ADERENTE** e seus eventuais **BENEFICIÁRIOS** devem se atentar as seguintes condições:
* **a)** As diárias disponíveis são entre Domingo e Quinta-feira;
* **b)** A utilização estará condicionada à disponibilidade de vagas nos empreendimentos “EcoTowers” e/ou “Jardins da Lagoa”, e são limitadas ao período considerado de “baixa temporada”;
* **c)** As diárias disponibilizadas, conforme este item, não incluem alimentação;
* **d)** O imóvel disponibilizado para uso das diárias aqui descritas terá capacidade para até 04 (quatro) pessoas, independentemente da idade;
* **e)** As diárias somente poderão ser usufruídas pelos BENEFICIÁRIOS, quando acompanhados pelo(a) ADERENTE, sendo intransferíveis para terceiros, ainda que familiares não qualificados como BENEFICIÁRIOS;
* **f)** Para utilização dos pacotes de hospedagem o ADERENTE deverá ter integralização mínima:
  * **a.** Para o pacote único de hospedagem: 40% (quarenta por cento) do valor do contrato.
* **g)** Estas Diárias deverão ser utilizadas dentro do período de até 24 (vinte e quatro) meses contados da data de assinatura deste instrumento.

**1.2.** O direito de acesso ora concedido limita-se exclusivamente aos parques *Lagoa Termas Parque* e *Lagoa Eco Praia*, bem como ao ambiente denominado *Rio Lento*, não sendo extensível a quaisquer outras áreas ou atrações já criadas e/ou que venham a ser criadas pela **ASSOCIAÇÃO**.

**1.3.** O(A) ADERENTE supra qualificado(a), de livre arbítrio, firma com a ASSOCIAÇÃO a aquisição do “TÍTULO” por prazo vitalício, para uso de suas instalações de lazer, em caráter pessoal, irrevogável e irretratável.

**1.4.** A natureza de “Título Vitalício” não confere ao(à) ADERENTE e aos seus BENEFICIÁRIOS o poder de voto, deliberação e gerência em relação à ASSOCIAÇÃO ou aos Parques.

**1.5.** A ASSOCIAÇÃO, em razão de sua natureza associativa, atua sem fins lucrativos, visando promover o interesse coletivo e o bem-estar de seus associados, motivo pelo qual não se aplica o Código de Defesa do Consumidor (CDC), uma vez que sua destinação é voltada ao cumprimento de seus objetivos sociais e não para a prestação de serviços típicos de consumo.

### 2. BENEFICIÁRIOS
**2.1. Social Vitalício.** O “TÍTULO” concederá em favor do(s) BENEFICIÁRIO(S) (caso contratadas posições para estes) os mesmos benefícios atribuídos ao(à) ADERENTE, independentemente de vínculo familiar ou grau de parentesco, os quais serão cadastrados para fazerem jus ao direito de acesso às dependências dos complexos de lazer (parques e Rio Lento) mediante apresentação da Carteira de Acesso (“Carteira”) a ser emitida.

**2.2.** No ato de cada substituição / exclusão / troca de BENEFICIÁRIO(S), o que será permitido tão somente nos termos dispostos neste instrumento, será devido o custo de emissão da respectiva Carteira individual, conforme tabela de precificação vigente no momento da requisição. ADERENTE e BENEFICIÁRIO(S) serão designados doravante, quando em conjunto, como “USUÁRIOS”.

**2.2.1.** A substituição/troca de BENEFICIÁRIO(S) só será permitida a cada período de 12 (doze) meses, contados da inclusão do(s) beneficiário(s) anterior(es) que estiver(em) sendo substituído. Para tanto, o ADERENTE deverá estar adimplente com as obrigações deste instrumento, assim como realizar o pagamento da emissão da Carteira de Acesso e a Taxa de Transferência conforme Tabela de Precificação vigente, nos termos acima descritos.

### 3. DA UTILIZAÇÃO DAS DEPENDÊNCIAS DOS PARQUES

---PAGE_BREAK---
**3.1.** O “TÍTULO” adquirido não contempla gratuidade ou isenção em atividades consideradas extraordinárias, as quais estarão sujeitas à cobrança adicional (p.ex.: alimentação, bebidas, locação de espaço para eventos, utilização de bangalôs, quadras esportivas, shows artísticos, produtos e serviços oferecidos nos bares e restaurantes ou pelo próprio parque, dentre outras), assim como de estabelecimentos parceiros porventura instalados nas dependências da ASSOCIAÇÃO.

**3.1.1.** A ASSOCIAÇÃO poderá, sem que isto configure uma obrigação, oferecer por si ou através de relacionamento com parceiros, descontos e condições especiais para alimentação e bebida, além de eventos e experiências especialmente pensadas para o(a)(s) ADERENTE(S). A concessão de descontos e condições especiais durará por tempo determinado e poderá ser cancelada sem a necessidade de comunicação prévia, não gerando qualquer espécie de direito adquirido ou cumulatividade.

**3.2.** A ASSOCIAÇÃO confere ao(à) ADERENTE o direito de utilizar os Parques e Rio Lento nos termos das cláusulas a seguir e conforme as normativas próprias da associação, tratadas no item 07. A ASSOCIAÇÃO reserva-se ao direito de, a qualquer momento, alterar os dias de funcionamento do parque sem necessidade de prévia comunicação ao(à) ADERENTE, bem como tornar indisponíveis atrações, por motivo de reforma, manutenção preventiva e corretiva, visando assegurar a segurança e a qualidade dos serviços prestados. Dias e horários de funcionamento poderão ser consultados nos canais de comunicação da ASSOCIAÇÃO.

**3.3.** O direito de utilizar os Parques não compreende a compra ou promessa de compra e venda da propriedade, do todo ou em parte, nem na venda de títulos patrimoniais ou não.

### 4. DO PRAZO
**4.1.** O prazo de vigência deste contrato é de tempo indeterminado, em razão do caráter vitalício do Título adquirido, desde que o(a) ADERENTE tenha quitado integralmente o valor do presente contrato e esteja honrando com os pagamentos da(s) Taxa(s) devida(s), especialmente a Taxa de Emissão da Carteira de Acesso (Renovação), quando aplicável, além de estar em estrito cumprimento quanto às normas e regulamentações internas da ASSOCIAÇÃO.

### 5. DOS VALORES CONTRATADOS E CONDIÇÕES DE PAGAMENTO
**5.1.** Os valores deste contrato e suas condições de pagamento estão especificados no preâmbulo deste instrumento, e as partes declaram pleno conhecimento e concordância com o seu conteúdo.

**5.2.** Além disso, o(a) ADERENTE se compromete a manter os dados do cartão de crédito atualizados perante a ASSOCIAÇÃO, em quaisquer circunstâncias de substituição, tais como: perda, roubo, troca, validade vencida, solicitação de segunda via, ou qualquer situação que dificulte ou impossibilite a continuidade da operação até que se conclua o pagamento integral. Compromete-se, ainda, a manter saldo suficiente no cartão de crédito para acolher os referidos débitos.

**5.3.** Além do valor relativo ao contrato, referente ao preço de aquisição do título, o(a) ADERENTE deverá arcar obrigatoriamente, desde que aplicável, com a **(i)** Taxa de Emissão de Carteira de Acesso; **(ii)** Renovação - Taxa Anual de Emissão de Carteira de Acesso cobrada a cada ano aniversário do contrato, contado a partir de sua assinatura, a ser paga pelo(s) ADERENTE / BENEFICIÁRIO(S), no valor estipulado na tabela de precificação vigente à época da renovação. O valor relativo a tais taxas poderá ser reajustado anualmente, com base na variação do Indicador Geral de Preços do Mercado (IGP-M/FGV), independentemente de qualquer notificação ou aviso extra; **(iii)** Comissão de Intermediação a ser paga diretamente à ASSOCIAÇÃO.

**5.4.** O atraso no pagamento de qualquer valor previsto neste contrato, incluindo-se a(s) Taxa(s), implicará na imposição de multa moratória de 10% (dez por cento), juros moratórios de 1% (um por cento) ao mês e atualização monetária calculada de acordo com a variação positiva do IGP-M/FGV, incidente desde a data de vencimento da obrigação e até a de seu pagamento, em caso de cobrança judicial.

---PAGE_BREAK---
**5.4.1.** A ASSOCIAÇÃO poderá, ainda, promover a negativação do nome do(a) ADERENTE perante os órgãos de proteção ao crédito.

### 6. DA SUSPENSÃO, CANCELAMENTO E TOLERÂNCIA

**6.1. Suspensão.** Considerar-se-á suspenso o direito de acesso concedido através da aquisição deste título ante **(i)** a inadimplência de 01 (uma) parcela do preço de aquisição estabelecido no preâmbulo, ressalvado prazo de tolerância de 01 (um) dia após o vencimento; **(ii)** o não pagamento de quaisquer Taxas previstas neste instrumento.

**6.1.1.** A suspensão se estenderá durante a vigência contratual, a partir da data seguinte ao vencimento da parcela / taxa inadimplida, período em que o(a) ADERENTE e/ou o(s) BENEFICIÁRIO(S) terão a oportunidade de regularizar sua inadimplência, pagando a(s) parcela(s) e/ou taxa(s) em atraso, devidamente atualizada pelo IGPM-FGV, além dos demais encargos devidos.

**6.1.2.** Decorridos 60 (sessenta) dias de suspensão, a ASSOCIAÇÃO poderá optar pela rescisão deste instrumento, sem prejuízo da cobrança das parcelas ou taxas que estiverem em atraso, bem como dos encargos aplicados em razão da mora. Neste caso, não haverá restituição de valores pagos, uma vez que o direito de uso esteve disponível durante o período de regularidade contratual.

**6.2. Cancelamento.** A ASSOCIAÇÃO se reserva ao direito de cancelar a validade da Carteira de Acesso dos USUÁRIOS quando estes, no uso e gozo de seus direitos, atentarem contra os instrumentos normativos (item 7), colocarem em risco sua segurança ou de outros na utilização dos equipamentos; nos casos de inobservância das normas vigentes no estabelecimento da ASSOCIAÇÃO; nos casos que atentarem contra o pudor; comportamento inadequado; bem como os que afrontem a moral e aos bons costumes; ou que fraudem ou que venham a fraudar os sistemas de admissão e controle da ASSOCIAÇÃO.

**6.2.1.** Caso o ato praticado pelo(s) USUÁRIO(S) represente alto grau de repúdio e ataque a preceitos éticos, morais e de urbanidade, a ASSOCIAÇÃO poderá banir o responsável por qualquer meio de acesso às dependências dos parques ou de outras unidades do Grupo Lagoa.

**6.2.2.** Fica também estabelecido, de acordo com as normas da ASSOCIAÇÃO, que não é permitido o ingresso nos parques e Rio Lento com alimentos e bebidas de qualquer espécie, instrumentos musicais e equipamentos de som, ou qualquer tipo de equipamento que possa vir perturbar o ambiente e o bem-estar das demais pessoas. Sendo que, a ASSOCIAÇÃO reserva-se o direito de em caso de perturbação e/ou mau procedimento, realizar o canalamento do “TÍTULO” dos USUÁRIOS e/ou BENEFICIÁRIO(S), bem como solicitar sua imediata retirada das dependências dos Parques / Rio Lento.

**6.2.3.** O cancelamento nas hipóteses previstas nesta cláusula, não implicará em qualquer tipo de reembolso, indenização ou restituição de valores pagos pelos USUÁRIOS, a qualquer título, tendo em vista o inadimplemento das normas estabelecidas pela ASSOCIAÇÃO.

### 7. DOS INSTRUMENTOS NORMATIVOS
**7.1** Ao firmar o presente instrumento contratual o(a) ADERENTE, por si e por seu(s) BENEFICIÁRIO(S), declara, sob as penas da lei que conheceu, compreendeu e está de pleno acordo com todas as Cláusulas deste instrumento, regulamentos complementares e/ou regras de uso existentes da ASSOCIAÇÃO, especialmente o Regimento Interno e a Política Lagoa Termas Parques e Hotéis, as quais foram previa e formalmente disponibilizados ao(à) ADERENTE, obrigando-se, este, a cumpri-las.

**7.2** O(A) ADERENTE, por si e por seu(s) BENEFICIÁRIO(S), declara ainda que lhe foi esclarecido e devidamente aceito que a ASSOCIAÇÃO não reconhece, nem se responsabiliza por quaisquer declarações e/ou promessas oriundas de terceiros que sejam divergentes do conteúdo deste contrato e das normas aqui referidas.

---PAGE_BREAK---
### 8. DOS DIREITOS E OBRIGAÇÕES DO(A) ADERENTE E SEU(S) BENEFICIÁRIO(S)
**8.1.** O(A) ADERENTE e seu(s) BENEFICIÁRIO(S) poderão utilizar as dependências dos Parques e Rio Lento em qualquer época, mediante apresentação da Carteira de Acesso, que poderá ter nomenclaturas de fantasia, e é de caráter pessoal e intransferível, onde poderão desfrutar da infraestrutura dos Parques e Rio Lento conforme disposto neste instrumento.

**8.2.** O(A) ADERENTE declara, para todos os fins de direito que: **(a)** passa a responder SOLIDARIAMENTE pelo(s) seu(s) BENEFICIÁRIO(S) (caso contratadas posições para estes), previstos neste contrato, cabendo responder por eventuais situações ocorridas dentro dos parques, de ordem cível ou criminal, bem como por infrações a dispositivos neste contrato, suas alterações e dispositivos legais; **(b)** o repasse, pelo(a) ADERENTE ou seu(s) BENEFICIÁRIO(S) da Carteira de Acesso à terceiros, sujeitará a apreensão e bloqueio do uso por 180 (cento e oitenta) dias a contar da data da apreensão, podendo haver rescisão contratual em caso de reincidência; **(c)** a Carteira de Acesso retida somente poderá ser retirado pelo titular mediante assinatura de termo de ciência e responsabilidade sobre a utilização indevida do cartão.

**8.3.** Os direitos de uso dos Parques, conferidos ao(à) ADERENTE e seu(s) BENEFICIÁRIO(S) através da Carteira de Acesso são equiparados aos direitos dos usuários adquirentes de ingressos avulsos dos Parques e Rio Lento, não promocionais, de modo que deverão ser observadas as regras de uso e restrições impostas pela ASSOCIAÇÃO, especialmente no que se referir aos dias e horários de funcionamento, bem como a possibilidade de suspensão de funcionamento de qualquer das atrações dos Parques, em casos de força maior ou necessidade de manutenções, sem prévio aviso, visando a segurança dos Usuários.

**8.4.** Não estão inclusos nesta contratação o acesso e/ou participação em eventos de qualquer natureza organizados pela ASSOCIAÇÃO e/ou terceiros, especialmente shows artísticos, devendo ser adquiridos ingressos específicos para tais eventos. O mesmo critério se aplica a gastos relacionados com alimentos e bebidas em geral, em qualquer loja ou pontos de vendas do empreendimento, bem como aos demais serviços e produtos disponibilizados pela ASSOCIAÇÃO e/ou seus parceiros, salvo expressa permissão da ASSOCIAÇÃO.

**8.5. Cessão.** O(A) ADERENTE titular poderá promover a cessão do “TÍTULO” ora adquirido a qualquer pessoa, desde que mediante pagamento da taxa de cessão, conforme tabela de precificação vigente e disponibilizada pela ASSOCIAÇÃO. Cedido o “TÍTULO” pelo ADERENTE, os BENEFICIÁRIOS perderão os direitos de uso a ele (TÍTULO) vinculados.

**8.6.** Falecendo o(a) ADERENTE, esse poderá ser substituído por um herdeiro legal, devendo a titularidade do “Título” ser transferida, observado os termos e condições dispostos no Regimento Interno e outras regulamentações emitidas pela ASSOCIAÇÃO, para aquele que apresentar o documento de Inventário e Partilha de Bens ou outro correspondente, acompanhado da certidão de óbito do Titular. Caso não haja herdeiro legal, este contrato será extinto automaticamente, alcançando-se o término de sua vigência ao(s) BENEFICIÁRIO(S) mantida a possibilidade de Cessão descrita no item acima.

**8.7.** Todos os Usuários estão com o acesso subordinado à capacidade máxima de pessoas que os Parques comportam, o qual está disposto nos meios de comunicação da ASSOCIAÇÃO e fixado na entrada. Caso a capacidade máxima seja atingida, a entrada do usuário fica submisso à saída de outro usuário.

### 9. DA CARTEIRA DE ACESSO
**9.1.** A Carteira de Acesso será emitida na forma individual pela ASSOCIAÇÃO, na Central de Sócios, mediante pagamento de taxa expressa neste instrumento, quando aplicável, mediante apresentação deste contrato e dos documentos do(a) ADERENTE e BENEFICIÁRIO(S) relacionado(s) neste instrumento.

**9.2.** Para acesso às dependências dos parques e Rio Lento é indispensável, obrigatório a apresentação da Carteira de Acesso e, em caso de perda e/ou extravio, deverá o(a) ADERENTE pagar a taxa para reemissão, conforme tabela de precificação vigente e disponibilizada pela ASSOCIAÇÃO.

---PAGE_BREAK---
**9.3.** Fica expressamente proibida a venda dos acessos e/ou da Carteira de Acesso, de propriedade do(a) ADERENTE e/ou BENEFICIÁRIO(S), sendo claro que o fornecimento desses acessos/carteiras em troca de qualquer pecúnia ou vantagem econômica será considerado como mau uso, incorrendo nas penalidades previstas neste instrumento.

**9.4.** Não será permitida a entrada do(a) ADERENTE e BENEFICIÁRIO(S) sem a Carteira de Acesso, os quais, neste caso, estarão sujeitos a cobrança de ingresso Day Use conforme tarifário vigente na data, bem como não poderão usufruir dos descontos e benefícios relacionados a este instrumento.

**9.5.** Deverá o(a) ADERENTE e seu(s) BENEFICIÁRIO(S) zelar pelo uso correto e pessoal do Título e da Carteira de Acesso. O uso indevido por terceiros, poderá ocasionar advertência, suspensão e até exclusão, conforme sanções previstas neste instrumento ou demais normativas descritas no item 7.

### 10. DA TAXA DE EMISSÃO DE CARTEIRA DE ACESSO
**10.1.** Será devida pelo(a) ADERENTE a TAXA DE EMISSÃO DE CARTEIRA DE ACESSO, originada pela **(i)** emissão de Carteira de Acesso quando da adesão deste instrumento, desde que aplicável; **(ii)** pela renovação da Carteira de Acesso, anualmente cobrada, contada da assinatura deste contrato, conforme aplicável, a qual terá, portanto, o prazo de validade de 01 (um) ano e valor fixado conforme tabela de precificação vigente à época da renovação, reajustada anualmente pelo IGPM-FGV ou por outro índice que venha o substituir.

**10.2.** Por mera liberalidade da ASSOCIAÇÃO, as taxas a que se referem este item poderão ser parceladas em até 12 (doze) prestações mensais, mediante cobrança recorrente autorizada pelo(a) ADERENTE.

**10.3.** O(A) ADERENTE autoriza o lançamento automático, pela ASSOCIAÇÃO, das Taxas aqui tratada em seu cartão de crédito previamente informado, devendo, por conseguinte, manter seus dados atualizados caso haja alteração.

---

____________________________________________  
**[VENDAPESSOA1NOME]**

---PAGE_BREAK---
### 11. DA RESCISÃO
**11.1.** Na hipótese de pedido de cancelamento do “TÍTULO” pelo(a) ADERENTE, antes de integralizado o preço de aquisição descrito no preâmbulo, não haverá restituição das importâncias pagas. Além disso, será aplicada multa no importe de 30% (trinta por cento) sobre o saldo remanescente pendente de pagamento (saldo vincendo), a fim de suportar os custos de taxa(s) administrativa(s) e impostos.

**11.2.** O presente Instrumento também poderá ser rescindido de pleno direito, sem prévia notificação, nas seguintes hipóteses abaixo descriminadas: **(i)** Falência decretada, liquidação judicial ou extrajudicial, recuperação judicial ou extrajudicial deferida, ou insolvência de qualquer das partes demonstrada pelo descumprimento generalizado de obrigações de qualquer natureza; **(ii)** A constatação pela ASSOCIAÇÃO da utilização de qualquer espécie de artifício ou expediente que resulte em simulação ou fraude em documentos de identificação do(a) ADERENTE e ou Beneficiário(s) deste; **(iii)** atentado contra os instrumentos normativos, mencionados no item 7, que coloquem em risco a segurança dos usuários dos Parques e Rio Lento.

**11.3.** Havendo a integralização do preço de aquisição do Título, o(a) ADERENTE não poderá exigir a restituição de nenhum dos valores pagos, por se tratar de ato jurídico perfeito, de modo que fica garantido à ASSOCIAÇÃO a retenção integral dos valores pagos, isentando o(a) ADERENTE apenas de eventual(is) taxa(s) futuras.

---

____________________________________________  
**[VENDAPESSOA1NOME]**

---

**11.4.** Eventual pedido de cancelamento do Título só poderá ocorrer mediante requisição expressa do(a) ADERENTE, justificando o motivo do cancelamento, condicionado à total adimplência da(s) Taxa(s) devida(s) por força deste instrumento. O pedido de cancelamento deverá ser entregue pessoalmente na Central de Sócios ou através de outro meio hábil disponibilizado por essa, sendo certo que o cancelamento não afasta a obrigação do(a) ADERENTE de pagar a(s) taxa(s) que esteja(m) eventualmente em atraso.

### 12. DOS REPRESENTANTES E VENDEDORES (CONSULTOR AUTÔNOMO)
**12.1.** A ASSOCIAÇÃO não se responsabiliza por promessas e/ou declarações em desacordo com os termos e cláusulas do presente instrumento, assim como em desacordo com as informações do material oficial de divulgação, nem será admitida qualquer alteração ao texto do presente contrato, sem prévia e expressa anuência da ASSOCIAÇÃO. Materiais que sejam emitidos por representantes de vendas ou terceiros, os quais estão expressamente desautorizados a isso, não deverão ser considerados pelo(a) ADERENTE.

### 13. DAS DISPOSIÇÕES GERAIS
**13.1. Irrevogabilidade e Irretratabilidade.** O presente instrumento é celebrado sob a condição expressa de sua irrevocabilidade e irretratabilidade, renunciando as partes expressamente, à faculdade de arrependimento concedida pelo Artigo 420 do Código Civil.

**13.2. Alteração.** Este instrumento não poderá ser modificado, nem haverá renúncia de suas disponições, exceto por meio de aditamento e consentimento, por escrito, de todas as partes signatárias, observando o disposto na legislação aplicável. A decretação de invalidade, ilegalidade ou inexequibilidade de quaisquer premissas ou disposições contidas neste instrumento por qualquer tribunal ou outro órgão competente, não invalida as demais premissas ou disposições, as quais permanecerão válidas e em pleno vigor.

**13.3. Tolerância ou Novação.** Caso qualquer uma das partes deixe de exigir o cumprimento pontual ou integral das obrigações decorrentes deste instrumento, ou deixe de exercer qualquer direito ou faculdade que lhe seja atribuído, tal fato será interpretado como mera tolerância, a título de liberalidade, e não importará em renúncia aos direitos e faculdades não exercidos, nem em precedente, novação ou revogação de qualquer premissa ou condição.

**13.4. Notificações e Comunicações.** Todas as notificações e comunicações relacionadas a este instrumento deverão ser encaminhadas por escrito, via e-mail com comprovação de recebimento, por cartório de títulos e documentos ou por via judicial, dirigidos e/ou entregues às partes nos endereços indicados, obrigando-se, desde já, a informar por escrito, quaisquer alterações em seus endereços.

**13.5. LGPD.** As partes autorizam aqueles que estejam vinculados direta ou indiretamente ao presente instrumento, a armazenar informações, documentos ou dados, a fim de execução e cumprimento do objeto, se comprometendo a gerenciar os dados coletados por meio de sistema que garanta o tratamento e descarte baseando-se nos princípios da boa-fé, finalidade, adequação, necessidade, livre acesso, qualidade dos dados, transparência, segurança, prevenção, não discriminação, responsabilização e prestação de contas, nos termos do art. 6º da Lei Geral de Proteção de Dados.

**13.6. Assinatura Eletrônica.** As partes afirmam e declaram que o presente instrumento poderá ser assinado por meio eletrônico, sendo consideradas válidas as referidas assinaturas, inclusive àquelas de seus representantes, nos termos do art. 10, parágrafo 2º, da MP2200-2/2001.

### 14. DO FORO
**14.1.** As Partes elegem o Foro da Comarca de Caldas Novas - GO, para dirimir quaisquer dúvidas porventura oriundas deste Contrato, renunciando expressamente a qualquer outro, por mais privilegiado que seja.

E por estarem assim acordadas, as partes declaram que o presente instrumento atende aos princípios da boa-fé, em cumprimento à função social do contrato e não importa, em hipótese alguma, em abuso de direito, a qualquer título, razão pela qual o firmam em 02 (duas) vias idênticas, por si, seus herdeiros e/ou sucessores, ratificando todas as cláusulas e condições impressas e manuscritas, na presença da testemunha de estilo.

Caldas Novas/GO, **[VENDADIA] de [VENDAMES] de [VENDAANO]**.

---

_________________________________________________________  
**[VENDAPESSOA1NOME] - ADERENTE**

  
**LAGOA THERMAS CLUBE, TURISMO, LAZER E ECOLOGIA**  
*CEDENTE*

---

#### Testemunhas:
__________________________________________  
**Nome:**  
**CPF:**  

__________________________________________  
**Nome:**  
**CPF:**  
`
  }
];

// Reutilizar o mesmo template genérico para títulos sociais para evitar overhead
export const GENERAL_SOCIAL_TEMPLATE = {
  id: "TEMP-003",
  name: "Contrato Social Vitalício Individual/Múltiplo",
  productId: "GENERAL_SOCIAL",
  fileName: "contrato_social_vitalicio.docx",
  placeholders: [
    "{{nome_titular}}", "{{cpf_titular}}", "{{rg_titular}}", "{{data_nascimento_titular}}", "{{profissao_titular}}",
    "{{endereco_completo}}", "{{telefone_titular}}", "{{email_titular}}",
    "{{produto}}", "{{tipo_titulo}}", "{{valor_total}}", "{{forma_pagamento}}", "{{valor_entrada}}",
    "{{quantidade_parcelas}}", "{{valor_parcela}}", "{{saldo_restante}}", "{{data_venda}}", "{{data_primeiro_vencimento}}",
    "{{corretor}}"
  ],
  content: `
# CONTRATO DE ADESÃO - TÍTULO SOCIAL IMPERIAL - LAGOA LOVERS

Pelo presente instrumento, a LAGOA LOVERS formaliza a venda do **{{produto}}** para:
**Membro Titular**: {{nome_titular}}
**CPF**: {{cpf_titular}} | **Endereço**: {{endereco_completo}}
**Telefone**: {{telefone_titular}} | **Email**: {{email_titular}}

**QUADRO DE VALORES E FINANCIAMENTO**:
- **Total**: {{valor_total}}
- **Sinal de Entrada**: {{valor_entrada}}
- **Divisão**: {{quantidade_parcelas}} prestações de {{valor_parcela}}
- **Vencimento Inicial**: {{data_primeiro_vencimento}}
- **Canal de Venda**: {{forma_pagamento}}
- **Intermediado por**: {{corretor}}

Benefícios inclusos: 1º ano de carteirinhas grátis, descontos em estacionamento e hospedagem de acordo com a quantidade de pessoas indicadas no título.

Caldas Novas, {{data_venda}}.

--------------------------------------------
**Assinatura do Adquirente Social**
`
};

export const INITIAL_RECEPTIONS: ReceptionRecord[] = [
  {
    id: "REC-1001",
    createdAt: "2026-05-28T09:00:00Z",
    receptionTime: "09:00",
    presentationDate: "2026-05-29",
    source: CoupleSource.HOSPEDAGEM,
    lodging: LodgingPlace.LAGOA_QUENTE,
    captationPlace: CaptationPlace.PARQUE,
    brokerName: "Marcos Oliveira",
    sdrName: "Carla SDR",
    status: AttendanceStatus.VENDA_LANCADA,
    observations: "Casal muito interessado na área familiar. Estão hospedados no Lagoa Quente.",
    guest1: {
      name: "Rodrigo Alencar Silva",
      age: "38",
      birthDate: "12/04/1988",
      retired: false,
      profession: "Engenheiro Civil",
      professionObservation: "Sócio de construtora",
      cpf: "123.456.789-00",
      rg: "MG-12.345.678",
      nationality: "Brasileiro",
      civilStatus: "Casado",
      schooling: "Superior Completo",
      company: "Alencar Engenharia Ltda",
      role: "Diretor Comercial",
      individualIncome: "R$ 15.000,00"
    },
    guest2: {
      name: "Fernanda Soares Alencar",
      age: "35",
      birthDate: "25/08/1990",
      retired: false,
      profession: "Arquiteta",
      professionObservation: "Autônoma",
      cpf: "987.654.321-11",
      rg: "SP-9.876.543",
      nationality: "Brasileira",
      civilStatus: "Casada",
      schooling: "Superior Completo",
      company: "Fernanda Alencar Studio",
      role: "Proprietária",
      individualIncome: "R$ 8.500,00"
    },
    relation: {
      type: RelationType.CASADO,
      timeYears: "10",
      timeMonths: "4",
      timeDays: "0",
      childrenCount: "2",
      childrenNamesAge: "Lucas, 8 anos; Sofia, 5 anos",
      companionCount: "2",
      companionNames: "Lucas, Sofia",
      companionRelationship: "Filhos",
      familyObservations: "Gostam muito de finais de semana em família."
    },
    address: {
      residenceType: "Própria",
      hasPropertyInCity: false,
      cep: "38400-100",
      country: "Brasil",
      state: "MG",
      city: "Uberlândia",
      street: "Rua das Flores",
      number: "450",
      complement: "Apto 302",
      neighborhood: "Centro",
      referencePoint: "Próximo ao Shopping Plaza"
    },
    contacts: {
      phoneResDDD: "34",
      phoneResNumber: "3235-9000",
      phoneMobDDD: "34",
      phoneMobNumber: "99123-4567",
      phoneMob2DDD: "34",
      phoneMob2Number: "99123-9876",
      phoneComDDD: "34",
      phoneComNumber: "3211-1200",
      email: "rodrigo.alencar@gmail.com",
      mainWhatsapp: "34991234567",
      bestTimeToContact: "Tarde/Noite"
    },
    financial: {
      hasCreditCard: true,
      cardBrand: "Visa Infinite",
      familyIncome: "R$ 23.500,00",
      useCheque: false,
      activeFinancing: false,
      creditScore: "Alto (920)",
      financialObservations: "Finaceiramente saudáveis, sem restrições."
    },
    vehicles: {
      vehicle1Brand: "Toyota",
      vehicle1Model: "Corolla",
      vehicle1Year: "2023",
      vehicle1Plate: "ABC1D23",
      vehicle2Brand: "Jeep",
      vehicle2Model: "Compass",
      vehicle2Year: "2022",
      vehicle2Plate: "DEF4E56"
    },
    inspection: {
      description: "Amigáveis, focados em bem-estar familiar, já conheciam de folders ornamentados.",
      heardOfVenture: true,
      commercialObservations: "Valorizam espaço infantil e diárias de hospedagem simplificadas.",
      clientProfile: "Investidor / Lazer Familiar",
      buyingPotential: "Alto",
      restrictions: "Nenhuma identificada"
    },
    history: [
      { date: "2026-05-28 09:05", user: "Roberta Costa (Recepção)", description: "Primeiro cadastro do casal realizado com sucesso." },
      { date: "2026-05-28 10:30", user: "Marcos Oliveira", description: "Enviado para atendimento comercial." }
    ]
  },
  {
    id: "REC-1002",
    createdAt: "2026-05-28T11:20:00Z",
    receptionTime: "11:20",
    presentationDate: "2026-05-29",
    source: CoupleSource.REDES_SOCIAIS,
    lodging: LodgingPlace.LAGOA_ECO_TOWERS,
    captationPlace: CaptationPlace.INSTAGRAM,
    brokerName: "Fernando Souza",
    sdrName: "Henrique SDR",
    status: AttendanceStatus.CONTRATO_GERADO,
    observations: "Vieram pelo anúncio do Instagram das Eco Towers. Querem muito o título remido.",
    guest1: {
      name: "Doutor Marcelo Ramos Souza",
      age: "45",
      birthDate: "05/11/1980",
      retired: false,
      profession: "Médico Cardiologista",
      professionObservation: "Hospital Regional de Goiânia",
      cpf: "234.567.890-11",
      rg: "GO-4.567.890",
      nationality: "Brasileiro",
      civilStatus: "União Estável",
      schooling: "Pós-Graduação",
      company: "Clínica Cardiológica Ramos",
      role: "Diretor Médico",
      individualIncome: "R$ 32.000,00"
    },
    guest2: {
      name: "Juliana Mendes Abreu",
      age: "36",
      birthDate: "15/05/1990",
      retired: false,
      profession: "Juíza de Direito",
      professionObservation: "Tribunal de Justiça de Goiás",
      cpf: "345.678.901-22",
      rg: "GO-5.678.901",
      nationality: "Brasileira",
      civilStatus: "União Estável",
      schooling: "Doutorado",
      company: "Poder Judiciário de GO",
      role: "Magistrada",
      individualIncome: "R$ 29.000,00"
    },
    relation: {
      type: RelationType.UNIAO_ESTAVEL,
      timeYears: "6",
      timeMonths: "0",
      timeDays: "0",
      childrenCount: "0",
      childrenNamesAge: "",
      companionCount: "0",
      companionNames: "",
      companionRelationship: "",
      familyObservations: "Sem dependentes civis no momento, buscam exclusividade corporativa."
    },
    address: {
      residenceType: "Própria",
      hasPropertyInCity: true,
      cep: "74000-010",
      country: "Brasil",
      state: "GO",
      city: "Goiânia",
      street: "Avenida T-10",
      number: "1200",
      complement: "Penthouse 1",
      neighborhood: "Setor Bueno",
      referencePoint: "Próximo ao Parque Vaca Brava"
    },
    contacts: {
      phoneResDDD: "62",
      phoneResNumber: "3544-7777",
      phoneMobDDD: "62",
      phoneMobNumber: "98888-1122",
      phoneMob2DDD: "62",
      phoneMob2Number: "98222-3344",
      phoneComDDD: "62",
      phoneComNumber: "3200-5000",
      email: "marcelomedsouza@gmail.com",
      mainWhatsapp: "62988881122",
      bestTimeToContact: "Manhã"
    },
    financial: {
      hasCreditCard: true,
      cardBrand: "Mastercard Black Ouro",
      familyIncome: "R$ 61.000,00",
      useCheque: false,
      activeFinancing: false,
      creditScore: "Excelente (980)",
      financialObservations: "Rendimentos altíssimos, compra à vista facilitada."
    },
    vehicles: {
      vehicle1Brand: "BMW",
      vehicle1Model: "X5",
      vehicle1Year: "2024",
      vehicle1Plate: "BMW5X50",
      vehicle2Brand: "Porsche",
      vehicle2Model: "Macan",
      vehicle2Year: "2023",
      vehicle2Plate: "MAC3A23"
    },
    inspection: {
      description: "Alto padrão. Exigentes quanto à privacidade e qualidade de atendimento.",
      heardOfVenture: true,
      commercialObservations: "Fechamento rápido se houver isenção perpétua de manutenção (Remido).",
      clientProfile: "Investidor Premium",
      buyingPotential: "Altíssimo",
      restrictions: "Nenhuma"
    },
    history: [
      { date: "2026-05-28 11:21", user: "Roberta Costa (Recepção)", description: "Cadastro premium realizado na recepção." }
    ]
  },
  {
    id: "REC-1003",
    createdAt: "2026-05-29T08:30:00Z",
    receptionTime: "08:30",
    presentationDate: "2026-05-29",
    source: CoupleSource.INDICACAO,
    lodging: LodgingPlace.LAGOA_JARDINS,
    captationPlace: CaptationPlace.INDICACAO,
    brokerName: "Marcos Oliveira",
    sdrName: "Carla SDR",
    status: AttendanceStatus.EM_ATENDIMENTO,
    observations: "Indicados pelo Roddrigo Alencar (REC-1001), seus cunhados.",
    guest1: {
      name: "Thiago Soares Mendes",
      age: "31",
      birthDate: "10/10/1994",
      retired: false,
      profession: "Gerente Operacional",
      professionObservation: "Empresa de logística",
      cpf: "456.789.012-33",
      rg: "MG-14.567.892",
      nationality: "Brasileiro",
      civilStatus: "Casado",
      schooling: "Superior Completo",
      company: "Rápido TransGerais",
      role: "Gerente Geral",
      individualIncome: "R$ 6.200,00"
    },
    guest2: {
      name: "Amanda Silva Mendes",
      age: "29",
      birthDate: "03/02/1997",
      retired: false,
      profession: "Analista de RH",
      professionObservation: "Hospital Privado",
      cpf: "567.890.123-44",
      rg: "MG-15.890.123",
      nationality: "Brasileira",
      civilStatus: "Casada",
      schooling: "Superior Completo",
      company: "Mater Dei Uberlândia",
      role: "Analista Sênior",
      individualIncome: "R$ 4.800,00"
    },
    relation: {
      type: RelationType.CASADO,
      timeYears: "4",
      timeMonths: "2",
      timeDays: "0",
      childrenCount: "1",
      childrenNamesAge: "Arthur, 2 anos",
      companionCount: "1",
      companionNames: "Arthur",
      companionRelationship: "Filho",
      familyObservations: "Arthur adora piscina."
    },
    address: {
      residenceType: "Alugada",
      hasPropertyInCity: false,
      cep: "38408-200",
      country: "Brasil",
      state: "MG",
      city: "Uberlândia",
      street: "Av João Naves",
      number: "1800",
      complement: "Apto 101",
      neighborhood: "Santa Mônica",
      referencePoint: "Próximo à UFU"
    },
    contacts: {
      phoneResDDD: "",
      phoneResNumber: "",
      phoneMobDDD: "34",
      phoneMobNumber: "99234-5678",
      phoneMob2DDD: "34",
      phoneMob2Number: "99234-9000",
      phoneComDDD: "",
      phoneComNumber: "",
      email: "thiago.mendes.log@gmail.com",
      mainWhatsapp: "34992345678",
      bestTimeToContact: "Noite"
    },
    financial: {
      hasCreditCard: true,
      cardBrand: "Mastercard Platinum",
      familyIncome: "R$ 11.000,00",
      useCheque: false,
      activeFinancing: true,
      creditScore: "Médio (650)",
      financialObservations: "Financiamento habitacional de apartamento ativo."
    },
    vehicles: {
      vehicle1Brand: "Chevrolet",
      vehicle1Model: "Onix",
      vehicle1Year: "2021",
      vehicle1Plate: "XYZ9W87",
      vehicle2Brand: "",
      vehicle2Model: "",
      vehicle2Year: "",
      vehicle2Plate: ""
    },
    inspection: {
      description: "Muito solícitos, porém cautelosos com orçamento mensal.",
      heardOfVenture: true,
      commercialObservations: "Preferem parcelas mais suaves (Título Social Vitalício).",
      clientProfile: "Família Class B",
      buyingPotential: "Médio",
      restrictions: "Comprometimento parcial de renda devido a financiamento do apartamento."
    },
    history: [
      { date: "2026-05-29 08:31", user: "Roberta Costa (Recepção)", description: "Cadastro por indicação realizado." }
    ]
  }
];

export const INITIAL_ATENDIMENTOS: AtendimentoRecord[] = [
  {
    id: "AT-2001",
    receptionId: "REC-1001",
    brokerName: "Marcos Oliveira",
    date: "2026-05-29",
    startTime: "09:30",
    endTime: "10:45",
    attended: true,
    presentationDone: true,
    presentedProduct: "TÍTULO VITALÍCIO FAMILIAR",
    objections: "Parcela inicial apertada para o fluxo de caixa, mas gostaram dos benefícios.",
    clientInterest: "Alto",
    status: NegotiationStatus.VENDA_REALIZADA,
    observations: "Conversão bem-sucedida! Fechado na modalidade Entrada + parcelas."
  },
  {
    id: "AT-2002",
    receptionId: "REC-1002",
    brokerName: "Fernando Souza",
    date: "2026-05-29",
    startTime: "11:30",
    endTime: "12:50",
    attended: true,
    presentationDone: true,
    presentedProduct: "TÍTULO FAMILIAR VITALÍCIO REMIDO",
    objections: "Questões fiscais sobre o título de lazer familiar, resolvidas na hora.",
    clientInterest: "Alto",
    status: NegotiationStatus.EM_NEGOCIACAO,
    observations: "Casal em alta sintonia. Negociando crédito recorrente em 30 parcelas."
  },
  {
    id: "AT-2003",
    receptionId: "REC-1003",
    brokerName: "Marcos Oliveira",
    date: "2026-05-29",
    startTime: "08:45",
    endTime: "",
    attended: true,
    presentationDone: false,
    presentedProduct: "TÍTULO SOCIAL VITALÍCIO 3 PESSOAS",
    objections: "",
    clientInterest: "Médio",
    status: NegotiationStatus.EM_NEGOCIACAO,
    observations: "Apresentação em andamento no showroom principal dos brinquedos aquáticos."
  }
];

export const INITIAL_SALES: SalesRecord[] = [
  {
    id: "VND-4001",
    date: "2026-05-29",
    receptionId: "REC-1001",
    brokerName: "Marcos Oliveira",
    productId: "PROD-001",
    productName: "TÍTULO VITALÍCIO FAMILIAR",
    titleType: "Familiar Vitalício",
    peopleCount: "4",
    paymentMethod: PaymentMethod.ENTRADA_PARCELAS,
    totalPrice: 9600,
    downPayment: 1371.84,
    installmentsCount: 30,
    installmentValue: 274.27,
    remainingBalance: 8228.16,
    firstDueDate: "2026-06-20",
    paymentStatus: "Entrada Paga",
    contractStatus: "Contrato Assinado",
    observations: "Intermediado por Carla SDR. Autorizado desconto padrão de cortesia.",
    documents: [
      { name: "rg_cpf_titular.pdf", uploadedAt: "2026-05-29 10:48", size: "1.4 MB" },
      { name: "comprovante_residencia.pdf", uploadedAt: "2026-05-29 10:49", size: "850 KB" }
    ]
  },
  {
    id: "VND-4002",
    date: "2026-05-29",
    receptionId: "REC-1002",
    brokerName: "Fernando Souza",
    productId: "PROD-002",
    productName: "TÍTULO FAMILIAR VITALÍCIO REMIDO",
    titleType: "Familiar Remido",
    peopleCount: "2",
    paymentMethod: PaymentMethod.CREDITO_RECORRENTE,
    totalPrice: 18900,
    downPayment: 2835.00,
    installmentsCount: 30,
    installmentValue: 535.50,
    remainingBalance: 16065.00,
    firstDueDate: "2026-06-15",
    paymentStatus: "Aguardando",
    contractStatus: "Contrato Gerado",
    observations: "Intermediado por Henrique SDR. Casal premium.",
    documents: [
      { name: "crm_medico.pdf", uploadedAt: "2026-05-29 12:45", size: "2.1 MB" }
    ]
  }
];

export const INITIAL_CONTRATOS: ContractRecord[] = [
  {
    id: "CON-5001",
    saleId: "VND-4001",
    receptionId: "REC-1001",
    templateId: "TEMP-001",
    createdAt: "2026-05-29 10:55",
    buyerName: "Rodrigo Alencar Silva",
    status: "Assinado",
    pdfUrl: "#",
    signedFile: "contrato_REC-1001_assinado_final.pdf"
  },
  {
    id: "CON-5002",
    saleId: "VND-4002",
    receptionId: "REC-1002",
    templateId: "TEMP-002",
    createdAt: "2026-05-29 12:46",
    buyerName: "Doutor Marcelo Ramos Souza",
    status: "Pendente",
    pdfUrl: "#"
  }
];

export function getLocalStorageState() {
  if (typeof window === "undefined") {
    return {
      receptions: INITIAL_RECEPTIONS,
      atendimentos: INITIAL_ATENDIMENTOS,
      sales: INITIAL_SALES,
      contracts: INITIAL_CONTRATOS,
      products: INITIAL_PRODUCTS,
      users: INITIAL_USERS,
      currentUser: INITIAL_USERS[0], // Carlos Silva (Admin)
      templates: CONTRACT_TEMPLATES
    };
  }

  const load = <T>(key: string, backup: T): T => {
    const value = localStorage.getItem(`lagoa_lovers_${key}`);
    return value ? (JSON.parse(value) as T) : backup;
  };

  try {
    const receptions = load<ReceptionRecord[]>("receptions", INITIAL_RECEPTIONS);
    const atendimentos = load<AtendimentoRecord[]>("atendimentos", INITIAL_ATENDIMENTOS);
    const sales = load<SalesRecord[]>("sales", INITIAL_SALES);
    const contracts = load<ContractRecord[]>("contracts", INITIAL_CONTRATOS);
    const products = load<Product[]>("products", INITIAL_PRODUCTS);
    const users = load<SystemUser[]>("users", INITIAL_USERS);
    const currentUser = load<SystemUser>("currentUser", INITIAL_USERS[0]);
    const templates = load<ContractTemplate[]>("templates", CONTRACT_TEMPLATES);

    return { receptions, atendimentos, sales, contracts, products, users, currentUser, templates };
  } catch (error) {
    console.error("Erro ao carregar dados do LocalStorage:", error);
    return {
      receptions: INITIAL_RECEPTIONS,
      atendimentos: INITIAL_ATENDIMENTOS,
      sales: INITIAL_SALES,
      contracts: INITIAL_CONTRATOS,
      products: INITIAL_PRODUCTS,
      users: INITIAL_USERS,
      currentUser: INITIAL_USERS[0],
      templates: CONTRACT_TEMPLATES
    };
  }
}

export function saveLocalStorageState(state: {
  receptions: ReceptionRecord[];
  atendimentos: AtendimentoRecord[];
  sales: SalesRecord[];
  contracts: ContractRecord[];
  products: Product[];
  users: SystemUser[];
  currentUser: SystemUser;
  templates: ContractTemplate[];
}) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("lagoa_lovers_receptions", JSON.stringify(state.receptions));
    localStorage.setItem("lagoa_lovers_atendimentos", JSON.stringify(state.atendimentos));
    localStorage.setItem("lagoa_lovers_sales", JSON.stringify(state.sales));
    localStorage.setItem("lagoa_lovers_contracts", JSON.stringify(state.contracts));
    localStorage.setItem("lagoa_lovers_products", JSON.stringify(state.products));
    localStorage.setItem("lagoa_lovers_users", JSON.stringify(state.users));
    localStorage.setItem("lagoa_lovers_currentUser", JSON.stringify(state.currentUser));
    localStorage.setItem("lagoa_lovers_templates", JSON.stringify(state.templates));
  } catch (e) {
    console.error("Erro ao salvar dados no LocalStorage:", e);
  }
}
