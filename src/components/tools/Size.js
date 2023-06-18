import { useState, useEffect } from 'react';
import { KeySizeIcon } from 'ui/icons';
const Size = ({ options, setOptions, label, max, min }) => {
  // save initial value
  const [initialValue, setInitialValue] = useState(options.size);

  useEffect(() => {
    setInitialValue(options.size);
  }, []);

  return (
    <div className='col-span-2 mb-4'>
      <header className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <KeySizeIcon className={'text-darkGreen dark:text-white'} />
          <h3
            className={`text-sm  ${
              label === 'Keys Size'
                ? 'text-darkGreen dark:text-white'
                : 'text-darkGreen dark:text-white'
            }`}>
            {label || 'Size'}{' '}
            <sup
              className={`rounded-md ${
                label === 'Keys Size'
                  ? ' bg-primary dark:bg-darkGreen'
                  : ' bg-primary dark:bg-darkGreen'
              } py-0.5 px-1`}>
              {options.size}
            </sup>{' '}
          </h3>
        </div>
        <button
          className={`rounded-md  py-1 px-2 text-xs ${
            label === 'Keys Size'
              ? 'bg-primary text-darkGreen dark:bg-darkGreen dark:text-white'
              : 'bg-primary text-darkGreen dark:bg-darkGreen dark:text-white'
          } transition hover:bg-opacity-80`}
          onClick={() => {
            setOptions(prev => ({
              ...prev,
              size: initialValue,
            }));
          }}>
          Reset
        </button>
      </header>

      {/* range slider */}

      <input
        type='range'
        min={min || '50'}
        max={max || '120'}
        step='1'
        value={options.size}
        onChange={e =>
          setOptions({
            ...options,
            size: parseInt(e.target.value),
          })
        }
        className='h-1.5 w-full cursor-grab appearance-none rounded-sm bg-[#212121] accent-green-400'
      />
    </div>
  );
};

export default Size;
