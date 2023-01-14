import { Fragment, useState } from "react";
import { useRouter } from "next/router";
import { Dialog, Transition, RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import useAuth from "hooks/useAuth";

const features = [
  "Unlock all templates and options",
  "Add tilt effect and perspective",
  "Save multiple presets and apply them in 1-click",
  "Crop your screenshots",
  "Use premium frame designs",
  "Add text and subtext on screenshot",
  "Use custom color/image as background",
  "Customize and add your watermark",
];

const plans = [
  {
    name: "Monthly",
    price: "$5",
  },
  {
    name: "Yearly",
    price: "$49",
  },
  {
    name: "Lifetime",
    price: "$99",
  },

];

const Settings = ({ open, setOpen }) => {
  const { user } = useAuth();
  const router = useRouter();

  const [selectedPlan, setSelectedPlan] = useState(plans[0]);

  const handleBuyPro = async () => {
    if (!user) {
      router.replace("/signup?state=buyPro");
      setOpen(false);
      return;
    }

    const res = await fetch(
      `/api/pro?plan=${selectedPlan.name}&user_id=${user.id}`,
      {
        method: "POST",
      }
    ).then((res) => res.json());

    // Open Stripe Checkout
    window.location.href = res.session_url;
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-[70%] h-[70vh] overflow-y-auto custom-scrollbar mx-auto rounded-md bg-[#282828] p-6 text-left shadow-xl">
                <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Features */}
                  <article>
                    <h2 className="text-white font-bold text-xl">
                      Get Snapit Pro to enjoy these exclusive features!
                    </h2>
                    <ul className="my-6 space-y-4">
                      {features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircleIcon className="h-6 w-6 text-green-400" />
                          <p className="text-white">{feature}</p>
                        </li>
                      ))}
                    </ul>

                    <p className="text-green-400 font-bold">
                      and unlock other customizations & branding options
                    </p>
                  </article>

                  {/* Buy */}
                  <article>
                    <h2 className="text-white font-bold text-xl">
                      Select the plan that suits you
                    </h2>

                    <div className="mx-auto w-full my-6">
                      <RadioGroup
                        value={selectedPlan}
                        onChange={setSelectedPlan}
                      >
                        <RadioGroup.Label className="sr-only">
                          Choose plan
                        </RadioGroup.Label>
                        <div className="space-y-2">
                          {plans.map((plan) => (
                            <RadioGroup.Option
                              key={plan.name}
                              value={plan}
                              className={({ active, checked }) =>
                                `
                  ${
                    checked
                      ? "bg-green-400 bg-opacity-75 text-white"
                      : "bg-[#212121]"
                  }
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                              }
                            >
                              {({ checked }) => (
                                <div className="flex w-full items-center justify-between">
                                  <div className="flex items-center">
                                    <div className="text-sm">
                                      <RadioGroup.Label
                                        as="p"
                                        className="font-medium text-white"
                                      >
                                        {plan.name}
                                      </RadioGroup.Label>
                                      <RadioGroup.Description
                                        as="div"
                                        className={`inline ${
                                          checked
                                            ? "text-gray-300"
                                            : "text-gray-500"
                                        }`}
                                      >
                                        <p>
                                          {plan.price} each{" "}
                                          {plan.name === "Monthly"
                                            ? "month"
                                            : "year"}
                                        </p>
                                      </RadioGroup.Description>
                                    </div>
                                  </div>
                                  {checked && (
                                    <div className="shrink-0 text-white">
                                      <CheckCircleIcon className="h-6 w-6" />
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
                      className="bg-green-400 text-white w-full py-4 rounded-md mt-12"
                    >
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
