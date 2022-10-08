import React from 'react';
import { useDispatch } from 'react-redux';
import * as Ionicons from 'react-ionicons';
import { removeDrawable, setParams } from '../redux/drawables';
import {
  EditAreaGrid,
  EditAreaLabel,
  EditAreaInput,
  CancelUpdateDeleteDiv,
  IconBtn,
} from './style';
import { delPoint, setPoint } from '../redux/points';
import { _mapValuesToStrings, _validateAndMapParamsFromStrings } from './strRepr';

export function ItemEditArea({ label, type, params: originalParams, closeFn }) {
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
    dispatch(
      type == 'Point'
        ? setPoint([label, newParams.coords])
        : setParams([label, newParams])
    );
    closeFn();
  };

  const onDeleteClick = () => {
    dispatch((type == 'Point' ? delPoint : removeDrawable)(label));
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


