import View from "./view";
import previewView from "./previewView";

class BookmarkView extends View {
  _parentEl = document.querySelector(".bookmarks");
  _errorMessage = `No bookmarks. Find a recipe and bookmark it!`;
  message = "";

  addHandlerBookmark(handler) {
    window.addEventListener("load", handler);
  }
  _generateMarkup() {
    return this._data
      .map((result) => previewView.render(result, false))
      .join("");
  }
}

export default new BookmarkView();
