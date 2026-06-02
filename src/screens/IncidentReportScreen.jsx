
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { NT, NSEV } from '../constants/theme';
import { NTopBar, NBtn, NField, NInput, NSheet } from '../components/Shared';
import { NIcoCheckCirc, NIcoFlag, NIcoAlert, NIcoShield } from '../components/Icons';

export function IncidentReportScreen({ onClose, onSubmit }) {
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState('');
  const [desc, setDesc] = useState('');
  const [action, setAction] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refNum, setRefNum] = useState('');

  const cats = ['Fall', 'Medication Error', 'Equipment Failure', 'Clinical Deterioration', 'Other'];
  const sevs = ['Low', 'Medium', 'High', 'Critical'];
  const sevColors = { Low: '#007AFF', Medium: NT.warn, High: NSEV.high.color, Critical: NSEV.critical.color };

  const submit = () => {
    if (!category || !severity || !desc) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRefNum('INC-' + Date.now().toString().slice(-6));
      setSubmitted(true);
      onSubmit?.();
    }, 900);
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.container}>
        <NTopBar title="Incident Report" onBack={onClose} />
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <NIcoCheckCirc s={36} c={NT.primary} />
          </View>
          <Text style={styles.successTitle}>Report Submitted</Text>
          <Text style={styles.successSub}>
            Your incident report has been filed and routed to the nursing admin for review.
          </Text>
          <View style={styles.refCard}>
            <Text style={styles.refLabel}>Reference Number</Text>
            <Text style={styles.refValue}>{refNum}</Text>
          </View>
          <NBtn fullWidth variant="ghost" onPress={onClose}>Close</NBtn>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <NTopBar title="Report Incident" subtitle="Confidential clinical report" onBack={onClose} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <NField label="Incident Category" required>
            <View style={styles.categoryGrid}>
              {cats.map(c => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setCategory(c)}
                  style={[
                    styles.categoryBtn,
                    category === c && styles.categoryBtnActive
                  ]}
                >
                  <Text style={[
                    styles.categoryText,
                    category === c && styles.categoryTextActive
                  ]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </NField>

          <NField label="Severity" required>
            <View style={styles.severityRow}>
              {sevs.map(sv => {
                const c = sevColors[sv];
                const isActive = severity === sv;
                return (
                  <TouchableOpacity
                    key={sv}
                    onPress={() => setSeverity(sv)}
                    style={[
                      styles.severityBtn,
                      isActive && { borderColor: c, backgroundColor: c + '18' }
                    ]}
                  >
                    <Text style={[
                      styles.severityText,
                      isActive && { color: c }
                    ]}>{sv}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </NField>

          <NField label="Incident Description" required>
            <NInput 
              value={desc} 
              onChange={setDesc} 
              placeholder="Describe what happened, when, and who was involved…" 
              multiline 
              numberOfLines={5} 
            />
            <Text style={styles.charCount}>{desc.length}/1000</Text>
          </NField>

          <NField label="Immediate Action Taken">
            <NInput 
              value={action} 
              onChange={setAction} 
              placeholder="Describe what was done immediately following the incident…" 
              multiline 
              numberOfLines={3} 
            />
          </NField>

          <View style={styles.confidentialBox}>
            <NIcoShield s={16} c={NT.textFaint} />
            <Text style={styles.confidentialText}>
              This report is confidential and protected under clinical incident reporting protocols.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <NBtn 
            fullWidth 
            loading={loading} 
            disabled={!category || !severity || !desc} 
            onPress={submit} 
            icon={<NIcoFlag s={16} c="#fff" />}
          >
            Submit Report
          </NBtn>
        </View>
      </KeyboardAvoidingView>
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
    padding: 16,
    gap: 20,
    paddingBottom: 40,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: NT.border,
    backgroundColor: NT.surface,
    minWidth: '48%',
    alignItems: 'center',
  },
  categoryBtnActive: {
    borderColor: NT.primary,
    backgroundColor: NT.primarySoft,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: NT.textDim,
  },
  categoryTextActive: {
    color: NT.primary,
  },
  severityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  severityBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: NT.border,
    alignItems: 'center',
  },
  severityText: {
    fontSize: 11,
    fontWeight: '700',
    color: NT.textDim,
  },
  charCount: {
    fontSize: 10,
    color: NT.textFaint,
    textAlign: 'right',
    marginTop: 4,
  },
  confidentialBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    backgroundColor: NT.surfaceAlt,
    borderRadius: 10,
    marginTop: 10,
  },
  confidentialText: {
    fontSize: 12,
    color: NT.textDim,
    flex: 1,
    lineHeight: 16,
  },
  footer: {
    padding: 16,
    backgroundColor: NT.surface,
    borderTopWidth: 1,
    borderTopColor: NT.border,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 18,
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: NT.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: NT.text,
  },
  successSub: {
    fontSize: 13,
    color: NT.textDim,
    textAlign: 'center',
    lineHeight: 20,
  },
  refCard: {
    backgroundColor: NT.surface,
    borderWidth: 1,
    borderColor: NT.border,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    gap: 4,
  },
  refLabel: {
    fontSize: 10.5,
    color: NT.textFaint,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  refValue: {
    fontSize: 20,
    fontWeight: '700',
    color: NT.primary,
    fontFamily: 'JetBrains Mono',
  },
});
