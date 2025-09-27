"use client";

export const loadState = (key) => {
  if (typeof window === "undefined") return undefined;
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    console.error(`Error loading ${key} from localStorage`, err);
    return undefined;
  }
};

export const saveState = (key, state) => {
  if (typeof window === "undefined") return;
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
  } catch (err) {
    console.error(`Error saving ${key} to localStorage`, err);
  }
};
