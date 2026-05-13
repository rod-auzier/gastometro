import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { analisarExtrato } from './services/gemini'
import { lerArquivo } from './services/lerArquivo'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function App() {
  const [arquivos, setArquivos] = useState([])
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [erro, setErro] = useState(null)
  const [categoriaAberta, setCategoriaAberta] = useState(null)

  const onDrop = useCallback((arquivosAceitos) => {
    setArquivos(arquivosAceitos.slice(0, 2))
    setResultado(null)
    setErro(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'], 'application/pdf': ['.pdf'] },
    maxFiles: 2,
  })

  async function handleAnalisar() {
    if (arquivos.length === 0) return
    setLoading(true)
    setErro(null)
    try {
      const conteudos = await Promise.all(arquivos.map(lerArquivo))
      const conteudoUnido = conteudos.join('\n\n---\n\n')
      const dados = await analisarExtrato(conteudoUnido)
      setResultado(dados)
    } catch (e) {
      setErro('Erro ao analisar o extrato. Tente novamente.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#F5F7FA] min-h-screen">

      {/* Navbar */}
      <nav className="bg-[#1E3A5F] px-10 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-[#F97316] rounded-md p-1">
            <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
              <path d="M6 14l3-4 2 2 3-5 3 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-white font-medium text-xl">
            Gast<span className="text-[#F97316] font-bold">ômetro</span>
          </span>
        </div>
        
      </nav>

      {/* Hero */}
      <div className="bg-[#1E3A5F] px-10 py-14 text-center">
        <h1 className="text-white text-4xl font-bold mb-3">
          Gast<span className="text-[#F97316]">ômetro</span>
        </h1>
        <p className="text-[#B8CCDF] text-base max-w-md mx-auto leading-relaxed">
          Arraste extratos e faturas de qualquer banco. Nossa IA entende e organiza tudo automaticamente!
        </p>
        <p className="text-[#7A9AB8] text-sm mt-1">
          Nubank, Itaú, Bradesco e mais — PDF ou CSV
        </p>
        <div className="flex justify-center gap-3 mt-7 flex-wrap">
          <span className="bg-white border border-[#E2E8F0] text-[#1E3A5F] px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">📊 Gráficos Visuais</span>
          <span className="bg-white border border-[#E2E8F0] text-[#1E3A5F] px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">🏷️ Categorização Automática</span>
          <span className="bg-white border border-[#E2E8F0] text-[#1E3A5F] px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">💡 Conselhos Financeiros</span>
        </div>
      </div>

      {/* Card de upload */}
      <div className="max-w-2xl mx-auto px-10 py-9">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-7 shadow-sm">

          {/* Mini cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {["Análise por IA", "100% privado", "Sem cadastro"].map((item) => (
              <div key={item} className="bg-[#F8FAFC] border border-[#E9EEF5] rounded-lg p-3 text-center">
                <div className="w-2 h-2 bg-[#F97316] rounded-full mx-auto mb-2"></div>
                <span className="text-[#1E3A5F] text-xs font-medium">{item}</span>
              </div>
            ))}
          </div>

          {/* Área de upload */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-[#F97316] bg-[#FFF3E8]' : 'border-[#CBD5E0] hover:border-[#F97316]'
            }`}
          >
            <input {...getInputProps()} />
            <svg className="mx-auto mb-3" width="44" height="44" viewBox="0 0 44 44" fill="none">
              <circle cx="22" cy="22" r="20" fill="#FFF3E8" stroke="#F97316" strokeWidth="1.2"/>
              <path d="M22 28V18M22 18l-4 4M22 18l4 4" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 30h16" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
            </svg>
            {arquivos.length === 0 ? (
              <>
                <p className="text-[#1E3A5F] font-medium">Clique para selecionar os CSVs ou PDFs</p>
                <p className="text-[#94A3B8] text-sm mt-1">Arraste e solte também</p>
                <p className="text-[#CBD5E0] text-xs mt-1">Máximo de 2 arquivos por análise</p>
              </>
            ) : (
              <div className="space-y-1">
                {arquivos.map((f) => (
                  <p key={f.name} className="text-[#1E3A5F] font-medium text-sm">✅ {f.name}</p>
                ))}
                <p className="text-[#94A3B8] text-xs mt-2">Clique para trocar os arquivos</p>
              </div>
            )}
          </div>

          {/* Erro */}
          {erro && (
            <p className="text-red-500 text-sm text-center mt-3">{erro}</p>
          )}

          {/* Botão */}
          <button
            onClick={handleAnalisar}
            disabled={arquivos.length === 0 || loading}
            className={`w-full py-4 rounded-lg text-base font-bold uppercase tracking-wide mt-4 transition-colors ${
              arquivos.length > 0 && !loading
                ? 'bg-[#C2410C] hover:bg-[#9A3412] text-white cursor-pointer'
                : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
            }`}
          >
            {loading ? 'Analisando...' : 'Analisar Gastos'}
          </button>

          <p className="text-center text-[#94A3B8] text-xs mt-3">
            A inteligência artificial pode cometer erros. Sempre confira com seus dados oficiais.
          </p>
        </div>

        {/* Resultado */}
        {resultado && (
          <div className="mt-6 space-y-4">

            {/* Resumo */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
              <h2 className="text-[#1E3A5F] font-bold text-lg mb-4">📋 Resumo</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-[#94A3B8] text-xs mb-1">Total Gasto</p>
                  <p className="text-red-500 font-bold text-xl">R$ {resultado.resumo.totalGasto.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-[#94A3B8] text-xs mb-1">Entradas</p>
                  <p className="text-green-500 font-bold text-xl">R$ {resultado.resumo.totalEntradas.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-[#94A3B8] text-xs mb-1">Saldo</p>
                  <p className={`font-bold text-xl ${resultado.resumo.saldo >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    R$ {resultado.resumo.saldo.toFixed(2)}
                  </p>
                </div>
              </div>
              <p className="text-[#94A3B8] text-xs text-center mt-3">📅 {resultado.resumo.periodo}</p>
            </div>

            {/* Categorias */}
<div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
  <h2 className="text-[#1E3A5F] font-bold text-lg mb-4">🏷️ Gastos por Categoria</h2>
  
  {/* Gráfico de Pizza */}
  <ResponsiveContainer width="100%" height={320} style={{ pointerEvents: 'none' }}>
  <PieChart>
    <Pie
  data={resultado.categorias.filter(c => c.valor > 0)}
  dataKey="valor"
  nameKey="nome"
  cx="50%"
  cy="50%"
  outerRadius={110}
  isAnimationActive={false}
>
      {resultado.categorias.filter(c => c.valor > 0).map((_, index) => (
        <Cell
  key={index}
  fill={[
    '#F97316', '#1E3A5F', '#22C55E', '#EF4444',
    '#8B5CF6', '#06B6D4', '#F59E0B', '#EC4899',
    '#10B981', '#94A3B8'
  ][index % 10]}
  stroke="none"
/>
      ))}
    </Pie>
    <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
    <Legend
      layout="horizontal"
      verticalAlign="bottom"
      align="center"
      wrapperStyle={{ paddingTop: '20px', fontSize: '12px', lineHeight: '24px' }}
    />
  </PieChart>
</ResponsiveContainer>

  {/* Barras */}
<div className="space-y-3 mt-4">
  {resultado.categorias.filter(c => c.valor > 0).map((cat) => (
    <div key={cat.nome}>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-[#1E3A5F] font-medium">{cat.nome}</span>
        <div className="flex items-center gap-3">
          <span className="text-[#94A3B8]">R$ {cat.valor.toFixed(2)} ({cat.percentual}%)</span>
          <button
            onClick={() => setCategoriaAberta(categoriaAberta === cat.nome ? null : cat.nome)}
            className="text-[#F97316] text-xs font-medium hover:underline"
          >
            {categoriaAberta === cat.nome ? 'Fechar' : 'Ver mais'}
          </button>
        </div>
      </div>
      <div className="w-full bg-[#F1F5F9] rounded-full h-2">
        <div
          className="bg-[#F97316] h-2 rounded-full"
          style={{ width: `${cat.percentual}%` }}
        ></div>
      </div>

      {/* Transações expandidas */}
      {categoriaAberta === cat.nome && cat.transacoes && (
        <div className="mt-2 bg-[#F8FAFC] rounded-lg border border-[#E9EEF5] overflow-hidden">
          {cat.transacoes.map((t, i) => (
            <div key={i} className="flex justify-between items-center px-4 py-2 border-b border-[#E9EEF5] last:border-0">
              <div>
                <p className="text-[#1E3A5F] text-sm font-medium">{t.descricao}</p>
                <p className="text-[#94A3B8] text-xs">{t.data}</p>
              </div>
              <span className="text-red-500 text-sm font-medium">R$ {t.valor.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  ))}
</div>
</div>

            {/* Conselhos */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
              <h2 className="text-[#1E3A5F] font-bold text-lg mb-4">💡 Conselhos Financeiros</h2>
              <div className="space-y-2">
                {resultado.conselhos.map((conselho, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="text-[#F97316] font-bold text-sm mt-0.5">→</span>
                    <p className="text-[#475569] text-sm">{conselho}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  )
}

export default App