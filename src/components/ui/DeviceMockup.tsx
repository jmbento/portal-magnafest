interface DeviceMockupProps {
  children: React.ReactNode;
  type: 'desktop' | 'mobile';
}

export const DeviceMockup = ({ children, type }: DeviceMockupProps) => {
  if (type === 'desktop') {
    return (
      <div className="relative w-full max-w-4xl mx-auto">
        {/* MacBook Frame */}
        <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-2xl p-3 shadow-2xl">
          {/* Top Bar (Camera + Speakers) */}
          <div className="flex items-center justify-center mb-2">
            <div className="w-2 h-2 bg-gray-700 rounded-full" />
          </div>
          
          {/* Screen */}
          <div className="bg-black rounded-lg overflow-hidden border-2 border-gray-800">
            <div className="aspect-[16/10] overflow-auto">
              {children}
            </div>
          </div>
        </div>
        
        {/* MacBook Base */}
        <div className="relative h-4 bg-gradient-to-b from-gray-800 to-gray-900">
          <div className="absolute inset-x-0 top-0 h-2 bg-gray-700 rounded-b-3xl" />
        </div>
        
        {/* Shadow */}
        <div className="absolute inset-x-8 -bottom-8 h-8 bg-black/30 blur-2xl rounded-full" />
      </div>
    );
  }

  // Mobile (iPhone)
  return (
    <div className="relative w-full max-w-[280px] mx-auto">
      {/* iPhone Frame */}
      <div className="relative bg-black rounded-[3rem] p-3 shadow-2xl border-8 border-gray-900">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-3xl z-10" />
        
        {/* Screen */}
        <div className="bg-white rounded-[2.5rem] overflow-hidden relative">
          <div className="aspect-[9/19.5] overflow-auto bg-black">
            {children}
          </div>
        </div>
        
        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-gray-700 rounded-full" />
      </div>
      
      {/* Shadow */}
      <div className="absolute inset-x-4 -bottom-4 h-8 bg-black/40 blur-xl rounded-full" />
    </div>
  );
};
