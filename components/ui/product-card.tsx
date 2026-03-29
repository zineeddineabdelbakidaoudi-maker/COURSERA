"use client"

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import React, { useRef } from 'react';

interface ProductCardProps {
  title: string;
  subtitle: string;
  price?: string | React.ReactNode;
  imageUrl: string;
  index: number;
  badgeText?: string;
  actionButton?: React.ReactNode;
}

export function ProductCard({ title, subtitle, price, imageUrl, index, badgeText, actionButton }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse position relative to center of card (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for a weighty, premium feel
  const springConfig = { damping: 20, stiffness: 100, mass: 1.5 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  // Calculate rotations: max 15 degrees tilt
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-15, 15]);

  // Calculate glare position based on cursor
  const glareX = useTransform(smoothX, [-0.5, 0.5], ['150%', '-50%']);
  const glareY = useTransform(smoothY, [-0.5, 0.5], ['150%', '-50%']);
  
  // Glare gets brighter when cursor is towards edges
  const glareOpacity = useTransform(
    smoothX,
    [-0.5, 0, 0.5],
    [0.6, 0.1, 0.6]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    
    const normalizedX = (clientX / rect.width) - 0.5;
    const normalizedY = (clientY / rect.height) - 0.5;

    x.set(normalizedX);
    y.set(normalizedY);
  };

  const handleMouseLeave = () => {
    // Reset to center
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative group cursor-pointer w-full"
      style={{ perspective: '1200px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full aspect-[3/4] rounded-[2rem] bg-white border border-black/5 shadow-2xl shadow-black/5"
      >
        {/* Background Base */}
        <div className="absolute inset-0 bg-gradient-to-br from-white to-[#f4f4f5] rounded-[2rem]" />

        {/* Deep 3D Image */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center p-6 pb-24"
          style={{ transform: 'translateZ(20px)' }}
        >
          <div className="relative w-full h-full rounded-xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden bg-gray-100 flex items-center justify-center">
            {imageUrl ? (
              <motion.img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            ) : (
              <span className="text-6xl">📦</span>
            )}
            {badgeText && (
               <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-md shadow-sm uppercase border border-gray-200 text-black px-2.5 py-1 rounded-lg text-xs font-bold">
                  {badgeText}
               </div>
            )}
          </div>
        </motion.div>

        {/* Text Content - Floating above */}
        <div
          className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end bg-gradient-to-t from-white/95 via-white/70 to-transparent h-1/2 rounded-b-[2rem]"
          style={{ transform: 'translateZ(40px)', transformStyle: 'preserve-3d' }}
        >
          <div className="space-y-1 mb-6">
            <h3 className="text-2xl font-semibold tracking-tight text-[#111] line-clamp-2">{title}</h3>
            <p className="text-sm text-gray-500 font-medium line-clamp-1">{subtitle}</p>
          </div>
          
          <div className="flex items-center justify-between" style={{ transform: 'translateZ(20px)' }}>
            <span className="text-xl font-medium text-[#111]">{price}</span>
            {actionButton || (
               <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="px-5 py-2.5 bg-black/[0.03] hover:bg-black/[0.08] backdrop-blur-md border border-black/10 text-[#111] rounded-full text-sm font-medium transition-colors duration-300"
               >
                 View
               </motion.button>
            )}
          </div>
        </div>

        {/* Soft dynamic glare layer */}
        <div className="absolute inset-0 pointer-events-none" style={{ transform: 'translateZ(50px)' }}>
          <div className="absolute inset-0 overflow-hidden rounded-[2rem] mix-blend-overlay border border-white/60">
            <motion.div
              className="absolute pointer-events-none"
              style={{
                background: 'radial-gradient(circle at center, rgba(255,255,255,0.9) 0%, transparent 60%)',
                left: glareX,
                top: glareY,
                width: '200%',
                height: '200%',
                transform: 'translate(-50%, -50%)',
                opacity: glareOpacity,
              }}
            />
          </div>
        </div>
      </motion.div>
      
      {/* Ground Shadow */}
      <motion.div
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-12 rounded-[100%] bg-black/20 blur-2xl pointer-events-none"
        style={{
          transform: 'translateZ(-50px)',
        }}
      />
    </motion.div>
  );
}
