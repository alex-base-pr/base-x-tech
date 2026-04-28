export function getUkraineUTCOffset() {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Kiev',
      hour: 'numeric',
      hour12: false,
      timeZoneName: 'longOffset'
    });
    
    const parts = formatter.formatToParts(now);
    const offsetPart = parts.find(part => part.type === 'timeZoneName');
    
    if (offsetPart && offsetPart.value) {
      const match = offsetPart.value.match(/GMT([+-])(\d+)/);
      if (match) {
        const sign = match[1];
        const hours = parseInt(match[2], 10);
        return `${sign}${hours}`;
      }
    }
    
    const ukraineDate = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Kiev' }));
    const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    const offsetHours = Math.round((ukraineDate - utcDate) / (1000 * 60 * 60));
    
    return offsetHours > 0 ? `+${offsetHours}` : `${offsetHours}`;
  } catch (error) {
    console.error('Error getting Ukraine UTC offset:', error);
    return '+2';
  }
}

export function updateUTCDisplay() {
  const utcOffset = getUkraineUTCOffset();
  
  const selectors = [
    'small',
    'span'
  ];
  
  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(element => {
      const text = element.textContent.trim();
      
      if (text.match(/^UTC:\s*[+-]?\d+$/)) {
        element.textContent = `UTC: ${utcOffset}`;
      } else if (text.match(/^UTC[+-]?\d+$/)) {
        element.textContent = `UTC${utcOffset}`;
      }
    });
  });
}

export function initializeTimezone() {
  updateUTCDisplay();
  
  setInterval(updateUTCDisplay, 3600000);
}
