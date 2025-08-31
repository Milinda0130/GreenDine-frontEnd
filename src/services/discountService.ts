export interface Discount {
  id: string;
  customerId: string;
  amount: number; // Percentage discount
  reason: string;
  earnedDate: Date;
  expiresDate: Date;
  isUsed: boolean;
  usedDate?: Date;
  orderId?: string;
}

class DiscountService {
  private discounts: Discount[] = [];

  async getCustomerDiscounts(customerId: string): Promise<Discount[]> {
    // In a real implementation, this would fetch from backend
    return this.discounts.filter(d => d.customerId === customerId && !d.isUsed);
  }

  async createDiscount(discountData: Omit<Discount, 'id' | 'earnedDate' | 'isUsed'>): Promise<Discount> {
    const discount: Discount = {
      ...discountData,
      id: `discount_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      earnedDate: new Date(),
      isUsed: false
    };

    this.discounts.push(discount);
    return discount;
  }

  async useDiscount(discountId: string, orderId: string): Promise<boolean> {
    const discount = this.discounts.find(d => d.id === discountId);
    if (discount && !discount.isUsed && new Date() < discount.expiresDate) {
      discount.isUsed = true;
      discount.usedDate = new Date();
      discount.orderId = orderId;
      return true;
    }
    return false;
  }

  async getAvailableDiscounts(customerId: string): Promise<Discount[]> {
    const now = new Date();
    return this.discounts.filter(d => 
      d.customerId === customerId && 
      !d.isUsed && 
      now < d.expiresDate
    );
  }

  calculateTotalDiscount(discounts: Discount[]): number {
    return discounts.reduce((total, discount) => total + discount.amount, 0);
  }
}

export const discountService = new DiscountService();
