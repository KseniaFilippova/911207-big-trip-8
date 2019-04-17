export const createElement = (template) => {
  const templateElement = document.createElement(`template`);
  templateElement.innerHTML = template;
  return templateElement.content.firstChild;
};
