export async function analisarExtrato(conteudo) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Você é um assistente financeiro especialista em análise de extratos bancários brasileiros. Analise o extrato abaixo e retorne APENAS um JSON válido, sem texto adicional, sem markdown, sem explicações.

REGRAS IMPORTANTES:
- Ignore completamente movimentações de cofrinho ("Dinheiro guardado" e "Dinheiro resgatado")
- Ignore transferências entre contas próprias (quando o nome do destinatário/remetente for igual ou muito similar ao do titular)
- Ignore rendimentos de conta (são automáticos, não são gastos nem entradas reais)
- Considere como ENTRADAS apenas: salários, pagamentos recebidos de terceiros, Pix recebidos de outras pessoas
- Considere como GASTOS apenas: compras, pagamentos de contas, Pix enviados para terceiros e serviços

REGRAS DE CATEGORIZAÇÃO (seja inteligente e use o contexto do nome):
- Alimentação: iFood, restaurantes, lanchonetes, mercados, supermercados, atacadistas, padarias, bebidas, delivery
- Transporte: posto de gasolina, combustível, Uber, 99, táxi, estacionamento, pedágio
- Saúde: farmácia, médico, dentista, hospital, clínica, plano de saúde, Unimed, odontológico
- Educação: escola, faculdade, curso, universidade, livro, material escolar
- Lazer: streaming, cinema, teatro, show, jogo, viagem, hotel
- Moradia: luz, água, energia, internet, telefone, condomínio, aluguel, IPTU, gás
- Vestuário: roupa, calçado, loja de roupas, moda
- Impostos/Taxas: Polícia Federal, prefeitura, município, DETRAN, governo, tributo, taxa
- Serviços Digitais: PagBrasil, AIBR, instituição de pagamento, fintech
- Outros: apenas o que realmente não se encaixar em nenhuma categoria acima

O JSON deve ter exatamente essa estrutura:
{
  "resumo": {
    "totalGasto": 0,
    "totalEntradas": 0,
    "saldo": 0,
    "periodo": "mês/ano ou intervalo identificado"
  },
  "categorias": [
    { "nome": "Alimentação", "valor": 0, "percentual": 0 },
    { "nome": "Transporte", "valor": 0, "percentual": 0 },
    { "nome": "Saúde", "valor": 0, "percentual": 0 },
    { "nome": "Educação", "valor": 0, "percentual": 0 },
    { "nome": "Lazer", "valor": 0, "percentual": 0 },
    { "nome": "Moradia", "valor": 0, "percentual": 0 },
    { "nome": "Vestuário", "valor": 0, "percentual": 0 },
    { "nome": "Impostos/Taxas", "valor": 0, "percentual": 0 },
    { "nome": "Serviços Digitais", "valor": 0, "percentual": 0 },
    { "nome": "Outros", "valor": 0, "percentual": 0 }
  ],
  "conselhos": [
    "conselho 1",
    "conselho 2",
    "conselho 3"
  ]
}

Extrato:
${conteudo}`
          }]
        }]
      })
    }
  )

  const data = await response.json()

  if (!response.ok) {
    console.error('Erro Gemini:', data)
    throw new Error(data.error?.message || 'Erro na API')
  }

  const text = data.candidates[0].content.parts[0].text
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}