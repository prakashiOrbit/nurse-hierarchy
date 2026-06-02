
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { NT, NSEV } from '../constants/theme';
import { NTopBar, NBtn, NParamIcon, NField, NSheet, NDialog, NIcoAlert, NIcoInfo } from './Shared';

export function UpdateAlarmConfig({ patient, bed, onClose, onSave, visible }) {
  const params = ['HR', 'SpO2', 'RR', 'NIBP_S', 'NIBP_D', 'TEMP'];
  const defaults = { 
    HR: { hi: 120, lo: 50 }, 
    SpO2: { hi: 100, lo: 90 }, 
    RR: { hi: 25, lo: 10 }, 
    NIBP_S: { hi: 160, lo: 90 }, 
    NIBP_D: { hi: 100, lo: 60 }, 
    TEMP: { hi: 38.5, lo: 36 } 
  };
  
  const [tab, setTab] = useState('HR');
  const [vals, setVals] = useState(defaults);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const cur = vals[tab] || { hi: 100, lo: 0 };
  
  const setHi = (v) => setVals(p => ({ ...p, [tab]: { ...p[tab], hi: v } }));
  const setLo = (v) => setVals(p => ({ ...p, [tab]: { ...p[tab], lo: v } }));

  const save = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSave?.(vals);
      setConfirm(false);
      onClose();
    }, 700);
  };

  const isInvalid = cur.lo >= cur.hi;

  return (
    <NSheet visible={visible} onClose={onClose} full>
      <NTopBar 
        title="Alarm Config" 
        subtitle={`${bed?.code || ''} · ${patient?.name || '—'}`} 
        onBack={onClose} 
      />
      
      {/* Param Tabs */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {params.map(p => (
            <TouchableOpacity 
              key={p} 
              onPress={() => setTab(p)}
              style={[styles.tabBtn, tab === p && styles.tabBtnActive]}
            >
              <Text style={[styles.tabText, tab === p && styles.tabTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Selected Param Info */}
        <View style={styles.paramCard}>
          <View style={styles.paramIconBox}>
            <NParamIcon param={tab.split('_')[0]} size={20} color={NT.primary} />
          </View>
          <View>
            <Text style={styles.paramLabel}>Parameter</Text>
            <Text style={styles.paramName}>{tab}</Text>
          </View>
        </View>

        {/* High Threshold */}
        <NField label="High Threshold (Alert above)">
          <View style={styles.adjusterBox}>
            <TouchableOpacity 
              onPress={() => setHi(Math.max(cur.lo + 1, cur.hi - 1))}
              style={styles.adjustBtn}
            >
              <Text style={styles.adjustBtnText}>−</Text>
            </TouchableOpacity>
            <View style={styles.valueDisplay}>
              <Text style={[styles.valueText, { color: NSEV.high.color }]}>{cur.hi}</Text>
              <Text style={styles.valueLabel}>HIGH LIMIT</Text>
            </View>
            <TouchableOpacity 
              onPress={() => setHi(cur.hi + 1)}
              style={styles.adjustBtn}
            >
              <Text style={styles.adjustBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </NField>

        {/* Low Threshold */}
        <NField label="Low Threshold (Alert below)">
          <View style={styles.adjusterBox}>
            <TouchableOpacity 
              onPress={() => setLo(Math.max(0, cur.lo - 1))}
              style={styles.adjustBtn}
            >
              <Text style={styles.adjustBtnText}>−</Text>
            </TouchableOpacity>
            <View style={styles.valueDisplay}>
              <Text style={[styles.valueText, { color: '#007AFF' }]}>{cur.lo}</Text>
              <Text style={styles.valueLabel}>LOW LIMIT</Text>
            </View>
            <TouchableOpacity 
              onPress={() => setLo(Math.min(cur.hi - 1, cur.lo + 1))}
              style={styles.adjustBtn}
            >
              <Text style={styles.adjustBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </NField>

        {isInvalid && (
          <View style={styles.errorBox}>
            <NIcoAlert s={15} c={NT.bad} />
            <Text style={styles.errorText}>Low limit must be less than high limit.</Text>
          </View>
        )}

        <TouchableOpacity onPress={() => setVals(defaults)} style={styles.resetBtn}>
          <Text style={styles.resetBtnText}>Reset all to defaults</Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <NIcoInfo s={14} c={NT.textFaint} />
          <Text style={styles.infoText}>
            Changing these thresholds will update alarms for this patient only. 
            Standard protocols apply to all other beds.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <NBtn fullWidth loading={loading} disabled={isInvalid} onPress={() => setConfirm(true)}>Save Configuration</NBtn>
      </View>

      <NDialog 
        visible={confirm}
        title="Save Alarm Config"
        body={`Update ${tab}: Low ${cur.lo} / High ${cur.hi}?`}
        confirm="Save"
        onConfirm={save}
        onCancel={() => setConfirm(false)}
      />
    </NSheet>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    backgroundColor: NT.surface,
    borderBottomWidth: 1,
    borderBottomColor: NT.border,
  },
  tabScroll: {
    paddingHorizontal: 8,
  },
  tabBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: NT.primary,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '700',
    color: NT.textFaint,
  },
  tabTextActive: {
    color: NT.primary,
  },
  scroll: {
    flex: 1,
    backgroundColor: NT.bg,
  },
  scrollContent: {
    padding: 18,
    gap: 20,
  },
  paramCard: {
    backgroundColor: NT.surface,
    borderWidth: 1,
    borderColor: NT.border,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  paramIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: NT.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paramLabel: {
    fontSize: 11,
    color: NT.textFaint,
  },
  paramName: {
    fontSize: 16,
    fontWeight: '700',
    color: NT.text,
    fontFamily: 'JetBrains Mono',
  },
  adjusterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NT.surface,
    borderWidth: 1,
    borderColor: NT.border,
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  adjustBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: NT.border,
    backgroundColor: NT.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adjustBtnText: {
    fontSize: 24,
    color: NT.textDim,
  },
  valueDisplay: {
    flex: 1,
    alignItems: 'center',
  },
  valueText: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'JetBrains Mono',
  },
  valueLabel: {
    fontSize: 10,
    color: NT.textFaint,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  errorBox: {
    backgroundColor: NT.badSoft,
    borderWidth: 1,
    borderColor: NT.bad + '44',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  errorText: {
    fontSize: 12.5,
    color: NT.bad,
    flex: 1,
  },
  resetBtn: {
    alignSelf: 'flex-start',
  },
  resetBtnText: {
    fontSize: 12.5,
    color: NT.textDim,
    textDecorationLine: 'underline',
  },
  infoBox: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: NT.surfaceAlt,
    borderRadius: 10,
    gap: 10,
  },
  infoText: {
    fontSize: 12,
    color: NT.textDim,
    lineHeight: 16,
    flex: 1,
  },
  footer: {
    padding: 16,
    backgroundColor: NT.surface,
    borderTopWidth: 1,
    borderTopColor: NT.border,
  },
});
