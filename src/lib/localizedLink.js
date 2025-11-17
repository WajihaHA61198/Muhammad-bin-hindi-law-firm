/**
 * Generate a localized link
 * @param {string} href - The path
 * @param {string} locale - The locale (en or ar)
 * @returns {string} - Localized path
 */
export function localizedLink(href, locale = "en") {
  if (locale === "ar") {
    return `/ar${href === "/" ? "" : href}`;
  }
  return href;
}

/**
 * Remove locale prefix from path
 * @param {string} pathname - The current pathname
 * @returns {string} - Path without locale
 */
export function removeLocalePrefix(pathname) {
  return pathname.replace(/^\/(ar|en)/, "") || "/";
}
