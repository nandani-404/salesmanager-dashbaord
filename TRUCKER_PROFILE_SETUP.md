# Trucker Profile Feature

## Overview
This feature allows users to view trucker profiles and manage trucker information through a comprehensive profile page.

## Files Created

### 1. Trucker Profile Page
**Path:** `app/(dashboard)/truckers/[id]/page.tsx`

A detailed profile page for individual truckers with the following sections:
- **Profile Header**: Shows trucker name, TM ID, and profile completion status
- **Basic Details**: Name, Company Name, Email, Mobile Number, Profile Image upload
- **Business Details**: Years in Business, Fleet Size, Office Address, State, City, PIN Code
- **Bank Details**: Bank Name (dropdown with 30+ Indian banks), Account Number, IFSC Code
- **KYC Details**: PAN, GST, Aadhar with document upload functionality

### 2. Truckers List Page
**Path:** `app/(dashboard)/truckers/page.tsx`

Displays all truckers in a grid layout with:
- Trucker avatar and name
- Company name
- Rating (star display)
- Completed loads count
- Truck type and number
- "View Profile" and "Contact" buttons

### 3. Trucker Bids Section Component
**Path:** `components/dashboard/trucker-bids-section.tsx`

A reusable component that displays trucker bids for a load:
- Bid cards with trucker information
- Bid amount, truck details, and dates
- Status badges (pending, accepted, rejected, counter-offered)
- "View Profile" button that navigates to trucker profile
- Action buttons (Accept Bid, Counter Offer, Contact)

### 4. Updated Files

#### Load Details Page
**Path:** `app/(dashboard)/loads/[id]/page.tsx`
- Added import for `mockTruckerBids` and `TruckerBidsSection`
- Integrated trucker bids display in load details
- Shows all bids for the current load

#### Sidebar Navigation
**Path:** `components/layout/sidebar.tsx`
- Added "Truckers" menu item with Users icon
- Renamed "My Truckers" to "My Vehicles" for clarity

## Navigation Flow

1. **From Loads Page:**
   - Navigate to `/loads` → Click on a load → View trucker bids → Click "View Profile" button

2. **From Truckers Page:**
   - Navigate to `/truckers` → View all truckers → Click "View Profile" button

3. **Direct Access:**
   - Navigate to `/truckers/[id]` where `[id]` is the trucker's unique identifier

## Features

### Profile Page Features
- ✅ Complete profile form with validation-ready inputs
- ✅ File upload placeholders for Profile Image, PAN, GST, and Aadhar
- ✅ Dropdown selects for Years in Business, Fleet Size, and Bank Name
- ✅ Responsive grid layout (2 columns on desktop, 1 on mobile)
- ✅ Form state management with React hooks
- ✅ Back navigation button
- ✅ Save and Cancel buttons

### Trucker Bids Features
- ✅ Display multiple bids per load
- ✅ Color-coded status badges
- ✅ Rating display with star icon
- ✅ Completed loads count
- ✅ Truck and driver information
- ✅ Pickup and delivery dates
- ✅ Bid notes display
- ✅ Action buttons for bid management

## Data Structure

The trucker profile uses the `TruckerBid` type from `lib/types.ts`:
```typescript
interface TruckerBid {
  id: string;
  bidNumber: string;
  truckerName: string;
  truckerCompany: string;
  loadId: string;
  loadNumber: string;
  bidAmount: number;
  truckType: "dry-van" | "flatbed" | "refrigerated" | "tanker";
  truckNumber: string;
  driverName: string;
  driverPhone: string;
  pickupDate: Date;
  deliveryDate: Date;
  status: "pending" | "accepted" | "rejected" | "counter-offered";
  submittedAt: Date;
  validUntil: Date;
  rating: number;
  completedLoads: number;
  gstNumber?: string;
  notes?: string;
}
```

## Next Steps

To complete the implementation:

1. **Backend Integration:**
   - Connect form submission to API endpoint
   - Implement file upload functionality
   - Add form validation

2. **Additional Features:**
   - Add edit mode toggle
   - Implement profile completion percentage
   - Add document preview functionality
   - Create trucker verification workflow

3. **Enhancements:**
   - Add profile photo cropping
   - Implement real-time validation
   - Add success/error notifications
   - Create profile history/audit log
