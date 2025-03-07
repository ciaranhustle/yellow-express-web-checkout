import { StorageKey } from "@/lib/constants";

const initialWhenState = {
  isToday: true,
  date: null,
  time: null,
};

const initialWhereState = {
  pickUpAddress: null,
  dropOffAddress: null,
};

const initialCustomerDetailsState = {
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
};

export const initialState: CartState = {
  type: null,
  when: initialWhenState,
  where: initialWhereState,
  what: "",
  customerDetails: initialCustomerDetailsState,
  quoteId: null,
  couponCode: null,
  bookingAssistOption: null,
};

export const cartReducer = (
  state: CartState,
  action: CartAction
): CartState => {
  let newState = state;

  switch (action.type) {
    case "SET_TYPE":
      newState = { ...newState, type: action.payload };
      break;

    case "SET_WHEN":
      newState = {
        ...newState,
        when: action.payload
          ? { ...(newState.when ?? initialWhenState), ...action.payload }
          : null,
      };
      break;

    case "SET_WHERE":
      newState = {
        ...newState,
        where: action.payload
          ? { ...(newState.where ?? initialWhereState), ...action.payload }
          : null,
      };
      break;

    case "SET_BOOKING_ASSIST_OPTION":
      newState = { ...newState, bookingAssistOption: action.payload };
      break;

    case "SET_WHAT":
      newState = { ...newState, what: action.payload };
      break;

    case "SET_CUSTOMER_DETAILS":
      newState = {
        ...newState,
        customerDetails: action.payload
          ? {
              ...(newState.customerDetails ?? initialCustomerDetailsState),
              ...action.payload,
            }
          : null,
      };
      break;

    case "SET_QUOTE_ID":
      newState = { ...newState, quoteId: action.payload };
      break;

    case "SET_COUPON_CODE":
      newState = { ...newState, couponCode: action.payload };
      break;

    case "SET_CART":
      newState = action.payload;
      break;

    case "CLEAR_CART":
      newState = { ...initialState };
      break;

    default:
      break;
  }

  console.log("newState", newState);

  localStorage.setItem(StorageKey.Cart, JSON.stringify(newState));
  return newState;
};
