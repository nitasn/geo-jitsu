import styled from 'styled-components';

export const MenuDiv = styled.div`
  --margin: 1rem;
  --width: 400px;
  --transition: transform 0.5s ease-in-out;

  --shadow: 2px 3px 15px -2px rgba(0, 0, 0, 0.23);

  position: absolute;
  top: var(--margin);
  left: var(--margin);
  height: calc(100vh - var(--margin) * 2);
  width: var(--width);
  max-width: calc(100vw - var(--margin) * 2);
  padding: var(--margin);
  z-index: 1;

  border-radius: 0.5rem;
  background-color: rgb(33 33 33 / 0.85);

  transition: var(--transition);
  user-select: none;

  color: #d1d1d1;

  &:not([open]) {
    transform: translateX(-400px);
  }
`;

export const MenuHeader = styled.h2`
  text-transform: capitalize;
  letter-spacing: 0.3ch;
  margin-top: 0.5rem;
  text-align: center;
`;

export const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Hr = styled.div`
  height: 1px;
  background-color: currentColor;
  width: 100%;
  margin-block: calc(0.5rem + calc(var(--margin) * 0.75));
`;

const _RoundButton = styled.div`
  --size: 2rem;
  height: var(--size);
  width: var(--size);
  border-radius: 100vmax;
  background-color: rgba(255, 255, 255, 0.3);

  text-align: center;
  line-height: var(--size);

  cursor: pointer;

  outline: #777 solid 1px;
  outline-offset: 4px;
  -moz-outline-radius: 100vmax;

  transition: transform 200ms ease-in-out;
  box-shadow: var(--shadow);

  &:active {
    background-color: rgba(255, 255, 255, 0.45);
  }

  &:hover {
    transform: scale(1.07);
  }
`;

export const SlidingButton = styled(_RoundButton)`
  transition: var(--transition);
  outline-color: #444;

  &[open] {
    transform: rotate(-180deg); /** todo this overrides the &:hover scale */
  }

  &:not([open]) {
    transform: translateX(4rem);
  }
`;

export const AddObjBtn = styled(_RoundButton)`
  position: absolute;
  left: 1rem;
  bottom: 1rem;
  font-size: 1.2rem;
  margin-inline: 0;
`;

export const ObjectsListDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  max-height: calc(100% - 8.25rem);

  overflow-y: scroll;

  margin-right: -11px;
  padding-right: 7px;

  &::-webkit-scrollbar {
    width: 4px;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 100vmax;
    transition: background-color 200ms linear; // todo transition doesn't work
    background-color: transparent;
  }
  &:hover::-webkit-scrollbar-thumb {
    background-color: rgb(52 52 52);
  }
`;

export const ObjectListItem = styled.div`
  background-color: #333;
  padding: 1rem;
  border-radius: 0.25rem;
  letter-spacing: 0.15ch;
  position: relative;

  box-shadow: var(--shadow);
`;

export const ObjTxtRow = styled.div`
  display: flex;
  gap: 1.15ch;
  align-items: center;

  &[open] {
    padding-bottom: 1rem;
  }
`;

export const Type = styled.div`
  color: rgba(255, 255, 255, 0.2);
  position: absolute;
  top: 4px;
  /* left: 4px; */
  font-size: 12px;
`;

export const Desc = styled.div`
  color: rgba(255, 255, 255, 0.7);
`;

export const EditListItemBtn = styled(_RoundButton)`
  outline: none;
  margin-left: auto;

  &[open] {
    opacity: 0;
    pointer-events: none;
  }
`;

export const EditAreaGrid = styled.form`
  display: grid;
  gap: 0.75rem;
  grid-template-columns: auto auto;

  margin-bottom: 1.75rem;
`;

export const EditAreaLabel = styled.label`
  padding: 5px;
  text-align: center;
`;

export const EditAreaInput = styled.input.attrs({ type: 'text' })`
  width: 15ch;
  padding: 5px;
  letter-spacing: inherit;
  border-radius: 0.25rem;
  color: inherit;
  border: 1px solid #888;
  background-color: transparent;
`;

export const CancelUpdateDeleteDiv = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
`;

export const IconBtn = styled.a`
  border-radius: 100%;
  flex: 1;

  transition: all 200ms ease-in-out;
  cursor: pointer;

  display: grid;
  place-items: center;

  &:hover {
    transform: scale(1.1) translateY(2px);
    color: ${({ mod }) => `var(--clr-${mod})`};
  }

  --clr-cancel: rgba(131, 137, 163, 0.384);
  --clr-update: rgba(60, 174, 120, 0.75);
  --clr-delete: rgba(235, 96, 107, 0.86);
`;

export const ListNewObj = styled.ol`
  transition: all 200ms ease-in-out;
  transform-origin: center;

  background-color: hsl(149, 15%, 30%);
  position: absolute;
  inset: 0;
  top: 4.5rem;
  border-radius: inherit;

  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &:not([open]) {
    transform: scaleX(90%);
    opacity: 0;

    /* forward pointer events to the elements behind me */
    pointer-events: none;
  }

  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 0;
  }
`;

export const NewItemHeader = styled.h2`
  margin-bottom: 0.5rem;
`;

export const ClosePopupBtn = styled(_RoundButton)`
  outline: none;
`;

export const PossibleObjectLi = styled.li`
  list-style: none;
  padding: 1rem;
  border-radius: 0.5rem;
  transition: all 200ms ease-in-out;
  cursor: pointer;

  &:hover {
    list-style: none;
    background-color: rgba(255, 255, 255, 0.18);
  }
`;
