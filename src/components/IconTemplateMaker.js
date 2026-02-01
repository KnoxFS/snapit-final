import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import domtoimage from 'dom-to-image';
import classnames from 'classnames';

import { Disclosure, RadioGroup } from '@headlessui/react';
import {
    ChevronRightIcon,
    PlusIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

import {
    ColorPickerIcon,
    SaveIcon,
    ClipboardIcon,
    BackgroundIcon,
    ResetIcon,
} from 'ui/icons';

import updateStats from 'utils/updateStats';
import useAuth from 'hooks/useAuth';

import DropShadow from './tools/DropShadow';
import Roundness from './tools/Roundness';
import SnapitWatermark from './tools/SnapitWatermark';
import IconPicker from './tools/IconPicker';

import {
    cssGradientsDirections,
    gradientDirections,
    wallpapers,
} from 'constants/gradients';

import Size from './tools/Size';

const isValidHexColor = /^#([0-9A-F]{3}){1,2}$/i;

const defaultOptions = {
    aspectRatio: 'aspect-square !scale-75',
    theme: 'from-purple-400 via-pink-500 to-red-500',
    bgDirection: 'bg-gradient-to-br',
    wallpaper: '',
    watermark: false,
    customTheme: {
        colorStart: '#667eea',
        colorEnd: '#764ba2',
    },
    shadow: 'drop-shadow-2xl',
    roundedWrapper: 'rounded-3xl',
    roundedIcon: 'rounded-3xl',
    size: 60, // Icon size percentage
    padding: 20, // Padding around icon
};

const IconTemplateMaker = ({ proMode }) => {
    const { user } = useAuth();
    const wrapperRef = useRef();

    const [icon, setIcon] = useState({ src: null, component: null, name: null });
    const [bgPicker, setBGPicker] = useState(false);
    const [showIconPicker, setShowIconPicker] = useState(false);
    const [options, setOptions] = useState({
        ...defaultOptions,
        watermark: !proMode,
    });

    const onIconUpload = async event => {
        var items = event?.target?.files || event?.dataTransfer?.files;
        var index = 0;
        for (index in items) {
            var item = items[index];
            if (item?.type?.includes('image')) {
                var blob = item;
                var reader = new FileReader();
                reader.onload = function (event) {
                    setIcon({ src: event.target.result, component: null, name: 'Custom Icon' });
                };
                reader.readAsDataURL(blob);
            }
        }
    };

    const handleIconSelect = (selectedIcon) => {
        setIcon({
            src: null,
            component: selectedIcon.component,
            name: selectedIcon.name,
        });
    };

    // export image
    const saveImage = async () => {
        let savingToast = toast.loading('Exporting image...');
        const scale = window.devicePixelRatio;
        domtoimage
            .toPng(wrapperRef.current, {
                height: wrapperRef.current.offsetHeight * scale,
                width: wrapperRef.current.offsetWidth * scale,
                style: {
                    transform: 'scale(' + scale + ')',
                    transformOrigin: 'top left',
                    width: wrapperRef.current.offsetWidth + 'px',
                    height: wrapperRef.current.offsetHeight + 'px',
                },
            })
            .then(async data => {
                var a = document.createElement('A');
                a.href = data;
                a.download = `icon-${new Date().toISOString()}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                toast.success('Icon exported!', { id: savingToast });

                if (user) {
                    updateStats(user.id, 'Template_Saved');
                }
            });
    };

    // snapshot for copy image to clipboard
    const snapshotCreator = () => {
        return new Promise((resolve, reject) => {
            try {
                const scale = window.devicePixelRatio;
                const element = wrapperRef.current;
                domtoimage
                    .toBlob(element, {
                        height: element.offsetHeight * scale,
                        width: element.offsetWidth * scale,
                        style: {
                            transform: 'scale(' + scale + ')',
                            transformOrigin: 'top left',
                            width: element.offsetWidth + 'px',
                            height: element.offsetHeight + 'px',
                        },
                    })
                    .then(blob => {
                        resolve(blob);
                    });
            } catch (e) {
                reject(e);
            }
        });
    };

    // copy image to clipboard
    const copyImage = () => {
        const isSafari = /^((?!chrome|android).)*safari/i.test(
            navigator?.userAgent,
        );
        const isNotFirefox = navigator.userAgent.indexOf('Firefox') < 0;

        if (isSafari) {
            navigator.clipboard
                .write([
                    new ClipboardItem({
                        'image/png': new Promise(async (resolve, reject) => {
                            try {
                                const blob = await snapshotCreator();
                                resolve(new Blob([blob], { type: 'image/png' }));
                            } catch (err) {
                                reject(err);
                            }
                        }),
                    }),
                ])
                .then(() => {
                    toast.success('Icon copied to clipboard');
                    if (user) {
                        updateStats(user.id, 'Template_Copied');
                    }
                })
                .catch(err => toast.error(err));
        } else if (isNotFirefox) {
            navigator?.permissions
                ?.query({ name: 'clipboard-write' })
                .then(async result => {
                    if (result.state === 'granted') {
                        const type = 'image/png';
                        const blob = await snapshotCreator();
                        let data = [new ClipboardItem({ [type]: blob })];
                        navigator.clipboard
                            .write(data)
                            .then(() => {
                                toast.success('Icon copied to clipboard');
                                if (user) {
                                    updateStats(user.id, 'Template_Copied');
                                }
                            })
                            .catch(err => {
                                console.error('Error:', err);
                            });
                    }
                });
        } else {
            alert('Firefox does not support this functionality');
        }
    };

    const resetCanvas = () => {
        setIcon({ src: null });
        setOptions(defaultOptions);
    };

    const pickBackground = () => {
        return (
            <>
                {bgPicker ? (
                    <div
                        className='fixed inset-0 h-full w-full bg-transparent'
                        onClick={() => setBGPicker(false)}
                    />
                ) : (
                    ''
                )}
                <div
                    className={classnames(
                        'absolute top-[calc(100%)] left-[-30px] z-10 flex w-auto max-w-[400px] flex-col rounded-xl border border-gray-400 bg-white/80 py-4 px-5 shadow-lg shadow-gray-500/50 backdrop-blur duration-200 dark:border-gray-800 dark:bg-black/80 dark:shadow-black/80',
                        {
                            'pointer-events-none scale-[0.9] opacity-0': !bgPicker,
                        },
                        {
                            'pointer-events-auto scale-[1] opacity-100': bgPicker,
                        },
                    )}>
                    <div
                        className='absolute top-[5%] right-[5%] z-10 cursor-pointer opacity-50 hover:opacity-100'
                        onClick={() => setBGPicker(false)}>
                        ✕
                    </div>
                    <div className='relative mb-3'>
                        <div className='mb-1'>Pick first color</div>
                        <div className='flex items-center'>
                            <div className='group relative'>
                                <input
                                    id='startColorPicker'
                                    type='color'
                                    className='absolute top-0 left-0 h-12 w-12 cursor-pointer rounded-full opacity-0'
                                    value={options.customTheme.colorStart || '#222'}
                                    onChange={e =>
                                        setOptions({
                                            ...options,
                                            customTheme: {
                                                ...options.customTheme,
                                                colorStart: e.target.value,
                                            },
                                        })
                                    }
                                />
                                <label
                                    style={{
                                        backgroundColor: options?.customTheme?.colorStart || '#222',
                                    }}
                                    htmlFor='startColorPicker'
                                    className='pointer-events-none left-0 flex h-12 w-12 items-center justify-center rounded-full text-white/50 duration-100 group-hover:scale-[1.1]'>
                                    <span className='font-mono text-xs text-white/80 drop-shadow'>
                                        Pick
                                    </span>
                                </label>
                            </div>
                            <span className='px-4 opacity-50'>/</span>
                            <input
                                placeholder='Enter hex value'
                                type='text'
                                value={options.customTheme.colorStart || '#000000'}
                                className='rounded-lg border-2 border-gray-500 px-2 py-1 font-mono text-base text-black focus:border-black focus:outline-none'
                                onChange={e => {
                                    setOptions({
                                        ...options,
                                        customTheme: {
                                            ...options.customTheme,
                                            colorStart: e.target.value,
                                        },
                                    });
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <div className='mb-1'>Pick second color</div>
                        <div className='flex items-center'>
                            <div className='group relative'>
                                <input
                                    id='endColorPicker'
                                    type='color'
                                    className='absolute top-0 left-0 h-12 w-12 cursor-pointer rounded-full opacity-0'
                                    value={options.customTheme.colorEnd || '#222'}
                                    onChange={e =>
                                        setOptions({
                                            ...options,
                                            customTheme: {
                                                ...options.customTheme,
                                                colorEnd: e.target.value,
                                            },
                                        })
                                    }
                                />
                                <label
                                    style={{
                                        backgroundColor: options?.customTheme?.colorEnd || '#222',
                                    }}
                                    htmlFor='endColorPicker'
                                    className='pointer-events-none left-0 flex h-12 w-12  items-center justify-center rounded-full text-white/50 duration-100 group-hover:scale-[1.1]'>
                                    <span className='font-mono text-xs text-white/80 drop-shadow'>
                                        Pick
                                    </span>
                                </label>
                            </div>
                            <span className='px-4 opacity-50'>/</span>
                            <input
                                placeholder='Enter hex value'
                                type='text'
                                value={options.customTheme.colorEnd || '#000000'}
                                className='rounded-lg border-2 border-gray-500 px-2 py-1 font-mono text-base text-black focus:border-black focus:outline-none'
                                onChange={e => {
                                    setOptions({
                                        ...options,
                                        customTheme: {
                                            ...options.customTheme,
                                            colorEnd: e.target.value,
                                        },
                                    });
                                }}
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    };

    const renderPreview = () => (
        <article className='flex h-full justify-center rounded-md bg-primary bg-opacity-20 p-8 dark:bg-opacity-10'>
            <div
                ref={wrapperRef}
                style={
                    options.customTheme
                        ? {
                            background: `linear-gradient(${cssGradientsDirections[options.bgDirection]
                                }, ${options?.customTheme?.colorStart || 'transparent'}, ${options?.customTheme?.colorEnd || 'transparent'
                                })`,
                        }
                        : {
                            background: options.background
                                ? `url(${options.background})`
                                : '',
                        }
                }
                className={classnames(
                    `relative flex h-[600px] w-[600px] items-center justify-center overflow-hidden bg-cover transition-all`,
                    { [options?.theme]: !options.customTheme },
                    options.bgDirection,
                    options.roundedWrapper,
                    options.shadow,
                )}>
                {/* Icon */}
                {(icon.src || icon.component) && (
                    <div
                        className='flex items-center justify-center'
                        style={{
                            width: `${options.size}%`,
                            height: `${options.size}%`,
                        }}>
                        {icon.src ? (
                            <img
                                src={icon.src}
                                className={`h-full w-full object-contain ${options.roundedIcon}`}
                                alt='Icon'
                            />
                        ) : (
                            <div className={`h-full w-full flex items-center justify-center text-white ${options.roundedIcon}`}>
                                {icon.component && <icon.component className="w-full h-full" />}
                            </div>
                        )}
                    </div>
                )}

                {!icon.src && !icon.component && (
                    <button
                        onClick={() => setShowIconPicker(true)}
                        className='text-center text-white/50 hover:text-white/80 transition cursor-pointer group'>
                        <div className='mb-2 flex justify-center'>
                            <svg className='w-24 h-24 text-white/30 group-hover:text-white/50 transition' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                            </svg>
                        </div>
                        <p className='text-2xl font-bold'>Click to select an icon</p>
                        <p className='text-sm mt-1'>Choose from our library</p>
                    </button>
                )}

                {/* watermark */}
                {options?.watermark && (
                    <div className='absolute bottom-0 right-1/2 translate-x-1/2 select-none rounded-t-md bg-green-500 p-1 px-2 text-xs text-white'>
                        Made with Screenshots4all.com
                    </div>
                )}
            </div>
        </article>
    );

    const renderOptions = () => (
        <article className='custom-scrollbar max-h-[680px] overflow-y-auto overflow-x-hidden rounded-md bg-primary bg-opacity-20 p-4 dark:bg-opacity-10'>
            <div className='space-y-4'>
                <h3 className='w-full text-center text-darkGreen dark:text-white'>
                    Icon Options
                </h3>

                {/* Select Icon */}
                <div className='space-y-2'>
                    <div className='flex items-center justify-between rounded-md bg-primary bg-opacity-30 p-2 font-medium text-darkGreen dark:bg-opacity-100'>
                        <p className='w-[60%] text-sm'>Select Icon</p>

                        <button
                            onClick={() => setShowIconPicker(true)}
                            className='rounded-md bg-primary px-4 py-2 text-sm dark:bg-darkGreen hover:opacity-80 transition text-darkGreen dark:text-white'>
                            Choose
                        </button>
                    </div>

                    {icon.name && (
                        <div className='flex items-center justify-between text-sm text-darkGreen dark:text-white/70 px-2'>
                            <span>Selected: {icon.name}</span>
                            <button
                                onClick={() => setIcon({ src: null, component: null, name: null })}
                                className='text-red-500 hover:text-red-700 transition'>
                                <XMarkIcon className='h-4 w-4' />
                            </button>
                        </div>
                    )}

                    <div className='flex items-center justify-between rounded-md bg-primary bg-opacity-30 p-2 font-medium text-darkGreen dark:bg-opacity-100'>
                        <p className='w-[60%] text-sm'>Upload Custom</p>

                        <input
                            type='file'
                            id='icon'
                            accept='image/png,image/jpg,image/jpeg,image/svg+xml'
                            className='hidden'
                            onChange={onIconUpload}
                        />

                        <label
                            htmlFor='icon'
                            className={`relative w-max cursor-pointer rounded-md bg-primary p-2 text-sm dark:bg-darkGreen ${icon.src ? 'bg-opacity-70' : ''
                                }`}>
                            <PlusIcon className='h-6 w-6 text-darkGreen dark:text-white' />

                            {icon.src && (
                                <button
                                    onClick={e => {
                                        e.stopPropagation();
                                        setIcon({ src: null, component: null, name: null });
                                    }}
                                    className='absolute -right-1 -top-1 z-10 rounded-full bg-darkGreen p-0.5 shadow-md'>
                                    <XMarkIcon className='h-3 w-3 text-darkGreen dark:text-white' />
                                </button>
                            )}
                        </label>
                    </div>
                </div>

                {/* Icon size */}
                <Size
                    options={options}
                    setOptions={setOptions}
                    label='Icon size'
                    max='90'
                    min='30'
                />

                <h3 className='w-full text-center text-darkGreen dark:text-white'>
                    Canvas Options
                </h3>

                {/* Background */}
                <Disclosure>
                    {({ open }) => (
                        <>
                            <Disclosure.Button className='w-full'>
                                <div className='relative flex w-full items-center justify-between pb-2 text-sm text-darkGreen dark:text-white'>
                                    <div className='grid w-full grid-cols-[2fr,1fr]'>
                                        <div className='flex items-center space-x-2'>
                                            <BackgroundIcon className='h-6 w-6 text-darkGreen dark:text-white' />
                                            <h3 className='text-sm text-darkGreen dark:text-white'>
                                                Background
                                            </h3>
                                        </div>

                                        <div className='flex items-center justify-around gap-2'>
                                            <div className='relative'>
                                                <div
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        setBGPicker(!bgPicker);
                                                    }}
                                                    className='ml-2 flex cursor-pointer items-center rounded-lg bg-primary px-2 font-medium text-darkGreen hover:bg-green-500'>
                                                    <span className='mr-1 h-3 w-3'>
                                                        {ColorPickerIcon}
                                                    </span>
                                                    Pick
                                                </div>
                                            </div>
                                            <ChevronRightIcon
                                                className={`${open ? 'rotate-90 transform' : ''
                                                    } h-5 w-5 text-darkGreen  dark:text-white`}
                                            />
                                        </div>
                                        {pickBackground()}
                                    </div>
                                </div>
                            </Disclosure.Button>

                            <Disclosure.Panel className='scrollbar-none w-full overflow-x-scroll'>
                                <div>
                                    <div className='mt-1 grid grid-cols-6 flex-wrap gap-x-4 gap-y-2'>
                                        {[
                                            'bg-gradient-to-br from-pink-300 via-orange-200 to-red-300',
                                            'bg-gradient-to-br from-green-300 via-yellow-200 to-green-200',
                                            'bg-gradient-to-br from-green-200 via-blue-100 to-blue-300',
                                            'bg-gradient-to-br from-indigo-300 via-blue-400 to-purple-500',
                                            'bg-gradient-to-br from-red-300 via-orange-300 to-yellow-200',
                                            'bg-gradient-to-br from-pink-300 via-pink-400 to-red-400',
                                            'bg-gradient-to-br from-slate-400 via-gray-500 to-gray-700',
                                            'bg-gradient-to-br from-orange-300 via-orange-400 to-red-400',
                                            'bg-gradient-to-br from-teal-300 to-cyan-400',
                                            'bg-gradient-to-br from-red-300 to-purple-600',
                                            'bg-white',
                                            'bg-black',
                                        ].map(theme => (
                                            <div
                                                key={theme}
                                                className={`h-8 w-8 cursor-pointer rounded-full shadow shadow-gray-500/20 dark:shadow-black/20 ${theme}`}
                                                onClick={() => {
                                                    setOptions({
                                                        ...options,
                                                        theme: theme,
                                                        customTheme: false,
                                                        background: '',
                                                    });
                                                }}
                                            />
                                        ))}
                                    </div>

                                    <div className='mt-2 grid grid-cols-6 flex-wrap gap-x-4 gap-y-2'>
                                        {wallpapers.map(wallpaper => (
                                            <div
                                                key={wallpaper.name}
                                                className='h-8 w-8 cursor-pointer rounded-full bg-cover bg-center shadow shadow-gray-500/20 dark:shadow-black/20'
                                                style={{
                                                    backgroundImage: `url(${wallpaper.src})`,
                                                }}
                                                onClick={() => {
                                                    setOptions({
                                                        ...options,
                                                        background: wallpaper.src,
                                                        customTheme: false,
                                                    });
                                                }}
                                            />
                                        ))}
                                    </div>

                                    {/* gradient direction */}
                                    <RadioGroup
                                        className='mt-4 flex items-center space-x-2 text-darkGreen dark:text-white'
                                        value={options.bgDirection}
                                        onChange={value =>
                                            setOptions({
                                                ...options,
                                                bgDirection: value,
                                            })
                                        }>
                                        {gradientDirections.map(gd => (
                                            <RadioGroup.Option
                                                key={gd.value}
                                                value={gd.value}
                                                className='cursor-pointer rounded-md border p-1 text-darkGreen ui-checked:border-green-400 dark:text-white'>
                                                <span>{gd.icon}</span>
                                            </RadioGroup.Option>
                                        ))}
                                    </RadioGroup>
                                </div>
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>

                {/* Shadow */}
                <DropShadow options={options} setOptions={setOptions} />

                {/* Roundness */}
                <Roundness options={options} setOptions={setOptions} target='wrapper' />
                <Roundness options={options} setOptions={setOptions} target='icon' />

                {/* Watermark */}
                <SnapitWatermark options={options} setOptions={setOptions} proMode={proMode} />

                {/* Actions */}
                <div className='flex items-center justify-between space-x-2'>
                    <button
                        onClick={saveImage}
                        className='flex w-full items-center justify-center space-x-2 rounded-md bg-primary p-2 text-darkGreen transition hover:bg-green-500 dark:bg-darkGreen dark:text-white'>
                        <span className='h-6 w-6'>{SaveIcon}</span>
                        <span>Save</span>
                    </button>

                    <button
                        onClick={copyImage}
                        className='flex w-full items-center justify-center space-x-2 rounded-md bg-primary p-2 text-darkGreen transition hover:bg-green-500 dark:bg-darkGreen dark:text-white'>
                        <span className='h-6 w-6'>{ClipboardIcon}</span>
                        <span>Copy</span>
                    </button>

                    <button
                        onClick={resetCanvas}
                        className='flex w-full items-center justify-center space-x-2 rounded-md bg-primary p-2 text-darkGreen transition hover:bg-green-500 dark:bg-darkGreen dark:text-white'>
                        <span className='h-6 w-6'>{ResetIcon}</span>
                        <span>Reset</span>
                    </button>
                </div>
            </div>
        </article>
    );

    return (
        <>
            <IconPicker
                isOpen={showIconPicker}
                onClose={() => setShowIconPicker(false)}
                onSelect={handleIconSelect}
            />
            <section className='mx-auto my-12 w-[90%] overflow-x-hidden md:w-[80%]'>
                <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
                    {renderPreview()}
                    {renderOptions()}
                </div>
            </section>
        </>
    );
};

export default IconTemplateMaker;
