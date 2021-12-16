import { vars } from '../components/data/vars';

export const showRotateOverlay = (width, height) => {
  if (width < height) {
    vars.overlayRotateDom.classList.add('visible');
  } else {
    vars.overlayRotateDom.classList.remove('visible');
  }
};
