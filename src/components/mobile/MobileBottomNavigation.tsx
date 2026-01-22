// src/components/mobile/MobileBottomNavigation.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Heart, User } from 'lucide-react';
import styles from './MobileBottomNavigation.module.css';

export default function MobileBottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, href: '/', id: 'home' },
    { icon: Compass, href: '/explore', id: 'explore' },
    { icon: Heart, href: '/favorites', id: 'favorites' },
    { icon: User, href: '/profile', id: 'profile' }
  ];

  return (
    <nav className={styles.navigation}>
      <div className={styles.navContainer}>
        {navItems.map(({ icon: Icon, href, id }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
          
          return (
            <Link
              key={id}
              href={href}
              className={styles.navItem}
            >
              <div className={styles.iconWrapper}>
                <Icon 
                  size={24} 
                  className={`${styles.icon} ${isActive ? styles.iconActive : styles.iconInactive}`}
                  strokeWidth={2}
                  fill={isActive && id === 'home' ? 'currentColor' : 'none'}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
