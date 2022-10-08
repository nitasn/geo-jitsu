import React from 'react';
import { useSelector } from 'react-redux';
import {
  ObjectsListDiv,
  ObjectListItem,
  ListItemHead,
  Texts,
  Type,
  Desc,
  EditListItem
} from './style';
import { ItemEditArea } from './ItemEditArea';
import { prettyPoint } from "./strRepr";

export function ExistingObjectsList() {
  const drawables = useSelector((state) => state.drawables);
  const points = useSelector((state) => state.points);

  return (
    <ObjectsListDiv>
      {Object.entries(drawables).map(([label, obj]) => (
        // 'obj' contains { type, params, color }
        <ExistingObjectItem label={label} {...obj} key={label} />
      ))}
      {Object.entries(points).map(([label, coords]) => (
        <ExistingObjectItem
          label={label}
          type="Point"
          params={{ coords }}
          color="yellow"
          key={label} />
      ))}
    </ObjectsListDiv>
  );
}
function ExistingObjectItem({ label, type, params, color }) {
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
            closeFn={() => setBeingEdited(false)} />
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
function oneLineDescription(type, params) {
  return Object.values(params).map(prettyPoint).join(' ');

  switch (type) {
    case 'LineSegment':
      return `${prettyPoint(params.from)} ${prettyPoint(params.to)}`;
  }
}
