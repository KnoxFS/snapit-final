import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export default function MyModal({
  open,
  setOpen,
  crop,
  setCrop,
  saveCrop,
  blob,
  setBlob,
}) {
  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          onClose={() => setOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'>
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'>
                <Dialog.Panel className='w-full max-w-4xl transform overflow-hidden rounded-2xl bg-[#E3F9EC] bg-opacity-90 p-6 text-left align-middle shadow-xl transition-all dark:bg-darkGreen'>
                  <Dialog.Title as='h3' className='sr-only'>
                    Crop Image
                  </Dialog.Title>

                  <ReactCrop
                    crop={crop}
                    onChange={c => setCrop(c)}
                    ruleOfThirds
                    className='w-full'>
                    <img
                      src={blob.src}
                      className='w-full'
                      onLoad={e => {
                        setBlob({
                          ...blob,
                          w: e.target.width,
                          h: e.target.height,
                        });
                      }}
                    />
                  </ReactCrop>

                  <div className='mt-4 flex items-center justify-center gap-5'>
                    <button
                      className='rounded-md bg-primary px-4 py-2 text-darkGreen dark:bg-primary dark:text-white'
                      onClick={() => saveCrop(crop)}>
                      Save
                    </button>

                    <button
                      className='px-4 py-2 text-darkGreen dark:text-white'
                      onClick={() => setOpen(false)}>
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
