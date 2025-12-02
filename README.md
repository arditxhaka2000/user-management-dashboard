

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
