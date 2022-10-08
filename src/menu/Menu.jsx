import React from 'react';
import { useDispatch } from 'react-redux';
import { MenuDiv, MenuHeader, Head, Hr, AddObjBtn, SlidingButton } from './style';
import { MenuNewObj } from './MenuNewObj';
import { ExistingObjectsList } from './ExistingObjectsList';
import { setObj } from '../redux/objects';

export default () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const dispatch = useDispatch();

  const onNewObjectChosen = (item) => {
    setIsAddOpen(false);
    if (!item) return;
    const type = item.replace(/\s+/g, ''); // "Line Segment" -> "LineSegment"
    const label = Math.random().toString(36).slice(2);
    dispatch(setObj(label, [type, defaultParams(type), 'lightblue']));
  };

  return (
    <MenuDiv open={isOpen}>
      <Head>
        <MenuHeader>Items</MenuHeader>
        <SlidingButton open={isOpen} onClick={() => setIsOpen(!isOpen)} children="⟩" />
      </Head>
      <Hr />

      <ExistingObjectsList />

      <AddObjBtn onClick={() => setIsAddOpen(true)} children="+" />
      <MenuNewObj isAddOpen={isAddOpen} onChosen={onNewObjectChosen} />
    </MenuDiv>
  );
};

/* todo:
 * replace the default params behaviour with an empty non-cancellable (but deletable) object.
 */
function defaultParams(type) {
  switch (type) {
    case 'LineSegment':
      return { from: [1, 1], to: [2, 1] };
    case 'Circle':
      return { center: [-1, -1], radius: 1 };
    case 'Point':
      return { coords: [0, 0] };
  }
}

/**
 * todo
 *
 * 1. one slice for drawables and points called objects.
 *    also, this state should include "is-being-edited" and "is-valid" fields.
 *
 * 2. if a drawable uses invalid values (labels of non-existing points)
 *    the drawable won't be drawn, and its box in the menu will be clearly mark;
 *    the wrong label will be red, and on hover a tool tip will explain the problem.
 *
 */
