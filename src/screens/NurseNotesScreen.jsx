
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { NT } from '../constants/theme';
import { NNOTES } from '../constants/mockData';
import { NTopBar, NBtn, NNoteCard, NSheet, NField, NInput, NChip } from '../components/Shared';
import { NIcoPlus, NIcoFile, NIcoX, NIcoCheck } from '../components/Icons';

export function NurseNotesScreen({ onBack }) {
  const [tab, setTab] = useState('ALL');
  const [notes, setNotes] = useState(NNOTES);
  const [showAdd, setShowAdd] = useState(false);
  const [noteType, setNoteType] = useState('GENERAL');
  const [noteText, setNoteText] = useState('');
  const [loading, setLoading] = useState(false);

  const types = ['ALL', 'GENERAL', 'MEDICATION', 'HANDOVER', 'INCIDENT'];
  const filtered = tab === 'ALL' ? notes : notes.filter(n => n.type === tab);
  
  const typeColors = { 
    GENERAL: { c: '#007AFF', bg: 'rgba(0,122,255,0.10)' }, 
    MEDICATION: { c: '#34C759', bg: 'rgba(52,199,89,0.10)' }, 
    HANDOVER: { c: '#FF9500', bg: 'rgba(255,149,0,0.10)' }, 
    INCIDENT: { c: '#FF3B30', bg: 'rgba(255,59,48,0.10)' } 
  };

  const save = () => {
    if (!noteText.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const newNote = { 
        id: 'N' + Date.now(), 
        type: noteType, 
        text: noteText.trim(), 
        nurse: 'Sarah Mitchell', 
        time: 'Just now' 
      };
      setNotes(prev => [newNote, ...prev]);
      setLoading(false);
      setShowAdd(false);
      setNoteText('');
      setNoteType('GENERAL');
    }, 600);
  };

  return (
    <SafeAreaView style={styles.container}>
      <NTopBar title="Nurse Notes" subtitle="Clinical documentation" onBack={onBack} />
      
      {/* Type filter strip */}
      <View style={styles.filterStrip}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {types.map(t => (
            <TouchableOpacity 
              key={t} 
              onPress={() => setTab(t)}
              style={[
                styles.filterBtn, 
                tab === t && { 
                  backgroundColor: (typeColors[t] || { bg: NT.primarySoft }).bg,
                  borderColor: (typeColors[t] || { c: NT.primary }).c
                }
              ]}
            >
              <Text style={[
                styles.filterText, 
                tab === t && { color: (typeColors[t] || { c: NT.primary }).c }
              ]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <NIcoFile s={48} c={NT.textFaint} />
            <Text style={styles.emptyTitle}>No notes found</Text>
            <Text style={styles.emptySub}>Adjust your filters or add a new observation.</Text>
          </View>
        ) : (
          filtered.map(n => <NNoteCard key={n.id} note={n} />)
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => setShowAdd(true)}
        activeOpacity={0.8}
      >
        <NIcoPlus s={24} c="#fff" />
      </TouchableOpacity>

      {/* Add Note Sheet */}
      <NSheet visible={showAdd} onClose={() => setShowAdd(false)} full={false}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Add Note</Text>
            <TouchableOpacity onPress={() => setShowAdd(false)} style={styles.closeBtn}>
              <NIcoX s={16} c={NT.textDim} />
            </TouchableOpacity>
          </View>
          
          <ScrollView contentContainerStyle={styles.sheetContent}>
            <NField label="Note Type">
              <View style={styles.typeGrid}>
                {['GENERAL', 'MEDICATION', 'HANDOVER', 'INCIDENT'].map(t => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setNoteType(t)}
                    style={[
                      styles.typeChip,
                      { backgroundColor: noteType === t ? (typeColors[t].bg) : NT.surfaceAlt },
                      { borderColor: noteType === t ? typeColors[t].c : NT.border }
                    ]}
                  >
                    <Text style={[
                      styles.typeChipText,
                      { color: noteType === t ? typeColors[t].c : NT.textFaint }
                    ]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </NField>

            <NField label="Observation" required>
              <NInput 
                value={noteText} 
                onChange={setNoteText} 
                placeholder="Enter clinical note…" 
                multiline 
                numberOfLines={6} 
              />
              <Text style={styles.charCount}>{noteText.length}/500</Text>
            </NField>

            <NBtn 
              fullWidth 
              loading={loading} 
              disabled={!noteText.trim()} 
              onPress={save} 
              icon={<NIcoCheck s={16} c="#fff" />}
            >
              Save Note
            </NBtn>
          </ScrollView>
        </KeyboardAvoidingView>
      </NSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NT.bg,
  },
  filterStrip: {
    backgroundColor: NT.surface,
    borderBottomWidth: 1,
    borderBottomColor: NT.border,
  },
  filterScroll: {
    padding: 10,
    gap: 8,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: NT.border,
  },
  filterText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: NT.textDim,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: NT.textDim,
  },
  emptySub: {
    fontSize: 13,
    color: NT.textFaint,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: NT.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: NT.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: NT.borderSoft,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: NT.text,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: NT.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetContent: {
    padding: 16,
    gap: 20,
    paddingBottom: 40,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  typeChipText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  charCount: {
    fontSize: 10,
    color: NT.textFaint,
    textAlign: 'right',
    marginTop: 4,
  },
});
