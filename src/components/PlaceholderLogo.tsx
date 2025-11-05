import React from 'react';

// Define the colors for a clean, professional look
// A neutral background with a professional, contrasting text color
const NEUTRAL_GRAY = '#F0F0F0'; // Light gray background for the shape
const PRIMARY_BLUE = '#2e6bac'; // Use the 'brand blue' from your original to maintain a familiar color aesthetic

const PlaceholderLogo: React.FC<{ className?: string }> = ({ className }) => {
  const text = 'LOGO';

  return (
    // Set a consistent viewBox for a clear aspect ratio (e.g., 5:2)
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      width="150" // Example default width
      height="60" // Example default height
      viewBox="0 0 300 120" // The internal coordinate system (300 wide, 120 high)
      className={className}
      aria-label="Placeholder Logo"
      role="img"
    >
      {/* 1. The main shape: a rounded rectangle */}
      <rect
        x="10"
        y="10"
        width="280"
        height="100"
        rx="15" // Rounded corners
        ry="15"
        fill={NEUTRAL_GRAY}
        stroke={PRIMARY_BLUE} // Border in the brand color
        strokeWidth="4"
      />

      {/* 2. The text "LOGO" centered inside the shape */}
      <text
        x="150" // Center X position
        y="68" // Adjust Y for vertical centering based on font size
        fontFamily="Arial, sans-serif"
        fontSize="55" // Large, readable font size
        fontWeight="bold"
        fill={PRIMARY_BLUE}
        textAnchor="middle" // Center the text on the X coordinate
        dominantBaseline="middle" // Ensure perfect vertical centering
        style={{ letterSpacing: '2px' }} // A little breathing room for the text
      >
        {text}
      </text>

      {/* 3. A subtle, secondary line to represent a design element */}
      <line
        x1="10"
        y1="110"
        x2="290"
        y2="110"
        stroke={PRIMARY_BLUE}
        strokeWidth="2"
        strokeOpacity="0.5"
      />
    </svg>
  );
};

export default PlaceholderLogo;
