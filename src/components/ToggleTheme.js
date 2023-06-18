import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { DarkIcon, LightIcon } from 'ui/icons';

const ToggleTheme = () => {
  const { setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  const handleDark = () => {
    setTheme('dark');
  };

  const handleLight = () => {
    setTheme('light');
  };

  return (
    <div className='flex h-10 w-20 cursor-pointer justify-around rounded-full bg-primary bg-opacity-30'>
      <button onClick={handleLight}>
        <DarkIcon className='h-8 w-8 cursor-pointer rounded-full bg-primary p-2 text-white transition-all hover:animate-spin-short dark:bg-opacity-0 dark:text-darkGreen dark:hover:text-white' />
      </button>
      <button onClick={handleDark}>
        <LightIcon className='h-8 w-8 cursor-pointer rounded-full p-2 text-darkGreen text-opacity-20 transition-all hover:animate-wiggle hover:text-opacity-100 dark:bg-primary dark:text-opacity-100' />
      </button>
    </div>
  );
};

export default ToggleTheme;
