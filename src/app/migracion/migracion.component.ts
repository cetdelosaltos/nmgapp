import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { set, get, ref, Database, onValue, } from '@angular/fire/database';
import { Firestore, addDoc, collection, doc, setDoc } from '@angular/fire/firestore';
@Component({
  selector: 'app-migracion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './migracion.component.html',
  styleUrls: ['./migracion.component.less']
})
export class MigracionComponent {
  compradores: any = [];
  constructor(
    private db: Database,
    private fs: Firestore,
  ) { }
  migrarCompradores() {
    const clientes = ref(this.db, 'tienda/clientes');
    onValue(clientes, (snap) => {
      this.compradores = [];
      snap.forEach((clie) => {
        clie.val();
        let a: any = clie.toJSON();
        a['id'] = clie.key;
        this.compradores.push(a);
        const clicol = doc(this.fs, 'clientes/' + clie.key);
        setDoc(clicol, a).then(res => {
          console.log(res);
        }).catch((err) => {
          console.error(err);
        });
      })
    });
  }
  migrarProductos() {
    const clientes = ref(this.db, 'tienda/productos');
    onValue(clientes, (snap) => {
      this.compradores = [];
      snap.forEach((clie) => {
        clie.val();
        let a: any = clie.toJSON();
        a['id'] = clie.key;
        this.compradores.push(a);
        const clicol = doc(this.fs, 'productos/' + clie.key);
        setDoc(clicol, a).then(res => {
          console.log(res);
        }).catch((err) => {
          console.error(err);
        });
      })
    });
  }
  migrarReservas() {
    const clientes = ref(this.db, 'reservaciones');
    onValue(clientes, (snap) => {
      this.compradores = [];
      snap.forEach((clie) => {
        clie.val();
        let a: any = clie.toJSON();
        a['id'] = clie.key;
        this.compradores.push(a);
        const clicol = doc(this.fs, 'reservaciones/' + clie.key);
        setDoc(clicol, a).then(res => {
          console.log(res);
        }).catch((err) => {
          console.error(err);
        });
      })
    });
  }
}
