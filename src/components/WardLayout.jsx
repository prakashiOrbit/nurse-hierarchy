
import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, Animated, PanResponder, View, StyleSheet, Dimensions } from 'react-native';
import Svg, { G, Rect, Circle, Text as SvgText, Path, Line } from 'react-native-svg';
import { NT, NSEV, NBED_COLORS } from '../constants/theme';
import { NPATIENTS, NWARD_ROOMS } from '../constants/mockData';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);

export function SVGBedShape({ x, y, w, h, bed, patient, alarms, onTap, facing = 'down' }) {
  const bc = NBED_COLORS[bed.status] || NBED_COLORS.empty;
  const bAlm = alarms.filter((a) => a.bedCode === bed.code);
  const worst = bAlm.length ? bAlm.sort((a, b) => (NSEV[b.severity]?.rank || 0) - (NSEV[a.severity]?.rank || 0))[0] : null;
  const mon = bed.status === 'monitoring';

  const FILL = {
    monitoring: 'rgba(52,199,89,0.20)',
    occupied: 'rgba(255,182,193,0.30)',
    empty: 'rgba(200,200,200,0.14)',
    admit: 'rgba(168,230,207,0.24)',
    discharge: 'rgba(255,215,0,0.20)',
    transfer: 'rgba(135,206,235,0.24)',
  };
  const fillCol = FILL[bed.status] || FILL.empty;
  const strokeCol = worst ? NSEV[worst.severity].color : bc.border;
  const pilH = h * 0.16;

  const first = patient ? patient.name.split(' ')[0] : '';
  const fname = first.length > 9 ? first.slice(0, 8) + '.' : first;

  const pulseAnim = useRef(new Animated.Value(4)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (mon) {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(pulseAnim, { toValue: 6.5, duration: 800, useNativeDriver: false }),
            Animated.timing(pulseAnim, { toValue: 4, duration: 800, useNativeDriver: false }),
          ]),
          Animated.sequence([
            Animated.timing(opacityAnim, { toValue: 0.3, duration: 800, useNativeDriver: false }),
            Animated.timing(opacityAnim, { toValue: 1, duration: 800, useNativeDriver: false }),
          ]),
        ])
      ).start();
    }
  }, [mon]);

  const isUp = facing === 'up';
  const textStartY = isUp ? y + 16 : y + 7 + pilH + 4;

  return (
    <G onPress={() => onTap(bed)}>
      <Rect
        x={x} y={y} width={w} height={h} rx={3}
        fill={fillCol} stroke={strokeCol} strokeWidth={worst ? 2 : 1.4}
      />
      {/* Headboard */}
      <Rect x={x} y={isUp ? y + h - 7 : y} width={w} height={7} rx={3} fill={bc.dot + '55'} />
      {/* Pillow */}
      <Rect
        x={x + 5} y={isUp ? y + h - 9 - pilH : y + 9} width={w - 10} height={pilH} rx={2.5}
        fill="rgba(255,255,255,0.52)" stroke="rgba(0,0,0,0.07)" strokeWidth={0.7}
      />
      {/* Side rails */}
      <Rect x={x + 1.5} y={y + 7 + pilH + 3} width={2.5} height={h - pilH - 16} rx={1} fill="rgba(0,0,0,0.10)" />
      <Rect x={x + w - 4} y={y + 7 + pilH + 3} width={2.5} height={h - pilH - 16} rx={1} fill="rgba(0,0,0,0.10)" />
      {/* Footboard */}
      <Rect x={x} y={isUp ? y : y + h - 5} width={w} height={5} rx={3} fill={bc.dot + '33'} />
      
      <SvgText x={x + w / 2} y={textStartY + 11} textAnchor="middle" fontSize="9" fontWeight="700" fill="rgba(0,0,0,0.52)">{bed.code}</SvgText>
      {patient && (
        <SvgText x={x + w / 2} y={textStartY + 24} textAnchor="middle" fontSize="7.5" fontWeight="600" fill="rgba(0,0,0,0.68)">{fname}</SvgText>
      )}
      {patient && mon && (
        <>
          <SvgText x={x + w / 2} y={textStartY + 37} textAnchor="middle" fontSize="7" fill="rgba(0,0,0,0.48)">HR {patient.vitals.hr}</SvgText>
          <SvgText x={x + w / 2} y={textStartY + 47} textAnchor="middle" fontSize="7" fill="rgba(0,0,0,0.48)">SpO2 {patient.vitals.spo2}%</SvgText>
        </>
      )}
      {!patient && (
        <SvgText x={x + w / 2} y={y + h / 2 + 3} textAnchor="middle" fontSize="8" fill={bc.dot + 'CC'}>
          {bed.status === 'empty' ? 'Empty' : bed.status === 'admit' ? 'Pending' : bc.label}
        </SvgText>
      )}
      {mon && (
        <AnimatedCircle cx={x + w - 7} cy={isUp ? y + h - 7 : y + 7} r={pulseAnim} fill="#34C759" opacity={opacityAnim} />
      )}
      {worst && (
        <G>
          <Circle cx={x + 8} cy={isUp ? y + h - 8 : y + 8} r={7.5} fill={NSEV[worst.severity].color} />
          <SvgText x={x + 8} y={isUp ? y + h - 4.5 : y + 11.5} textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff">{bAlm.length}</SvgText>
        </G>
      )}
    </G>
  );
}

export function SVGWardLayout({ beds, alarms, onBedTap }) {
  const roomWidth = 100;
  const roomHeight = 130;
  
  const zoom = useRef(new Animated.Value(1)).current;
  const offset = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  
  const zoomVal = useRef(1);
  const offsetVal = useRef({ x: 0, y: 0 });
  const initialDistanceRef = useRef(null);
  const initialZoomRef = useRef(1);

  useEffect(() => {
    const zId = zoom.addListener(({ value }) => { zoomVal.current = value; });
    const oId = offset.addListener(({ x, y }) => { offsetVal.current = { x, y }; });
    return () => {
      zoom.removeListener(zId);
      offset.removeListener(oId);
    };
  }, []);

  const calcDistance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return evt.nativeEvent.touches.length === 2 || Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2;
      },
      onPanResponderGrant: (evt) => {
        const touches = evt.nativeEvent.touches;
        if (touches.length === 2) {
          initialDistanceRef.current = calcDistance(
            touches[0].pageX, touches[0].pageY,
            touches[1].pageX, touches[1].pageY
          );
          initialZoomRef.current = zoomVal.current;
        }
        offset.setOffset({ x: offsetVal.current.x, y: offsetVal.current.y });
        offset.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (evt, gestureState) => {
        const touches = evt.nativeEvent.touches;
        if (touches.length === 2) {
          const currentDist = calcDistance(touches[0].pageX, touches[0].pageY, touches[1].pageX, touches[1].pageY);
          if (!initialDistanceRef.current) {
            initialDistanceRef.current = currentDist;
            initialZoomRef.current = zoomVal.current;
          } else {
            const ratio = currentDist / initialDistanceRef.current;
            let nextZoom = initialZoomRef.current * ratio;
            nextZoom = Math.max(0.5, Math.min(4, nextZoom));
            zoom.setValue(nextZoom);
          }
        } else if (touches.length === 1 && !initialDistanceRef.current) {
          offset.setValue({ x: gestureState.dx / zoomVal.current, y: gestureState.dy / zoomVal.current });
        }
      },
      onPanResponderRelease: () => {
        offset.flattenOffset();
        initialDistanceRef.current = null;
      },
    })
  ).current;

  const handleZoom = (type) => {
    let nextZoom = type === 'in' ? zoomVal.current + 0.3 : zoomVal.current - 0.3;
    nextZoom = Math.max(0.5, Math.min(4, nextZoom));
    Animated.spring(zoom, { toValue: nextZoom, useNativeDriver: false, friction: 7, tension: 40 }).start();
  };

  const resetMap = () => {
    Animated.parallel([
      Animated.spring(zoom, { toValue: 1, useNativeDriver: false }),
      Animated.spring(offset, { toValue: { x: 0, y: 0 }, useNativeDriver: false })
    ]).start();
  };

  const renderRoom = (roomCode, x, y, facing = 'down') => {
    const room = NWARD_ROOMS.find(r => r.id === roomCode);
    if (!room) return null;
    const roomBeds = room.beds.map(bc => beds.find(b => b.code === bc)).filter(Boolean);
    const hasAlarm = roomBeds.some(b => alarms.some(a => a.bedCode === b.code));
    const strokeCol = hasAlarm ? NSEV.high.color : NT.border;
    const isUp = facing === 'up';

    return (
      <G transform={`translate(${x},${y})`}>
        <Rect x={0} y={0} width={roomWidth} height={roomHeight} rx={6} fill={NT.surface} stroke={strokeCol} strokeWidth={hasAlarm ? 2 : 1.2} />
        <SvgText x={roomWidth/2} y={isUp ? roomHeight - 8 : 12} textAnchor="middle" fontSize="7" fontWeight="700" fill={NT.textFaint}>{room.name.toUpperCase()}</SvgText>
        {roomBeds.map((bed, i) => {
          const pat = bed.patientId ? NPATIENTS[bed.patientId] : null;
          return (
            <SVGBedShape
              key={bed.id}
              x={i === 0 ? 8 : 56}
              y={22}
              w={36}
              h={90}
              bed={bed}
              patient={pat}
              alarms={alarms}
              onTap={onBedTap}
              facing={facing}
            />
          );
        })}
        <Rect x={roomWidth/2 - 12} y={isUp ? -2 : roomHeight - 2} width={24} height={4} fill={NT.bg} />
      </G>
    );
  };

  return (
    <View style={styles.wardContainer}>
      <View {...panResponder.panHandlers} style={styles.svgWrapper}>
        <Svg viewBox="0 0 480 420" style={{ width: '100%', height: '100%' }}>
          <AnimatedG 
            style={{
              transform: [
                { scale: zoom },
                { translateX: offset.x },
                { translateY: offset.y }
              ]
            }}
          >
            <Rect x={-1000} y={-1000} width={3000} height={3000} fill={NT.bg} />
            
            {/* Top Row Rooms */}
            {renderRoom('R01', 10, 10, 'down')}
            {renderRoom('R02', 125, 10, 'down')}
            {renderRoom('R03', 240, 10, 'down')}
            {renderRoom('R04', 355, 10, 'down')}

            {/* Central Corridor & Nursing Station */}
            <G transform="translate(10, 150)">
              <Rect x={0} y={0} width={460} height={120} fill="rgba(0,0,0,0.02)" rx={12} />
              <G transform="translate(170, 20)">
                <Rect x={0} y={0} width={120} height={80} rx={40} fill={NT.primarySoft} stroke={NT.primary} strokeWidth={1} />
                <Circle cx={60} cy={40} r={30} fill="#fff" opacity={0.5} />
                <SvgText x={60} y={35} textAnchor="middle" fontSize="8" fontWeight="800" fill={NT.primary}>NURSING</SvgText>
                <SvgText x={60} y={48} textAnchor="middle" fontSize="7" fontWeight="600" fill={NT.textDim}>STATION</SvgText>
                <Path d="M40,60 Q60,50 80,60" fill="none" stroke={NT.primary} strokeWidth={1} opacity={0.3} />
              </G>
              <Line x1={20} y1={60} x2={440} y2={60} stroke={NT.border} strokeWidth={0.5} strokeDasharray="4,6" />
            </G>

            {/* Bottom Row Rooms */}
            <G transform="translate(0, 280)">
              {renderRoom('R05', 10, 0, 'up')}
              {renderRoom('R06', 125, 0, 'up')}
              {renderRoom('R07', 240, 0, 'up')}
              {renderRoom('R08', 355, 0, 'up')}
            </G>
          </AnimatedG>
        </Svg>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.zoomBtn} onPress={() => handleZoom('in')}>
          <View style={[styles.btnInner, { backgroundColor: NT.primary }]}>
             <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                <Path d="M12 5v14M5 12h14" />
             </Svg>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomBtn} onPress={() => handleZoom('out')}>
           <View style={[styles.btnInner, { backgroundColor: NT.surface, borderWidth: 1, borderColor: NT.border }]}>
             <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={NT.textDim} strokeWidth="3">
                <Path d="M5 12h14" />
             </Svg>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomBtn} onPress={resetMap}>
           <View style={[styles.btnInner, { backgroundColor: NT.surface, borderWidth: 1, borderColor: NT.border }]}>
             <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={NT.textDim} strokeWidth="2">
                <Circle cx="12" cy="12" r="10" />
                <Path d="M12 8v4l3 3" />
             </Svg>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wardContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  svgWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  controls: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    gap: 8,
  },
  zoomBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  btnInner: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export function SVGRoomFloorPlan({ room, beds, alarms, onBedTap }) {
  const roomBeds = room.beds.map((bc) => beds.find((b) => b.code === bc)).filter(Boolean);
  const hasAlarm = roomBeds.some((b) => alarms.some((a) => a.bedCode === b.code));
  const roomStroke = hasAlarm ? NSEV.high.color + '66' : NT.border;

  return (
    <Svg viewBox="0 0 200 158" style={{ width: '100%' }}>
      <Rect x={1} y={1} width={198} height={156} rx={5} fill={NT.surface} stroke={roomStroke} strokeWidth={1.5} />
      <Rect x={1} y={1} width={198} height={18} fill={NT.surfaceAlt} />
      <SvgText x={100} y={13} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={NT.textFaint} letterSpacing="0.7">{room.name.toUpperCase()}</SvgText>
      <Rect x={22} y={2} width={26} height={4} rx={1} fill="rgba(135,206,235,0.35)" stroke="rgba(135,206,235,0.65)" strokeWidth={0.7} />
      <Rect x={152} y={2} width={26} height={4} rx={1} fill="rgba(135,206,235,0.35)" stroke="rgba(135,206,235,0.65)" strokeWidth={0.7} />
      <Circle cx={100} cy={9} r={2.5} fill="rgba(52,199,89,0.6)" stroke="rgba(52,199,89,0.3)" strokeWidth={0.5} />
      <Path d="M83,156 L83,151 A17,17 0 0,1 117,151 L117,156" fill={NT.bg} stroke={NT.border} strokeWidth={0.9} />
      <Line x1={100} y1={20} x2={100} y2={148} stroke="rgba(0,0,0,0.04)" strokeWidth={0.8} strokeDasharray="3,4" />
      {roomBeds.map((bed, i) => {
        const pat = bed.patientId ? NPATIENTS[bed.patientId] : null;
        return (
          <SVGBedShape
            key={bed.id}
            x={i === 0 ? 10 : 108}
            y={22}
            w={82}
            h={128}
            bed={bed}
            patient={pat}
            alarms={alarms}
            onTap={onBedTap}
          />
        );
      })}
    </Svg>
  );
}
