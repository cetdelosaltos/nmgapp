import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDocs, setDoc } from '@angular/fire/firestore';
import { getToken, getMessaging, Messaging, onMessage } from '@angular/fire/messaging';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MensajeriaService {
  mesaje: any;
  cabezas: any = new HttpHeaders();
  lagente: any;
  constructor(
    private msm: Messaging,
    private db: Firestore,
    private app: HttpClient,
  ) { }
  encabezados() {
    var clavecita = `key=AAAATmU0GvA:APA91bGB_FbRg0GZ59908YyzMoX75QwlDtIHsQyhRSACS1fTgaZiVW-DJXU-x0ES79zK2HpFiX-qDRmtYfKX_MpZ3WuBGDG0ugse5wDa75XcF0bHynpsrkjHvlSYNk-fheed9cSnOrgf`;
    this.cabezas = {
      'Content-Type': 'application/json',
      'Authorization': clavecita
    };
    return this.cabezas;
  }
  registrarTipo(tipo: any) {
    const mensa = getMessaging();
    getToken(mensa, { vapidKey: environment.firebase.vapidKey }).then(
      (tok: any) => {
        var metido = doc(this.db, 'gente/' + tipo);
        setDoc(metido, { notitoque: tok });
      }).catch(
        (err: any) => {
          console.error(err)
        })
  }
  oye() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      this.mesaje = payload;
    });
  }
  async enviarNota(reserva: any) {
    var gente: any = [];
    const traegente = await getDocs(collection(this.db, 'gente'));
    traegente.forEach(gen => {
      console.log(gen.data());
      gente.push(gen.data()['notitoque']);
    })
    const datos = {
      "registration_ids": gente,
      "notification": {
        "title": reserva.titulo,
        "body": reserva.cuerpo
      }
    }
    this.app.post('https://fcm.googleapis.com/fcm/send', datos, { headers: this.encabezados() }).subscribe(
      (res: any) => { }
    )
  }
}

