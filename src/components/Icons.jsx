
import React from 'react';
import Svg, { Path, Rect, Circle, Line, Polyline } from 'react-native-svg';

const NI = ({ children, size = 18, stroke = 1.8, fill = 'none', color = 'currentColor', vb = '0 0 24 24' }) => (
  <Svg width={size} height={size} viewBox={vb} fill={fill} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </Svg>
);

export const NIcoBed = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Rect x="2" y="7" width="20" height="14" rx="2" />
    <Path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
    <Line x1="12" y1="12" x2="12" y2="12" />
  </NI>
);

export const NIcoBell = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
  </NI>
);

export const NIcoUser = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
  </NI>
);

export const NIcoClipList = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Rect x="8" y="2" width="8" height="4" rx="1" />
    <Path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2M9 12h6M9 16h4" />
  </NI>
);

export const NIcoHeart = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </NI>
);

export const NIcoActivity = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </NI>
);

export const NIcoDrop = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
  </NI>
);

export const NIcoThermo = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z" />
  </NI>
);

export const NIcoPressure = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 6v6l4 2" />
  </NI>
);

export const NIcoLungs = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Path d="M6 12c-2 0-4 1-4 4s2 5 5 5c2 0 3-1 4-2V7c0-1-1-2-2-2s-3 1-3 3v4z" />
    <Path d="M18 12c2 0 4 1 4 4s-2 5-5 5c-2 0-3-1-4-2V7c0-1-1-2-2-2s3 1 3 3v4z" />
    <Line x1="12" y1="5" x2="12" y2="19" />
  </NI>
);

export const NIcoMonitor = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Rect x="2" y="3" width="20" height="14" rx="2" />
    <Path d="M8 21h8M12 17v4M6 9l3 3 3-3 3 3" />
  </NI>
);

export const NIcoPlus = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Path d="M12 5v14M5 12h14" />
  </NI>
);

export const NIcoCheck = ({ s = 18, c = 'currentColor', stroke = 2 }) => (
  <NI size={s} color={c} stroke={stroke}>
    <Path d="M20 6L9 17l-5-5" />
  </NI>
);

export const NIcoX = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Path d="M18 6L6 18M6 6l12 12" />
  </NI>
);

export const NIcoBack = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Path d="M19 12H5M12 5l-7 7 7 7" />
  </NI>
);

export const NIcoChevD = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Path d="M6 9l6 6 6-6" />
  </NI>
);

export const NIcoChevR = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Path d="M9 18l6-6-6-6" />
  </NI>
);

export const NIcoEye = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z" />
  </NI>
);

export const NIcoEyeOff = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" />
  </NI>
);

export const NIcoPhone = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </NI>
);

export const NIcoLock = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Rect x="3" y="11" width="18" height="11" rx="2" />
    <Path d="M7 11V7a5 5 0 0110 0v4" />
  </NI>
);

export const NIcoSend = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
  </NI>
);

export const NIcoSearch = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Circle cx="11" cy="11" r="8" />
    <Path d="M21 21l-4.35-4.35" />
  </NI>
);

export const NIcoMenu = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Path d="M3 12h18M3 6h18M3 18h18" />
  </NI>
);

export const NIcoEdit = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </NI>
);

export const NIcoRefresh = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
  </NI>
);

export const NIcoPill = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Path d="M10.5 20.5L3.5 13.5a5 5 0 017.07-7.07l7 7a5 5 0 01-7.07 7.07zM8.5 8.5l7 7" />
  </NI>
);

export const NIcoSyringe = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Path d="M18 2l4 4-8 8-4-1-1-4z" />
    <Path d="M10 10L4 16 2 22l6-2 6-6" />
    <Path d="M14 6l2 2M11 9l2 2" />
  </NI>
);

export const NIcoAlert = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
  </NI>
);

export const NIcoInfo = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Circle cx="12" cy="12" r="10" />
    <Line x1="12" y1="8" x2="12" y2="12" />
    <Line x1="12" y1="16" x2="12.01" y2="16" />
  </NI>
);

export const NIcoFlag = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" />
  </NI>
);

export const NIcoTransfer = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Path d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3" />
  </NI>
);

export const NIcoFingerp = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0110 10c0 5.5-4.5 10-10 10" />
    <Path d="M9 12a3 3 0 016 0v3" />
    <Path d="M6 12a6 6 0 0112 0v4" />
  </NI>
);

export const NIcoLogOut = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
  </NI>
);

export const NIcoSettings = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Circle cx="12" cy="12" r="3" />
    <Path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </NI>
);

export const NIcoMap = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Path d="M1 6l7-4 8 4 7-4v16l-7 4-8-4-7 4V6zM8 2v16M16 6v16" />
  </NI>
);

export const NIcoFile = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <Polyline points="14 2 14 8 20 8" />
    <Line x1="16" y1="13" x2="8" y2="13" />
    <Line x1="16" y1="17" x2="8" y2="17" />
    <Polyline points="10 9 9 9 8 9" />
  </NI>
);

export const NIcoClock = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Circle cx="12" cy="12" r="10" />
    <Polyline points="12 6 12 12 16 14" />
  </NI>
);

export const NIcoCamera = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
    <Circle cx="12" cy="13" r="4" />
  </NI>
);

export const NIcoShield = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </NI>
);

export const NIcoWifi = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01" />
  </NI>
);

export const NIcoWifiOff = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.56 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0M12 20h.01" />
  </NI>
);

export const NIcoCheckCirc = ({ s = 18, c = 'currentColor' }) => (
  <NI size={s} color={c}>
    <Circle cx="12" cy="12" r="10" />
    <Path d="M9 12l2 2 4-4" />
  </NI>
);
