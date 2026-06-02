
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { NT, NSEV } from '../constants/theme';
import { NPATIENTS } from '../constants/mockData';
import { NTopBar, NBtn, NParamIcon } from '../components/Shared';
import { NIcoCheckCirc } from '../components/Icons';

export function AlarmsScreen({ alarms, onAlarmTap, onMarkAll, onBack }) {
  const [loading, setLoading] = useState(false);
  const sections = ['critical', 'high', 'medium', 'low'];
  const bySection = sections.map(sev => ({
    sev, items: alarms.filter(a => a.severity === sev)
  })).filter(s => s.items.length > 0);

  const markAll = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onMarkAll?.();
    }, 700);
  };

  return (
    <SafeAreaView style={styles.container}>
      <NTopBar
        title="Active Alarms"
        subtitle={`${alarms.length} alarm${alarms.length !== 1 ? 's' : ''} across ward`}
        onBack={onBack}
        trailing={
          <NBtn size="sm" variant="ghost" loading={loading} onPress={markAll}>Mark all handled</NBtn>
        }
      />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {bySection.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <NIcoCheckCirc s={32} c={NT.primary} />
            </View>
            <Text style={styles.emptyTitle}>All Clear</Text>
            <Text style={styles.emptySub}>No active alarms across the ward.</Text>
          </View>
        ) : bySection.map(({ sev, items }) => {
          const s = NSEV[sev];
          return (
            <View key={sev} style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionDot, { backgroundColor: s.color }]} />
                <Text style={[styles.sectionTitle, { color: s.color }]}>{s.label}</Text>
                <Text style={styles.sectionCount}>{items.length}</Text>
                <View style={[styles.sectionLine, { backgroundColor: s.color + '30' }]} />
              </View>
              <View style={styles.alarmList}>
                {items.map((alarm) => {
                  const p = NPATIENTS[alarm.patientId];
                  return (
                    <TouchableOpacity key={alarm.id} activeOpacity={0.8} onPress={() => onAlarmTap?.(alarm)} style={[styles.alarmCard, { borderColor: s.color + '33' }]}>
                      <View style={[styles.severityBar, { backgroundColor: s.color }]} />
                      <View style={styles.alarmContent}>
                        <View style={styles.alarmHeader}>
                          <View style={styles.alarmInfo}>
                            <View style={styles.bedBadge}>
                              <Text style={styles.bedBadgeText}>{alarm.bedCode}</Text>
                            </View>
                            <NParamIcon param={alarm.param} size={14} color={s.color} />
                            <Text style={[styles.paramText, { color: s.color }]}>{alarm.param}: {alarm.value}{alarm.unit}</Text>
                          </View>
                          <Text style={styles.timeText}>{alarm.raisedMin}m ago</Text>
                        </View>
                        {p && <Text style={styles.patientName}>{p.name}</Text>}
                        <Text style={styles.descText}>{alarm.desc}</Text>
                        <div style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                          <NBtn size="sm" variant="ghost" onPress={() => onAlarmTap?.(alarm)}>View Bed</NBtn>
                          <NBtn size="sm" variant="secondary" onPress={() => {}}>Send to Doctor</NBtn>
                        </div>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}
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
  scrollContent: {
    padding: 14,
    gap: 20,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 48,
    backgroundColor: NT.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: NT.border,
    marginTop: 20,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: NT.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: NT.text,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    color: NT.textDim,
    textAlign: 'center',
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  sectionCount: {
    fontSize: 10,
    color: NT.textFaint,
    fontFamily: 'JetBrains Mono',
  },
  sectionLine: {
    flex: 1,
    height: 1,
  },
  alarmList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  alarmCard: {
    flexDirection: 'row',
    backgroundColor: NT.surface,
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 2,
    width: '48.5%',
  },
  severityBar: {
    width: 5,
  },
  alarmContent: {
    flex: 1,
    padding: 12,
    gap: 5,
  },
  alarmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  alarmInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bedBadge: {
    backgroundColor: NT.primary,
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 5,
  },
  bedBadgeText: {
    color: '#fff',
    fontSize: 10.5,
    fontWeight: '700',
    fontFamily: 'JetBrains Mono',
  },
  paramText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'JetBrains Mono',
  },
  timeText: {
    fontSize: 10,
    color: NT.textFaint,
  },
  patientName: {
    fontSize: 13,
    fontWeight: '600',
    color: NT.text,
  },
  descText: {
    fontSize: 11.5,
    color: NT.textDim,
  },
});
