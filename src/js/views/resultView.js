import View from "./view";
import previewView from "./previewView";

class ResultView extends View {
  _parentEl = document.querySelector(".results");
  _errorMessage = `Couldn't find recipe for your query. Please try again.`;
  message = "";

  _generateMarkup() {
    // generate markup based on previewView markup
    return this._data
      .map((result) => previewView.render(result, false))
      .join("");
  }
}

export default new ResultView();
