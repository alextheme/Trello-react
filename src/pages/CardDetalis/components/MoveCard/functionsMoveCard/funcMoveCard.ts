import { IBoardContent } from '../../../../../common/interfaces/Interfaces';

interface INewCardPositon {
  id: number;
  position: number;
  list_id: number;
}

interface IPropsMoveCardOneList {
  card: number;
  srcList: number;
  srcData: IBoardContent;
  positionCard: number;
}

interface IPropsMoveCardBetweenLists extends IPropsMoveCardOneList {
  destList: number;
}

interface IPropsMoveCardBetweenDesks {
  destData: IBoardContent;
  destList: number;
  positionCard: number;
}

export const moveCardOneList = ({ card, srcList, srcData, positionCard }: IPropsMoveCardOneList): INewCardPositon[] => {
  const newCardPosition: INewCardPositon[] = [];

  const cards = { ...srcData.lists[srcList].cards };
  const cardsSort = Object.entries(cards).sort((a, b) => a[1].position - b[1].position);
  const moveCard = cardsSort.splice(cards[card].position - 1, 1);
  cardsSort.splice(positionCard - 1, 0, moveCard[0]);
  cardsSort.forEach(([, c], index) => {
    if (c.position !== index + 1) {
      newCardPosition.push({ id: c.id, position: index + 1, list_id: srcList });
    }
  });

  return newCardPosition;
};

export const moveCardBetweenLists = ({
  card,
  srcList,
  srcData,
  destList,
  positionCard,
}: IPropsMoveCardBetweenLists): INewCardPositon[] => {
  const newCardPosition: INewCardPositon[] = [];

  const sourceCards = { ...srcData.lists[srcList].cards };
  const cardsSort = Object.entries(sourceCards).sort((a, b) => a[1].position - b[1].position);
  const moveCard = cardsSort.splice(sourceCards[card].position - 1, 1);
  delete sourceCards[card];
  Object.entries(sourceCards)
    .sort((a, b) => a[1].position - b[1].position)
    .forEach(([, c], index) => {
      if (c.position !== index + 1) {
        newCardPosition.push({ id: c.id, position: index + 1, list_id: srcList });
      }
    });

  /* destination list cards */
  const destinationCards = { ...srcData.lists[destList].cards };
  const sort = Object.entries(destinationCards).sort((a, b) => a[1].position - b[1].position);
  sort.splice(positionCard - 1, 0, moveCard[0]);
  sort.forEach(([, c], index) => {
    if (c.position !== index + 1 || (c.position === index + 1 && index + 1 === moveCard[0][1].position)) {
      newCardPosition.push({ id: c.id, position: index + 1, list_id: destList });
    }
  });
  const { ...moveCardForDestination } = moveCard[0][1];
  destinationCards[moveCardForDestination.id] = moveCardForDestination;

  return newCardPosition;
};

export const moveCardBetweenDesks = ({
  destList,
  destData,
  positionCard,
}: IPropsMoveCardBetweenDesks): INewCardPositon[] => {
  const newCardPosition: INewCardPositon[] = [];

  const cards = { ...destData.lists[destList].cards };

  if (positionCard <= Object.keys(cards).length) {
    Object.entries(cards).forEach(([, c]) => {
      if (c.position >= positionCard) {
        newCardPosition.push({ id: c.id, position: c.position + 1, list_id: destList });
      }
    });
  }

  return newCardPosition;
};
