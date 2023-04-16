import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AutenticoService {

  constructor(
    private db: Firestore
  ) { }
  guardar(tipo: any) {
    const listas = collection(this.db, 'gente');
    return addDoc(listas, tipo);
  }
}
