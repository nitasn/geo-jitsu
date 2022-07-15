import React from 'react';
import './menu.css';

const e = React.createElement;

const possibleObjects = [
  'Point',
  'Circle',
  'Line Segment',
  'Angle Bisector',
  'Perpendicular Bisector',
  'Math Function',
];

export default () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [popupShown, setPopupShown] = React.useState(false);

  const onNewObjectChosen = (nameChosen) => {
    setPopupShown(false);
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

      <a className="round-btn add-object" onClick={() => setPopupShown(true)}>
        +
      </a>

      <div className="popup-container">
        <PopUpSelectNewObject popupShown={popupShown} onChosen={onNewObjectChosen} />
      </div>
    </div>
  );
};

function PopUpSelectNewObject({ onChosen, popupShown }) {
  return (
    <ol className="popup-select-new-object" open={popupShown}>
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
