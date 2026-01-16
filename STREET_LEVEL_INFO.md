# Street-Level Address Components Extraction

## What Changed

I've updated both `AddressFinder.jsx` and `Generic_Components.jsx` to extract and display detailed street-level information from Google Places API.

## Extracted Components

Now the following address components are extracted from each search result:

1. **streetNumber** - The building/house number (e.g., "123")
2. **route** - The street name (e.g., "Main Street")
3. **locality** - City name (e.g., "New York")
4. **administrativeArea** - State/Province (e.g., "NY")
5. **country** - Country code (e.g., "US")
6. **postalCode** - Zip/Postal code (e.g., "10001")
7. **isStreetLevel** - Boolean flag indicating if the address has both street number AND route

## Visual Changes

The dropdown now displays:

```
┌─────────────────────────────────────────────────────┐
│ 123 Main Street, New York, NY 10001, USA            │
│ [Street Level] Number: 123  Street: Main Street     │
│ Postal: 10001                                       │
└─────────────────────────────────────────────────────┘
```

- **Green "Street Level" badge** appears when the address has both street number and street name
- **Detailed breakdown** shows individual components below the formatted address
- All components are available in the `place` object passed to `onSelect()`

## How to Use the Data

When a user selects an address, the `onSelect` callback receives:

```javascript
{
  formatted_address: "123 Main Street, New York, NY 10001, USA",
  geometry: { location: { lat: 40.7128, lng: -74.0060 } },
  place_id: "ChIJ...",

  // NEW: Extracted components
  streetNumber: "123",
  route: "Main Street",
  locality: "New York",
  administrativeArea: "NY",
  country: "US",
  postalCode: "10001",
  isStreetLevel: true  // true if has both streetNumber AND route
}
```

## Street-Level Validation

The `isStreetLevel` flag is set to `true` only when BOTH conditions are met:
- `streetNumber` exists (e.g., "123")
- `route` exists (e.g., "Main Street")

### Examples:

✅ **Street Level** - "123 Main Street, New York, NY 10001"
- Has streetNumber: "123"
- Has route: "Main Street"
- isStreetLevel: **true**

❌ **NOT Street Level** - "New York, NY 10001"
- No streetNumber
- No route
- isStreetLevel: **false**

❌ **NOT Street Level** - "Times Square, New York, NY"
- No streetNumber
- May have route, but no specific building number
- isStreetLevel: **false** (depends on Google's data)

## Files Modified

1. `/frontend/src/components/AddressFinder.jsx` (lines 25-58, 116-156)
2. `/frontend/src/components/Generic_Components.jsx` (lines 958-996, 1084-1124)

## Next Steps (Optional)

If you want to enforce street-level addresses only, you could:

1. **Filter results** - Only show addresses where `isStreetLevel === true`
2. **Add validation** - Show warning if user selects non-street-level address
3. **Sort results** - Put street-level addresses at the top of the list
