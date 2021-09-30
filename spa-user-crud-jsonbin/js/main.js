// ========== GLOBAL VARIABLES =========

let _drinks = [];
let _selectedDrinkId;
const _baseUrl = "https://api.jsonbin.io/v3/b/61517eb24a82881d6c5637e3";

const _headers = {
  "X-Master-Key": "$2b$10$EN1s0LmPgjsOM5AjYId5kOw8OcDusdvLFYzv1lTu5WVK1HBrhQPqK",
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
  appendFavDrinks(_favDrinks)
}
loadDrinks();

function appendDrinks(drinks) {
  let htmlTemplate = "";
  for (let drink of drinks) {
    htmlTemplate += /*html*/ `
      <article class="drink-card">
          <div class="drinks-top">
          <span class="arrow">
          <i class="fas fa-arrow-left"></i>
          </span>
            <div class="drink-top-name">
              <h3>${drink.name}</h3><br>
              <p>${drink.strength} strength</p>
            </div>
            <span class="favheart">
              <i class="far fa-heart"></i>

              <!-- COPY -->
              <label for="servingsAmount">Servings amount:
              <select id="servingsAmount" onchange="multiply(this.value)">
                <option value="1" selected disabled>Choose here</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </label>

           </span>
          </div>
      <div class="drinks-mid">
        <img class="drink-img" src="${drink.img}">
      </div>
          <div class="drinks-bottom">
            <div class="ingredients">
           <h4>Ingredients</h4>
            ${ingredientsList(drink)}
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
  }
  document.querySelector("#grid-drinks").innerHTML = htmlTemplate;
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
    <button onclick="addToFavourites('${drinkId}')">Add to favourites</button>`;
  if (isFavDrink(drinkId)) {
    btnTemplate = `
      <button onclick="removeFromFavourites('${drinkId}')" class="rm">Remove from favourites</button>`;
  }
  return btnTemplate;
}

/**
 * Adding movie to favorites by given movieId
 */
function addToFavourites(drinkId) {
  let favdrink = _drinks.find((drink) => drink.id === drinkId);
  _favDrinks.push(favdrink);
  appendDrinks(_drinks); // update the DOM to display the right button
  appendFavDrinks(); // update the DOM to display the right items from the _favMovies list
}

/**
 * Removing movie from favorites by given drinkId
 */
function removeFromFavourites(drinkId) {
  _favDrinks = _favDrinks.filter((drink) => drink.id !== drinkId);
  appendDrinks(_drinks); // update the DOM to display the right button
  appendFavDrinks(); // update the DOM to display the right items from the _favMovies list
}

/**
 * Checking if movie already is added to _favMovies
 */
function isFavDrink(drinkId) {
  return _favDrinks.find((drink) => drink.id === drinkId); // checking if _favMovies has the movie with matching id or not
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

// COPY
function multiply(drink) {
  let servingsInput = document.querySelector("#servingsAmount").value;
  console.log(servingsInput);
  /*
  let ingredientsAmount = ${ingredientsList()};
  /*
  let ingredientAmount = drinks.ingredients.amount;
  let servingsResult = servingsInput * ingredientAmount;
  console.log();
  */
}
/*
function multiplyServings() {
  let inputServing = document.querySelector("#servingsAmount");
}
*/
/*
function multiplyServings() {
  let servingOption = document.getElementById("#servingsAmount");
  let servingValue = servingOption.value;
  let result = servingValue * 10;
  console.log(result);
  }
*/


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
  appendDrinks(result.record);
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
  const filteredDrinks = _drinks.filter(drink => {
    const result = drink.categories.find(category => {
      return category === keyword
    })
    return result
  });

  document.getElementById("category-title").innerText = keyword;
  
  document.getElementById("alcohol-test").innerHTML = filteredDrinks.map(drink => {
    return `<div class="vodka-card">${drink.name}</div>`
  }).join("");

//   document.querySelector("body").innerHTML = `
//   <section id="category" class="page">
//   <div class="discover-top">
//     <i class="fas fa-arrow-left"></i>
//     <h1>SDFSDFSDF</h1>
//   </div>
// </section>`;
  navigateTo("#/category");
  return filteredDrinks
}