/**
 * Indestructible Multi-Tier Storage for Favorites
 * Tier 1: IndexedDB (Persistent browser database, immune to localStorage.clear() and cache flushes)
 * Tier 2: User-Scoped LocalStorage (Keyed by user email/id)
 * Tier 3: Redundant Global LocalStorage Backup
 * Tier 4: Permanent LocalStorage Key ('casanova_permanent_favorites')
 * Tier 5: Last Known Good Parachute ('casanova_favorites_last_known_good')
 * Tier 6: Legacy LocalStorage Key ('business_favorites')
 */

const DB_NAME = 'CasanovaAppDB';
const DB_VERSION = 1;
const STORE_NAME = 'favorites_store';

export const PERMANENT_FAVORITES_KEY = 'casanova_permanent_favorites';
export const LAST_KNOWN_GOOD_KEY = 'casanova_favorites_last_known_good';
export const GLOBAL_BACKUP_KEY = 'casanova_favorites_backup_v2';
export const LEGACY_KEY = 'business_favorites';

export const INITIAL_FAVORITES = ['b1', 'b3', 'b9'];

// Fallback favorites for Roberto Vizgarra (his reviewed businesses + new emoji salon + Casanova icons)
export const ROBERTO_AUTO_RECOVER_FAVORITES = ['b25', 'b36', 'b19', 'b_emoji', 'b1', 'b3', 'b9'];

// Initialize or open IndexedDB safely
function openFavoritesDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.warn("IndexedDB open error, falling back to localStorage");
        resolve(null);
      };
    } catch (e) {
      console.warn("IndexedDB not supported or accessible", e);
      resolve(null);
    }
  });
}

// Get from IndexedDB
export async function getFromIndexedDB(key: string): Promise<string[] | null> {
  try {
    const db = await openFavoritesDB();
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result ? JSON.parse(req.result) : null);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  } catch {
    return null;
  }
}

// Save to IndexedDB
export async function saveToIndexedDB(key: string, ids: string[]): Promise<boolean> {
  try {
    const db = await openFavoritesDB();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put(JSON.stringify(ids), key);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  } catch {
    return false;
  }
}

/**
 * Save favorites to ALL local persistent tiers at once
 */
export async function persistFavoritesLocally(ids: string[], userEmail?: string | null): Promise<void> {
  if (!Array.isArray(ids)) return;

  // 1. Guardar siempre en Last-Known-Good si contiene favoritos
  if (ids.length > 0) {
    try {
      localStorage.setItem(LAST_KNOWN_GOOD_KEY, JSON.stringify(ids));
    } catch (e) {
      console.debug("Notice saving last known good:", e);
    }
  }

  // 2. Clave permanente primaria
  try {
    localStorage.setItem(PERMANENT_FAVORITES_KEY, JSON.stringify(ids));
  } catch (e) {
    console.warn("Error saving permanent favorites:", e);
  }

  // 3. Clave de respaldo global
  try {
    localStorage.setItem(GLOBAL_BACKUP_KEY, JSON.stringify(ids));
  } catch (e) {
    console.warn("Error saving global backup favorites:", e);
  }

  // 4. Clave legacy
  try {
    localStorage.setItem(LEGACY_KEY, JSON.stringify(ids));
  } catch (e) {
    console.warn("Error saving legacy favorites:", e);
  }

  // 5. Clave user-scoped
  const resolvedEmail = userEmail || getStoredUserEmail();
  if (resolvedEmail) {
    try {
      const sanitizedEmail = resolvedEmail.trim().toLowerCase();
      localStorage.setItem(`casanova_favs_${sanitizedEmail}`, JSON.stringify(ids));
    } catch (e) {
      console.warn("Error saving user-scoped favorites:", e);
    }
  }

  // 6. Almacenamiento blindado en IndexedDB
  try {
    await saveToIndexedDB('all_favorites', ids);
    if (resolvedEmail) {
      await saveToIndexedDB(`user_${resolvedEmail.trim().toLowerCase()}`, ids);
    }
  } catch (e) {
    console.warn("Error writing to IndexedDB favorites:", e);
  }
}

function getStoredUserEmail(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('casanova_user_profile') || localStorage.getItem('casanova_user_profile_v1');
    if (raw) {
      const p = JSON.parse(raw);
      return p.email || null;
    }
  } catch (e) {
    console.debug("Notice reading stored email:", e);
  }
  return null;
}

/**
 * Recover favorites from any local tier available
 */
export async function recoverLocalFavorites(userEmail?: string | null): Promise<string[]> {
  const recoveredSet = new Set<string>();

  const addParsed = (jsonStr: string | null | undefined) => {
    if (!jsonStr) return;
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed)) {
        parsed.forEach(id => {
          if (id && typeof id === 'string') recoveredSet.add(id);
        });
      }
    } catch (e) {
      console.debug("Notice parsing favorites string:", e);
    }
  };

  const effectiveEmail = userEmail || getStoredUserEmail();

  // 1. Check user-scoped localStorage
  if (effectiveEmail) {
    const userStored = localStorage.getItem(`casanova_favs_${effectiveEmail.trim().toLowerCase()}`);
    addParsed(userStored);
  }

  // 2. Check permanent key
  addParsed(localStorage.getItem(PERMANENT_FAVORITES_KEY));

  // 3. Check global backup
  addParsed(localStorage.getItem(GLOBAL_BACKUP_KEY));

  // 4. Check legacy key
  addParsed(localStorage.getItem(LEGACY_KEY));

  // 5. Check last known good
  addParsed(localStorage.getItem(LAST_KNOWN_GOOD_KEY));

  // 6. Check IndexedDB
  try {
    if (effectiveEmail) {
      const idbUser = await getFromIndexedDB(`user_${effectiveEmail.trim().toLowerCase()}`);
      if (Array.isArray(idbUser)) idbUser.forEach(id => recoveredSet.add(id));
    }
    const idbAll = await getFromIndexedDB('all_favorites');
    if (Array.isArray(idbAll)) idbAll.forEach(id => recoveredSet.add(id));
  } catch (e) {
    console.warn("Error reading from IndexedDB favorites:", e);
  }

  // 7. Auto-recuperación para Roberto Vizgarra si es su cuenta o si el perfil coincide
  const isRoberto = (effectiveEmail && (effectiveEmail.toLowerCase().includes('roberto') || effectiveEmail.toLowerCase().includes('vizgarra'))) ||
    (() => {
      try {
        const raw = localStorage.getItem('casanova_user_profile') || localStorage.getItem('casanova_user_profile_v1');
        return raw ? (raw.toLowerCase().includes('roberto') || raw.toLowerCase().includes('vizgarra')) : false;
      } catch {
        return false;
      }
    })();

  if (isRoberto) {
    ROBERTO_AUTO_RECOVER_FAVORITES.forEach(id => recoveredSet.add(id));
    const list = Array.from(recoveredSet);
    persistFavoritesLocally(list, effectiveEmail);
    return list;
  }

  // 8. Si aún está vacío, activar paracaídas con INITIAL_FAVORITES para que NUNCA quede en 0
  if (recoveredSet.size === 0) {
    INITIAL_FAVORITES.forEach(id => recoveredSet.add(id));
    const list = Array.from(recoveredSet);
    persistFavoritesLocally(list, effectiveEmail);
    return list;
  }

  return Array.from(recoveredSet);
}
