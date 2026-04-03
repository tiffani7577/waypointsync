/**
 * WAYPOINTSYNC — Mock Data
 * Realistic demo data modeled after a Florida state park concession operation.
 * Replace with live FareHarbor API + Lightspeed API calls when credentials are available.
 */

import type { Booking } from "@/contexts/CartContext";

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: "fh-001",
    confirmationCode: "FH-2024-8821",
    customerName: "Martinez, Carlos",
    tourName: "Guided Cave Tour",
    tourTime: "10:00 AM",
    partySize: 4,
    depositPaid: 80.00,
    balanceDue: 0,
    waiverSigned: true,
    waiverCount: 4,
  },
  {
    id: "fh-002",
    confirmationCode: "FH-2024-8822",
    customerName: "Thompson, Sarah",
    tourName: "Guided Cave Tour",
    tourTime: "10:00 AM",
    partySize: 2,
    depositPaid: 40.00,
    balanceDue: 0,
    waiverSigned: true,
    waiverCount: 2,
  },
  {
    id: "fh-003",
    confirmationCode: "FH-2024-8830",
    customerName: "Johnson, Mike",
    tourName: "Kayak Adventure",
    tourTime: "11:30 AM",
    partySize: 3,
    depositPaid: 60.00,
    balanceDue: 30.00,
    waiverSigned: false,
    waiverCount: 0,
  },
  {
    id: "fh-004",
    confirmationCode: "FH-2024-8845",
    customerName: "Williams, Emma",
    tourName: "Guided Cave Tour",
    tourTime: "1:00 PM",
    partySize: 6,
    depositPaid: 120.00,
    balanceDue: 0,
    waiverSigned: true,
    waiverCount: 6,
  },
  {
    id: "fh-005",
    confirmationCode: "FH-2024-8851",
    customerName: "Davis, Robert",
    tourName: "Kayak Adventure",
    tourTime: "2:30 PM",
    partySize: 2,
    depositPaid: 0,
    balanceDue: 80.00,
    waiverSigned: false,
    waiverCount: 0,
  },
];

export interface Product {
  id: string;
  name: string;
  price: number;
  category: "retail" | "food";
  emoji: string;
  sku: string;
  inStock: number;
}

export const MOCK_PRODUCTS: Product[] = [
  // Retail
  { id: "ls-001", name: "Park Logo T-Shirt (S)", price: 22.00, category: "retail", emoji: "👕", sku: "SHIRT-S", inStock: 18 },
  { id: "ls-002", name: "Park Logo T-Shirt (M)", price: 22.00, category: "retail", emoji: "👕", sku: "SHIRT-M", inStock: 24 },
  { id: "ls-003", name: "Park Logo T-Shirt (L)", price: 22.00, category: "retail", emoji: "👕", sku: "SHIRT-L", inStock: 31 },
  { id: "ls-004", name: "Park Logo T-Shirt (XL)", price: 22.00, category: "retail", emoji: "👕", sku: "SHIRT-XL", inStock: 12 },
  { id: "ls-005", name: "Souvenir Hat", price: 28.00, category: "retail", emoji: "🧢", sku: "HAT-001", inStock: 15 },
  { id: "ls-006", name: "Sunscreen SPF 50", price: 12.00, category: "retail", emoji: "🧴", sku: "SUN-001", inStock: 40 },
  { id: "ls-007", name: "Bug Spray", price: 9.00, category: "retail", emoji: "🌿", sku: "BUG-001", inStock: 35 },
  { id: "ls-008", name: "Sunglasses", price: 18.00, category: "retail", emoji: "🕶️", sku: "SGL-001", inStock: 20 },
  { id: "ls-009", name: "Reusable Water Bottle", price: 16.00, category: "retail", emoji: "🍶", sku: "BTL-001", inStock: 22 },
  { id: "ls-010", name: "Souvenir Magnet", price: 6.00, category: "retail", emoji: "🧲", sku: "MAG-001", inStock: 60 },
  // Food & Beverage
  { id: "ls-011", name: "Bottled Water", price: 2.50, category: "food", emoji: "💧", sku: "WTR-001", inStock: 200 },
  { id: "ls-012", name: "Soft Drink", price: 3.50, category: "food", emoji: "🥤", sku: "SDR-001", inStock: 80 },
  { id: "ls-013", name: "Granola Bar", price: 3.00, category: "food", emoji: "🍫", sku: "GRN-001", inStock: 50 },
  { id: "ls-014", name: "Chips", price: 2.50, category: "food", emoji: "🥨", sku: "CHP-001", inStock: 60 },
  { id: "ls-015", name: "Hot Dog", price: 6.00, category: "food", emoji: "🌭", sku: "HDG-001", inStock: 30 },
  { id: "ls-016", name: "Nachos", price: 7.00, category: "food", emoji: "🫔", sku: "NAC-001", inStock: 25 },
  { id: "ls-017", name: "Ice Cream", price: 4.50, category: "food", emoji: "🍦", sku: "ICE-001", inStock: 40 },
  { id: "ls-018", name: "Coffee", price: 3.00, category: "food", emoji: "☕", sku: "COF-001", inStock: 100 },
];
