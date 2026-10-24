import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { products, mockOrders, mockCustomers, dashboardStats } from '../data/appData';

const AppContext = createContext();

// Detect initial theme preference
const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('rathory_theme');
    if (saved) return saved;
  }
  return 'light'; // Default to clean luxury light mode as in reference design
};

const initialState = {
  // Theme: 'light' | 'dark' | 'system'
  theme: getInitialTheme(),
  resolvedTheme: 'light',

  // Auth
  user: null,
  isAdmin: false,
  isAuthenticated: false,

  // Cart
  cart: [],
  cartTotal: 0,

  // Products
  products: products,

  // Orders
  orders: mockOrders,
  customerOrders: [],

  // Customers
  customers: mockCustomers,

  // UI
  toasts: [],
  sidebarOpen: false,
  mobileMenuOpen: false,
  lightboxImage: null,

  // Admin
  dashboardStats: dashboardStats,

  // Favorites
  favorites: [1, 5, 12, 16],
};

function appReducer(state, action) {
  switch (action.type) {
    // Theme
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_RESOLVED_THEME':
      return { ...state, resolvedTheme: action.payload };

    // Auth
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isAdmin: action.payload.role === 'admin',
        customerOrders: state.orders.filter(o => o.customerName === action.payload.name),
      };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, isAdmin: false, customerOrders: [] };
    case 'UPDATE_PROFILE':
      return { ...state, user: { ...state.user, ...action.payload } };

    // Cart
    case 'ADD_TO_CART': {
      const existing = state.cart.find(item => item.id === action.payload.id);
      let newCart;
      if (existing) {
        newCart = state.cart.map(item =>
          item.id === action.payload.id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        newCart = [...state.cart, { ...action.payload, qty: 1 }];
      }
      return { ...state, cart: newCart, cartTotal: calcTotal(newCart) };
    }
    case 'REMOVE_FROM_CART': {
      const newCart = state.cart.filter(item => item.id !== action.payload);
      return { ...state, cart: newCart, cartTotal: calcTotal(newCart) };
    }
    case 'UPDATE_QTY': {
      const { id, qty } = action.payload;
      if (qty <= 0) {
        const newCart = state.cart.filter(item => item.id !== id);
        return { ...state, cart: newCart, cartTotal: calcTotal(newCart) };
      }
      const newCart = state.cart.map(item =>
        item.id === id ? { ...item, qty } : item
      );
      return { ...state, cart: newCart, cartTotal: calcTotal(newCart) };
    }
    case 'CLEAR_CART':
      return { ...state, cart: [], cartTotal: 0 };

    // Orders
    case 'PLACE_ORDER': {
      const newOrder = action.payload;
      return {
        ...state,
        orders: [newOrder, ...state.orders],
        customerOrders: [newOrder, ...state.customerOrders],
        cart: [],
        cartTotal: 0,
      };
    }
    case 'UPDATE_ORDER_STATUS': {
      const { orderId, status } = action.payload;
      const updatedOrders = state.orders.map(o =>
        o.id === orderId ? { ...o, orderStatus: status } : o
      );
      return { ...state, orders: updatedOrders };
    }

    // Products (Admin)
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => p.id === action.payload.id ? action.payload : p),
      };
    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter(p => p.id !== action.payload) };

    // Favorites
    case 'TOGGLE_FAVORITE': {
      const isFav = state.favorites.includes(action.payload);
      return {
        ...state,
        favorites: isFav
          ? state.favorites.filter(id => id !== action.payload)
          : [...state.favorites, action.payload],
      };
    }

    // UI
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, { ...action.payload, id: Date.now() }] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'TOGGLE_MOBILE_MENU':
      return { ...state, mobileMenuOpen: !state.mobileMenuOpen };
    case 'SET_LIGHTBOX':
      return { ...state, lightboxImage: action.payload };

    default:
      return state;
  }
}

function calcTotal(cart) {
  return cart.reduce((sum, item) => {
    const discountedPrice = item.discount
      ? item.price - (item.price * item.discount / 100)
      : item.price;
    return sum + discountedPrice * item.qty;
  }, 0);
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Sync theme with document & localStorage
  useEffect(() => {
    const root = document.documentElement;
    let effective = state.theme;

    if (state.theme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      effective = systemDark ? 'dark' : 'light';
    }

    dispatch({ type: 'SET_RESOLVED_THEME', payload: effective });
    root.setAttribute('data-theme', effective);
    if (effective === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('rathory_theme', state.theme);

    // Listener for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (state.theme === 'system') {
        const newEff = e.matches ? 'dark' : 'light';
        dispatch({ type: 'SET_RESOLVED_THEME', payload: newEff });
        root.setAttribute('data-theme', newEff);
        if (newEff === 'dark') {
          root.classList.add('dark');
          root.classList.remove('light');
        } else {
          root.classList.add('light');
          root.classList.remove('dark');
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [state.theme]);

  // Auto-remove toasts
  useEffect(() => {
    if (state.toasts.length > 0) {
      const timer = setTimeout(() => {
        dispatch({ type: 'REMOVE_TOAST', payload: state.toasts[0].id });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.toasts]);

  const addToast = (message, type = 'success') => {
    dispatch({ type: 'ADD_TOAST', payload: { message, type } });
  };

  const setTheme = (themeMode) => {
    dispatch({ type: 'SET_THEME', payload: themeMode });
  };

  return (
    <AppContext.Provider value={{ state, dispatch, addToast, setTheme }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

export default AppContext;
