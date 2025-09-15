import { create } from "zustand";
import type { OrderType } from "../types"
import { generateUniqueId } from "../utils/generateId";
import { createJSONStorage, persist } from "zustand/middleware";

export type OrderStoreState = {
  // Lista global de pedidos
  orders: OrderType[];

  // estado booleano para controlar si se muestra el formulario de pedidos
  showOrderForm: boolean;

  // estado booleano para controlar si se esta editando un pedido existente
  isEditing: boolean;

  // Borrador del formulario de pedidos para vista previa
  draft: Omit<OrderType, "id"> & { id?: string };

  // Acciones
  setDraftTowerNum: (towerNum: OrderType["towerNum"]) => void;
  setDraftApto: (apto: OrderType["apto"]) => void;
  setDraftCustomer: (customer: OrderType["customer"]) => void;
  setDraftPhoneNum: (phoneNum: OrderType["phoneNum"]) => void;
  setDraftPayMethod: (payMethod: OrderType["payMethod"]) => void;
  setDraftLunch: (lunch: OrderType["lunch"]) => void;
  setDraftDetails: (details: OrderType["details"]) => void;
  setDraftTime: (time: OrderType["time"]) => void;
  setDraftDate: (date: OrderType["date"]) => void;
  setDraftOrderState: (orderState: OrderType["orderState"]) => void

  resetDraft: () => void;
  toggleOrderForm: () => void;
  addOrderFromDraft: () => void;
  updateOrderFromOrders: () => void;
  loadOrderToDraft: (order: OrderType) => void;
  setEditingMode: (editing: boolean) => void;
}

const initialDraft: OrderStoreState["draft"] = {
  towerNum: "",
  apto: 0,
  customer: "",
  phoneNum: 0,
  payMethod: { id: '', label: '', image: '' },
  lunch: [],
  details: "",
  time: "",
  date: new Date(),
  orderState: 'pendiente',
}

// funcion para obtener el asyncStorage
const getStorage = () => {
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

export const useOrderStore = create<OrderStoreState>()(
  persist(
    (set, get) => ({
      orders: [],
      showOrderForm: false,
      isEditing: false,
      draft: initialDraft,

      setDraftTowerNum: (towerNum) => set((state) => ({ draft: { ...state.draft, towerNum}})),
      setDraftApto: (apto) => set((state) => ({ draft: { ...state.draft, apto}})),
      setDraftCustomer: (customer) => set((state) => ({ draft: {...state.draft, customer}})),
      setDraftPhoneNum: (phoneNum) => set((state) => ({ draft: { ...state.draft, phoneNum}})),
      setDraftPayMethod: (payMethod) => set((state) => ({ draft: { ...state.draft, payMethod}})),
      setDraftLunch: (lunch) => set((state) => ({ draft: { ...state.draft, lunch}})),
      setDraftDetails: (details) => set((state) => ({ draft: { ...state.draft, details}})),
      setDraftTime: (time) => set((state) => ({draft: { ...state.draft, time }})),
      setDraftDate: (date) => set((state) => ({ draft: {...state.draft, date }})),
      setDraftOrderState: (orderState) => set((state) => ({ draft: { ...state.draft, orderState}})),

      resetDraft: () => set(() => ({ draft: initialDraft, isEditing: false})),
      toggleOrderForm: () => set((state) => ({ showOrderForm: !state.showOrderForm})),

      // cargar un pedido existente al draft para edicion
      loadOrderToDraft: (order) => set(() => ({
        draft: { ...order },
        isEditing: true
      })),

      // establecer modo edicion
      setEditingMode: (editing) => set(() => ({ isEditing: editing })),

      // añadir un nuevo pedido desde el draft actual al estado global
      addOrderFromDraft: () => {
        const { draft, orders, isEditing } = get()
        const newOrder: OrderType = {
          id: isEditing ? generateUniqueId() : (draft.id ?? generateUniqueId()),
          towerNum: draft.towerNum,
          apto: draft.apto,
          customer: draft.customer,
          phoneNum: draft.phoneNum,
          payMethod: draft.payMethod,
          lunch: draft.lunch,
          details: draft.details,
          time: draft.time,
          date: draft.date,
          orderState: draft.orderState,
        }
        set({ orders: [newOrder, ...orders] })
        set({ draft: initialDraft, isEditing: false})
      },

      // actualizar un pedido de la lista del estado global seleccionado por id
      updateOrderFromOrders: () => {
        const { draft, orders } = get()
        const  updatedOrders = orders.map((order) => 
          order.id === draft.id ? { ...order, ...draft } : order
        )
        set({ orders: updatedOrders})
        set({ draft: initialDraft, isEditing: false})
      },
    }),
    {
      // clave en AsyncStorage
      name: "order-local-storage",
      storage: createJSONStorage(getStorage),
      onRehydrateStorage: () => (state) => {
        console.log('Persist - order-local-storage', state)
      }
    }
  )
)