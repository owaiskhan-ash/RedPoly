import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import {
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocFromServer,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  type Timestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export interface CatalogueEntry {
  price: number;
  href: string;
  image: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface WishlistItem {
  name: string;
  href: string;
  image: string;
  price: number;
}

export interface PrivateProfile {
  uid: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  pinCode: string;
  city: string;
  state: string;
}

export type OrderStatus = 'placed' | 'fulfilled' | 'cancelled';

export interface OrderRecord {
  id: string;
  uid: string;
  reference: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  pin: string;
  city: string;
  state: string;
  shippingMethod: 'standard' | 'express';
  shippingCost: number;
  freeShipping: boolean;
  freeGift: boolean;
  subtotal: number;
  gstRate: number;
  gst: number;
  total: number;
  itemCount: number;
  status: OrderStatus;
  createdAtMs: number;
  items: Array<{ name: string; price: number; quantity: number }>;
}

export interface PlaceOrderInput {
  reference: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  pin: string;
  city: string;
  state: string;
  shippingMethod: 'standard' | 'express';
  shippingCost: number;
  freeShipping: boolean;
  freeGift: boolean;
  subtotal: number;
  gstRate: number;
  gst: number;
  total: number;
  items: CartItem[];
  saveProfile: boolean;
}

// Defensive constants synchronized verbatim with firebase-blueprint.json
const LIMITS = {
  ID_MAX: 128,
  ID_PATTERN: /^[a-zA-Z0-9_\-]+$/,
  DISPLAY_NAME_MAX: 120,
  PHOTO_URL_MAX: 500,
  EMAIL_MAX: 200,
  FULL_NAME_MAX: 120,
  PHONE_PATTERN: /^[6-9][0-9]{9}$/,
  ADDRESS_MAX: 300,
  PIN_PATTERN: /^[1-9][0-9]{5}$/,
  CITY_MAX: 100,
  STATE_MAX: 100,
  HREF_MAX: 200,
  HREF_PATTERN: /^\/[a-zA-Z0-9_\-/?=&]+$/,
  IMAGE_MAX: 300,
  IMAGE_PATTERN: /^\/[a-zA-Z0-9_\-./?=&]+$/,
  QTY_MIN: 1,
  QTY_MAX: 99,
};

const CATALOGUE: Record<string, CatalogueEntry> = {
  'BUBBLE GUN': {
    price: 499,
    href: '/bubble-gun',
    image: '/assets/images/redpoly/products/bubble-gun-thumb.webp?v=bubble-20261121',
  },
  'STUNT PET': {
    price: 599,
    href: '/stunt-pet',
    image: '/assets/images/redpoly/products/stunt-pet-thumb.webp?v=pet-20261122',
  },
  'MINI COOL CAR': {
    price: 749,
    href: '/mini-cool-car',
    image: '/assets/images/redpoly/products/mini-cool-car-thumb.webp?v=car-20261117',
  },
  'GEL STORM': {
    price: 1999,
    href: '/gel-storm',
    image: '/assets/images/redpoly/products/gel-storm-thumb.webp?v=gel-20261121',
  },
  'MECHA ROVER': {
    price: 499,
    href: '/mecha-rover',
    image: '/assets/images/redpoly/products/mecha-rover-thumb.webp?v=mecha-20261120',
  },
  'PIXEL SPLASH': {
    price: 1749,
    href: '/pixel-splash',
    image: '/assets/images/redpoly/products/pixel-splash-thumb.webp?v=pixel-20261117-v3',
  },
  'CUTE DINOS GREEN': {
    price: 249,
    href: '/cute-dinos?colour=green',
    image: '/assets/images/redpoly/products/cute-dinos-green-thumb.webp?v=dinos-20261116',
  },
  'CUTE DINOS RED': {
    price: 249,
    href: '/cute-dinos?colour=red',
    image: '/assets/images/redpoly/products/cute-dinos-red-thumb.webp?v=dinos-20261116',
  },
  'CUTE DINOS TEAL': {
    price: 249,
    href: '/cute-dinos?colour=teal',
    image: '/assets/images/redpoly/products/cute-dinos-teal-thumb.webp?v=dinos-20261116',
  },
  'CUTE DINOS TRIO': {
    price: 549,
    href: '/cute-dinos?pack=trio',
    image: '/assets/images/redpoly/products/cute-dinos-trio-thumb.webp?v=dinos-20261116',
  },
};

const CART_STORAGE_KEY = 'redpoly-cart-v1';
const WISH_STORAGE_KEY = 'redpoly-wishlist-v1';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
void testConnection();

function itemSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, LIMITS.ID_MAX);
}

function inCatalogue(name: string, price: number): boolean {
  return Object.prototype.hasOwnProperty.call(CATALOGUE, name) && CATALOGUE[name].price === Number(price);
}

function sanitizeUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim().slice(0, LIMITS.PHOTO_URL_MAX);
  return trimmed.startsWith('https://') ? trimmed : '';
}

function clampQty(qty: number): number {
  const n = Math.floor(Number(qty) || 1);
  return Math.max(LIMITS.QTY_MIN, Math.min(LIMITS.QTY_MAX, n));
}

function readLocalCart(): CartItem[] {
  try {
    const raw = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) || '[]');
    if (!Array.isArray(raw)) return [];
    return raw
      .filter(
        (item) =>
          item &&
          typeof item.name === 'string' &&
          inCatalogue(item.name, item.price) &&
          Number.isFinite(Number(item.quantity)) &&
          Number(item.quantity) >= 1
      )
      .map((item) => ({
        id: `${item.name.toLowerCase()}|${Number(item.price)}`,
        name: item.name,
        price: Number(item.price),
        quantity: clampQty(item.quantity),
      }));
  } catch {
    return [];
  }
}

function readLocalWishlist(): WishlistItem[] {
  try {
    const raw = JSON.parse(window.localStorage.getItem(WISH_STORAGE_KEY) || '[]');
    if (!Array.isArray(raw)) return [];
    return raw
      .filter(
        (item) =>
          item &&
          typeof item.name === 'string' &&
          typeof item.href === 'string' &&
          LIMITS.HREF_PATTERN.test(item.href) &&
          inCatalogue(item.name, item.price)
      )
      .map((item) => ({
        name: item.name,
        href: item.href.slice(0, LIMITS.HREF_MAX),
        image:
          typeof item.image === 'string' && LIMITS.IMAGE_PATTERN.test(item.image)
            ? item.image.slice(0, LIMITS.IMAGE_MAX)
            : CATALOGUE[item.name].image,
        price: Number(item.price),
      }));
  } catch {
    return [];
  }
}

// State managed by the Firebase bridge
let currentUser: User | null = null;
let authReady = false;
let currentProfile: PrivateProfile | null = null;
let currentOrders: OrderRecord[] = [];
let unsubCart: Unsubscribe | null = null;
let unsubWish: Unsubscribe | null = null;
let unsubOrders: Unsubscribe | null = null;

function dispatch(name: string, detail: unknown): void {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

function stopListeners(): void {
  if (unsubCart) {
    unsubCart();
    unsubCart = null;
  }
  if (unsubWish) {
    unsubWish();
    unsubWish = null;
  }
  if (unsubOrders) {
    unsubOrders();
    unsubOrders = null;
  }
}

async function ensureUserDocuments(user: User): Promise<PrivateProfile> {
  const userPath = `users/${user.uid}`;
  const profilePath = `users/${user.uid}/private/profile`;
  const displayName = (user.displayName || user.email?.split('@')[0] || 'REDPOLY Member')
    .trim()
    .slice(0, LIMITS.DISPLAY_NAME_MAX) || 'REDPOLY Member';
  const photoURL = sanitizeUrl(user.photoURL);
  const email = (user.email || '').trim().slice(0, LIMITS.EMAIL_MAX);

  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        displayName,
        photoURL,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      const existing = userSnap.data();
      if (existing.displayName !== displayName || (existing.photoURL || '') !== photoURL) {
        await updateDoc(userRef, {
          displayName,
          photoURL,
          updatedAt: serverTimestamp(),
        });
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, userPath);
  }

  try {
    const profileRef = doc(db, 'users', user.uid, 'private', 'profile');
    const profileSnap = await getDoc(profileRef);
    if (!profileSnap.exists()) {
      const initialProfile: PrivateProfile = {
        uid: user.uid,
        email,
        fullName: displayName.slice(0, LIMITS.FULL_NAME_MAX),
        phone: '',
        address: '',
        pinCode: '',
        city: '',
        state: '',
      };
      await setDoc(profileRef, {
        ...initialProfile,
        updatedAt: serverTimestamp(),
      });
      return initialProfile;
    }
    const data = profileSnap.data();
    return {
      uid: user.uid,
      email: typeof data.email === 'string' && data.email ? data.email : email,
      fullName: typeof data.fullName === 'string' ? data.fullName : displayName,
      phone: typeof data.phone === 'string' ? data.phone : '',
      address: typeof data.address === 'string' ? data.address : '',
      pinCode: typeof data.pinCode === 'string' ? data.pinCode : '',
      city: typeof data.city === 'string' ? data.city : '',
      state: typeof data.state === 'string' ? data.state : '',
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, profilePath);
  }
}

async function mergeAndSubscribeCart(uid: string): Promise<void> {
  const cartPath = `users/${uid}/cart`;
  const q = query(collection(db, 'users', uid, 'cart'), where('uid', '==', uid));
  try {
    const existingSnap = await getDocs(q);
    const remoteMap = new Map<string, { name: string; price: number; quantity: number }>();
    existingSnap.forEach((docSnap) => {
      const d = docSnap.data();
      if (typeof d.name === 'string' && inCatalogue(d.name, d.price)) {
        remoteMap.set(docSnap.id, {
          name: d.name,
          price: Number(d.price),
          quantity: clampQty(d.quantity),
        });
      }
    });

    const localItems = readLocalCart();
    for (const item of localItems) {
      const slug = itemSlug(item.name);
      if (!LIMITS.ID_PATTERN.test(slug)) continue;
      if (!remoteMap.has(slug)) {
        await setDoc(doc(db, 'users', uid, 'cart', slug), {
          uid,
          name: item.name,
          price: item.price,
          quantity: clampQty(item.quantity),
          updatedAt: serverTimestamp(),
        });
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, cartPath);
  }

  unsubCart = onSnapshot(
    q,
    (snapshot) => {
      const synced: CartItem[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        if (typeof d.name === 'string' && inCatalogue(d.name, d.price)) {
          synced.push({
            id: `${d.name.toLowerCase()}|${Number(d.price)}`,
            name: d.name,
            price: Number(d.price),
            quantity: clampQty(d.quantity),
          });
        }
      });
      try {
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(synced));
      } catch {
        /* ignore storage quota errors */
      }
      dispatch('redpoly:cart-updated', { items: synced });
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, cartPath);
    }
  );
}

async function mergeAndSubscribeWishlist(uid: string): Promise<void> {
  const wishPath = `users/${uid}/wishlist`;
  const q = query(collection(db, 'users', uid, 'wishlist'), where('uid', '==', uid));
  try {
    const existingSnap = await getDocs(q);
    const remoteSet = new Set<string>();
    existingSnap.forEach((docSnap) => remoteSet.add(docSnap.id));

    const localItems = readLocalWishlist();
    for (const item of localItems) {
      const slug = itemSlug(item.name);
      if (!LIMITS.ID_PATTERN.test(slug) || remoteSet.has(slug)) continue;
      await setDoc(doc(db, 'users', uid, 'wishlist', slug), {
        uid,
        name: item.name,
        href: item.href,
        image: item.image,
        price: item.price,
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, wishPath);
  }

  unsubWish = onSnapshot(
    q,
    (snapshot) => {
      const synced: WishlistItem[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        if (
          typeof d.name === 'string' &&
          typeof d.href === 'string' &&
          LIMITS.HREF_PATTERN.test(d.href) &&
          inCatalogue(d.name, d.price)
        ) {
          synced.push({
            name: d.name,
            href: d.href,
            image: typeof d.image === 'string' ? d.image : CATALOGUE[d.name].image,
            price: Number(d.price),
          });
        }
      });
      try {
        window.localStorage.setItem(WISH_STORAGE_KEY, JSON.stringify(synced));
      } catch {
        /* ignore storage errors */
      }
      dispatch('redpoly:wishlist-updated', { items: synced });
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, wishPath);
    }
  );
}

function subscribeOrders(uid: string): void {
  const ordersPath = `users/${uid}/orders`;
  const q = query(collection(db, 'users', uid, 'orders'), where('uid', '==', uid));
  unsubOrders = onSnapshot(
    q,
    async (snapshot) => {
      const orders: OrderRecord[] = [];
      for (const docSnap of snapshot.docs) {
        const d = docSnap.data();
        const ts = d.createdAt as Timestamp | undefined;
        const createdAtMs = ts && typeof ts.toMillis === 'function' ? ts.toMillis() : Date.now();
        let lineItems: Array<{ name: string; price: number; quantity: number }> = [];
        const itemsPath = `users/${uid}/orders/${docSnap.id}/items`;
        try {
          const itemsSnap = await getDocs(
            query(collection(db, 'users', uid, 'orders', docSnap.id, 'items'), where('uid', '==', uid))
          );
          itemsSnap.forEach((itemDoc) => {
            const itemData = itemDoc.data();
            if (typeof itemData.name === 'string') {
              lineItems.push({
                name: itemData.name,
                price: Number(itemData.price),
                quantity: Number(itemData.quantity),
              });
            }
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.LIST, itemsPath);
        }

        const statusVal: OrderStatus =
          d.status === 'fulfilled' || d.status === 'cancelled' ? d.status : 'placed';

        orders.push({
          id: docSnap.id,
          uid: String(d.uid || uid),
          reference: String(d.reference || ''),
          customerName: String(d.customerName || ''),
          email: String(d.email || ''),
          phone: String(d.phone || ''),
          address: String(d.address || ''),
          pin: String(d.pin || ''),
          city: String(d.city || ''),
          state: String(d.state || ''),
          shippingMethod: d.shippingMethod === 'express' ? 'express' : 'standard',
          shippingCost: Number(d.shippingCost || 0),
          freeShipping: Boolean(d.freeShipping),
          freeGift: Boolean(d.freeGift),
          subtotal: Number(d.subtotal || 0),
          gstRate: Number(d.gstRate || 12),
          gst: Number(d.gst || 0),
          total: Number(d.total || 0),
          itemCount: Number(d.itemCount || lineItems.length),
          status: statusVal,
          createdAtMs,
          items: lineItems,
        });
      }
      orders.sort((a, b) => b.createdAtMs - a.createdAtMs);
      currentOrders = orders;
      dispatch('redpoly:orders-updated', { orders });
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, ordersPath);
    }
  );
}

onAuthStateChanged(auth, async (user) => {
  stopListeners();
  currentUser = user;
  authReady = true;

  if (!user) {
    currentProfile = null;
    currentOrders = [];
    dispatch('redpoly:auth-changed', { user: null, profile: null });
    dispatch('redpoly:orders-updated', { orders: [] });
    return;
  }

  try {
    currentProfile = await ensureUserDocuments(user);
    dispatch('redpoly:auth-changed', {
      user: {
        uid: user.uid,
        displayName: user.displayName || currentProfile.fullName || 'REDPOLY Member',
        email: user.email || currentProfile.email,
        photoURL: sanitizeUrl(user.photoURL),
        emailVerified: user.emailVerified,
      },
      profile: currentProfile,
    });
    await mergeAndSubscribeCart(user.uid);
    await mergeAndSubscribeWishlist(user.uid);
    subscribeOrders(user.uid);
  } catch (error) {
    console.error('Failed to initialize signed-in REDPOLY session:', error);
    dispatch('redpoly:auth-error', {
      message: 'Signed in, but could not sync account data. Please try refreshing.',
    });
  }
});

export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: unknown) {
    const code = typeof error === 'object' && error && 'code' in error ? String((error as { code: unknown }).code) : '';
    if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
      return null;
    }
    throw error;
  }
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

export async function syncCartItem(item: CartItem): Promise<void> {
  if (!currentUser || !currentUser.emailVerified) return;
  if (!inCatalogue(item.name, item.price)) return;
  const slug = itemSlug(item.name);
  if (!LIMITS.ID_PATTERN.test(slug)) return;
  const path = `users/${currentUser.uid}/cart/${slug}`;
  try {
    const ref = doc(db, 'users', currentUser.uid, 'cart', slug);
    const existing = await getDoc(ref);
    if (existing.exists()) {
      await updateDoc(ref, {
        quantity: clampQty(item.quantity),
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(ref, {
        uid: currentUser.uid,
        name: item.name,
        price: item.price,
        quantity: clampQty(item.quantity),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function removeCartItem(name: string): Promise<void> {
  if (!currentUser || !currentUser.emailVerified) return;
  const slug = itemSlug(name);
  if (!LIMITS.ID_PATTERN.test(slug)) return;
  const path = `users/${currentUser.uid}/cart/${slug}`;
  try {
    await deleteDoc(doc(db, 'users', currentUser.uid, 'cart', slug));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveWishlistItem(item: WishlistItem): Promise<void> {
  if (!currentUser || !currentUser.emailVerified) return;
  if (!inCatalogue(item.name, item.price) || !LIMITS.HREF_PATTERN.test(item.href)) return;
  const slug = itemSlug(item.name);
  if (!LIMITS.ID_PATTERN.test(slug)) return;
  const path = `users/${currentUser.uid}/wishlist/${slug}`;
  try {
    await setDoc(doc(db, 'users', currentUser.uid, 'wishlist', slug), {
      uid: currentUser.uid,
      name: item.name,
      href: item.href.slice(0, LIMITS.HREF_MAX),
      image:
        typeof item.image === 'string' && LIMITS.IMAGE_PATTERN.test(item.image)
          ? item.image.slice(0, LIMITS.IMAGE_MAX)
          : CATALOGUE[item.name].image,
      price: item.price,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function removeWishlistItem(name: string): Promise<void> {
  if (!currentUser || !currentUser.emailVerified) return;
  const slug = itemSlug(name);
  if (!LIMITS.ID_PATTERN.test(slug)) return;
  const path = `users/${currentUser.uid}/wishlist/${slug}`;
  try {
    await deleteDoc(doc(db, 'users', currentUser.uid, 'wishlist', slug));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveDeliveryProfile(profile: Omit<PrivateProfile, 'uid'>): Promise<PrivateProfile> {
  if (!currentUser || !currentUser.emailVerified) {
    throw new Error('Sign in with Google to save your delivery profile.');
  }
  const uid = currentUser.uid;
  const path = `users/${uid}/private/profile`;
  const cleanPhone = profile.phone.trim();
  const cleanPin = profile.pinCode.trim();
  if (cleanPhone && !LIMITS.PHONE_PATTERN.test(cleanPhone)) {
    throw new Error('Enter a valid 10-digit Indian mobile number.');
  }
  if (cleanPin && !LIMITS.PIN_PATTERN.test(cleanPin)) {
    throw new Error('Enter a valid 6-digit Indian PIN code.');
  }
  const sanitized: PrivateProfile = {
    uid,
    email: (profile.email || currentUser.email || '').trim().slice(0, LIMITS.EMAIL_MAX),
    fullName: profile.fullName.trim().slice(0, LIMITS.FULL_NAME_MAX),
    phone: cleanPhone,
    address: profile.address.trim().slice(0, LIMITS.ADDRESS_MAX),
    pinCode: cleanPin,
    city: profile.city.trim().slice(0, LIMITS.CITY_MAX),
    state: profile.state.trim().slice(0, LIMITS.STATE_MAX),
  };
  try {
    const ref = doc(db, 'users', uid, 'private', 'profile');
    await setDoc(
      ref,
      {
        ...sanitized,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    currentProfile = sanitized;
    dispatch('redpoly:profile-updated', { profile: sanitized });
    return sanitized;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function placeOrder(input: PlaceOrderInput): Promise<void> {
  if (!currentUser || !currentUser.emailVerified) return;
  const uid = currentUser.uid;
  const orderId = input.reference.toLowerCase().replace(/[^a-z0-9\-]/g, '');
  if (!LIMITS.ID_PATTERN.test(orderId)) {
    throw new Error('Invalid order reference');
  }
  const validItems = input.items.filter((item) => inCatalogue(item.name, item.price));
  if (!validItems.length) {
    throw new Error('No valid catalogue items in order');
  }

  const orderPath = `users/${uid}/orders/${orderId}`;
  const batch = writeBatch(db);
  const orderRef = doc(db, 'users', uid, 'orders', orderId);

  const customerName = input.customerName.trim().slice(0, LIMITS.FULL_NAME_MAX);
  const email = input.email.trim().slice(0, LIMITS.EMAIL_MAX);
  const phone = input.phone.trim();
  const address = input.address.trim().slice(0, LIMITS.ADDRESS_MAX);
  const pin = input.pin.trim();
  const city = input.city.trim().slice(0, LIMITS.CITY_MAX);
  const state = input.state.trim().slice(0, LIMITS.STATE_MAX);
  const itemCount = validItems.reduce((sum, item) => sum + clampQty(item.quantity), 0);

  batch.set(orderRef, {
    uid,
    reference: input.reference,
    customerName,
    email,
    phone,
    address,
    pin,
    city,
    state,
    shippingMethod: input.shippingMethod,
    shippingCost: Number(input.shippingCost),
    freeShipping: Boolean(input.freeShipping),
    freeGift: Boolean(input.freeGift),
    subtotal: Number(input.subtotal),
    gstRate: Number(input.gstRate),
    gst: Number(input.gst),
    total: Number(input.total),
    itemCount,
    status: 'placed',
    createdAt: serverTimestamp(),
  });

  for (const item of validItems) {
    const slug = itemSlug(item.name);
    batch.set(doc(db, 'users', uid, 'orders', orderId, 'items', slug), {
      uid,
      orderId,
      name: item.name,
      price: Number(item.price),
      quantity: clampQty(item.quantity),
    });
    batch.delete(doc(db, 'users', uid, 'cart', slug));
  }

  if (input.saveProfile) {
    batch.set(
      doc(db, 'users', uid, 'private', 'profile'),
      {
        uid,
        email,
        fullName: customerName,
        phone,
        address,
        pinCode: pin,
        city,
        state,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, orderPath);
  }
}

const ADMIN_EMAIL = 'ashketchupkeke@gmail.com';

export function isAdminUser(): boolean {
  return Boolean(currentUser && currentUser.emailVerified && currentUser.email === ADMIN_EMAIL);
}

export async function listAllOrders(): Promise<OrderRecord[]> {
  if (!isAdminUser()) {
    throw new Error('Admin access required to view all store orders.');
  }
  const cgPath = 'orders';
  try {
    const snapshot = await getDocs(collectionGroup(db, 'orders'));
    const orders: OrderRecord[] = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const d = docSnap.data();
        const ts = d.createdAt as Timestamp | undefined;
        const createdAtMs = ts && typeof ts.toMillis === 'function' ? ts.toMillis() : 0;
        const orderUid = String(d.uid || docSnap.ref.parent.parent?.id || '');
        const lineItems: Array<{ name: string; price: number; quantity: number }> = [];
        const itemsPath = `${docSnap.ref.path}/items`;
        try {
          const itemsSnap = await getDocs(collection(docSnap.ref, 'items'));
          itemsSnap.forEach((itemDoc) => {
            const itemData = itemDoc.data();
            if (typeof itemData.name === 'string') {
              lineItems.push({
                name: itemData.name,
                price: Number(itemData.price),
                quantity: Number(itemData.quantity),
              });
            }
          });
        } catch (itemErr) {
          handleFirestoreError(itemErr, OperationType.LIST, itemsPath);
        }

        const statusVal: OrderStatus =
          d.status === 'fulfilled' || d.status === 'cancelled' ? d.status : 'placed';

        return {
          id: docSnap.id,
          uid: orderUid,
          reference: String(d.reference || ''),
          customerName: String(d.customerName || ''),
          email: String(d.email || ''),
          phone: String(d.phone || ''),
          address: String(d.address || ''),
          pin: String(d.pin || ''),
          city: String(d.city || ''),
          state: String(d.state || ''),
          shippingMethod: d.shippingMethod === 'express' ? 'express' : 'standard',
          shippingCost: Number(d.shippingCost || 0),
          freeShipping: Boolean(d.freeShipping),
          freeGift: Boolean(d.freeGift),
          subtotal: Number(d.subtotal || 0),
          gstRate: Number(d.gstRate || 12),
          gst: Number(d.gst || 0),
          total: Number(d.total || 0),
          itemCount: Number(d.itemCount || lineItems.length),
          status: statusVal,
          createdAtMs,
          items: lineItems,
        };
      })
    );
    orders.sort((a, b) => b.createdAtMs - a.createdAtMs);
    return orders;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, cgPath);
  }
}

export async function updateOrderStatus(
  uid: string,
  orderId: string,
  status: OrderStatus
): Promise<void> {
  if (!isAdminUser()) {
    throw new Error('Admin access required to update order status.');
  }
  if (!LIMITS.ID_PATTERN.test(uid) || !LIMITS.ID_PATTERN.test(orderId)) {
    throw new Error('Invalid order identifier.');
  }
  if (status !== 'placed' && status !== 'fulfilled' && status !== 'cancelled') {
    throw new Error('Invalid order status.');
  }
  const orderPath = `users/${uid}/orders/${orderId}`;
  try {
    await updateDoc(doc(db, 'users', uid, 'orders', orderId), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, orderPath);
  }
}

const api = {
  isReady: () => authReady,
  isAdmin: isAdminUser,
  getUser: () =>
    currentUser
      ? {
          uid: currentUser.uid,
          displayName: currentUser.displayName || currentProfile?.fullName || 'REDPOLY Member',
          email: currentUser.email || currentProfile?.email || '',
          photoURL: sanitizeUrl(currentUser.photoURL),
          emailVerified: currentUser.emailVerified,
        }
      : null,
  getProfile: () => currentProfile,
  getOrders: () => currentOrders,
  signInWithGoogle,
  signOut: signOutUser,
  syncCartItem,
  removeCartItem,
  saveWishlistItem,
  removeWishlistItem,
  saveDeliveryProfile,
  placeOrder,
  listAllOrders,
  updateOrderStatus,
};

declare global {
  interface Window {
    RedpolyFirebase?: typeof api;
  }
}

window.RedpolyFirebase = api;
dispatch('redpoly:firebase-ready', { user: api.getUser(), profile: currentProfile });
