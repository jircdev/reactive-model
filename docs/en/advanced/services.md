# Services

**Services** are stateless classes that orchestrate operations across multiple entities. They encapsulate business logic that doesn't belong to any single Item or Collection.

## When to Use Services

Use Services **only** when you need to:

1. **Orchestrate multiple entities** - Operations that create, update, or coordinate multiple related entities
2. **Complex workflows** - Multi-step processes with dependencies between steps
3. **Cross-entity logic** - Business rules that span multiple entity types
4. **External integrations** - Coordinating with external systems

## When NOT to Use Services

**Don't use Services** for:

1. **Single entity logic** - Put it in the Item class instead
2. **Data access** - That's what Providers are for
3. **UI state** - Use stores (Zustand, etc.)
4. **Simple CRUD** - Items and Collections handle this

## Service vs Item Logic

| Logic Type | Where it belongs | Example |
|------------|------------------|---------|
| Entity validation | Item | `user.isValid()` |
| Entity state | Item | `user.isAdmin`, `order.isPaid` |
| Entity actions | Item | `user.activate()`, `order.cancel()` |
| Multi-entity create | Service | Create order with items and payment |
| Workflow | Service | Checkout process |
| Batch operations | Service | Import users from CSV |

## Basic Service Structure

```typescript
// order.service.ts
import { Order } from './order/item';
import { OrderItems } from './order-item/collection';
import { Payment } from './payment/item';
import { User } from './user/item';

export class OrderService {
  /**
   * Creates an order with items and processes payment.
   * This involves multiple entities: Order, OrderItems, Payment
   */
  static async createOrder(
    user: User,
    cartItems: Array<{ productId: string; quantity: number; price: number }>,
    paymentMethod: string
  ): Promise<Order> {
    // 1. Create the order
    const order = new Order({
      userId: user.id,
      status: 'pending',
      total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    });
    await order.publish();

    // 2. Create order items
    for (const item of cartItems) {
      const orderItem = new OrderItem({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      });
      await orderItem.publish();
    }

    // 3. Process payment
    const payment = new Payment({
      orderId: order.id,
      amount: order.total,
      method: paymentMethod,
      status: 'pending',
    });
    await payment.publish();

    // 4. Attempt to charge
    try {
      await PaymentGateway.charge(payment);
      payment.set({ status: 'completed' });
      await payment.publish();

      order.set({ status: 'paid' });
      await order.publish();
    } catch (error) {
      payment.set({ status: 'failed' });
      await payment.publish();

      order.set({ status: 'payment_failed' });
      await order.publish();

      throw error;
    }

    return order;
  }

  /**
   * Cancels an order and refunds payment.
   */
  static async cancelOrder(orderId: string): Promise<void> {
    const order = new Order({ id: orderId });
    await order.load();

    if (order.status === 'shipped') {
      throw new Error('Cannot cancel shipped orders');
    }

    // Find and refund payment
    const payment = new Payment({ orderId });
    await payment.load();

    if (payment.status === 'completed') {
      await PaymentGateway.refund(payment);
      payment.set({ status: 'refunded' });
      await payment.publish();
    }

    // Cancel order
    order.set({ status: 'cancelled' });
    await order.publish();
  }
}
```

## Service Patterns

### Pattern 1: Factory Service

Creates entities with proper initialization:

```typescript
export class UserService {
  static async createWithProfile(userData: IUser, profileData: IProfile): Promise<User> {
    // Create user
    const user = new User(userData);
    await user.publish();

    // Create associated profile
    const profile = new Profile({
      ...profileData,
      userId: user.id,
    });
    await profile.publish();

    // Update user with profile reference
    user.set({ profileId: profile.id });
    await user.publish();

    return user;
  }
}
```

### Pattern 2: Workflow Service

Handles multi-step processes:

```typescript
export class CheckoutService {
  static async process(cart: Cart, shippingInfo: IShipping): Promise<Order> {
    // Step 1: Validate cart
    if (cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    // Step 2: Verify stock
    for (const item of cart.items) {
      const product = new Product({ id: item.productId });
      await product.load();
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
    }

    // Step 3: Create order
    const order = await OrderService.createOrder(cart.user, cart.items, shippingInfo);

    // Step 4: Update stock
    for (const item of cart.items) {
      const product = new Product({ id: item.productId });
      await product.load();
      product.set({ stock: product.stock - item.quantity });
      await product.publish();
    }

    // Step 5: Clear cart
    await cart.clear();

    // Step 6: Send notifications
    await NotificationService.sendOrderConfirmation(order);

    return order;
  }
}
```

### Pattern 3: Batch Service

Handles bulk operations:

```typescript
export class ImportService {
  static async importUsers(csvData: string): Promise<{ success: number; failed: number }> {
    const rows = parseCSV(csvData);
    let success = 0;
    let failed = 0;

    for (const row of rows) {
      try {
        const user = new User({
          name: row.name,
          email: row.email,
          role: row.role || 'user',
        });
        await user.publish();
        success++;
      } catch (error) {
        console.error(`Failed to import user ${row.email}:`, error);
        failed++;
      }
    }

    return { success, failed };
  }
}
```

### Pattern 4: Query Service

Complex queries across entities:

```typescript
export class ReportService {
  static async getOrderSummary(startDate: Date, endDate: Date): Promise<IOrderSummary> {
    const orders = new Orders();
    await orders.load({
      where: {
        createdAt: { gte: startDate.getTime(), lte: endDate.getTime() },
        status: { in: ['paid', 'shipped', 'delivered'] },
      },
    });

    return {
      totalOrders: orders.items.length,
      totalRevenue: orders.items.reduce((sum, order) => sum + order.total, 0),
      averageOrderValue: orders.items.length > 0
        ? orders.items.reduce((sum, order) => sum + order.total, 0) / orders.items.length
        : 0,
      ordersByStatus: this.groupByStatus(orders.items),
    };
  }

  private static groupByStatus(orders: Order[]): Record<string, number> {
    return orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
}
```

## Best Practices

### 1. Keep Services Stateless

```typescript
// ✅ Good: Stateless static methods
export class OrderService {
  static async createOrder(data: IOrderData): Promise<Order> {
    // ...
  }
}

// ❌ Bad: Stateful service
export class OrderService {
  private currentOrder: Order; // Don't store state
  
  async createOrder(data: IOrderData): Promise<Order> {
    this.currentOrder = new Order(data);
    // ...
  }
}
```

### 2. Use Dependency Injection for External Services

```typescript
// ✅ Good: Inject dependencies
export class OrderService {
  static async processPayment(
    order: Order,
    gateway: IPaymentGateway = new StripeGateway()
  ): Promise<Payment> {
    return gateway.charge(order.total);
  }
}

// Easy to test with mock
const mockGateway = { charge: jest.fn() };
await OrderService.processPayment(order, mockGateway);
```

### 3. Handle Errors Gracefully

```typescript
export class OrderService {
  static async createOrder(data: IOrderData): Promise<{ order?: Order; error?: string }> {
    try {
      const order = new Order(data);
      await order.publish();
      return { order };
    } catch (error) {
      console.error('Failed to create order:', error);
      return { error: error.message };
    }
  }
}
```

### 4. Use Transactions When Needed

```typescript
export class TransferService {
  static async transferFunds(
    fromAccount: Account,
    toAccount: Account,
    amount: number
  ): Promise<void> {
    // Use transactions for atomic operations
    fromAccount.transaction(() => {
      fromAccount.set({ balance: fromAccount.balance - amount });
    });

    toAccount.transaction(() => {
      toAccount.set({ balance: toAccount.balance + amount });
    });

    // Publish both
    await Promise.all([
      fromAccount.publish(),
      toAccount.publish(),
    ]);
  }
}
```

## Testing Services

```typescript
describe('OrderService', () => {
  it('should create order with items', async () => {
    const user = new User({ id: '1', name: 'Test User' });
    const items = [
      { productId: '1', quantity: 2, price: 10 },
      { productId: '2', quantity: 1, price: 20 },
    ];

    const order = await OrderService.createOrder(user, items, 'credit_card');

    expect(order.id).toBeDefined();
    expect(order.total).toBe(40);
    expect(order.status).toBe('paid');
  });

  it('should handle payment failure', async () => {
    // Mock payment gateway to fail
    jest.spyOn(PaymentGateway, 'charge').mockRejectedValue(new Error('Card declined'));

    await expect(
      OrderService.createOrder(user, items, 'credit_card')
    ).rejects.toThrow('Card declined');
  });
});
```

## Summary

| Aspect | Recommendation |
|--------|----------------|
| When to use | Multi-entity operations, workflows, batch operations |
| State | Stateless (use static methods) |
| Dependencies | Inject external services |
| Error handling | Return result objects or throw meaningful errors |
| Testing | Mock external dependencies |
