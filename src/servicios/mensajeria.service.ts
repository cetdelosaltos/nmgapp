import { Injectable } from '@angular/core';
import { Firestore, addDoc, doc, docData, setDoc, updateDoc } from '@angular/fire/firestore';
import { getToken, getMessaging, Messaging, onMessage } from '@angular/fire/messaging';
import { collection } from '@firebase/firestore';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MensajeriaService {
  mesaje: any;
  constructor(
    private msm: Messaging,
    private db: Firestore
  ) { }
  registrarTipo(tipo: any) {
    const mensa = getMessaging();
    getToken(mensa, { vapidKey: environment.firebase.vapidKey }).then(
      (tok: any) => {
        var metido = doc(this.db, 'gente/' + tipo);
        setDoc(metido, { toque: tok });
        /*  docData(metido).subscribe((res) => {
           if (res) {
             updateDoc(metido, { toque: tok });
           } else {
             var nuevo = collection(this.db, 'gente');
           }
         }) */
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
}
