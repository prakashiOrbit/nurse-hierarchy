
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { NT, NBED_COLORS } from '../constants/theme';
import { NTopBar, NTabBar, NBtn, NField, NInput, NSheet, NCheck } from './Shared';
import { NIcoTransfer, NIcoBack, NIcoCheckCirc, NIcoAlert, NIcoChevD } from './Icons';

export function WardTransferModal({ patient, bed, onClose, onDone, visible }) {
  const [tab, setTab] = useState('transfer');
  const [ward, setWard] = useState('');
  const [destBed, setDestBed] = useState('');
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const [showWardPicker, setShowWardPicker] = useState(false);
  const [showBedPicker, setShowBedPicker] = useState(false);

  const wards = ['General Ward 1', 'General Ward 2', 'ICU', 'CCU', 'HDU', 'Surgical Ward'];
  const beds = ['A01', 'A02', 'A03', 'B01', 'B02'];

  const doAction = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      setTimeout(() => {
        onDone?.({
          type: tab,
          patientId: patient?.id,
          bedCode: bed?.code,
          destWard: ward,
          destBed: destBed
        });
        onClose();
        // Reset state for next use
        setDone(false);
        setWard('');
        setDestBed('');
        setReason('');
        setConfirmed(false);
      }, 1400);
    }, 900);
  };

  if (done) {
    return (
      <NSheet visible={visible} onClose={onClose} full>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <NIcoCheckCirc s={38} c={NT.primary} />
          </View>
          <Text style={styles.successTitle}>
            {tab === 'transfer' ? 'Transfer Confirmed' : 'Patient Discharged'}
          </Text>
          <Text style={styles.successSub}>
            {tab === 'transfer'
              ? `${patient?.name} transferred to ${ward}, Bed ${destBed}.`
              : `${patient?.name} has been discharged successfully.`}
          </Text>
        </View>
      </NSheet>
    );
  }

  const Picker = ({ visible, options, onSelect, onClose, title }) => (
    <NSheet visible={visible} onClose={onClose}>
      <View style={styles.pickerHeader}>
        <Text style={styles.pickerTitle}>{title}</Text>
        <TouchableOpacity onPress={onClose} style={styles.pickerClose}>
           <NIcoBack s={18} c={NT.textDim} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.pickerContent}>
        {options.map(opt => (
          <TouchableOpacity 
            key={opt} 
            onPress={() => { onSelect(opt); onClose(); }}
            style={styles.pickerItem}
          >
            <Text style={styles.pickerItemText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </NSheet>
  );

  return (
    <NSheet visible={visible} onClose={onClose} full>
      <NTopBar 
        title="Patient Disposition" 
        subtitle={`${bed?.code || ''} · ${patient?.name || ''}`} 
        onBack={onClose} 
      />
      <NTabBar
        tabs={[
          { id: 'transfer', label: 'Ward Transfer', icon: <NIcoTransfer s={13} c={tab === 'transfer' ? NT.primary : NT.textDim} /> },
          { id: 'discharge', label: 'Discharge', icon: <NIcoBack s={13} c={tab === 'discharge' ? NT.primary : NT.textDim} /> }
        ]}
        active={tab}
        onChange={setTab}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {tab === 'transfer' ? (
          <>
            <NField label="Destination Ward" required>
              <TouchableOpacity 
                onPress={() => setShowWardPicker(true)}
                style={styles.selector}
              >
                <Text style={[styles.selectorText, !ward && { color: NT.textFaint }]}>
                  {ward || 'Select ward…'}
                </Text>
                <NIcoChevD s={16} c={NT.textFaint} />
              </TouchableOpacity>
            </NField>

            <NField label="Destination Bed" required>
              <TouchableOpacity 
                disabled={!ward}
                onPress={() => setShowBedPicker(true)}
                style={[styles.selector, !ward && { opacity: 0.5 }]}
              >
                <Text style={[styles.selectorText, !destBed && { color: NT.textFaint }]}>
                  {destBed || 'Select bed…'}
                </Text>
                <NIcoChevD s={16} c={NT.textFaint} />
              </TouchableOpacity>
            </NField>

            <View style={styles.optionBox}>
              <NCheck 
                checked={confirmed} 
                onChange={setConfirmed} 
                label="Stop device monitoring on transfer" 
              />
            </View>

            <View style={styles.infoBanner}>
              <NIcoAlert s={16} c={NT.warn} />
              <Text style={styles.infoText}>
                Patient will be disconnected from current ward's IoMT stream on transfer.
              </Text>
            </View>
          </>
        ) : (
          <>
            <NField label="Discharge Reason" required>
              <NInput 
                value={reason} 
                onChange={setReason} 
                placeholder="Enter reason for discharge…" 
                multiline 
                numberOfLines={4} 
              />
            </NField>

            <View style={styles.dangerBanner}>
              <NIcoAlert s={16} c={NT.bad} />
              <Text style={styles.dangerText}>
                This action is irreversible. All active clinical monitoring will be stopped immediately.
              </Text>
            </View>

            <View style={styles.optionBox}>
              <NCheck 
                checked={confirmed} 
                onChange={setConfirmed} 
                label={`I confirm that ${patient?.name || 'this patient'} is ready for clinical discharge.`} 
              />
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {tab === 'transfer' ? (
          <NBtn 
            fullWidth 
            loading={loading} 
            disabled={!ward || !destBed} 
            onPress={doAction} 
            icon={<NIcoTransfer s={16} c="#fff" />}
          >
            Confirm Transfer
          </NBtn>
        ) : (
          <NBtn 
            fullWidth 
            danger 
            loading={loading} 
            disabled={!reason || !confirmed} 
            onPress={doAction} 
            icon={<NIcoBack s={16} c="#fff" />}
          >
            Discharge Patient
          </NBtn>
        )}
      </View>

      <Picker 
        visible={showWardPicker} 
        title="Select Ward" 
        options={wards} 
        onSelect={setWard} 
        onClose={() => setShowWardPicker(false)} 
      />
      <Picker 
        visible={showBedPicker} 
        title="Select Bed" 
        options={beds} 
        onSelect={setDestBed} 
        onClose={() => setShowBedPicker(false)} 
      />
    </NSheet>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: NT.bg,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  selector: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: NT.border,
    backgroundColor: NT.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  selectorText: {
    fontSize: 14,
    color: NT.text,
  },
  optionBox: {
    backgroundColor: NT.surface,
    borderWidth: 1,
    borderColor: NT.border,
    borderRadius: 10,
    padding: 12,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: NT.warnSoft,
    borderWidth: 1,
    borderColor: NT.warn + '44',
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  infoText: {
    fontSize: 12.5,
    color: NT.textDim,
    flex: 1,
    lineHeight: 16,
  },
  dangerBanner: {
    flexDirection: 'row',
    backgroundColor: NT.badSoft,
    borderWidth: 1,
    borderColor: NT.bad + '44',
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  dangerText: {
    fontSize: 12.5,
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
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: NT.borderSoft,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: NT.text,
  },
  pickerClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: NT.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerContent: {
    paddingBottom: 40,
  },
  pickerItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: NT.borderSoft,
  },
  pickerItemText: {
    fontSize: 14,
    color: NT.text,
    fontWeight: '500',
  },
});
