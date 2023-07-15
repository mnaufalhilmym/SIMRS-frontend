export default class SiteInfo {
  static title = import.meta.env.VITE_SITE_TITLE;
  static institutionName = import.meta.env.VITE_SITE_INSTITUTION_NAME;
  static footerText = import.meta.env.VITE_FOOTER_TEXT;
  static baseUrl = import.meta.env.VITE_BASE_URL;
  static backendUrl = import.meta.env.VITE_BACKEND_URL;
}
