/**
 * Generates the downloadable certificate PDF from a certificate record.
 * jsPDF is loaded on demand so it doesn't weigh down the main bundle.
 */
import type { CertificateData } from './CertificateView'
import { formatDate } from '../lib/format'
import { pdfSafe } from './pdfText'

export async function buildCertificatePdf(data: CertificateData) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const W = 297
  const H = 210
  const cx = W / 2
  doc.setProperties({ title: `Veleta Finance certificate ${data.id}`, subject: data.courseTitle, author: 'Veleta Finance', creator: 'Veleta Finance' })

  // Background and borders
  doc.setFillColor(248, 247, 253)
  doc.rect(0, 0, W, H, 'F')
  doc.setDrawColor(107, 78, 255)
  doc.setLineWidth(2.2)
  doc.roundedRect(9, 9, W - 18, H - 18, 6, 6)
  doc.setDrawColor(217, 209, 255)
  doc.setLineWidth(0.8)
  doc.roundedRect(14, 14, W - 28, H - 28, 4, 4)

  // Logo mark
  const lx = cx - 32
  const ly = 22
  doc.setFillColor(107, 78, 255)
  doc.roundedRect(lx, ly, 14, 14, 3.5, 3.5, 'F')
  doc.setDrawColor(255, 255, 255)
  doc.setLineWidth(1.6)
  doc.setLineCap('round')
  doc.setLineJoin('round')
  doc.lines([[3, 5.7], [3.8, -5.9]], lx + 3.3, ly + 4.1, [1, 1], 'S')
  doc.setFillColor(255, 255, 255)
  doc.triangle(lx + 8.2, ly + 3.2, lx + 11.1, ly + 2.7, lx + 10.8, ly + 5.6, 'F')
  doc.setFillColor(255, 200, 61)
  doc.circle(lx + 6.3, ly + 10, 1.1, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(29, 26, 53)
  doc.text('Veleta Finance', lx + 18, ly + 10)

  doc.setFontSize(12)
  doc.setTextColor(85, 54, 232)
  doc.setCharSpace(1.2)
  doc.text('CERTIFICATE OF COURSE COMPLETION', cx, 52, { align: 'center' })
  doc.setCharSpace(0)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(12)
  doc.setTextColor(85, 82, 111)
  doc.text('This certifies that', cx, 64, { align: 'center' })

  // Name, shrunk to fit
  const name = pdfSafe(data.recipientName).text
  doc.setFont('helvetica', 'bold')
  let size = 34
  doc.setFontSize(size)
  while (doc.getTextWidth(name) > 230 && size > 14) doc.setFontSize(--size)
  doc.setTextColor(29, 26, 53)
  doc.text(name, cx, 80, { align: 'center' })
  doc.setDrawColor(255, 200, 61)
  doc.setLineWidth(1)
  doc.line(cx - 60, 85, cx + 60, 85)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(12)
  doc.setTextColor(85, 82, 111)
  doc.text('has successfully completed the Veleta Finance course', cx, 95, { align: 'center' })
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(19)
  doc.setTextColor(66, 38, 196)
  const courseLines = doc.splitTextToSize(pdfSafe(data.courseTitle).text, 230) as string[]
  doc.text(courseLines.slice(0, 2), cx, 105, { align: 'center' })

  // Outcomes
  let y = 105 + courseLines.slice(0, 2).length * 8 + 4
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.setTextColor(61, 58, 88)
  doc.text('Learning outcomes assessed in the course:', cx, y, { align: 'center' })
  y += 5.5
  for (const o of data.outcomes.slice(0, 4)) {
    const lines = doc.splitTextToSize(`•  ${pdfSafe(o).text}`, 200) as string[]
    doc.text(lines[0] + (lines.length > 1 ? '…' : ''), cx, y, { align: 'center' })
    y += 5
  }

  // Meta row
  const metaY = 165
  const cols: [string, string][] = [
    ['Date awarded', formatDate(data.issuedAt)],
    ['Final exam score', `${Math.round(data.score * 100)}%`],
    ['Certificate ID', data.id],
  ]
  cols.forEach(([k, v], i) => {
    const x = cx + (i - 1) * 75
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(103, 100, 138)
    doc.text(k.toUpperCase(), x, metaY, { align: 'center' })
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(29, 26, 53)
    doc.text(v, x, metaY + 6, { align: 'center' })
  })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(103, 100, 138)
  if (data.demo) {
    doc.text('Demo certificate generated in Veleta demo mode. It is stored only in the learner’s browser and cannot be verified.', cx, 183, { align: 'center' })
  } else {
    doc.text('Educational course-completion credential issued by Veleta Finance. It is not an accredited qualification and does not confer', cx, 182, { align: 'center' })
    doc.text('professional or regulatory status. Verify this certificate at:', cx, 186, { align: 'center' })
    doc.setTextColor(85, 54, 232)
    doc.textWithLink(data.verifyUrl, cx - doc.getTextWidth(data.verifyUrl) / 2, 190.5, { url: data.verifyUrl })
  }

  if (data.demo) {
    doc.setTextColor(255, 90, 95)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(54)
    doc.setGState(doc.GState({ opacity: 0.12 }))
    doc.text('DEMO - NOT VERIFIABLE', cx, H / 2 + 20, { align: 'center', angle: 18 })
    doc.setGState(doc.GState({ opacity: 1 }))
  }
  return doc
}

export async function downloadCertificatePdf(data: CertificateData) {
  const doc = await buildCertificatePdf(data)
  doc.save(`veleta-certificate-${data.id}.pdf`)
}
