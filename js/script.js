import ToDoList from './todoList.js'
import ToDoItem from './todoItem.js'

const toDoList = new ToDoList()

// Launch app
document.addEventListener('readystatechange', (e) => {
  if (e.target.readyState === 'complete') {
    initApp()
  }
})

const initApp = () => {
  // Add listeners
  const itemEntryForm = document.getElementById('itemEntryForm')
  itemEntryForm.addEventListener('submit', (e) => {
    e.preventDefault()
    processSubmission()
  })

  const clearItems = document.getElementById('clearItems')
  clearItems.addEventListener('click', () => {
    const list = toDoList.getList()
    if (list.length) {
      const confirmed = confirm(
        'Are you sure you want to clear the entire list?'
      )

      if (confirmed) {
        toDoList.clearList()
        updatePersistentData(toDoList.getList())
        refreshThePage()
      }
    }
  })

  // Procedural

  loadListObject()
  refreshThePage()
}

const loadListObject = () => {
  const storedList = localStorage.getItem('toDoList')

  if (typeof storedList !== 'string') return

  const parsedList = JSON.parse(storedList)
  parsedList.forEach((itemObj) => {
    const newToDoItem = createNewItem(itemObj._id, itemObj._item)
    toDoList.addItemToList(newToDoItem)
  })
}

const refreshThePage = () => {
  clearListDisplay()
  renderList()
  clearItemEntryField()
  setFocusOnItemEntry()
}

const clearListDisplay = () => {
  const $listItems = document.querySelector('.listItems')
  deleteContents($listItems)
}

const deleteContents = (element) => {
  let child = element.lastElementChild

  while (child) {
    element.removeChild(child)
    child = element.lastElementChild
  }
}

const renderList = () => {
  const list = toDoList.getList()
  console.log(list)
  list.forEach((item) => {
    buildListItem(item)
  })
}

const buildListItem = (it) => {
  const div = document.createElement('div')
  div.className = 'item'

  const check = document.createElement('input')
  check.type = 'checkbox'
  check.id = it.getId()
  check.tabIndex = 0
  addClickListToCheckbox(check)

  const label = document.createElement('label')
  label.htmlFor = it.getId()
  label.textContent = it.getItem()

  div.appendChild(check)
  div.appendChild(label)

  const container = document.querySelector('.listItems')
  container.appendChild(div)
}

const addClickListToCheckbox = (checkbox) => {
  checkbox.addEventListener('click', () => {
    toDoList.removeItemFromList(checkbox.id)
    updatePersistentData(toDoList.getList())
    const removedText = getLabelText(checkbox.id)
    updatesScreenReaderConfirmation(removedText, 'removed form the list')
    setTimeout(() => {
      refreshThePage()
    }, 1000)
  })
}

const getLabelText = (checkboxId) => {
  return document.getElementById(checkboxId).nextElementSibling.textContent
}

const updatePersistentData = (listArray) => {
  localStorage.setItem('toDoList', JSON.stringify(listArray))
}

const clearItemEntryField = () => {
  document.getElementById('newItem').value = ''
}

const setFocusOnItemEntry = () => {
  document.getElementById('newItem').focus()
}

const processSubmission = () => {
  const newEntryText = getNewEntry()
  if (!newEntryText.length) return
  const nextItemId = calcNextItemId()
  const toDoItem = createNewItem(nextItemId, newEntryText)
  toDoList.addItemToList(toDoItem)

  updatePersistentData(toDoList.getList())
  updatesScreenReaderConfirmation(newEntryText, 'added')
  refreshThePage()
}

const getNewEntry = () => {
  return document.getElementById('newItem').value.trim()
}

const calcNextItemId = () => {
  let nextItemId = 1
  const list = toDoList.getList()

  if (list.length > 0) {
    nextItemId = list[list.length - 1].getId() + 1
  }
  return nextItemId
}

const createNewItem = (itemId, itemText) => {
  const toDo = new ToDoItem()
  toDo.setId(itemId)
  toDo.setItem(itemText)
  return toDo
}

const updatesScreenReaderConfirmation = (newEntryText, actionVerb) => {
  document.getElementById(
    'confirmation'
  ).textContent = `${newEntryText} was ${actionVerb}`
}
