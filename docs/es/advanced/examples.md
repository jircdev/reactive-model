# Ejemplos Prácticos

Este documento contiene ejemplos prácticos de uso de **Items** y **Colecciones** en diferentes escenarios reales.

## 📋 Índice

- [Ejemplos de Items](#ejemplos-de-items)
  - [Crear un Item básico](#crear-un-item-básico)
  - [Item con Provider](#item-con-provider)
  - [Gestión de estados](#gestión-de-estados)
- [Ejemplos de Colecciones](#ejemplos-de-colecciones)
  - [Colección básica](#colección-básica)
  - [Filtros y búsqueda](#filtros-y-búsqueda)
  - [Paginación](#paginación)
- [Ejemplos Integrados](#ejemplos-integrados)
  - [Sistema de usuarios completo](#sistema-de-usuarios-completo)
  - [Gestión de productos](#gestión-de-productos)

---

## Ejemplos de Items

### Crear un Item básico

```typescript
import { Item } from '@beyond-js/reactive/entities/item';

interface IProduct {
  id: string;
  name: string;
  price: number;
  description?: string;
  stock: number;
}

export class Product extends Item<IProduct> {
  declare id: string;
  declare name: string;
  declare price: number;
  declare description?: string;
  declare stock: number;

  constructor(specs: Partial<IProduct> = {}) {
    super({
      entity: 'products',
      properties: ['id', 'name', 'price', 'description', 'stock'],
      ...specs,
    });
  }

  get isAvailable(): boolean {
    return this.stock > 0;
  }

  get formattedPrice(): string {
    return `$${this.price.toFixed(2)}`;
  }
}

// Uso
const product = new Product({
  id: '1',
  name: 'Laptop',
  price: 999.99,
  stock: 10
});

console.log(product.name); // "Laptop"
console.log(product.isAvailable); // true
console.log(product.formattedPrice); // "$999.99"
```

### Item con Provider

```typescript
import { Item, IEntityProvider } from '@beyond-js/reactive/entities/item';

class ProductProvider implements IEntityProvider {
  constructor(private parent: Product) {}

  async load(args?: { id?: string }): Promise<IProduct> {
    const id = args?.id || this.parent.id;
    const response = await fetch(`/api/products/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: No se pudo cargar el producto`);
    }
    
    return await response.json();
  }

  async publish(data: IProduct): Promise<{ status: number; data: IProduct }> {
    const method = data.id ? 'PUT' : 'POST';
    const url = data.id ? `/api/products/${data.id}` : '/api/products';
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al guardar producto');
    }
    
    const result = await response.json();
    return { status: 200, data: result };
  }

  async delete(id?: string | number): Promise<boolean> {
    const productId = id || this.parent.id;
    const response = await fetch(`/api/products/${productId}`, {
      method: 'DELETE',
    });
    
    return response.ok;
  }
}

export class Product extends Item<IProduct, ProductProvider> {
  declare id: string;
  declare name: string;
  declare price: number;
  declare stock: number;

  constructor(specs: Partial<IProduct> = {}) {
    super({
      entity: 'products',
      provider: ProductProvider,
      properties: ['id', 'name', 'price', 'stock'],
      ...specs,
    });
  }
}

// Uso
async function ejemplo() {
  const product = new Product({ id: '1' });
  await product.load();
  console.log(product.name); // Nombre cargado desde el servidor

  product.set({ price: 899.99, stock: 15 });
  await product.publish();

  const newProduct = new Product({
    name: 'Nuevo Producto',
    price: 199.99,
    stock: 5
  });
  await newProduct.publish();

  await product.delete();
}
```

---

## Ejemplos de Colecciones

### Colección básica

```typescript
import { Collection } from '@beyond-js/reactive/entities/collection';
import { Product } from './product';

class ProductsProvider {
  constructor(private parent: any) {}

  async list(args?: any): Promise<any[]> {
    const params = new URLSearchParams();
    if (args?.limit) params.append('limit', args.limit);
    if (args?.next) params.append('next', args.next);

    const response = await fetch(`/api/products?${params}`);
    const data = await response.json();
    
    return data.items || data;
  }
}

export class Products extends Collection<Product, ProductsProvider> {
  constructor() {
    super({
      entity: 'products',
      provider: ProductsProvider,
      item: Product,
      defaultLimit: 20,
    });
  }

  get availableProducts(): Product[] {
    return this.items.filter(p => p.stock > 0);
  }
}

// Uso
async function ejemplo() {
  const products = new Products();

  products.on('load', ({ items }) => {
    console.log(`Cargados ${items.length} productos`);
  });

  await products.load();
  console.log('Productos:', products.items);
  console.log('Disponibles:', products.availableProducts);
}
```

### Filtros y búsqueda

```typescript
import { Collection } from '@beyond-js/reactive/entities/collection';
import { User } from './user';

export class Users extends Collection<User> {
  constructor() {
    super({
      entity: 'users',
      item: User,
      defaultLimit: 50,
    });
  }

  async searchByName(name: string) {
    return await this.load({
      where: {
        name: { contains: name }
      },
      limit: 50
    });
  }

  async findActiveUsers() {
    return await this.load({
      where: {
        status: { equals: 'active' },
        verified: { equals: true }
      }
    });
  }
}

// Uso
async function ejemplo() {
  const users = new Users();

  await users.searchByName('Juan');
  console.log('Usuarios encontrados:', users.items);

  await users.findActiveUsers();
}
```

---

## Ejemplos Integrados

### Sistema de usuarios completo

```typescript
import { Item } from '@beyond-js/reactive/entities/item';
import { Collection } from '@beyond-js/reactive/entities/collection';
import { IEntityProvider } from '@beyond-js/reactive/entities/item';
import { ICollectionProvider } from '@beyond-js/reactive/entities/collection';

interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  status: 'active' | 'inactive' | 'banned';
}

class UserProvider implements IEntityProvider {
  constructor(private parent: User) {}

  async load(args?: { id?: string }): Promise<IUser> {
    const id = args?.id || this.parent.id;
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) throw new Error('Error al cargar usuario');
    return await response.json();
  }

  async publish(data: IUser): Promise<{ status: number; data: IUser }> {
    const method = data.id ? 'PUT' : 'POST';
    const url = data.id ? `/api/users/${data.id}` : '/api/users';
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al guardar usuario');
    }
    
    return { status: 200, data: await response.json() };
  }

  async delete(id?: string | number): Promise<boolean> {
    const userId = id || this.parent.id;
    const response = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
    return response.ok;
  }
}

class UsersProvider implements ICollectionProvider {
  constructor(private parent: any) {}

  async list(args?: any): Promise<{ items: IUser[], total: number, next?: any }> {
    const params = new URLSearchParams();
    if (args?.limit) params.append('limit', args.limit);
    if (args?.next) params.append('next', args.next);
    if (args?.where) params.append('filters', JSON.stringify(args.where));

    const response = await fetch(`/api/users?${params}`);
    if (!response.ok) throw new Error('Error al cargar usuarios');
    
    const data = await response.json();
    return {
      items: data.items || data,
      total: data.total || 0,
      next: data.next || null
    };
  }

  async deleteMany(ids: string[]): Promise<boolean> {
    const response = await fetch('/api/users/bulk-delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    return response.ok;
  }
}

export class User extends Item<IUser, UserProvider> {
  declare id: string;
  declare name: string;
  declare email: string;
  declare role: 'user' | 'admin' | 'moderator';
  declare status: 'active' | 'inactive' | 'banned';

  constructor(specs: Partial<IUser> = {}) {
    super({
      entity: 'users',
      provider: UserProvider,
      properties: ['id', 'name', 'email', 'role', 'status'],
      ...specs,
    });
  }

  get isAdmin(): boolean {
    return this.role === 'admin';
  }

  get isActive(): boolean {
    return this.status === 'active';
  }

  async activate() {
    this.set({ status: 'active' });
    await this.publish();
  }
}

export class Users extends Collection<User, UsersProvider> {
  constructor() {
    super({
      entity: 'users',
      provider: UsersProvider,
      item: User,
      defaultLimit: 50,
    });
  }

  get activeUsers(): User[] {
    return this.items.filter(u => u.isActive);
  }

  async loadActiveUsers() {
    return await this.load({
      where: {
        status: { equals: 'active' }
      }
    });
  }

  async searchUsers(query: string) {
    return await this.load({
      where: {
        OR: [
          { name: { contains: query } },
          { email: { contains: query } }
        ]
      }
    });
  }
}

// Uso
async function ejemploCompleto() {
  const users = new Users();

  await users.loadActiveUsers();
  console.log(`Usuarios activos: ${users.activeUsers.length}`);

  await users.searchUsers('juan');
  
  const user = users.map.get('user-123');
  if (user) {
    await user.activate();
    user.set({ name: 'Juan Pérez' });
    await user.publish();
  }
}
```

---

Estos ejemplos cubren los casos de uso más comunes. Puedes adaptarlos según tus necesidades específicas.

