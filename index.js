console.log('test');
//variables globales
const tbody = document.querySelector('#tbody')

const formulario = document.querySelector('#formulario')
const myModalEl = document.querySelector('#staticBackdrop')
let modal = new bootstrap.Modal(myModalEl)

let inputNombre = document.querySelector('#nombre')
let inputPrecio = document.querySelector('#precio')
let inputStock = document.querySelector('#stock')
let inputImagen = document.querySelector('#imagen')

let flag = false

//fetch - solicitudes
const requestPost = async (data) =>{
    try {

        let res = await fetch('https://6334c678ea0de5318a08cea5.mockapi.io/Joyeria', {
        
            method:"POST",
            headers:{
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data)
        })
        let json = await res.json()
        
        
        console.log('Objeto cargado con exitos.', json);
        
        
        Swal.fire({
            icon: 'success',
            text: 'Producto añadido exitosamente',
          }).then(()=>{
            tbody.innerHTML = '',
            requestGET()
          })
        //location.reload()
        // throw envia el error al catch
        if (!res.ok) throw {status:res.statusText}  
        
    } catch (error) {
        let errorh1 = document.getElementById('erroralcargar')
        errorh1.textContent = `error: ${error.status}`
    }


       
}


const requestGET = async ()=>{
    try {
        const respuesta = await fetch('https://6334c678ea0de5318a08cea5.mockapi.io/Joyeria')
        const data = await respuesta.json()
        if (!respuesta.ok) throw {status:res.statusText} 
        pintarCrud(data)
       
    } catch (error) {
        console.error(error);
    }
}


const requestDelete = (url)=>{
    try {
        fetch(url,{
            method:"DELETE",
    
        })
        console.log("deleteado");
    } catch (error) {
        console.log('No se pudo eliminar este item');
    }

}



const requestPut = (url, data)=>{

    fetch(url, {
        method:"PUT",
        headers:{
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    })
    modal.hide(myModalEl)
    Swal.fire({
        icon: 'success',
        title: 'Datos editados con exito',
        showConfirmButton: false,
        timer: 2000
      }).then(()=>{
        tbody.innerHTML = '',
        requestGET()
      }

      )

    console.log('Data modificada con exito', data);
}


const pintarCrud = (arrayDatos)=>{
    arrayDatos.map((elemento)=>{
        let {id,nombre,precio,stock,imagen} = elemento
        tbody.innerHTML +=`
        <tr>
            <th scope="row">${id}</th>
            <td>${nombre}</td>
            <td>${precio}</td>
            <td>${stock}</td>
            <td>
                <button class="btn btn-success btn-editar" data-id=${id} data-nombre=${nombre} data-precio=${precio} data-stock=${stock} data-imagen=${imagen}>editar</button>
                <button class="btn btn-danger btn-eliminar" data-id=${id} data-nombre=${nombre}>eliminar</button>
            </td>
        </tr>
        `
    })
    eventoEliminar()
    eventoEditar()
}

//eventos - principales


addEventListener('DOMContentLoaded',requestGET)



formulario.addEventListener('submit',(e)=>{
    e.preventDefault()
    
    
        
    let arrayDatos = {
            nombre: inputNombre.value,
            precio: inputPrecio.value,
            stock: inputStock.value,
            imagen: inputImagen.value
    }

    if (flag == false) {
        
        Swal.fire({
            title: `Enlistando ${arrayDatos.nombre}`,
            allowOutsideClick: false,
            timer: 10000,
            didOpen: () => {
                
              Swal.showLoading()
              
            }
        })

        requestPost(arrayDatos)
        formulario.reset()
    
    } else {
        let editID = localStorage.getItem('editID')

        requestPut(`https://6334c678ea0de5318a08cea5.mockapi.io/Joyeria/${editID}`, arrayDatos)

        flag = false

        formulario.reset()
    


    }


})


const eventoEliminar = ()=>{
    const btnEliminar = document.querySelectorAll('.btn-eliminar')
    for (const btn of btnEliminar){
        btn.addEventListener('click', (event)=>{
            Swal.fire({
                title: '¿Estas seguro?',
                text: "Este cambio no se puede revertir",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, estoy seguro!'
              }).then((result) => {
                if (result.isConfirmed) {
                    let id = event.target.dataset.id
                    let nombre = event.target.dataset.nombre
                    formulario.reset()
                    requestDelete(`https://6334c678ea0de5318a08cea5.mockapi.io/Joyeria/${id}`)
                    Swal.fire({
                        title: `Borrando ${nombre}`,
                        allowOutsideClick: false,
                        timer: 2000,
                        didOpen: () => {
                            
                          Swal.showLoading()
                          
                        }
                    }).then(()=>{
                        tbody.innerHTML = '',
                        requestGET()
                    }

                    )
                }


              })

        })
        
    }
}

const eventoEditar = ()=>{
    const btnEditar = document.querySelectorAll('.btn-editar')
    for (const btns of btnEditar) {
        btns.addEventListener('click',(event)=>{

            modal.show(myModalEl)
            
            localStorage.setItem('editID',event.target.dataset.id)

            inputNombre.value = event.target.dataset.nombre
            inputPrecio.value = event.target.dataset.precio
            inputStock.value = event.target.dataset.stock
            inputImagen.value = event.target.dataset.imagen

            flag = true;
        })
    }
}