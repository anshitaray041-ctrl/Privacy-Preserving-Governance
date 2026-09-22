import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface PrivacyBadgeProps {
  label?: string;
  variant?: 'purple' | 'cyan' | 'green';
}

export const PrivacyBadge: React.FC<PrivacyBadgeProps> = ({
  label = 'Midnight Zero-Knowledge Shielded',
  variant = 'purple',
}) => {
  const badgeClass =
    variant === 'cyan' ? 'badge-cyan' : variant === 'green' ? 'badge-green' : 'badge-purple';

  return (
    <span className={`badge ${badgeClass}`}>
      <ShieldCheck size={13} className="text-current" />
      {label}
    </span>
  );
};
