import {
    initializeApp,
    getApps,
    App,
    getApp,
    cert

} from 'firebase-admin/app';

import { getFirestore } from "firebase-admin/firestore";  

// this file that we installed from firbase service account key
// allow the admin to access the database
const serviceKey = process.env.FIREBASE_SERVICE_KEY;

let app: App;

if (!getApps().length) {
    app = initializeApp({
        credential: cert(serviceKey),
    });
} else {
    app = getApp();
}
const adminDb = getFirestore(app);

export { app as adminApp ,  adminDb };
