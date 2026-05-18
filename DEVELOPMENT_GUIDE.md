# 🎓 Campus Notes - Quasar Framework Frontend

Welcome to the **Campus Notes** frontend application, fully powered by the **Quasar Framework** (Vue 3, Vite, and Sass)! 

This guide contains everything you need to know to run, develop, and build the application.

---

## 🚀 Getting Started

The frontend is located in the `frontend` folder. Follow these simple commands to start development.

### 1. Start the Development Server
To launch the hot-reloading development server:
```powershell
cd frontend
npm run dev
```
The application will be running at:
👉 **[http://localhost:9000/](http://localhost:9000/)**

> [!NOTE]
> The dev server automatically supports Hot Module Replacement (HMR). Any changes you make to Vue files will instantly reflect in the browser without losing application state!

---

## 📸 Verified Application Home
Here is the successfully running Quasar home page verified by our automated browser environment, featuring the new **Notice Board** and **Floating WhatsApp Buttons**:

![Quasar Dashboard](C:\Users\yvaji\.gemini\antigravity\brain\734d7c30-c07f-40bd-b9f9-985e8ef8fc15\new_dashboard_1779126024020.png)

## 📚 Notes Module Flow (Dynamic Routing)
We have implemented a nested routing flow for the **Notes Module**:
1. **Uploaders View (`/notes`)**: Displays dynamic cards for notes contributors. The array respects admin sorting (`order`) and highlights Top Contributors with tags.
2. **Subjects View (`/notes/:uploaderId`)**: Once a contributor is selected, their subjects are displayed in a beautifully animated Accordion (`q-expansion-item`).
3. **Downloads**: Expanding a subject reveals the individual notes with file-type icons and download buttons.

![Notes Subject View](C:\Users\yvaji\.gemini\antigravity\brain\734d7c30-c07f-40bd-b9f9-985e8ef8fc15\physics_notes_expanded_confirmed_1779124612483.png)

## ⚙️ Admin Portal & Backend
The application features a dedicated **Admin Portal** to manage the system. 
- **Access**: Click "Admin Portal" in the sidebar or navigate to `/admin/login`.
- **Default Credentials**: Username: `admin` | Password: `admin`
- **Dashboard Features**: Manage the Notice Board, Order Contributors, assign Custom Tags, and Configure Subjects.

![Admin Dashboard](C:\Users\yvaji\.gemini\antigravity\brain\734d7c30-c07f-40bd-b9f9-985e8ef8fc15\admin_dashboard_1779126948463.png)

### Laravel API Backend
A fresh **Laravel** installation has been scaffolded in the `backend/` directory. It uses a standard SQLite database. In the future, the Admin Dashboard can be directly connected to this Laravel API to persist notices, users, and subjects!

---

## 📁 Project Structure

Here are the key directories and files in your application:

```mermaid
graph TD
    Root[Campus notes/] --> Frontend[frontend/ (Quasar)]
    Root --> Backend[backend/ (Laravel)]
    Frontend --> SRC[src/]
    Frontend --> Config[quasar.config.js]
    SRC --> Layouts[layouts/]
    SRC --> Pages[pages/]
    Pages --> Admin[admin/]
    SRC --> Components[components/]
    SRC --> Router[router/]
    SRC --> CSS[css/]
```

| Folder / File | Description |
| :--- | :--- |
| `src/layouts/` | **Main Layouts**: Shells of your pages (e.g., headers, side drawers, footers). |
| `src/pages/` | **Pages**: The actual views of your application mapped to routes. |
| `src/components/` | **Reusable UI Components**: Smaller, self-contained widgets. |
| `src/router/` | **Routing Configuration**: Maps URLs to pages (`routes.js`). |
| `src/css/` | **Global Styles**: Global variables and custom styles (`app.scss`). |
| `quasar.config.js` | **Configuration**: Core configuration of Quasar plugins, build targets, and features. |

---

## 🛠️ Key Developer Commands

All of the following commands should be run inside the `frontend` directory:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the hot-reloading development server on port `9000`. |
| `npm run build` | Compiles and builds the production bundle in the `dist/` directory. |
| `npm run lint` | Runs ESLint to check for code issues. |
| `npm run format` | Auto-formats all code using Prettier. |

---

## 💡 How to Add a New Page

To add a new page (for example, `NotesPage.vue`):

1. **Create the Vue component** in `src/pages/NotesPage.vue`:
   ```html
   <template>
     <q-page class="flex flex-center">
       <h1>My Campus Notes</h1>
     </q-page>
   </template>
   
   <script setup>
   // Your page logic goes here
   </script>
   ```

2. **Register it in the router** in `src/router/routes.js`:
   ```javascript
   const routes = [
     {
       path: '/',
       component: () => import('layouts/MainLayout.vue'),
       children: [
         { path: '', component: () => import('pages/IndexPage.vue') },
         { path: 'notes', component: () => import('pages/NotesPage.vue') } // Add this line
       ]
     },
     // ...
   ]
   ```

3. **Navigate to the page** in your browser at `http://localhost:9000/#/notes`.

---

> [!TIP]
> **Why Quasar?**
> Quasar provides over 100 high-performance Material Design 3 Vue components out of the box (e.g., `q-btn`, `q-input`, `q-dialog`, `q-table`). You don't need to write custom CSS from scratch for standard elements! Check out the [Quasar Component Documentation](https://quasar.dev/vue-components) to see what's available.
