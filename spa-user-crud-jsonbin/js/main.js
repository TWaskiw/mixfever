// ========== GLOBAL VARIABLES =========

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
          <div class="drinks-top">
          <span class="arrow">
          <i class="fas fa-arrow-left"></i>
          </span>
            <div class="drink-top-name">
              <h3>${drink.name}</h3><br>
              <p>${drink.strength} strength</p>
            </div>
            <span class="heart">
              <i class="far fa-heart"></i>
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
function appendTeachers(teachers) {
  document.querySelector("#grid-teachers").innerHTML = ""; // clear content of grid teachers
  for (let teacher of teachers) {
    console.log(teacher);
    document.querySelector("#grid-teachers").innerHTML +=
      "<article>" +
      "<img src='" +
      teacher.img +
      "'>" +
      "<h3>" +
      teacher.name +
      "</h3>" +
      teacher.position +
      "<br>" +
      "<a href='mailto:" +
      teacher.mail +
      "'>" +
      teacher.mail +
      "</a><br>" +
      "Keywords: " +
      teacher.keywords +
      "</article>";
  }
}

function filterByKeyword(keyword) {
  let filteredTeachers = [];
  for (let teacher of teachers) {
    if (teacher.keywords.includes(keyword)) {
      filteredTeachers.push(teacher);
    }
  }
  console.log(filteredTeachers);
  appendTeachers(filteredTeachers);
}

function reset() {
  appendTeachers(teachers);
}
