
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { NT } from '../constants/theme';
import { NMEDS } from '../constants/mockData';
import { NTopBar, NBtn, NSection, NDialog, NSheet } from '../components/Shared';
import { NIcoSyringe, NIcoCheckCirc, NIcoPill } from '../components/Icons';

export function MedicationRecordScreen({ patient, onClose }) {
  const [administering, setAdministering] = useState(null);
  const [meds, setMeds] = useState(NMEDS);
  const [loading, setLoading] = useState(false);

  const periods = ['morning', 'afternoon', 'evening', 'night'];
  const periodLabel = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening', night: 'Night' };
  const administered = meds.filter(m => m.status === 'administered').length;

  const doAdminister = () => {
    setLoading(true);
    setTimeout(() => {
      setMeds(ms => ms.map(m => m.id === administering ? { ...m, status: 'administered', by: 'Sarah M.', at: 'Now' } : m));
      setLoading(false);
      setAdministering(null);
    }, 700);
  };

  const selectedMed = meds.find(m => m.id === administering);

  return (
    <SafeAreaView style={styles.container}>
      <NTopBar title="Medication Record" subtitle={patient?.name || 'Patient MAR'} onBack={onClose} />
      
      {/* Adherence bar */}
      <View style={styles.adherenceBar}>
        <View style={styles.adherenceHeader}>
          <Text style={styles.adherenceTitle}>Today's Adherence</Text>
          <Text style={styles.adherenceValue}>{administered}/{meds.length}</Text>
        </View>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${(administered / meds.length) * 100}%` }]} />
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {periods.map(period => {
            const pmeds = meds.filter(m => m.period === period);
            if (!pmeds.length) return null;
            return (
              <View key={period} style={styles.periodSection}>
                <NSection label={periodLabel[period]} count={pmeds.length} />
                <View style={styles.medList}>
                  {pmeds.map(m => {
                    const sc = {
                      administered: { c: NT.primary, bg: NT.primarySoft, label: 'DONE' },
                      pending: { c: NT.warn, bg: NT.warnSoft, label: 'PENDING' },
                      missed: { c: NT.bad, bg: NT.badSoft, label: 'MISSED' }
                    }[m.status] || { c: NT.textFaint, bg: NT.surfaceAlt, label: m.status.toUpperCase() };

                    return (
                      <View key={m.id} style={[styles.medCard, m.status === 'missed' && { borderColor: NT.bad + '44' }]}>
                        <View style={styles.medCardHeader}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.medName}>{m.name}</Text>
                            <Text style={styles.medInfo}>{m.dose} · {m.route} · <Text style={{ fontFamily: 'JetBrains Mono' }}>{m.time}</Text></Text>
                          </View>
                          <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
                            <Text style={[styles.statusBadgeText, { color: sc.c }]}>{sc.label}</Text>
                          </View>
                        </View>
                        {m.status === 'administered' && (
                          <Text style={styles.adminText}>Administered by {m.by} at {m.at}</Text>
                        )}
                        {m.status === 'pending' && (
                          <NBtn 
                            size="sm" 
                            variant="outline" 
                            onPress={() => setAdministering(m.id)} 
                            icon={<NIcoSyringe s={14} c={NT.primary} />} 
                            style={{ marginTop: 8 }}
                          >
                            Administer
                          </NBtn>
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <NDialog 
        visible={!!administering}
        title="Confirm Administration"
        body={`Confirming administration of ${selectedMed?.name} (${selectedMed?.dose} ${selectedMed?.route}) to ${patient?.name || 'this patient'}.`}
        confirm="Confirm & Sign"
        onConfirm={doAdminister}
        onCancel={() => setAdministering(null)}
        loading={loading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NT.bg,
  },
  adherenceBar: {
    padding: 14,
    backgroundColor: NT.surface,
    borderBottomWidth: 1,
    borderBottomColor: NT.border,
  },
  adherenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  adherenceTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: NT.textDim,
  },
  adherenceValue: {
    fontSize: 12,
    fontWeight: '700',
    color: NT.primary,
    fontFamily: 'JetBrains Mono',
  },
  progressBg: {
    height: 7,
    borderRadius: 4,
    backgroundColor: NT.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: NT.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  periodSection: {
    width: '48%', // Split into 2 columns for landscape
    minWidth: 300,
    flexGrow: 1,
  },
  medList: {
    gap: 8,
  },
  medCard: {
    backgroundColor: NT.surface,
    borderWidth: 1,
    borderColor: NT.border,
    borderRadius: 12,
    padding: 12,
  },
  medCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  medName: {
    fontSize: 13,
    fontWeight: '700',
    color: NT.text,
  },
  medInfo: {
    fontSize: 11,
    color: NT.textDim,
    marginTop: 2,
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
  adminText: {
    fontSize: 10.5,
    color: NT.textFaint,
    marginTop: 4,
  },
});
