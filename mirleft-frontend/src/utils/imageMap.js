import legziraArch from '../assets/mirleft/legzira-arch.jpg'
import legziraBeach from '../assets/mirleft/legzira-beach.jpg'
import legziraBeauty from '../assets/mirleft/legzira-beauty.jpg'
import mirleft2 from '../assets/mirleft/mirleft-2.jpg'
import mirleft3 from '../assets/mirleft/mirleft-3.jpg'
import plageMirleft from '../assets/mirleft/plage-mirleft.jpg'
import sunsetMirleft from '../assets/mirleft/sunset-mirleft.jpg'
import wondersMirleft from '../assets/mirleft/wonders-mirleft.jpg'

const images = {
  'legzira-arch': legziraArch,
  'legzira-beach': legziraBeach,
  'legzira-beauty': legziraBeauty,
  'mirleft-2': mirleft2,
  'mirleft-3': mirleft3,
  'plage-mirleft': plageMirleft,
  'sunset-mirleft': sunsetMirleft,
  'wonders-mirleft': wondersMirleft,
}

export function resolveImage(image, fallback = wondersMirleft) {
  if (!image) return fallback
  return images[image] ?? image
}

export { images }
