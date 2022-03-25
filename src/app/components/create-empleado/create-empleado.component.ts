/* Componente creado para la lógica de agregar Empleados o modificarlos */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpleadoService } from '../../services/empleado.service';

@Component({
  selector: 'app-create-empleado',
  templateUrl: './create-empleado.component.html',
  styleUrls: ['./create-empleado.component.css']
})
export class CreateEmpleadoComponent implements OnInit {

  // creamos una propiedad para la creación de un Empleado y su "aceptar"
  createEmpleado: FormGroup;
  submitted = false;

  // creamos una propiedad para el Spinner
  loading = false;

  // creamos una propiedad para el id (de tipo string para editar, null para agregar)
  id: string | null;

  // creamos una propiedad para titular según sea Agregar o Modificar
  titulo = 'Agregar Empleado';

  // inyectamos el Módulo nativo que nos permite validar el formulario de alta de empleado
  // inyectamos el Servicio que nos permite relacionarnos con la BD
  // inyectamos el Módulo nativo que nos permite manejar las rutas para movernos en las distintas "páginas"
  // inyectamos el Módulo que nos permite mostrar mensajes de Toastr
  // inyectamos el Módulo nativo que nos permite tomar el Id del URL
  constructor(private fb: FormBuilder,
              private _empleadoService: EmpleadoService,
              private router: Router,
              private toastr: ToastrService,
              private aRoute: ActivatedRoute) { 

    // validamos y llenamos el formulario 
    this.createEmpleado = fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      documento: ['', Validators.required],
      salario: ['', Validators.required],
    })

    // si trae id la URL lo tomamos para modificar
    this.id = aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {

    // llamamos al método para mostrar
    this.mostrarEmpleado();
  }

  agregarEditarEmpleado() {

        
    this.submitted = true;

    // si el formulario es invalido, retornamos
    if(this.createEmpleado.invalid) {
      return;
    }

    // preguntamos si trae el id para saber si agregamos o editamos
    if(this.id === null) {
      
      this.agregarEmpleado();
    
    } else {

      this.editarEmpleado(this.id);
    }
  }

  // método para Agregar un Empleado
  agregarEmpleado() {

    // si es válido, construimos el objeto
    const empleado: any = {
      nombre: this.createEmpleado.value.nombre,
      apellido: this.createEmpleado.value.apellido,
      documento: this.createEmpleado.value.documento,
      salario: this.createEmpleado.value.salario,
      // variables ocultas en el formulario
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    }

    // mostramos el Spinner
    this.loading = true;

    // llamamos al método del servicio que realiza la inserción y agregamos mensajes
    this._empleadoService.agregarEmpleado(empleado).then(() =>{
    
      // mostramos el mensaje
      this.toastr.success('El empleado fue registrado con éxito!', 'Empleado Registrado!', {positionClass: 'toast-bottom-right'});

      // redireccionamos
      this.router.navigate(['/list-empleados']);

    }).catch(error => {
      console.log(error);
      this.loading = false;
    })
  }

  // método para mostrar un Empleado
  mostrarEmpleado() {

    // validamos si trae el id
    if(this.id !== null) {

      // mostramos el loading
      this.loading = true;

      // creamos una propiedad para titular según sea Agregar o Modificar
      this.titulo = 'Editar Empleado';

      // accedemos a los datos del empleado
      this._empleadoService.getEmpleado(this.id).subscribe(data => {

        // cancelamos el loading
        this.loading = false;

        // llenamos los campos del empleado seleccionado
        this.createEmpleado.setValue({
          nombre: data.payload.data()['nombre'],
          apellido: data.payload.data()['apellido'],
          documento: data.payload.data()['documento'],
          salario: data.payload.data()['salario'],
        })
      })
    }
  }

  // método para modificar un Empleado
  editarEmpleado(id: string) {

    // construimos el objeto
    const empleado: any = {
      nombre: this.createEmpleado.value.nombre,
      apellido: this.createEmpleado.value.apellido,
      documento: this.createEmpleado.value.documento,
      salario: this.createEmpleado.value.salario,
      // variables ocultas en el formulario
      fechaActualizacion: new Date(),
    }

    // mostramos el loading
    this.loading = true;

    // llamamos al método del servicio que realiza la modificación y agregamos mensajes
    this._empleadoService.editarEmpleado(id, empleado).then(() => {
      
      // cancelamos el loading
      this.loading = false;

      // mostramos el mensaje
      this.toastr.info('El empleado fue modificado con éxito!', 'Empleado Modificado!', {positionClass: 'toast-bottom-right'});

      // redireccionamos
      this.router.navigate(['/list-empleados']);

    })
  }
}
