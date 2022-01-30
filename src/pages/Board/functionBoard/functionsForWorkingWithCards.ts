import { ICardContent, IListContent } from '../../../common/interfaces/Interfaces';

interface INewCardPositon {
  id: number;
  position: number;
  list_id: number;
}

interface IForState {
  sourceList: IListContent;
  sourceCards: { [id: number]: ICardContent };
  destinationList: IListContent;
  destinationCards: { [id: number]: ICardContent };
}

interface IFunctionReturn {
  newCardPosition: INewCardPositon[];
  dataForState: IForState;
}

interface IPropsFunctionOneList {
  idCard: number;
  indexSourceList: number;
  newPosition: number;
  dataLists: { [id: number]: IListContent };
}

interface IPropsFunctionDifferentLists extends IPropsFunctionOneList {
  indexDestintaionList: number;
}

/**
 * Перемещение карточки в пределах одного листа
 */
export const movingCardsInOneList = ({ ...props }: IPropsFunctionOneList): IFunctionReturn => {
  const { idCard, indexSourceList, newPosition, dataLists } = props;
  const newCardPosition: INewCardPositon[] = [];

  const list = dataLists[indexSourceList];
  const cards = { ...list.cards };
  const sort = Object.entries(cards).sort((a, b) => a[1].position - b[1].position);
  const delCard = sort.splice(cards[idCard].position - 1, 1);
  sort.splice(newPosition, 0, delCard[0]);
  sort.forEach(([, card], index) => {
    if (card.position !== index + 1) {
      // eslint-disable-next-line no-param-reassign
      card.position = index + 1;
      newCardPosition.push({ id: card.id, position: card.position, list_id: indexSourceList });
    }
  });

  return {
    newCardPosition,
    dataForState: { sourceList: list, sourceCards: cards, destinationList: list, destinationCards: cards },
  };
};

/**
 * Moving between different lists
 */
export const movingCardsBetweenDifferentList = ({ ...props }: IPropsFunctionDifferentLists): IFunctionReturn => {
  const { idCard, indexSourceList, indexDestintaionList, newPosition, dataLists } = props;
  const newCardPosition: INewCardPositon[] = [];

  /* source list cards */
  const sourceList = dataLists[indexSourceList];
  const sourceCards = { ...sourceList.cards };
  const deleteCard = sourceCards[idCard];
  delete sourceCards[idCard];
  Object.entries(sourceCards)
    .sort((a, b) => a[1].position - b[1].position)
    .forEach(([, card], index) => {
      if (card.position !== index + 1) {
        // eslint-disable-next-line no-param-reassign
        card.position = index + 1;
        newCardPosition.push({ id: card.id, position: card.position, list_id: indexSourceList });
      }
    });

  /* destination list cards */
  const destinationList = dataLists[+indexDestintaionList];
  const destinationCards = { ...destinationList.cards };
  const sort = Object.entries(destinationCards).sort((a, b) => a[1].position - b[1].position);
  sort.splice(newPosition, 0, [`${deleteCard.id}`, deleteCard]);
  sort.forEach(([, card], index) => {
    if (card.position !== index + 1 || (card.position === index + 1 && index + 1 === deleteCard.position)) {
      // eslint-disable-next-line no-param-reassign
      card.position = index + 1;
      newCardPosition.push({ id: card.id, position: card.position, list_id: +indexDestintaionList });
    }
  });
  destinationCards[deleteCard.id] = deleteCard;

  return {
    newCardPosition,
    dataForState: { sourceList, sourceCards, destinationList, destinationCards },
  };
};
