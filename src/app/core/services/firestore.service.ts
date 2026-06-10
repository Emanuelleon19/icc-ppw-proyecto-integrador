import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
} from '@angular/fire/firestore';
import { ContactRequest } from '../models/request.model';

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  private fs = inject(Firestore);
  private col = collection(this.fs, 'requests');

  createRequest(data: Omit<ContactRequest, 'id'>) {
    return addDoc(this.col, {
      ...data,
      createdAt: Timestamp.now(),
    });
  }

  getRequestsByUser(uid: string) {
    return getDocs(query(this.col, where('uid', '==', uid)));
  }

  getRequestsByProgrammer(programmerSlug: string) {
    return getDocs(
      query(this.col, where('programmerSlug', '==', programmerSlug))
    );
  }

  updateRequest(id: string, data: Partial<ContactRequest>) {
    return updateDoc(doc(this.fs, 'requests', id), { ...data });
  }
}