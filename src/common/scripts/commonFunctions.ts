/* eslint-disable @typescript-eslint/ban-ts-comment */
type TypeCheckInputText = (
  text: string,
  checkedSymbols?: RegExp
) => {
  status: boolean;
  res: '' | 'empty' | 'forbidden';
  errSymbols: string;
};

/**
 * Validation of data entry in the input field
 * @param text from the input field
 * @param regExp a string of invalid characters. For example: everything except these
 * Result:
 *      0 is an empty string
 *      1 the string has invalid characters, errSymbols returns a list separated by a space
 *     -1 not errors
 */
export const checkInputText: TypeCheckInputText = (text, checkedSymbols) => {
  const regExp = checkedSymbols || /[^а-я.\w\s\-\d]+/gi;

  if (text === '') return { status: false, res: 'empty', errSymbols: '' };

  const res = text.match(regExp);
  if (res) return { status: false, res: 'forbidden', errSymbols: res.join(' ') };

  return { status: true, res: '', errSymbols: '' };
};

/**
 * Sets autofocus to an element with this ID
 * @param element_id ID of the element for focus
 */
export const setFocusToElement = (element_id: string): void => {
  const element = document.getElementById(element_id);
  if (!element) return;

  setTimeout(() => {
    element.focus(); // @ts-ignore
    element.select();
  }, 10);
};

/**
 * If a certain class exists, then remove, otherwise, add to this element with that class.
 * @param classNameOrElementHtml Object class to change
 * @param className added / removed class
 */
export const toggleClassElement = (classNameOrElementHtml: string | HTMLElement, className: string): boolean => {
  let element;
  if (typeof classNameOrElementHtml === 'string') {
    element = document.querySelector(classNameOrElementHtml);
  } else {
    element = classNameOrElementHtml;
  }

  if (!element) return false;

  if (element.classList.contains(className)) {
    element.classList.remove(className);
    return true;
  }
  element.classList.add(className);
  return false;
};

export const toggleDisplayNoneToBlock = (element: HTMLElement | null): void => {
  if (element) {
    const { display } = getComputedStyle(element);
    const displ = display !== 'none' ? display : 'block';

    if (display === 'none') {
      // eslint-disable-next-line no-param-reassign
      element.style.display = displ;
    } else {
      // eslint-disable-next-line no-param-reassign
      element.style.display = 'none';
    }
  }
};

/**
 * checks the objects that were clicked and returns true if none of the passed objects was clicked.
 * True if the input window can be closed.
 * @param listClassesOrIdHtmlElements an array of classes or id which should not be closed by clicking on the input field
 * @param target object that was clicked
 */
export const isCloseInputField = (listClassesOrIdHtmlElements: string[], target: EventTarget | null): boolean => {
  let clickObj1 = true;

  for (let i = 0; i < listClassesOrIdHtmlElements.length; i++) {
    const obj =
      listClassesOrIdHtmlElements[i][0] === '.'
        ? document.querySelector(listClassesOrIdHtmlElements[i])
        : document.getElementById(listClassesOrIdHtmlElements[i]);

    if (obj && obj === target) {
      clickObj1 = false;
    }
  }

  return clickObj1;
};
