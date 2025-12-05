"use client";

import { useState, useEffect, ReactNode, useRef } from "react";
import Icon from "../Icon/Icon";
import styles from "./ContextMenu.module.css";

type ContextMenuProps = {
  children?: ReactNode;
  type?: "click" | "dobleClick";
  items: {
    id: number;
    icon: string;
    title: string;
    action: ReactNode;
  }[];
};

export default function ContextMenu({
  type,
  children,
  items,
}: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const openMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

    setPos({ x: rect.right + 1, y: rect.top });

    setOpen((prev) => !prev);
  };

  return (
    <menu className={styles.parent} ref={ref}>
      <div onClick={openMenu}>{children}</div>
      {open && (
        <ul className={styles.main} style={{ top: pos.y, left: pos.x }}>
          {items.map((data) => (
            <li key={data.id}>
              <button>
                <Icon name={data.icon} width={32} />
                {data.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </menu>
  );
}
