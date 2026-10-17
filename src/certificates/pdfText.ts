/** jsPDF's built-in fonts use WinAnsi (Latin-1); replace anything else so the PDF never shows garbage. */
export function pdfSafe(text: string): { text: string; lossy: boolean } {
  let lossy = false
  const out = [...text.normalize('NFC')].map((ch) => {
    const code = ch.codePointAt(0)!
    if (code < 0x20) return ''
    if (code <= 0xff || '‘’“”–—…•€'.includes(ch)) return ch
    lossy = true
    return '?'
  }).join('')
  return { text: out, lossy }
}
