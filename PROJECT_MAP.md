# QuickBite — Project Map (Plain-Language Guide)

This document explains what each folder is for and what the most important code files do.

It is written for readers with **no programming background**.

## How to read this

- A **folder** is like a drawer that groups related files.
- A **file** is like an instruction sheet the app follows.
- **Frontend** = what the user sees and clicks (the “website screens”).
- **Backend** = the “kitchen” behind the scenes (stores data, checks logins, saves orders).
- **Admin** = the staff dashboard (manage menu and orders).

## Mini glossary (simple definitions)

- **Database**: where the app stores information permanently (menu items, users, orders).
- **API**: the set of “requests” the Frontend/Admin sends to the Backend (example: “give me the menu list”).
- **Route / Endpoint**: a specific “address” on the backend (example: `/api/food/list`).
- **Token**: a “proof of login” string used to confirm a user is logged in.
- **Upload**: sending a file (like an image) from the browser to the server.
- **Controller**: the part of the backend that decides what to do when a request comes in.
- **Model**: the definition of what is stored in the database (example: what an “Order” contains).

---

## Repository layout (top-level)

- **`Backend/`**
  - The server (“kitchen”) that stores data and processes actions.
  - Examples of actions: login, load menu items, add/remove cart items, place orders.
  - Also stores and serves uploaded food images.

- **`Frontend/`**
  - The student/user website (what customers interact with).
  - Shows the menu, cart, checkout, and order details.
  - Also includes staff-only pages (protected by role).

- **`Admin/`**
  - The admin/staff dashboard website.
  - Used to add food items, remove items, and manage orders.

- **`Project_Screenshots/`**
  - Images used for README/demo.

- **`Quickbite_better/QuickBite/`**
  - A second copy/variant of the project (older or alternative snapshot).

---

# Backend (`Backend/`) — the “Kitchen” (server)

## Folder responsibilities

- **`Backend/config/`**
  - Setup code (connects the server to the database).

- **`Backend/controllers/`**
  - The “decision makers”: what to do when the app receives a request.

- **`Backend/middleware/`**
  - “Security checks” that run before certain actions (example: verify you are logged in).

- **`Backend/models/`**
  - The “data shapes” saved in the database (what fields a food item/order/user has).

- **`Backend/routes/`**
  - A list of server addresses (“endpoints”) and which controller handles them.

- **`Backend/uploads/`**
  - Where uploaded food images are stored.

- **`Backend/scripts/`**
  - Helper scripts for developers (example: add sample data).

## Key JS files

## `Backend/server.js`
- Starts the backend server.
- Connects to the database.
- Registers the main “addresses” the Frontend/Admin can call:
  - Food/menu, user login, cart, orders.
- Makes uploaded images available to the browser.

## `Backend/config/db.js`
- Connects the backend to your MongoDB database using the `.env` settings.

## `Backend/middleware/auth.js`
- Checks if a user is logged in.
- If the login token is missing/invalid, it blocks the action.

## Models (`Backend/models/`)

## `Backend/models/foodModel.js`
- Defines what a “Food Item” looks like in the database:
  - name, description, price, category, and image filename.

## `Backend/models/userModel.js`
- Defines what a “User” looks like in the database.
- Stores the cart as a simple list of quantities.

## `Backend/models/orderModel.js`
- Defines what an “Order” looks like in the database:
  - who ordered, which items, total amount, pickup/delivery details, and status.

## Routes + Controllers

## `Backend/routes/userRoute.js`
- Auth endpoints:
  - `POST /api/user/register`
  - `POST /api/user/login`

## `Backend/controllers/userController.js`
- Implements register/login:
  - `registerUser`: validates email/password, hashes password, creates user, returns JWT.
  - `loginUser`: validates credentials, returns JWT.

## `Backend/routes/foodRoute.js`
- The backend addresses for menu items:
  - **Add food** (includes uploading an image)
  - **List food** (load the menu)
  - **Remove food**

## `Backend/controllers/foodController.js`
- Implements what happens when staff/admin add/remove food items.
- Also handles deleting image files when a food item is removed.

## `Backend/routes/cartRoute.js`
- Backend addresses for cart actions (must be logged in):
  - add to cart
  - remove from cart
  - load cart

## `Backend/controllers/cartController.js`
- Saves and updates the user’s cart in the database.
- Supports adding a specific quantity (example: add 3 items at once).

## `Backend/routes/orderRoute.js`
- Backend addresses for orders:
  - place an order
  - load a user’s orders
  - list all orders (admin view)
  - update order status

## `Backend/controllers/orderController.js`
- Creates orders and stores them in the database.
- Clears the cart after the order is placed.
- Lets staff/admin change the order status.

## `Backend/scripts/seedMenu.js`
- Utility script intended to seed menu data (run manually).

---

# Frontend (`Frontend/`) — Student Website (and staff-only pages)

## Folder responsibilities

- **`Frontend/src/Pages/`**
  - Route-level pages (Menu/Home, Cart, Orders, Auth, Staff pages).

- **`Frontend/src/components/`**
  - Reusable UI components (cards, navbar, modals, receipt, etc.).

- **`Frontend/src/context/`**
  - Global state container (`StoreContext`).

- **`Frontend/src/assets/`**
  - Static assets and the `assets.js` mapping.

## Entry files

## `Frontend/src/main.jsx`
- React entry point.
- Mounts the app (with router).

## `Frontend/src/App.jsx`
- Defines what “page” appears for each URL.
- Blocks pages if you are not logged in, or if you are not the right role.

## `Frontend/src/context/StoreContext.jsx`
- “Shared memory” used across many pages.
- Keeps the menu list, cart quantities, and login token in one place.

## Pages (`Frontend/src/Pages/`)

## `Home/Home.jsx`
- Student menu container page.
- Renders the menu list via `FoodDisplay`.

## `Cart/Cart.jsx`
- Student cart page.
- Builds receipt/summary and places orders.
- Calls `POST /api/order/place`.
- Navigates to `/orders?orderId=...` on success.

## `Orders/MyOrders.jsx`
- Shows your previous orders.
- If the URL contains an order ID, it shows the details of that specific order.

## `Auth/Auth.jsx`
- Handles login/register UI.

## `RoleSelect/RoleSelect.jsx`
- Role selection screen (student vs staff) before auth routing.

## `Verify/Verify.jsx`
- Payment verification screen.
- Calls `POST /api/order/verify` then navigates to `/orders?orderId=...`.

## `PlaceOrder/PlaceOrder.jsx`
- Alternate order placement form flow.
- Posts to `/api/order/place` then navigates to `/orders?orderId=...`.

## `StaffOrders/StaffOrders.jsx`
- Staff view for listing/updating orders.

## `StaffAddFood/StaffAddFood.jsx`
- Staff UI for adding menu items.
- Uploads images via `/api/food/add`.
- Lists menu items and supports deletion via `/api/food/remove`.

## Components (`Frontend/src/components/`)

## `foodDisplay/FoodDisplay.jsx`
- Displays the menu grid.
- Renders `FoodItem` for each item.

## `FoodItem/FoodItem.jsx`
- Menu card UI.
- Implements add-to-cart flow with **quantity modal** and Confirm.

## `Navbar/Navbar.jsx`
- Navigation bar and logout.

## `Footer/Footer.jsx`
- Footer.

## `Header/Header.jsx`
- Header/hero section (if used by the page).

## `Modal/Modal.jsx`
- Generic modal overlay component.

## `Receipt/Receipt.jsx`
- Receipt UI used in checkout/preview.

## `assets/assets.js`
- Central asset mapping for icons and images.

---

# Admin (`Admin/`) — Staff/Admin Dashboard Website

## Folder responsibilities

- **`Admin/src/pages/`**
  - Add/List menu items; manage orders.

- **`Admin/src/components/`**
  - Admin layout components: navbar + sidebar.

- **`Admin/src/assets/`**
  - Admin icon/image mapping.

## Entry files

## `Admin/src/main.jsx`
- React entrypoint, mounts Admin app within router.

## `Admin/src/App.jsx`
- Defines the admin dashboard pages:
  - Add food
  - List food
  - Orders

## `Admin/src/index.css`
- Global styling for admin app.

## Pages

## `Admin/src/pages/Add/Add.jsx`
- Adds food item with image.
- Sends multipart FormData to `POST /api/food/add`.

## `Admin/src/pages/List/List.jsx`
- Lists foods and supports deletion.

## `Admin/src/pages/Orders/Orders.jsx`
- Lists orders and supports status updates.

## Components

## `Admin/src/components/Nabar/Navbar.jsx`
- Admin navbar.

## `Admin/src/components/Sidebar/Sidebar.jsx`
- Admin sidebar navigation.

## `Admin/src/assets/assets.js`
- Admin assets map.

---

# What happens when you use the app (simple flow)

- **Viewing the menu**
  - The website asks the server for the menu list.
  - Food images are loaded from the server’s image folder.

- **Logging in**
  - You enter your credentials.
  - The server returns a “token” (proof you are logged in).
  - The website sends that token whenever it needs to do a protected action.

- **Cart**
  - The website keeps track of what you added.
  - If you are logged in, it also saves your cart on the server.

- **Placing an order**
  - The website sends your cart to the server.
  - The server creates an order and returns an order ID.
  - The app can then show the order details screen.
