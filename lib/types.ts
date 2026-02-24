export interface Location {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates?: Coordinates;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
}

export interface TrackingUpdate {
  id: string;
  timestamp: Date;
  location: string;
  status: string;
  notes?: string;
}

export interface Load {
  id: string;
  loadNumber: string;
  shipperId: string;
  shipperName: string;
  origin: Location;
  destination: Location;
  pickupDate: Date;
  deliveryDate: Date;
  estimatedDeliveryDate: Date;
  cargo: {
    category: string;
    type: string;
    weight: number;
    volume: number;
    quantity?: number;
    packagingType?: string;
    specialRequirements?: string[];
  };
  pickupTime?: string;
  deliveryTime?: string;
  distance?: number;
  estimatedDuration?: string;
  contactPerson?: {
    pickup: {
      name: string;
      phone: string;
    };
    delivery: {
      name: string;
      phone: string;
    };
  };
  instructions?: {
    pickup?: string;
    delivery?: string;
    handling?: string;
  };
  vehicleRequirements?: {
    bodyType: "open-body" | "closed-body" | "flatbed" | "container" | "tanker" | "refrigerated" | "trailer";
    size: string;
    capacity?: string;
  };
  status: "pending" | "confirmed" | "in-transit" | "delivered" | "cancelled";
  assignedTruck?: string;
  assignedDriver?: string;
  revenue: number;
  documents: Document[];
  trackingUpdates: TrackingUpdate[];
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  licenseNumber: string;
  rating: number;
}

export interface Vehicle {
  id: string;
  truckNumber: string;
  licensePlate: string;
  type: "dry-van" | "flatbed" | "refrigerated" | "tanker";
  capacity: {
    weight: number;
    volume: number;
  };
  status: "available" | "in-transit" | "maintenance" | "offline";
  currentLocation?: Coordinates;
  assignedDriver?: Driver;
  lastMaintenance: Date;
  nextMaintenance: Date;
  fuelEfficiency: number;
  yearManufactured: number;
}

export interface Shipper {
  id: string;
  shipperId: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: Location;
  paymentTerms: string;
  totalBusinessVolume: number;
  averageLoadValue: number;
  reliabilityScore: number;
  rating: number;
  activeLoadsCount: number;
  totalRatings: number;
  profileImage: string | null;
  // New API fields
  companyRegistrationType: string | null;
  yearsInBusiness: string | null;
  pincode: string | null;
  noSecondPoc: boolean;
  namePoc: string | null;
  phonePoc: string | null;
  gstNotApplicable: boolean;
  gstNumber: string | null;
  legalName: string | null;
  gstCertificate: string | null;
  panNumber: string | null;
  nameAsPerPan: string | null;
  dobAsPerPan: string | null;
  panImage: string | null;
  profileCreatedAt: string | null;
  profileUpdatedAt: string | null;
  kycVerified: string;
  status: string;
}

export interface TruckerBid {
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

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  phone?: string;
}
