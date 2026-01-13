# Nested Properties

**Nested properties** allow an `Item` or `ReactiveModel` to have other instances of `Item` or `Collection` as reactive properties. This is useful for modeling relationships between entities (such as a user with a profile, or a post with its comments).

## 🎯 What are Nested Properties?

A nested property is a property that, instead of being a primitive value (string, number, etc.), is another instance of `ReactiveModel`, `Item`, or `Collection`. This allows:

- Modeling complex relationships between entities.
- Maintaining reactivity in nested objects.
- Accessing methods and properties of nested objects directly.
- Managing the state of nested objects independently.

## 📦 Syntax

To define a nested property, you must use an object instead of a string in the `properties` array:

```typescript
properties: [
  'simpleProperty',
  {
    name: 'nestedProperty',
    value: ReactiveModelClass,
    properties: ['prop1', 'prop2'] // Properties of the nested object
  }
]
```

### Object Structure

```typescript
{
  name: keyof T,        // Property name
  value: class,         // Class that extends ReactiveModel, Item, or Collection
  properties?: any      // Nested object properties (optional)
}
```

## 🧩 Examples

### Item with another Item as a Property

```typescript
import { Item } from 'reactive/entities/item';

// Define the nested Item
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

// Main Item with Profile as a nested property
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

// Usage
const user = new User({
  id: '1',
  name: 'John',
  email: 'john@example.com',
  profile: {
    id: 'profile-1',
    bio: 'Developer',
    avatar: 'avatar.jpg'
  }
});

// Access nested property
console.log(user.profile.bio); // "Developer"

// Update nested property
user.profile.set({ bio: 'Senior Developer' });
console.log(user.profile.bio); // "Senior Developer"

// Changes propagate reactively
user.profile.on('change', () => {
  console.log('Profile changed');
});
```

### Item with a Collection as a Property

```typescript
import { Item } from 'reactive/entities/item';
import { Collection } from 'reactive/entities/collection';

// Comment item
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

// Main Item with Collection as a nested property
interface IPost {
  id: string;
  title: string;
  content: string;
  comments: Collection<Comment>;
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
          value: Collection,
        }
      ],
      ...specs,
    });

    // Configure the collection after initialization
    if (this.comments) {
      this.comments.item = Comment;
      this.comments.entity = 'comments';
    }
  }
}

// Usage
const post = new Post({
  id: 'post-1',
  title: 'My first post',
  content: 'Post content',
  comments: [
    { id: 'comment-1', content: 'Great post', author: 'John' },
    { id: 'comment-2', content: 'Very useful', author: 'Mary' }
  ]
});

// Access nested collection
console.log(post.comments.items.length); // 2

// Load more comments
await post.comments.load();

// Add a new comment manually
post.comments.addItems([
  new Comment({ id: 'comment-3', content: 'New comment', author: 'Peter' })
]);
```

## 🔄 Reactivity in Nested Properties

Nested properties maintain full reactivity. Changes in nested objects propagate correctly:

```typescript
// Listen to nested property changes
user.on('profile.changed', ({ value, previous }) => {
  console.log('Profile changed:', value);
});

// Listen to nested collection changes
post.on('comments.changed', ({ items }) => {
  console.log('Comments updated:', items);
});

// Changes in nested objects also trigger parent 'change' event
user.profile.set({ bio: 'New bio' });
// This triggers both 'profile.changed' and 'change' on the user model
```

## 📝 Methods and Properties

### `getProperties()` with Nested Properties

The `getProperties()` method automatically includes nested object properties:

```typescript
const properties = user.getProperties();
// Returns:
// {
//   id: '1',
//   name: 'John',
//   email: 'john@example.com',
//   profile: {
//     id: 'profile-1',
//     bio: 'Developer',
//     avatar: 'avatar.jpg'
//   }
// }
```

For collections, `getProperties()` returns an array of items instead of the collection instance.

### `set()` with Nested Properties

You can use `set()` to update nested properties:

```typescript
// Update nested property directly
user.set({
  profile: {
    bio: 'New bio',
    avatar: 'new-avatar.jpg'
  }
});

// For collections, you can pass an array of data
post.set({
  comments: [
    { id: 'comment-3', content: 'New comment', author: 'Peter' }
  ]
});
```

## ⚠️ Key Considerations

### 1. Collection Initialization

When using `Collection` as a nested property, you need to configure it after initialization (setting the `item` class and `entity` name).

### 2. Initial Values

You can pass initial values for nested properties directly in the constructor.

## 🎓 Best Practices

1.  **Define clear interfaces**: Use TypeScript interfaces for nested objects.
2.  **Reuse classes**: Create reusable Item and Collection classes for nested properties.
3.  **Configure Collections after init**: Remember that Collections need extra configuration.
4.  **Handle events appropriately**: Decide whether to listen on the child or parent object.
5.  **Use getProperties() for serialization**: It handles nested structures correctly.
6.  **Avoid circular references**: Don't create relationships that could lead to memory issues.
