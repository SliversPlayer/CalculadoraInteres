export function formatLargeNumber(value) {
    const numValue = parseInt(value);
    
    if (numValue >= 1000000) {
      return `$${(numValue / 1000000).toFixed(1)}M`;
    } else if (numValue >= 1000) {
      return `$${(numValue / 1000).toFixed(1)}k`;
    } else {
      return `$${numValue}`;
    }
  };