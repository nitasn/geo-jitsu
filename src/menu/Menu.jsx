import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Ionicons from 'react-ionicons';
import store from '../redux/store';
import { setParams } from '../redux/drawables';

import {
  MenuDiv,
  MenuHeader,
  Head,
  Hr,
  AddObjBtn,
  PopupContainer,
  ObjectsListDiv,
  ObjectListItem,
  ListItemHead,
  Texts,
  Type,
  Desc,
  EditListItem,
  EditAreaGrid,
  EditAreaLabel,
  EditAreaInput,
  CancelUpdateDeleteDiv,
  IconBtn,
  PopupSelectNewObject,
  NewItemHeader,
  ClosePopupBtn,
  PossibleObjectLi,
  SlidingButton,
} from './style';

import possibleObjects from './possibleObjects';

export default () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  const onNewObjectChosen = (nameChosen) => {
    setIsAddOpen(false);
    if (!nameChosen) return;
    console.log(nameChosen);
  };

  return (
    <MenuDiv open={isOpen}>
      <Head>
        <MenuHeader>Items</MenuHeader>
        <SlidingButton open={isOpen} onClick={() => setIsOpen(!isOpen)} children="⟩" />
      </Head>

      <Hr />

      <ObjectsList />

      <AddObjBtn onClick={() => setIsAddOpen(true)}>+</AddObjBtn>

      <PopupContainer>
        <PopUpSelectNewObject isAddOpen={isAddOpen} onChosen={onNewObjectChosen} />
      </PopupContainer>
    </MenuDiv>
  );
};

function ObjectsList() {
  const drawables = useSelector((state) => state.drawables);

  return (
    <ObjectsListDiv>
      {Object.entries(drawables).map(([label, obj]) => (
        // 'obj' contains { type, params, color }
        <ObjectsListItem label={label} {...obj} key={label} />
      ))}
    </ObjectsListDiv>
  );
}

function ObjectsListItem({ label, type, params, color }) {
  const [beingEdited, setBeingEdited] = React.useState(false);

  return (
    /** todo why isn't it called beingEdited?? */
    <ObjectListItem>
      <ListItemHead open={beingEdited}>
        <Texts>
          <Type>{type}</Type>
          <span style={{ color }}>{label}</span>
          {!beingEdited && <Desc>{oneLineDescription(type, params)}</Desc>}
        </Texts>
        {!beingEdited && (
          <EditListItem onClick={() => setBeingEdited(true)}>✐</EditListItem>
        )}
      </ListItemHead>
      {beingEdited && (
        <ItemEditArea
          {...{ label, type, params }}
          closeFn={() => setBeingEdited(false)}
        />
      )}
    </ObjectListItem>
  );
}

function ItemEditArea({ label, type, params: originalParams, closeFn }) {
  const baseId = React.useId();
  const dispatch = useDispatch();

  const [tempParams, setTempParams] = React.useState(() =>
    _mapValuesToStrings(originalParams)
  );

  const onAnyInputChange = (key, value) => {
    setTempParams({ ...tempParams, [key]: value });
  };

  const onCancelClick = closeFn;

  const onUpdateClick = () => {
    const newParams = _validateAndMapParamsFromStrings(type, tempParams);
    if (!newParams) {
      return alert('invalid params.');
    }
    dispatch(setParams([label, newParams]));
    closeFn();
  };

  const onDeleteClick = () => {
    console.log('delete');
  };

  return (
    <>
      <EditAreaGrid>
        {Object.entries(tempParams).flatMap(([key, value]) => {
          const id = `${baseId}-${key}`;
          // we're using id's indead of putting the input inside the label,
          // so that we can use a grid layout (each row has a label and an input)
          return [
            <EditAreaLabel key={`${key}-label`} htmlFor={id}>
              {key}
            </EditAreaLabel>,
            <EditAreaInput
              id={id}
              key={`${key}-input`}
              value={value}
              onChange={(e) => onAnyInputChange(key, e.target.value)}
            />,
          ];
        })}
      </EditAreaGrid>

      <EraseCancelUpdate {...{ onCancelClick, onUpdateClick, onDeleteClick }} />
    </>
  );
}

function _prettyPoint(arrOrLabel) {
  if (Array.isArray(arrOrLabel)) return `(${arrOrLabel.join(', ')})`;
  return arrOrLabel;
}

function oneLineDescription(type, params) {
  switch (type) {
    case 'LineSegment':
      return `${_prettyPoint(params.from)} ${_prettyPoint(params.to)}`;
  }
}

function EraseCancelUpdate({ onCancelClick, onUpdateClick, onDeleteClick }) {
  return (
    <CancelUpdateDeleteDiv>
      <IconBtn onClick={onCancelClick} mod="cancel">
        <Ionicons.CloseOutline color="" />
      </IconBtn>

      <IconBtn onClick={onUpdateClick} mod="update">
        <Ionicons.CheckmarkOutline color="" />
      </IconBtn>

      <IconBtn onClick={onDeleteClick} mod="delete">
        <Ionicons.TrashOutline color="" />
      </IconBtn>
    </CancelUpdateDeleteDiv>
  );
}

function _mapValuesToStrings(obj) {
  const entries = Object.entries(obj).map(([k, v]) => {
    if (Array.isArray(v)) v = v.join(', ');
    return [k, v];
  });
  return Object.fromEntries(entries);
}

function PopUpSelectNewObject({ onChosen, isAddOpen }) {
  return (
    <PopupSelectNewObject open={isAddOpen}>
      <Head>
        <NewItemHeader>New Item</NewItemHeader>
        <ClosePopupBtn onClick={() => onChosen(null)}>&times;</ClosePopupBtn>
      </Head>
      {possibleObjects.map((name, idx) => (
        <PossibleObjectLi onClick={() => onChosen(name)} key={idx}>
          {name}
        </PossibleObjectLi>
      ))}
    </PopupSelectNewObject>
  );
}

/**
 * upon success, returns a new object (where values like "3, 4." are converted into [3, 4]);
 * upon failure, returns null
 * @returns {object?}
 */
function _validateAndMapParamsFromStrings(type, params) {
  const { points } = store.getState();

  // todo the type (and keys) should play a role...

  const results = { ...params };

  for (const [key, value] of Object.entries(params)) {
    if (value in points) continue; // if the value is the name (label) of an existing point

    const asNumArr = value.split(',').map((str) => +str.trim());
    if (asNumArr.length !== 2 || isNaN(asNumArr[0]) || isNaN(asNumArr[1])) return null;

    results[key] = asNumArr;
  }

  return results;
}

/**
 * todo
 * on any item params change,
 * it doesn't trigger canvas re-render rn...
 * until i drag the grid around...
 */
