import { create } from "zustand";
import type { OrderType } from "../types"
import { createJSONStorage, persist } from "zustand/middleware";
import { apiService } from "../services/api";
import { computeTotal } from "../utils/computeTotal";
import { isSameDay, isSameWeek, isSameMonth } from "../utils/date";

const normalizeOrder = (o: Partial<OrderType> & { id?: string }): OrderType => {
  // date handling (como antes)...
  const dateRaw = (o as any).date
  let dateValue: Date | undefined = undefined
  if (dateRaw !== undefined && dateRaw !== null && dateRaw !== '') {
    if (dateRaw instanceof Date) dateValue = !isNaN(dateRaw.getTime()) ? dateRaw : undefined
    else if (typeof dateRaw === 'string') {
      const parsed = new Date(dateRaw)
      dateValue = !isNaN(parsed.getTime()) ? parsed : undefined
    }
  }
  const lunchRaw = (o.lunch as any) ?? []
  const lunchItems = lunchRaw.map((it: any) => ({
    ...it,
    quantity: typeof it.quantity === 'number' ? it.quantity : Number(it.quantity || 1),
  }))
  const totalVal = typeof (o as any).total === 'number' ? (o as any).total : computeTotal(lunchItems)
  return {
    id: o.id ?? (o as any).id ?? '',
    towerNum: (o.towerNum as string) ?? '',
    apto: (o.apto as number) ?? 0,
    customer: (o.customer as string) ?? '',
    phoneNum: (o.phoneNum as number) ?? 0,
    payMethod: (o.payMethod as any) ?? { id: '', label: '', image: '' },
    lunch: lunchItems,
    details: (o.details as string) ?? '',
    time: (o.time as string) ?? '',
    date: dateValue,
    orderState: (o.orderState as OrderType['orderState']) ?? 'pendiente',
    total: totalVal,
  }
}



export type OrderStoreState = {
  // Lista global de pedidos
  orders: OrderType[];

  // estado booleano para controlar si se muestra el formulario de pedidos
  showOrderForm: boolean;

  // estado booleano para controlar si se esta editando un pedido existente
  isEditing: boolean;

  // estado de carga
  loading: boolean;

  // estado de error
  error: string | null;

  // Borrador del formulario de pedidos para vista previa
  draft: Omit<OrderType, "id"> & { id?: string };

  // filtros 
  statusFilter: 'all' | 'pendiente' | 'pagado';
  dateFilterType: 'all' | 'today' | 'week' | 'month' | 'date';
  dateFilterDate?: Date | null;

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
  addOrderFromDraft: () => Promise<void>;
  updateOrderFromOrders: () => Promise<void>;
  deleteOrderById: (id: string) => Promise<void>;
  updateOrderStateById: (id: string, newState: OrderType["orderState"]) => Promise<void>;
  loadOrderToDraft: (order: OrderType) => void;
  setEditingMode: (editing: boolean) => void;
  loadOrders: () => Promise<void>;
  setError: (error: string | null) => void;

  // Acciones de filtro
  setStatusFilter: (s: 'all' | 'pendiente' | 'pagado') => void;
  setDateFilterType: (t: 'all' | 'today' | 'week' | 'month' | 'date') => void;
  setDateFilterDate: (d?: Date | null) => void;
  clearFilters: () => void;

  // función derivada
  filteredOrders: () => OrderType[];
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
      loading: false,
      error: null,
      draft: initialDraft,
      statusFilter: 'all',
      dateFilterType: 'all',
      dateFilterDate: undefined,


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

      // acciones de filtro
      setStatusFilter: (s) => set(() => ({ statusFilter: s })),
      setDateFilterType: (t) => set(() => ({ dateFilterType: t })),
      setDateFilterDate: (d) => set(() => ({ dateFilterDate: d })),
      clearFilters: () => set(() => ({ statusFilter: 'all', dateFilterType: 'all', dateFilterDate: undefined })),

      filteredOrders: () => {
        const state = get();
        const { orders, statusFilter, dateFilterType, dateFilterDate } = state;
        const matchesDate = (o: OrderType) => {
          if (dateFilterType === 'all') return true;
          if (dateFilterType === 'today') {
            return isSameDay(o.date, new Date());
          }
          if (dateFilterType === 'week') {
            return isSameWeek(o.date, new Date());
          }
          if (dateFilterType === 'month') {
            return isSameMonth(o.date, new Date());
          }
          if (dateFilterType === 'date' && dateFilterDate) {
            return isSameDay(o.date, dateFilterDate);
          }
          return true;
        }
        const matchesStatus = (o: OrderType) => {
          if (statusFilter === 'all') return true;
          return o.orderState === statusFilter;
        }
        return orders.filter(o => matchesStatus(o) && matchesDate(o));
      },


      // cargar un pedido existente al draft para edicion
      loadOrderToDraft: (order) => set(() => ({
        draft: { ...order },
        isEditing: true
      })),

      // establecer modo edicion
      setEditingMode: (editing) => set(() => ({ isEditing: editing })),

      // establecer error
      setError: (error) => set(() => ({ error })),

      // cargar pedidos desde el backend
      loadOrders: async () => {
        set({ loading: true, error: null });
        try {
          const ordersFromApi = await apiService.getOrders();
          const normalized = ordersFromApi.map((o) => normalizeOrder(o));
          set({ orders: normalized, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Error al cargar Pedidos";
          set({ error: errorMessage, loading: false });
        }
      },

      // añadir un nuevo pedido desde el draft actual al estado global y backend
      addOrderFromDraft: async () => {
        const { draft } = get();
        set({ loading: true, error: null });

        try {
          const newOrder: Omit<OrderType, 'id'> = {
          towerNum: draft.towerNum,
          apto: draft.apto,
          customer: draft.customer,
          phoneNum: draft.phoneNum,
          payMethod: draft.payMethod,
          lunch: draft.lunch, // cada item debe llevar quantity
          details: draft.details,
          time: draft.time,
          date: draft.date,
          orderState: draft.orderState,
          total: computeTotal(draft.lunch)
        }
          const response = await apiService.createOrder(newOrder);
          // backend devuelve response.order
          const saved = normalizeOrder(response.order);
          const { orders } = get();
          set({
            orders: [saved, ...orders],
            draft: initialDraft,
            isEditing: false,
            loading: false,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Error al crear un pedido";
          set({ error: errorMessage, loading: false });
        }
      },

      // actualizar un pedido de la lista del estado global seleccionado por id y backend
      updateOrderFromOrders: async () => {
        const { draft } = get();
        if (!draft.id) return;

        set({ loading: true, error: null });

        try {
          const updateData: Partial<OrderType> = {
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
          };

          const response = await apiService.updateOrder(draft.id, updateData);
          // backend debería devolver { ok: true, updated: OrderType }
          const updatedNormalized = normalizeOrder(response.updated);

          const { orders } = get();
          const updatedOrders = orders.map((order) => (order.id === draft.id ? updatedNormalized : order));
          set({
            orders: updatedOrders,
            draft: initialDraft,
            isEditing: false,
            loading: false,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Error al actualizar pedido";
          set({ error: errorMessage, loading: false });
        }
      },

      // eliminar un pedido del estado global y backend
      deleteOrderById: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await apiService.deleteOrder(id);
          const { orders } = get();
          set({
            orders: orders.filter((order) => order.id !== id),
            loading: false,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Error al eliminar pedido";
          set({ error: errorMessage, loading: false });
        }
      },

      // actualizar solo orderState por id
      updateOrderStateById: async (id: string, newState: OrderType["orderState"]) => {
        set({ loading: true, error: null });
        try {
          // Llamada al backend para cambiar estado
          const response = await apiService.updateOrder(id, { orderState: newState });
          // backend debe devolver response.updated
          const updatedNormalized = normalizeOrder(response.updated);
          const { orders } = get();
          const updatedOrders = orders.map((o) => (o.id === id ? updatedNormalized : o));
          set({
            orders: updatedOrders,
            loading: false,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Error al actualizar estado del pedido";
          set({ error: errorMessage, loading: false });
        }
      },

    }),
    {
      // clave en AsyncStorage
      name: "order-local-storage",
      storage: createJSONStorage(getStorage),
      partialize: (state) => ({
        showOrderForm: state.showOrderForm,
        isEditing: state.isEditing,
        draft: state.draft,
      }),
      onRehydrateStorage: () => (state) => {
        console.log('Persist - order-local-storage', state)
        // Cargar pedidos desde el backend al inicializar
        if (state) {
          state.loadOrders()
        }
      }
    }
  )
)