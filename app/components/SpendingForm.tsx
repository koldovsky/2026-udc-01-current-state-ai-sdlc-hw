"use client";

import { useState } from "react";

const ADD_NEW_VALUE = "__add_new__";

type SpendingFormProps = {
  categories: string[];
  selectedCategory: string;
  onSelectedCategoryChange: (category: string) => void;
  onAddCategory: (name: string) => boolean;
  onAddEntry: (category: string, amount: number) => boolean;
};

type FormErrors = {
  category?: string;
  amount?: string;
  newCategory?: string;
};

export default function SpendingForm({
  categories,
  selectedCategory,
  onSelectedCategoryChange,
  onAddCategory,
  onAddEntry,
}: SpendingFormProps) {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  function handleCategoryChange(value: string) {
    if (value === ADD_NEW_VALUE) {
      setIsAddingCategory(true);
      setErrors((prev) => ({ ...prev, category: undefined }));
      return;
    }

    setIsAddingCategory(false);
    setNewCategoryName("");
    onSelectedCategoryChange(value);
    setErrors((prev) => ({ ...prev, category: undefined, newCategory: undefined }));
  }

  function handleConfirmCategory() {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      setErrors((prev) => ({ ...prev, newCategory: "Enter a category name." }));
      return false;
    }

    const added = onAddCategory(trimmed);
    if (!added) {
      setErrors((prev) => ({
        ...prev,
        newCategory: "Category already exists.",
      }));
      return false;
    }

    setIsAddingCategory(false);
    setNewCategoryName("");
    setErrors((prev) => ({ ...prev, newCategory: undefined, category: undefined }));
    return true;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = {};
    let category = selectedCategory;

    if (isAddingCategory) {
      const trimmed = newCategoryName.trim();
      if (!trimmed) {
        nextErrors.newCategory = "Enter a category name.";
      } else if (!categories.includes(trimmed)) {
        const added = onAddCategory(trimmed);
        if (!added) {
          nextErrors.newCategory = "Category already exists.";
        } else {
          category = trimmed;
          setIsAddingCategory(false);
          setNewCategoryName("");
        }
      } else {
        category = trimmed;
        setIsAddingCategory(false);
        setNewCategoryName("");
      }
    }

    if (!category) {
      nextErrors.category = "Select a category.";
    }

    const parsedAmount = Number.parseFloat(amount);
    if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      nextErrors.amount = "Enter an amount greater than 0.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const success = onAddEntry(category, parsedAmount);
    if (success) {
      setAmount("");
      setErrors({});
    }
  }

  const parsedAmount = Number.parseFloat(amount);
  const isSubmitDisabled =
    (!selectedCategory && !isAddingCategory) ||
    (isAddingCategory && !newCategoryName.trim()) ||
    !amount ||
    Number.isNaN(parsedAmount) ||
    parsedAmount <= 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="category" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Category
        </label>
        <select
          id="category"
          value={isAddingCategory ? ADD_NEW_VALUE : selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
          <option value={ADD_NEW_VALUE}>+ Add new category</option>
        </select>
        {errors.category && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.category}</p>
        )}
      </div>

      {isAddingCategory && (
        <div className="flex flex-col gap-2">
          <label
            htmlFor="new-category"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            New category name
          </label>
          <div className="flex gap-2">
            <input
              id="new-category"
              type="text"
              value={newCategoryName}
              onChange={(e) => {
                setNewCategoryName(e.target.value);
                setErrors((prev) => ({ ...prev, newCategory: undefined }));
              }}
              placeholder="e.g. Subscriptions"
              className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
            <button
              type="button"
              onClick={handleConfirmCategory}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              Add
            </button>
          </div>
          {errors.newCategory && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.newCategory}</p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Amount
        </label>
        <input
          id="amount"
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setErrors((prev) => ({ ...prev, amount: undefined }));
          }}
          placeholder="0.00"
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {errors.amount && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.amount}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitDisabled}
        className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        Log spending
      </button>
    </form>
  );
}
