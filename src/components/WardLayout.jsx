
import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import Svg, { G, Rect, Circle, Text as SvgText, Path, Line } from 'react-native-svg';
import { NT, NSEV, NBED_COLORS } from '../constants/theme';
import { NPATIENTS } from '../constants/mockData';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function SVGBedShape({ x, y, w, h, bed, patient, alarms, onTap }) {
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
  const bY2 = y + 7 + pilH + 4; // body text start Y

  const first = patient ? patient.name.split(' ')[0] : '';
  const fname = first.length > 9 ? first.slice(0, 8) + '.' : first;

  const pulseAnim = useRef(new Animated.Value(4)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (mon) {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(pulseAnim, { toValue: 6.5, duration: 800, useNativeDriver: true }),
            Animated.timing(pulseAnim, { toValue: 4, duration: 800, useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.timing(opacityAnim, { toValue: 0.3, duration: 800, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
          ]),
        ])
      ).start();
    }
  }, [mon]);

  return (
    <G onPress={() => onTap(bed)}>
      {/* Bed frame */}
      <Rect
        x={x} y={y} width={w} height={h} rx={3}
        fill={fillCol} stroke={strokeCol} strokeWidth={worst ? 2 : 1.4}
      />

      {/* Headboard bar */}
      <Rect x={x} y={y} width={w} height={7} rx={3} fill={bc.dot + '55'} />

      {/* Pillow */}
      <Rect
        x={x + 5} y={y + 9} width={w - 10} height={pilH} rx={2.5}
        fill="rgba(255,255,255,0.52)" stroke="rgba(0,0,0,0.07)" strokeWidth={0.7}
      />

      {/* Side rails */}
      <Rect x={x + 1.5} y={y + 7 + pilH + 3} width={2.5} height={h - pilH - 16} rx={1} fill="rgba(0,0,0,0.10)" />
      <Rect x={x + w - 4} y={y + 7 + pilH + 3} width={2.5} height={h - pilH - 16} rx={1} fill="rgba(0,0,0,0.10)" />

      {/* Footboard */}
      <Rect x={x} y={y + h - 5} width={w} height={5} rx={3} fill={bc.dot + '33'} />

      {/* Bed code */}
      <SvgText
        x={x + w / 2} y={bY2 + 11} textAnchor="middle"
        fontSize="9" fontWeight="700" fill="rgba(0,0,0,0.52)"
      >
        {bed.code}
      </SvgText>

      {/* Patient name */}
      {patient && (
        <SvgText
          x={x + w / 2} y={bY2 + 24} textAnchor="middle"
          fontSize="7.5" fontWeight="600" fill="rgba(0,0,0,0.68)"
        >
          {fname}
        </SvgText>
      )}

      {/* Vitals: HR + SpO2 (monitoring only) */}
      {patient && mon && (
        <>
          <SvgText x={x + w / 2} y={bY2 + 37} textAnchor="middle" fontSize="7" fill="rgba(0,0,0,0.48)">
            HR {patient.vitals.hr}
          </SvgText>
          <SvgText x={x + w / 2} y={bY2 + 47} textAnchor="middle" fontSize="7" fill="rgba(0,0,0,0.48)">
            SpO2 {patient.vitals.spo2}%
          </SvgText>
        </>
      )}

      {/* Empty / status label */}
      {!patient && (
        <SvgText x={x + w / 2} y={y + h / 2 + 3} textAnchor="middle" fontSize="8" fill={bc.dot + 'CC'}>
          {bed.status === 'empty' ? 'Empty' : bed.status === 'admit' ? 'Pending' : bc.label}
        </SvgText>
      )}

      {/* Live monitor pulse */}
      {mon && (
        <AnimatedCircle
          cx={x + w - 7} cy={y + 7} r={pulseAnim}
          fill="#34C759" opacity={opacityAnim}
        />
      )}

      {/* Alarm badge */}
      {worst && (
        <G>
          <Circle cx={x + 8} cy={y + 8} r={7.5} fill={NSEV[worst.severity].color} />
          <SvgText
            x={x + 8} y={y + 11.5} textAnchor="middle"
            fontSize="9" fontWeight="700" fill="#fff"
          >
            {bAlm.length}
          </SvgText>
        </G>
      )}
    </G>
  );
}

export function SVGRoomFloorPlan({ room, beds, alarms, onBedTap }) {
  const roomBeds = room.beds.map((bc) => beds.find((b) => b.code === bc)).filter(Boolean);
  const hasAlarm = roomBeds.some((b) => alarms.some((a) => a.bedCode === b.code));
  const roomStroke = hasAlarm ? NSEV.high.color + '66' : NT.border;

  return (
    <Svg viewBox="0 0 200 158" style={{ width: '100%' }}>
      {/* Floor */}
      <Rect
        x={1} y={1} width={198} height={156} rx={5}
        fill={NT.surface} stroke={roomStroke} strokeWidth={1.5}
      />

      {/* Header band */}
      <Rect x={1} y={1} width={198} height={18} fill={NT.surfaceAlt} />
      <SvgText
        x={100} y={13} textAnchor="middle"
        fontSize="8.5" fontWeight="700" fill={NT.textFaint} letterSpacing="0.7"
      >
        {room.name.toUpperCase()}
      </SvgText>

      {/* Windows */}
      <Rect
        x={22} y={2} width={26} height={4} rx={1}
        fill="rgba(135,206,235,0.35)" stroke="rgba(135,206,235,0.65)" strokeWidth={0.7}
      />
      <Rect
        x={152} y={2} width={26} height={4} rx={1}
        fill="rgba(135,206,235,0.35)" stroke="rgba(135,206,235,0.65)" strokeWidth={0.7}
      />

      {/* Nurse call indicator */}
      <Circle cx={100} cy={9} r={2.5} fill="rgba(52,199,89,0.6)" stroke="rgba(52,199,89,0.3)" strokeWidth={0.5} />

      {/* Door arc at bottom */}
      <Path
        d="M83,156 L83,151 A17,17 0 0,1 117,151 L117,156"
        fill={NT.bg} stroke={NT.border} strokeWidth={0.9}
      />

      {/* Corridor center line */}
      <Line
        x1={100} y1={20} x2={100} y2={148}
        stroke="rgba(0,0,0,0.04)" strokeWidth={0.8} strokeDasharray="3,4"
      />

      {/* Beds */}
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
