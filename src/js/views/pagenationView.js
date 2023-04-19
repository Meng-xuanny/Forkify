import View from "./view";
import icons from "url:../../img/icons.svg";

class PageView extends View {
  _parentEl = document.querySelector(".pagination");

  _generateMarkup() {
    const pageNum = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );
    const curPage = this._data.page;
    //console.log(curPage);

    //when on page 1 and there are other pages
    if (curPage === 1 && pageNum > 1) return;
    `<p class="page--current">
        <span>${curPage}</span>
      </p>
      <button data-goto='${
        curPage + 1
      }' class="btn--inline  pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>`;
    //when on other pages
    if (curPage < pageNum) return;
    `<button data-goto='${
      curPage + 1
    }' class="btn--inline  pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
      <p class="page--current">
        <span>${curPage}</span>
      </p>
      <button data-goto='${
        curPage - 1
      }' class="btn--inline  pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>`;

    //when on last page
    if (curPage === pageNum && pageNum > 1) return;
    `<p class="page--current">
        <span>${curPage}</span>
      </p>
      <button data-goto='${
        curPage - 1
      }' class="btn--inline  pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>`;
    //when there's only one page
    return "";
  }

  addHandlerPage(handler) {
    this._parentEl.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");

      if (!btn) return;
      // get the page number from data to be connected to controller
      const gotoPage = Number(btn.dataset.goto);

      handler(gotoPage);
    });
  }
}

export default new PageView();
