import { async } from "regenerator-runtime";
import { getJson } from "./helper";
import { API_URL } from "./config";
import { RES_NUM, KEY } from "./config";
import { AJAX } from "./helper";

export const state = {
  recipe: {},
  search: {
    results: [],
    query: "",
    resultPerPage: RES_NUM,
    page: 1,
  },
  bookmark: [],
};

const createRecipe = function (data) {
  const { recipe } = data.data;
  return {
    title: recipe.title,
    id: recipe.id,
    publisher: recipe.publisher,
    servings: recipe.servings,
    image: recipe.image_url,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    sourceUrl: recipe.source_url,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`); //error would come from here
    state.recipe = createRecipe(data);

    //check if any recipe in the bookmark array is the current recipe
    //add the bookmarked property to all loaded recipes
    if (state.bookmark.some((rec) => rec.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(err);
    throw err; //throw the error so that controller can catch
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.results = data.data.recipes.map((arr) => {
      return {
        title: arr.title,
        id: arr.id,
        publisher: arr.publisher,
        image: arr.image_url,
        ...(arr.key && { key: arr.key }),
      };
    });
    //set topage 1 when start new search
    state.search.page = 1;
  } catch (err) {
    console.error(err);
    throw err; //throw the error so that controller can catch
  }
};

const storeBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmark));
};

export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServing) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServing) / state.recipe.servings;
  });
  state.recipe.servings = newServing;
};

export const addBookmark = function (recipe) {
  state.bookmark.push(recipe);
  //mark the current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  storeBookmarks(); //put in local storage after renewing the bookmark array
};

export const removeBookmark = function (id) {
  //find the recipe in the bookmark array that has the same id as the current recipe
  const index = state.bookmark.findIndex((el) => el.id === id);
  state.bookmark.splice(index, 1);
  //mark the current recipe as not bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  storeBookmarks(); //put in local storage after renewing the bookmark array
};

const init = function () {
  //load the stored recipes to bookmarks
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmark = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
  localStorage.clear("bookmarks");
};
//clearBookmarks();

export const uploadRecipes = async function (newRecipe) {
  try {
    //turn the input object to an array
    const ingredients = Object.entries(newRecipe)
      //filter the array and get the ingredients arries
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((entry) => {
        //destructure the value
        const ingArr = entry[1].split(",").map((el) => el.trim());
        if (ingArr.length !== 3)
          throw new Error("Wrong format! Please use the correct format.");
        console.log(ingArr);
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description }; //returns a promise
      });

    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      servings: +newRecipe.servings,
      image_url: newRecipe.image,
      cooking_time: +newRecipe.cookingTime,
      source_url: newRecipe.sourceUrl,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipe(data);
    //add the uploaded recipe to bookmark
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
