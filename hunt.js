let favoritesList = [];
let initialCharacters = [];


async function main(limit = 30, offset = 0) {
  const privateKey = '655f3e28706d206be4385a7458435944f6a187f6';
  const publicKey = 'f1a98b007451a0b79ca4ea508671c1bc';
  const ts = new Date().getTime().toString();
  const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();

  const apiUrl = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=${limit}&offset=${offset}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const result = data.data;
    const char = result.results;
    return char;
  } catch (error) {
    console.log(error);
  }
}


function Characters(superHero) {
  const container = document.querySelector(".container");
  let contain = '';
  
  superHero.forEach((eve, index) => {
    contain += `<div class="card">
      <div class="bg"></div>
      <div class="blob"></div>
      <img src="${eve.thumbnail.path}.${eve.thumbnail.extension}">
      <p class="name">${eve.name}</p>
      <button class="button" data-index=${index}><span>view</span></button>
      <i id="heart" class="fa-regular fa-heart fa-xl" data-index=${index}></i>
    </div>`;
  });
  
  container.innerHTML = contain;
  attach(superHero);
}


function Search(superHero) {
  const searchIcon = document.querySelector('#searchIcon');
  searchIcon.addEventListener('click', () => {
    const inputValue = document.querySelector('.search-bar input').value;
    const change = inputValue.charAt(0).toUpperCase() + inputValue.slice(1).toLowerCase();
    let found = false;
    let contain1 = '';
    
    superHero.forEach((eve, index) => {
      if (change === eve.name) {
        contain1 = `<div class="card">
          <div class="bg"></div>
          <div class="blob"></div>
          <img src="${eve.thumbnail.path}.${eve.thumbnail.extension}">
          <p class="name">${eve.name}</p>
          <button class="button" data-index=${index}><span>view</span></button>
          <i id="heart" class="fa-regular fa-heart fa-xl" data-index=${index}></i>
        </div>`;
        found = true;
      }
    });

    if (!found) {
      contain1 = `<div class="card">
        <div class="bg"></div>
        <div class="blob"></div>
        <img src="">
        <p class="NO DATA FOUND">NO DATA FOUND</p>
      </div>`;
    }

    const container = document.querySelector(".container");
    container.innerHTML = contain1;
    attach(superHero);
  });
}


function Heart(superHero) {
  const hearts = document.querySelectorAll('#heart');
  hearts.forEach((heart) => {
    heart.addEventListener('click', (event) => {
      heart.id = 'heart2';
      const index = event.currentTarget.getAttribute('data-index');
      const selectedHero = superHero[index];
      if (!favoritesList.includes(selectedHero)) {
        favoritesList.push(selectedHero);
      }
    });
  });
}


function details(superHero) {
  const container = document.querySelector('.container');
  container.innerHTML = "";
  const item = superHero.comics;
  const comic = item.items;
  let comicList = '';
  
  comic.forEach((value) => {
    comicList += `<li>${value.name}</li>`;
  });
  
  container.innerHTML = `<div class="profile">
    <img src="${superHero.thumbnail.path}.${superHero.thumbnail.extension}">
    <h2 id="name">${superHero.name}</h2>
    <div class="detailsContainer"> 
      <h2 id="list-head">COMICS</h2>
      <div class="list">
        <ul>
          ${comicList}
        </ul>
      </div>
      <div class="para">
        <p class="paragraph">${superHero.description}</p>
      </div>
    </div>
  </div>`;
}


function attach(superHero) {
  const buttons = document.querySelectorAll('.button');
  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const index = event.currentTarget.getAttribute('data-index');
      const selectedHero = superHero[index];
      details(selectedHero);
    });
  });

  Heart(superHero);
}


function Favorites() {
  const fav = document.getElementById('fav');
  fav.addEventListener('click', () => {
    const container = document.querySelector('.container');
    container.innerHTML = "";
    let con = '';
    favoritesList.forEach((item, index) => {
      con += `<div class="card">
        <div class="bg"></div>
        <div class="blob"></div>
        <img src="${item.thumbnail.path}.${item.thumbnail.extension}">
        <p class="name">${item.name}</p>
        <button class="button" data-index=${index}><span>view</span></button>
        <i id="heart2" class="fa-regular fa-heart fa-xl" data-index=${index}></i>
      </div>`;
    });
    container.innerHTML = con;
    attach(favoritesList);
  });
}


function Home() {
  const home = document.getElementById('home');
  home.addEventListener('click', () => {
    Characters(initialCharacters);
  });
}


async function init() {
  const superHero = await main();
  initialCharacters = superHero;
  Characters(superHero);
  Search(superHero);
  Favorites();
  Home();
}

init();
