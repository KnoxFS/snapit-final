import { Fragment, useState } from 'react';
import { useRouter } from 'next/router';
import { Dialog, Transition, RadioGroup } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import useAuth from 'hooks/useAuth';

const features = [
  'Unlock all templates and options',
  'Add tilt effect and perspective',
  'Save multiple presets and apply them in 1-click',
  'Crop your screenshots',
  'Use premium frame designs',
  'Add text and subtext on screenshot',
  'Use custom color/image as background',
  'Customize and add your watermark',
];

const plans = [
  {
    name: 'Monthly',
    price: '$7,99',
  },
  {
    name: 'Yearly',
    price: '$79',
  },
  {
    name: 'Lifetime',
    price: '$99',
  },
];

const Settings = ({ open, setOpen }) => {
  const { user } = useAuth();
  const router = useRouter();

  const [selectedPlan, setSelectedPlan] = useState(plans[0]);

  const handleBuyPro = async () => {
    if (!user) {
      router.replace('/signup?state=buyPro');
      setOpen(false);
      return;
    }

    const res = await fetch(
      `/api/pro?plan=${selectedPlan.name}&user_id=${user.id}`,
      {
        method: 'POST',
      },
    ).then(res => res.json());

    // Open Stripe Checkout
    window.location.href = res.session_url;
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'>
          <div className='fixed inset-0 bg-black bg-opacity-50' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'>
              <Dialog.Panel className='custom-scrollbar mx-auto h-[70vh] w-[70%] overflow-y-auto rounded-md bg-white p-6 text-left shadow-xl dark:bg-darkGreen'>
                <section className='grid grid-cols-1 gap-10 md:grid-cols-2'>
                  {/* Features */}
                  <article>
                    <h2 className='text-xl font-bold text-primary dark:text-white'>
                      Get Snapit Pro to enjoy these exclusive features!
                    </h2>
                    <ul className='my-6 space-y-4'>
                      {features.map((feature, index) => (
                        <li key={index} className='flex items-center gap-2'>
                          <CheckCircleIcon className='h-6 w-6 text-primary' />
                          <p className='text-darkGreen dark:text-white'>
                            {feature}
                          </p>
                        </li>
                      ))}
                    </ul>

                    <p className='font-bold text-green-400'>
                      and unlock other customizations & branding options
                    </p>
                  </article>

                  {/* Buy */}
                  <article>
                    <h2 className='text-xl font-bold text-primary dark:text-white'>
                      Select the plan that suits you
                    </h2>

                    <div className='mx-auto my-6 w-full'>
                      <RadioGroup
                        value={selectedPlan}
                        onChange={setSelectedPlan}>
                        <RadioGroup.Label className='sr-only'>
                          Choose plan
                        </RadioGroup.Label>
                        <div className='space-y-2'>
                          {plans.map(plan => (
                            <RadioGroup.Option
                              key={plan.name}
                              value={plan}
                              className={({ active, checked }) =>
                                `
                  ${
                    checked
                      ? 'bg-primary bg-opacity-75 text-darkGreen dark:text-white'
                      : 'bg-primary bg-opacity-80 dark:bg-opacity-20'
                  }
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                              }>
                              {({ checked }) => (
                                <div className='flex w-full items-center justify-between'>
                                  <div className='flex items-center'>
                                    <div className='text-sm'>
                                      <RadioGroup.Label
                                        as='p'
                                        className={`font-medium  ${
                                          checked
                                            ? 'text-darkGreen dark:text-white'
                                            : 'text-white'
                                        }`}>
                                        {plan.name}
                                      </RadioGroup.Label>
                                      <RadioGroup.Description
                                        as='div'
                                        className={`inline ${
                                          checked
                                            ? 'text-darkGreen dark:text-gray-300'
                                            : 'text-white/75'
                                        }`}>
                                        {plan.name === 'Lifetime' ? (
                                          <p>
                                            {plan.price} one{' '}
                                            {plan.name === 'Lifetime'
                                              ? 'time payment'
                                              : 'time payment'}
                                          </p>
                                        ) : (
                                          <p>
                                            {plan.price} each{' '}
                                            {plan.name === 'Monthly'
                                              ? 'month'
                                              : 'year'}
                                          </p>
                                        )}
                                      </RadioGroup.Description>
                                    </div>
                                  </div>
                                  {checked && (
                                    <div className='shrink-0 text-darkGreen dark:text-white'>
                                      <CheckCircleIcon className='h-6 w-6' />
                                    </div>
                                  )}
                                </div>
                              )}
                            </RadioGroup.Option>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>

                    <button
                      onClick={handleBuyPro}
                      className='mt-12 w-full rounded-md bg-primary py-4 text-darkGreen dark:text-white'>
                      Get Snapit Pro - {selectedPlan.name}
                    </button>
                  </article>
                </section>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Settings;
