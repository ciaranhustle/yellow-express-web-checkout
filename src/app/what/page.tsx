"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Container } from "@/components/Container/Container";
import { StepHeader } from "@/components/StepHeader/StepHeader";
import { StepNavButtons } from "@/components/StepNavButtons/StepNavButtons";
import { useCartContext } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { Acknowledgement } from "@/components/Acknowledgement/Acknowledgement";
import { SuggestionBubble } from "@/components/SuggestionBubble/SuggestionBubble";
import { Plus, X } from "lucide-react";

interface FormValues {
  items: { description: string }[];
}

const MIN_CHARACTERS = 1;
const MAX_SMALL_ITEMS = 6;
const MAX_BIG_ITEMS_BEFORE_NOTE = 10;

// List of suggested items for Big & Bulky
const SUGGESTED_BIG_ITEMS = [
  "Sofa",
  "Armchair",
  "Coffee Table",
  "Dining Table",
  "Dining Chairs",
  "Bed Frame",
  "Mattress",
  "Wardrobe",
  "Dresser",
  "TV",
  "Small Refrigerator",
  "Washing Machine",
  "Dryer",
  "Dishwasher",
  "Desk",
  "Bookcase",
  "Patio Set",
  "Office Chair",
  "Filing Cabinet",
];

const SUGGESTED_SMALL_ITEMS = [
  "Document Envelope",
  "Small Parcel",
  "Moving Box",
  "Electronics Box",
  "Books",
  "Clothing",
  "Office Supplies",
  "Personal Care",
  "Kitchen Utensils",
  "Kids Toys",
  "Cosmetics",
  "Supplements",
  "Art Supplies",
  "Tool Bag",
  "Media Disc",
  "Accessories",
  "Gifts",
  "Misc Items",
];

const SUGGESTED_FRAGILE_ITEMS = [
  "Precious Jewelry",
  "Ceramic Dishes",
  "Laptop",
  "Smartphone",
  "Tablet",
  "Camera Gear",
  "Stereo Speaker",
  "Delicate Ornament",
  "Important documents",
  "Confidential information",
  "Perishables",
  "Medications",
];

// Function to get icon for common items
const getItemIcon = (item: string): string => {
  if (!item) return "📦";
  const itemLower = item.toLowerCase();
  if (itemLower.includes("sofa") || itemLower.includes("couch")) return "🛋️";
  if (itemLower.includes("tv")) return "📺";
  if (itemLower.includes("table")) return "🪑";
  if (itemLower.includes("bed")) return "🛏️";
  if (itemLower.includes("chair")) return "💺";
  if (itemLower.includes("box")) return "📦";
  if (itemLower.includes("refrigerator") || itemLower.includes("fridge"))
    return "🧊";
  if (itemLower.includes("washing")) return "🧺";
  if (itemLower.includes("desk")) return "🖥️";
  if (itemLower.includes("book")) return "📚";
  if (itemLower.includes("armchair")) return "🪑";
  if (itemLower.includes("mattress")) return "🛏️";
  if (itemLower.includes("wardrobe")) return "🗄️";
  if (itemLower.includes("dresser")) return "🪞";
  if (itemLower.includes("dryer") || itemLower.includes("clothing"))
    return "👕";
  if (itemLower.includes("dishwasher")) return "🍽️";
  if (itemLower.includes("patio")) return "⛱️";
  if (itemLower.includes("filing")) return "🗃️";
  if (itemLower.includes("jewelry")) return "💍";
  if (itemLower.includes("glassware")) return "🥃";
  if (itemLower.includes("china")) return "🍽️";
  if (itemLower.includes("vase")) return "🌸";
  if (itemLower.includes("bowl")) return "🥣";
  if (itemLower.includes("picture")) return "🖼️";
  if (
    itemLower.includes("antiques") ||
    itemLower.includes("art") ||
    itemLower.includes("sculpture") ||
    itemLower.includes("ornament")
  )
    return "🏺";
  if (itemLower.includes("laptop") || itemLower.includes("electronics"))
    return "💻";
  if (itemLower.includes("smartphone") || itemLower.includes("phone"))
    return "📱";
  if (itemLower.includes("tablet")) return "📱";
  if (itemLower.includes("camera")) return "📸";
  if (itemLower.includes("stereo") || itemLower.includes("speaker"))
    return "🎧";
  if (itemLower.includes("delicate")) return "💍";
  if (itemLower.includes("envelope")) return "📨";
  if (itemLower.includes("media")) return "📼";
  if (itemLower.includes("accessory")) return "👜";
  if (itemLower.includes("gift")) return "🎁";
  if (itemLower.includes("misc")) return "📦";
  if (itemLower.includes("tool")) return "🛠️";
  if (itemLower.includes("toy")) return "🧸";
  if (itemLower.includes("cosmetic")) return "💄";
  if (itemLower.includes("supplement")) return "💊";
  if (itemLower.includes("art")) return "🎨";
  if (itemLower.includes("office")) return "🖥️";
  if (itemLower.includes("kitchen")) return "🍽️";

  return "📦"; // Default icon
};

const WhatPage = () => {
  const router = useRouter();
  const { state, dispatch, isLoading: isCartLoading } = useCartContext();
  const [isSmallItemsAcknowledge, setIsSmallItemsAcknowledge] = useState(false);
  const [newItemText, setNewItemText] = useState("");
  const [showSmallItemsLimitNote, setShowSmallItemsLimitNote] = useState(false);

  const { handleSubmit, control, watch } = useForm<FormValues>({
    defaultValues: {
      items:
        Array.isArray(state.what) && state.what.length > 0
          ? state.what.map((description) => ({ description }))
          : [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");

  const nextDisabled =
    items.length === 0 ||
    ((state.type === "Small Items" || state.type === "Fragile & Sensitive") &&
      !isSmallItemsAcknowledge);

  const handleAddItem = () => {
    if (
      (state.type === "Small Items" || state.type === "Fragile & Sensitive") &&
      items.length >= MAX_SMALL_ITEMS
    ) {
      setShowSmallItemsLimitNote(true);
      return;
    }
    if (newItemText.trim().length >= MIN_CHARACTERS) {
      append({ description: newItemText.trim() });
      setNewItemText("");
      setShowSmallItemsLimitNote(false);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    if (
      (state.type === "Small Items" || state.type === "Fragile & Sensitive") &&
      items.length >= MAX_SMALL_ITEMS
    ) {
      setShowSmallItemsLimitNote(true);
      return;
    }
    append({ description: suggestion });
    setShowSmallItemsLimitNote(false);
  };

  const handleNextPress = (formData: FormValues) => {
    const validItems = formData.items
      .filter((item) => item.description?.length >= MIN_CHARACTERS)
      .map((item) => item.description);
    dispatch({ type: "SET_WHAT", payload: validItems });
    router.push("/details");
  };

  useEffect(() => {
    // If the user navigates to this page without the previous steps, redirect to the home page
    if (!isCartLoading && !state.type) {
      router.push("/");
    }
  }, [state, router, isCartLoading]);

  return (
    <Container>
      <StepHeader
        title={
          state.type === "Corporate Enquiries"
            ? "What, When, Where?"
            : "What are we moving?"
        }
      />
      {state.type ? (
        <>
          {state.type === "Corporate Enquiries" ? (
            <div className="w-full flex flex-col items-end gap-4">
              <Controller
                name="items.0.description"
                control={control}
                rules={{
                  minLength: {
                    value: MIN_CHARACTERS,
                    message: `Minimum ${MIN_CHARACTERS} characters are required`,
                  },
                }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    placeholder="Describe your requirements"
                    className="w-full p-3 border border-gray-300 rounded-md placeholder:text-gray-600 min-h-[100px] resize-y"
                  />
                )}
              />
            </div>
          ) : (
            <div className="w-full flex flex-col gap-4">
              <div className="relative w-full">
                <input
                  type="text"
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  placeholder="Add an item..."
                  className="w-full px-5 py-3 border border-lightgrey rounded text-lg bg-transparent"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddItem();
                    }
                  }}
                  disabled={
                    (state.type === "Small Items" ||
                      state.type === "Fragile & Sensitive") &&
                    items.length >= MAX_SMALL_ITEMS
                  }
                />
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label="Add item"
                  disabled={
                    (state.type === "Small Items" ||
                      state.type === "Fragile & Sensitive") &&
                    items.length >= MAX_SMALL_ITEMS
                  }
                >
                  <Plus size={24} />
                </button>
              </div>

              {fields.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md border border-gray-200"
                    >
                      <span>{getItemIcon(items[index].description)}</span>
                      <span>{items[index].description}</span>
                      <button
                        type="button"
                        onClick={() => {
                          remove(index);
                          setShowSmallItemsLimitNote(false);
                        }}
                        className="text-gray-500 ml-1"
                        aria-label={`Remove ${items[index].description}`}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {state.type === "Small Items" ||
                (state.type === "Fragile & Sensitive" &&
                  showSmallItemsLimitNote && (
                    <div className="text-red-500 text-sm">
                      You can only add up to 6 small items.
                    </div>
                  ))}

              {state.type === "Big & Bulky" &&
                items.length > MAX_BIG_ITEMS_BEFORE_NOTE && (
                  <div className="text-yellow-600 text-sm">
                    An additional load will be required when transporting more
                    than 10 big & bulky items.
                  </div>
                )}

              <SuggestionBubble
                suggestions={
                  state.type === "Big & Bulky"
                    ? SUGGESTED_BIG_ITEMS
                    : state.type === "Small Items"
                    ? SUGGESTED_SMALL_ITEMS
                    : SUGGESTED_FRAGILE_ITEMS
                }
                selected={items.map((item) => item.description)}
                onSelect={handleSuggestionSelect}
              />
              {(state.type === "Small Items" ||
                state.type === "Fragile & Sensitive") && (
                <Acknowledgement
                  text="The items that I am moving are small enough to be placed on the front seat of a standard car."
                  isChecked={isSmallItemsAcknowledge}
                  onChange={() => setIsSmallItemsAcknowledge((prev) => !prev)}
                />
              )}
            </div>
          )}
        </>
      ) : null}

      {state.type !== "Corporate Enquiries" && (
        <div className="w-full flex flex-col gap-4 mt-5">
          <p className="text-lg font-medium">Special Instructions</p>
          <textarea
            value={state.instructions}
            onChange={(e) =>
              dispatch({ type: "SET_INSTRUCTIONS", payload: e.target.value })
            }
            placeholder="Any special instructions…"
            className="w-full px-5 py-3 border border-lightgrey rounded text-lg bg-transparent"
          />
        </div>
      )}

      <StepNavButtons
        onNext={handleSubmit(handleNextPress)}
        nextDisabled={nextDisabled}
      />
    </Container>
  );
};

export default WhatPage;
