/* Servicio creado para realizar las peticiones al Backend (FireBase) */
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  // inyectamos el Módulo que nos permite interactuar con la BD (FireBase) según documentación de Angular Fire
  constructor(private firestore: AngularFirestore) { }

  // método para insertar un Empleado en Firestore
  agregarEmpleado(empleado: any): Promise<any> {

    // insertamos
    return this.firestore.collection('empleados').add(empleado);
  }

  // método para mostrar la lista de Empleados de Firestore
  getEmpleados(): Observable<any> {

    // mostramos
    return this.firestore.collection('empleados', ref => ref.orderBy('fechaCreacion', 'asc')).snapshotChanges();
  }

  // método para eliminar un Empleado por id
  eliminarEmpleado(id: string): Promise<any> {

    // eliminamos
    return this.firestore.collection('empleados').doc(id).delete();
  }
  
  // método para retornar un empleado por id (para modificarlo)
  getEmpleado(id: string): Observable<any> {

    // retornamos
    return this.firestore.collection('empleados').doc(id).snapshotChanges();
  }

  // método para modificar un empleado por id
  editarEmpleado(id: string, data: any): Promise<any> {

    // modificamos
    return this.firestore.collection('empleados').doc(id).update(data);
  }
}
