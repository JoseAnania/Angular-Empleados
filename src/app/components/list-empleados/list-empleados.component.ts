/* Componente creado para el manejo de la lógica de la lista de Empleados */
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { EmpleadoService } from '../../services/empleado.service';

@Component({
  selector: 'app-list-empleados',
  templateUrl: './list-empleados.component.html',
  styleUrls: ['./list-empleados.component.css']
})
export class ListEmpleadosComponent implements OnInit {

  // creamos una propiedad de un arreglo vacío
  empleados: any[] = [];

  // inyectamos el Servicio que nos permite relacionarnos con la BD
  // inyectamos el Módulo que nos permite mostrar mensajes de Toastr
  constructor(private _empleadoService: EmpleadoService,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {

    // al iniciar la página cargamos la lista llamando al método
    this.getEmpleados();
  }

  // método para mostrar los Empleados
  getEmpleados() {

    // llamamos al servicio (y accedemos a los datos a través de un foreach)
    this._empleadoService.getEmpleados().subscribe(data => {
      
      this.empleados = [];

      data.forEach((element: any) => {
        
        this.empleados.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        })
      });
      
    })
  }

  // método para eliminar un Empleado
  eliminarEmpleado(id: string) {

    // llamamos al servicio
    this._empleadoService.eliminarEmpleado(id).then(() => {

      // mostramos el mensaje
      this.toastr.error('El empleado fue eliminado con éxito!', 'Empleado Eliminado!', {positionClass: 'toast-bottom-right'});
      
    }).catch(error => {
      console.log(error);
    })
  }

}
