// ========== GLOBAL VARIABLES =========

let _drinks = [];
let _selectedDrinkId;
let _filteredIngredients = [];
const _baseUrl = "https://api.jsonbin.io/v3/b/6156f83aaa02be1d44522307";

const _headers = {
  "X-Master-Key":
    "$2b$10$EN1s0LmPgjsOM5AjYId5kOw8OcDusdvLFYzv1lTu5WVK1HBrhQPqK",
  "Content-Type": "application/json",
};

// ========== READ ==========

async function loadDrinks() {
  const url = _baseUrl + "/latest"; // make sure to get the latest version
  const response = await fetch(url, {
    headers: _headers,
  });
  const data = await response.json();
  _drinks = data.record;
  console.log(data);
  appendDrinks(_drinks);
}
loadDrinks();

// Appending objects to the DOM
// function filterByIngredient(drinks) {
//   //document.querySelector("#search-frontpage").innerHTML = ""; // clear content of grid teachers
//   let htmlTemplateIng = "";
//   for (let ok of drinks) {
//     htmlTemplateIng += /*html*/ `
//     <button onclick="${appendDrinks(drinks)}"></button>
//     <p>hej</p>
//     `;
//   }
//   document.querySelector("#search-frontpage").innerHTML = htmlTemplateIng;
// }

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

function appendDrinkSearch(drinks) {
  let htmlDrinks = "";
  for (const filteredDrink of drinks) {
    htmlDrinks += /*html*/ `
    <article>
      <img src="${filteredDrink.img}">
      <h3>${filteredDrink.name}</h3><br>
      <p>${filteredDrink.strength} strength</p>
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

/* Append fav drinks */
let _favDrinks = [];

function appendFavDrinks() {
  let htmlFav = "";
  for (const drink of _favDrinks) {
    console.log(drink);
    htmlFav += /*html*/ `
      <article>
        <h2>${drink.name} (${drink.strength})</h2>
        <img src="${drink.img}">
        ${generateFavMovieButton(drink.id)}
      </article>
    `;
  }
  // if no movies display a default text
  if (_favDrinks.length === 0) {
    htmlFav = "<p>No drinks added to favorites</p>";
  }
  document.querySelector("#fav-drink-container").innerHTML = htmlFav;
}

/**
 * Generating the fav button
 */
function generateFavMovieButton(drinkId) {
  let btnTemplate = `
    <i class="far fa-heart" onclick="addToFavourites('${drinkId}')"></i>`;
  if (isFavDrink(drinkId)) {
    btnTemplate = `
      <i class="far fa-heart" onclick="removeFromFavourites('${drinkId}')" class="rm"></i>`;
  }
  return btnTemplate;
}

/**
 * Adding movie to favorites by given movieId
 */
function addToFavourites(drinkId) {
  let favdrink = _drinks.find((drink) => drink.id == drinkId);
  _favDrinks.push(favdrink); //te the DOM to display the right button
  showDrink(drinkId);
  appendFavDrinks(); // update the DOM to display the right items from the _favMovies list
}

/**
 * Removing movie from favorites by given drinkId
 */
function removeFromFavourites(drinkId) {
  _favDrinks = _favDrinks.filter((drink) => drink.id != drinkId);
  showDrink(drinkId);
  appendFavDrinks(); // update the DOM to display the right items from the _favMovies list
}

/**
 * Checking if movie already is added to _favMovies
 */
function isFavDrink(drinkId) {
  return _favDrinks.find((drink) => drink.id == drinkId); // checking if _favMovies has the movie with matching id or not
}

// ========== Grab ingredients ==========

function ingredientsList(drink) {
  let html = "";
  for (const ingredient of drink.ingredients) {
    html += /*html*/ `
    <p class="${ingredient.name} ingredient-button">${ingredient.amount} cl <span class="langlinje">|</span> ${ingredient.name}</p>
    `;
  }
  return html;
}
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
function optionalList(drink) {
  let htmlOptional = "";
  if (drink.citron === "true") {
    htmlOptional += /*html*/ `
      <img src="https://5.imimg.com/data5/PP/CF/MY-49449950/mineral-water-ice-cubes-500x500.jpg">
      `;
  }
  if (drink.ice === "true") {
    htmlOptional += /*html*/ `
      <img src="https://5.imimg.com/data5/PP/CF/MY-49449950/mineral-water-ice-cubes-500x500.jpg">
      `;
  }
  if (drink.shaker === "true") {
    htmlOptional += /*html*/ `
      <img src="https://5.imimg.com/data5/PP/CF/MY-49449950/mineral-water-ice-cubes-500x500.jpg">
      `;
  }
  return htmlOptional;
}

async function createDrinks() {
  showLoader(true);
  // references to input fields
  let nameInput = document.querySelector("#name");
  let mailInput = document.querySelector("#mail");
  // dummy generated user id
  const drinkId = Date.now();
  // declaring a new user object
  let newDrink = {
    name: nameInput.value,
    mail: mailInput.value,
    id: drinkId,
  };
  // pushing the new user object to the _drinks array
  _drinks.push(newDrink);
  // wait for update
  await updateJSONBIN(_drinks);
  // reset
  nameInput.value = "";
  mailInput.value = "";
  //navigating back
  navigateTo("#/");
}

// ========== Services ==========

async function updateJSONBIN(drinks) {
  // put drinks array to jsonbin
  let response = await fetch(_baseUrl, {
    method: "PUT",
    headers: _headers,
    body: JSON.stringify(drinks),
  });
  // waiting for the result
  const result = await response.json(); // the new updated drinks array from jsonbin
  console.log(result);
  //updating the DOM with the new fetched drinks
  // appendDrinks(result.record);
}

// ========== Loader ==========
// to show and hide the loader
function showLoader(show) {
  let loader = document.getElementById("loader");
  if (show) {
    loader.classList.remove("hide");
  } else {
    loader.classList.add("hide");
  }
}

/* Open when someone clicks on the span element */
function openNav() {
  document.getElementById("myNav").style.width = "100%";
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

// ========= From Discover cards to chosen category ========= //
function filterByKeyword(keyword) {
  const filteredDrinks = _drinks.filter((drink) => {
    const result = drink.categories.find((category) => {
      return category === keyword;
    });
    return result;
  });

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

function showDrink(id) {
  const drink = _drinks.find((drink) => drink.id == id);
  document.querySelector("#chosen-drink").innerHTML = /*html*/ `
      <article class="drink-card">
          <div class="drinks-top">
          <span class="arrow">
        <button onclick="goBack()"><i class="fas fa-arrow-left"></i></button>
          </span>
            <div class="drink-top-name">
              <h3>${drink.name}</h3><br>
              <p>${drink.strength} strength</p>
            </div>
            <span class="favheart">
              ${generateFavMovieButton(drink.id)}
              <!-- COPY -->

           </span>
          </div>
      <div class="drinks-mid">
        <img class="drink-img" src="${drink.img}">
      </div>
          <div class="drinks-bottom">
          <div class="servings-ingredients">
          <label class="servingAmount" for="servingsAmount">
              <select id="servingsAmount" onchange="multiply(this.value, ${
                drink.id
              })">
                <option value="" selected disabled>Select..</option>
                <option value="1">1 serving</option>
                <option value="2">2 servings</option>
                <option value="3">3 servings</option>
              </select>
            </label>
            <div class="ingredients">
           <h4>Ingredients</h4>
           <div id="ingredientSubmit"></div>
            </div>
            </div>

        <div class="optional">
        <h4>Optional</h4>
        ${optionalList(drink)}
          </div>

      </div>
        <div class="drinks-card-bottom"></div>
        <div class="card-approach">

        <div class="approach-description">
        </div>

        <div class="approach-navigation">
  <a><i class="fas fa-arrow-circle-left fa-3x"></i></a>
  <a><i class="fas fa-arrow-circle-right fa-3x"></i></a>
  </div>
  
  </div>
        </div>
      </article>
    `;
  navigateTo("#/specific-drink");
}

function goBack() {
  window.history.back();
}
