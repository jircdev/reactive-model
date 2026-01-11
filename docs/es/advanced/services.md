# Services

**Services** son clases sin estado que orquestan operaciones a través de múltiples entidades. Encapsulan lógica de negocio que no pertenece a ningún Item o Collection individual.

## Cuándo Usar Services

Usa Services **solamente** cuando necesites:

1. **Orquestar múltiples entidades** - Operaciones que crean, actualizan o coordinan múltiples entidades relacionadas
2. **Flujos de trabajo complejos** - Procesos de múltiples pasos con dependencias entre ellos
3. **Lógica entre entidades** - Reglas de negocio que abarcan múltiples tipos de entidades
4. **Integraciones externas** - Coordinación con sistemas externos

## Cuándo NO Usar Services

**No uses Services** para:

1. **Lógica de una sola entidad** - Ponla en la clase Item
2. **Acceso a datos** - Para eso están los Providers
3. **Estado de UI** - Usa stores (Zustand, etc.)
4. **CRUD simple** - Los Items y Collections manejan esto

## Estructura Básica de Service

```typescript
// order.service.ts
import { Order } from './order/item';
import { OrderItems } from './order-item/collection';
import { Payment } from './payment/item';

export class OrderService {
  /**
   * Crea una orden con items y procesa el pago.
   * Esto involucra múltiples entidades: Order, OrderItems, Payment
   */
  static async createOrder(
    user: User,
    cartItems: Array<{ productId: string; quantity: number; price: number }>,
    paymentMethod: string
  ): Promise<Order> {
    // 1. Crear la orden
    const order = new Order({
      userId: user.id,
      status: 'pending',
      total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    });
    await order.publish();

    // 2. Crear items de la orden
    for (const item of cartItems) {
      const orderItem = new OrderItem({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      });
      await orderItem.publish();
    }

    // 3. Procesar pago
    const payment = new Payment({
      orderId: order.id,
      amount: order.total,
      method: paymentMethod,
    });
    await payment.publish();

    return order;
  }
}
```

## Mejores Prácticas

1. **Mantén los Services sin estado** - Usa métodos estáticos
2. **Inyecta dependencias externas** - Para facilitar testing
3. **Maneja errores apropiadamente** - Retorna objetos de resultado o lanza errores significativos
4. **Usa transacciones cuando sea necesario** - Para operaciones atómicas

Para más detalles, consulta la [documentación en inglés](../en/services.md).
