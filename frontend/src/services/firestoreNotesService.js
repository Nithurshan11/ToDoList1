import { db } from "../config/firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp
} from "firebase/firestore";

const COLLECTION = "notes";

export const createNotesService = (getUserId) => {
  return {
    async list() {
      const userId = getUserId?.();
      if (!userId) return [];
      
      const q = query(
        collection(db, COLLECTION),
        where("userId", "==", userId)
      );
      
      const snap = await getDocs(q);
      return snap.docs.map((d) => {
        const data = d.data();
        return {
          _id: d.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() ?? data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() ?? data.updatedAt
        };
      });
    },

    async create(payload) {
      const userId = getUserId?.();
      if (!userId) throw new Error("Not authenticated");
      
      const docRef = await addDoc(collection(db, COLLECTION), {
        userId,
        content: payload.content,
        color: payload.color ?? "#FFD966",
        position: payload.position ?? { x: 0, y: 0 },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      // Fetch the created document
      const docSnap = await getDoc(docRef);
      const docData = docSnap.data() ?? {};
      return {
        _id: docRef.id,
        ...docData,
        createdAt: docData.createdAt?.toDate?.() ?? docData.createdAt,
        updatedAt: docData.updatedAt?.toDate?.() ?? docData.updatedAt
      };
    },

    async update(id, payload) {
      const ref = doc(db, COLLECTION, id);
      await updateDoc(ref, {
        ...payload,
        updatedAt: Timestamp.now()
      });
      
      // Fetch updated document
      const docSnap = await getDoc(ref);
      const docData = docSnap.data() ?? {};
      return {
        _id: id,
        ...docData,
        createdAt: docData.createdAt?.toDate?.() ?? docData.createdAt,
        updatedAt: docData.updatedAt?.toDate?.() ?? docData.updatedAt
      };
    },

    async remove(id) {
      await deleteDoc(doc(db, COLLECTION, id));
    }
  };
};
