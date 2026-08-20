'use client';

import React, { useEffect, useRef, useState } from 'react';

import clsx from '@/lib/clsxm';

import {
  NAV_CONTAINER_CLASSES,
  NavigationItem,
} from '@/components/layout/NavigationPrimitives';

import { common, Lang } from '@/i18n';

interface Section {
  key: string;
  name: string;
}

interface SectionNavigationProps {
  lang: Lang;
  sections: Section[];
  onSectionClick?: () => void;
}

export default function SectionNavigation({
  lang,
  sections,
  onSectionClick,
}: SectionNavigationProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const ratiosRef = useRef<Map<string, number>>(new Map());
  const navRef = useRef<HTMLElement>(null);

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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target.id, entry.intersectionRatio);
        });
        updateActive();
      },
      { threshold: thresholds },
    );

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
      const navHeight = navRef.current?.getBoundingClientRect().height ?? 0;

      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - navHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav
      ref={navRef}
      className={clsx(NAV_CONTAINER_CLASSES)}
      aria-label={common[lang].pageSections}
    >
      {sections.map((section, index) => (
        <NavigationItem
          key={section.key}
          isActive={activeIndex === index}
          label={section.name}
          onClick={() => scrollToSection(index)}
        />
      ))}
    </nav>
  );
}
