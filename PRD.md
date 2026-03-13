# C4R Platform — Product Requirements Document (PRD)

## 1. Product Overview

**Product Name:** C4R Platform (سي فور آر لتأجير السيارات)
**Type:** Full-stack web application (Car Rental Platform)
**Target Market:** Saudi Arabia (KSA)
**Primary Language:** Arabic (RTL layout)
**Secondary Language:** English (i18n supported)
**Live URL:** https://c4rplatform.com
**Backend API:** https://c4r-platform-backend.vercel.app/api

C4R Platform is a premium car rental marketplace serving Saudi Arabia. Users can browse, filter, and book cars across three regions (Eastern, Jeddah, Riyadh). The platform supports three car categories: regular rentals, rentals with a private driver, and corporate fleet services.

---

## 2. Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** JavaScript (JSX)
- **UI Libraries:** Material UI (MUI) 7, Tailwind CSS 4
- **State Management:** React Context (AuthContext), TanStack React Query
- **Animation:** Framer Motion
- **Internationalization:** i18next, react-i18next (AR/EN)
- **Font:** Almarai (Google Fonts — Arabic)
- **Layout Direction:** RTL (dir="rtl", lang="ar")
- **HTTP Client:** Axios with interceptors
- **Auth Storage:** js-cookie (JWT token), localStorage (user cache)
- **Notifications:** react-toastify
- **Other:** react-fast-marquee, react-hook-form, react-icons

### Backend
- **Runtime:** Node.js (>=16)
- **Framework:** Express.js 4
- **Database:** MongoDB via Mongoose 8
- **Authentication:** JWT (jsonwebtoken) + bcryptjs
- **Validation:** express-validator
- **File Uploads:** Multer (local) / Cloudinary URLs (production)
- **Email:** Nodemailer (password reset)
- **Security:** Helmet, CORS, express-rate-limit
- **Deployment:** Vercel (serverless)

---

## 3. User Roles & Permissions

| Role | Capabilities |
|------|-------------|
| **Guest (Unauthenticated)** | Browse home page, view all cars, view car details, view car reviews, access static pages (About, FAQ, Corporate, With-Driver, Policy, Privacy, Terms, City pages) |
| **User (Authenticated)** | All Guest capabilities + Create bookings, view own bookings, submit reviews for completed bookings, update profile, change password |
| **Admin** | All User capabilities + Manage all cars (CRUD), manage all bookings (approve/reject/delete), manage all reviews (view all/delete), view admin dashboard with statistics |

---

## 4. Frontend Pages & Routes

### 4.1 Public Pages

#### `/` — Home Page
- **HeroAd Section:** Full-width hero banner with a prominent call-to-action for car rental. Animated with Framer Motion.
- **Departments Section:** Showcases the three car categories (Regular, With Driver, Corporate) as interactive cards linking to their respective pages.
- **ReviewMarquee Section:** Auto-scrolling horizontal marquee displaying recent customer reviews fetched from the API (`/api/reviews/recent`). Uses `react-fast-marquee` with `autoFill`.
- **Partners Section:** Auto-scrolling marquee of partner logos.
- **FAQ Section:** Expandable accordion-style frequently asked questions.

#### `/cars` — Cars Listing Page
- Fetches all cars from `GET /api/cars` using React Query.
- Displays cars in a responsive grid (1–4 columns based on screen size).
- Each car is rendered as a `CarCard` component showing: image, name, year, region, price per day (SAR), average rating, and total reviews.
- Breadcrumbs navigation.
- Loading state with MUI `CircularProgress`.
- Empty state message when no cars available.

#### `/cars/[id]` — Car Detail Page
- Displays full car details: large image, name, year, region, price per day, availability status, category.
- Shows car reviews section with ratings and comments.
- "Book Now" button navigating to `/booking/[id]` (requires authentication).

#### `/about` — About Us Page
- Company information and mission statement.

#### `/faq` — FAQ Page
- Comprehensive frequently asked questions with expandable answers.

#### `/corporate` — Corporate Services Page
- Information about corporate fleet rental services.

#### `/with-driver` — With Driver Service Page
- Information about car rental with private driver.

#### `/[city]` — Dynamic City Pages
- City-specific rental information (e.g., Riyadh, Jeddah, Eastern Province).

#### `/policy` — Policy Page
- General platform policies.

#### `/privacy` — Privacy Policy Page
- Privacy policy details in Arabic.

#### `/terms` — Terms & Conditions Page
- Terms and conditions in Arabic.

### 4.2 Authentication Pages (`/auth/*`)

#### `/auth/login` — Login Page
- **Fields:** Email, Password
- **Validation:** Required fields, valid email format
- **Behavior:** On success — stores JWT token in cookie (7-day expiry), caches user in localStorage, shows Arabic success toast "تم تسجيل الدخول بنجاح", redirects to `returnUrl` or home page.
- **Error Handling:** Shows Arabic error toast with server message or fallback "فشل تسجيل الدخول".

#### `/auth/register` — Registration Page
- **Fields:** Name (min 2 chars), Email, Password (min 6 chars), Confirm Password
- **Validation:** Required fields, email format, password match, minimum lengths.
- **Behavior:** On success — shows toast "تم إنشاء الحساب بنجاح. يرجى تسجيل الدخول.", redirects to login page.

#### `/auth/forgot-password` — Forgot Password Page
- **Fields:** Email
- **Behavior:** Sends reset token to user's email via Nodemailer. Shows confirmation message.

#### `/auth/reset-password` — Reset Password Page
- **Fields:** Reset Token, New Password (min 6 chars)
- **Behavior:** Resets password using the token. Token expires after 10 minutes.

### 4.3 Protected Pages (Require Authentication)

#### `/booking/[id]` — Booking Page
- **Requires:** Authenticated user
- **Fields:**
  - Phone number (Saudi: `+966/05XXXXXXXX` or Egyptian: `+20/01XXXXXXXXX` format)
  - Start Date (ISO 8601)
  - End Date (ISO 8601)
  - Kilometers per day (min 1)
  - Number of days (min 1)
  - ID Card Image (uploaded to Cloudinary, URL sent to API)
  - Driver's License Image (uploaded to Cloudinary, URL sent to API)
- **Calculated:** Total price = pricePerDay × numberOfDays
- **Behavior:** Creates booking via `POST /api/bookings`. Booking status starts as "pending".

#### `/dashboard/user` — User Dashboard
- View own bookings with status (pending, approved, rejected).
- View own reviews.
- Profile management.

#### `/dashboard/admin` — Admin Dashboard
- **Requires:** Admin role
- **Sections:**
  - **Statistics Overview:** Total cars, total bookings, total reviews, total users.
  - **Cars Management:** Full CRUD — add new car (name, year, region, pricePerDay, imageUrl, category), edit car, delete car, toggle availability.
  - **Bookings Management:** View all bookings, approve bookings, reject bookings, delete bookings. Filter by status (pending/approved/rejected).
  - **Reviews Management:** View all reviews, delete inappropriate reviews.
- **Layout:** Sidebar navigation with dark "Midnight Blue" theme and glassmorphism styling.

### 4.4 Layout Components (Present on All Pages)

#### Navbar
- Logo/brand link to home.
- Navigation links: Home, Cars, About, FAQ.
- Language switcher (AR/EN).
- Auth state:
  - **Guest:** Login/Register buttons.
  - **Authenticated:** User avatar (initials fallback if no profile picture), user name dropdown with Dashboard and Logout.
- Mobile: Responsive hamburger menu with bottom navigation.

#### BottomNav (Mobile)
- Fixed bottom navigation bar on mobile screens with quick links.

#### Footer
- Company info, social media links (Facebook, Instagram, Twitter), contact info (phone: +966554118873), quick navigation links, copyright.

#### FloatingContact
- Floating WhatsApp and Email icons for quick customer contact.

#### Breadcrumbs
- Page hierarchy navigation, styled for dark mode visibility.

---

## 5. Backend API Endpoints

### 5.1 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login and receive JWT token |
| POST | `/api/auth/forgot-password` | Public | Send password reset email |
| POST | `/api/auth/reset-password` | Public | Reset password with token |
| PUT | `/api/auth/change-password` | Private | Change password (authenticated) |
| GET | `/api/auth/logout` | Private | Logout user |

### 5.2 Users (`/api/users`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/users/profile` | Private | Get current user profile |
| PUT | `/api/users/profile` | Private | Update current user profile |

### 5.3 Cars (`/api/cars`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/cars` | Public | Get all cars (supports filters: region, minPrice, maxPrice, year, page, limit) |
| GET | `/api/cars/:id` | Public | Get single car by ID |
| POST | `/api/cars` | Admin | Create new car |
| PUT | `/api/cars/:id` | Admin | Update car |
| DELETE | `/api/cars/:id` | Admin | Delete car |

### 5.4 Bookings (`/api/bookings`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/bookings` | Private | Create new booking |
| GET | `/api/bookings` | Private | Get bookings (user: own, admin: all). Supports filters: status, page, limit |
| GET | `/api/bookings/:id` | Private | Get single booking |
| PATCH | `/api/bookings/:id/approve` | Admin | Approve a pending booking |
| PATCH | `/api/bookings/:id/reject` | Admin | Reject a pending booking |
| DELETE | `/api/bookings/:id` | Admin | Delete a booking |

### 5.5 Reviews (`/api/reviews`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/reviews/car/:carId` | Public | Get all reviews for a specific car (paginated) |
| GET | `/api/reviews/recent` | Public | Get recent reviews for home page marquee |
| POST | `/api/reviews` | Private | Create a review (requires carId, bookingId, rating 1-5, optional comment) |
| GET | `/api/reviews/user` | Private | Get current user's reviews |
| GET | `/api/reviews/admin/all` | Admin | Get all reviews (admin only) |
| DELETE | `/api/reviews/:id` | Admin | Delete a review |

### 5.6 Regions (`/api/regions`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/regions` | Public | Get available regions |

### 5.7 Admin (`/api/admin`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/admin/stats` | Admin | Get dashboard statistics |

### 5.8 Utility Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/` | API welcome message |
| GET | `/api` | API endpoints overview |

---

## 6. Data Models

### User
| Field | Type | Constraints |
|-------|------|-------------|
| name | String | Required, 2–50 chars |
| email | String | Required, unique, valid email format |
| password | String | Required, min 8 chars, must contain: uppercase, lowercase, digit, special char |
| role | String | Enum: "user" (default), "admin" |
| phoneNumber | String | Optional |
| resetPasswordToken | String | Generated for password reset |
| resetPasswordExpire | Date | 10 minutes from token generation |

### Car
| Field | Type | Constraints |
|-------|------|-------------|
| name | String | Required, 2–100 chars |
| year | Number | Required, 2000 to next year |
| image | String | Required (Cloudinary URL) |
| region | String | Required, Enum: "eastern", "jeddah", "riyadh" |
| pricePerDay | Number | Required, min 1 SAR |
| available | Boolean | Default: true |
| category | String | Enum: "regular" (default), "with_driver", "corporate" |
| averageRating | Number | 0–5, auto-calculated from reviews |
| totalReviews | Number | Auto-calculated |

### Booking
| Field | Type | Constraints |
|-------|------|-------------|
| user | ObjectId (ref: User) | Required |
| car | ObjectId (ref: Car) | Required |
| idCardImage | String | Required (Cloudinary URL) |
| licenseImage | String | Required (Cloudinary URL) |
| phoneNumber | String | Required, Saudi or Egyptian format |
| startDate | Date | Required |
| endDate | Date | Required |
| kmPerDay | Number | Required, min 1 |
| numberOfDays | Number | Required, min 1 |
| totalPrice | Number | Required, min 0 |
| status | String | Enum: "pending" (default), "approved", "rejected" |

### Review
| Field | Type | Constraints |
|-------|------|-------------|
| user | ObjectId (ref: User) | Required |
| car | ObjectId (ref: Car) | Required |
| booking | ObjectId (ref: Booking) | Required |
| rating | Number | Required, 1–5 |
| comment | String | Optional, max 500 chars |
| Unique constraint | — | One review per booking (compound: user + booking) |

---

## 7. Security & Rate Limiting

- **Authentication:** JWT Bearer token in Authorization header.
- **Token Storage:** HTTP cookie (7-day expiry) via js-cookie.
- **Password Hashing:** bcryptjs with salt rounds = 10.
- **Auth Rate Limit:** 100 requests per 15 minutes per IP on `/api/auth/*`.
- **General Rate Limit:** 500 requests per 15 minutes per IP on all routes.
- **Security Headers:** Helmet.js with cross-origin resource policy.
- **CORS:** Configured allowed origins.
- **Input Validation:** express-validator on all endpoints.
- **Request Body Limit:** 10MB for JSON and URL-encoded.

---

## 8. SEO & Structured Data

- **JSON-LD:** CarRental schema with business info (name, logo, URL, phone, address, social links).
- **JSON-LD:** FAQPage schema with structured Q&A.
- **Meta Tags:** Title "C4R-Platform | تأجير سيارات في السعودية", Arabic meta description.
- **Favicon:** `/logo1.jpg` for browser and iOS.
- **Google Site Verification:** Via environment variable.
- **Redirect:** `/offers` → `/cars` (permanent 301).

---

## 9. UI Design System

- **Theme:** Dark "Midnight Blue" premium design with glassmorphism.
- **Colors:** Dark background, orange/accent primary colors, white text.
- **Typography:** Almarai Arabic font (weights: 300, 400, 700, 800).
- **Layout:** RTL direction, responsive (mobile-first).
- **Animations:** Framer Motion for page transitions and micro-interactions.
- **CarCard Design:** Image, car info, rating stars, price badge, "Book" action button.
- **Dashboard:** Sidebar + content layout with glassmorphism panels.

---

## 10. Key User Flows

### Flow 1: Guest Browsing Cars
1. User visits home page → sees hero banner, departments, reviews marquee.
2. Clicks "Cars" in navbar → navigates to `/cars`.
3. Views car grid with pricing and ratings.
4. Clicks a car card → navigates to `/cars/[id]` to see full details and reviews.

### Flow 2: User Registration & Login
1. Guest clicks "Register" → fills name, email, password, confirm password.
2. On success → redirect to login page with success toast.
3. User logs in with email + password.
4. On success → JWT stored in cookie, user cached in localStorage, redirect to home.

### Flow 3: Creating a Booking
1. Authenticated user on car detail page clicks "Book Now".
2. Redirected to `/booking/[id]`.
3. Fills booking form: dates, phone, km/day, uploads ID card and license images.
4. Submits → booking created with "pending" status.
5. User can track booking status in their dashboard.

### Flow 4: Admin Managing Bookings
1. Admin logs in → navigates to `/dashboard/admin`.
2. Views all pending bookings.
3. Can approve, reject, or delete bookings.
4. Views statistics overview.

### Flow 5: Password Recovery
1. User clicks "Forgot Password" on login page.
2. Enters email → system sends reset token via email.
3. User receives email, navigates to reset password page.
4. Enters token + new password → password updated.

---

## 11. Environment Variables

### Frontend (`NEXT_PUBLIC_*`)
- `NEXT_PUBLIC_API_URL` — Backend API base URL
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` — Google Search Console verification

### Backend
- `PORT` — Server port (default: 5000)
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — JWT signing secret
- `JWT_EXPIRES_IN` — JWT expiration time
- `CORS_ORIGIN` — Comma-separated allowed origins
- `NODE_ENV` — development/production
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` — Nodemailer config
- `FRONTEND_URL` — Frontend URL for password reset links