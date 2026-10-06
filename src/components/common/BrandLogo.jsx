// import React from 'react';
import { Link } from 'react-router-dom';
import mybdphoneLogo from '../../assets/mybdphonelogo.png';
import footerLogo from '../../assets/footer-logo.png';

export const BrandLogo = ({ size = 'md', isDark = false, to = '/', className = '' }) => {
  const sizeClasses = {
    sm: 'w-[130px]',
    md: 'w-[160px]',
    lg: 'w-[190px]',
  };

  const logoSrc = isDark ? footerLogo : mybdphoneLogo;

  return (
    <div className={`inline-flex items-center ${className}`}>
      <Link to={to} className="flex items-center group select-none">
        <img
          src={logoSrc}
          alt="MyBDPhone Logo"
          className={`${sizeClasses[size] || 'w-[180px]'} h-auto max-h-12 object-contain`}
        />
      </Link>
    </div>
  );
};

