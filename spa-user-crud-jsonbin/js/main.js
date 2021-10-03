// ========== GLOBAL VARIABLES =========

let _drinks = [];
let _favDrinks = [];
const _baseUrl = "https://api.jsonbin.io/v3/b/6156f83aaa02be1d44522307";

const _headers = {
  "X-Master-Key":
    "$2b$10$EN1s0LmPgjsOM5AjYId5kOw8OcDusdvLFYzv1lTu5WVK1HBrhQPqK",
  "Content-Type": "application/json",
};

// ========== Fetch drinks fra JSONbin ==========
async function loadDrinks() {
  const url = _baseUrl + "/latest";
  const response = await fetch(url, {
    headers: _headers,
  });
  const data = await response.json();
  _drinks = data.record;
  console.log(data);
  appendDrinks(_drinks);
}
loadDrinks();

// ========== Filtrere drinks udfra brugerens valg af ingrediens ==========
function filterByIngredient(keyword) {
  let filteredDrinks = [];
  for (let drink of _drinks) {
    for (const ingredient of drink.ingredients) {
      if (ingredient.name === keyword) {
        filteredDrinks.push(drink);
      }
    }
  }
  console.log(filteredDrinks);
  appendDrinkSearch(filteredDrinks);
}

// ========== Looper gennem drinks, finder ingredienser og displayer dem i DOM'en ==========
function ingredientsList(drink) {
  let html = "";
  for (const ingredient of drink.ingredients) {
    html += /*html*/ `
    <p class="${ingredient.name} ingredient-button">${ingredient.amount} cl <span class="langlinje">|</span> ${ingredient.name}</p>
    `;
  }
  return html;
}

// ========== Looper gennem drinks, finder ingredienser og displayer dem i DOM'en - lavet til ingredienser på forsiden ==========
function ingredientsFront(drink) {
  let html = "";
  for (const ingredient of drink.ingredients) {
    html += /*html*/ `
    <p class="${ingredient.name} ingredient-front">${ingredient.amount} cl <span class="langlinje">|</span> ${ingredient.name}</p>
    `;
  }
  return html;
}

// Vi appender de filtrerede drinks til DOM'en
function appendDrinkSearch(drinks) {
  let htmlDrinks = "";
  for (const filteredDrink of drinks) {
    htmlDrinks += /*html*/ `
    <article class="result-section" onclick="showDrink('${filteredDrink.id}')">
      <div class="result-card">
      
        <div class="${filteredDrink.name} drinkbg">
          <img src="${filteredDrink.img}">
        </div>
        <div class="name-ingredients">
          <h3>${filteredDrink.name}</h3>
          <p class="result-ingredient">Ingredients:</p>
          <p>${ingredientsFront(filteredDrink)}</p>
          
        <div class="difficulty-section">
          <p class="difficulty-p">Difficulty:</p>
          <p></p>
          </div>
        </div>
      </div>
    </article>  
    `;
  }
  document.querySelector("#search-result").innerHTML = htmlDrinks;
}

function reset() {
  appendDrinkSearch(drinks);
}

function appendDrinks(drinks) {
  for (let drink of drinks) {
    console.log(drink);
  }
  showLoader(false);
}

// ========== Append favoritiseret drink til favorit siden ==========
function appendFavDrinks() {
  let htmlFav = "";
  for (const drink of _favDrinks) {
    console.log(drink);
    htmlFav += /*html*/ `
      <article>
        <h2>${drink.name} (${drink.strength})</h2>
        <img src="${drink.img}">
        ${generateFavDrinkButton(drink.id)}
      </article>
    `;
  }
  // hvis der ikke er nogle favoritiseret drink, fortæller vi brugeren det
  if (_favDrinks.length === 0) {
    htmlFav = "<p>No drinks added to favorites</p>";
  }
  document.querySelector("#fav-drink-container").innerHTML = htmlFav;
}

// Vi genererer "tilføj til favorit" hjerte-knappen og displayer i DOM'en
function generateFavDrinkButton(drinkId) {
  let btnTemplate = `
    <i class="far fa-heart" onclick="addToFavourites('${drinkId}')"></i>`;
  if (isFavDrink(drinkId)) {
    btnTemplate = `
      <i class="far fa-heart" onclick="removeFromFavourites('${drinkId}')" class="rm"></i>`;
  }
  return btnTemplate;
}

// Appender  drink ud fra det valgte ID
function addToFavourites(drinkId) {
  let favdrink = _drinks.find((drink) => drink.id == drinkId);
  _favDrinks.push(favdrink);
  showDrink(drinkId);
  appendFavDrinks(); // "skyder" den valgte drink ind i funktionen der står for at append de favoritiserede drinks
}

// Fjerner drink igen, ud fra givet ID
function removeFromFavourites(drinkId) {
  _favDrinks = _favDrinks.filter((drink) => drink.id != drinkId);
  showDrink(drinkId);
  appendFavDrinks(); // vi opdatere igen den ansvarlige append-funktion, og fjerner drinken
}

// Tjekker om det globale favDrinks array har et ID der matcher
function isFavDrink(drinkId) {
  return _favDrinks.find((drink) => drink.id == drinkId); // checking if _favMovies has the movie with matching id or not
}

// Ud fra bruger-valgte oplysninger om antal serveringer, beregner vi en ny opskrift
function multiply(value, drinkId) {
  let servingsInput = document.querySelector("#servingsAmount").value;
  let drink = _drinks.find((drink) => drink.id === drinkId);
  let htmlD = "";
  for (const ingredient of drink.ingredients) {
    let endeligeResultat = ingredient.amount * servingsInput;
    htmlD += /*html*/ `
    <p class="${ingredient.name} ingredient-button">${endeligeResultat} cl <span class="langlinje">|</span> ${ingredient.name}</p>
    `;
  }
  document.querySelector("#ingredientSubmit").innerHTML = htmlD;
}

// Tjekker vores JSON data, om citron, is eller shaker skal rekommenderes til drinken
function optionalList(drink) {
  let htmlOptional = "";
  if (drink.citron === "true") {
    htmlOptional += /*html*/ `
    <img src="./img/Group 142.svg" class="iceoptional">
      `;
  }
  if (drink.ice === "true") {
    htmlOptional += /*html*/ `
    <img src="./img/ice.svg" class="shakeroptional">
      `;
  }
  if (drink.shaker === "true") {
    htmlOptional += /*html*/ `
    <img src="./img/Group 144.svg" class="lemonoptional">
      `;
  }
  return htmlOptional;
}

// ========== Loader ==========
// show and hide loader
function showLoader(show) {
  let loader = document.getElementById("loader");
  if (show) {
    loader.classList.remove("hide");
  } else {
    loader.classList.add("hide");
  }
}

// ==== Burger-menu ====
// åben burger-menu når der klikkes
function openNav() {
  document.getElementById("myNav").style.width = "100%";
}

// luk burger-menu når der klikkes på "x"
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

// ========= Discover ========= //
// Filterer i drinks ud fra det keyword brugeren trykker på i Discover
function filterByKeyword(keyword) {
  const filteredDrinks = _drinks.filter((drink) => {
    const result = drink.categories.find((category) => {
      return category === keyword;
    });
    return result;
  });

  // Append de filtrerede drinks
  document.getElementById("category-title").innerText = keyword;

  document.getElementById("alcohol-test").innerHTML = filteredDrinks
    .map((drink) => {
      return `<div class="vodka-page-cards" onclick="showDrink('${drink.id}')">
      <div class="vodka-content">
      <div class="card-border">
      <img src="${drink.img}">
      <p>${drink.name}</p>
      </div>
      </div>
      </div>`;
    })
    .join("");

  navigateTo("#/category");
  return filteredDrinks;
}

// Udfra drinken brugeren nu vælger under discover, appender vi den valgte drink ud fra ID'et.
function showDrink(id) {
  const drink = _drinks.find((drink) => drink.id == id);
  document.querySelector("#chosen-drink").innerHTML = /*html*/ `
  <article class="drink-card ${drink.name}-color">
          <div class="drinks-top">
          <span class="arrow">
        <button onclick="goBack()" class="back-button"><i class="fas fa-arrow-left"></i></button>
          </span>
            <div class="drink-top-name">
              <h3>${drink.name}</h3><br>
              <p>${drink.strength} strength</p>
            </div>
            <span class="favheart">
              ${generateFavDrinkButton(drink.id)}
           </span>
          </div>
      <div class="drinks-mid">
        <img class="drink-img" src="${drink.img}">
      </div>
      <div class="servingcontainer">
      <label class="servingAmount" for="servingsAmount">
      <select id="servingsAmount" onchange="multiply(this.value, ${drink.id})">
        <option value="" selected disabled>Select..</option>
        <option value="1">1 serving</option>
        <option value="2">2 servings</option>
        <option value="3">3 servings</option>
      </select>
    </label>
    </div>
          <div class="drinks-bottom">
          <div class="servings-ingredients">
            <div class="ingredients">
           <h4>Ingredients</h4>
           <div id="ingredientSubmit"></div>
            </div>
            </div>

        <div class="optional">
        <h4>Optional</h4>
        <div class="optionalIngredients">${optionalList(drink)}</div>
          </div>

      </div>
        <div class="card-approach">

        <div class="approach-description">
        <p>${drink.approach[0]}</p>
        <div class="button-popup">
        <button class="approach-popup" onclick="stepByStep()">Step by step  <i class="fas fa-expand-alt"></i></button></div>
        </div>
  
  </div>
        </div>
      </article>
    `;
  navigateTo("#/specific-drink");
}

function stepByStep() {
  alert("Not available at this time!");
}

//"Tilbage" knapper
function goBack() {
  window.history.back();
}
