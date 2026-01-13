# Propiedades Anidadas

Las **propiedades anidadas** permiten que un `Item` o `ReactiveModel` tenga otras instancias de `Item` o `Collection` como propiedades reactivas. Esto es útil para modelar relaciones entre entidades (como un usuario con un perfil, o un post con sus comentarios).

## 🎯 ¿Qué son las Propiedades Anidadas?

Una propiedad anidada es una propiedad que en lugar de ser un valor primitivo (string, number, etc.), es otra instancia de `ReactiveModel`, `Item` o `Collection`. Esto permite:

- Modelar relaciones complejas entre entidades
- Mantener la reactividad en objetos anidados
- Acceder a métodos y propiedades de objetos anidados directamente
- Gestionar el estado de objetos anidados de forma independiente

## 📦 Sintaxis

Para definir una propiedad anidada, debes usar un objeto en lugar de un string en el array `properties`:

```typescript
properties: [
  'propiedadSimple',
  {
    name: 'propiedadAnidada',
    value: ClaseReactiveModel,
    properties: ['prop1', 'prop2'] // Propiedades del objeto anidado
  }
]
```

### Estructura del Objeto

```typescript
{
  name: keyof T,        // Nombre de la propiedad
  value: class,         // Clase que extiende ReactiveModel, Item o Collection
  properties?: any      // Propiedades del objeto anidado (opcional)
}
```

## 🧩 Ejemplos

### Item con otro Item como Propiedad

```typescript
import { Item } from 'reactive/entities/item';

// Definir el Item anidado
interface IProfile {
  id: string;
  bio: string;
  avatar?: string;
}

class Profile extends Item<IProfile> {
  declare id: string;
  declare bio: string;
  declare avatar?: string;

  constructor(specs: Partial<IProfile> = {}) {
    super({
      entity: 'profiles',
      properties: ['id', 'bio', 'avatar'],
      ...specs,
    });
  }
}

// Item principal con Profile como propiedad anidada
interface IUser {
  id: string;
  name: string;
  email: string;
  profile: Profile;
}

class User extends Item<IUser> {
  declare id: string;
  declare name: string;
  declare email: string;
  declare profile: Profile;

  constructor(specs: Partial<IUser> = {}) {
    super({
      entity: 'users',
      properties: [
        'id',
        'name',
        'email',
        {
          name: 'profile',
          value: Profile,
          properties: ['id', 'bio', 'avatar']
        }
      ],
      ...specs,
    });
  }
}

// Uso
const user = new User({
  id: '1',
  name: 'Juan',
  email: 'juan@example.com',
  profile: {
    id: 'profile-1',
    bio: 'Desarrollador',
    avatar: 'avatar.jpg'
  }
});

// Acceder a la propiedad anidada
console.log(user.profile.bio); // "Desarrollador"

// Modificar la propiedad anidada
user.profile.set({ bio: 'Desarrollador Senior' });
console.log(user.profile.bio); // "Desarrollador Senior"

// Los cambios se propagan reactivamente
user.profile.on('change', () => {
  console.log('El perfil cambió');
});
```

### Item con Collection como Propiedad

```typescript
import { Item } from 'reactive/entities/item';
import { Collection } from 'reactive/entities/collection';

// Item de comentarios
interface IComment {
  id: string;
  content: string;
  author: string;
}

class Comment extends Item<IComment> {
  declare id: string;
  declare content: string;
  declare author: string;

  constructor(specs: Partial<IComment> = {}) {
    super({
      entity: 'comments',
      properties: ['id', 'content', 'author'],
      ...specs,
    });
  }
}

// Item principal con Collection como propiedad anidada
interface IPost {
  id: string;
  title: string;
  content: string;
  comments: Collection<Comment>; // Collection como propiedad
}

class Post extends Item<IPost> {
  declare id: string;
  declare title: string;
  declare content: string;
  declare comments: Collection<Comment>;

  constructor(specs: Partial<IPost> = {}) {
    super({
      entity: 'posts',
      properties: [
        'id',
        'title',
        'content',
        {
          name: 'comments',
          value: Collection, // Collection como valor
        }
      ],
      ...specs,
    });

    // Configurar la colección después de la inicialización
    if (this.comments) {
      this.comments.item = Comment;
      this.comments.entity = 'comments';
    }
  }
}

// Uso
const post = new Post({
  id: 'post-1',
  title: 'Mi primer post',
  content: 'Contenido del post',
  comments: [
    { id: 'comment-1', content: 'Excelente post', author: 'Juan' },
    { id: 'comment-2', content: 'Muy útil', author: 'María' }
  ]
});

// Acceder a la colección anidada
console.log(post.comments.items.length); // 2

// Cargar más comentarios
await post.comments.load();

// Agregar un nuevo comentario
post.comments.addItems([
  new Comment({ id: 'comment-3', content: 'Nuevo comentario', author: 'Pedro' })
]);
```

## 🔄 Reactividad en Propiedades Anidadas

Las propiedades anidadas mantienen su reactividad completa. Los cambios en objetos anidados se propagan correctamente:

```typescript
// Escuchar cambios en propiedades anidadas
user.on('profile.changed', ({ value, previous }) => {
  console.log('Perfil cambió:', value);
});

// Escuchar cambios en la colección anidada
post.on('comments.changed', ({ items }) => {
  console.log('Comentarios actualizados:', items);
});

// Los cambios en objetos anidados también disparan el evento 'change' del padre
user.profile.set({ bio: 'Nueva bio' });
// Esto dispara tanto 'profile.changed' como 'change' en user
```

## 📝 Métodos y Propiedades

### getProperties() con Propiedades Anidadas

El método `getProperties()` incluye automáticamente las propiedades de objetos anidados:

```typescript
const properties = user.getProperties();
// Retorna:
// {
//   id: '1',
//   name: 'Juan',
//   email: 'juan@example.com',
//   profile: {
//     id: 'profile-1',
//     bio: 'Desarrollador',
//     avatar: 'avatar.jpg'
//   }
// }
```

Para colecciones, `getProperties()` retorna los items en lugar de la instancia de la colección:

```typescript
const properties = post.getProperties();
// Retorna:
// {
//   id: 'post-1',
//   title: 'Mi post',
//   comments: [
//     { id: 'comment-1', content: '...', author: '...' },
//     { id: 'comment-2', content: '...', author: '...' }
//   ]
// }
```

### set() con Propiedades Anidadas

Puedes usar `set()` para actualizar propiedades anidadas:

```typescript
// Actualizar propiedad anidada directamente
user.set({
  profile: {
    bio: 'Nueva bio',
    avatar: 'new-avatar.jpg'
  }
});

// Para colecciones, puedes pasar un array de datos
post.set({
  comments: [
    { id: 'comment-3', content: 'Nuevo comentario', author: 'Pedro' }
  ]
});
```

## ⚠️ Consideraciones Importantes

### 1. Inicialización de Collections

Cuando uses `Collection` como propiedad anidada, necesitas configurarla después de la inicialización:

```typescript
constructor(specs: Partial<IPost> = {}) {
  super({
    entity: 'posts',
    properties: [
      {
        name: 'comments',
        value: Collection,
      }
    ],
    ...specs,
  });

  // Configurar la colección
  if (this.comments) {
    this.comments.item = Comment;
    this.comments.entity = 'comments';
  }
}
```

### 2. Valores Iniciales

Puedes pasar valores iniciales para propiedades anidadas en el constructor:

```typescript
const user = new User({
  id: '1',
  name: 'Juan',
  profile: {
    id: 'profile-1',
    bio: 'Desarrollador'
  }
});
```

## 🎓 Mejores Prácticas

1. **Define interfaces claras**: Usa TypeScript para definir las interfaces de tus objetos anidados

2. **Reutiliza clases**: Crea clases reutilizables para Items y Collections que se usen como propiedades anidadas

3. **Configura Collections después de la inicialización**: Las Collections necesitan configuración adicional

4. **Maneja eventos apropiadamente**: Decide si escuchar eventos en el objeto anidado o en el padre

5. **Usa getProperties() para serialización**: El método `getProperties()` maneja correctamente las propiedades anidadas

6. **Evita referencias circulares**: No crees relaciones circulares que puedan causar problemas de memoria

---

Esta documentación te ayudará a trabajar con propiedades anidadas de forma efectiva en tus modelos reactivos.

