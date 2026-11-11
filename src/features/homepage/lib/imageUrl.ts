/** True for images served from the app's own `/public` folder. */
export function isLocalImageUrl(url: string): boolean {
  return url.startsWith("/");
}

/** Reject stored promo values that are web pages rather than image files. */
export function isDisplayableImageUrl(url?: string): boolean {
  if (!url) return false;
  if (isLocalImageUrl(url)) return true;
  try {
    const pathname = new URL(url).pathname;
    return /\.(png|jpe?g|webp|gif|avif|svg)$/i.test(pathname);
  } catch {
    return false;
  }
}
