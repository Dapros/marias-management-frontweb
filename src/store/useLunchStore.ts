import { create } from "zustand"
import type { LunchType } from "../types"
import { createJSONStorage, persist } from "zustand/middleware"
import { apiService } from "../services/api"

export type LunchStoreState = {
  // Lista global de almuerzos
  lunches: LunchType[];

  // estado boolean para controlar si se muestra el formulario
  showLunchForm: boolean;

  // estado boolean para controlar si se esta editando un almuerzo existente
  isEditing: boolean;

  // estado de carga
  loading: boolean;

  // estado de error
  error: string | null;

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
  addLunchFromDraft: () => Promise<void>;
  updateLunchFromLunches: () => Promise<void>;
  deleteLunchById: (id: string) => Promise<void>;
  loadLunchToDraft: (lunch: LunchType) => void;
  setEditingMode: (editing: boolean) => void;
  loadLunches: () => Promise<void>;
  setError: (error: string | null) => void;
}

const initialDraft: LunchStoreState["draft"] = {
  title: "",
  imagen: "",
  price: 0,
  tags: [],
}

const getStorage = () => {
  // Async-compatible storage using localStorage with in-memory fallback
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return {
        getItem: async (name: string) => window.localStorage.getItem(name),
        setItem: async (name: string, value: string) => window.localStorage.setItem(name, value),
        removeItem: async (name: string) => window.localStorage.removeItem(name),
      }
    }
  } catch (_) {
    // Ignora
  }
  const memory = new Map<string, string>()
  return {
    getItem: async (name: string) => memory.get(name) ?? null,
    setItem: async (name: string, value: string) => void memory.set(name, value),
    removeItem: async (name: string) => void memory.delete(name),
  }
}

export const useLunchStore = create<LunchStoreState>()(
  persist(
    (set, get) => ({
      lunches: [],
      showLunchForm: false,
      isEditing: false,
      loading: false,
      error: null,
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

      // establecer error
      setError: (error) => set(() => ({ error })),

      // cargar almuerzos desde el backend
      loadLunches: async () => {
        set({ loading: true, error: null })
        try {
          const lunches = await apiService.getLunches()
          set({ lunches, loading: false })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al cargar almuerzos'
          set({ error: errorMessage, loading: false })
        }
      },

      // añadir un almuerzo desde el draft actual al estado global y backend
      addLunchFromDraft: async () => {
        const { draft } = get()
        set({ loading: true, error: null })
        
        try {
          const newLunch: Omit<LunchType, 'id'> = {
            title: draft.title,
            imagen: draft.imagen,
            price: draft.price,
            tags: draft.tags,
          }
          
          const response = await apiService.createLunch(newLunch)
          const { lunches } = get()
          set({ 
            lunches: [response.lunch, ...lunches],
            draft: initialDraft, 
            isEditing: false,
            loading: false
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al crear almuerzo'
          set({ error: errorMessage, loading: false })
        }
      },

      // actualizar un almuerzo de la lista de estado global y backend
      updateLunchFromLunches: async () => {
        const { draft } = get()
        if (!draft.id) return
        
        set({ loading: true, error: null })
        
        try {
          const updateData: Partial<LunchType> = {
            title: draft.title,
            imagen: draft.imagen,
            price: draft.price,
            tags: draft.tags,
          }
          
          const response = await apiService.updateLunch(draft.id, updateData)
          const { lunches } = get()
          const updatedLunches = lunches.map((lunch) => 
            lunch.id === draft.id ? response.updated : lunch
          )
          set({ 
            lunches: updatedLunches,
            draft: initialDraft, 
            isEditing: false,
            loading: false
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al actualizar almuerzo'
          set({ error: errorMessage, loading: false })
        }
      },

      // eliminar un almuerzo del estado global y backend
      deleteLunchById: async (id) => {
        set({ loading: true, error: null })
        
        try {
          await apiService.deleteLunch(id)
          const { lunches } = get()
          set({ 
            lunches: lunches.filter((lunch) => lunch.id !== id),
            loading: false
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al eliminar almuerzo'
          set({ error: errorMessage, loading: false })
        }
      }
    }),
    {
      // Solo persistir el estado del formulario, no los datos de almuerzos
      name: "lunch-form-storage",
      storage: createJSONStorage(getStorage),
      partialize: (state) => ({
        showLunchForm: state.showLunchForm,
        isEditing: state.isEditing,
        draft: state.draft,
      }),
      onRehydrateStorage: () => (state) => {
        console.log('Persist - lunch-form-storage', state)
        // Cargar almuerzos desde el backend al inicializar
        if (state) {
          state.loadLunches()
        }
      }
    }
  )
)