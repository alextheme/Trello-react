/**
 * Validation of data entry in the input field
 * @param text from the input field
 * @param regExp a string of invalid characters. For example: everything except these
 * Result:
 *      0 is an empty string
 *      1 the string has invalid characters, errSymbols returns a list separated by a space
 *     -1 not errors
 */
export const checkInputText = (text: string, regExp = /[^а-я.\w\s\-\d]+/gi): { res: number; errSymbols: string } => {
  if (text === '') return { res: 0, errSymbols: '' };

  const res = text.match(regExp);
  if (res) return { res: 1, errSymbols: res.join(' ') };

  return { res: -1, errSymbols: '' };
};

/**
 * Sets autofocus to an element with this ID
 * @param elementId ID of the element for focus
 */
export const setFocusToElement = (elementId: string): void => {
  const element = document.getElementById(elementId);
  if (!element) return;
  setTimeout(() => {
    element.focus();
  });
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

    console.log('display: ', display);

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
 * Get object by method querySelector
 * @param selector class element
 */
export const getHtmlObjectQS = (selector: string): HTMLElement | null => document.querySelector(selector);

/**
 * Get object by method getElementById
 * @param id id element without #
 */
export const getHtmlObjectID = (id: string): HTMLElement | null => document.getElementById(id);

/**
 * checks the objects that were clicked and returns true if none of the passed objects was clicked.
 * True if the input window can be closed.
 * @param htmlElements an array of classes or id which should not be closed by clicking on the input field
 * @param target object that was clicked
 */
export const closeInputField = (htmlElements: string[], target: EventTarget | null): boolean => {
  let clickObj1 = true;

  for (let j = 0; j < htmlElements.length; j++) {
    const obj = htmlElements[j][0] === '.' ? getHtmlObjectQS(htmlElements[j]) : getHtmlObjectID(htmlElements[j]);
    // @ts-ignore
    if (obj && obj === target) {
      clickObj1 = false;
    }
  }

  return clickObj1;
};
