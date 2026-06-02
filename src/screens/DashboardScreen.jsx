
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { NT, NSEV, NBED_COLORS } from '../constants/theme';
import { NWARD, NWARD_ROOMS } from '../constants/mockData';
import { NIcoBell, NIcoCheckCirc, NIcoMap, NIcoUser } from '../components/Icons';
import { NParamIcon, OfflineBanner } from '../components/Shared';
import { SVGWardLayout } from '../components/WardLayout';

export function AlarmSidebar({ alarms, onAlarmTap, onViewAll }) {
  const sorted = [...alarms].sort((a, b) => (NSEV[b.severity]?.rank || 0) - (NSEV[a.severity]?.rank || 0));
  const critCount = alarms.filter((a) => a.severity === 'critical').length;

  return (
    <View style={styles.sidebar}>
      <TouchableOpacity onPress={onViewAll} style={styles.sidebarHeader}>
        <View style={{ position: 'relative' }}>
          <NIcoBell s={20} c={critCount > 0 ? NSEV.critical.color : NT.textDim} />
          {alarms.length > 0 && (
            <View style={[styles.badge, { backgroundColor: critCount > 0 ? NSEV.critical.color : NSEV.high.color }]}>
              <Text style={styles.badgeText}>{alarms.length}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.sidebarHeaderText, { color: critCount > 0 ? NSEV.critical.color : NT.textFaint }]}>ALARMS</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.sidebarScroll}>
        {sorted.length === 0 ? (
          <View style={styles.emptySidebar}>
            <NIcoCheckCirc s={20} c={NT.primary} />
            <Text style={styles.emptyText}>All clear</Text>
          </View>
        ) : sorted.map((alarm) => {
          const s = NSEV[alarm.severity];
          return (
            <TouchableOpacity key={alarm.id} onPress={() => onAlarmTap(alarm)} style={[styles.sidebarItem, { borderColor: s.color + '44', backgroundColor: s.soft }]}>
              <View style={[styles.sidebarItemBar, { backgroundColor: s.color }]} />
              <Text style={styles.bedCodeText}>{alarm.bedCode}</Text>
              <NParamIcon param={alarm.param} size={11} color={s.color} />
              <Text style={[styles.paramText, { color: s.color }]}>{alarm.param}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

export function WardMap({ beds, alarms, onBedTap }) {
  return (
    <View style={styles.mapWrapper}>
      <View style={styles.mapHeader}>
        <View>
          <Text style={styles.wardName}>{NWARD.name}</Text>
          <Text style={styles.wardCode}>{NWARD.hospital} · {NWARD.floor}</Text>
        </View>
        <View style={{ flex: 1 }} />
        <View style={styles.headerStats}>
          <Text style={styles.statsValue}>{NWARD.occupiedBeds}</Text>
          <Text style={styles.statsLabel}>PATIENTS</Text>
        </View>
        <View style={styles.statsDivider} />
        <View style={styles.headerStats}>
          <Text style={styles.statsValue}>{NWARD.totalBeds - NWARD.occupiedBeds}</Text>
          <Text style={styles.statsLabel}>AVAILABLE</Text>
        </View>
      </View>

      <View style={styles.mapContent}>
        <SVGWardLayout beds={beds} alarms={alarms} onBedTap={onBedTap} />
      </View>

      <View style={styles.nurseStation}>
        <View style={styles.stationAvatar}>
          <Text style={styles.avatarText}>{NWARD.shift.nurse.split(' ').map(n => n[0]).join('')}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.stationTitle}>Charge Nurse: {NWARD.shift.nurse}</Text>
          <Text style={styles.stationSub}>{NWARD.shift.name} · {NWARD.shift.start} - {NWARD.shift.end}</Text>
        </View>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>STATION LIVE</Text>
        </View>
      </View>
    </View>
  );
}

export function StatusLegend({ beds }) {
  const stats = Object.keys(NBED_COLORS).map(k => {
    const count = beds.filter((b) => b.status === k).length;
    return { key: k, count, ...NBED_COLORS[k] };
  });

  return (
    <View style={styles.legend}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.legendScroll}>
        {stats.map(s => (
          <View key={s.key} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: s.dot }]} />
            <Text style={styles.legendLabel}>{s.label}</Text>
            <Text style={styles.legendCount}>{s.count}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export function DashboardScreen({ alarms, beds, onBedTap, onAlarmTap, onViewAllAlarms, connected }) {
  return (
    <SafeAreaView style={styles.container}>
      {!connected && <OfflineBanner />}
      <View style={styles.mainContent}>
        <AlarmSidebar alarms={alarms} onAlarmTap={onAlarmTap} onViewAll={onViewAllAlarms} />
        <WardMap beds={beds} alarms={alarms} onBedTap={onBedTap} />
      </View>
      <StatusLegend beds={beds} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NT.bg,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 76,
    backgroundColor: NT.surface,
    borderRightWidth: 1,
    borderRightColor: NT.border,
  },
  sidebarHeader: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: NT.surfaceAlt,
    borderBottomWidth: 1,
    borderBottomColor: NT.border,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '800',
  },
  sidebarHeaderText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 4,
  },
  sidebarScroll: {
    padding: 6,
    gap: 6,
  },
  emptySidebar: {
    alignItems: 'center',
    paddingVertical: 20,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 8,
    fontWeight: '700',
    marginTop: 4,
    color: NT.textFaint,
  },
  sidebarItem: {
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  sidebarItemBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
  bedCodeText: {
    fontSize: 10,
    fontWeight: '800',
    color: NT.text,
  },
  paramText: {
    fontSize: 9,
    fontWeight: '700',
  },
  mapWrapper: {
    flex: 1,
    backgroundColor: NT.bg,
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: NT.surface,
    borderBottomWidth: 1,
    borderBottomColor: NT.border,
  },
  wardName: {
    fontSize: 16,
    fontWeight: '800',
    color: NT.text,
    letterSpacing: -0.3,
  },
  wardCode: {
    fontSize: 11,
    color: NT.textFaint,
    marginTop: 1,
  },
  headerStats: {
    alignItems: 'center',
  },
  statsValue: {
    fontSize: 16,
    fontWeight: '800',
    color: NT.primary,
  },
  statsLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: NT.textFaint,
    letterSpacing: 0.5,
  },
  statsDivider: {
    width: 1,
    height: 24,
    backgroundColor: NT.border,
    marginHorizontal: 16,
  },
  mapContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  nurseStation: {
    margin: 16,
    padding: 12,
    borderRadius: 14,
    backgroundColor: NT.surface,
    borderWidth: 1,
    borderColor: NT.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  stationAvatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: NT.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: NT.primary,
    fontWeight: '800',
    fontSize: 13,
  },
  stationTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: NT.text,
  },
  stationSub: {
    fontSize: 11,
    color: NT.textFaint,
    marginTop: 1,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: NT.good + '15',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: NT.good,
  },
  liveText: {
    fontSize: 9,
    fontWeight: '800',
    color: NT.good,
  },
  legend: {
    height: 44,
    backgroundColor: NT.surface,
    borderTopWidth: 1,
    borderTopColor: NT.border,
  },
  legendScroll: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: NT.textDim,
  },
  legendCount: {
    fontSize: 11,
    color: NT.textFaint,
    fontWeight: '700',
  },
});
