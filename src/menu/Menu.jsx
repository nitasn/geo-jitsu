import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './menu.css';

import * as Ionicons from 'react-ionicons';
import store from '../redux/store';
import { setParams } from '../redux/drawables';

import * as _drawables from '../canvas/drawables/ctx-drawables'
const spacesBetweenPascalCaseWords = s => s.replace(/([a-z])([A-Z])/g, '$1 $2');
const possibleObjects = ['Point', ...Object.keys(_drawables).map(spacesBetweenPascalCaseWords)]

export default () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  const onNewObjectChosen = (nameChosen) => {
    setIsAddOpen(false);
    if (!nameChosen) return;
    console.log(nameChosen);
  };

  return (
    <div open={isOpen} className="menu">
      <div className="head">
        <h2>Items</h2>
        <a
          className="round-btn close-open"
          onClick={() => setIsOpen((currentValue) => !currentValue)}
        >
          ⟩
        </a>
      </div>

      <div className="hr" />

      <ObjectsList />

      <a className="round-btn add-object" onClick={() => setIsAddOpen(true)}>
        +
      </a>

      <div className="popup-container">
        <PopUpSelectNewObject isAddOpen={isAddOpen} onChosen={onNewObjectChosen} />
      </div>
    </div>
  );
};

function ObjectsList() {
  const drawables = useSelector((state) => state.drawables);

  return (
    <div className="objects-list">
      {Object.entries(drawables).map(([label, obj]) => (
        // 'obj' contains { type, params, color }
        <ObjectsListItem label={label} {...obj} key={label} />
      ))}
    </div>
  );
}

function ObjectsListItem({ label, type, params, color }) {
  const [beingEdited, setBeingEdited] = React.useState(false);

  return (
    <div open={beingEdited} className="object-list-item">
      <div className="head">
        <div className="texts">
          <span className="type">{type}</span>
          <span className="label" style={{ color }}>
            {label}
          </span>
          {!beingEdited && (
            <span className="desc">{oneLineDescription(type, params)}</span>
          )}
        </div>
        {!beingEdited && (
          <a className="round-btn edit-list-item" onClick={() => setBeingEdited(true)}>
            ✐
          </a>
        )}
      </div>
      {beingEdited && (
        <ItemEditArea
          {...{ label, type, params }}
          closeFn={() => setBeingEdited(false)}
        />
      )}
    </div>
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
      <form className="edit-area">
        {Object.entries(tempParams).map(([k, v]) => {
          const id = baseId + k;
          return (
            // todo can't a 'key' prop apply on fragment?
            <div className="line" key={k}>
              <label htmlFor={id}>{k}</label>
              <input
                type="text"
                id={id}
                value={v}
                onChange={(e) => onAnyInputChange(k, e.target.value)}
              />
            </div>
          );
        })}
      </form>

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
    <div className="erase-cancel-update-container">
      <a className="cancel" onClick={onCancelClick}>
        <Ionicons.CloseOutline color="" />
      </a>

      <a className="update" onClick={onUpdateClick}>
        <Ionicons.CheckmarkOutline color="" />
      </a>

      <a className="erase" onClick={onDeleteClick}>
        <Ionicons.TrashOutline color="" />
      </a>
    </div>
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
    <ol className="popup-select-new-object" open={isAddOpen}>
      <div className="head">
        <h2>New Item</h2>
        <a className="round-btn close-popup" onClick={() => onChosen(null)}>
          &times;
        </a>
      </div>
      {possibleObjects.map((name, idx) => {
        return (
          <li onClick={() => onChosen(name)} key={idx}>
            {name}
          </li>
        );
      })}
    </ol>
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
    if (asNumArr.length != 2 || isNaN(asNumArr[0]) || isNaN(asNumArr[1])) return null;

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