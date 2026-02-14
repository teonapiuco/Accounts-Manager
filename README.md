# Account Flow Manager

A high-performance, dark-themed dashboard built with **React** and **Node.js**. This application allows administrators to manage platform accounts with a focus on smooth user experience and clean aesthetics.

## Key Features

- **Full CRUD Life-cycle**: Seamlessly Create, Read, Update, and Delete accounts.
- **Dynamic UX**: 
  - **Typing Animation**: Interactive "Welcome Admin" header.
  - **Animated Statistics**: Real-time counter animations for account status summaries.
  - **Interactive UI**: Hover effects with expanding focal points and smooth panel transitions.
- **Advanced Form Control**: 
  - Custom searchable dropdown for platforms.
  - Inline status toggling (Active/Inactive).
  - Validation for emails and duplicate entries.
- **Data Integrity**: Persistence handled via local JSON storage on the Express backend.
- **Fully Responsive**: Optimized for everything from mobile devices to ultra-wide 2000px+ monitors.

## Tech Stack

- **Frontend**: React (Functional Components, Hooks: `useState`, `useEffect`, `useRef`)
- **Backend**: Node.js & Express
- **Styling**: Pure CSS3 with Keyframe Animations & Media Queries
- **Storage**: Local JSON Persistence (`fs` module)