
export const NT = {
  bg:           '#F5F7F5',
  surface:      '#FFFFFF',
  surfaceAlt:   '#EEF5F0',
  surface2:     '#E4EFE4',
  border:       '#D8E8D8',
  borderSoft:   '#EAF2EA',
  text:         '#1A2B1A',
  textDim:      '#4B5E4B',
  textFaint:    '#8FA98F',
  primary:      '#34C759',
  primaryDim:   '#2DA44E',
  primarySoft:  'rgba(52,199,89,0.14)',
  secondary:    '#FF9500',
  secondarySoft:'rgba(255,149,0,0.14)',
  good:         '#34C759',
  warn:         '#FFAA00',
  bad:          '#FF3B30',
  goodSoft:     'rgba(52,199,89,0.14)',
  warnSoft:     'rgba(255,170,0,0.14)',
  badSoft:      'rgba(255,59,48,0.12)',
  waveBg:       '#0E1A1A',
};

export const NSEV = {
  critical: { color:'#FF0000', soft:'rgba(255,0,0,0.10)',   label:'CRITICAL', rank:4 },
  high:     { color:'#FF3B30', soft:'rgba(255,59,48,0.10)', label:'HIGH',     rank:3 },
  medium:   { color:'#FFAA00', soft:'rgba(255,170,0,0.10)', label:'MEDIUM',   rank:2 },
  low:      { color:'#007AFF', soft:'rgba(0,122,255,0.10)', label:'LOW',      rank:1 },
  normal:   { color:'#34C759', soft:'rgba(52,199,89,0.10)', label:'NORMAL',   rank:0 },
  stable:   { color:'#34C759', soft:'rgba(52,199,89,0.10)', label:'STABLE',   rank:0 },
};

export const NBED_COLORS = {
  monitoring: { bg:'rgba(52,199,89,0.12)',   border:'#34C759', dot:'#34C759', label:'Monitoring'    },
  occupied:   { bg:'rgba(255,182,193,0.25)', border:'#FFB6C1', dot:'#FF90A0', label:'Occupied'      },
  empty:      { bg:'rgba(200,200,200,0.15)', border:'#C8C8C8', dot:'#AAAAAA', label:'Empty'         },
  admit:      { bg:'rgba(168,230,207,0.25)', border:'#A8E6CF', dot:'#5AC8A0', label:'Pending Admit' },
  discharge:  { bg:'rgba(255,215,0,0.15)',   border:'#FFD700', dot:'#D4A800', label:'Discharge'     },
  transfer:   { bg:'rgba(135,206,235,0.25)', border:'#87CEEB', dot:'#4EA8D0', label:'Transfer'      },
};
