function createElement(v: HTMLElement): HTMLElement {
  const id = v.getAttribute("id");
  const e = document.createElement("li");
  e.innerHTML = `<a href="#${id}">${v.innerText}</a>`;
  return e;
}
function createWrapElement(_: HTMLElement): HTMLElement {
  let wrap = document.createElement("li");
  wrap.innerHTML = `<ol></ol>`;
  return wrap;
}

const root = document.querySelector('main[\\@section="main"]');
const toc = document.querySelector('ol[\\@section="toc"]');
const titles = Array.from(
  document.querySelectorAll(
    'main[\\@section="main"] h2,main[\\@section="main"] h3',
  ) as NodeListOf<HTMLElement>,
);

let index = new Array<HTMLElement>();

window.addEventListener("scroll", () => {
  index.forEach((v) => v.removeAttribute("current"));
  titles.forEach((v) => v.removeAttribute("current"));
  const i = titles.findIndex((v) => v.getBoundingClientRect().top > -1);
  titles[i].setAttribute("current", "");
  index[i].setAttribute("current", "");
  toc?.parentElement?.scroll({ top: index[i].offsetTop });
});

function init() {
  let intent: number = 0;
  let before: HTMLElement | null;
  Array.from(titles).forEach((v) => {
    if (!v.hasAttribute("id")) {
      v.setAttribute("id", `section-${intent++}`);
    }
    const e = createElement(v);
    index.push(e);
    if (v.tagName == "H2") {
      before = null;
      toc?.appendChild(e);
      return;
    }
    if (!before && v.tagName == "H3") {
      const wrap = createWrapElement(v);
      before = wrap.lastChild as HTMLElement;
      toc?.appendChild(wrap);
    }
    before?.appendChild(e);
  });
  window.dispatchEvent(new Event("scroll"));
}

init();
