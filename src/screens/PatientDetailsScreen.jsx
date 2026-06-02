
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { NT, NSEV } from '../constants/theme';
import { NWARD, NNOTES, NMEDS } from '../constants/mockData';
import { NTopBar, NTabBar, NBtn, NSevBadge, NSection, NVitalCard, NNoteCard } from '../components/Shared';
import { NIcoHeart, NIcoFile, NIcoPill, NIcoMonitor, NIcoActivity, NIcoChevR, NIcoPlus, NIcoCheckCirc } from '../components/Icons';

export function PatientDetailsScreen({ patient, bed, onClose, onMonitor, onAddNote, onMedication }) {
  const [activeTab, setTab] = useState('notes'); // In landscape, vitals are always visible on left
  if (!patient) return null;

  const vCfg = [
    { param: 'HR', label: 'HR', value: patient.vitals.hr, unit: 'bpm', abn: patient.vitals.hr > 100 || patient.vitals.hr < 50 },
    { param: 'SpO2', label: 'SpO₂', value: patient.vitals.spo2, unit: '%', abn: patient.vitals.spo2 < 94 },
    { param: 'RR', label: 'RESP', value: patient.vitals.rr, unit: '/m', abn: patient.vitals.rr > 20 || patient.vitals.rr < 12 },
    { param: 'NIBP', label: 'NIBP', value: patient.vitals.nibp, unit: 'mmHg', abn: false },
    { param: 'TEMP', label: 'TEMP', value: patient.vitals.temp, unit: '°C', abn: patient.vitals.temp > 37.8 },
  ];

  const sideTabs = [
    { id: 'notes', label: 'Notes', icon: <NIcoFile s={13} c={activeTab === 'notes' ? NT.primary : NT.textDim} /> },
    { id: 'meds', label: 'Meds', icon: <NIcoPill s={13} c={activeTab === 'meds' ? NT.primary : NT.textDim} /> },
  ];

  const mon = bed?.status === 'monitoring';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrapper}>
        <NTopBar
          title={patient.name}
          subtitle={`${bed?.code || ''} · ${NWARD.name}`}
          onBack={onClose}
          trailing={
            <View style={{ flexDirection: 'row', gap: 10 }}>
               <NBtn size="sm" variant="outline" onPress={onAddNote} icon={<NIcoPlus s={14} c={NT.primary} />}>Add Note</NBtn>
               <NBtn size="sm" variant={mon ? 'outline' : 'primary'} danger={mon} onPress={onMonitor} icon={<NIcoMonitor s={14} c={mon ? NT.bad : '#fff'} />}>
                {mon ? 'Live View' : 'Monitor'}
               </NBtn>
            </View>
          }
        />
        <View style={styles.pillRow}>
          <View style={styles.pill}><Text style={styles.pillText}>{patient.mrn}</Text></View>
          <View style={styles.pill}><Text style={styles.pillText}>{patient.age}y {patient.gender}</Text></View>
          <View style={styles.pill}><Text style={styles.pillText}>{patient.diagnosis}</Text></View>
          <NSevBadge severity={patient.status} size="sm" />
        </View>
      </View>

      <View style={styles.splitContent}>
        {/* LEFT: Vitals & History (Fixed) */}
        <View style={styles.leftCol}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.colScroll}>
            <NSection label="Clinical Vitals" right={<Text style={styles.updatedText}>1m ago</Text>} />
            <View style={styles.vitalGrid}>
              {vCfg.map(v => (
                <View key={v.param} style={styles.vitalItem}>
                  <NVitalCard param={v.param} label={v.label} value={v.value} unit={v.unit} status={v.abn ? 'high' : 'stable'} />
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.trendCard}>
              <NIcoActivity s={18} c={NT.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.trendTitle}>24h Vital Trend</Text>
              </View>
              <NIcoChevR s={16} c={NT.textFaint} />
            </TouchableOpacity>

            <NSection label="Medical History" />
            <View style={styles.historyCard}>
              {['Hypertension', 'Type 2 Diabetes', 'Penicillin Allergy'].map((h, i) => (
                <View key={i} style={styles.historyItem}>
                  <View style={styles.historyDot} />
                  <Text style={styles.historyText}>{h}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* RIGHT: Tabs (Notes/Meds) */}
        <View style={styles.rightCol}>
          <NTabBar tabs={sideTabs} active={activeTab} onChange={setTab} />
          <ScrollView style={styles.scroll} contentContainerStyle={styles.colScroll}>
            {activeTab === 'notes' && (
              <>
                {NNOTES.map(n => <NNoteCard key={n.id} note={n} />)}
              </>
            )}

            {activeTab === 'meds' && (
              <>
                {NMEDS.map(m => {
                  const sc = {
                    administered: { c: NT.primary, bg: NT.primarySoft, label: 'DONE' },
                    pending: { c: NT.warn, bg: NT.warnSoft, label: 'PENDING' },
                    missed: { c: NT.bad, bg: NT.badSoft, label: 'MISSED' }
                  }[m.status] || { c: NT.textFaint, bg: NT.surfaceAlt, label: m.status.toUpperCase() };
                  
                  return (
                    <View key={m.id} style={styles.medCard}>
                      <View style={styles.medHeader}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.medName}>{m.name} <Text style={styles.medDose}>{m.dose} · {m.route}</Text></Text>
                          <Text style={styles.medTime}>{m.time} · {m.period}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
                          <Text style={[styles.statusBadgeText, { color: sc.c }]}>{sc.label}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NT.bg,
  },
  headerWrapper: {
    backgroundColor: NT.surface,
    borderBottomWidth: 1,
    borderBottomColor: NT.border,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  pill: {
    backgroundColor: NT.surfaceAlt,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  pillText: {
    fontSize: 10,
    fontWeight: '700',
    color: NT.textDim,
  },
  splitContent: {
    flex: 1,
    flexDirection: 'row',
  },
  leftCol: {
    width: '42%',
    borderRightWidth: 1,
    borderRightColor: NT.border,
    backgroundColor: NT.bg,
  },
  rightCol: {
    flex: 1,
    backgroundColor: NT.surface,
  },
  colScroll: {
    padding: 12,
    gap: 12,
  },
  updatedText: {
    fontSize: 9,
    color: NT.textFaint,
  },
  vitalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  vitalItem: {
    width: '48.5%',
  },
  trendCard: {
    backgroundColor: NT.surface,
    borderWidth: 1,
    borderColor: NT.border,
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  trendTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: NT.text,
  },
  historyCard: {
    backgroundColor: NT.surface,
    borderWidth: 1,
    borderColor: NT.border,
    borderRadius: 10,
    padding: 10,
    gap: 5,
  },
  historyItem: {
    flexDirection: 'row',
    gap: 6,
  },
  historyDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: NT.textFaint,
    marginTop: 6,
  },
  historyText: {
    fontSize: 11.5,
    color: NT.text,
  },
  medCard: {
    backgroundColor: NT.surface,
    borderWidth: 1,
    borderColor: NT.border,
    borderRadius: 10,
    padding: 10,
    marginBottom: 6,
  },
  medHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  medName: {
    fontSize: 12.5,
    fontWeight: '700',
    color: NT.text,
  },
  medDose: {
    fontWeight: '400',
    color: NT.textDim,
  },
  medTime: {
    fontSize: 10,
    color: NT.textFaint,
    marginTop: 1,
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 5,
    height: 18,
    justifyContent: 'center',
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
});
