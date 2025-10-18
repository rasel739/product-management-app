# 🛍️ Product Management App

A modern, full-featured **Product Management Application** built with **Next.js 15+**, **TypeScript**, **Redux Toolkit**, and **Tailwind CSS**.
This app provides a complete solution for managing products, categories, and user authentication with enterprise-level security.

---

## ✨ Features

- 🔐 **Secure Authentication** – Email-based login with HTTP-only cookies
- 📦 **Product Management** – Create, Read, Update, and Delete products
- 🏷️ **Category Filtering** – Filter products by categories
- 🔍 **Advanced Search** – Real-time search with debounce
- 📄 **Pagination** – Efficient paginated product list
- 🛡️ **Protected Routes** – Middleware-based route protection
- 🎨 **Modern UI** – Responsive Tailwind CSS design
- 📊 **State Management** – Redux Toolkit + RTK Query
- ⚡ **Performance** – Powered by Turbopack

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** Next.js 15.5.5
- **Language:** TypeScript 5
- **State Management:** Redux Toolkit 2.9.1
- **API Client:** RTK Query
- **Styling:** Tailwind CSS 4.1.14
- **UI Icons:** Lucide React 0.546.0
- **Image Optimization:** Next.js Image component

### Development Tools

- **Build Tool:** Turbopack
- **Linting:** ESLint 9
- **Package Manager:** Yarn
- **Bundler:** Webpack (via Next.js)

---

## 📋 Prerequisites

Make sure you have the following installed:

- Node.js 18.x or higher
- Yarn or npm
- Git

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/rasel739/product-management-app.git
cd product-management-app
```

### 2️⃣ Install Dependencies

```bash
yarn install
# or
npm install
```

### 3️⃣ Setup Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

### 4️⃣ Run Development Server

```bash
yarn dev
# or
npm run dev
```

Visit 👉 [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
product-management-app/
├── src/
│   ├── app/
│   │   │
│   │   ├── products/
│   │   │   ├── [slug]/page.tsx
│   │   │   ├── create/page.tsx
│   │   │   ├── edit/page.tsx
│   │   │   └── page.tsx
│   │   ├── login/page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── products/
│   │   │   ├── category-filter.tsx
│   │   │   ├── confirm-modal.tsx
│   │   │   ├── pagination.tsx
│   │   │   ├── product-card.tsx
│   │   │   ├── product-form.tsx
│   │   │   └── search-bar.tsx
│   │   └── ui/
│   │       ├── app-navbar.tsx
│   │       ├── button.tsx
│   │       ├── form-input.tsx
│   │       ├── global-error.tsx
│   │       ├── modal.tsx
│   │       ├── select.tsx
│   │       ├── spinner.tsx
│   │       └── text-area.tsx
│   ├── helpers/
│   │   └── index.ts
│   ├── lib/
│   │   └── icons.ts
│   ├── redux/
│   │   ├── api/apiSlice.ts
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   └── productsSlice.ts
│   │   ├── hooks.ts
│   │   ├── provider.tsx
│   │   ├── rootReducer.ts
│   │   └── store.ts
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       ├── config.ts
│       └── validation.ts
├── public/
│   ├── assets/pma-logo.svg
│   └── *.svg
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🔐 Authentication & Security

### 🔄 Flow

1. User enters email on login page
2. API validates and returns token
3. Token stored in secure HTTP-only cookie
4. Middleware validates for protected routes
5. Redux updates `auth` state
6. Redirect to dashboard

### 🔒 Security Features

- HTTP-only cookies
- Secure flag for HTTPS
- SameSite protection
- Middleware-level route protection
- Automatic 401 handling

### 🧭 Protected Routes

- `/` – Dashboard
- `/products` – Products list
- `/products/create` – Add new product
- `/products/edit/:id` – Edit product
- `/products/:slug` – Product details

---

## 🎯 Usage Guide

### Login

1. Visit `/login`
2. Enter email → click **Sign In**
3. Redirects to dashboard

### View Products

- Browse all products
- Use **search bar** or **category filters**
- Navigate pages with pagination

### Create Product

1. Click **Add Product**
2. Fill details (name, description, images, etc.)
3. Submit to create

### Edit / Delete

- Edit via product detail page
- Delete with confirmation modal

## 🔄 API Integration

### Endpoints

| Method | Endpoint           | Description         |
| ------ | ------------------ | ------------------- |
| POST   | `/auth`            | Login               |
| GET    | `/products`        | List all products   |
| GET    | `/products/:id`    | Get product by ID   |
| GET    | `/products/:slug`  | Get product by slug |
| POST   | `/products`        | Create new product  |
| PUT    | `/products/:id`    | Update product      |
| DELETE | `/products/:id`    | Delete product      |
| GET    | `/products/search` | Search products     |
| GET    | `/categories`      | Get all categories  |

## 🎨 Styling

### Color Palette

```typescript
colors: {
  primary: '#0D1821',
  secondary: '#EFF1F3',
  accent: {
    green: '#4E6E5D',
    gold: '#AD8A64',
    red: '#A44A3F'
  }
}
```

### UI Components

- 🖱️ Button (primary / secondary / outline / danger)
- ✍️ FormInput (validated)
- 🔽 Select Dropdown
- 🧾 TextArea
- 🪟 Modal Dialog
- 🔄 Spinner Loader

---

## 📦 Build & Deployment

### Build for Production

```bash
yarn build
# or
npm run build
```

### Start Production

```bash
yarn start
# or
npm start
```

## 🐛 Troubleshooting

| Issue              | Cause                 | Solution                                    |
| ------------------ | --------------------- | ------------------------------------------- |
| Image not loading  | Unconfigured hostname | Add to `images.domains` in `next.config.ts` |
| 401 Unauthorized   | Invalid token         | Re-login or refresh token                   |
| CORS errors        | API base mismatch     | Fix `.env.local`                            |
| Hydration mismatch | Cache issue           | Clear `.next` folder and rebuild            |

```bash
rm -rf .next
yarn build && yarn dev
```

---

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Redux Toolkit Docs](https://redux-toolkit.js.org)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [RTK Query Docs](https://redux-toolkit.js.org/rtk-query/overview)

---

## 🤝 Contributing

1. Fork this repo
2. Create a feature branch
3. Commit your changes
4. Push and open a PR

---

## 📝 Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

---

## 🚀 Performance Optimization

- ✅ Next.js Image Optimization
- ✅ Automatic Code Splitting
- ✅ RTK Query Caching
- ✅ Lazy Loading
- ✅ Turbopack for fast builds

---

## 📄 License

Licensed under the **MIT License**.

---

## 👥 Author

Rasel Hossain

---

**Version:** 0.1.0
**Last Updated:** 2025
**Status:** 🚧 Active Development
