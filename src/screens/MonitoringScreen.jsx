
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, Animated } from 'react-native';
import Svg, { Path, Rect, Circle, G, Polyline } from 'react-native-svg';
import { NT, NSEV } from '../constants/theme';
import { NWARD, NALARMS } from '../constants/mockData';
import { NIcoBack, NIcoActivity, NIcoFile, NIcoBell, NIcoAlert, NIcoX, NIcoMonitor } from '../components/Icons';
import { NBtn, NParamIcon } from '../components/Shared';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// --- Mock Waveforms ---
const ECG_TEMPLATE = [0, 0, 0, 0.1, -0.1, 0, 0, 0.8, -0.2, 0, 0, 0.1, 0.2, 0.1, 0, 0, 0, 0, 0];
const SPO2_TEMPLATE = [0, 0.1, 0.3, 0.6, 0.8, 0.9, 0.8, 0.6, 0.4, 0.2, 0.1, 0, 0, 0];
const RESP_TEMPLATE = [0, 0.1, 0.3, 0.5, 0.7, 0.8, 0.9, 0.8, 0.7, 0.5, 0.3, 0.1, 0];

// --- Live Vitals Hook ---
export function useLiveVitals(base) {
  const parseNIBP = (s) => {
    const parts = String(s || '120/80').split('/');
    return { s: parseInt(parts[0]) || 120, d: parseInt(parts[1]) || 80 };
  };
  const nb = parseNIBP(base.nibp);
  const [v, setV] = useState({
    hr: base.hr || 72, spo2: base.spo2 || 97, rr: base.rr || 16,
    nibpS: nb.s, nibpD: nb.d, temp: base.temp || 37.0, etco2: 35,
  });

  useEffect(() => {
    const jit = (r) => (Math.random() - 0.5) * r;
    const clp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
    const t = setInterval(() => setV(prev => ({
      hr: clp(Math.round(prev.hr + jit(4)), 40, 160),
      spo2: clp(Math.round(prev.spo2 + jit(1.5)), 85, 100),
      rr: clp(Math.round(prev.rr + jit(1.5)), 8, 35),
      nibpS: clp(Math.round(prev.nibpS + jit(5)), 80, 200),
      nibpD: clp(Math.round(prev.nibpD + jit(3)), 50, 120),
      temp: clp(Math.round((prev.temp + jit(0.08)) * 10) / 10, 34, 41),
      etco2: clp(Math.round(prev.etco2 + jit(1.5)), 20, 55),
    })), 1600);
    return () => clearInterval(t);
  }, []);
  return v;
}

// --- Waveform Component ---
function WaveformView({ template, color, height, label, value, unit }) {
  const [offset, setOffset] = useState(0);
  
  useEffect(() => {
    let animId;
    const animate = () => {
      setOffset(prev => (prev + 2) % 300);
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, []);

  const points = useMemo(() => {
    const w = SCREEN_WIDTH * 0.6;
    const tLen = template.length;
    let res = "";
    for (let x = 0; x < w; x += 2) {
       const ti = Math.floor((x / w) * tLen * 3) % tLen;
       const y = height / 2 - template[ti] * (height * 0.4);
       res += `${x},${y} `;
    }
    return res;
  }, [template, height]);

  return (
    <View style={styles.waveContainer}>
      <View style={styles.waveLabelRow}>
        <Text style={[styles.waveLabel, { color }]}>{label}</Text>
        <Text style={styles.waveValue}>{value}</Text>
        <Text style={styles.waveUnit}>{unit}</Text>
      </View>
      <View style={{ height, backgroundColor: '#091210', overflow: 'hidden' }}>
        <Svg width="100%" height={height}>
           <Polyline
             points={points}
             fill="none"
             stroke={color}
             strokeWidth="2"
           />
           <Rect x={offset} y={0} width="20" height={height} fill="#091210" />
        </Svg>
      </View>
    </View>
  );
}

// --- Vital Card ---
function MonVitalCard({ label, value, unit, color, abnormal, hiThresh, loThresh, selected, onSelect, nibpExtra }) {
  return (
    <TouchableOpacity 
      onPress={onSelect}
      activeOpacity={0.7}
      style={[
        styles.monCard,
        { backgroundColor: selected ? color + '22' : abnormal ? 'rgba(255,59,48,0.10)' : '#0E1C19' },
        { borderColor: selected ? color : abnormal ? 'rgba(255,59,48,0.45)' : 'rgba(255,255,255,0.07)' }
      ]}
    >
      {(abnormal || selected) && <View style={[styles.monCardBar, { backgroundColor: abnormal ? NSEV.high.color : color }]} />}
      <Text style={styles.monCardLabel}>{label}</Text>
      {nibpExtra ? (
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 2 }}>
            <Text style={[styles.monCardValue, { color: abnormal ? NSEV.high.color : color, fontSize: 20 }]}>{nibpExtra.s}</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.5)' }}>/{nibpExtra.d}</Text>
            <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginLeft: 2 }}>mmHg</Text>
          </View>
          <Text style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.35)', fontFamily: 'JetBrains Mono' }}>MAP {nibpExtra.m}</Text>
        </View>
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 3 }}>
          <Text style={[styles.monCardValue, { color: abnormal ? NSEV.high.color : color }]}>{value}</Text>
          <Text style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.3)' }}>{unit}</Text>
        </View>
      )}
      {hiThresh != null && loThresh != null && (
        <Text style={styles.monCardThresh}>↓{loThresh} · ↑{hiThresh}</Text>
      )}
    </TouchableOpacity>
  );
}

export function MonitoringScreen({ patient, bed, onClose, onAddNote }) {
  const baseV = patient?.vitals || { hr: 72, spo2: 97, rr: 16, nibp: '120/80', temp: 37.0 };
  const live = useLiveVitals(baseV);
  const [showTrend, setShowTrend] = useState(false);
  const [trendKey, setTrendKey] = useState('HR');

  const nibpM = Math.round(live.nibpD + (live.nibpS - live.nibpD) / 3);
  const THRESH = { HR: { hi: 120, lo: 50 }, SpO2: { hi: 100, lo: 90 }, RR: { hi: 25, lo: 10 }, NIBP: { hi: 160, lo: 90 }, Temp: { hi: 38.5, lo: 36 }, EtCO2: { hi: 45, lo: 25 } };

  const vParams = [
    { key: 'HR', label: 'HR', value: live.hr, unit: 'bpm', color: '#34C759', abn: live.hr > THRESH.HR.hi || live.hr < THRESH.HR.lo },
    { key: 'SpO2', label: 'SpO₂', value: live.spo2, unit: '%', color: '#00D4FF', abn: live.spo2 < THRESH.SpO2.lo },
    { key: 'RR', label: 'RESP', value: live.rr, unit: '/min', color: '#7B8FFF', abn: live.rr > THRESH.RR.hi || live.rr < THRESH.RR.lo },
    {
      key: 'NIBP', label: 'NIBP', value: `${live.nibpS}/${live.nibpD}`, unit: 'mmHg', color: '#FF9500', abn: live.nibpS > THRESH.NIBP.hi || live.nibpS < THRESH.NIBP.lo,
      nibpExtra: { s: live.nibpS, d: live.nibpD, m: nibpM }
    },
    { key: 'Temp', label: 'TEMP', value: live.temp, unit: '°C', color: '#FF6B6B', abn: live.temp > THRESH.Temp.hi },
    { key: 'EtCO2', label: 'EtCO₂', value: live.etco2, unit: 'mmHg', color: '#C77DFF', abn: live.etco2 > THRESH.EtCO2.hi || live.etco2 < THRESH.EtCO2.lo },
  ];

  const bedAlarms = NALARMS.filter(a => a.bedCode === bed?.code);

  return (
    <View style={styles.container}>
      {/* Dark top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onClose} style={styles.backBtn}>
          <NIcoBack s={16} c="rgba(255,255,255,0.8)" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.patientName} numberOfLines={1}>{patient?.name || '—'}</Text>
          <Text style={styles.bedCode}>{bed?.code} · {NWARD.name}</Text>
        </View>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE MONITORING</Text>
        </View>
      </View>

      <View style={styles.main}>
        {/* LEFT: Waveforms */}
        <View style={styles.wavesColumn}>
          <WaveformView template={ECG_TEMPLATE} color="#34C759" height={90} label="ECG · II" value={live.hr} unit="bpm" />
          <WaveformView template={SPO2_TEMPLATE} color="#00D4FF" height={80} label="SpO₂ · PLETH" value={live.spo2} unit="%" />
          <WaveformView template={RESP_TEMPLATE} color="#7B8FFF" height={80} label="RESP · AW" value={live.rr} unit="/min" />

          {/* Alarm Area */}
          <View style={styles.alarmArea}>
             <Text style={styles.alarmAreaTitle}>BED ALARMS</Text>
             {bedAlarms.map(a => {
                const s = NSEV[a.severity];
                return (
                  <View key={a.id} style={[styles.alarmItem, { borderColor: s.color + '33' }]}>
                    <View style={[styles.alarmSeverity, { backgroundColor: s.color }]} />
                    <NParamIcon param={a.param} size={11} color={s.color} />
                    <View style={{ flex: 1 }}>
                       <Text style={[styles.alarmText, { color: s.color }]}>{a.param}: {a.value}{a.unit}</Text>
                       <Text style={styles.alarmTime}>{a.raisedMin}m ago</Text>
                    </View>
                  </View>
                );
             })}
          </View>
        </View>

        {/* RIGHT: Parameters */}
        <ScrollView style={styles.paramsColumn} contentContainerStyle={{ gap: 5, paddingVertical: 8 }}>
          {vParams.map(v => (
            <MonVitalCard
              key={v.key}
              label={v.label}
              value={v.value}
              unit={v.unit}
              color={v.color}
              abnormal={v.abn}
              hiThresh={THRESH[v.key]?.hi}
              loThresh={THRESH[v.key]?.lo}
              selected={trendKey === v.key && showTrend}
              nibpExtra={v.nibpExtra}
              onSelect={() => { setTrendKey(v.key); setShowTrend(true); }}
            />
          ))}
          <Text style={styles.paramsHint}>Tap card for 24h trend</Text>
        </ScrollView>
      </View>

      {/* Bottom toolbar */}
      <View style={styles.toolbar}>
        {[
          { label: 'TREND', icon: <NIcoActivity s={16} />, action: () => setShowTrend(!showTrend), active: showTrend },
          { label: 'NOTE', icon: <NIcoFile s={16} />, action: onAddNote },
          { label: 'CONFIG', icon: <NIcoBell s={16} />, action: () => { } },
          { label: 'ALERTS', icon: <NIcoAlert s={16} />, action: () => { } },
        ].map(item => (
          <TouchableOpacity 
            key={item.label} 
            onPress={item.action} 
            style={[styles.toolBtn, item.active && { backgroundColor: 'rgba(255,255,255,0.08)' }]}
          >
            {React.cloneElement(item.icon, { c: item.active ? NT.primary : 'rgba(255,255,255,0.6)' })}
            <Text style={[styles.toolLabel, { color: item.active ? NT.primary : 'rgba(255,255,255,0.5)' }]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#091210',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    height: 60,
    backgroundColor: '#070F0D',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#fff',
  },
  bedCode: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.38)',
    fontFamily: 'JetBrains Mono',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(52,199,89,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(52,199,89,0.35)',
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#34C759',
  },
  liveText: {
    fontSize: 8.5,
    color: '#34C759',
    fontWeight: '700',
  },
  main: {
    flex: 1,
    flexDirection: 'row',
  },
  wavesColumn: {
    width: '65%',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.04)',
  },
  waveContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.045)',
    paddingBottom: 2,
  },
  waveLabelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 10,
    paddingTop: 5,
    gap: 6,
  },
  waveLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    fontFamily: 'JetBrains Mono',
    width: 76,
  },
  waveValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'JetBrains Mono',
  },
  waveUnit: {
    fontSize: 9.5,
    color: 'rgba(255,255,255,0.35)',
  },
  alarmArea: {
    padding: 10,
    gap: 6,
  },
  alarmAreaTitle: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.25)',
    letterSpacing: 0.8,
  },
  alarmItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    gap: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
  },
  alarmSeverity: {
    width: 3,
    height: '100%',
    borderRadius: 2,
  },
  alarmText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'JetBrains Mono',
  },
  alarmTime: {
    fontSize: 8.5,
    color: 'rgba(255,255,255,0.3)',
  },
  paramsColumn: {
    flex: 1,
    backgroundColor: '#07100E',
    paddingHorizontal: 6,
  },
  monCard: {
    borderRadius: 10,
    padding: 9,
    borderWidth: 1.5,
    position: 'relative',
    overflow: 'hidden',
  },
  monCardBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  monCardLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.38)',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  monCardValue: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily: 'JetBrains Mono',
  },
  monCardThresh: {
    fontSize: 8.5,
    color: 'rgba(255,255,255,0.22)',
    fontFamily: 'JetBrains Mono',
    marginTop: 4,
  },
  paramsHint: {
    fontSize: 8.5,
    color: 'rgba(255,255,255,0.18)',
    textAlign: 'center',
    paddingVertical: 6,
  },
  toolbar: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: '#070F0D',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
  },
  toolBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  toolLabel: {
    fontSize: 8.5,
    fontWeight: '700',
  }
});
