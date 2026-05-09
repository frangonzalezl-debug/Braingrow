import React from "react";
import { icons, type IconName } from "../icons";

interface AppIconProps {
  name: IconName;
  size?: number;
  className?: string;
  fill?: string;
  style?: React.CSSProperties;
}

export const AppIcon: React.FC<AppIconProps> = ({
  name,
  size = 24,
  className = "",
  fill,
  style,
}) => {
  const config = icons[name];

  if (config.custom) {
    return (
      <img
        src={config.custom}
        alt={name}
        width={size}
        height={size}
        className={className}
        style={{ width: size, height: size, objectFit: "contain", ...style }}
      />
    );
  }

  const LucideIcon = config.lucide;
  return <LucideIcon size={size} className={className} fill={fill} style={style} />;
};
