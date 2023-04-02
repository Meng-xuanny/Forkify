import * as model from "./model";
import recipeView from "./views/recipeView";
import searchView from "./views/searchView";
import resultView from "./views/resultView";
import pageView from "./views/pagenationView";
import "core-js/stable";
import bookmarkView from "./views/bookmarkView";
import addWindowView from "./views/addWindowView";
import { TIME_OUT_SEC } from "./config.js";

//keep the state
// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    //get recipe from api
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();
    //update mark up class.no search results here so update gets an empty array
    resultView.update(model.getSearchResultPage());
    //update the bookmark once the current recipe is changed
    bookmarkView.update(model.state.bookmark);
    //load recipe. 'loadRecipe' is an async function which returns a promise
    //so need to await it. Then the data is stored in the state object in model
    await model.loadRecipe(id); //error would come from here

    //render recipe

    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError(); //render the error to show on recipeView
  }
};

const controlServingUpdate = function (newServing) {
  model.updateServings(newServing);
  //render updated recipe
  recipeView.update(model.state.recipe);
};

const controSearchResults = async function () {
  try {
    // get input query from view
    const query = searchView.getQuery();
    if (!query) return;
    //load search results
    resultView.renderSpinner();
    await model.loadSearchResults(query);

    //render 10 search results per page
    resultView.render(model.getSearchResultPage());
    //add page buttons
    pageView.render(model.state.search);
  } catch (err) {
    resultView.renderError();
  }
};

const controlPage = function (gotoPage) {
  //render new search results
  resultView.render(model.getSearchResultPage(gotoPage));
  //render new page buttons
  pageView.render(model.state.search);
};

const controlBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);
  //update the recipeView
  recipeView.update(model.state.recipe);
  bookmarkView.render(model.state.bookmark);
};

const controlBookmarkPre = function () {
  bookmarkView.render(model.state.bookmark);
};

const controlUploadWindow = async function (newRecipe) {
  try {
    //render a spinner
    addWindowView.renderSpinner();

    await model.uploadRecipes(newRecipe);
    //render uploaded recipe in the recipeView
    recipeView.render(model.state.recipe);
    //render a success message
    addWindowView.renderMessage();

    bookmarkView.render(model.state.bookmark);

    //change ID in URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`);
    //set timeout for the window to disappear
    setTimeout(function () {
      addWindowView.toggleWindow();
    }, TIME_OUT_SEC * 1000);
  } catch (err) {
    addWindowView.renderError(err.message);
  }
};
//event handling
const init = function () {
  bookmarkView.addHandlerBookmark(controlBookmarkPre); //render bookmarks as soon as the window loads so update won't get errors
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdate(controlServingUpdate);
  recipeView.addHandlerBookmark(controlBookmark);
  searchView.addHandlerSearch(controSearchResults);
  pageView.addHandlerPage(controlPage);
  addWindowView.addHandlerUpload(controlUploadWindow);
};
init();
