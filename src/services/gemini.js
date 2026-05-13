export async function analisarExtrato(conteudo) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Você é um assistente financeiro. Analise o extrato bancário abaixo e retorne APENAS um JSON válido, sem texto adicional, sem markdown, sem explicações.

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