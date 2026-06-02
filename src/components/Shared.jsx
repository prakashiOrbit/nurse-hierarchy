
import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput, ScrollView, Switch, Modal } from 'react-native';
import { NT, NSEV, NBED_COLORS } from '../constants/theme';
import { NIcoBed, NIcoBell, NIcoUser, NIcoClipList, NIcoHeart, NIcoActivity, NIcoDrop, NIcoThermo, NIcoPressure, NIcoLungs, NIcoMonitor, NIcoPlus, NIcoCheck, NIcoX, NIcoBack, NIcoChevD, NIcoChevR, NIcoEye, NIcoEyeOff, NIcoPhone, NIcoLock, NIcoSend, NIcoSearch, NIcoMenu, NIcoEdit, NIcoRefresh, NIcoPill, NIcoSyringe, NIcoAlert, NIcoInfo, NIcoFlag, NIcoTransfer, NIcoFingerp, NIcoLogOut, NIcoSettings, NIcoMap, NIcoFile, NIcoClock, NIcoCamera, NIcoShield, NIcoWifi, NIcoWifiOff, NIcoCheckCirc } from './Icons';
export { NIcoBed, NIcoBell, NIcoUser, NIcoClipList, NIcoHeart, NIcoActivity, NIcoDrop, NIcoThermo, NIcoPressure, NIcoLungs, NIcoMonitor, NIcoPlus, NIcoCheck, NIcoX, NIcoBack, NIcoChevD, NIcoChevR, NIcoEye, NIcoEyeOff, NIcoPhone, NIcoLock, NIcoSend, NIcoSearch, NIcoMenu, NIcoEdit, NIcoRefresh, NIcoPill, NIcoSyringe, NIcoAlert, NIcoInfo, NIcoFlag, NIcoTransfer, NIcoFingerp, NIcoLogOut, NIcoSettings, NIcoMap, NIcoFile, NIcoClock, NIcoCamera, NIcoShield, NIcoWifi, NIcoWifiOff, NIcoCheckCirc };

// --- Status Dot ---
export function NStatusDot({ status = 'stable', size = 8 }) {
  const s = NSEV[status] || NSEV.stable;
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: s.color }} />
  );
}

// --- Chip ---
export function NChip({ icon, label, onClick, active, danger, disabled }) {
  return (
    <TouchableOpacity
      onPress={onClick}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.chip,
        {
          borderColor: danger ? NT.bad + '44' : active ? NT.primary : NT.border,
          backgroundColor: danger ? 'rgba(255,59,48,0.08)' : active ? NT.primarySoft : NT.surface,
        },
        disabled && { opacity: 0.5 }
      ]}
    >
      {icon && <View style={{ marginRight: 6 }}>{React.cloneElement(icon, { c: danger ? NT.bad : active ? NT.primary : NT.textDim })}</View>}
      <Text style={[styles.chipLabel, { color: danger ? NT.bad : active ? NT.primary : NT.textDim }]}>{label}</Text>
    </TouchableOpacity>
  );
}

// --- Sheet (Modal) ---
export function NSheet({ children, onClose, full, visible }) {
  return (
    <Modal
      visible={visible}
      transparent={!full}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.sheetContainer, full && { backgroundColor: NT.bg }]}>
        {!full && <TouchableOpacity style={{ flex: 1, width: '100%' }} onPress={onClose} />}
        <View style={[styles.sheetContent, full && { height: '100%', width: '100%', borderRadius: 0 }]}>
          {children}
        </View>
      </View>
    </Modal>
  );
}

// --- Dialog ---
export function NDialog({ title, body, confirm, cancel, onConfirm, onCancel, danger, visible }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.dialogOverlay}>
        <View style={styles.dialogBox}>
          <Text style={styles.dialogTitle}>{title}</Text>
          {body && <Text style={styles.dialogBody}>{body}</Text>}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <NBtn fullWidth variant="ghost" onPress={onCancel}>{cancel || 'Cancel'}</NBtn>
            <NBtn fullWidth variant={danger ? undefined : 'primary'} danger={danger} onPress={onConfirm}>{confirm || 'Confirm'}</NBtn>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// --- Toast ---
export function NToast({ message, kind = 'info', visible }) {
  if (!visible) return null;
  const c = { info: NT.primary, good: NT.good, warn: NT.warn, bad: NT.bad }[kind] || NT.primary;
  return (
    <View style={styles.toastContainer} pointerEvents="none">
      <View style={styles.toastBox}>
        <View style={[styles.toastDot, { backgroundColor: c }]} />
        <Text style={styles.toastText}>{message}</Text>
      </View>
    </View>
  );
}

// --- Field ---
export function NField({ label, children, required }) {
  return (
    <View style={styles.fieldContainer}>
      {label && (
        <Text style={styles.fieldLabel}>
          {label}{required && <Text style={{ color: NT.bad }}> *</Text>}
        </Text>
      )}
      {children}
    </View>
  );
}

// --- OTP Input ---
export function NOTPInput({ otp, onChange }) {
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  
  const set = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    onChange(next);
    if (val && i < 5) refs[i+1].current?.focus();
  };

  const onKey = (i, key) => {
    if (key === 'Backspace' && !otp[i] && i > 0) {
      refs[i-1].current?.focus();
    }
  };

  return (
    <View style={styles.otpRow}>
      {otp.map((d, i) => (
        <TextInput
          key={i}
          ref={refs[i]}
          value={d}
          maxLength={1}
          keyboardType="numeric"
          onChangeText={(val) => set(i, val)}
          onKeyPress={({ nativeEvent }) => onKey(i, nativeEvent.key)}
          style={[
            styles.otpBox,
            { borderColor: d ? NT.primary : NT.border }
          ]}
        />
      ))}
    </View>
  );
}

// --- Connectivity Components ---
export function OfflineBanner() {
  return (
    <View style={styles.offlineBanner}>
      <NIcoWifiOff s={14} c="#fff" />
      <Text style={styles.offlineText}>OFFLINE — Showing cached data. Reconnecting…</Text>
    </View>
  );
}

export function SSEDot({ connected }) {
  return (
    <View style={[
      styles.sseContainer,
      { 
        backgroundColor: connected ? NT.primarySoft : 'rgba(255,59,48,0.12)',
        borderColor: connected ? NT.primary + '44' : '#FF3B3044'
      }
    ]}>
      <View style={[
        styles.sseDot,
        { backgroundColor: connected ? NT.primary : NT.bad }
      ]} />
      <Text style={[
        styles.sseText,
        { color: connected ? NT.primary : NT.bad }
      ]}>
        {connected ? 'LIVE' : 'DISCONNECTED'}
      </Text>
    </View>
  );
}

// --- Param icon helper ---
export function NParamIcon({ param, size = 14, color = 'currentColor' }) {
  switch (param) {
    case 'HR': return <NIcoHeart s={size} c={color} />;
    case 'SpO2': return <NIcoDrop s={size} c={color} />;
    case 'RR': return <NIcoLungs s={size} c={color} />;
    case 'NIBP': return <NIcoPressure s={size} c={color} />;
    case 'TEMP': return <NIcoThermo s={size} c={color} />;
    default: return <NIcoActivity s={size} c={color} />;
  }
}

// --- Severity badge ---
export function NSevBadge({ severity, size = 'md' }) {
  const s = NSEV[severity] || NSEV.normal;
  return (
    <View style={[styles.sevBadge, { backgroundColor: s.soft }, size === 'sm' && { paddingVertical: 2, paddingHorizontal: 6 }]}>
      <View style={[styles.dot, { backgroundColor: s.color }]} />
      <Text style={[styles.sevText, { color: s.color }, size === 'sm' && { fontSize: 9 }]}>{s.label}</Text>
    </View>
  );
}

// --- Button ---
export function NBtn({ children, onPress, variant = 'primary', size = 'md', loading, disabled, icon, fullWidth, danger, style: xStyle }) {
  const h = size === 'sm' ? 36 : size === 'lg' ? 52 : 44;
  const fs = size === 'sm' ? 12 : size === 'lg' ? 15 : 13.5;

  let bg, color, border, shadow;
  if (danger) {
    bg = 'rgba(255,59,48,0.08)';
    color = NT.bad;
    border = { borderWidth: 1.5, borderColor: NT.bad + '44' };
    shadow = {};
  } else if (variant === 'primary') {
    bg = NT.primary;
    color = '#fff';
    border = { borderWidth: 0 };
    shadow = { shadowColor: NT.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 4 };
  } else if (variant === 'secondary') {
    bg = NT.secondary;
    color = '#fff';
    border = { borderWidth: 0 };
    shadow = { shadowColor: NT.secondary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 4 };
  } else if (variant === 'outline') {
    bg = 'transparent';
    color = NT.primary;
    border = { borderWidth: 1.5, borderColor: NT.primary };
    shadow = {};
  } else if (variant === 'ghost') {
    bg = 'transparent';
    color = NT.textDim;
    border = { borderWidth: 0 };
    shadow = {};
  } else {
    bg = NT.surfaceAlt;
    color = NT.textDim;
    border = { borderWidth: 1, borderColor: NT.border };
    shadow = {};
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.btn,
        { height: h, backgroundColor: bg, ...border, ...shadow, width: fullWidth ? '100%' : undefined },
        disabled && !loading && { opacity: 0.5 },
        xStyle
      ]}
    >
      {loading ? (
        <ActivityIndicator color={color} size="small" style={{ marginRight: 7 }} />
      ) : (
        icon && <View style={{ marginRight: 7 }}>{icon}</View>
      )}
      <Text style={[styles.btnText, { color, fontSize: fs }]}>{children}</Text>
    </TouchableOpacity>
  );
}

// --- Text input ---
export function NInput({ value, onChange, placeholder, type = 'text', leading, trailing, secureTextEntry, multiline, numberOfLines }) {
  return (
    <View style={styles.inputWrapper}>
      {leading && <View style={styles.inputLeading}>{leading}</View>}
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={type === 'email' ? 'email-address' : type === 'number' ? 'numeric' : 'default'}
        placeholderTextColor={NT.textFaint}
        multiline={multiline}
        numberOfLines={numberOfLines}
        style={[
          styles.input,
          { paddingLeft: leading ? 38 : 12, paddingRight: trailing ? 38 : 12 },
          multiline && { height: Math.max(44, (numberOfLines || 1) * 20), textAlignVertical: 'top', paddingTop: 10 }
        ]}
      />
      {trailing && <View style={styles.inputTrailing}>{trailing}</View>}
    </View>
  );
}

// --- Top bar ---
export function NTopBar({ title, subtitle, leading, trailing, onBack, plain }) {
  return (
    <View style={[styles.topBar, plain && { backgroundColor: 'transparent', borderBottomWidth: 0, shadowOpacity: 0, elevation: 0 }]}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <NIcoBack s={18} />
        </TouchableOpacity>
      )}
      {leading && <View style={{ marginRight: 10 }}>{leading}</View>}
      <View style={{ flex: 1 }}>
        {title && <Text style={styles.topBarTitle} numberOfLines={1}>{title}</Text>}
        {subtitle && <Text style={styles.topBarSub} numberOfLines={1}>{subtitle}</Text>}
      </View>
      {trailing && <View style={styles.topBarTrailing}>{trailing}</View>}
    </View>
  );
}

// --- Bottom nav ---
const NURSE_NAV = [
  { id: 'dashboard', label: 'Ward', icon: (active) => <NIcoBed s={22} c={active ? NT.primary : NT.textFaint} /> },
  { id: 'alarms', label: 'Alarms', icon: (active) => <NIcoBell s={22} c={active ? NT.primary : NT.textFaint} /> },
  { id: 'handover', label: 'Handover', icon: (active) => <NIcoClipList s={22} c={active ? NT.primary : NT.textFaint} /> },
  { id: 'profile', label: 'Profile', icon: (active) => <NIcoUser s={22} c={active ? NT.primary : NT.textFaint} /> },
];

export function NBottomNav({ active, onChange, alarmCount }) {
  return (
    <View style={styles.bottomNav}>
      {NURSE_NAV.map(item => (
        <TouchableOpacity key={item.id} onPress={() => onChange(item.id)} style={styles.navItem}>
          {item.id === 'alarms' && alarmCount > 0 && (
            <View style={styles.navBadge}>
              <Text style={styles.navBadgeText}>{alarmCount}</Text>
            </View>
          )}
          {item.icon(active === item.id)}
          <Text style={[styles.navLabel, { color: active === item.id ? NT.primary : NT.textFaint }]}>{item.label}</Text>
          {active === item.id && <View style={styles.navIndicator} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

// --- Tab bar ---
export function NTabBar({ tabs, active, onChange }) {
  return (
    <View style={styles.tabBar}>
      {tabs.map((t) => (
        <TouchableOpacity
          key={t.id}
          onPress={() => onChange(t.id)}
          style={[styles.tabItem, active === t.id && styles.tabItemActive]}
        >
          {t.icon && <View style={{ marginRight: 5 }}>{t.icon}</View>}
          <Text style={[styles.tabLabel, active === t.id ? { color: NT.primary } : { color: NT.textDim }]}>
            {t.label}
          </Text>
          {t.badge > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{t.badge}</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

// --- Vital card ---
export function NVitalCard({ param, label, value, unit, range, status = 'normal' }) {
  const sev = NSEV[status] || NSEV.normal;
  const alarm = status !== 'normal' && status !== 'stable';
  return (
    <View style={[styles.vitalCard, alarm && { backgroundColor: sev.soft, borderColor: sev.color + '55' }]}>
      {alarm && <View style={[styles.vitalAlarmBar, { backgroundColor: sev.color }]} />}
      <View style={styles.vitalHeader}>
        <View>
          <NParamIcon param={param} size={12} color={alarm ? sev.color : NT.primary} />
        </View>
        <Text style={styles.vitalLabel}>{label}</Text>
      </View>
      <View style={styles.vitalValueRow}>
        <Text style={[styles.vitalValue, { color: alarm ? sev.color : NT.text }]}>{value}</Text>
        <Text style={styles.vitalUnit}>{unit}</Text>
      </View>
      {range && <Text style={styles.vitalRange}>{range}</Text>}
    </View>
  );
}

// --- Note card ---
export function NNoteCard({ note }) {
  const map = {
    GENERAL: { c: '#007AFF', bg: 'rgba(0,122,255,0.10)' },
    MEDICATION: { c: '#34C759', bg: 'rgba(52,199,89,0.10)' },
    HANDOVER: { c: '#FF9500', bg: 'rgba(255,149,0,0.10)' },
    INCIDENT: { c: '#FF3B30', bg: 'rgba(255,59,48,0.10)' }
  };
  const tc = map[note.type] || map.GENERAL;
  return (
    <View style={styles.noteCard}>
      <View style={styles.noteHeader}>
        <View style={[styles.noteTypeBadge, { backgroundColor: tc.bg }]}>
          <Text style={[styles.noteTypeText, { color: tc.c }]}>{note.type}</Text>
        </View>
        <Text style={styles.noteTime}>{note.time}</Text>
      </View>
      <Text style={styles.noteText}>{note.text}</Text>
      <Text style={styles.noteNurse}>{note.nurse}</Text>
    </View>
  );
}

// --- Section header ---
export function NSection({ label, count, right }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionLabel}>{label}</Text>
      {count != null && <Text style={styles.sectionCount}>{count}</Text>}
      {right && <View style={{ flex: 1, alignItems: 'flex-end' }}>{right}</View>}
    </View>
  );
}

// --- Avatar ---
export function NAvatar({ initials, size = 34, color = NT.primary }) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: color + '20' }]}>
      <Text style={[styles.avatarText, { color, fontSize: size * 0.4 }]}>{initials}</Text>
    </View>
  );
}

// --- Checkbox ---
export function NCheck({ checked, onChange, label, disabled }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => !disabled && onChange?.(!checked)}
      style={[styles.checkRow, disabled && { opacity: 0.5 }]}
    >
      <View style={[styles.checkBox, checked && { backgroundColor: NT.primary, borderColor: NT.primary }]}>
        {checked && <NIcoCheck s={12} c="#fff" stroke={3} />}
      </View>
      {label && <Text style={[styles.checkLabel, checked && { color: NT.textFaint, textDecorationLine: 'line-through' }]}>{label}</Text>}
    </TouchableOpacity>
  );
}

// --- Toggle ---
export function NToggle({ value, onValueChange }) {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: NT.border, true: NT.primary }}
      thumbColor="#fff"
    />
  );
}

const styles = StyleSheet.create({
  sevBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 4,
  },
  sevText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.7,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  btnText: {
    fontWeight: '600',
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    height: 44,
    width: '100%',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: NT.border,
    backgroundColor: NT.surface,
    color: NT.text,
    fontSize: 14,
  },
  inputLeading: {
    position: 'absolute',
    left: 11,
    zIndex: 1,
  },
  inputTrailing: {
    position: 'absolute',
    right: 6,
    zIndex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 56,
    backgroundColor: NT.surface,
    borderBottomWidth: 1,
    borderBottomColor: NT.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: NT.border,
    backgroundColor: NT.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  topBarTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: NT.text,
    letterSpacing: -0.1,
  },
  topBarSub: {
    fontSize: 10.5,
    color: NT.textFaint,
  },
  topBarTrailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bottomNav: {
    flexDirection: 'row',
    height: 62,
    backgroundColor: NT.surface,
    borderTopWidth: 1,
    borderTopColor: NT.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  navBadge: {
    position: 'absolute',
    top: 7,
    right: '25%',
    minWidth: 15,
    height: 15,
    paddingHorizontal: 3,
    borderRadius: 7.5,
    backgroundColor: NSEV.critical.color,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  navBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginTop: 3,
  },
  navIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '40%',
    height: 2,
    borderRadius: 2,
    backgroundColor: NT.primary,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: NT.border,
    backgroundColor: NT.surface,
  },
  tabItem: {
    flex: 1,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: NT.primary,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  tabBadge: {
    marginLeft: 5,
    minWidth: 15,
    height: 15,
    paddingHorizontal: 3,
    borderRadius: 7.5,
    backgroundColor: NT.bad,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
  vitalCard: {
    flex: 1,
    backgroundColor: NT.surface,
    borderWidth: 1,
    borderColor: NT.border,
    borderRadius: 12,
    padding: 11,
    position: 'relative',
    overflow: 'hidden',
  },
  vitalAlarmBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  vitalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  vitalLabel: {
    fontSize: 9.5,
    fontWeight: '600',
    letterSpacing: 0.7,
    color: NT.textDim,
    textTransform: 'uppercase',
  },
  vitalValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  vitalValue: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  vitalUnit: {
    fontSize: 11,
    color: NT.textFaint,
    fontWeight: '500',
  },
  vitalRange: {
    fontSize: 9,
    color: NT.textFaint,
    marginTop: 2,
  },
  noteCard: {
    backgroundColor: NT.surface,
    borderWidth: 1,
    borderColor: NT.border,
    borderRadius: 12,
    padding: 12,
    gap: 7,
    marginBottom: 8,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  noteTypeBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  noteTypeText: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.7,
  },
  noteTime: {
    fontSize: 10,
    color: NT.textFaint,
  },
  noteText: {
    fontSize: 13,
    color: NT.text,
    lineHeight: 18,
  },
  noteNurse: {
    fontSize: 10.5,
    color: NT.textFaint,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 8,
    marginTop: 10,
  },
  sectionLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.9,
    color: NT.textDim,
    textTransform: 'uppercase',
  },
  sectionCount: {
    fontSize: 10,
    color: NT.textFaint,
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontWeight: '700',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: NT.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: NT.surface,
  },
  checkLabel: {
    fontSize: 13,
    color: NT.text,
    flex: 1,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  sheetContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetContent: {
    backgroundColor: NT.bg,
    borderRadius: 16,
    height: '90%',
    width: '90%',
    maxWidth: 600,
    overflow: 'hidden',
  },
  dialogOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialogBox: {
    backgroundColor: NT.surface,
    borderRadius: 16,
    padding: 22,
    width: '100%',
    maxWidth: 400,
  },
  dialogTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: NT.text,
    marginBottom: 8,
  },
  dialogBody: {
    fontSize: 13.5,
    color: NT.textDim,
    lineHeight: 20,
    marginBottom: 20,
  },
  toastContainer: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
    zIndex: 999,
    alignItems: 'center',
  },
  toastBox: {
    backgroundColor: NT.text,
    borderRadius: 12,
    padding: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
    width: '100%',
    maxWidth: 400,
  },
  toastDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  toastText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '500',
    flex: 1,
  },
  fieldContainer: {
    flexDirection: 'column',
    gap: 5,
  },
  fieldLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: NT.textDim,
    letterSpacing: 0.5,
  },
  otpRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  otpBox: {
    width: 46,
    height: 54,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    borderWidth: 2,
    backgroundColor: NT.surface,
    color: NT.text,
    fontFamily: 'JetBrains Mono',
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 7,
    paddingHorizontal: 14,
    backgroundColor: '#FF3B30',
  },
  offlineText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  sseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  sseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sseText: {
    fontSize: 9,
    fontWeight: '700',
  },
});
