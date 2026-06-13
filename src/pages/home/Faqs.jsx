import React from 'react';

const Faqs = () => {
    return (
        <div>
            <div className='flex flex-col lg:flex-row items-center gap-5'>
                <div>
                    <h2 className='text-5xl font-bold mb-8'>Frequently Asked Questions</h2>
                    <p className='font-normal text-2xl'>If you have a question or need some help, <br />Please take a moment to read through our Frequently Asked Questions.</p>
                </div>

            </div>

            <div className='mt-10 mb-25'>
                <div className="collapse collapse-plus border border-base-300 mb-2">
                    <input type="radio" name="my-accordion-3" />
                    <div className="collapse-title font-medium text-xl">Are you screening blood samples for coronavirus?</div>
                    <div className="collapse-content text-lg">
                        <p>
                            There have been no reported cases of transfusion-transmission of COVID-19 anywhere in the world, and for this reason we do not need to routinely test blood donors for coronavirus and we can rely on our strict screening processes.
                        </p>
                        <br />
                        <p>
                            We don't allow people who are unwell to donate blood and COVID-19 is not considered a transfusion-transmissible disease.
                        </p>
                    </div>
                </div>

                <div className="collapse collapse-plus border border-base-300 mb-2">
                    <input type="radio" name="my-accordion-3" />
                    <div className="collapse-title font-medium text-xl">Can coronavirus be transmitted by blood transfusion?</div>
                    <div className="collapse-content text-lg">There have been no reported cases of transfusion-transmission of COVID-19 anywhere in the world, and there is now increasing scientific evidence that the risk of this occurring is extremely low.</div>
                </div>

                <div className="collapse collapse-plus border border-base-300 mb-2">
                    <input type="radio" name="my-accordion-3" />
                    <div className="collapse-title font-medium text-xl">Can I give blood if I've had the COVID-19 vaccine?</div>
                    <div className="collapse-content text-lg">

                        Yes, but you need to wait at least three days after each COVID-19 vaccination to make sure you have had no side effects and are feeling healthy and well on the day of donation. If you have any side effects from the vaccine, you should not donate until you have recovered. If you know your vaccination date please consider donating in the days before, or scheduling your donation at least three days after vaccination.

                    </div>
                </div>

                <div className="collapse collapse-plus border border-base-300 mb-2">
                    <input type="radio" name="my-accordion-3" />
                    <div className="collapse-title font-medium text-xl">Should people wait more than three days just to be safe?</div>
                    <div className="collapse-content text-lg">
                        COVID-19 vaccine studies show most temporary symptoms occur in the two days following vaccination. As always, we need donors to feel healthy and well on the day of donation. We also encourage people to donate before they receive their COVID-19 vaccination or after three days if they remain well. If you have had a side effect, please wait until you are fully recovered before donating.
                    </div>
                </div>

                <div className="collapse collapse-plus border border-base-300 mb-2">
                    <input type="radio" name="my-accordion-3" />
                    <div className="collapse-title font-medium text-xl">Is it safe to donate blood (first) and receive the COVID vaccination on the same day?</div>
                    <div className="collapse-content text-lg">
                        If donors have recovered well after donating blood it’s unlikely to impact their vaccination. However, just to be safe we recommend donors schedule their blood donation and COVID vaccination on different days if possible. This is to ensure donors are feeling well on the day of vaccination, as there is a small chance of side effects due to the blood donation, which could impact on your vaccination appointment.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Faqs;