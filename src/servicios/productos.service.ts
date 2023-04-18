import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, getDocs, orderBy, query } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(
    private fs: Firestore
  ) { }
  async traerProductos() {
    var ordenados = query(collection(this.fs, 'productos'), orderBy('nombre', 'asc'));
    var traidos = collectionData(ordenados);
    return traidos;
  }
}
