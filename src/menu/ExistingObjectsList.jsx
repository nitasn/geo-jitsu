import React from 'react';
import { useSelector } from 'react-redux';
import {
  ObjectsListDiv,
  ObjectListItem,
  ListItemHead,
  Texts,
  Type,
  Desc,
  EditListItemBtn,
} from './style';
import { ItemEditArea } from './ItemEditArea';
import { prettyPoint } from './strRepr';

export function ExistingObjectsList() {
  const objects = useSelector((state) => state.objects);

  return (
    <ObjectsListDiv>
      {Object.entries(objects).map(([label, data]) => (
        // 'data' contains { type, params, color }
        <ExistingObjectItem label={label} {...data} key={label} />
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
          <EditListItemBtn onClick={() => setBeingEdited(true)} children="✐" />
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
