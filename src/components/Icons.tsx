import type { SVGProps } from "react";
import type { ServiceIcon } from "@/content/services";

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...props,
});

export const PhoneIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 3h3l2 5-2.5 1.5a11 11 0 0 0 7 7L16 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2" />
  </svg>
);

export const MapPinIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

export const ClockIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const MailIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

export const CalendarIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

export const MenuIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const CloseIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const CheckIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m5 12 4 4 10-10" />
  </svg>
);

export const GlobeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
  </svg>
);

const serviceIcons: Record<ServiceIcon, (p: IconProps) => React.ReactElement> = {
  ear: (p) => (
    <svg {...base(p)}>
      <path d="M7 9a5 5 0 0 1 10 0c0 3-3 4-3 7a3 3 0 0 1-6 0" />
      <path d="M10 10a2 2 0 0 1 4 0c0 1.5-2 2-2 3.5" />
    </svg>
  ),
  nose: (p) => (
    <svg {...base(p)}>
      <path d="M12 3c0 5-4 9-4 12a3 3 0 0 0 3 3h3" />
      <path d="M9 18a2 2 0 0 1-3-1M15 18a2 2 0 0 0 3-1" />
    </svg>
  ),
  throat: (p) => (
    <svg {...base(p)}>
      <path d="M8 3c0 4 1 6 1 9s-1 5-1 9M16 3c0 4-1 6-1 9s1 5 1 9" />
      <path d="M10 9h4M10 13h4" />
    </svg>
  ),
  child: (p) => (
    <svg {...base(p)}>
      <circle cx="12" cy="7" r="3" />
      <path d="M7 21v-5a5 5 0 0 1 10 0v5M9.5 21v-3M14.5 21v-3" />
    </svg>
  ),
  wave: (p) => (
    <svg {...base(p)}>
      <path d="M3 12h2l2-5 3 10 3-8 2 6 2-3h4" />
    </svg>
  ),
  scalpel: (p) => (
    <svg {...base(p)}>
      <path d="M4 20 15 9l3 3L7 20Z" />
      <path d="m15 9 3-5 2 2-2 6" />
    </svg>
  ),
  rx: (p) => (
    <svg {...base(p)}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h3a2 2 0 0 1 0 4H8V8Zm0 4v5M10.5 12l4 5M16 13l-3 4" />
    </svg>
  ),
  home: (p) => (
    <svg {...base(p)}>
      <path d="M3 11 12 4l9 7" />
      <path d="M5 10v10h14V10M12 13v4M10 15h4" />
    </svg>
  ),
};

export const ServiceGlyph = ({ icon, ...p }: IconProps & { icon: ServiceIcon }) => serviceIcons[icon](p);
