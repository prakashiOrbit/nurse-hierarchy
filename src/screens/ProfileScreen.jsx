
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { NT, NSEV } from '../constants/theme';
import { NWARD } from '../constants/mockData';
import { NTopBar, NBtn, NToggle } from '../components/Shared';
import { NIcoLock, NIcoFingerp, NIcoBell, NIcoShield, NIcoInfo, NIcoLogOut, NIcoChevR } from '../components/Icons';

export function ProfileScreen({ onLogout }) {
  const [biometric, setBiometric] = useState(false);
  const [notifCrit, setNotifCrit] = useState(true);
  const [notifHigh, setNotifHigh] = useState(true);
  const [loading, setLoading] = useState(false);

  const doLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out of the clinical dashboard?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive",
          onPress: () => {
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              onLogout?.();
            }, 700);
          }
        }
      ]
    );
  };

  const MenuItem = ({ icon, label, sub, right, onPress, danger, topBorder }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[
        styles.menuItem,
        topBorder && { borderTopWidth: 1, borderTopColor: NT.borderSoft }
      ]}
    >
      <View style={[styles.menuIcon, { backgroundColor: danger ? NT.badSoft : NT.primarySoft }]}>
        {React.cloneElement(icon, { c: danger ? NT.bad : NT.primary })}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.menuLabel, { color: danger ? NT.bad : NT.text }]}>{label}</Text>
        {sub && <Text style={styles.menuSub}>{sub}</Text>}
      </View>
      {right || (onPress && !danger && <NIcoChevR s={16} c={NT.textFaint} />)}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Nurse card */}
        <View style={styles.nurseCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>SM</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.nurseName}>Sarah Mitchell</Text>
            <Text style={styles.nurseRole}>Staff Nurse · ID: NRS-4821</Text>
          </View>
          <View style={styles.statsRow}>
            {[
              ['Ward', NWARD.code],
              ['Shift', NWARD.shift.name.replace(' Shift', '')],
              ['Status', 'On Duty']
            ].map(([k, v]) => (
              <View key={k} style={styles.statPill}>
                <Text style={styles.statValue}>{v}</Text>
                <Text style={styles.statLabel}>{k}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Account section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuGroup}>
            <MenuItem icon={<NIcoLock s={18} />} label="Change Password" sub="Update your login password" onPress={() => {}} />
            <MenuItem 
              icon={<NIcoFingerp s={18} />} 
              label="Biometric Login" 
              sub="Use fingerprint or face ID" 
              right={<NToggle value={biometric} onValueChange={setBiometric} />}
              topBorder
            />
          </View>
        </View>

        {/* Notifications section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.menuGroup}>
            <MenuItem 
              icon={<NIcoBell s={18} />} 
              label="Critical Alarms" 
              sub="Immediate alerts for life-threatening events" 
              right={<NToggle value={notifCrit} onValueChange={setNotifCrit} />}
            />
            <MenuItem 
              icon={<NIcoBell s={18} />} 
              label="High Priority Alarms" 
              sub="Alerts for significant vital changes" 
              right={<NToggle value={notifHigh} onValueChange={setNotifHigh} />}
              topBorder
            />
          </View>
        </View>

        {/* Help section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menuGroup}>
            <MenuItem icon={<NIcoShield s={18} />} label="Privacy Policy" onPress={() => {}} />
            <MenuItem icon={<NIcoInfo s={18} />} label="App Version" sub="v0.8.2 (Production)" topBorder />
            <MenuItem 
              icon={<NIcoLogOut s={18} />} 
              label="Sign Out" 
              sub="Securely end your session" 
              danger 
              topBorder 
              onPress={doLogout} 
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NT.bg,
  },
  scroll: {
    flex: 1,
  },
  nurseCard: {
    backgroundColor: NT.primary,
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 12,
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
  },
  nurseName: {
    fontSize: 19,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.1,
  },
  nurseRole: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 3,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  statPill: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    minWidth: 80,
  },
  statValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  statLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 1,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 14,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingBottom: 6,
    fontSize: 10.5,
    fontWeight: '700',
    color: NT.textFaint,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  menuGroup: {
    backgroundColor: NT.surface,
    borderWidth: 1,
    borderColor: NT.border,
    borderRadius: 14,
    overflow: 'hidden',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
    paddingHorizontal: 16,
    gap: 12,
    width: '50%',
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  menuSub: {
    fontSize: 11,
    color: NT.textFaint,
    marginTop: 1,
  },
});
