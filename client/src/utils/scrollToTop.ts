// When the user clicks on the button, scroll to the top of the document
export const scrollToTop = (element: Element | null) => {
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};
