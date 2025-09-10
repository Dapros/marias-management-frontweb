import { create } from "zustand"
import type { LunchType } from "../types"
import { generateUniqueId } from "../utils/generateId"

export type LunchStoreState = {
  // Lista global de almuerzos
  lunches: LunchType[];

  // estado boolean para controlar si se muestra el formulario
  showLunchForm: boolean;

  // estado boolean para controlar si estamos editando un almuerzo existente
  isEditing: boolean;

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
  updateLunchFromLunches: () => void;
  deleteLunchById: (id: string) => void;
  loadLunchToDraft: (lunch: LunchType) => void;
  setEditingMode: (editing: boolean) => void;
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
  isEditing: false,
  draft: initialDraft,

  setDraftTitle: (title) => set((state) => ({ draft: { ...state.draft, title } })),
  setDraftImagen: (imagen) => set((state) => ({ draft: { ...state.draft, imagen } })),
  setDraftPrice: (price) => set((state) => ({ draft: { ...state.draft, price } })),
  setDraftTags: (tags) => set((state) => ({ draft: { ...state.draft, tags } })),

  resetDraftImagen: () => set((state) => ({ draft: { ...state.draft, imagen: "" } })),
  resetDraft: () => set(() => ({ draft: initialDraft, isEditing: false })),

  toggleLunchForm: () => set((state) => ({ showLunchForm: !state.showLunchForm })),

  // cargar un almuerzo existente al draft para edición
  loadLunchToDraft: (lunch) => set(() => ({ 
    draft: { ...lunch }, 
    isEditing: true 
  })),

  // establecer modo de edición
  setEditingMode: (editing) => set(() => ({ isEditing: editing })),

  // añadir un almuerzo desde el draft actual al estado global
  addLunchFromDraft: () => {
    const { draft, lunches, isEditing } = get()
    const newLunch: LunchType = {
      id: isEditing ? generateUniqueId() : (draft.id ?? generateUniqueId()),
      title: draft.title,
      imagen: draft.imagen,
      price: draft.price,
      tags: draft.tags,
    }
    set({ lunches: [newLunch, ...lunches] })
    set({ draft: initialDraft, isEditing: false })
  },

  // actualizar un almuerzo de la lista de estado global seleccionando por el id
  updateLunchFromLunches: () => {
    const { draft, lunches } = get()
    const updatedLunches = lunches.map((lunch) => 
      lunch.id === draft.id ? { ...lunch, ...draft } : lunch
    )
    set({ lunches: updatedLunches })
    set({ draft: initialDraft, isEditing: false })
  },

  // eliminar un almuerzo del estado global por id
  deleteLunchById: (id) => set((state) => ({ lunches: state.lunches.filter((lunch) => lunch.id !== id) }))
}))