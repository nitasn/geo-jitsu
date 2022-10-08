import React from 'react';
import { useDispatch } from 'react-redux';
import { setDrawable } from '../redux/drawables';

import {
  MenuDiv,
  MenuHeader,
  Head,
  Hr,
  AddObjBtn,
  SlidingButton,
} from './style';

import { setPoint } from '../redux/points';
import { MenuNewObj } from './MenuNewObj';
import { ExistingObjectsList } from './ExistingObjectsList';

export default () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const dispatch = useDispatch();

  const onNewObjectChosen = (name) => {
    setIsAddOpen(false);
    if (!name) return;
    if (name == 'Point') {
      dispatch(setPoint(['New Point', [0, 0]]));
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
