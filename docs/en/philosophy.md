# Philosophy and Vision

## Data-First, Framework-Agnostic

`reactive` is built on the belief that **business logic belongs to the data**, not the UI components. In modern frontend development, we often leak complex validation, relationship management, and state logic into our React components or UI state managers like Zustand or Redux.

This library provides a dedicated **Data Intelligence Layer** that handles the "truth" of your application, while your favorite UI tools handle the "presentation".

### Why ReactiveModel?

1.  **Centralized Truth**: Validation (via Zod), default values, and computed properties are defined once in the model, not repeated across components.
2.  **Agnostic by Design**: It works seamlessly with React, Vue, Svelte, or even in Node.js environments. It doesn't compete with Zustand or Redux; it complements them by handling domain logic.
3.  **Predictable Reactivity**: Fine-grained events allow the UI to react only when specific properties change, preventing unnecessary re-renders.

---

## The AI Impact: Why AI Agents Love This Library

Artificial Intelligence agents (like Cursor, Copilot, or specialized coding agents) perform exponentially better when the codebase has **clear structure and explicit contracts**.

### 1. Self-Documenting Structure
When an AI reads a `ReactiveModel` or `Item`, it immediately understands:
-   Exactly what properties exist.
-   The validation rules (thanks to Zod).
-   The relationships between entities (nested properties).

### 2. Reduced Hallucination
AI agents often guess how to update state or where to find a specific logic. With `reactive`, the logic is encapsulated within the model. The AI doesn't need to "invent" a way to save a user; it simply calls `user.publish()`.

### 3. Clear Intent
Because the models emit specific events (e.g., `name.changed`), the AI can reason about the side effects of an action without having to trace complex UI state flows.

---

## Coexistence with State Managers (e.g., Zustand)

One of the biggest misconceptions is that you have to choose between a state manager and a reactive model. **You don't.**

-   **Zustand/Redux**: Use them for **UI State** (is the sidebar open? which tab is active? current search filter?).
-   **ReactiveModel**: Use it for **Domain Data** (is the product price valid? how many items are in the cart? saving the user profile).

**Pattern**: You can store a `ReactiveModel` instance inside a Zustand store. Zustand handles the global access, while the model handles the intelligence and consistency of the data.
