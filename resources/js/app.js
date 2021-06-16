/* eslint-disable prettier/prettier */
import '../css/app.scss'
import 'bootstrap'

try {
    const divPremios = document.querySelector('.premios')
    const btAdicionar = document.querySelector('.adicionar')
  
    btAdicionar.addEventListener('click', () => {
      const div1 = document.createElement('div')
      const div2 = document.createElement('div')
      const input = document.createElement('input')
      const input2 = document.createElement('input')
  
      divPremios.firstChild
  
      div1.classList.add('col-6')
      div1.classList.add('mb-3')
      
      div2.classList.add('col-6')
      div2.classList.add('mb-3')
  
      input.classList.add('form-control')
      input.type = `text`

      input2.classList.add('form-control')
      input2.type = `text`
  
      div1.appendChild(input)
      div2.appendChild(input2)
      
      divPremios.appendChild(div1)
      divPremios.appendChild(div2)
    })
} catch (error) {}