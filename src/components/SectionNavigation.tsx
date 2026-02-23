'use client';

import React, { useEffect, useState } from 'react';

import clsx from '@/lib/clsxm';

import { NAV_CONTAINER_CLASSES, NavigationItem } from '@/components/layout/NavigationPrimitives';


interface Section {
  key: string;
  name: string;
}

interface SectionNavigationProps {
  sections: Section[];
  onSectionClick?: () => void; // Callback for mobile menu close
}

export default function SectionNavigation({
  sections,
  onSectionClick,
}: SectionNavigationProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Check if scrolled to bottom of the page
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 20;

      if (isAtBottom) {
        // When at the bottom, set the last section as active
        setActiveIndex(sections.length - 1);
        return;
      }

      const sectionElements = sections.map((section) =>
        document.getElementById(section.key),
      );
      const viewportHeight = window.innerHeight;

      // Find the section with the highest visibility ratio
      const sectionVisibility = sectionElements.map((section, index) => {
        if (!section) return { index, visibility: 0 };

        const rect = section.getBoundingClientRect();
        const sectionTop = window.scrollY + rect.top;
        const sectionBottom = sectionTop + rect.height;

        // Calculate how much of the section is visible in the viewport
        const visibleTop = Math.max(sectionTop, window.scrollY);
        const visibleBottom = Math.min(
          sectionBottom,
          window.scrollY + viewportHeight,
        );
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);

        // Calculate visibility ratio (0 to 1)
        const visibility = visibleHeight / rect.height;

        return { index, visibility };
      });

      // Find the section with highest visibility
      const mostVisible = sectionVisibility.reduce((max, current) =>
        current.visibility > max.visibility ? current : max,
      );

      setActiveIndex(mostVisible.index);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (index: number) => {
    const section = sections[index];
    if (!section) return;

    // Close mobile menu if callback provided
    onSectionClick?.();

    const element = document.getElementById(section.key);
    if (element) {
      const navElement = document.querySelector('nav');
      const navHeight = navElement?.getBoundingClientRect().height ?? 0;

      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - navHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav
      className={clsx(NAV_CONTAINER_CLASSES)}
      aria-label='Page sections'
    >
      {sections.map((section, index) => {
        const isActive = activeIndex === index;
        return (
          <NavigationItem
            key={`section-${index}`}
            isActive={isActive}
            label={section.name}
            onClick={() => scrollToSection(index)}
            aria-current={isActive ? 'true' : undefined}
          />
        );
      })}
    </nav>
  );
}
