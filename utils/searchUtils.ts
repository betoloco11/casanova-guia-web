/**
 * Utilidades de búsqueda avanzadas para Casanova Guía Web
 * Permite búsquedas insensibles a mayúsculas, minúsculas, tildes/acentos
 * y soporte para búsqueda por palabras clave múltiples en cualquier orden.
 */

export function normalizeSearchText(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quita acentos/tildes
    .toLowerCase()
    .trim();
}

export function matchesSearchQuery(business: any, query: string): boolean {
  if (!query || !query.trim()) return true;

  const qNorm = normalizeSearchText(query);
  const queryTokens = qNorm.split(/\s+/).filter(t => t.length > 0);

  const nameNorm = normalizeSearchText(business.name || '');
  const typeNorm = normalizeSearchText(business.type || '');
  const descNorm = normalizeSearchText(business.description || '');
  const addrNorm = normalizeSearchText(business.address || '');
  const landNorm = normalizeSearchText(business.landmarks || '');
  const catNorm = normalizeSearchText(business.categoryId || '');
  
  // Productos y servicios ofrecidos
  const prodsNorm = normalizeSearchText(
    (business.products || []).map((p: any) => `${p.name || ''} ${p.description || ''}`).join(' ')
  );

  // Palabras clave semánticas adicionales según el tipo de comercio
  let extraKeywords = '';
  if (typeNorm.includes('salon') || typeNorm.includes('fiesta') || typeNorm.includes('evento') || nameNorm.includes('emoji')) {
    extraKeywords = 'salon de fiestas salon de eventos multieventos pelotero cumpleanos animacion inflables shows';
  }

  const combined = `${nameNorm} ${typeNorm} ${descNorm} ${addrNorm} ${landNorm} ${catNorm} ${prodsNorm} ${extraKeywords}`;

  // 1. Coincidencia directa de frase completa
  if (combined.includes(qNorm)) return true;

  // 2. Coincidencia si todas las palabras buscadas están presentes en los datos
  return queryTokens.every(token => combined.includes(token));
}
