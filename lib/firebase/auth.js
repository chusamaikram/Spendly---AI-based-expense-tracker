import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './config';
 
export const googleProvider = new GoogleAuthProvider();
 
export const signUpWithEmail = async (email, password, displayName) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName });
  return result;
};
 
export const signInWithEmail = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};
 
export const signInWithGoogle = async () => {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (err) {
    if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user') {
      return await signInWithRedirect(auth, googleProvider);
    }
    throw err;
  }
};
 
export const getGoogleRedirectResult = () => getRedirectResult(auth);
 
export const logOut = async () => {
  return await signOut(auth);
};
 
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};