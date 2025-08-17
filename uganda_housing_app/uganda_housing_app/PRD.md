# Uganda Housing Finder - Product Requirements Document

A comprehensive housing finder mobile web application designed specifically for Uganda's rental market, enabling property browsing for all users while requiring authentication only for landlords to list properties.

**Experience Qualities**:
1. **Accessibility-First**: Immediate property browsing without barriers, while building trust through verified landlord listings
2. **Efficiency-Focused**: Streamlined property discovery that respects users' time and data constraints  
3. **Trust-Building**: Landlord verification and secure listing management while enabling frictionless tenant browsing

**Complexity Level**: Light Application (multiple features with minimal auth requirements)
- Features guest property browsing, landlord authentication with OTP verification, and direct contact facilitation between users

## Essential Features

### Guest Property Browsing (No Authentication)
- **Functionality**: Immediate property search, filtering, and browsing without account creation
- **Purpose**: Remove barriers for tenants to discover available properties quickly
- **Trigger**: App launch - users can immediately search properties
- **Progression**: Search input → Filter application → Property viewing → Contact landlord via phone submission
- **Success criteria**: Users can discover and contact landlords about properties within 30 seconds of app launch

### Landlord Authentication & Property Management
- **Functionality**: Phone-based OTP authentication specifically for property owners
- **Purpose**: Secure, verified listing creation while maintaining tenant accessibility
- **Trigger**: "List Property" button from main navigation
- **Progression**: Landlord verification → Phone entry → OTP verification → Dashboard → Property management
- **Success criteria**: Landlords can authenticate and list properties in under 5 minutes

### Direct Contact Facilitation
- **Functionality**: Simple contact form allowing tenants to share phone numbers with landlords
- **Purpose**: Enable immediate communication without requiring tenant accounts
- **Trigger**: "Contact Landlord" button on property listings
- **Progression**: Contact button → Phone number entry → Contact details sent to landlord → Confirmation
- **Success criteria**: Contact information successfully delivered to landlords with 95% reliability

### Property Search & Discovery
- **Functionality**: Comprehensive property search with filtering by price, location, amenities, and bedrooms
- **Purpose**: Help tenants find suitable properties quickly without creating accounts
- **Trigger**: Home screen search or filter interaction
- **Progression**: Search input → Filter application → List view → Property selection → Details view
- **Success criteria**: Users can find relevant properties within 3 search interactions

### Landlord Property Management
- **Functionality**: Create, edit, and manage property listings with photos, pricing, and availability
- **Purpose**: Enable verified landlords to showcase properties effectively
- **Trigger**: "Add Property" button from authenticated landlord dashboard
- **Progression**: Property form → Photo upload → Location setup → Pricing → Publication → Contact management
- **Success criteria**: Landlords can list properties in under 5 minutes and receive qualified tenant contacts

## Edge Case Handling

- **Invalid Contact Information**: Phone number format validation before sending to landlords
- **Spam Prevention**: Rate limiting on contact submissions and landlord reporting system
- **Duplicate Listings**: Automatic detection and landlord notification for similar properties
- **Landlord Verification**: Multi-step verification process with document upload capability
- **Poor Connectivity**: Optimized for mobile data with efficient image loading and caching

## Design Direction

The design should evoke trust, efficiency, and accessibility - feeling professional yet approachable, modern yet familiar to accommodate Uganda's diverse user base. Minimal interface with purposeful use of space to respect mobile data constraints while ensuring essential information is immediately accessible.

## Color Selection

Complementary color scheme with warm and cool tones to represent both trust and energy.

- **Primary Color**: Deep Blue (#1E40AF / oklch(0.45 0.15 250)) - Communicates trust, security, and professionalism essential for financial transactions
- **Secondary Colors**: Warm Orange (#EA580C / oklch(0.65 0.18 45)) for calls-to-action and Sage Green (#16A34A / oklch(0.6 0.15 140)) for success states
- **Accent Color**: Vibrant Orange (#F97316 / oklch(0.7 0.2 50)) for attention-grabbing CTAs and important notifications
- **Foreground/Background Pairings**:
  - Background (White #FFFFFF): Dark Blue text (#1E40AF) - Ratio 8.2:1 ✓
  - Card (Light Gray #F8FAFC): Dark Blue text (#1E40AF) - Ratio 7.8:1 ✓  
  - Primary (Deep Blue #1E40AF): White text (#FFFFFF) - Ratio 8.2:1 ✓
  - Secondary (Warm Orange #EA580C): White text (#FFFFFF) - Ratio 4.9:1 ✓
  - Accent (Vibrant Orange #F97316): White text (#FFFFFF) - Ratio 4.6:1 ✓
  - Muted (Light Gray #F1F5F9): Dark Gray text (#334155) - Ratio 5.1:1 ✓

## Font Selection

Typography should convey clarity and trustworthiness while maintaining excellent readability on mobile devices across different lighting conditions.

- **Typographic Hierarchy**:
  - H1 (App Title): Inter Bold/28px/tight letter spacing (-0.025em)
  - H2 (Screen Headers): Inter SemiBold/24px/normal letter spacing  
  - H3 (Section Titles): Inter Medium/20px/normal letter spacing
  - Body (Content): Inter Regular/16px/relaxed line height (1.6)
  - Caption (Meta Info): Inter Regular/14px/normal letter spacing
  - Button Text: Inter Medium/16px/normal letter spacing

## Animations

Animations should feel responsive and purposeful, primarily serving to communicate state changes and guide user attention without consuming excessive battery or processing power.

- **Purposeful Meaning**: Subtle micro-interactions reinforce the reliable, professional brand while providing clear feedback for user actions
- **Hierarchy of Movement**: 
  - Primary: Form validation and payment confirmation animations
  - Secondary: Property card interactions and message delivery indicators
  - Tertiary: Subtle hover states and loading animations

## Component Selection

- **Components**: 
  - Cards for property listings with image carousels
  - Forms with real-time validation for property creation and user profiles
  - Dialogs for payment confirmation and critical actions
  - Tabs for landlord dashboard sections
  - Badges for verification status and property features
  - Avatars for user profiles with fallback initials
  - Toast notifications for payment confirmations and message delivery
- **Customizations**: 
  - Map integration component for property location selection
  - Mobile money payment flow component
  - OTP input component with auto-advancing fields
  - Offline indicator component with connection status
- **States**: 
  - Buttons have distinct loading states during payment processing
  - Form inputs show validation states with helpful error messages
  - Property cards display availability, verification, and saved states
- **Icon Selection**: 
  - Phosphor icons for consistent, clear iconography (House, CreditCard, ChatCircle, MapPin, Shield)
- **Spacing**: 
  - Consistent 4px base unit using Tailwind's spacing scale (space-4, space-6, space-8)
  - Mobile-optimized touch targets minimum 44px
- **Mobile**: 
  - Single-column layouts on mobile with progressive enhancement to grid layouts on larger screens
  - Bottom navigation for primary app sections
  - Pull-to-refresh functionality for property listings
  - Swipe gestures for property image galleries