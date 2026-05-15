"use client";

import { firebaseConfig } from "./firebase.config";

const FIREBASE_VERSION = "10.14.1";
const firebaseAppUrl = `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app.js`;
const firebaseAuthUrl = `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-auth.js`;

type FirebaseAppModule = {
  getApps: () => unknown[];
  initializeApp: (config: typeof firebaseConfig) => unknown;
};

type FirebaseAuthModule = {
  getAuth: (app: unknown) => unknown;
  GoogleAuthProvider: new () => { setCustomParameters: (parameters: Record<string, string>) => void };
  getRedirectResult: (auth: unknown) => Promise<{ user: { getIdToken: () => Promise<string> } } | null>;
  signInWithPopup: (
    auth: unknown,
    provider: unknown
  ) => Promise<{ user: { getIdToken: () => Promise<string> } }>;
};

async function importRemoteModule<T>(url: string): Promise<T> {
  return import(/* webpackIgnore: true */ url) as Promise<T>;
}

async function getFirebaseAuth() {
  const { getApps, initializeApp } = await importRemoteModule<FirebaseAppModule>(firebaseAppUrl);
  const { getAuth } = await importRemoteModule<FirebaseAuthModule>(firebaseAuthUrl);
  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  return getAuth(app);
}

export async function signInWithGoogleProvider() {
  const auth = await getFirebaseAuth();
  const { GoogleAuthProvider, signInWithPopup } = await importRemoteModule<FirebaseAuthModule>(firebaseAuthUrl);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  const result = await signInWithPopup(auth, provider);
  return result.user.getIdToken();
}

export async function getGoogleRedirectIdToken() {
  const auth = await getFirebaseAuth();
  const { getRedirectResult } = await importRemoteModule<FirebaseAuthModule>(firebaseAuthUrl);
  const result = await getRedirectResult(auth);
  return result ? result.user.getIdToken() : null;
}
