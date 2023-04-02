import View from "./view";

class AddWindowView extends View {
  _parentEl = document.querySelector(".upload");
  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");
  message = "Successfully uploaded a recipe!";

  constructor() {
    super();
    this._showWindow();
    this._closeWindow();
  }

  toggleWindow() {
    this._window.classList.toggle("hidden");
    this._overlay.classList.toggle("hidden");
  }

  _showWindow() {
    this._btnOpen.addEventListener("click", this.toggleWindow.bind(this));
  }

  _closeWindow() {
    //when click on close btn
    this._btnClose.addEventListener("click", this.toggleWindow.bind(this));
    //when click outside of window on the overlay
    this._overlay.addEventListener("click", this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentEl.addEventListener("submit", function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)]; //creates a new formdata object and converts it in to an array

      const data = Object.fromEntries(dataArr); //turns array to object
      handler(data);
    });
  }
  _generateMarkup() {}
}

export default new AddWindowView();
