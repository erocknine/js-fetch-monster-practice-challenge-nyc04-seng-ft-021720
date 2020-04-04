document.addEventListener("DOMContentLoaded", () => {

let pageNumber = 1 //initial page for renderPage()

const monstersDiv = document.querySelector(`#monster-container`)
const monsterForm = document.querySelector(`#create-monster`)
const buttonContainer = document.querySelector(`#page-buttons`)
const pageForm = document.querySelector(`#page-form`)
let pageText = document.querySelector(`.insert-page`)
pageText.value = `${pageNumber}` //value for page number submit

//render 20 monsters with page argument
function renderPage (pageNumber) {
  monstersDiv.innerHTML = ""
  fetch(`http://localhost:3000/monsters?_limit=20&_page=${pageNumber}`)
  .then(response => response.json())
  .then(monsters => {
    monsters.forEach(monster => 
      renderMonster(monster))
  })
}

//render individual monster
function renderMonster({name, age, description, id}) {
  let monsterDiv = document.createElement(`div`)
  monsterDiv.dataset.id = id
  monsterDiv.setAttribute('class', `monster-${name}`)
  monsterDiv.innerHTML = `
  <h2>${name}</h2>
  <h4>${age}</h4>
  <p><strong>Bio: </strong>${description}</p>
  <button class="delete-button">Remove</delete>
  `
  monstersDiv.append(monsterDiv)
}

//render monster after create
function renderMonsterPre({name, age, description, id}) {
  let monsterDiv = document.createElement(`div`)
  monsterDiv.dataset.id = id
  monsterDiv.setAttribute('class', `monster-${name}`)
  monsterDiv.innerHTML = `
  <h2>${name}</h2>
  <h4>${age}</h4>
  <p><strong>Bio: </strong>${description}</p>
  <button class="delete-button">Remove</delete>
  `
  monstersDiv.prepend(monsterDiv)
}

//render monster to page
function renderForm() {
  const form = document.createElement('form')
  const name = document.createElement('input')
  const age = document.createElement('input')
  const description = document.createElement('input')
  const button = document.createElement('button')
  name.setAttribute('type', 'text')
  name.setAttribute('name', 'name')
  name.placeholder = 'name...'
  
  age.setAttribute('type', 'text')
  age.setAttribute('name', 'age')
  age.placeholder = 'age...'
  
  description.setAttribute('type', 'text')
  description.setAttribute('name', 'description')
  description.placeholder = 'description...'
  
  button.setAttribute('type', 'submit')
  button.textContent = 'Create monster'

  form.append(name)
  form.append(age)
  form.append(description)
  form.append(button)
  monsterForm.append(form)
}

//delete monster function called from delete button event
function deleteMonster(monster) {
  fetch(`http://localhost:3000/monsters/${monster.dataset.id}`, {
    method: 'DELETE'
  })
  .then(response => {
    if(response.ok){
      monster.remove()
    }
  })
}

//delete monster
monstersDiv.addEventListener('click', event => {
  if(event.target.className === "delete-button"){
    deleteMonster(event.target.parentElement)
  }
})

//create monster with form
monsterForm.addEventListener("submit", event => {
  event.preventDefault()
  const monster = {
    name: event.target.name.value,
    age: event.target.age.value,
    description: event.target.description.value
  }
  fetch('http://localhost:3000/monsters', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(monster),
  })
  .then(response => response.json())
  .then(monster => {
    renderMonsterPre(monster)
  })
})

//turn pages
buttonContainer.addEventListener('click', event => {
  if(event.target.className === "forward") {
    pageNumber += 1
    monstersDiv.innerHTML = ""
    renderPage(pageNumber)
    pageText.value = pageNumber
  } else if(event.target.className === "back") {
    pageNumber -= 1
    monstersDiv.innerHTML = ""
    renderPage(pageNumber)
    pageText.value = pageNumber
  }
})

//page number submit event
pageForm.addEventListener('click', event => {
  if(event.target.className === "submit") {
    let pageInput = event.target.parentElement.querySelector('.insert-page')
    renderPage(pageInput.value)
  }
})

renderForm()
renderPage(1)
});