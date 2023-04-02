import View from "./view";

class SearchView extends View {
  _parentEl = document.querySelector(".search");

  getQuery() {
    let query = this._parentEl.querySelector(".search__field").value;
    this._clear();
    return query;
  }

  _clear() {
    this._parentEl.querySelector(".search__field").value = "";
  }

  addHandlerSearch(handler) {
    this._parentEl.addEventListener("submit", function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
