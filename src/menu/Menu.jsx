import React from 'react';
import './menu.css';

const e = React.createElement;

const objects = {};

export default () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const onOpenCloseBtnClick = React.useCallback(() => {
    setIsOpen((currentValue) => !currentValue);
  }, [setIsOpen]);

  return (
    <div open={isOpen} className="menu">
      <div className="head">
        <h2>Items</h2>
        <a className="round-btn close-open" onClick={onOpenCloseBtnClick}>
          ⟩
        </a>
      </div>

      <div className="hr" />

      <a className="round-btn add-object">+</a>
    </div>
  );
};
