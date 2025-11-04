// firebase/firestoreService.js
import { doc, setDoc, getDoc, collection, addDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function createUserProfile({ uid, name, email }) {
  if (!uid) throw new Error('Missing uid');
  const ref = doc(db, 'users', uid);
  await setDoc(ref, { uid, name: name ?? '', email: email ?? '' });
  return true;
}

export async function getUserProfile(uid) {
  if (!uid) return null;
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function saveBooking(uid, booking) {
  if (!uid) throw new Error('Missing uid');
  const ref = collection(db, 'users', uid, 'bookings');
  const result = await addDoc(ref, booking);
  return result.id;
}

export async function getBookings(uid) {
  if (!uid) return [];
  const ref = collection(db, 'users', uid, 'bookings');
  const snap = await getDocs(ref);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function saveReview(hotelId, review) {
  if (!hotelId) throw new Error('Missing hotelId');
  const ref = collection(db, 'hotels', hotelId, 'reviews');
  const result = await addDoc(ref, review);
  return result.id;
}

export async function getReviews(hotelId) {
  if (!hotelId) return [];
  const ref = collection(db, 'hotels', hotelId, 'reviews');
  const snap = await getDocs(ref);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function updateUserProfile(uid, data) {
  if (!uid) throw new Error('Missing uid');
  const ref = doc(db, 'users', uid);
  await updateDoc(ref, data);
  return true;
}