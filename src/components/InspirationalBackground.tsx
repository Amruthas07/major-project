import React from 'react';

/**
 * InspirationalBackground Component
 * 
 * Renders a fixed, low-opacity (0.10) background layer displaying the
 * inspiring photograph of a confident, strong South Asian pregnant woman silhouetted
 * against a serene, inspiring natural sunrise mountain vista (as seen in image_8.png, right-side).
 * 
 * Configured in a fixed background layer (`pointer-events-none`, `z-0`, `background-size: cover`, `opacity: 0.10`)
 * so dashboard metric cards, nutrient charts, and tables overlay it cleanly without covering text.
 */
export const InspirationalBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none print:hidden"
    >
      {/* High-Resolution Conceptual Photograph from image_8.png */}
      <div
        className="w-full h-full"
        style={{
          backgroundImage: 'url(/assets/aistudio/sunrise_silhouette_clean.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 25%',
          backgroundRepeat: 'no-repeat',
          opacity: 0.10,
        }}
      />
    </div>
  );
};
