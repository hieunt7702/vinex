import { useState, useRef, MouseEvent } from 'react';

export const useDragScroll = <T extends HTMLElement>() => {
  const scrollRef = useRef<T>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e: MouseEvent<T>) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    // Prevent snap behavior from interfering while dragging
    scrollRef.current.style.scrollSnapType = 'none';
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
    if (scrollRef.current) {
      scrollRef.current.style.scrollSnapType = '';
    }
  };

  const onMouseUp = () => {
    setIsDragging(false);
    if (scrollRef.current) {
      scrollRef.current.style.scrollSnapType = '';
    }
  };

  const onMouseMove = (e: MouseEvent<T>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll-fast multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // Prevent link clicks if dragging occurred
  const onClickCapture = (e: MouseEvent<T>) => {
    if (isDragging) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return {
    scrollRef,
    events: {
      onMouseDown,
      onMouseLeave,
      onMouseUp,
      onMouseMove,
      onClickCapture
    },
    isDragging
  };
};
