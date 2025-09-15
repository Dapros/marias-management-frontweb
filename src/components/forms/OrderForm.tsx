import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useOrderStore } from "../../store/useOrderStore";
import { useLunchStore } from "../../store/useLunchStore";
import type { LunchType, PayMethod } from "../../types";

export default function OrderForm() {
  const { draft, isEditing, setDraftTowerNum, setDraftApto, setDraftCustomer, setDraftPhoneNum, setDraftPayMethod, setDraftLunch, setDraftDetails, setDraftTime, setDraftDate, setDraftOrderState, addOrderFromDraft, updateOrderFromOrders, toggleOrderForm } = useOrderStore();
  const { lunches } = useLunchStore();

  const [useCurrentDateTime, setUseCurrentDateTime] = useState(false);

  const payMethods: PayMethod[] = [
    { id: '1', label: 'Efectivo', image: '' },
    { id: '2', label: 'Transferencia', image: '' },
  ];

  useEffect(() => {
    if (useCurrentDateTime) {
      const now = new Date();
      setDraftTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDraftDate(now);
    }
  }, [useCurrentDateTime, setDraftTime, setDraftDate]);

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
        const selectedPayMethod = payMethods.find(p => p.id === value);
        if (selectedPayMethod) {
          setDraftPayMethod(selectedPayMethod);
        }
        break;
      case "details":
        setDraftDetails(value);
        break;
      case "orderState":
        setDraftOrderState(value as 'pendiente' | 'pagado');
        break;
    }
  };

  const handleLunchChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedLunches = Array.from(e.target.selectedOptions, option => {
      const lunch = lunches.find(l => l.id === option.value);
      return lunch ? lunch : null;
    }).filter((lunch): lunch is LunchType => lunch !== null);
    setDraftLunch(selectedLunches);
  };

  const handleTimeChange = (time: Date | null) => {
    if (time) {
      setDraftTime(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setDraftDate(date);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
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
            <label htmlFor="towerNum">Torre</label>
            <input type="text" id="towerNum" name="towerNum" value={draft.towerNum} onChange={handleInputChange} className="border p-2 rounded" />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="apto">Apto</label>
            <input type="number" id="apto" name="apto" value={draft.apto} onChange={handleInputChange} className="border p-2 rounded" />
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="customer">Cliente</label>
          <input type="text" id="customer" name="customer" value={draft.customer} onChange={handleInputChange} className="border p-2 rounded" />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="phoneNum">Teléfono</label>
          <input type="number" id="phoneNum" name="phoneNum" value={draft.phoneNum} onChange={handleInputChange} className="border p-2 rounded" />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="payMethod">Método de Pago</label>
          <select id="payMethod" name="payMethod" value={draft.payMethod.id} onChange={handleInputChange} className="border p-2 rounded">
            <option value="">-- Seleccione --</option>
            {payMethods.map(method => (
              <option key={method.id} value={method.id}>{method.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="lunch">Almuerzos</label>
          <select id="lunch" name="lunch" multiple value={draft.lunch.map(l => l.id)} onChange={handleLunchChange} className="border p-2 rounded h-32">
            {lunches.map(lunch => (
              <option key={lunch.id} value={lunch.id}>{lunch.title}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="details">Detalles</label>
          <textarea id="details" name="details" value={draft.details} onChange={handleInputChange} className="border p-2 rounded"></textarea>
        </div>

        <div className="flex items-center space-x-2">
          <input type="checkbox" id="useCurrentDateTime" checked={useCurrentDateTime} onChange={() => setUseCurrentDateTime(!useCurrentDateTime)} />
          <label htmlFor="useCurrentDateTime">Usar hora y fecha actual</label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="time">Hora</label>
            <DatePicker
              id="time"
              selected={draft.time ? new Date(`1970-01-01T${draft.time}`) : null}
              onChange={handleTimeChange}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              className="border p-2 rounded w-full"
              disabled={useCurrentDateTime}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="date">Fecha</label>
            <DatePicker
              id="date"
              selected={draft.date}
              onChange={handleDateChange}
              dateFormat="MMMM d, yyyy"
              className="border p-2 rounded w-full"
              disabled={useCurrentDateTime}
            />
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="orderState">Estado del Pedido</label>
          <select id="orderState" name="orderState" value={draft.orderState} onChange={handleInputChange} className="border p-2 rounded">
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
