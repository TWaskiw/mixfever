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
           <span class="heart">
              <i class="far fa-heart"></i>
           </span>
      </div>
      <div class="drinks-mid">
        <div class="ingredients">
        <h4>Ingredients</h4>
        ${ingredientsList(drink)}
           </div>
        <div class="optional">
        <h4>Optional</h4>
        <img id="icecubes"src="data:image/svg+xml;base64,PHN2ZyBpZD0iQ2FwYV8xIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIgNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHdpZHRoPSI1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGc+PHBhdGggZD0ibTIuMTg0IDExMi42Yy0xLjQwNyAyLjQzNy0yLjE4NCA1LjIzOC0yLjE4NCA4LjE1djE2MS45MzNjMCA1LjgyMyAzLjEwNyAxMS4yMDQgOC4xNSAxNC4xMTZsMTQwLjIzOCA4MC45NjZjMi41MjIgMS40NTYgNS4zMzYgMi4xODQgOC4xNSAyLjE4NGwyMS44NTgtMTkwLjg1MnoiIGZpbGw9IiNiOWU0ZWYiLz48cGF0aCBkPSJtMTU2LjUzNyAxNjguMzU5djIxMS41OWMyLjgxNCAwIDUuNjI4LS43MjggOC4xNS0yLjE4NGw3OS4wMjgtNDUuNjI3IDY5LjM2LTExMy44NDd2LTk3LjU0MWMwLTIuOTEyLS43NzctNS43MTMtMi4xODQtOC4xNXoiIGZpbGw9IiM5M2Q4ZTQiLz48cGF0aCBkPSJtMzEwLjg5MSAxMTIuNmMtMS40MDctMi40MzctMy40NDQtNC41MS01Ljk2Ni01Ljk2NmwtMTQwLjIzOC04MC45NjZjLTUuMDQzLTIuOTExLTExLjI1Ni0yLjkxMS0xNi4yOTkgMGwtMTQwLjIzOCA4MC45NjZjLTIuNTIyIDEuNDU2LTQuNTU5IDMuNTI5LTUuOTY2IDUuOTY2bDE1NC4zNTQgODkuMTE2eiIgZmlsbD0iI2RhZjFmNCIvPjxwYXRoIGQ9Im0yNDUuNTg2IDI1OS40MTZjLTEuMjA2IDIuMDg5LTEuODcxIDQuNDg5LTEuODcxIDYuOTg0djEzOC43NjZjMCA0Ljk5IDIuNjYyIDkuNjAxIDYuOTg0IDEyLjA5NmwxMjAuMTc1IDY5LjM4M2MyLjE2MSAxLjI0NyA0LjU3MiAxLjg3MSA2Ljk4NCAxLjg3MWwxMS41MTItMTY0LjI0NnoiIGZpbGw9IiNiOWU0ZWYiLz48cGF0aCBkPSJtMjc4Ljc4IDEzMS4xMzljLTIuMTMzLTMuNjk2LTYuODYtNC45NjItMTAuNTU0LTIuODI4bC0xMTEuNjg4IDY0LjQ4My0xMTEuNjg4LTY0LjQ4MmMtMy42OTYtMi4xMzUtOC40MjEtLjg2OC0xMC41NTQgMi44MjgtMi4xMzQgMy42OTYtLjg2OCA4LjQyMSAyLjgyOCAxMC41NTRsMTExLjY4NyA2NC40ODN2MTI4Ljk2NmMwIDQuMjY3IDMuNDU5IDcuNzI2IDcuNzI2IDcuNzI2czcuNzI2LTMuNDU5IDcuNzI2LTcuNzI2di0xMjguOTY2bDExMS42ODgtNjQuNDgzYzMuNjk2LTIuMTM0IDQuOTYyLTYuODU5IDIuODI5LTEwLjU1NXoiIGZpbGw9IiNlY2Y5ZjkiLz48cGF0aCBkPSJtNTguMjI3IDExNS4xOTNjLTIuNjcgMC01LjI2Ny0xLjM4Ni02LjY5OC0zLjg2NS0yLjEzNC0zLjY5Ni0uODY4LTguNDIxIDIuODI4LTEwLjU1NGw0NS43NDUtMjYuNDExYzMuNjk2LTIuMTM0IDguNDIxLS44NjggMTAuNTU0IDIuODI4IDIuMTM0IDMuNjk2Ljg2OCA4LjQyMS0yLjgyOCAxMC41NTRsLTQ1Ljc0NSAyNi40MTFjLTEuMjE2LjcwMy0yLjU0NSAxLjAzNy0zLjg1NiAxLjAzN3oiIGZpbGw9IiNlY2Y5ZjkiLz48cGF0aCBkPSJtMzc3Ljg1OCAzMjYuODYxdjE2MS42NTVjMi40MTEgMCA0LjgyMy0uNjI0IDYuOTg0LTEuODcxbDEyMC4xNzUtNjkuMzgzYzQuMzIyLTIuNDk1IDYuOTg0LTcuMTA2IDYuOTg0LTEyLjA5NnYtMTM4Ljc2NmMwLTIuNDk1LS42NjUtNC44OTUtMS44NzEtNi45ODR6IiBmaWxsPSIjOTNkOGU0Ii8+PHBhdGggZD0ibTUxMC4xMjkgMjU5LjQxNmMtMS4yMDYtMi4wODgtMi45NTItMy44NjUtNS4xMTMtNS4xMTJsLTEyMC4xNzUtNjkuMzg0Yy00LjMyMS0yLjQ5NS05LjY0Ni0yLjQ5NS0xMy45NjggMGwtMTIwLjE3NSA2OS4zODNjLTIuMTYxIDEuMjQ3LTMuOTA3IDMuMDI0LTUuMTEyIDUuMTEybDEzMi4yNzEgNzYuMzY3eiIgZmlsbD0iI2RhZjFmNCIvPjxnIGZpbGw9IiNlY2Y5ZjkiPjxwYXRoIGQ9Im0zMzMuNjggMjQzLjg2NWMtMi42NyAwLTUuMjY4LTEuMzg2LTYuNjk4LTMuODY1LTIuMTM0LTMuNjk2LS44NjctOC40MjEgMi44MjgtMTAuNTU0bDQ0LjE4NS0yNS41MWMzLjY5My0yLjEzNCA4LjQyMi0uODY4IDEwLjU1NCAyLjgyOCAyLjEzNCAzLjY5Ni44NjcgOC40MjEtMi44MjggMTAuNTU0bC00NC4xODUgMjUuNTFjLTEuMjE2LjcwMy0yLjU0NSAxLjAzNy0zLjg1NiAxLjAzN3oiLz48cGF0aCBkPSJtNDgzLjU2OCAyNzQuNzVjLTIuMTM0LTMuNjk2LTYuODYxLTQuOTYyLTEwLjU1NC0yLjgyOGwtOTUuMTU3IDU0LjkzOS05NS4xNTYtNTQuOTM5Yy0zLjY5Ny0yLjEzNC04LjQyMy0uODY4LTEwLjU1NCAyLjgyOC0yLjEzNCAzLjY5Ni0uODY3IDguNDIxIDIuODI4IDEwLjU1NGw5NS4xNTYgNTQuOTM5djEwOS44NzdjMCA0LjI2NyAzLjQ1OSA3LjcyNiA3LjcyNiA3LjcyNnM3LjcyNi0zLjQ1OSA3LjcyNi03LjcyNnYtMTA5Ljg3N2w5NS4xNTctNTQuOTM5YzMuNjk2LTIuMTMzIDQuOTYyLTYuODU4IDIuODI4LTEwLjU1NHoiLz48L2c+PC9nPjwvc3ZnPg==" />
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
    html += /*html*/ `
    <p class="${ingredient.name} ingredient-button">${ingredient.amount} cl <span class="langlinje">|</span> ${ingredient.name}</p>
    `;
  }
  return html;
}

function optionalList(drink) {
  let optionalItems = document.getElementById("#icecubes");
  if (drink.citron === true) optionalItems.style.display = "none";
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
