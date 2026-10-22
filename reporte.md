# Frontend Project Report — Fragrance E-Commerce Platform

## 1. Project Overview

This project is a modern, responsive **fragrance e-commerce platform** built as a
single-page-experience web application. It is organized into two independent but
connected modules:

- **User Dashboard** — the customer-facing storefront where shoppers discover,
  compare, purchase, track, and review perfumes and scented products.
- **Admin Dashboard** — the internal back-office where administrators manage the
  catalog, inventory, customers, orders, payments, deliveries, promotions, and
  analytics.

### Technology Stack

The application is a **Next.js 16 (App Router)** frontend written in **TypeScript**
and styled with **Tailwind CSS** and a Radix-based UI component library.

| Concern                | Technology                                                                            | Role                                                          |
| ---------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Framework / routing    | Next.js 16 App Router with route groups (`(user)`, `(admin)`, `(auth)`, `(delivery)`) | Page structure, layouts, and access boundaries                |
| Language               | TypeScript                                                                            | Type-safe domain models (`Product`, `Order`, `Payment`, etc.) |
| Global client state    | Redux Toolkit + `redux-persist`                                                       | Cart, authenticated session, UI preferences                   |
| Server state / caching | TanStack React Query                                                                  | Fetching, caching, and revalidation of catalog/orders         |
| HTTP layer             | Axios `apiClient` with a pluggable **mock adapter**                                   | Single contract for mock data today, real backend later       |
| Forms & validation     | React Hook Form + **Zod** schemas                                                     | Field-level and cross-field validation                        |
| Auth utilities         | Session cookie + middleware, OTP via EmailJS                                          | Route protection and verification flows                       |
| Charts                 | Recharts                                                                              | Sales and revenue visualizations                              |

A key architectural decision is the **service layer with a mock adapter**
(`src/services/api/mockAdapter.ts`). Every network call goes through a shared
`apiClient`; when `NEXT_PUBLIC_USE_MOCK` is enabled, requests are resolved by
in-memory mock handlers registered against a fixed endpoint contract
(`src/services/api/endpoints.ts`). This means the "database actions" described in
this report are today served by mock registries and seed JSON data, but the
front-end contract is identical to what a real REST backend would expose — the
system can be pointed at a live API by flipping a single environment flag with **no
component changes**.

## 2. Objective

The objective of the platform is to deliver a complete, production-grade fragrance
retail experience that:

1. Lets customers **discover** fragrances through curated recommendations,
   category browsing, search, and rich multi-attribute filtering specific to
   perfumery (scent family, concentration, notes, bottle size).
2. Supports informed buying decisions through **detailed scent profiles** (top /
   middle / base notes, concentration, longevity) and **side-by-side fragrance
   comparison**.
3. Provides a frictionless **cart, checkout, and payment** journey, including
   local **Bakong KHQR** payment for the Cambodian market.
4. Keeps customers engaged after purchase through **order tracking, cancellation,
   promotions, and perfume-specific reviews** (longevity, sillage, scent
   accuracy).
5. Gives administrators full operational control over **catalog, inventory,
   customers, orders, payments, deliveries, promotions, content, and analytics**.
6. Maintains a **clean separation between UI, state, and data access** so the mock
   backend can be replaced by a real API without rework.

## 3. Project Scope

The scope below is grouped by module. Every listed feature is documented in detail
in **Section 4 – System Workflow**.

### 3.1 User Dashboard

| Group                | Feature                 | Description                                                    |
| -------------------- | ----------------------- | -------------------------------------------------------------- |
| Account & Identity   | User registration       | Create a customer account with validated credentials           |
| Account & Identity   | Login                   | Authenticate and establish a session                           |
| Account & Identity   | View / update profile   | Read and edit personal details, email, and password            |
| Discovery & Browsing | Home recommendations    | Best-selling / trending fragrance highlights and banners       |
| Discovery & Browsing | Browse by category      | Women's, Men's, Unisex, Gift Sets, Body Mists                  |
| Discovery & Browsing | Search & filter         | Keyword search plus core filters                               |
| Discovery & Browsing | Advanced filter         | Price range, brand, scent family, concentration, bottle size   |
| Discovery & Browsing | Product details         | Scent profile: top/middle/base notes, concentration, longevity |
| Discovery & Browsing | Fragrance comparison    | Side-by-side comparison of multiple products                   |
| Cart & Checkout      | Add / remove cart items | Manage cart line items and quantities                          |
| Cart & Checkout      | Bakong KHQR payment     | Generate and confirm a KHQR payment                            |
| Cart & Checkout      | Checkout & place order  | Convert a cart into a confirmed order                          |
| Orders & Engagement  | Order history           | List and inspect past orders                                   |
| Orders & Engagement  | Delivery tracking       | Timeline of order/delivery status events                       |
| Orders & Engagement  | Cancel order            | Cancel an eligible order                                       |
| Orders & Engagement  | Promotions / discounts  | Apply coupons and see promotional pricing                      |
| Orders & Engagement  | Reviews & ratings       | Rate longevity, sillage, and scent accuracy                    |

### 3.2 Admin Dashboard

| Feature                       | Description                                                 |
| ----------------------------- | ----------------------------------------------------------- |
| Admin login                   | Authenticate an administrator with elevated access          |
| Manage product categories     | Create, edit, delete fragrance categories                   |
| Manage products               | Add / edit / delete products with full scent profiles       |
| Manage stock per variant      | Track inventory per bottle size / variant                   |
| Manage customer accounts      | View, edit, suspend, or delete customer accounts            |
| Manage orders                 | View orders and update order status                         |
| Manage payments               | Review and reconcile payment records                        |
| Manage delivery information   | Assign and update delivery details                          |
| Sales reports                 | Revenue and volume reports by brand, scent family, category |
| Dashboard statistics          | Aggregate totals: orders, customers, revenue                |
| Coupon & promotion management | Create and manage discount campaigns                        |
| User activity logs            | Audit trail of user and admin actions                       |
| Banner / slider management    | Manage homepage banners and sliders                         |

## 4. System Workflow

Each subsection describes what the system does **internally** when the action is
performed — validation, data-access, state updates, the returned response, and
edge cases. In the current build these data operations are served by the mock
service registries; the described contract mirrors the intended real backend.

### 4.1 User Dashboard

#### 4.1.1 User Registration

1. **Input capture & validation.** The registration form is validated on the
   client by a Zod schema (`registerSchema`): full name ≥ 2 characters, a
   syntactically valid and required email, an optional phone, a password of ≥ 8
   characters containing at least one letter and one number, a matching
   `confirmPassword`, and an accepted terms/privacy checkbox. Cross-field rules
   (password confirmation) fail with a message attached to the specific field.
2. **Submission.** On a valid form, `authService.register()` issues
   `POST /auth/register` through `apiClient`.
3. **Server-side logic.** The handler checks whether the email **already exists**.
   If it does, it returns `409 Conflict` ("email already registered"). Otherwise it
   creates a new user record (hashed password on a real backend), assigns the
   `customer` role, and returns the created user plus a session token.
4. **State update.** On success the auth slice stores the user and token; the
   session cookie is set so route middleware treats the user as authenticated.
   React Query caches the `me` profile.
5. **Result.** The user is redirected to the storefront (or an OTP verification
   step, if enabled) and a success toast is shown.
6. **Edge cases.** Duplicate email → inline error; network failure → non-blocking
   error toast with retry; validation failure → the request is never sent.

#### 4.1.2 Login

1. **Validation.** `loginSchema` requires a valid email and a non-empty password.
2. **Submission.** `authService.login()` calls `POST /auth/login`.
3. **Server-side logic.** The handler looks up the user by email and verifies the
   password. Invalid credentials return `401 Unauthorized` with a generic
   "invalid email or password" message (no account-existence disclosure).
4. **State update.** On success the token + user are persisted to the auth slice
   and the session cookie; `redux-persist` rehydrates this on reload so the user
   stays logged in.
5. **Result.** Redirect to the intended page (or home); the header switches to the
   authenticated state (profile menu, cart badge).
6. **Edge cases.** Wrong credentials → inline error; suspended account → `403`
   with a "contact support" message; already-authenticated users hitting `/login`
   are redirected away by middleware.

#### 4.1.3 View / Update Profile

1. **Read.** The profile page calls `GET /auth/me`; React Query returns the
   cached user or fetches it. Middleware guards the `(user)` route group so
   unauthenticated access is redirected to `/login` (or the `401` page).
2. **Update — profile fields.** `profileSchema` validates name (≥ 2 chars) and
   optional phone/address; `PATCH /auth/profile` persists the change and returns
   the updated user, which replaces the cached profile.
3. **Update — email (sensitive).** Changing email requires OTP: the system
   generates a 6-digit code (`POST /auth/otp/generate`, delivered via EmailJS),
   the user submits new email + code (`emailChangeSchema`, code length exactly 6),
   and `PATCH /auth/email` verifies the code before committing. An invalid/expired
   code returns an error and the email is unchanged.
4. **Update — password (sensitive).** `passwordChangeSchema` requires the current
   password, a strong new password, a matching confirmation, and a valid OTP.
   `PATCH /auth/password` verifies the current password and OTP before updating.
5. **Result.** A success toast; the UI reflects updated values immediately from
   the refreshed cache.
6. **Edge cases.** Expired OTP → regenerate; wrong current password → `401`;
   optimistic UI is rolled back if the request fails.

#### 4.1.4 Home Page — Best-Selling / Trending Recommendations

1. **Data fetch.** The home page requests featured content: banners
   (`GET /banners`) plus product collections filtered/sorted server-side —
   e.g. best sellers (`sort=best_selling`), new arrivals, and trending items.
2. **Selection logic.** Best sellers are ranked by `soldCount`; trending is
   derived from recent sales/rating; the mock registry returns a bounded,
   pre-sorted slice so the home page renders a fixed number of cards.
3. **Rendering.** Results are cached by React Query and rendered as product
   cards and a rotating banner/slider.
4. **Edge cases.** Empty collections render a friendly empty state; a fetch
   failure shows a `NetworkError` component with retry rather than a blank page.

#### 4.1.5 Browse by Category (Women's, Men's, Unisex, Gift Sets, Body Mists)

1. **Navigation.** Selecting a category routes to the products page with a
   `category` query param.
2. **Data fetch.** `productService.list()` calls `GET /products?category=...`
   with pagination; the handler filters the dataset by category slug and applies
   the active sort.
3. **Response.** A paginated payload (items + total + page metadata) drives the
   grid and pagination controls; the category and product counts are shown.
4. **Edge cases.** An unknown category slug returns an empty result set and the
   empty state; pagination beyond the last page clamps to the final page.

#### 4.1.6 Search & Filter

1. **Input.** The search box is **debounced** (via `useDebounce`) so a request is
   issued only after the user pauses typing, preventing request floods.
2. **Data fetch.** `GET /products/search?search=...` (or the list endpoint with a
   `search` filter) matches the term against product name, brand, and notes.
3. **Combined filtering.** Core filters (category, in-stock, sort) are merged into
   the same query object so search + filter + sort resolve in one request.
4. **State.** Active filters are reflected in the URL/query so results are
   shareable and survive refresh; React Query keys on the full query object.
5. **Edge cases.** No matches → empty state with a "clear filters" affordance;
   rapid typing is coalesced by the debounce.

#### 4.1.7 Advanced Filter (Price, Brand, Scent Family, Concentration, Bottle Size)

1. **Filter model.** The advanced panel builds a typed filter object:
   `minPrice`/`maxPrice` (range slider), one or more `brands`, `scentFamily`
   (e.g. floral, woody, oriental, fresh), `concentration` (EDT, EDP, Parfum), and
   `bottleSize` variants.
2. **Query construction.** All selections are serialized into query params and
   sent in a single `GET /products/filter` (or list) request; array filters are
   applied as inclusive OR within a facet and AND across facets.
3. **Server-side logic.** The handler narrows the dataset facet-by-facet, then
   applies the chosen sort (newest, price asc/desc, best selling, highest rating)
   and pagination.
4. **Response & UI.** The grid updates with a result count; selected filters are
   shown as removable chips; clearing a chip re-issues the query.
5. **Edge cases.** Contradictory ranges (min > max) are normalized/validated
   before sending; a filter combination with zero matches shows the empty state
   without losing the selected filters.

#### 4.1.8 Product Details (Scent Profile)

1. **Fetch.** The detail page calls `GET /products/:id`; the handler returns the
   full product including the **scent profile**: top / middle / base notes,
   **concentration**, and **longevity**, plus brand, price, images, stock, rating,
   and review summary.
2. **Rendering.** Notes are grouped by pyramid layer; concentration and longevity
   are shown as labeled attributes; the gallery, price (with any promotional
   `originalPrice`), and stock/availability are displayed.
3. **Related actions.** Add-to-cart quantity is bounded by available stock; a
   "compare" toggle adds the product to the comparison set; the reviews section is
   lazy-loaded via `GET /products/:id/reviews`.
4. **Edge cases.** An unknown id returns `404` and renders the not-found page; an
   out-of-stock product disables add-to-cart while keeping the page viewable.

#### 4.1.9 Fragrance Comparison

1. **Selection.** The user marks 2–N products for comparison; the selected ids are
   held in client state and reflected in the compare tray.
2. **Fetch.** `GET /products/compare?ids=...` returns the full attribute set for
   each selected product.
3. **Normalization.** The system builds a unified attribute matrix (price, brand,
   scent family, concentration, longevity, sillage, notes, bottle sizes) so every
   row aligns across columns even when a product lacks an attribute (rendered as
   "—").
4. **Result.** A responsive comparison table/grid highlights differences; the user
   can remove a column or add another product up to a sensible maximum.
5. **Edge cases.** Fewer than two selections disables the compare view; exceeding
   the max prevents further additions with a hint.

#### 4.1.10 Add / Remove Cart Items

1. **Add.** Adding an item dispatches to the cart slice and calls
   `POST /cart/items` with product id, variant/bottle size, and quantity. The
   handler validates the quantity against stock; if the item already exists, the
   quantity is incremented rather than duplicated.
2. **Remove / update.** Removing calls `DELETE /cart/items/:id`; quantity changes
   re-validate against stock.
3. **State & persistence.** The cart is stored in Redux and **persisted**, so it
   survives reloads and (for guests) exists before login; on login the guest cart
   can be merged with the server cart.
4. **Derived values.** Subtotal, item count, and the cart badge are computed via
   selectors and update reactively.
5. **Edge cases.** Requesting more than available stock clamps to the max and warns
   the user; removing the last item shows the empty-cart state.

#### 4.1.11 Payment with Bakong KHQR

1. **Initiate.** At payment the client calls `paymentService.generateBakongQr()`
   → `POST /payments/bakong/qr` with `{ orderId, method, amount }`.
2. **QR generation.** The handler creates a `paymentId`, records the payment as
   **pending**, and returns a `BakongQrPayload`: a QR image, an encoded KHQR
   string, amount, currency (USD), and an **`expiresAt`** timestamp set **15
   minutes** ahead.
3. **Display & polling.** The UI renders the KHQR code plus a countdown (via
   `useCountdown`). The client polls `GET /payments/:id/status`. In the mock, the
   first status check transitions `pending → success`, simulating a completed scan;
   a real Bakong integration would poll the NBC/merchant API instead.
4. **Confirmation.** On `success` the order's `paymentStatus` becomes `paid`, the
   order is confirmed, and the user is routed to the order confirmation screen.
5. **Edge cases.** A missing/expired payment id returns `404`; the countdown
   reaching zero marks the QR **expired** and offers regeneration; a `failed`
   status keeps the order in an unpaid state and lets the user retry.

> **Note:** The KHQR flow is a UI-accurate **mock**; no real NBC/Bakong merchant
> API is contacted in the current build.

#### 4.1.12 Checkout & Place Order

1. **Preconditions.** Checkout requires an authenticated user and a non-empty
   cart; middleware guards the route and the page guards against an empty cart.
2. **Address & shipping.** The shipping address is validated by a Zod schema;
   shipping options are fetched (`GET /checkout/shipping-options`) and the selected
   option's cost is added to the order total.
3. **Pricing computation.** The system computes `subtotal`, `discount` (from any
   applied coupon), `tax`, `shipping`, and `grandTotal`; these are recomputed
   server-side at order creation to prevent client tampering.
4. **Order creation.** `POST /checkout` (then payment) creates an `Order` with
   status `pending`, the line items snapshot, totals, payment method, and
   coupon code. A successful payment advances `paymentStatus` to `paid`.
5. **Post-order.** The cart is cleared, the order id is returned, and the user
   sees a confirmation with an order summary; the order appears in history.
6. **Edge cases.** Stock that changed between add-to-cart and checkout is
   re-validated (an out-of-stock line blocks the order with a clear message); a
   failed payment leaves the order recoverable rather than lost.

#### 4.1.13 Order History

1. **Fetch.** `GET /orders` returns the authenticated user's orders (scoped by
   `userId`), most recent first, with status, totals, and item summaries.
2. **Detail.** Selecting an order calls `GET /orders/:id`; the handler returns the
   full order including items, address, payment state, and totals.
3. **Rendering.** Orders render as cards with a status badge; caching keeps the
   list responsive between navigations.
4. **Edge cases.** No orders → empty state with a link to browse; accessing an
   order that is not the user's returns `403`/`404`.

#### 4.1.14 Delivery Tracking

1. **Fetch.** `GET /orders/:id/tracking` returns an `OrderTracking` object: the
   current status plus an ordered list of `OrderTrackingEvent`s (status,
   timestamp, optional note).
2. **Rendering.** The events render as a vertical timeline; the current status is
   highlighted and derived from the latest event.
3. **Live feel.** The `useNow` hook lets relative timestamps ("2 hours ago")
   update without a refetch.
4. **Edge cases.** An order with no tracking yet shows a "not yet dispatched"
   state; an invalid order id returns `404`.

#### 4.1.15 Cancel Order (If Allowed)

1. **Eligibility check.** The cancel action is only offered when the order status
   permits it (e.g. `pending`/`processing` but not `shipped`/`delivered`); the UI
   hides/disables the button otherwise.
2. **Request.** `POST /orders/:id/cancel` re-validates eligibility server-side —
   the client-side gate is not trusted.
3. **State update.** On success the order status becomes `cancelled`, a tracking
   event is appended, and any captured payment is flagged for refund
   (`paymentStatus → refunded`).
4. **Result.** The order card updates to "Cancelled" and a confirmation toast is
   shown; a `ConfirmDialog` guards against accidental cancellation.
5. **Edge cases.** Attempting to cancel a non-cancellable order returns a
   `409 Conflict` with a message explaining why; concurrent status changes are
   resolved by the server's authoritative check.

#### 4.1.16 Promotions / Discounts

1. **Apply coupon.** At cart/checkout the user enters a coupon code; the system
   validates it against active coupons (existence, active window, usage limits,
   minimum-spend, applicable categories).
2. **Discount computation.** A valid coupon yields a `discount` (percentage or
   fixed) applied to the subtotal; the `grandTotal` is recomputed and the coupon
   code is stored on the order.
3. **Promotional pricing.** Products with an `originalPrice` render a strike-through
   original and a highlighted sale price throughout the catalog.
4. **Result.** The order summary shows the discount line and the reduced total.
5. **Edge cases.** Invalid/expired code → inline error and no discount; a coupon
   that no longer meets its minimum after item removal is automatically dropped
   with a notice.

#### 4.1.17 Product Reviews & Ratings (Longevity, Sillage, Scent Accuracy)

1. **Eligibility.** Reviewing is offered to authenticated users, ideally those who
   purchased the product; the form is validated before submission.
2. **Structured ratings.** Beyond an overall star rating, the review captures
   perfume-specific sub-scores: **longevity**, **sillage**, and **scent
   accuracy**, plus a text comment.
3. **Submission.** `POST /products/:id/reviews` persists the review; the product's
   aggregate `rating` and `reviewCount` are recalculated to include it.
4. **Result.** The new review appears in the list (optimistically), and the
   product's rating summary updates; the review section reflects the new average.
5. **Edge cases.** Duplicate reviews from the same user are prevented/updated;
   unauthenticated submissions are blocked and redirect to login; a failed
   submission rolls back the optimistic entry.

### 4.2 Admin Dashboard

Admin routes live under the `(admin)` route group and are protected by middleware
that checks both authentication **and** the `admin` role. A non-admin who reaches
an admin URL is sent to the `403` page.

#### 4.2.1 Admin Login

1. **Validation & submission.** Same `loginSchema` and `POST /auth/login` flow as
   the customer login.
2. **Role gate.** After authentication the system checks the user's role; only
   `admin` accounts are granted access to the admin shell. A valid but non-admin
   login is rejected from the admin area with a `403`.
3. **Session.** The admin session/cookie is established; the admin layout and
   sidebar render.
4. **Edge cases.** Invalid credentials → `401`; authenticated non-admin → `403`
   page; expired session → redirect to login.

#### 4.2.2 Manage Product Categories

1. **List.** `GET /categories` returns all categories with product counts.
2. **Create / edit.** A validated form submits `POST`/`PATCH` to the category
   endpoint; the system checks for a **unique name/slug** before persisting.
3. **Delete.** `DELETE /categories/:id` first checks whether products are still
   assigned; if so it blocks deletion (or requires reassignment) to avoid
   orphaned products.
4. **Result.** The category table refreshes from the invalidated query; a toast
   confirms the action.
5. **Edge cases.** Duplicate slug → validation error; deleting a non-empty
   category → `409` with guidance.

#### 4.2.3 Add / Edit / Delete Products (with Scent Profiles)

1. **Create.** The product form validates required fields (name, brand, category,
   price, images) plus the **scent profile** (notes by pyramid layer,
   concentration, longevity) and variant/bottle-size definitions. `POST /products`
   creates the record; the server assigns id, slug, and timestamps and initializes
   `rating`/`reviewCount`/`soldCount` to zero.
2. **Edit.** `PATCH /products/:id` accepts a partial update; only provided fields
   change, and `updatedAt` is refreshed.
3. **Delete.** `DELETE /products/:id` removes the product; references in carts are
   handled gracefully (line items flagged unavailable rather than crashing).
4. **Result.** The admin product table updates; image uploads are previewed before
   save.
5. **Edge cases.** Invalid price/negative stock → validation error; deleting a
   product tied to open orders keeps the order's item snapshot intact (orders store
   a copy of item data).

#### 4.2.4 Manage Stock per Bottle Size / Variant

1. **Model.** Each product carries per-variant stock (e.g. 30 ml / 50 ml / 100 ml);
   inventory is tracked at the variant level, not just the product level.
2. **Update.** Editing a variant's stock submits a `PATCH` that validates
   non-negative integers and persists the new count.
3. **Automatic decrement.** When an order is placed, the corresponding variant
   stock is decremented; when an order is cancelled/refunded, stock is restored.
4. **Signals.** Variants at or below a low-stock threshold are flagged in the
   admin UI; a zero-stock variant is shown as out-of-stock on the storefront and
   blocks add-to-cart.
5. **Edge cases.** Concurrent orders draining the last unit are resolved by the
   server's authoritative stock check at checkout.

#### 4.2.5 Manage Customer Accounts

1. **List & search.** `GET /admin/users` returns customers with search/pagination.
2. **Inspect / edit.** The admin can view a customer's profile and orders and edit
   permitted fields; validation mirrors the customer profile schema.
3. **Suspend / delete.** Status changes (active/suspended) gate the customer's
   ability to log in; a suspended customer receives `403` at login. Deletion is
   guarded by a confirmation dialog.
4. **Result.** The customer table updates from the invalidated query; actions are
   recorded in the activity log.
5. **Edge cases.** An admin cannot suspend/delete their own account through the
   list; deleting a customer with orders anonymizes rather than destroys order
   history.

#### 4.2.6 View / Manage Orders & Update Status

1. **List.** `GET /admin/orders` returns all orders with filters (status, date,
   customer) and pagination.
2. **Detail.** Opening an order shows items, totals, payment state, address, and
   the tracking timeline.
3. **Status update.** Changing status submits a `PATCH`; the server validates the
   **allowed transition** (e.g. `pending → processing → shipped → delivered`, or
   `→ cancelled`) and rejects illegal jumps. A valid change **appends a tracking
   event** with a timestamp, which the customer then sees in delivery tracking.
4. **Side effects.** Marking `delivered` may finalize the order; `cancelled`
   triggers stock restoration and refund flagging.
5. **Edge cases.** An invalid transition returns `409`; updating an order that was
   concurrently cancelled surfaces a conflict message.

#### 4.2.7 Manage Payments

1. **List.** The admin views payment records linked to orders (`paymentId`,
   method, amount, status: pending/success/failed/expired/refunded).
2. **Reconciliation.** The admin can inspect a payment's status
   (`GET /payments/:id/status`) and mark refunds when an order is cancelled;
   payment state stays consistent with the parent order's `paymentStatus`.
3. **Result.** The payments table reflects the current state; discrepancies (e.g.
   paid order with unpaid flag) are highlighted.
4. **Edge cases.** A payment with no matching order (`404`) is surfaced as an
   orphaned record for investigation; expired KHQR payments are shown as
   `expired`.

#### 4.2.8 Manage Delivery Information

1. **Assignment.** Orders ready to ship are assigned delivery details/couriers;
   the delivery module (`(delivery)` route group) exposes assigned orders
   (`GET /delivery/assigned`).
2. **Update.** The admin (or delivery agent) updates delivery status/notes, which
   **appends a tracking event** visible to the customer.
3. **Result.** The order's current status and estimated timeline update; the
   customer's tracking view reflects the change.
4. **Edge cases.** Updating delivery for a cancelled order is blocked; a missing
   delivery record returns `404`.

#### 4.2.9 Sales Reports (by Brand, Scent Family, Category)

1. **Aggregation.** The reports endpoint aggregates paid orders' line items,
   grouping revenue and units by **brand**, **scent family**, and **category**
   over a selectable date range.
2. **Computation.** Only orders in a paid/fulfilled state count toward revenue;
   refunds/cancellations are excluded or netted out.
3. **Visualization.** Results render as bar and line charts (Recharts) plus tables;
   the admin can switch grouping dimension and date range.
4. **Export.** Reports can be exported to CSV (`csvExport` utility).
5. **Edge cases.** A range with no sales renders an empty chart state; partial
   periods are labeled accordingly.

#### 4.2.10 Dashboard Statistics (Total Orders, Customers, Revenue)

1. **Fetch.** The admin landing page requests summary KPIs: total orders, total
   customers, and total revenue (plus period-over-period deltas).
2. **Computation.** Revenue sums paid orders' `grandTotal`; customer and order
   counts come from their respective collections; deltas compare the current
   period to the previous one.
3. **Rendering.** KPIs render as `StatCard`s with trend indicators; charts show
   recent revenue trends.
4. **Edge cases.** A cold start with no data shows zeroed cards rather than
   errors; a failed fetch shows a retryable error state per card.

#### 4.2.11 Coupon & Promotion Management

1. **List.** `GET` returns all coupons with status (active/expired/scheduled).
2. **Create / edit.** A validated form defines code, type (percentage/fixed),
   value, validity window, usage limit, minimum spend, and applicable
   categories; the system enforces a **unique code**.
3. **Activation logic.** A coupon is only usable within its window and under its
   usage limit; these rules are exactly what the customer-side "apply coupon" flow
   validates against.
4. **Delete / disable.** Coupons can be disabled or deleted; in-flight orders that
   already applied the coupon keep their recorded discount.
5. **Edge cases.** Duplicate code → validation error; end date before start date →
   validation error.

#### 4.2.12 User Activity Logs

1. **Capture.** Significant actions (logins, order status changes, product/coupon
   edits, account changes) are recorded as log entries with actor, action, target,
   and timestamp.
2. **View.** `GET` returns paginated, filterable logs (by actor, action type, date)
   for auditing.
3. **Result.** The admin can trace who changed what and when, supporting
   accountability and troubleshooting.
4. **Edge cases.** High-volume logs are paginated and searchable; logs are
   read-only in the UI to preserve integrity.

#### 4.2.13 Banner / Slider Management

1. **List.** `GET /banners` returns homepage banners with order, image, link, and
   active flag.
2. **Create / edit.** A validated form sets image, title, target link, display
   order, and an active/scheduled window; changes persist via `POST`/`PATCH`.
3. **Ordering & visibility.** Only active banners within their schedule are served
   to the storefront home slider, ordered by the configured sequence.
4. **Delete.** Removing a banner takes it out of rotation immediately after cache
   invalidation.
5. **Edge cases.** An empty active set falls back to a default hero; a broken image
   link is handled with a placeholder.

## 5. Project File Structure & File Roles

This section documents the purpose of every file and folder in the project. The
codebase follows a **feature-first architecture**: cross-cutting building blocks
(UI, hooks, state, services) live at the top of `src/`, while self-contained
business capabilities live under `src/features/<feature>/`, each exposing its own
`components/`, `hooks/`, `services/`, `types.ts`, and a public `index.ts` barrel.

### 5.1 Root Configuration Files

| File                                    | Role                                                                                                          |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `package.json`                          | Declares dependencies, scripts (`dev`, `build`, `start`, `lint`, `typecheck`, `format`), and project metadata |
| `tsconfig.json`                         | TypeScript compiler options and path aliases (e.g. `@/*` → `src/*`)                                           |
| `next.config.ts`                        | Next.js configuration (build, images, experimental flags)                                                     |
| `next-env.d.ts`                         | Auto-generated Next.js TypeScript ambient types (do not edit)                                                 |
| `eslint.config.mjs`                     | ESLint flat-config with the Next.js + Prettier rule sets                                                      |
| `postcss.config.mjs`                    | PostCSS pipeline wiring Tailwind CSS                                                                          |
| `tailwind.config.ts`                    | Tailwind theme, tokens, breakpoints, and content globs                                                        |
| `components.json`                       | shadcn/ui generator config (component paths, aliases, style)                                                  |
| `opencode.json`                         | Tooling/agent configuration for the workspace                                                                 |
| `AGENTS.md` / `CLAUDE.md`               | Contributor and AI-agent guidance rules for this repo                                                         |
| `README.md`                             | Human-facing project introduction and setup notes                                                             |
| `report.md` / `reporte.md`              | Project documentation reports (this file)                                                                     |
| `public/robots.txt`                     | Crawler directives for SEO                                                                                    |
| `public/*.svg`, `public/favicon` assets | Static brand/icon assets served as-is                                                                         |

### 5.2 `src/app/` — Routing, Pages & API (Next.js App Router)

The App Router uses **route groups** (parenthesized folders that do not appear in
the URL) to separate audiences and apply distinct layouts.

#### Root app files

| File                    | Role                                                              |
| ----------------------- | ----------------------------------------------------------------- |
| `src/app/layout.tsx`    | Root layout: HTML shell, fonts, global providers wrapper          |
| `src/app/providers.tsx` | Client providers: Redux store, React Query client, theme, toaster |
| `src/app/globals.css`   | Global Tailwind layers and base styles                            |
| `src/app/loading.tsx`   | Global route-level loading fallback (Suspense)                    |
| `src/app/error.tsx`     | Global error boundary UI for unhandled render errors              |
| `src/app/not-found.tsx` | Global 404 page                                                   |
| `src/app/favicon.ico`   | Browser tab icon                                                  |
| `src/app/401/page.tsx`  | "Unauthenticated" page (redirect target for guarded routes)       |
| `src/app/403/page.tsx`  | "Forbidden" page (wrong role, e.g. non-admin)                     |

#### `(user)/` — Customer storefront

| File                                                         | Role                                                                |
| ------------------------------------------------------------ | ------------------------------------------------------------------- |
| `(user)/layout.tsx`                                          | Storefront shell (Header, Footer) and auth context for customers    |
| `(user)/page.tsx` + `HomePageContent.tsx`                    | Home route: server page + client content (recommendations, banners) |
| `(user)/about/page.tsx` + `AboutPageContent.tsx`             | About page (server shell + client content)                          |
| `(user)/products/page.tsx`                                   | Catalog listing (browse, search, filter, sort)                      |
| `(user)/products/[id]/page.tsx`                              | Product detail (scent profile, notes, add-to-cart, reviews)         |
| `(user)/cart/page.tsx` + `CartPageContent.tsx`               | Cart view and line-item management                                  |
| `(user)/checkout/page.tsx`                                   | Checkout entry / wizard host                                        |
| `(user)/checkout/address/page.tsx`                           | Shipping address step                                               |
| `(user)/checkout/shipping/page.tsx`                          | Shipping-method selection step                                      |
| `(user)/checkout/payment/page.tsx`                           | Payment step (Bakong KHQR)                                          |
| `(user)/checkout/confirmation/page.tsx`                      | Order confirmation screen                                           |
| `(user)/orders/page.tsx` + `OrdersPageContent.tsx`           | Order history list                                                  |
| `(user)/orders/[id]/page.tsx` + `OrderDetailPageContent.tsx` | Single order detail + tracking                                      |
| `(user)/profile/page.tsx` + `ProfilePageContent.tsx`         | View/update profile, email, password                                |

#### `(auth)/` — Authentication flows

| File                              | Role                                     |
| --------------------------------- | ---------------------------------------- |
| `(auth)/layout.tsx`               | Minimal centered layout for auth screens |
| `(auth)/login/page.tsx`           | Login page                               |
| `(auth)/register/page.tsx`        | Registration page                        |
| `(auth)/forgot-password/page.tsx` | Request a password reset                 |
| `(auth)/reset-password/page.tsx`  | Set a new password from a reset token    |
| `(auth)/verify-otp/page.tsx`      | 6-digit OTP verification                 |

#### `(admin)/` — Admin back-office

| File                                | Role                                                 |
| ----------------------------------- | ---------------------------------------------------- |
| `(admin)/layout.tsx`                | Admin shell (Sidebar + AdminPageShell), role-guarded |
| `(admin)/admin/dashboard/page.tsx`  | KPI dashboard (orders, customers, revenue, charts)   |
| `(admin)/admin/products/page.tsx`   | Product management (CRUD + scent profiles)           |
| `(admin)/admin/categories/page.tsx` | Category management                                  |
| `(admin)/admin/orders/page.tsx`     | Order management and status updates                  |
| `(admin)/admin/customers/page.tsx`  | Customer account management                          |
| `(admin)/admin/payments/page.tsx`   | Payment records and reconciliation                   |
| `(admin)/admin/delivery/page.tsx`   | Delivery assignment and info                         |
| `(admin)/admin/coupons/page.tsx`    | Coupon & promotion management                        |
| `(admin)/admin/banners/page.tsx`    | Homepage banner/slider management                    |
| `(admin)/admin/logs/page.tsx`       | User activity / audit log viewer                     |

#### `(delivery)/` — Delivery agent module

| File                                           | Role                                   |
| ---------------------------------------------- | -------------------------------------- |
| `(delivery)/layout.tsx`                        | Delivery-role layout                   |
| `(delivery)/delivery/dashboard/page.tsx`       | Agent dashboard of assigned deliveries |
| `(delivery)/delivery/deliveries/[id]/page.tsx` | Single delivery detail + status update |

#### `src/app/api/` — Route handlers (backend contract)

These `route.ts` files define the REST endpoints the frontend calls. They mirror
the mock-adapter contract, so the app can run against real handlers or in-memory
mocks interchangeably.

| Path group                    | Role                                                                                                                                                       |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `api/auth/*`                  | `login`, `register`, `logout`, `me`, `forgot-password`, `reset-password`, `profile`, `email`, `password`, `otp/generate`, `otp/verify` — full auth surface |
| `api/products/*`              | `route` (list), `[id]` (detail), `search`, `filter`, `compare`                                                                                             |
| `api/banners/route.ts`        | Public banner feed for the storefront home                                                                                                                 |
| `api/admin/products/*`        | Admin product create/list and `[id]` update/delete                                                                                                         |
| `api/admin/categories/*`      | Category CRUD                                                                                                                                              |
| `api/admin/orders/*`          | Order list and `[id]/status` transitions                                                                                                                   |
| `api/admin/customers/*`       | Customer list and `[id]` management                                                                                                                        |
| `api/admin/payments/route.ts` | Payment records                                                                                                                                            |
| `api/admin/delivery/*`        | Delivery list and `[id]/assign`                                                                                                                            |
| `api/admin/coupons/*`         | Coupon CRUD                                                                                                                                                |
| `api/admin/banners/*`         | Banner CRUD                                                                                                                                                |
| `api/admin/logs/route.ts`     | Activity log feed                                                                                                                                          |
| `api/admin/stats/route.ts`    | Aggregated dashboard KPIs                                                                                                                                  |

### 5.3 `src/components/` — Shared, Feature-Agnostic UI

| Folder / File                                                  | Role                                                                                                                                                                |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ui/*`                                                         | Primitive design-system components (shadcn/Radix): `button`, `input`, `dialog`, `select`, `table`, `tabs`, `sheet`, `otp-input`, `stepper`, `sonner` (toasts), etc. |
| `layout/Header.tsx`                                            | Storefront top navigation, cart badge, account menu                                                                                                                 |
| `layout/Footer.tsx`                                            | Global footer                                                                                                                                                       |
| `layout/Sidebar.tsx`                                           | Admin navigation sidebar                                                                                                                                            |
| `layout/AdminPageShell.tsx`                                    | Consistent admin page frame (title, actions, content)                                                                                                               |
| `layout/PageWrapper.tsx`                                       | Standard page padding/width container                                                                                                                               |
| `layout/SearchBox.tsx`                                         | Debounced search input used in catalog/admin                                                                                                                        |
| `cards/ProductCard.tsx`                                        | Product grid card (image, price, rating)                                                                                                                            |
| `cards/OrderCard.tsx`                                          | Order summary card in history                                                                                                                                       |
| `cards/ReviewCard.tsx`                                         | Single review display                                                                                                                                               |
| `charts/RevenueLineChart.tsx`                                  | Revenue trend line chart (Recharts)                                                                                                                                 |
| `charts/SalesBarChart.tsx`                                     | Sales-by-dimension bar chart                                                                                                                                        |
| `dashboard/StatCard.tsx`                                       | KPI stat tile with trend delta                                                                                                                                      |
| `forms/FormField.tsx`                                          | Labeled field wrapper integrating React Hook Form                                                                                                                   |
| `forms/FormError.tsx`                                          | Inline validation error renderer                                                                                                                                    |
| `tables/DataTable.tsx`                                         | Generic sortable/paginated table                                                                                                                                    |
| `tables/DataTablePagination.tsx`                               | Table pagination controls                                                                                                                                           |
| `tables/DataTableToolbar.tsx`                                  | Table search/filter toolbar                                                                                                                                         |
| `tables/index.ts`                                              | Barrel export for table components                                                                                                                                  |
| `shared/ConfirmDialog.tsx`                                     | Reusable confirmation modal (destructive actions)                                                                                                                   |
| `shared/EmptyState.tsx`                                        | "No data" placeholder                                                                                                                                               |
| `shared/ErrorBoundary.tsx`                                     | Component-level error catch                                                                                                                                         |
| `shared/NetworkError.tsx`                                      | Fetch-failure UI with retry                                                                                                                                         |
| `shared/PageHeader.tsx`                                        | Section title + breadcrumbs/actions                                                                                                                                 |
| `shared/SectionShell.tsx`                                      | Content section container                                                                                                                                           |
| `shared/Skeleton.tsx`, `SkeletonCard.tsx`, `SkeletonTable.tsx` | Loading placeholders                                                                                                                                                |
| `shared/StatusBadge.tsx`                                       | Colored status pill (order/payment states)                                                                                                                          |
| `shared/StatusStepper.tsx`                                     | Visual multi-step status indicator                                                                                                                                  |
| `shared/index.ts`                                              | Barrel export for shared components                                                                                                                                 |

### 5.4 `src/features/` — Business Feature Modules

Each feature folder is self-contained. Common file roles across features:
`components/` (feature UI), `hooks/` (React Query/mutation hooks), `services/`
(API + mock registry), `types.ts` (domain types), `schemas.ts` (Zod validation),
`index.ts` (public barrel).

| Feature     | Key files & role                                                                                                                                                                                                                                                                                                                                                               |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `auth/`     | `schemas.ts` (login/register/profile/OTP Zod schemas), `services/authService.ts` + `supabaseAuthService.ts`, hooks (`useLogin`, `useRegister`, `useLogout`, `useUpdateProfile`, `useChangeEmail`, `useChangePassword`, `useForgotPassword`, `useResetPassword`, `useOtpVerify`), and forms (`LoginForm`, `RegisterForm`, `ProfileForm`, `OtpVerificationForm*`, `DemoOtpCard`) |
| `products/` | `services/productService.ts` (list/detail/search/filter/compare + mocks), `types.ts` (`Product`, `ProductFilters`, scent/spec fields), hooks (`useProducts`, `useProductDetail`, `useProductComparison`), components (`ProductCatalog`, `ProductGrid`, `ProductDetailView`, `ProductGallery`, `ProductFilterPanel`, `ComparisonTable`)                                         |
| `cart/`     | `services/cartService.ts`, `useCart`, `useValidateCoupon`, `CartItemRow`, `CartSummary`, `types.ts`                                                                                                                                                                                                                                                                            |
| `checkout/` | `schemas.ts` (address validation), `services/checkoutService.ts`, `CheckoutWizard` + step components (`AddressStep`, `ShippingStep`, `PaymentStep`, `ReviewStep`), hooks (`useCheckoutFlow`, `useShippingOptions`, `usePlaceOrder`)                                                                                                                                            |
| `payment/`  | `services/paymentService.ts` (Bakong KHQR mock + status polling), `types.ts` (`BakongQrPayload`, `PaymentStatus`), `BakongQrPanel`, `PaymentStatusBadge`, `usePaymentStatus`                                                                                                                                                                                                   |
| `orders/`   | `services/orderService.ts` (list/detail/cancel/tracking), `types.ts` (`Order`, `OrderTracking`), `useOrders`, `useOrderTracking`, `OrderDetailCard`, `OrderTimeline`                                                                                                                                                                                                           |
| `review/`   | `services/reviewService.ts`, `ReviewForm`, `ReviewList`, `StarRating`, `useReviews`, `types.ts` (longevity/sillage/accuracy sub-scores)                                                                                                                                                                                                                                        |
| `banners/`  | `services/bannerService.ts`, `useBanners` (home slider feed)                                                                                                                                                                                                                                                                                                                   |
| `delivery/` | `services/deliveryService.ts`, `AssignedDeliveryCard`, `DeliveryDashboardContent`, `DeliveryDetailContent`, `DeliveryStatusUpdater`, `useAssignedDeliveries`                                                                                                                                                                                                                   |
| `admin/`    | `services/adminService.ts` (all admin endpoints), `useAdmin`, `types.ts`, `*Content.tsx` page bodies (products/orders/customers/payments/delivery/coupons/banners/logs/dashboard/categories) and forms (`ProductForm`, `CategoryForm`, `CouponForm`, `BannerForm`)                                                                                                             |

### 5.5 State, Services & Cross-Cutting Layers

#### `src/redux/` — Global client state

| File                   | Role                                                        |
| ---------------------- | ----------------------------------------------------------- |
| `store.ts`             | Configures the Redux store, `redux-persist`, and middleware |
| `hooks.ts`             | Typed `useAppDispatch` / `useAppSelector` hooks             |
| `slices/authSlice.ts`  | Authenticated user + token session state                    |
| `slices/cartSlice.ts`  | Persisted cart items, quantities, derived totals            |
| `slices/themeSlice.ts` | Light/dark theme preference                                 |

#### `src/services/api/` — HTTP & mock layer

| File               | Role                                                                                                 |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| `axiosInstance.ts` | Shared `apiClient` (base URL, interceptors, mock-adapter install)                                    |
| `endpoints.ts`     | Single source of truth for all API URL paths                                                         |
| `mockAdapter.ts`   | In-memory request router; `registerMock` handlers resolve requests when `NEXT_PUBLIC_USE_MOCK` is on |

#### `src/lib/` — Infrastructure utilities

| File                 | Role                                                    |
| -------------------- | ------------------------------------------------------- |
| `auth.ts`            | Auth helpers (current-user resolution, guards)          |
| `db.ts`              | Data-access helper over seed JSON (mock persistence)    |
| `sessionCookie.ts`   | Read/write the session cookie used by middleware        |
| `otp.ts`             | OTP generation/verification helpers                     |
| `emailjs.ts`         | EmailJS integration for sending OTP/notification emails |
| `supabase/client.ts` | Supabase client (alternative auth backend)              |
| `toast.ts`           | Toast helper wrapping the Sonner notifier               |
| `utils.ts`           | General-purpose helpers (e.g. `cn` class merge)         |

#### `src/hooks/` — Reusable UI hooks

| File               | Role                                             |
| ------------------ | ------------------------------------------------ |
| `useDebounce.ts`   | Debounces rapidly-changing values (search input) |
| `useCountdown.ts`  | Countdown timer (KHQR expiry)                    |
| `useNow.ts`        | Ticking "current time" for relative timestamps   |
| `useDisclosure.ts` | Open/close state for modals/drawers              |
| `useMediaQuery.ts` | Responsive breakpoint matching                   |
| `useStoredOtp.ts`  | Persists/reads an in-progress OTP challenge      |

#### `src/constants/`, `src/types/`, `src/utils/`

| File                       | Role                                                              |
| -------------------------- | ----------------------------------------------------------------- |
| `constants/routes.ts`      | Centralized route path constants                                  |
| `constants/orderStatus.ts` | Order status enum + labels/transitions                            |
| `constants/breakpoints.ts` | Shared responsive breakpoint values                               |
| `types/common.ts`          | Shared types (`PaginationParams`, `SortDirection`, API envelopes) |
| `types/global.d.ts`        | Global ambient type declarations                                  |
| `utils/formatCurrency.ts`  | Currency formatting (USD)                                         |
| `utils/formatDate.ts`      | Date/relative-time formatting (date-fns)                          |
| `utils/csvExport.ts`       | Export tabular data (reports) to CSV                              |
| `utils/cn.ts`              | Tailwind class-name merge helper                                  |

#### `src/middleware.ts`

Edge middleware that runs before route rendering: it reads the session cookie and
**enforces access control** across route groups — redirecting unauthenticated
users to `/login`/`401` and non-admin users away from `(admin)` routes to `403`.

### 5.6 Seed Data & Static Assets

| Location                                | Role                                                                                                                                                     |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/mock/*.json`                       | In-memory seed datasets consumed by the mock adapter: `products`, `categories`, `users`, `orders`, `coupons`, `banners`, `reviews`, `deliveries`, `logs` |
| `data/*.json`                           | Persistent seed fixtures (`products`, `categories`, `users`, `orders`, `coupons`, `banners`) used by the `db.ts` mock data layer                         |
| `public/assets/images/products/*`       | Product images served statically                                                                                                                         |
| `src/assets/icons`, `src/assets/images` | Bundled asset placeholders (imported, not served directly)                                                                                               |

> **Domain note:** The current seed data and product images reflect an
> electronics catalog (the base template). For the fragrance platform these
> datasets are the drop-in point — replacing the JSON fixtures and images with
> perfume records (scent family, notes, concentration, bottle-size variants)
> populates every workflow described above without code changes.

## 6. Conclusion

The Fragrance E-Commerce Platform delivers a complete, two-module retail
experience purpose-built for perfumery. The **User Dashboard** guides shoppers from
discovery — through curated recommendations, category browsing, rich perfume-aware
filtering, detailed scent profiles, and side-by-side comparison — to a smooth cart,
**Bakong KHQR** checkout, and post-purchase engagement via tracking, cancellation,
promotions, and structured reviews (longevity, sillage, scent accuracy). The
**Admin Dashboard** provides end-to-end operational control over catalog,
variant-level inventory, customers, orders, payments, deliveries, promotions,
content, and analytics.

Architecturally, the platform's strength is its **clean separation of concerns**: a
typed domain model, Redux for client state, React Query for server state, Zod for
validation, and a **service layer fronted by a mock adapter** that mirrors a real
REST contract. Every workflow in this report is expressed against that contract,
so the current mock-backed build can be promoted to a live backend by switching a
single environment flag — no UI rework required. The result is a maintainable,
extensible frontend that is faithful to real e-commerce business logic while
remaining ready for production integration.
