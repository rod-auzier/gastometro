import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

export async function lerArquivo(arquivo) {
  if (arquivo.type === 'application/pdf') {
    const arrayBuffer = await arquivo.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    let textoCompleto = ''

    for (let i = 1; i <= pdf.numPages; i++) {
      const pagina = await pdf.getPage(i)
      const conteudo = await pagina.getTextContent()
      const textoDaPagina = conteudo.items.map((item) => item.str).join(' ')
      textoCompleto += textoDaPagina + '\n'
    }

    return textoCompleto
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo'))
    reader.readAsText(arquivo, 'UTF-8')
  })
}