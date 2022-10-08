import React from 'react';
import {
  Head, ListNewObj,
  NewItemHeader,
  ClosePopupBtn,
  PossibleObjectLi
} from './style';
import possibleObjects from './possibleObjects';

export function MenuNewObj({ onChosen, isAddOpen }) {
  return (
    <ListNewObj open={isAddOpen}>
      <Head>
        <NewItemHeader>New Item</NewItemHeader>
        <ClosePopupBtn onClick={() => onChosen(null)} children="&times;" />
      </Head>
      {possibleObjects.map((name, idx) => (
        <PossibleObjectLi onClick={() => onChosen(name)} key={idx}>
          {name}
        </PossibleObjectLi>
      ))}
    </ListNewObj>
  );
}
