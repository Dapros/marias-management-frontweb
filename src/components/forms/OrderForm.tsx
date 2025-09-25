import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useOrderStore } from "../../store/useOrderStore";
import { useLunchStore } from "../../store/useLunchStore";
import type { LunchType, OrderItem, PayMethod } from "../../types";

export default function OrderForm() {
  const {
    draft,
    isEditing,
    setDraftTowerNum,
    setDraftApto,
    setDraftCustomer,
    setDraftPhoneNum,
    setDraftPayMethod,
    setDraftLunch,
    setDraftDetails,
    setDraftTime,
    setDraftDate,
    setDraftOrderState,
    addOrderFromDraft,
    updateOrderFromOrders,
    toggleOrderForm,
  } = useOrderStore();
  const { lunches } = useLunchStore();

  const [useCurrentDateTime, setUseCurrentDateTime] = useState(false);

  const payMethods: PayMethod[] = [
    { id: '1', label: 'Efectivo', image: '' },
    { id: '2', label: 'Transferencia', image: '' },
  ];

  useEffect(() => {
    if (useCurrentDateTime) {
      const now = new Date()
      setDraftTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
      setDraftDate(now)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useCurrentDateTime])

  // Helpers para gestionar el draft de almuerzos con quantity
  const addLunchToDraft = (lunchToAdd: LunchType) => {
    const current = draft.lunch ?? []
    const exists = current.find((l) => l.id === lunchToAdd.id)
    if (exists) {
      // si ya existe, incrementamos en 1
      const updated = current.map((l) => (l.id === lunchToAdd.id ? { ...l, quantity: (l.quantity ?? 1) + 1 } : l))
      setDraftLunch(updated as any)
      return
    }
    const newItem: OrderItem = { ...lunchToAdd, quantity: 1 }
    setDraftLunch([...(current as any), newItem] as any)
  };

  const removeLunchFromDraft = (id: string) => {
    const updated = (draft.lunch ?? []).filter((l) => l.id !== id)
    setDraftLunch(updated as any)
  };

  const setQuantityForLunch = (id: string, qty: number) => {
    if (qty < 1) qty = 1
    const updated = (draft.lunch ?? []).map((l) => (l.id === id ? ({ ...l, quantity: qty }) : l))
    setDraftLunch(updated as any)
  };

  // total calculado localmente (memoizado)
  const totalCalculated = useMemo(() => {
    const items = draft.lunch ?? []
    return items.reduce((sum, it) => sum + ((it.price ?? 0) * (it.quantity ?? 0)), 0)
  }, [draft.lunch])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "towerNum":
        setDraftTowerNum(value);
        break;
      case "apto":
        setDraftApto(Number(value));
        break;
      case "customer":
        setDraftCustomer(value);
        break;
      case "phoneNum":
        setDraftPhoneNum(Number(value));
        break;
      case "payMethod":
        const selectedPayMethod = payMethods.find((p) => p.id === value);
        if (selectedPayMethod) setDraftPayMethod(selectedPayMethod);
        break;
      case "details":
        setDraftDetails(value);
        break;
      case "orderState":
        setDraftOrderState(value as "pendiente" | "pagado");
        break;
    }
  }

  const handleTimeChange = (time: Date | null) => {
    if (time) setDraftTime(time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
  }

  const handleDateChange = (date: Date | null) => {
    if (date) setDraftDate(date)
  }

  // helper para DatePicker.selected (aceptar string | Date | undefined)
  const dateSelected = (() => {
    if (!draft.date) return null;
    if (draft.date instanceof Date) return isNaN(draft.date.getTime()) ? null : draft.date;
    try {
      const parsed = new Date(draft.date);
      return isNaN(parsed.getTime()) ? null : parsed;
    } catch {
      return null;
    }
  })();

  const timeSelected = (() => {
    if (!draft.time) return null;
    try {
      const d = new Date(`1970-01-01T${draft.time}`);
      return isNaN(d.getTime()) ? null : d;
    } catch {
      return null;
    }
  })();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // antes de enviar: asegurar que draft.lunch items tengan quantity numérica
    const normalizedLunch = (draft.lunch ?? []).map((it) => ({
      ...it,
      quantity: typeof it.quantity === "number" ? it.quantity : Number(it.quantity ?? 1),
    })) as any;
    // set temporal en draft (para que store lo lea) — setDraftLunch viene del store
    setDraftLunch(normalizedLunch);
    // además se asumirá que el store calcula total a partir del draft.lunch si lo necesita
    if (isEditing) {
      updateOrderFromOrders();
    } else {
      addOrderFromDraft();
    }
    toggleOrderForm();
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          {isEditing ? "Editar pedido" : "Registrar pedido"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="towerNum" className="text-lg">Torre</label>
            <input 
              type="text" 
              id="towerNum" 
              name="towerNum"
              value={draft.towerNum} 
              onChange={handleInputChange}
              placeholder="Numero de la torre, pj. 4"
              className="outline-none border placeholder:opacity-50 py-1 px-2 rounded-lg border-gray-500 focus:border-teal-600 focus:placeholder:text-teal-600 transition-normal ease-in-out duration-300" 
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="apto" className="text-lg">Apto</label>
            <input 
              type="number" 
              id="apto" 
              name="apto" 
              value={draft.apto ?? ""} 
              onChange={handleInputChange} 
              className="outline-none border placeholder:opacity-50 py-1 px-2 rounded-lg border-gray-500 focus:border-teal-600 focus:placeholder:text-teal-600 transition-normal ease-in-out duration-300" 
            />
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="customer" className="text-lg">Cliente</label>
          <input 
            type="text" 
            id="customer" 
            name="customer" 
            value={draft.customer ?? ""} 
            onChange={handleInputChange} 
            placeholder="Nombre del cliente. pe. Vecino Juan."
            className="outline-none border placeholder:opacity-50 py-1 px-2 rounded-lg border-gray-500 focus:border-teal-600 focus:placeholder:text-teal-600 transition-normal ease-in-out duration-300"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="phoneNum" className="text-lg">Teléfono</label>
          <input 
            type="number" 
            id="phoneNum" 
            name="phoneNum" 
            value={draft.phoneNum ?? ""} 
            onChange={handleInputChange} 
            className="outline-none border placeholder:opacity-50 py-1 px-2 rounded-lg border-gray-500 focus:border-teal-600 focus:placeholder:text-teal-600 transition-normal ease-in-out duration-300"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="payMethod" className="text-lg">Método de Pago</label>
          <select 
            id="payMethod" 
            name="payMethod" 
            value={draft.payMethod?.id ?? ""} 
            onChange={handleInputChange} 
            className="outline-none border placeholder:opacity-50 py-1 px-2 rounded-lg border-gray-500 focus:border-teal-600 focus:placeholder:text-teal-600 transition-normal ease-in-out duration-300"
          >
            <option value="">-- Seleccione --</option>
            {payMethods.map((method) => (
              <option key={method.id} value={method.id}>{method.label}</option>
            ))}
          </select>
        </div>

        {/* --- Selección de almuerzos (agrega con quantity) --- */}
        <div className="flex flex-col space-y-2">
          <label className="text-lg">Almuerzos</label>
          <select onChange={(e) => {
            const id = e.target.value;
            if (!id) return;
            const found = lunches.find(l => l.id === id);
            if (found) addLunchToDraft(found);
            e.currentTarget.value = "";
          }} className="outline-none border placeholder:opacity-50 py-1 px-2 rounded-lg border-gray-500 focus:border-teal-600 focus:placeholder:text-teal-600 transition-normal ease-in-out duration-300">
            <option value="">-- Selecciona para agregar --</option>
            {lunches.map(l => <option key={l.id} value={l.id}>{l.title} — {l.price}</option>)}
          </select>

          {/* lista de items agregados con controles de cantidad */}
          {draft.lunch && draft.lunch.length > 0 && (
            <div className="mt-2 space-y-2">
              {draft.lunch.map((l) => (
                <div key={l.id} className="flex items-center justify-between gap-2 border p-2 rounded-lg border-gray-500 hover:border-teal-600 transition-normal ease-in-out duration-300">
                  <div>
                    <div className="font-medium">{l.title}</div>
                    <div className="text-sm text-gray-600">precio: {l.price}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setQuantityForLunch(l.id, (l.quantity ?? 1) - 1)} className="px-2 py-1 border rounded-lg hover:shadow">-</button>
                    <input type="number" value={l.quantity ?? 1} min={1} onChange={(e) => setQuantityForLunch(l.id, Number(e.target.value) || 1)} className="w-16 outline-none text-center border rounded-lg p-1" />
                    <button type="button" onClick={() => setQuantityForLunch(l.id, (l.quantity ?? 1) + 1)} className="px-2 py-1 border rounded-lg hover:shadow">+</button>
                    <button type="button" onClick={() => removeLunchFromDraft(l.id)} className="px-2 py-1 bg-red-50 hover:shadow text-red-600 border rounded-lg ml-2">Eliminar</button>
                  </div>
                </div>
              ))}

              <div className="text-right font-semibold">Total parcial: <span className="ml-2">{totalCalculated}</span></div>
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="details" className="text-lg">Detalles</label>
          <textarea 
            id="details" 
            name="details" 
            value={draft.details ?? ""} 
            onChange={handleInputChange} 
            placeholder="Detalles que el cliente haya mencionado. pj. Sin Arroz, con más sopa... etc."
            className="outline-none border placeholder:opacity-50 py-1 px-2 rounded-lg border-gray-500 focus:border-teal-600 focus:placeholder:text-teal-600 min-h-20 max-h-80"
          ></textarea>
        </div>

        <div className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="useCurrentDateTime" 
            checked={useCurrentDateTime} 
            onChange={() => setUseCurrentDateTime(!useCurrentDateTime)} 
            className=" h-4 w-4 hover:cursor-pointer"
          />
          <label htmlFor="useCurrentDateTime" className="text-lg">Usar hora y fecha actual</label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="time" className="text-lg">Hora</label>
            <DatePicker 
              id="time" 
              selected={timeSelected} 
              onChange={handleTimeChange} 
              showTimeSelect showTimeSelectOnly timeIntervals={15} timeCaption="Time" dateFormat="h:mm aa" 
              className="w-full outline-none border placeholder:opacity-50 py-1 px-2 rounded-lg border-gray-500 focus:border-teal-600 focus:placeholder:text-teal-600"
              disabled={useCurrentDateTime} 
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="date" className="text-lg">Fecha</label>
            <DatePicker 
              id="date" 
              selected={dateSelected} 
              onChange={handleDateChange} 
              dateFormat="MMMM d, yyyy" 
              className="w-full outline-none border placeholder:opacity-50 py-1 px-2 rounded-lg border-gray-500 focus:border-teal-600 focus:placeholder:text-teal-600"
              disabled={useCurrentDateTime} 
            />
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="orderState" className="text-lg">Estado del Pedido</label>
          <select 
            id="orderState" 
            name="orderState" 
            value={draft.orderState ?? "pendiente"} 
            onChange={handleInputChange} 
            className="outline-none border placeholder:opacity-50 py-1 px-2 rounded-lg border-gray-500 focus:border-teal-600 focus:placeholder:text-teal-600 transition-normal ease-in-out duration-300"
          >
            <option value="pendiente">Pendiente</option>
            <option value="pagado">Pagado</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-teal-600 text-white p-2 rounded hover:bg-teal-700">
          {isEditing ? "Actualizar Pedido" : "Guardar Pedido"}
        </button>
      </form>
    </div>
  );
}