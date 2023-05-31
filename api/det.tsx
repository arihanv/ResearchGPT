import { Deta } from 'deta';

const deta = Deta(process.env.NEXT_PUBLIC_DETAKEY as string)
const drive = deta.Drive('embeds')
export default drive;

const pdf = Deta(process.env.NEXT_PUBLIC_PDFKEY as string)
const pdfStore = pdf.Drive('PDFStorage');
const pdfDb = pdf.Base('PDFdb')
export {pdfStore, pdfDb}
