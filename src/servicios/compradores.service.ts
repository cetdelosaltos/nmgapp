import { Injectable } from '@angular/core';
import { Firestore, collection, collectionSnapshots, deleteDoc, doc, docData, getDocs } from '@angular/fire/firestore';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompradoresService {

  constructor(
    private fs: Firestore
  ) { }
  async GetClientes() {
    var todos = collection(this.fs, 'clientes')
    var traidos = await getDocs(todos);
    var llevados: any = []
    traidos.forEach((res: any) => {
      var datico = res.data();
      datico.id = res.id;
      llevados.push(datico);
    })
    console.log(llevados);
    return llevados;
  }
  async eliminarComprador(seva: any) {
    var borrable = doc(this.fs, `clientes/${seva.id}`);
    return deleteDoc(borrable)
  }

  async compradoresOye() {
    const refOfInbox = collection(this.fs, `clientes`);
    return collectionSnapshots(refOfInbox);
  }
}
