/**
 * Show error message
 * @param elementId The ID of the element that displays the message.
 * @param timeOut display time
 * @param errText error message
 */
export const showErrText = (elementId: string, timeOut: number, errText: string): void => {
  const elemHtmlError = document.getElementById(elementId);
  if (elemHtmlError) {
    elemHtmlError.style.display = 'block';
    elemHtmlError.innerText = errText;

    setTimeout(() => {
      elemHtmlError.style.display = 'none';
    }, timeOut);
  }
};

/**
 * If this class exists, delete, otherwise add to the body element
 * @param className added / removed class
 */
export const toggleClassBody = (className: string): void => {
  if (document.body.classList.contains(className)) {
    document.body.classList.remove(className);
  } else {
    document.body.classList.add(className);
  }
};
