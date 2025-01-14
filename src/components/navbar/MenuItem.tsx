"use client";
import React from "react";

interface MenuItemProps {
  onClick: () => void;
  label: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ onClick, label }) => {
  return (
    <div
      onClick={onClick}
      className="px-4 py-2 font-semibold transition hover:bg-primary-800"
    >
      {label}
    </div>
  );
};

export default MenuItem;
