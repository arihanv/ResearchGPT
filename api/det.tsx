import { Deta } from 'deta';

const deta = Deta(process.env.NEXT_PUBLIC_DETAKEY as string)
const drive = deta.Drive('embeds')

export default drive;