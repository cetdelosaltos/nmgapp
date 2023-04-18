import { Component } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import * as XLSX from "xlsx";
import { Firestore, setDoc } from '@angular/fire/firestore';
import { doc } from '@firebase/firestore';
import Swal from 'sweetalert2';
import { pipe, map } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-importar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './importar.component.html',
  styleUrls: ['./importar.component.less']
})
export class ImportarComponent {
  libro: File | undefined;
  pagina: any = [];
  arrayBuffer: any;
  constructor(
    private fs: Firestore,
    private rutas: Router
  ) { }
  onFileChange(event: any) {
    var archivo = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(archivo);
    fileReader.onload = (e) => {
      var arrayBuffer: any = fileReader.result;
      var data = new Uint8Array(arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.pagina = [];
      arraylist.map((este: any) => {
        var produ = {
          id: este['Código'],
          sku: este['Código'],
          nombre: este['Descripción'],
          precio: este['Precio 1 USD $']
        };
        this.pagina.push(produ);
      })
      console.log(this.pagina)
    }

  }
  verLibro(pagina: any) {
    this.pagina = pagina.data.dataTable;
    this.pagina.forEach((element: any) => {
      console.log(element)
    });
  }
  subirProductos(libro: any) {
    libro.pipe(
      map((res: any) => {
        var produ = doc(this.fs, `productos/${res.id}`);
        setDoc(produ, res).then(() => {

        }).catch((err) => {
          console.error(err);
        })
        console.log(res);
      }
      ),
      () => {
        Swal.fire('Productos Agregados', '', 'success').then((res: any) => {
          if (res == 'confirmed') {
            this.rutas.navigate(['/pedidos/productos'])
          }
        })
      }
    )
  }
}
