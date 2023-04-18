import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionSnapshots } from '@angular/fire/firestore';
import { ProductosService } from 'src/servicios/productos.service';
import { Producto } from 'src/interfaces/Producto';
import { OrderByPipe } from 'src/servicios/orderBy.pipe.spec';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-productos',
  standalone: true,
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.less'],
  imports: [CommonModule, RouterModule]
})
export class ProductosComponent {
  filtrados: any;
  completado: boolean = false;
  productos: any;
  constructor(
    private fs: Firestore,
    private produ: ProductosService
  ) { }
  ngOnInit() {
    this.traeProductosFire();
    this.escucharProductos();
  }
  escucharProductos() {
    return collectionSnapshots(collection(this.fs, 'clientes')).subscribe((element: any) => {
      this.traeProductosFire();
    })
  }
  traeProductosFire() {
    this.produ.traerProductos().then(res => {
      res.subscribe(prods => {
        this.productos = [];
        this.filtrados = [];
        prods.forEach((item: any) => {
          let a: any = item;
          a['id'] = item.id;
          this.productos.push(a as Producto);
          this.filtrados.push(a as Producto);
        })

      })
    })
  }

  filtrar(llegando: any) {
    this.filtrados = this.productos.filter(
      (item: any) => {
        console.log(item);
        var haynombre = item.nombre.toLowerCase().indexOf(llegando.toLowerCase()) > -1;
        if (haynombre) {
          return true;
        } else {
          return false;
        }
      }
    )
  }
  verTodos() {
    this.filtrados = this.productos
  }
}
