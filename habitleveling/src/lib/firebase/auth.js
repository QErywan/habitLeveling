import { _onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./config";

export function onAuthChanged(callback) {
    return _onAuthStateChanged(auth, callback);
};


export async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
        const userCredential = await signInWithPopup(auth, provider);
        return userCredential;
    } catch (error) {
        console.error("Error signing in with Google", error);
    }
}

// maybe get this to work also idk
export async function stuff(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error("Error signing in with email and password", error);
    }
}

export async function signOut() {
    try {
        await auth.signOut();
    } catch (error) {
        console.error("Error signing out", error);
    }
}