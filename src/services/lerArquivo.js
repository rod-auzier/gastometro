export function lerArquivo(arquivo) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo'))

    if (arquivo.type === 'application/pdf') {
      reader.readAsDataURL(arquivo)
    } else {
      reader.readAsText(arquivo, 'UTF-8')
    }
  })
}