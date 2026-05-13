import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY)

export async function analisarExtrato(conteudo) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `
Você é um assistente financeiro. Analise o extrato bancário abaixo e retorne APENAS um JSON válido, sem texto adicional, sem markdown, sem explicações.

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
    { "nome": "Lazer", "valor": 0, "percentual": 0 },
    { "nome": "Saúde", "valor": 0, "percentual": 0 },
    { "nome": "Educação", "valor": 0, "percentual": 0 },
    { "nome": "Outros", "valor": 0, "percentual": 0 }
  ],
  "conselhos": [
    "conselho 1",
    "conselho 2",
    "conselho 3"
  ]
}

Extrato:
${conteudo}
`

  const result = await model.generateContent(prompt)
  const text = result.response.text()
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}