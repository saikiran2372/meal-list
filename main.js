if (localStorage.getItem("favouritesList") == null) {
    localStorage.setItem("favouritesList", JSON.stringify([]));
}

async function fetchMealsFromApi(url, value) {
    try {
        const response = await fetch(`${url}${value}`);
        const meals = await response.json();
        console.log(meals)
        return meals;
    } catch (error) {
        console.error("Error fetching meals from API:", error);
    }
}

async function showMealList() {
    let inputValue = document.getElementById("my-search").value;
    let arr = JSON.parse(localStorage.getItem("favouritesList"));
    let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    let html = "";
    let meals = await fetchMealsFromApi(url, inputValue);
    
    if (meals && meals.meals) {
        meals.meals.forEach((element) => {
            let isFav = arr.includes(element.idMeal);
            html += `
                <div id="card" class="card mb-3" style="width: 20rem;">
                    <img src="${element.strMealThumb}" class="card-img-top" alt="Meal Image">
                    <div class="card-body">
                        <h5 class="card-title">${element.strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${element.idMeal})">More Details</button>
                            <button id="main${element.idMeal}" class="btn btn-outline-light ${isFav ? 'active' : ''}" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius: 50%">${isFav ? 'Remove' : 'Add'}</button>
                        </div>
                    </div>
                </div>`;
        });
    } else {
        html += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
                            <span class="display-1 d-block">404</span>
                            <div class="mb-4 lead">The meal you are looking for was not found.</div>
                        </div>
                    </div>
                </div>
            </div>`;
    }
    document.getElementById("main").innerHTML = html;
}

async function showMealDetails(id) {
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";
    let data = await fetchMealsFromApi(url, id);
    
    if (data && data.meals) {
        html += `
            <div id="meal-details" class="mb-5">
                <div id="meal-header" class="d-flex justify-content-around flex-wrap">
                    <div id="meal-thumbnail">
                        <img class="mb-2" src="${data.meals[0].strMealThumb}" alt="Meal Thumbnail">
                    </div>
                    <div id="details">
                        <h3>${data.meals[0].strMeal}</h3>
                        <h6>Category: ${data.meals[0].strCategory}</h6>
                        <h6>Area: ${data.meals[0].strArea}</h6>
                    </div>
                </div>
                <div id="meal-instruction" class="mt-3">
                    <h5 class="text-center">Instructions:</h5>
                    <p>${data.meals[0].strInstructions}</p>
                </div>
                <div class="text-center">
                    <a href="${data.meals[0].strYoutube}" target="_blank" class="btn btn-outline-light mt-3">Watch Video</a>
                </div>
            </div>`;
    } else {
        html += "<div class='text-center'>Meal details not found</div>";
    }
    document.getElementById("main").innerHTML = html;
}

async function showFavMealList() {
    let arr = JSON.parse(localStorage.getItem("favouritesList"));
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";
    if (arr.length == 0) {
        html += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
                            <span class="display-1 d-block">404</span>
                            <div class="mb-4 lead">No meals added to your favourites list</div>
                        </div>
                    </div>
                </div>
            </div>`;
    } else {
        for (let index = 0; index < arr.length; index++) {
            let data = await fetchMealsFromApi(url, arr[index]);
            if (data && data.meals) {
                html += `
                    <div id="card" class="card mb-3" style="width: 20rem;">
                        <img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="Meal Image">
                        <div class="card-body">
                            <h5 class="card-title">${data.meals[0].strMeal}</h5>
                            <div class="d-flex justify-content-between mt-5">
                                <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${data.meals[0].idMeal})">More Details</button>
                                <button id="main${data.meals[0].idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${data.meals[0].idMeal})" style="border-radius: 50%">Remove</button>
                            </div>
                        </div>
                    </div>`;
            }
        }
    }
    document.getElementById("favourites-body").innerHTML = html;
}

function addRemoveToFavList(id) {
    let arr = JSON.parse(localStorage.getItem("favouritesList"));
    let contain = arr.includes(id);
    if (contain) {
        arr = arr.filter(item => item !== id);
        alert("Your meal has been removed from your favourites list");
    } else {
        arr.push(id);
        alert("Your meal has been added to your favourites list");
    }
    localStorage.setItem("favouritesList", JSON.stringify(arr));
    showMealList();
    showFavMealList();
}
