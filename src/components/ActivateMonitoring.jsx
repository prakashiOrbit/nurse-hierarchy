
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { NT, NBED_COLORS } from '../constants/theme';
import { NTopBar, NBtn, NParamIcon, NSection, NSheet, NSevBadge } from './Shared';
import { NIcoAlert, NIcoMonitor, NIcoX, NIcoEdit, NIcoActivity } from './Icons';

export function ActivateMonitoring({ patient, bed, onClose, onStarted, onStopped, onConfigAlarm, visible }) {
  const mon = bed?.status === 'monitoring';
  const [active, setActive] = useState(mon);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);

  const params = [
    { key: 'HR', label: 'Heart Rate', unit: 'bpm', hi: 120, lo: 50 },
    { key: 'SpO2', label: 'SpO₂', unit: '%', hi: 100, lo: 90 },
    { key: 'RR', label: 'Resp Rate', unit: '/min', hi: 25, lo: 10 },
    { key: 'NIBP', label: 'NIBP Systolic', unit: 'mmHg', hi: 160, lo: 90 },
    { key: 'TEMP', label: 'Temperature', unit: '°C', hi: 38.5, lo: 36 },
  ];
  
  const totalPages = Math.ceil(params.length / 3);
  const visibleParams = params.slice(page * 3, page * 3 + 3);

  const toggle = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const newState = !active;
      setActive(newState);
      newState ? onStarted?.() : onStopped?.();
    }, 800);
  };

  return (
    <NSheet visible={visible} onClose={onClose} full>
      <NTopBar 
        title="Device Monitoring" 
        subtitle={`${bed?.code || ''} · ${patient?.name || '—'}`} 
        onBack={onClose} 
      />
      
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Device Status Card */}
        <View style={styles.card}>
          <View style={styles.deviceRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.deviceTitle}>ECG Monitor — Device A7</Text>
              <Text style={styles.deviceSerial}>Serial: ECG-A7-2024-04891</Text>
            </View>
            <View style={styles.toggleRow}>
              <Text style={[styles.statusText, { color: active ? NT.primary : NT.textFaint }]}>
                {active ? 'ACTIVE' : 'INACTIVE'}
              </Text>
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => !loading && toggle()}
                style={[styles.switch, { backgroundColor: active ? NT.primary : NT.border }]}
              >
                <View style={[styles.switchKnob, { left: active ? 25 : 3 }]} />
              </TouchableOpacity>
            </View>
          </View>
          
          {active && (
            <View style={styles.activeFooter}>
              <View style={styles.pulseContainer}>
                <View style={styles.pulseDot} />
              </View>
              <Text style={styles.activeText}>Live monitoring active</Text>
            </View>
          )}
        </View>

        {!active && (
          <View style={styles.warningBox}>
            <NIcoAlert s={16} c={NT.warn} />
            <View style={{ flex: 1 }}>
              <Text style={styles.warningTitle}>Review thresholds before starting</Text>
              <Text style={styles.warningSub}>Alarm configuration will be applied on start.</Text>
            </View>
          </View>
        )}

        {/* Thresholds Section */}
        <View style={styles.sectionHeader}>
          <NSection label="Alarm Thresholds" />
          <TouchableOpacity onPress={onConfigAlarm} style={styles.editBtn}>
            <NIcoEdit s={13} c={NT.primary} />
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.paramList}>
          {visibleParams.map(p => (
            <View key={p.key} style={styles.paramItem}>
              <View style={styles.paramIconBox}>
                <NParamIcon param={p.key} size={18} color={NT.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.paramName}>{p.label}</Text>
                <Text style={styles.paramValues}>Lo: {p.lo} · Hi: {p.hi} {p.unit}</Text>
              </View>
              <NSevBadge severity="stable" size="sm" />
            </View>
          ))}
        </View>

        {totalPages > 1 && (
          <View style={styles.pagination}>
            {Array.from({ length: totalPages }).map((_, i) => (
              <TouchableOpacity 
                key={i} 
                onPress={() => setPage(i)}
                style={[styles.pageDot, { width: page === i ? 20 : 8, backgroundColor: page === i ? NT.primary : NT.border }]}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <NBtn 
          fullWidth 
          danger={active} 
          loading={loading} 
          onPress={toggle} 
          icon={active ? <NIcoX s={16} c="#fff" /> : <NIcoMonitor s={16} c="#fff" />}
        >
          {active ? 'Stop Monitoring' : 'Start Monitoring'}
        </NBtn>
      </View>
    </NSheet>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: NT.bg,
  },
  scrollContent: {
    padding: 15,
    gap: 16,
  },
  card: {
    backgroundColor: NT.surface,
    borderWidth: 1,
    borderColor: NT.border,
    borderRadius: 14,
    padding: 15,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  deviceTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: NT.text,
  },
  deviceSerial: {
    fontSize: 11,
    color: NT.textFaint,
    marginTop: 3,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  switch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
  },
  switchKnob: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  activeFooter: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: NT.borderSoft,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseContainer: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: NT.primary,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: NT.primary,
  },
  activeText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: NT.primary,
  },
  warningBox: {
    backgroundColor: NT.warnSoft,
    borderWidth: 1,
    borderColor: NT.warn + '44',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    gap: 10,
  },
  warningTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: NT.text,
  },
  warningSub: {
    fontSize: 11.5,
    color: NT.textDim,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: -4,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editBtnText: {
    color: NT.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  paramList: {
    gap: 8,
  },
  paramItem: {
    backgroundColor: NT.surface,
    borderWidth: 1,
    borderColor: NT.border,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paramIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: NT.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paramName: {
    fontSize: 12.5,
    fontWeight: '700',
    color: NT.text,
  },
  paramValues: {
    fontSize: 10.5,
    color: NT.textFaint,
    fontFamily: 'JetBrains Mono',
    marginTop: 2,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  pageDot: {
    height: 8,
    borderRadius: 4,
  },
  footer: {
    padding: 15,
    backgroundColor: NT.surface,
    borderTopWidth: 1,
    borderTopColor: NT.border,
  },
});
