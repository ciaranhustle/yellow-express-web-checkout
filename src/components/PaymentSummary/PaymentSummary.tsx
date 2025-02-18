export const PaymentSummary = () => (
  <>
    <div className="w-full bg-white border-b-8 border-b-primary rounded-button shadow-button pl-6 pr-2 pt-4 pb-2 text-black my-7 flex flex-row justify-between items-center">
      <p className="text-lg font-bold">Got a discount code?</p>
      <button className="py-1 px-5 rounded-md border border-black">
        + Add
      </button>
    </div>
    <p className="text-lg font-bold mb-3 text-start">Payment summary</p>
    <div className="flex flex-col bg-white rounded-button shadow-button border-b-8 border-b-primary">
      <div className="w-full flex flex-row justify-between pt-7 pb-5 px-6 border-b border-opacity-10">
        <p className="text-lg font-bold">Your Booking</p>
        <p className="text-lg font-bold w-20">${99}</p>
      </div>
    </div>
  </>
);
