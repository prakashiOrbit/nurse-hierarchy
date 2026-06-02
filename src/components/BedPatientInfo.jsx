
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NT, NSEV, NBED_COLORS } from '../constants/theme';
import { NWARD, NPATIENTS, NINSTRUCTIONS, NACTIVITY } from '../constants/mockData';
import { NTopBar, NTabBar, NBtn, NSevBadge, NSection, NVitalCard, NAvatar, NStatusDot, NChip, NSheet } from './Shared';
import { NIcoX, NIcoAlert, NIcoActivity, NIcoFile, NIcoBell, NIcoClipList, NIcoUser, NIcoMonitor, NIcoPlus, NIcoPill, NIcoPhone, NIcoBack, NIcoTransfer, NIcoChevD, NIcoChevR } from './Icons';

export function PatientModalHeader({ patient, bed, onClose }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <NStatusDot status={patient.status} size={8} />
            <Text style={styles.nameText}>{patient.name}</Text>
          </View>
          <View style={styles.subRow}>
            <Text style={styles.mrnText}>{patient.mrn}</Text>
            <Text style={styles.dotSeparator}>·</Text>
            <Text style={styles.ageText}>{patient.age}y {patient.gender === 'M' ? 'Male' : 'Female'}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <NIcoX s={15} c={NT.textDim} />
        </TouchableOpacity>
      </View>
      <View style={styles.badgeRow}>
        <View style={styles.bedCodeBadge}><Text style={styles.bedCodeText}>{bed.code}</Text></View>
        <View style={styles.wardBadge}><Text style={styles.wardBadgeText}>{NWARD.name}</Text></View>
        {patient.alarmCount > 0 && (
          <View style={styles.alarmCountBadge}>
            <Text style={styles.alarmCountText}>{patient.alarmCount} alarm{patient.alarmCount > 1 ? 's' : ''}</Text>
          </View>
        )}
        <NSevBadge severity={patient.status} size="sm" />
      </View>
    </View>
  );
}

export function AlarmBanner({ alarms, onHandle, onDoctor }) {
  const top = alarms[0];
  if (!top) return null;
  const s = NSEV[top.severity];
  return (
    <View style={[styles.alarmBanner, { backgroundColor: s.soft, borderColor: s.color + '44' }]}>
      <NIcoAlert s={16} c={s.color} />
      <View style={{ flex: 1 }}>
        <Text style={styles.alarmDesc}>{top.desc}</Text>
        <Text style={styles.alarmParam}>{top.param}: <Text style={{ color: s.color, fontWeight: '700' }}>{top.value}{top.unit}</Text></Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        <NBtn size="sm" variant="ghost" onPress={onHandle}>Handle</NBtn>
        <NBtn size="sm" variant="secondary" onPress={onDoctor}>Doctor</NBtn>
      </View>
    </View>
  );
}

export function BedInfoTab({ patient, bed, onAction }) {
  const vCfg = [
    { param: 'HR', label: 'Heart Rate', value: patient.vitals.hr, unit: 'bpm', abn: patient.vitals.hr > 100 || patient.vitals.hr < 50 },
    { param: 'SpO2', label: 'SpO₂', value: patient.vitals.spo2, unit: '%', abn: patient.vitals.spo2 < 94 },
    { param: 'RR', label: 'Resp Rate', value: patient.vitals.rr, unit: '/min', abn: patient.vitals.rr > 20 || patient.vitals.rr < 12 },
    { param: 'NIBP', label: 'NIBP', value: patient.vitals.nibp, unit: 'mmHg', abn: false },
    { param: 'TEMP', label: 'Temp', value: patient.vitals.temp, unit: '°C', abn: patient.vitals.temp > 37.8 },
  ];
  const mon = bed?.status === 'monitoring';

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.tabContent}>
      {/* Admission grid */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Admission</Text>
        <View style={styles.admissionGrid}>
          {[
            ['Admitted', patient.admitDate],
            ['Diagnosis', patient.diagnosis],
            ['Doctor', patient.doctor],
            ['Ward', NWARD.name]
          ].map(([k, v]) => (
            <View key={k} style={styles.gridItem}>
              <Text style={styles.gridKey}>{k}</Text>
              <Text style={styles.gridValue}>{v}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Monitoring launch card */}
      {mon && (
        <TouchableOpacity 
          onPress={() => onAction('monitoring-view')} 
          style={styles.launchCard}
        >
          <View style={styles.launchIcon}>
            <NIcoActivity s={20} c={NT.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.launchTitle}>Live Monitoring</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 }}>
              <View style={styles.pulseDot} />
              <Text style={styles.launchSub}>ECG · SpO₂ · RESP waveforms + 24h trend</Text>
            </View>
          </View>
          <NIcoChevR s={16} c={NT.primary} />
        </TouchableOpacity>
      )}

      <View>
        <NSection label="Latest Vitals" />
        <View style={styles.vitalGrid}>
          {vCfg.map(v => <NVitalCard key={v.param} param={v.param} label={v.label} value={v.value} unit={v.unit} status={v.abn ? 'high' : 'stable'} />)}
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Medical History</Text>
          <NIcoChevD s={15} c={NT.textFaint} />
        </View>
        <View style={styles.cardBody}>
          {['Hypertension (dx 2018)', 'Type 2 Diabetes Mellitus', 'Allergies: Penicillin (rash)'].map((h, i) => (
            <View key={i} style={styles.historyItem}>
              <View style={styles.historyDot} />
              <Text style={styles.historyText}>{h}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Care Team</Text>
        <View style={[styles.cardBody, { gap: 10, marginTop: 10 }]}>
          {[{ name: patient.doctor, role: 'Attending Physician', initials: patient.doctor.split('.')[1]?.slice(0, 2).toUpperCase() || 'DR' }, { name: 'Sarah Mitchell', role: 'Primary Nurse', initials: 'SM' }].map(m => (
            <View key={m.name} style={styles.memberRow}>
              <NAvatar initials={m.initials} size={32} color={NT.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.memberName}>{m.name}</Text>
                <Text style={styles.memberRole}>{m.role}</Text>
              </View>
              <TouchableOpacity style={styles.iconBtn}>
                <NIcoPhone s={14} c={NT.textDim} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

export function BedInstructionsTab() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.tabContent}>
      {NINSTRUCTIONS.map(ins => (
        <View key={ins.id} style={styles.instructionCard}>
          {!ins.read && <View style={styles.unreadDot} />}
          <Text style={styles.instructionText}>{ins.text}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.doctorText}>{ins.doctor}</Text>
            <Text style={styles.timeText}>{ins.time}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

export function BedActivityTab() {
  const icons = { alarm: <NIcoBell s={13} />, vitals: <NIcoActivity s={13} />, medication: <NIcoPill s={13} />, instruction: <NIcoClipList s={13} />, note: <NIcoFile s={13} />, device: <NIcoMonitor s={13} /> };
  const colors = { alarm: NSEV.high.color, vitals: NT.primary, medication: '#007AFF', instruction: NT.secondary, note: NT.textDim, device: NT.primary };
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.tabContent}>
      {NACTIVITY.map(act => (
        <View key={act.id} style={styles.activityRow}>
          <View style={[styles.activityIcon, { color: colors[act.type] || NT.textDim }]}>
            {React.cloneElement(icons[act.type] || <NIcoInfo s={13} />, { c: colors[act.type] || NT.textDim })}
          </View>
          <View style={styles.activityCard}>
            <Text style={styles.activityText}>{act.text}</Text>
            <Text style={styles.activityTime}>{act.time}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

export function BedActionBar({ bed, onAction }) {
  const mon = bed.status === 'monitoring';
  const actions = [
    mon && { id: 'monitoring-view', label: 'Live Monitoring', icon: <NIcoActivity s={14} />, active: true },
    { id: 'monitoring', label: mon ? 'Stop Monitoring' : 'Start Monitoring', icon: <NIcoMonitor s={14} />, active: false },
    { id: 'alarm-config', label: 'Alarm Config', icon: <NIcoBell s={14} /> },
    { id: 'transfer', label: 'Ward Transfer', icon: <NIcoTransfer s={14} /> },
    { id: 'discharge', label: 'Discharge', icon: <NIcoBack s={14} />, danger: true },
    { id: 'add-note', label: 'Add Note', icon: <NIcoFile s={14} /> },
    { id: 'medication', label: 'Medications', icon: <NIcoPill s={14} /> },
    { id: 'incident', label: 'Report Incident', icon: <NIcoFlag s={14} /> },
    { id: 'emergency', label: 'Emergency', icon: <NIcoAlert s={14} />, danger: true },
    { id: 'details', label: 'Full Record', icon: <NIcoUser s={14} /> },
  ].filter(Boolean);

  return (
    <View style={styles.actionBar}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {actions.map(a => <NChip key={a.id} label={a.label} icon={a.icon} active={a.active} danger={a.danger} onClick={() => onAction(a.id)} />)}
      </ScrollView>
    </View>
  );
}

export function BedPatientInfo({ bed, onClose, onAction, visible }) {
  const [tab, setTab] = useState('info');
  if (!bed) return null;
  const patient = NPATIENTS[bed.patientId];
  const bedAlarms = NALARMS.filter(a => a.bedCode === bed.code);

  return (
    <NSheet visible={visible} onClose={onClose} full={false}>
      {!patient ? (
        <View style={{ flex: 1 }}>
          <NTopBar title={`Bed ${bed.code}`} subtitle={`${NBED_COLORS[bed.status]?.label || ''} · ${NWARD.name}`} onBack={onClose} />
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <NIcoBed s={32} c={NT.primary} />
            </View>
            <Text style={styles.emptyTitle}>Empty Bed</Text>
            <Text style={styles.emptySub}>This bed is currently unoccupied and available.</Text>
            <NBtn onPress={() => onAction('admit')} icon={<NIcoPlus s={16} c="#fff" />}>Admit Patient</NBtn>
          </View>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <PatientModalHeader patient={patient} bed={bed} onClose={onClose} />
          <AlarmBanner alarms={bedAlarms} onHandle={() => onAction('handle-alarm')} onDoctor={() => onAction('send-doctor')} />
          <NTabBar
            tabs={[
              { id: 'info', label: 'Info', icon: <NIcoUser s={13} c={tab === 'info' ? NT.primary : NT.textDim} /> },
              { id: 'instructions', label: 'Orders', icon: <NIcoClipList s={13} c={tab === 'instructions' ? NT.primary : NT.textDim} />, badge: NINSTRUCTIONS.filter(i => !i.read).length },
              { id: 'activity', label: 'Activity', icon: <NIcoActivity s={13} c={tab === 'activity' ? NT.primary : NT.textDim} /> },
            ]}
            active={tab}
            onChange={setTab}
          />
          <View style={{ flex: 1, backgroundColor: NT.bg }}>
            {tab === 'info' && <BedInfoTab patient={patient} bed={bed} onAction={handleAction => onAction(handleAction)} />}
            {tab === 'instructions' && <BedInstructionsTab />}
            {tab === 'activity' && <BedActivityTab />}
          </View>
          <BedActionBar bed={bed} onAction={onAction} />
        </View>
      )}
    </NSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 15,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: NT.border,
    backgroundColor: NT.surface,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 11,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  nameText: {
    fontSize: 17,
    fontWeight: '700',
    color: NT.text,
    letterSpacing: -0.1,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 5,
  },
  mrnText: {
    fontFamily: 'JetBrains Mono',
    fontSize: 10.5,
    color: NT.textFaint,
  },
  dotSeparator: {
    fontSize: 10,
    color: NT.border,
  },
  ageText: {
    fontSize: 11,
    color: NT.textDim,
  },
  closeBtn: {
    width: 33,
    height: 33,
    borderRadius: 16.5,
    borderWidth: 1,
    borderColor: NT.border,
    backgroundColor: NT.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  bedCodeBadge: {
    backgroundColor: NT.primary,
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 6,
  },
  bedCodeText: {
    fontFamily: 'JetBrains Mono',
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  wardBadge: {
    backgroundColor: NT.surfaceAlt,
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 6,
  },
  wardBadgeText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: NT.textDim,
  },
  alarmCountBadge: {
    backgroundColor: NSEV.high.soft,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  alarmCountText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: NSEV.high.color,
  },
  alarmBanner: {
    marginHorizontal: 14,
    marginTop: 11,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  alarmDesc: {
    fontSize: 12.5,
    fontWeight: '700',
    color: NT.text,
  },
  alarmParam: {
    fontSize: 11,
    color: NT.textDim,
  },
  tabContent: {
    padding: 14,
    gap: 14,
    paddingBottom: 22,
  },
  vitalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  card: {
    backgroundColor: NT.surface,
    borderWidth: 1,
    borderColor: NT.border,
    borderRadius: 12,
    overflow: 'hidden',
    paddingBottom: 14,
  },
  cardHeader: {
    padding: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.7,
    color: NT.textDim,
    textTransform: 'uppercase',
    paddingHorizontal: 14,
    paddingTop: 12,
    marginBottom: 10,
  },
  cardBody: {
    paddingHorizontal: 14,
  },
  admissionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 14,
  },
  gridItem: {
    width: '45%',
  },
  gridKey: {
    fontSize: 9.5,
    color: NT.textFaint,
    marginBottom: 2,
  },
  gridValue: {
    fontSize: 12.5,
    fontWeight: '600',
    color: NT.text,
  },
  launchCard: {
    backgroundColor: '#0E1C19',
    borderWidth: 1,
    borderColor: NT.primary + '44',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  launchIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: NT.primarySoft,
    borderWidth: 1,
    borderColor: NT.primary + '44',
    alignItems: 'center',
    justifyContent: 'center',
  },
  launchTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  launchSub: {
    fontSize: 10.5,
    color: NT.primary,
    fontWeight: '600',
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: NT.primary,
  },
  historyItem: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    marginTop: 7,
  },
  historyDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: NT.textFaint,
    marginTop: 6,
  },
  historyText: {
    fontSize: 12.5,
    color: NT.text,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  memberName: {
    fontSize: 12.5,
    fontWeight: '600',
    color: NT.text,
  },
  memberRole: {
    fontSize: 10.5,
    color: NT.textFaint,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: NT.border,
    backgroundColor: NT.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionCard: {
    backgroundColor: NT.surface,
    borderWidth: 1,
    borderColor: NT.border,
    borderRadius: 12,
    padding: 12,
    paddingHorizontal: 14,
    position: 'relative',
    marginBottom: 10,
  },
  unreadDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: NT.primary,
  },
  instructionText: {
    fontSize: 13,
    color: NT.text,
    lineHeight: 18,
    marginBottom: 8,
    paddingRight: 16,
  },
  doctorText: {
    fontSize: 11,
    fontWeight: '600',
    color: NT.primary,
  },
  timeText: {
    fontSize: 10,
    color: NT.textFaint,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    marginBottom: 8,
  },
  activityIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: NT.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityCard: {
    flex: 1,
    backgroundColor: NT.surface,
    borderWidth: 1,
    borderColor: NT.border,
    borderRadius: 10,
    padding: 8,
    paddingHorizontal: 11,
  },
  activityText: {
    fontSize: 12.5,
    color: NT.text,
    lineHeight: 18,
  },
  activityTime: {
    fontSize: 10,
    color: NT.textFaint,
    marginTop: 3,
  },
  actionBar: {
    padding: 10,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderTopColor: NT.border,
    backgroundColor: NT.surface,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 24,
  },
  emptyIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: NT.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: NT.text,
  },
  emptySub: {
    fontSize: 13.5,
    color: NT.textDim,
    textAlign: 'center',
  },
});
