import { db } from "../config/firebase.js";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp
} from "firebase/firestore";

const COLLECTION = "tasks";

export const createTasksService = (getUserId) => {
  return {
    async list(params = {}) {
      const userId = getUserId?.();
      if (!userId) return [];
      
      let q = query(
        collection(db, COLLECTION),
        where("userId", "==", userId)
      );
      
      const snap = await getDocs(q);
      let tasks = snap.docs.map((d) => {
        const data = d.data();
        return {
          _id: d.id,
          ...data,
          dueDate: data.dueDate?.toDate?.() ?? data.dueDate,
          createdAt: data.createdAt?.toDate?.() ?? data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() ?? data.updatedAt
        };
      });
      
      // Apply filters
      if (params.fromDate) {
        const from = params.fromDate instanceof Date ? params.fromDate : new Date(params.fromDate);
        tasks = tasks.filter((t) => {
          if (!t.dueDate) return false;
          const dueDate = t.dueDate instanceof Date ? t.dueDate : new Date(t.dueDate);
          return dueDate >= from;
        });
      }
      if (params.toDate) {
        const to = params.toDate instanceof Date ? params.toDate : new Date(params.toDate);
        tasks = tasks.filter((t) => {
          if (!t.dueDate) return false;
          const dueDate = t.dueDate instanceof Date ? t.dueDate : new Date(t.dueDate);
          return dueDate <= to;
        });
      }
      if (params.status) {
        tasks = tasks.filter((t) => t.status === params.status);
      }
      if (params.priority) {
        tasks = tasks.filter((t) => t.priority === params.priority);
      }
      
      return tasks;
    },

    async history(limitCount = 50) {
      const userId = getUserId?.();
      if (!userId) return [];
      
      const q = query(
        collection(db, COLLECTION),
        where("userId", "==", userId),
        orderBy("updatedAt", "desc"),
        limit(limitCount)
      );
      
      const snap = await getDocs(q);
      return snap.docs.map((d) => {
        const data = d.data();
        return {
          _id: d.id,
          ...data,
          dueDate: data.dueDate?.toDate?.() ?? data.dueDate,
          createdAt: data.createdAt?.toDate?.() ?? data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() ?? data.updatedAt
        };
      });
    },

    async create(payload) {
      const userId = getUserId?.();
      if (!userId) throw new Error("Not authenticated");
      
      const dueDate = payload.dueDate instanceof Date 
        ? Timestamp.fromDate(payload.dueDate)
        : Timestamp.fromDate(new Date(payload.dueDate));
      
      const docRef = await addDoc(collection(db, COLLECTION), {
        userId,
        title: payload.title,
        description: payload.description ?? "",
        dueDate,
        priority: payload.priority ?? "Medium",
        status: payload.status ?? "Pending",
        reminderSent: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      // Fetch the created document
      const docSnap = await getDoc(docRef);
      const docData = docSnap.data() ?? {};
      return {
        _id: docRef.id,
        ...docData,
        dueDate: docData.dueDate?.toDate?.() ?? docData.dueDate,
        createdAt: docData.createdAt?.toDate?.() ?? docData.createdAt,
        updatedAt: docData.updatedAt?.toDate?.() ?? docData.updatedAt
      };
    },

    async update(id, payload) {
      const ref = doc(db, COLLECTION, id);
      const updates = { ...payload, updatedAt: Timestamp.now() };
      
      // Convert dueDate to Timestamp if present
      if (updates.dueDate && !(updates.dueDate instanceof Timestamp)) {
        updates.dueDate = updates.dueDate instanceof Date
          ? Timestamp.fromDate(updates.dueDate)
          : Timestamp.fromDate(new Date(updates.dueDate));
      }
      
      await updateDoc(ref, updates);
      
      // Fetch updated document
      const docSnap = await getDoc(ref);
      const docData = docSnap.data() ?? {};
      return {
        _id: id,
        ...docData,
        dueDate: docData.dueDate?.toDate?.() ?? docData.dueDate,
        createdAt: docData.createdAt?.toDate?.() ?? docData.createdAt,
        updatedAt: docData.updatedAt?.toDate?.() ?? docData.updatedAt
      };
    },

    async updateStatus(id, status) {
      const ref = doc(db, COLLECTION, id);
      await updateDoc(ref, { status, updatedAt: Timestamp.now() });
      
      // Fetch updated document
      const docSnap = await getDoc(ref);
      const docData = docSnap.data() ?? {};
      return {
        _id: id,
        ...docData,
        dueDate: docData.dueDate?.toDate?.() ?? docData.dueDate,
        createdAt: docData.createdAt?.toDate?.() ?? docData.createdAt,
        updatedAt: docData.updatedAt?.toDate?.() ?? docData.updatedAt
      };
    },

    async remove(id) {
      await deleteDoc(doc(db, COLLECTION, id));
    }
  };
};
