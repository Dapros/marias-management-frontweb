import type { LunchType, OrderType } from '../types'

const API_URL = import.meta.env.VITE_API_BASE_URL
const API_BASE_URL = `${API_URL}/api`

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API Error on ${endpoint}:`, error)
      throw error
    }
  }

  // Lunch endpoints
  async getLunches(): Promise<LunchType[]> {
    return this.request<LunchType[]>('/lunches')
  }

  async createLunch(lunch: Omit<LunchType, 'id'>): Promise<{ ok: boolean; lunch: LunchType }> {
    console.log('Creating lunch:', {
      title: lunch.title,
      price: lunch.price,
      hasImage: !!lunch.imagen,
      imageType: lunch.imagen ? lunch.imagen.substring(0, 50) + '...' : 'none'
    })
    
    return this.request<{ ok: boolean; lunch: LunchType }>('/lunches', {
      method: 'POST',
      body: JSON.stringify(lunch),
    })
  }

  async updateLunch(id: string, lunch: Partial<LunchType>): Promise<{ ok: boolean; updated: LunchType }> {
    return this.request<{ ok: boolean; updated: LunchType }>(`/lunches/${id}`, {
      method: 'PUT',
      body: JSON.stringify(lunch),
    })
  }

  async deleteLunch(id: string): Promise<{ ok: boolean }> {
    return this.request<{ ok: boolean }>(`/lunches/${id}`, {
      method: 'DELETE',
    })
  }

  // Orders endpoints
  async getOrders(): Promise<OrderType[]> {
    return this.request<OrderType[]>('/orders')
  }

  async createOrder(order: Omit<OrderType, 'id'>): Promise<{ ok: boolean; order: OrderType }> {
    console.log('Creating Order:', {
      towerNum: order.towerNum,
      apto: order.apto,
      customer: order.customer,
      phoneNum: order.phoneNum,
      payMethod: order.payMethod,
      lunch: order.lunch,
      details: order.details,
      time: order.time,
      date: order.date,
      orderState: order.orderState,
    })

    return this.request<{ ok: boolean; order: OrderType }>('/orders', {
      method: 'POST',
      body: JSON.stringify(order)
    })
  }

  async updateOrder(id: string, order: Partial<OrderType>): Promise<{ ok: boolean; updated: OrderType }> {
    return this.request<{ ok: boolean; updated: OrderType }>(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(order),
    })
  }

  async deleteOrder(id: string): Promise<{ ok: boolean }> {
    return this.request<{ ok: boolean }>(`/orders/${id}`, {
      method: 'DELETE',
    })
  }
}

export const apiService = new ApiService()
