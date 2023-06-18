import {
  ArrowDownIcon,
  ArrowDownLeftIcon,
  ArrowDownRightIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowUpLeftIcon,
  ArrowUpRightIcon,
} from '@heroicons/react/24/outline';

export const gradientDirections = [
  {
    value: 'bg-gradient-to-t',
    icon: <ArrowUpIcon className='w-4 h-4 text-darkGreen dark:text-white' />,
  },
  {
    value: 'bg-gradient-to-tr',
    icon: (
      <ArrowUpRightIcon className='w-4 h-4 text-darkGreen dark:text-white' />
    ),
  },
  {
    value: 'bg-gradient-to-r',
    icon: (
      <ArrowRightIcon className='w-4 h-4 text-darkGreen dark:text-white' />
    ),
  },
  {
    value: 'bg-gradient-to-br',
    icon: (
      <ArrowDownRightIcon className='w-4 h-4 text-darkGreen dark:text-white' />
    ),
  },
  {
    value: 'bg-gradient-to-b',
    icon: <ArrowDownIcon className='w-4 h-4 text-darkGreen dark:text-white' />,
  },
  {
    value: 'bg-gradient-to-bl',
    icon: (
      <ArrowDownLeftIcon className='w-4 h-4 text-darkGreen dark:text-white' />
    ),
  },
  {
    value: 'bg-gradient-to-l',
    icon: <ArrowLeftIcon className='w-4 h-4 text-darkGreen dark:text-white' />,
  },
  {
    value: 'bg-gradient-to-tl',
    icon: (
      <ArrowUpLeftIcon className='w-4 h-4 text-darkGreen dark:text-white' />
    ),
  },
];

export const cssGradientsDirections = {
  'bg-gradient-to-t': 'to top',
  'bg-gradient-to-tr': 'to top right',
  'bg-gradient-to-r': 'to right',
  'bg-gradient-to-br': 'to bottom right',
  'bg-gradient-to-b': 'to bottom',
  'bg-gradient-to-bl': 'to bottom left',
  'bg-gradient-to-l': 'to left',
  'bg-gradient-to-tl': 'to top left',
};

export const wallpapers = [
  {
    src: '/wallpapers/1.jpg',
    name: '1',
  },
  {
    src: '/wallpapers/2.jpg',
    name: '2',
  },
  {
    src: '/wallpapers/3.jpg',
    name: '3',
  },
  {
    src: '/wallpapers/4.jpg',
    name: '4',
  },
  {
    src: '/wallpapers/5.jpg',
    name: '5',
  },
  {
    src: '/wallpapers/6.jpg',
    name: '6',
  },
  {
    src: '/wallpapers/7.jpg',
    name: '7',
  },
];
