import i18n from '../i18n';
import { GOV_AR, CITY_AR } from '../assets/placesAr';

// Stored place values are English; show the Arabic name when the UI is Arabic.
export function localizeGov(name) {
  if (!name || i18n.language !== 'ar') return name;
  return GOV_AR[name] ?? name;
}

export function localizeCity(name) {
  if (!name || i18n.language !== 'ar') return name;
  return CITY_AR[name] ?? name;
}
