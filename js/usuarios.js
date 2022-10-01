console.log('usuarios');
const divRoot = document.querySelector('#root')
const login = document.querySelector('#login')
const tbody = document.querySelector('#tbody')
const table = document.querySelector('.table')
let carritoCompras = []


const requestGET = async ()=>{
    try {
        const respuesta = await fetch('https://6334c678ea0de5318a08cea5.mockapi.io/Joyeria')
        const data = await respuesta.json()
        if (!respuesta.ok) throw {status:res.statusText} 
        pintarCards(data)
       
    } catch (error) {
        console.error(error);
    }
}



const pintarCards = (arrayDatos)=>{


    arrayDatos.map((el)=>{
        let {id, nombre, precio, stock, imagen} = el
        divRoot.innerHTML += `
        <div class='col col-sm text-center'>
          <div class="card text-center" style="width: 18rem;">
              <img src="${imagen}" class="card-img-top" alt="${nombre}">
              <div class="card-body">
                  <h5 class="card-title text-center">${nombre}</h5>
                  <p class="card-text text-center"">$<span id='precio'>${precio}</span></p>
                  <div class="d-grid gap-2 col-6 mx-auto">
                  <button data-id='${id}' data-stock='${stock}' data-nombre='${nombre}' data-precio='${precio}'  class="btn btn-outline-success">add to cart</button>
                  </div>
              </div>
          </div>
        </div>
        `
    })

    fueraDeStock()
}


const pintarCarrito = (arrayDatos)=>{
  if(arrayDatos.length >0){
    try {
      tbody.innerHTML = ""
      table.style['display'] = 'block'
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
      
    } catch (error) {
 
  
  }
  
}else{
  table.style['display'] = 'none'}
}


//eventos - principales


addEventListener('DOMContentLoaded', requestGET)
carritoCompras = JSON.parse(localStorage.getItem('carritoCompras'))
if (carritoCompras == null){
  carritoCompras = []
}
pintarCarrito(carritoCompras)



const fueraDeStock = ()=>{
    const btnCart = document.querySelectorAll('.btn-outline-success')
    for (const btns of btnCart) {
        btns.addEventListener('click',(event)=>{
            let stock = event.target.dataset.stock
            let id = event.target.dataset.id
            let precio = event.target.dataset.precio
            let nombre = event.target.dataset.nombre

            
            if (stock <= 0){
              btns.setAttribute('class','btn btn-outline-success disabled')
            }else{
              carritoCompras.push({
                id,
                nombre,
                precio,
                stock,
              });
              
              localStorage.setItem('carritoCompras', JSON.stringify(carritoCompras))
              pintarCarrito(carritoCompras)
              
            }
        })
        
    }
}






//login

login.addEventListener('click',()=>{
    Swal.fire({
        title: 'Submit your Github username',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Look up',
        showLoaderOnConfirm: true,
        preConfirm: (login) => {
          return fetch(`//api.github.com/users/${login}`)
            .then(response => {
              if (!response.ok) {
                throw new Error(response.statusText)
              }
              return response.json()
            })
            .catch(error => {
              Swal.showValidationMessage(
                `Request failed: ${error}`
              )
            })
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed){
          Swal.fire({
            title: `${result.value.login}'s avatar`,
            imageUrl: result.value.avatar_url
          }).then(()=>{
            console.log(result.value.login);
            if (result.value.login == 'MartinDellImmagine'){
                window.location = '../index.html'
            }
               
          })
        }
      })
})