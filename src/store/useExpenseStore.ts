import { create } from "zustand";
import type { ExpenseKind, ExpenseType } from "../types"
import { createJSONStorage, persist } from "zustand/middleware";
import { apiService } from "../services/api";

export type ExpenseStoreState = {
  expenses: ExpenseType[];
  showExpenseForm: boolean;
  loading: boolean;
  error: string | null;
  draft: Omit<ExpenseType, 'id'> & { id?: string };

  setDraftKind: (k: ExpenseKind) => void
  setDraftTitle: (t: string) => void
  setDraftDescription: (d: string) => void
  setDraftAmount: (n: number) => void
  setDraftTime: (s: string) => void
  setDraftDate: (d: Date | string) => void
  resetDraft: () => void
  toggleExpenseForm: () => void
  addExpenseFromDraft: () => Promise<void>
  deleteExpenseById: (id: string) => Promise<void>
  loadExpenseToDraft: (expense: ExpenseType) => void
  loadExpenses: () => Promise<void>
  setError: (err: string | null) => void
}

const initialDraft: ExpenseStoreState["draft"] = {
  kind: 'purchase',
  title: '',
  description: '',
  amount: 0,
  time: '',
  date: new Date(),
}

const getStorage = () => {
  try {
    if(typeof window !== "undefined" && window.localStorage) {
      return {
        getItem: async (name: string) => window.localStorage.getItem(name),
        setItem: async (name: string, value: string) => window.localStorage.setItem(name, value),
        removeItem: async (name: string) => window.localStorage.removeItem(name)
      }
    }
  } catch (_) {}
  const memory = new Map<string, string>()
  return {
    getItem: async (name: string) => memory.get(name) ?? null,
    setItem: async (name: string, value: string) => void memory.set(name, value),
    removeItem: async (name: string) => void memory.delete(name)
  }
}

export const useExpenseStore = create<ExpenseStoreState>()(
  persist(
    (set, get) => ({
      expenses: [],
      showExpenseForm: false,
      loading: false,
      error: null,
      draft: initialDraft,

      setDraftKind: (k) => set((s) => ({ draft: { ...s.draft, kind: k } })),
      setDraftTitle: (t) => set((s) => ({ draft: { ...s.draft, title: t } })),
      setDraftDescription: (d) => set((s) => ({ draft: { ...s.draft, description: d } })),
      setDraftAmount: (n) => set((s) => ({ draft: { ...s.draft, amount: n } })),
      setDraftTime: (t) => set((s) => ({ draft: { ...s.draft, time: t } })),
      setDraftDate: (d) => set((s) => ({ draft: { ...s.draft, date: d } })),

      resetDraft: () => set(() => ({ draft: initialDraft })),
      toggleExpenseForm: () => set((s) => ({ showExpenseForm: !s.showExpenseForm })),

      loadExpenseToDraft: (expense) => set(() => ({ draft: { ...expense }, showExpenseForm: true })),

      setError: (err) => set(() => ({ error: err })),

      loadExpenses: async () => {
        set({ loading: true, error: null })
        try {
          const expenses = await apiService.getExpenses()
          set({ expenses, loading: false })
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Error al cargar egresos'
          set({ error: errorMessage, loading: false })
        }
      },
      
      addExpenseFromDraft: async () => {
        const { draft } = get()
        set({ loading: true, error: null })
        try {
          const newExpense: Omit<ExpenseType, 'id'> = {
            kind: draft.kind,
            title: draft.title,
            description: draft.description,
            amount: draft.amount,
            time: draft.time,
            date: draft.date
          }
          const res = await apiService.createExpense(newExpense)
          const { expenses } = get()
          set({ expenses: [res.expense, ...expenses], draft: initialDraft, showExpenseForm: false, loading: false })
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Error creating expense'
          set({ error: errorMessage, loading: false })
        }
      },

      deleteExpenseById: async (id) => {
        set({ loading: true, error: null })
        try {
          await apiService.deleteExpense(id)
          const { expenses } = get()
          set({ expenses: expenses.filter(e => e.id !== id), loading: false })
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Error deleting expense'
          set({ error: errorMessage, loading: false })
        }
      }
    }),
    {
      name: 'expense-form-storage',
      storage: createJSONStorage(getStorage),
      partialize: (state) => ({ showExpenseForm: state.showExpenseForm, draft: state.draft }),
      onRehydrateStorage: () => (state) => {
        if (state) state.loadExpenses && state.loadExpenses()
      }
    }
  )
)