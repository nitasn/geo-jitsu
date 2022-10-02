import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Ionicons from 'react-ionicons';
import store from '../redux/store';
import { removeDrawable, setDrawable, setParams } from '../redux/drawables';

import {
  MenuDiv,
  MenuHeader,
  Head,
  Hr,
  AddObjBtn,
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
  ListNewObj,
  NewItemHeader,
  ClosePopupBtn,
  PossibleObjectLi,
  SlidingButton,
} from './style';

import possibleObjects from './possibleObjects';
import { delPoint, setPoint } from '../redux/points';

export default () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const dispatch = useDispatch();

  const onNewObjectChosen = (name) => {
    setIsAddOpen(false);
    if (!name) return;
    if (name == 'Point') {
      dispatch(setPoint({ label: 'New Point', coords: [0, 0] }));
    } else {
      dispatch(
        setDrawable(name, {
          type: name.replace(/\s+/g, ''),
          params: defaultParams(name),
          color: 'lightblue',
        })
      );
    }
  };

  return (
    <MenuDiv open={isOpen}>
      <Head>
        <MenuHeader>Items</MenuHeader>
        <SlidingButton open={isOpen} onClick={() => setIsOpen(!isOpen)} children="⟩" />
      </Head>
      <Hr />

      <ObjectsList />

      <AddObjBtn onClick={() => setIsAddOpen(true)} children="+" />
      <MenuNewObj isAddOpen={isAddOpen} onChosen={onNewObjectChosen} />
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
      {beingEdited ? (
        <>
          <ListItemHead open>
            <Texts>
              <Type>{type}</Type>
              <span style={{ color }}>{label}</span>
            </Texts>
          </ListItemHead>

          <ItemEditArea
            {...{ label, type, params }}
            closeFn={() => setBeingEdited(false)}
          />
        </>
      ) : (
        <ListItemHead>
          <Texts>
            <Type>{type}</Type>
            <span style={{ color }}>{label}</span>
            <Desc>{oneLineDescription(type, params)}</Desc>
          </Texts>
          <EditListItem onClick={() => setBeingEdited(true)}>✐</EditListItem>
        </ListItemHead>
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

  const onUpdateClick = () => {
    const newParams = _validateAndMapParamsFromStrings(type, tempParams);
    if (!newParams) {
      return alert('invalid params.');
    }
    dispatch(setParams([label, newParams]));
    closeFn();
  };

  const onDeleteClick = () => {
    const remove = type == 'Point' ? delPoint : removeDrawable;
    dispatch(remove(label));
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

      <EraseCancelUpdate onCancelClick={closeFn} {...{ onUpdateClick, onDeleteClick }} />
    </>
  );
}

function _prettyPoint(arrOrLabel) {
  if (Array.isArray(arrOrLabel)) return `(${arrOrLabel.join(', ')})`;
  return arrOrLabel;
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

function MenuNewObj({ onChosen, isAddOpen }) {
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

/**
 * todo
 *
 * 1. on any item params change,
 *    it doesn't trigger canvas re-render rn...
 *    until i drag the grid around...
 *
 * 2. if a drawable uses invalid values (labels of non-existing points)
 *    the drawable won't be drawn, and its box in the menu will be clearly mark;
 *    the wrong label will be red, and on hover a tool tip will explain the problem.
 */

///////////////////////////////////////////////////////////////////////////////
///                S P E C I F I C   O B J E C T S   C O D E                ///
///////////////////////////////////////////////////////////////////////////////

/**
 * upon success, returns a new object (where values like "3, 4." are converted into [3, 4]);
 * upon failure, returns null
 * @returns {object?}
 */
function _validateAndMapParamsFromStrings(type, params) {
  const { points } = store.getState();

  // todo the type should play a role...

  const results = { ...params };

  for (const [key, value] of Object.entries(params)) {
    if (value in points && key != value) continue; // if the value is the label of an existing (different) point

    const asNumArr = value.split(',').map((str) => +str.trim());
    if (asNumArr.length !== 2 || isNaN(asNumArr[0]) || isNaN(asNumArr[1])) return null;

    results[key] = asNumArr;
  }

  return results;
}

function oneLineDescription(type, params) {
  return Object.values(params).map(_prettyPoint).join(' ');

  switch (type) {
    case 'LineSegment':
      return `${_prettyPoint(params.from)} ${_prettyPoint(params.to)}`;
  }
}

/* todo:
 * replace the default params behaviour with an empty non-cancellable (but deletable) object.
 */
function defaultParams(type) {
  switch (type) {
    case 'LineSegment':
      return { from: [1, 1], to: [2, 1] };
    case 'Circle':
      return { center: [-1, -1], radius: 1 };
  }
}
