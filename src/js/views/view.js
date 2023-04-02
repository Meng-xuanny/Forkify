import icons from "url:../../img/icons.svg";

export default class View {
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError(); //returns error if []

    this._data = data;
    const markup = this._generateMarkup();
    //check if it's previewView calling the method. If so, return the preview markup
    // if not, execute the original markup
    if (!render) return markup; //this code won't run when other views calling the render method
    this._clear(); //clear the parent field
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  update(data) {
    //wouldn't render anything if []
    this._data = data;
    const newMarkup = this._generateMarkup(); //new markup after clicking
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDom.querySelectorAll("*"));
    const curElements = Array.from(this._parentEl.querySelectorAll("*"));
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      //console.log(curEl, newEl.isEqualNode(curEl));
      //check for the changed elements
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      )
        curEl.textContent = newEl.textContent; //updates changed text
      if (!newEl.isEqualNode(curEl))
        //updates changed attributes
        Array.from(newEl.attributes).forEach((attr) =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }
  _clear() {
    this._parentEl.innerHTML = "";
  }

  renderSpinner() {
    const html = `<div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", html);
  }

  renderMessage(message = this.message) {
    const markup = `<div class="recipe">
        <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }
}
