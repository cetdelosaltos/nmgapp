export interface Reservaciones {
  $key?: string;
  comprador: string;
  reservas: {
    cantidad: number;
    observacion: string;
    producto: string;
  };
  locacion: string,
  fecha: number,
  estatus: string
}
