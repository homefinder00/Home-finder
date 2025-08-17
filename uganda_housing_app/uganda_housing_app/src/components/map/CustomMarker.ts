import L from 'leaflet'

// Create custom marker icon with better styling
export const createCustomMarker = (price?: number, currency?: string) => {
  const priceText = price && currency ? `${currency} ${price.toLocaleString()}` : ''
  
  return L.divIcon({
    html: `
      <div class="custom-marker">
        <div class="marker-pin"></div>
        ${priceText ? `<div class="marker-price">${priceText}</div>` : ''}
      </div>
    `,
    className: 'custom-marker-container',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  })
}

// Add custom CSS for markers
const markerStyles = `
  .custom-marker-container {
    background: none !important;
    border: none !important;
  }

  .custom-marker {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .marker-pin {
    width: 24px;
    height: 24px;
    background: oklch(0.55 0.2 15);
    border: 2px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    position: relative;
  }

  .marker-pin::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 8px solid oklch(0.55 0.2 15);
  }

  .marker-price {
    background: oklch(0.55 0.2 15);
    color: white;
    padding: 2px 6px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 600;
    white-space: nowrap;
    margin-top: 4px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  }

  .marker-price::before {
    content: '';
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 4px solid oklch(0.55 0.2 15);
  }
`

// Inject styles once
let stylesInjected = false
export const injectMarkerStyles = () => {
  if (!stylesInjected) {
    const style = document.createElement('style')
    style.textContent = markerStyles
    document.head.appendChild(style)
    stylesInjected = true
  }
}