
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { NT, NSEV } from '../constants/theme';
import { NWARD, NHANDOVER, NPATIENTS } from '../constants/mockData';
import { NTopBar, NBtn, NAvatar, NCheck } from '../components/Shared';
import { NIcoBell, NIcoCheckCirc, NIcoAlert } from '../components/Icons';

export function HandoverScreen({ onBack }) {
  const [patients, setPatients] = useState(
    NHANDOVER.map(h => ({ ...h, tasks: h.tasks.map(t => ({ ...t })) }))
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [timestamp, setTimestamp] = useState('');

  const toggleTask = (pi, ti) => {
    setPatients(ps => ps.map((p, pidx) => {
      if (pidx !== pi) return p;
      return { ...p, tasks: p.tasks.map((t, tidx) => tidx === ti ? { ...t, done: !t.done } : t) };
    }));
  };

  const urgentComplete = patients
    .filter(p => p.priority === 'URGENT')
    .every(p => p.tasks.every(t => t.done));

  const doSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setSubmitted(true);
    }, 900);
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.container}>
        <NTopBar title="Shift Handover" onBack={onBack} />
        <View style={styles.submittedContainer}>
          <View style={styles.successIcon}>
            <NIcoCheckCirc s={38} c={NT.primary} />
          </View>
          <Text style={styles.successTitle}>Handover Complete</Text>
          <Text style={styles.successSub}>
            Shift handover submitted successfully at {timestamp}.{'\n'}Incoming nurse has been notified.
          </Text>
          <View style={styles.summaryCard}>
            {[
              ['Shift', NWARD.shift.name],
              ['Ward', NWARD.name],
              ['Submitted by', NWARD.shift.nurse],
              ['Time', timestamp]
            ].map(([k, v]) => (
              <View key={k} style={styles.summaryRow}>
                <Text style={styles.summaryKey}>{k}</Text>
                <Text style={styles.summaryValue}>{v}</Text>
              </View>
            ))}
          </View>
          <NBtn fullWidth variant="ghost" onPress={onBack}>Close</NBtn>
        </View>
      </SafeAreaView>
    );
  }

  const urgentCount = patients.filter(p => p.priority === 'URGENT').length;
  const pendingCount = patients.reduce((a, p) => a + p.tasks.filter(t => !t.done).length, 0);

  return (
    <SafeAreaView style={styles.container}>
      <NTopBar
        title="Shift Handover"
        subtitle={`${NWARD.shift.name} · ends ${NWARD.shift.end}`}
        onBack={onBack}
      />
      
      <View style={styles.main}>
        {/* LEFT: Summary & Actions */}
        <View style={styles.sidebar}>
          <View style={styles.sidebarSection}>
             <Text style={styles.sidebarLabel}>SHIFT SUMMARY</Text>
             <View style={styles.sidebarGrid}>
                {[
                  { label: 'Patients', value: patients.length, color: NT.primary },
                  { label: 'Urgent', value: urgentCount, color: NSEV.high.color },
                  { label: 'Pending', value: pendingCount, color: pendingCount > 0 ? NT.warn : NT.primary },
                ].map(s => (
                  <View key={s.label} style={styles.sidebarItem}>
                    <Text style={[styles.sidebarValue, { color: s.color }]}>{s.value}</Text>
                    <Text style={styles.sidebarItemLabel}>{s.label}</Text>
                  </View>
                ))}
             </View>
          </View>

          <View style={{ flex: 1 }} />

          <View style={styles.sidebarSection}>
            {!urgentComplete && (
              <View style={styles.warningBox}>
                <NIcoAlert s={14} c={NT.warn} />
                <Text style={styles.warningText}>Complete all URGENT tasks before submitting</Text>
              </View>
            )}
            <NBtn fullWidth loading={submitting} disabled={!urgentComplete} onPress={doSubmit}>
              Submit Handover
            </NBtn>
          </View>
        </View>

        {/* RIGHT: Patient List */}
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
          {patients.map((hp, pi) => {
            const p = NPATIENTS[hp.patientId];
            const isUrgent = hp.priority === 'URGENT';
            return (
              <View key={hp.patientId} style={styles.patientCard}>
                <View style={styles.patientHeader}>
                  <NAvatar initials={p.name.split(' ').map((n) => n[0]).join('').slice(0, 2)} size={36} color={isUrgent ? NSEV.high.color : NT.primary} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.patientName}>{p.name}</Text>
                    <View style={styles.patientSub}>
                      <View style={styles.bedBadge}><Text style={styles.bedBadgeText}>{hp.bedCode}</Text></View>
                      <Text style={styles.mrnText}>{p.mrn}</Text>
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 5 }}>
                    <View style={[styles.priorityBadge, { backgroundColor: isUrgent ? NSEV.high.soft : NT.primarySoft }]}>
                      <Text style={[styles.priorityText, { color: isUrgent ? NSEV.high.color : NT.primary }]}>{hp.priority}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.tasksSection}>
                  {hp.tasks.map((task, ti) => (
                    <NCheck key={task.id} checked={task.done} onChange={() => toggleTask(pi, ti)} label={task.text} />
                  ))}
                  {hp.alarmCount > 0 && (
                    <View style={styles.alarmAlert}>
                      <NIcoBell s={13} c={NSEV.high.color} />
                      <Text style={styles.alarmAlertText}>{hp.alarmCount} active alarms</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NT.bg,
  },
  main: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: '30%',
    backgroundColor: NT.surface,
    borderRightWidth: 1,
    borderRightColor: NT.border,
    padding: 16,
  },
  sidebarSection: {
    gap: 12,
  },
  sidebarLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: NT.textFaint,
    letterSpacing: 1,
  },
  sidebarGrid: {
    gap: 15,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: NT.borderSoft,
  },
  sidebarValue: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'JetBrains Mono',
  },
  sidebarItemLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: NT.textDim,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  submittedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 18,
  },
  successIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: NT.primarySoft,
    borderWidth: 2,
    borderColor: NT.primary + '44',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: NT.text,
    textAlign: 'center',
  },
  successSub: {
    fontSize: 13,
    color: NT.textDim,
    textAlign: 'center',
    lineHeight: 20,
  },
  summaryCard: {
    backgroundColor: NT.surface,
    borderWidth: 1,
    borderColor: NT.border,
    borderRadius: 14,
    padding: 14,
    width: '100%',
    maxWidth: 400,
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryKey: {
    fontSize: 12,
    color: NT.textFaint,
  },
  summaryValue: {
    fontSize: 12.5,
    fontWeight: '600',
    color: NT.text,
  },
  patientCard: {
    backgroundColor: NT.surface,
    borderWidth: 1,
    borderColor: NT.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  patientHeader: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: NT.borderSoft,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  patientName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: NT.text,
  },
  patientSub: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  bedBadge: {
    backgroundColor: NT.primary,
    paddingVertical: 1,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  bedBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'JetBrains Mono',
  },
  mrnText: {
    fontSize: 10.5,
    color: NT.textFaint,
  },
  priorityBadge: {
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.7,
  },
  tasksSection: {
    padding: 10,
    gap: 8,
  },
  alarmAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 6,
    borderRadius: 6,
    backgroundColor: NSEV.high.soft,
    borderWidth: 1,
    borderColor: NSEV.high.color + '33',
  },
  alarmAlertText: {
    fontSize: 11,
    color: NSEV.high.color,
    fontWeight: '600',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 10,
    backgroundColor: NT.warnSoft,
    borderWidth: 1,
    borderColor: NT.warn + '44',
  },
  warningText: {
    fontSize: 11,
    color: NT.warn,
    fontWeight: '600',
    flex: 1,
  },
});
