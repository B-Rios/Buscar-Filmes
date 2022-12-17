const API_KEY = "";
const page = "page=";
const BASE_URL = `https://www.omdbapi.com/?apikey=${API_KEY}&r=json&`;
const input = document.querySelector("#search-title");
const resultContainer = document.querySelector("#result-container");
const JSONcontainer = document.querySelector("#json-container");

document
  .querySelectorAll(".search-btn")
  .forEach((element) =>
    element.addEventListener("click", (e) => handleSearch(e))
  );

function handleSearch(e) {
  const btnType = e.srcElement.alt;
  resultContainer.innerHTML = "";
  var searchValue = input.value;
  const search = `s=${searchValue}`;
  const URL = BASE_URL + search;
  return requestAPI(URL, btnType);
}

function requestAPI(url, btnType) {
  fetch(url)
    .then((res) => res.json())
    .then((results) => {
      getResults(results, url, btnType);
    });
}

function getResults(results, url, btnType) {
  const totalResults = results.totalResults;
  const pages = Math.ceil(totalResults / 10);
  // console.log(pages);
  for (let i = 1; i < pages + 1; i++) {
    fetch(url + `&page=${i}`)
      .then((res) => res.json())
      .then((data) => {
        descSearch(data, btnType);
      });
  }
}

function descSearch(data, btnType) {
  // https://www.omdbapi.com/?apikey=4086adb9&r=json&i=tt0076759
  data.Search.forEach((element) => {
    const search = `i=${element.imdbID}`;
    const URL = BASE_URL + search;
    fetch(URL)
      .then((res) => res.json())
      .then((data) => {
        if (btnType == "json") {
          showJson(data);
        }
        if (btnType == "result") {
          showResult(data);
        }
      });
  });
}

function showJson(data) {
  // console.log(data);
  const el = document.createElement("div");
  el.innerHTML = JSON.stringify(data, null, "\n");
  JSONcontainer.appendChild(el);
}

function showResult(data) {
  console.log(data);
  const card = document.createElement("div");
  const image = document.createElement("img");
  const descriptions = document.createElement("div");
  const title = document.createElement("h2");
  const p = document.createElement("p");

  card.setAttribute("class", "card");
  card.appendChild(image);
  card.appendChild(descriptions);
  descriptions.setAttribute("class", "descriptions");
  descriptions.appendChild(title);
  descriptions.appendChild(p);
  // el.style.backgroundColor =
  //   "#" + Math.floor(Math.random() * 16777215).toString(16);

  title.innerHTML = `${data.Title}`;
  image.src = data.Poster;
  p.innerHTML = data.Plot;
  if (data.Poster !== "N/A") {
    // image.src =
    //   "https://climate.onep.go.th/wp-content/uploads/2020/01/default-image.jpg";
    resultContainer.appendChild(card);
  }
}
