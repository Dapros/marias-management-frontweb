import { create } from "zustand"
import type { LunchType } from "../types"

export type LunchStoreState = {
  // Lista global de almuerzos
  lunches: LunchType[];

  // estado boolean para controlar si se muestra el formulario
  showLunchForm: boolean;

  // Borrador del formulario para vista previa
  draft: Omit<LunchType, "id"> & { id?: string };

  // Acciones
  setDraftTitle: (title: LunchType["title"]) => void;
  setDraftImagen: (imagen: LunchType["imagen"]) => void;
  setDraftPrice: (price: LunchType["price"]) => void;
  setDraftTags: (tags: LunchType["tags"]) => void;
  resetDraftImagen: () => void;
  resetDraft: () => void;
  toggleLunchForm: () => void;
  addLunchFromDraft: () => void;
}

const initialDraft: LunchStoreState["draft"] = {
  title: "",
  imagen: "",
  price: 0,
  tags: [],
}

export const useLunchStore = create<LunchStoreState>((set, get) => ({
  lunches: [],
  showLunchForm: false,
  draft: initialDraft,

  setDraftTitle: (title) => set((state) => ({ draft: { ...state.draft, title } })),
  setDraftImagen: (imagen) => set((state) => ({ draft: { ...state.draft, imagen } })),
  setDraftPrice: (price) => set((state) => ({ draft: { ...state.draft, price } })),
  setDraftTags: (tags) => set((state) => ({ draft: { ...state.draft, tags } })),

  resetDraftImagen: () => set((state) => ({ draft: { ...state.draft, imagen: "" } })),
  resetDraft: () => set(() => ({ draft: initialDraft })),

  toggleLunchForm: () => set((state) => ({ showLunchForm: !state.showLunchForm })),

  addLunchFromDraft: () => {
    const { draft, lunches } = get()
    const newLunch: LunchType = {
      id: draft.id ?? `${Date.now()}`,
      title: draft.title,
      imagen: draft.imagen,
      price: draft.price,
      tags: draft.tags,
    }
    set({ lunches: [newLunch, ...lunches] })
    set({ draft: initialDraft })
  },
}))