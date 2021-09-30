// @ ts-nocheck
/* eslint-disable */
// https://learn.javascript.ru/coordinates
// https://learn.javascript.ru/mouse-drag-and-drop
import { movedCards, movedLists } from "../../store/modules/board/actions";

// type propsType = {
//   title: string;
//   users: { id: number; username: string }[];
//   lists: {
//     id: number;
//     title: string;
//     position: number;
//     cards: { id: number; position: number; title: string; description: string; users: number[] }[];
//   }[];
// };

// todo: с перемещением карточек есть баг. Перемещаются не в УЛ а поза него.
//  Потому и возникает Эррор.
export default function(boardId: string, updateBoard: any) {
  /* classes */
  const _class = {
    listContainer: "list-container",
    listItem: "list-item",
    listCards: "list-cards",
    cardItem: "card-container",
    cardShadow: "card-shadow",
    listShadow: "list-shadow",
    lastElementContainerList: "board__add-list-btn",
    nonMovableElement: "no-moved",
  };
  /* global variables */
  const _var: { movedElement: HTMLElement | null, movedElementShadow: HTMLElement | null, shift: { x: number, y: number }, isCard: boolean, widthBoardCard: number } = {
    movedElement: null,
    movedElementShadow: null,
    shift: { x: 0, y: 0 },
    isCard: false,
    widthBoardCard: 0,  // ? // px == width board * 2
  };


  /**
   * Select element for move
   * MOUSE DOWN
   */
  document.addEventListener("mousedown", (event) => {
    event.preventDefault();
    const { clientX, clientY } = event;

    // @ts-ignore
    if (event.target.closest(`.${_class.nonMovableElement}`)) return;

    const unselect = (e: { preventDefault: () => void; }) => {
      e.preventDefault();
    };
    document.ondragstart = unselect;
    document.onselectstart = unselect;
    document.oncontextmenu = unselect;

    // @ts-ignore
    _var.movedElement = event.target.closest(`.${_class.listItem}`);

    _var.isCard = false;// @ts-ignore
    if (event.target.closest(`.${_class.cardItem}`)) { // @ts-ignore
      _var.movedElement = event.target.closest(`.${_class.cardItem}`);
      _var.isCard = true;
    }

    if (!_var.movedElement) return;

    movedElementHandler(clientX, clientY);
  });

  /**
   * Set the coordinates for the element relative to the mouse.
   * Bind element to mouse
   */
  const movedElementHandler = (mouseClientX: number, mouseClientY: number) => {
    if (!_var.movedElement) return;

    // @ts-ignore
    _var.movedElementShadow = _var.movedElement.parentElement;
    if (!_var.movedElementShadow) return;

    const { clientWidth, clientHeight } = _var.movedElement;
    _var.movedElementShadow.style.width = `${clientWidth + _var.widthBoardCard}px`;
    _var.movedElementShadow.style.height = `${clientHeight + _var.widthBoardCard}px`;
    _var.movedElementShadow.classList.add(_var.isCard ? _class.cardShadow : _class.listShadow);

    if (_var.isCard) {
      _var.movedElement.style.width = `${clientWidth + _var.widthBoardCard}px`;
      _var.movedElement.style.height = `${clientHeight + _var.widthBoardCard}px`;
    } else {
      _var.movedElementShadow = _var.movedElementShadow.parentElement;
    }

    _var.movedElement.ondragstart = () => false;

    _var.shift.x = mouseClientX - _var.movedElement.getBoundingClientRect().left;
    _var.shift.y = mouseClientY - _var.movedElement.getBoundingClientRect().top;

    document.addEventListener("mousemove", onMoveElement);
  };

  /**
   * Move HTML Element
   * Mouse Move
   */
  function onMoveElement(event: { x: any; y: any; pageX: any; pageY: any; clientX: any; clientY: any; }) {
    if (!_var.movedElement) return;

    const { pageX, pageY, clientX, clientY } = event;

    _var.movedElement.style.left = `${pageX - _var.shift.x}px`;
    _var.movedElement.style.top = `${pageY - _var.shift.y}px`;
    _var.movedElement.classList.add("move");

    // if (_var.isCard) document.body.append(_var.movedElement);

    _var.movedElement.style.display = "none";
    const elemBelow = document.elementFromPoint(clientX, clientY);
    _var.movedElement.style.display = "block";

    if (!elemBelow) return;

    // Move the shadow of an element, then the element,
    // then an element will follow in place of the shadow
    let targetListContainer: ChildNode | null = elemBelow.closest(`.${_class.listContainer}`);

    if (_var.isCard) {

      /* for Card */
      const parentElement = elemBelow.closest(`.${_class.listCards}`); // list-cards
      const cardItem = elemBelow.closest(`.${_class.cardItem}`);

      if (targetListContainer) { // list-container
        if (parentElement) {
          if (cardItem) {// @ts-ignore

            let insertBeforeElement = cardItem.parentElement;// @ts-ignore
            if (_var.movedElement.parentElement === insertBeforeElement.previousSibling) { // @ts-ignore
              insertBeforeElement = insertBeforeElement.nextSibling;
            }
            // @ts-ignore
            parentElement.insertBefore(_var.movedElementShadow, insertBeforeElement);
          }
        } else { // @ts-ignore
          let parent = targetListContainer.lastChild.lastChild.childNodes[1]; // @ts-ignore
          // select element by tag name is UL
          while (parent) {
            if (parent.nodeName === "UL") break; // @ts-ignore
            parent = parent.nextSibling;
          }

          // @ts-ignore
          if (clientY < parent.offsetTop) { // @ts-ignore
            parent.insertBefore(_var.movedElementShadow, parent.firstChild);
          } // @ts-ignore
          if (clientY > (parent.offsetTop + parent.offsetHeight)) { // @ts-ignore
            parent.appendChild(_var.movedElementShadow);
          }
        }
      }

      /* for Lists */

    } else {// @ts-ignore

      if (_var.movedElement.parentElement.parentElement === targetListContainer?.previousSibling) { // @ts-ignore
        targetListContainer = targetListContainer?.nextSibling;
      }
      const parentElement = document.getElementById(`${boardId}`);// @ts-ignore

      try {
        if (!(targetListContainer?.previousSibling || targetListContainer?.nextSibling)) { // @ts-ignore
          parentElement.insertBefore(_var.movedElementShadow, document.querySelector(`.${_class.lastElementContainerList}`)); // @ts-ignore
        } else { // @ts-ignore
          parentElement.insertBefore(_var.movedElementShadow, targetListContainer);
        }
      } catch (e) {
        console.log(e);
      }
    }


    /**
     * MOUSE UP
     */
    document.addEventListener("mouseup", () => {
      if (_var.movedElement) {
        document.removeEventListener("mousemove", onMoveElement);

        if (_var.isCard) { // @ts-ignore
          _var.movedElementShadow.appendChild(_var.movedElement); // @ts-ignore
          _var.movedElementShadow?.classList.remove(_class.cardShadow); // @ts-ignore

          getNewPositionCards();

        } else { // @ts-ignore
          _var.movedElementShadow?.lastElementChild.appendChild(_var.movedElement); // @ts-ignore
          _var.movedElementShadow?.lastElementChild?.classList.remove(_class.listShadow); // @ts-ignore
          _var.movedElementShadow.lastElementChild.style.height = "auto";

          getNewPositionLists();
        }

        // @ts-ignore
        _var.movedElement.style.top = 0; // @ts-ignore
        _var.movedElement.style.left = 0; // @ts-ignore
        _var.movedElement.classList.remove("move"); // @ts-ignore
        _var.movedElement = null;
      }
    });
  }

  /**
   * Get new positions lists after moved
   */
  const getNewPositionLists = async () => {
    const parentElement = document.getElementById(boardId);
    let nextSibling = parentElement?.firstChild;
    let count = 0;
    const newPositionsLists: { id: number; position: number }[] = [];

    while (nextSibling) {
      count += 1; // @ts-ignore
      if (count !== +nextSibling.dataset.listPosition) { // @ts-ignore
        newPositionsLists.push({ id: +nextSibling.id, position: count });
      } // @ts-ignore
      nextSibling = nextSibling.nextSibling === parentElement.lastChild ? null : nextSibling.nextSibling;
    }

    if (newPositionsLists.length) {
      await movedLists(boardId, newPositionsLists);
      updateBoard();
    }
  };

  /**
   * Get new positions cards after moved
   */
  const getNewPositionCards = async () => {
    const parentElements = document.querySelectorAll(`.${_class.listCards}`); // @ts-ignore
    const newPositionCards: { id: number; position: number; list_id: number }[] = [];

    parentElements.forEach((list) => {
      let nextCard = list.firstChild;
      let count = 0; // @ts-ignore

      while (nextCard) {
        count += 1;

        // @ts-ignore
        if (count !== +nextCard.dataset.cardPosition || +list.dataset.listId !== +nextCard.dataset.listId) {
          // @ts-ignore
          newPositionCards.push({ id: +nextCard.id, position: count, list_id: +list.dataset.listId });
        }

        nextCard = nextCard.nextSibling;
      }
    });

    if (newPositionCards.length) {
      await movedCards(boardId, newPositionCards);
      updateBoard();
    }
  };
}
