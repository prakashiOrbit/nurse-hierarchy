
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { NT, NSEV, NBED_COLORS } from '../constants/theme';
import { NWARD, NWARD_ROOMS } from '../constants/mockData';
import { NIcoBell, NIcoCheckCirc, NIcoMap, NIcoUser } from '../components/Icons';
import { NParamIcon, OfflineBanner } from '../components/Shared';
import { SVGRoomFloorPlan } from '../components/WardLayout';

export function AlarmSidebar({ alarms, onAlarmTap, onViewAll }) {
  const sorted = [...alarms].sort((a, b) => (NSEV[b.severity]?.rank || 0) - (NSEV[a.severity]?.rank || 0));
  const critCount = alarms.filter((a) => a.severity === 'critical').length;

  return (
    <View style={styles.sidebar}>
      <TouchableOpacity onPress={onViewAll} style={styles.sidebarHeader}>
        <View style={{ position: 'relative' }}>
          <NIcoBell s={22} c={critCount > 0 ? NSEV.critical.color : NT.textDim} />
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
            <NIcoCheckCirc s={22} c={NT.primary} />
            <Text style={styles.emptyText}>All clear</Text>
          </View>
        ) : sorted.map((alarm) => {
          const s = NSEV[alarm.severity];
          return (
            <TouchableOpacity key={alarm.id} onPress={() => onAlarmTap(alarm)} style={[styles.sidebarItem, { borderColor: s.color + '33', backgroundColor: s.soft }]}>
              <Text style={styles.bedCodeText}>{alarm.bedCode}</Text>
              <NParamIcon param={alarm.param} size={13} color={s.color} />
              <Text style={[styles.paramText, { color: s.color }]}>{alarm.param}</Text>
              <Text style={styles.timeAgoText}>{alarm.raisedMin}m ago</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

export function WardMap({ beds, alarms, onBedTap }) {
  const rows = NWARD_ROOMS.reduce((acc, room, i) => {
    if (i % 4 === 0) acc.push([]);
    acc[acc.length - 1].push(room);
    return acc;
  }, []);

  return (
    <ScrollView style={styles.mapContainer} contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={styles.mapHeader}>
        <NIcoMap s={13} c={NT.textFaint} />
        <Text style={styles.wardName}>{NWARD.name}</Text>
        <Text style={styles.wardCode}>{NWARD.code}</Text>
        <View style={{ flex: 1 }} />
        <Text style={styles.bedStats}>{NWARD.occupiedBeds}/{NWARD.totalBeds} beds</Text>
      </View>

      <View style={styles.roomGrid}>
        {rows.map((row, ri) => (
          <View key={ri} style={styles.roomRow}>
            {row.map(room => (
              <View key={room.id} style={styles.roomCard}>
                <SVGRoomFloorPlan room={room} beds={beds} alarms={alarms} onBedTap={onBedTap} />
              </View>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.nurseStation}>
        <View style={styles.stationIcon}>
          <NIcoUser s={15} c="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.stationTitle}>Nurse Station</Text>
          <Text style={styles.stationNurse} numberOfLines={1}>{NWARD.shift.nurse} · {NWARD.shift.name}</Text>
        </View>
        <Text style={styles.stationTime}>{NWARD.shift.start}–{NWARD.shift.end}</Text>
      </View>
    </ScrollView>
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
    <View style={styles.container}>
      {!connected && <OfflineBanner />}
      <View style={styles.mainContent}>
        <AlarmSidebar alarms={alarms} onAlarmTap={onAlarmTap} onViewAll={onViewAllAlarms} />
        <WardMap beds={beds} alarms={alarms} onBedTap={onBedTap} />
      </View>
      <StatusLegend beds={beds} />
    </View>
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
    width: 86,
    backgroundColor: NT.surface,
    borderRightWidth: 1,
    borderRightColor: NT.border,
  },
  sidebarHeader: {
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: NT.border,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    minWidth: 15,
    height: 15,
    paddingHorizontal: 3,
    borderRadius: 7.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
  sidebarHeaderText: {
    fontSize: 8.5,
    fontWeight: '700',
    letterSpacing: 0.7,
    marginTop: 3,
  },
  sidebarScroll: {
    padding: 6,
    gap: 5,
  },
  emptySidebar: {
    alignItems: 'center',
    paddingVertical: 14,
    gap: 6,
  },
  emptyText: {
    fontSize: 9,
    color: NT.textFaint,
    textAlign: 'center',
  },
  sidebarItem: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 3,
    borderRadius: 9,
    borderWidth: 1,
    width: '100%',
    gap: 2,
  },
  bedCodeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: NT.textDim,
  },
  paramText: {
    fontSize: 8.5,
    fontWeight: '700',
    textAlign: 'center',
  },
  timeAgoText: {
    fontSize: 8,
    color: NT.textFaint,
  },
  mapContainer: {
    flex: 1,
    padding: 10,
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  wardName: {
    fontSize: 11.5,
    fontWeight: '700',
    color: NT.textDim,
  },
  wardCode: {
    fontSize: 10,
    color: NT.textFaint,
  },
  bedStats: {
    fontSize: 10,
    color: NT.textFaint,
  },
  roomGrid: {
    gap: 7,
  },
  roomRow: {
    flexDirection: 'row',
    gap: 7,
  },
  roomCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: NT.border,
    overflow: 'hidden',
  },
  nurseStation: {
    marginTop: 9,
    padding: 9,
    borderRadius: 10,
    backgroundColor: NT.primarySoft,
    borderWidth: 1,
    borderColor: NT.primary + '33',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stationIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: NT.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stationTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: NT.text,
  },
  stationNurse: {
    fontSize: 10,
    color: NT.textDim,
  },
  stationTime: {
    fontSize: 10,
    color: NT.primary,
    fontWeight: '700',
  },
  legend: {
    height: 36,
    backgroundColor: NT.surface,
    borderTopWidth: 1,
    borderTopColor: NT.border,
  },
  legendScroll: {
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: NT.textDim,
  },
  legendCount: {
    fontSize: 10,
    color: NT.textFaint,
    fontWeight: '700',
  },
});
