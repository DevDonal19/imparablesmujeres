const assetMap = import.meta.glob('../assets/*', { eager: true, as: 'url' });

export const DOLL_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='768' viewBox='0 0 512 768'%3E%3Crect width='512' height='768' fill='%23f6a4fd'/%3E%3Ctext x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239f3876' font-family='sans-serif' font-size='32'%3EImparables%3C/text%3E%3C/svg%3E";

export const getAssetUrl = (fileName, fallback = DOLL_PLACEHOLDER) => assetMap[`../assets/${fileName}`] || fallback;

export default getAssetUrl;
