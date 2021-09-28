// ========== GLOBAL VARS ==========
let _drinks = [];
let _selectedDrinkId;
const _baseUrl = "https://api.jsonbin.io/v3/b/61517eb24a82881d6c5637e3";

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

function appendDrinks(drinks) {
  let htmlTemplate = "";
  for (let drink of drinks) {
    htmlTemplate += /*html*/ `
      <article class="drink-card">
      <div class="drinks-page-top">
          <div class="drinks-top-name">
        <h3>${drink.name}</h3>
        <p>${drink.strength}</p>
          </div>
             <div class="favorite-btn">
                  <i class="far fa-heart"></i>
                  </div>
      </div>
      <div class="drinks-mid">
        <div class="ingredients">
        <h4>Ingredients</h4>
        ${ingredientsList(drink)}
           </div>
        <div class="optional">
        <h4>Optional</h4>
          </div>
      </div>
        <div class="drinks-card-bottom">
        
        </div>
      </article>
      `;
  }
  document.querySelector("#grid-drinks").innerHTML = htmlTemplate;
  showLoader(false);
}

// ========== Grab ingredients ==========

function ingredientsList(drink) {
  let html = "";
  for (const ingredient of drink.ingredients) {
    console.log(ingredient);
    html += /*html*/ `
    <p class="${ingredient.name} ingredient-button">${ingredient.name}</p>
    `;
  }
  return html;
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
