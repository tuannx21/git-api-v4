const labelAccessKey = 'git-access-key'
const inputAccessKey = document.querySelector('#input-access-key')
const imgUserAvatar = document.querySelector('#userAvatar')
const userName = document.querySelector('#userName')
const userEmail = document.querySelector('#userEmail')
const reposList = document.querySelector('#repoList')

//Displaying App
const showUserInf = ({ name, login, email, avatar_url }) => {
  imgUserAvatar.src = avatar_url
  userName.innerHTML = name || login
  userEmail.innerHTML = email
}

const showRepos = (repos, accessKey) => {
  repos.map((repo) => {
    let template = document.querySelector('#repo-template')
    let clone = template.content.cloneNode(true)
    let repoItem = clone.querySelector('li')
    let inputRepo = repoItem.querySelector('#repoName')

    repoItem.id = repo.id
    inputRepo.value = repo.name
    inputRepo.addEventListener('dblclick', function () { this.readOnly = false })
    inputRepo.addEventListener('keypress', function (event) {
      if (event.which === 13 || event.keyCode === 13) {
        this.readOnly = true
        renameRepo(accessKey, repo.owner.login, repo.name, this.value)
          .then(alert('U have edited success, it may take a while to completely rename'))
      }
    })
    reposList.appendChild(clone)
  })
}

//Pure Function
const filterByOwner = (repos) => {
  return repos.filter((repo) => (repo.owner.login === users.login))
}

//Promise
const getUser = (accessKey) => {
  return fetch('https://api.github.com/user', {
    headers: { 'Authorization': `Bearer ${accessKey}` }
  })
    .then(response => response.json())
}

const getAllRepos = (accessKey) => {
  return fetch('https://api.github.com/user/repos', {
    headers: { 'Authorization': `Bearer ${accessKey}` }
  })
    .then(response => response.json())
}

const renameRepo = (accessKey, owner, oldName, newName) => {
  return fetch(`https://api.github.com/repos/${owner}/${oldName}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${accessKey}`
    },
    body: JSON.stringify({
      name: newName
    })
  })
}

//Util
const clearAll = () => {
  reposList.innerHTML = null
  userEmail.innerHTML = null
  userName.innerHTML = null
  imgUserAvatar.src = null
}

const saveToLocalStorage = (label, item) => {
  window.localStorage.setItem(label, JSON.stringify(item))
}

const getItemFromLocalStorage = (label) => {
  return JSON.parse(window.localStorage.getItem(label))
}

const onKeyPressAccessKey = () => {
  inputAccessKey.addEventListener('keypress', function (event) {
    if (event.which === 13 || event.keyCode === 13) {
      clearAll()
      let accessKey = inputAccessKey.value;
      saveToLocalStorage(labelAccessKey,accessKey)
      loadData(accessKey)
      inputAccessKey.value = ''
    }
  })
}

const loadData = (accessKey) => {
  clearAll()
  let key = accessKey === undefined ? getItemFromLocalStorage(labelAccessKey).toString() : accessKey
  getUser(key)
    .then(user => { showUserInf(user) })
  getAllRepos(key)
    .then(repos => { showRepos(repos, key) })
    .catch(error => { alert('can get repos') })
}

const App = () => {
 loadData();
 onKeyPressAccessKey()
}

//start App
App()

