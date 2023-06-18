import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

import pressedToShortcut from 'components/KeyCaps/utils/pressed-to-shortcut';

const MODES = {
  press: 'press',
  type: 'type',
};

const types = [
  { id: MODES.press, title: 'Press combination' },
  { id: MODES.type, title: 'Type combination' },
];

const EnterInput = ({ value, setValue }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [activeMode, setActiveMode] = useState(MODES.press);
  const [localValue, setLocalValue] = useState('');
  const inputRef = useRef();

  const isPressMode = activeMode === MODES.press;
  const isTypeMode = activeMode === MODES.type;
  const strValue = value.join(' + ');

  const handleFormSubmit = e => {
    if (isTypeMode) {
      e.preventDefault();
      const textArray = inputRef.current.value
        .replace(/\+/g, ' ')
        .split(' ')
        .filter(Boolean);
      setValue(textArray);
    }
    return null;
  };

  const handleInputKeyDown = e => {
    if (isPressMode) {
      e.preventDefault();
      e.stopPropagation();
      setValue(pressedToShortcut(e));
    }
    return null;
  };
  const handleInputChange = e => {
    if (isTypeMode) {
      const val = e.target.value;
      setLocalValue(val);
      const textArray = val?.replace(/\+/g, ' ').split(' ').filter(Boolean);
      setValue(textArray);
    }
  };

  let inputValue = localValue;
  if (isPressMode) {
    inputValue = isFocused ? strValue : '';
  }
  useEffect(() => setLocalValue(strValue), [strValue]);

  return (
    <form
      className='flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-6 sm:space-y-0 md:space-x-8'
      onSubmit={handleFormSubmit}>
      <input
        className='block w-full px-4 py-5 text-lg leading-none border-gray-300 shadow-sm rounded-xl placeholder:italic sm:w-3/5 lg:w-96'
        name='keyboard'
        type='text'
        placeholder={
          isPressMode
            ? 'Focus and press key combination'
            : 'Enter combination manually'
        }
        ref={inputRef}
        value={inputValue}
        autoComplete='off'
        onKeyDown={handleInputKeyDown}
        onChange={handleInputChange}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
      />
      <div className='flex justify-center space-x-5 sm:flex-col sm:space-x-0 sm:space-y-3 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-5'>
        {types.map(({ id, title }) => (
          <div key={id} className='flex items-center'>
            <input
              className='w-5 h-5 text-transparent transition-colors duration-150 bg-transparent border border-gray-2 checked:border-black-2 checked:hover:border-black-2 checked:focus:border-black-2 peer focus:ring-0 focus:ring-offset-0'
              id={id}
              name='enter type'
              type='radio'
              defaultChecked={id === MODES.press}
              onChange={e => setActiveMode(e.target.id)}
            />
            <label
              htmlFor={id}
              className='block pl-2 font-medium leading-none transition-colors duration-150 text-darkGreen dark:text-white md:pl-3 md:text-lg'>
              {title}
            </label>
          </div>
        ))}
      </div>
    </form>
  );
};

EnterInput.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  setValue: PropTypes.func.isRequired,
};

EnterInput.defaultProps = {
  value: null,
};

export default EnterInput;
