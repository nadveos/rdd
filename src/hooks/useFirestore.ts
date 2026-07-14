// src/hooks/useFirestore.ts
import { useState, useEffect, useCallback } from 'react';
import {
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc,
  onSnapshot, query, orderBy, Timestamp, type QueryConstraint
} from 'firebase/firestore';
import { db } from '../firebase/config';

export function useCollection<T extends { id: string }>(
  collectionName: string,
  constraints: QueryConstraint[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, collectionName), ...constraints);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as T));
        setData(items);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName]);

  const add = useCallback(async (item: Omit<T, 'id'>) => {
    const ref = await addDoc(collection(db, collectionName), {
      ...item,
      createdAt: Timestamp.now(),
    });
    return ref.id;
  }, [collectionName]);

  const update = useCallback(async (id: string, item: Partial<Omit<T, 'id'>>) => {
    await updateDoc(doc(db, collectionName, id), { ...item, updatedAt: Timestamp.now() });
  }, [collectionName]);

  const remove = useCallback(async (id: string) => {
    await deleteDoc(doc(db, collectionName, id));
  }, [collectionName]);

  return { data, loading, error, add, update, remove };
}

export async function getDocOnce<T>(collectionName: string): Promise<T[]> {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as T));
}

export { orderBy };
