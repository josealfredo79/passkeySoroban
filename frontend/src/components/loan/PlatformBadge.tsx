/**
 * Platform Badge Component
 * Displays a badge for gig economy platforms
 */

import React from 'react';

interface PlatformBadgeProps {
  platform: 'Uber' | 'Rappi' | 'DiDi';
  size?: 'sm' | 'md' | 'lg';
}

const platformConfig = {
  Uber: {
    color: 'bg-black text-white',
    icon: '🚗',
  },
  Rappi: {
    color: 'bg-orange-500 text-white',
    icon: '🛵',
  },
  DiDi: {
    color: 'bg-orange-600 text-white',
    icon: '🚕',
  },
};

const sizeConfig = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

export default function PlatformBadge({ platform, size = 'md' }: PlatformBadgeProps) {
  const config = platformConfig[platform];
  const sizeClass = sizeConfig[size];

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${config.color} ${sizeClass}`}
    >
      <span>{config.icon}</span>
      <span>{platform}</span>
    </div>
  );
}
