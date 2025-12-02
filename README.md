

# User Management Dashboard

A React + TypeScript dashboard for managing user records imported from a CSV file. The application includes search, filtering, sorting, pagination, editing, exporting, and local persistence.

---

## Installation

```bash
npm install
npm run dev
```

Then open:

```
http://localhost:5173
```

The initial CSV dataset is located in:

```
public/data/mock_data.csv
```

---

## Usage

Once the application is running, user data is automatically loaded from the CSV file on first use. The UI allows:

* Creating new users
* Editing existing records
* Deleting single or multiple users
* Searching by name, email, gender, or IP
* Sorting by column
* Filtering by gender
* Paginating large datasets
* Exporting the modified dataset to CSV or JSON
* Switching between light and dark theme

All changes persist automatically using local storage.

To reset the data back to the original CSV version, clear the stored state:

```js
localStorage.removeItem('user-dashboard-store')
```

---

## Tech Stack

This project uses:

* React 18
* TypeScript
* Zustand for state management and persistence
* Tailwind CSS
* Framer Motion
* Recharts
* Papaparse
* Vite

---

## Project Structure

```
src/
  components/      UI elements
  store/           Zustand store
  utils/           CSV parser and helpers
  context/         Theme + toast providers
  types.ts         Shared TypeScript definitions
```

---

## Available Scripts

```bash
npm run dev       # start development server
npm run build     # create production build
npm run preview   # preview production build
```

---

## Contributing

Pull requests are welcome.
If suggesting feature changes, please open an issue before submitting a PR.

---

## Approach & Architecture

The project was built with a modular component structure to keep logic, UI, and state responsibilities separated and maintainable. Zustand was chosen for global state management due to its simplicity, persistence support, and minimal boilerplate compared to alternatives like Redux.

CSV data is loaded once at startup, parsed using PapaParse, and then stored in localStorage so changes persist across reloads. The UI is composed of reusable components such as a modal, toast notifications, pagination controls, filter toolbar, and a debounced search input for smoother performance and a better user experience.

---

## Challenges & Solutions

### 🔹 CSV Loading & Persistence

Instead of reloading the CSV file on every refresh, the application detects the first load and stores the parsed user list using Zustand persistence. This allows CRUD operations to behave like a real app with retained data, while still providing a reset mechanism when needed.

### 🔹 Search & Filtering Performance

To prevent excessive re-rendering during typing, the search functionality uses a 300 ms debounced input hook. This ensures responsive filtering behavior, especially with larger datasets.

### 🔹 Consistent UI/UX

Tailwind CSS and CSS custom properties were used to build a lightweight design system with consistent spacing, typography, and color tokens. Dark/light theme support, micro-animations, skeleton loading states, and hover feedback were added to enhance usability and create a polished experience.

---
