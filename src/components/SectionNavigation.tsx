'use client';

import React, { useEffect, useRef, useState } from 'react';

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
  const ratiosRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const ratios = ratiosRef.current;

    const updateActive = () => {
      let maxRatio = -1;
      let maxIndex = 0;
      sections.forEach((section, index) => {
        const ratio = ratios.get(section.key) ?? 0;
        if (ratio > maxRatio) {
          maxRatio = ratio;
          maxIndex = index;
        }
      });
      setActiveIndex(maxIndex);
    };

    const thresholds = Array.from({ length: 11 }, (_, i) => i / 10);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        ratios.set(entry.target.id, entry.intersectionRatio);
      });
      updateActive();
    }, { threshold: thresholds });

    sections.forEach((section) => {
      const el = document.getElementById(section.key);
      if (el) {
        ratios.set(section.key, 0);
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (index: number) => {
    const section = sections[index];
    if (!section) return;

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
