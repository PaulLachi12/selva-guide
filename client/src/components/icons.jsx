const base = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
};

const ic = (paths) =>
  function Icon({ className = 'w-4 h-4' }) {
    return (
      <svg {...base} className={className} aria-hidden="true">
        {paths}
      </svg>
    );
  };

export const IconStar = ic(<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" stroke="currentColor" />);

export const IconPin = ic(<><path d="M12 21s-7-5.09-7-11a7 7 0 1 1 14 0c0 5.91-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>);

export const IconClock = ic(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>);

export const IconUsers = ic(<><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.8-3.2 3.4-5 6.5-5s5.7 1.8 6.5 5" /><circle cx="17.5" cy="9" r="2.5" /><path d="M17 15.5c2.4.3 4 1.9 4.5 4.5" /></>);

export const IconCheck = ic(<path d="M4 12.5l5 5L20 6.5" />);

export const IconBolt = ic(<path d="M13 2L4.5 13.5H11L10 22l8.5-11.5H12L13 2z" />);

export const IconMap = ic(<><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" /><path d="M9 4v14M15 6v14" /></>);

export const IconChat = ic(<><path d="M21 12a8 8 0 0 1-8 8H4l3-3a8 8 0 1 1 14-5z" /><path d="M8 10h6M8 13.5h4" /></>);

export const IconCalendar = ic(<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></>);

export const IconSearch = ic(<><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>);

export const IconMenu = ic(<path d="M3 6h18M3 12h18M3 18h18" />);

export const IconArrowUp = ic(<><path d="M12 19V5" /><path d="M5 12l7-7 7 7" /></>);

export const IconArrowRight = ic(<><path d="M4 12h16" /><path d="M13 5l7 7-7 7" /></>);

export const IconArrowLeft = ic(<><path d="M20 12H4" /><path d="M11 5l-7 7 7 7" /></>);

export const IconPlus = ic(<path d="M12 5v14M5 12h14" />);

export const IconX = ic(<path d="M6 6l12 12M18 6L6 18" />);

export const IconPencil = ic(<><path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19l-4 1z" /><path d="M14.5 6.5l3 3" /></>);

export const IconPhone = ic(<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />);

export const IconMail = ic(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>);

export const IconWallet = ic(<><rect x="3" y="6" width="18" height="14" rx="2" /><path d="M3 10h18" /><circle cx="16.5" cy="14.5" r="1" /></>);

export const IconMountain = ic(<path d="M3 18L9 6l4 7 2.5-4L21 18H3z" />);

export const IconBoat = ic(<><path d="M3 14h18l-2 4a3 3 0 0 1-3 1l-4 1-4-1a3 3 0 0 1-3-1l-2-4z" /><path d="M12 5v9M12 7a2.5 2.5 0 0 0 2.5-2.5L12 2l-2.5 2.5A2.5 2.5 0 0 0 12 7z" /></>);

export const IconTemple = ic(<><path d="M3 7l9-4 9 4" /><path d="M3 7v3M21 7v3M5 10h14v9" /><path d="M5 19H2M22 19h-3" /><path d="M8 10v9M12 10v9M16 10v9" /></>);

export const IconLeaf = ic(<><path d="M20 4c-7 0-14 3-14 11a9 9 0 0 0 9 1c4-1.5 5-6 5-12z" /><path d="M5 16C2 13 3 9 6 7" /></>);

export const IconPlate = ic(<><circle cx="12" cy="12" r="8.5" /><path d="M12 12h7M9.5 8.5v7M7 12h1" /></>);

export const IconWave = ic(<><path d="M3 14c2 0 2-3 4.5-3S10 14 12 14s2.5-3 4.5-3S19 14 21 13" /><path d="M3 18c2 0 2-3 4.5-3s2.5 3 4.5 3 2.5-3 4.5-3S19 18 21 17" /></>);

export const IconCompass = ic(<><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" /></>);

export const IconPlay = ic(<polygon points="7 4 20 12 7 20 7 4" fill="currentColor" stroke="currentColor" />);

export const IconHeart = ic(<path d="M12 21s-7-4.35-9.33-8.11C1.02 10 2 6.5 5 5c1.9-1 3.5-.2 4.3 1L12 9.3 14.7 6c.8-1.2 2.4-2 4.3-1 3 .5 3.98 5 2.33 7.89C19 16.65 12 21 12 21z" />);

export const IconShield = ic(<><path d="M12 2l8 4v6c0 4.5-3.2 7.5-8 10-4.8-2.5-8-5.5-8-10V6l8-4z" /><path d="M8.5 12l2.5 2.5L16 10" /></>);

export const IconSend = ic(<><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></>);

export const IconGlobe = ic(<><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a15.3 15.3 0 0 1 0 18 15.3 15.3 0 0 1 0-18z" /></>);

export const IconEye = ic(<><path d="M1.5 12S5.5 4.5 12 4.5 22.5 12 22.5 12 18.5 19.5 12 19.5 1.5 12 1.5 12z" /><circle cx="12" cy="12" r="3" /></>);

export const IconChevronDown = ic(<path d="M6 9l6 6 6-6" />);

export default {
  IconStar, IconPin, IconClock, IconUsers, IconCheck, IconBolt, IconMap,
  IconChat, IconCalendar, IconSearch, IconArrowRight, IconArrowLeft, IconPlus,
  IconX, IconPencil, IconPhone, IconMail, IconWallet, IconMountain, IconBoat,
  IconTemple, IconLeaf, IconPlate, IconWave, IconCompass, IconPlay, IconMenu, IconArrowUp,
  IconHeart, IconShield, IconSend, IconGlobe, IconEye, IconChevronDown
};