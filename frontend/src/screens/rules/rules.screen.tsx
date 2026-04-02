import { View, Text, ScrollView, Platform, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import BottomNav from '../../components/bottom-nav/bottom-nav.component';
import styles, { COLORS } from './rules.screen.styles';

const COMBINATIONS = [
  { code: 'C-01', label: 'Three of a Kind', desc: 'Three identical dice. One card per value (×6 cards).', accent: false },
  { code: 'C-02', label: 'Straight', desc: '1-2-3-4-5 or 2-3-4-5-6 in a single roll.', accent: false },
  { code: 'C-03', label: 'Full House', desc: 'A three-of-a-kind and a pair in the same roll.', accent: true },
  { code: 'C-04', label: 'Four of a Kind', desc: 'Four identical dice.', accent: true },
  { code: 'C-05', label: '≤ 8', desc: 'Sum of all five dice is 8 or less.', accent: false },
  { code: 'C-06', label: 'First Roll', desc: 'Any combo obtained on the very first roll.', accent: false },
  { code: 'C-07', label: 'Yam', desc: 'All five dice show the same value.', accent: true },
  { code: 'C-08', label: 'Challenge', desc: 'Challenge after your 2nd roll. Opponent must beat your result.', accent: true },
];

const RulesContent = () => (
  <>
    <Text style={styles.eyebrow}>Manual No. 01</Text>
    <Text style={styles.titleLine1}>The</Text>
    <Text style={styles.titleLine2}>Rules</Text>
    <Text style={styles.heroParagraph}>
      Yam Master is a game of strategy and geometric precision. A modern take on the classic dice grid, designed for focus and intent.
    </Text>

    <View style={styles.shapesRow}>
      <View style={styles.shapeCircle} />
      <View style={styles.shapeRect} />
      <View style={styles.shapeWide} />
    </View>

    <View style={styles.howToPlayCard}>
      <View style={styles.howToPlayHeader}>
        <Feather name="book-open" size={16} color={COLORS.primary} />
        <Text style={styles.howToPlayEyebrow}>How to Play</Text>
      </View>
      <View style={styles.howToPlayList}>
        {[
          { icon: 'shuffle' as const, title: 'Roll', desc: 'Roll up to three times. Lock dice between rolls.' },
          { icon: 'check-circle' as const, title: 'Claim', desc: 'When you match a combo, place one piece on a free matching cell.' },
          { icon: 'zap-off' as const, title: 'Predator', desc: 'With Yam, you may remove one opponent piece instead of placing yours.' },
          { icon: 'award' as const, title: 'Win', desc: 'Make 5 in a row or finish with the highest score if pieces run out.' },
        ].map(item => (
          <View key={item.title} style={styles.howToPlayItem}>
            <Feather name={item.icon} size={16} color={COLORS.onSurface} />
            <View style={styles.howToPlayItemContent}>
              <Text style={styles.howToPlayItemTitle}>{item.title}</Text>
              <Text style={styles.howToPlayItemDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>

    <View style={styles.sectionDivider} />

    <Text style={styles.sectionEyebrow}>01 — Setup</Text>
    <Text style={styles.sectionTitle}>The Grid</Text>
    <Text style={styles.sectionBody}>
      Two players share a 5×5 board. Each player starts with 12 pieces. On your turn, roll up to 3 times — lock any dice between rolls to keep their value.
    </Text>
    <Text style={styles.sectionBody}>
      Every cell corresponds to a combination. Once you achieve one, place a piece on any free matching cell.
    </Text>

    <View style={styles.numberedList}>
      {[
        { n: '01', label: 'Roll', desc: 'Roll all 5 dice. Lock the ones you want and re-roll up to 2 more times.' },
        { n: '02', label: 'Claim', desc: 'Pick one of your available combinations and place a piece on the matching cell.' },
        { n: '03', label: 'Pass', desc: 'Your turn ends. Alternate until the game is decided.' },
      ].map((item, i) => (
        <View key={item.n} style={[styles.numberedItem, i === 0 && styles.numberedItemPrimary]}>
          <Text style={styles.itemNumber}>{item.n}</Text>
          <View style={styles.itemContent}>
            <Text style={styles.itemLabel}>{item.label}</Text>
            <Text style={styles.itemDesc}>{item.desc}</Text>
          </View>
        </View>
      ))}
    </View>

    <View style={styles.sectionDivider} />

    <Text style={styles.sectionEyebrow}>02 — Dice</Text>
    <Text style={styles.sectionTitle}>Combinations</Text>
    <Text style={styles.sectionBody}>
      Eight distinct combinations. Each maps to a row on the grid. Master them all to control the board.
    </Text>

    <View style={styles.comboGrid}>
      {[0, 2, 4, 6].map(i => (
        <View key={i} style={styles.comboRow}>
          {[COMBINATIONS[i], COMBINATIONS[i + 1]].map(c => (
            <View key={c.code} style={[styles.comboCard, c.accent && styles.comboCardAccent]}>
              <Text style={styles.comboCode}>{c.code}</Text>
              <Text style={styles.comboLabel}>{c.label}</Text>
              <Text style={styles.comboDesc}>{c.desc}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>

    <View style={styles.sectionDivider} />

    <Text style={styles.sectionEyebrow}>03 — Special</Text>
    <Text style={styles.sectionTitle}>Yam Predator</Text>
    <Text style={styles.sectionBody}>
      Roll five identical dice and a special power activates. Instead of placing your own piece, remove one of your opponent's pieces from the board.
    </Text>

    <View style={styles.callout}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Feather name="alert-triangle" size={14} color={COLORS.primary} />
        <Text style={styles.calloutLabel}>Strategic use only</Text>
      </View>
      <Text style={styles.calloutText}>
        Using Yam Predator ends your turn immediately — no piece is placed. Disrupting a 4-in-a-row is often worth more than extending your own line.
      </Text>
    </View>

    <View style={styles.sectionDivider} />

    <Text style={styles.sectionEyebrow}>04 — Victory</Text>
    <Text style={styles.sectionTitle}>How to Win</Text>

    <View style={styles.numberedList}>
      {[
        { n: '01', label: 'Alignment', desc: '5 pieces in a row — horizontal, vertical, or diagonal — wins instantly.', icon: 'check-circle' as const },
        { n: '02', label: 'No Pieces Left', desc: 'If all 12 pieces are placed without alignment, the highest score wins.', icon: 'award' as const },
        { n: '03', label: 'Disconnect', desc: 'If your opponent leaves mid-game, you are awarded the victory.', icon: 'wifi-off' as const },
      ].map((item, i) => (
        <View key={item.n} style={[styles.numberedItem, i === 0 && styles.numberedItemPrimary]}>
          <Text style={styles.itemNumber}>{item.n}</Text>
          <View style={styles.itemContent}>
            <Text style={styles.itemLabel}>{item.label}</Text>
            <Text style={styles.itemDesc}>{item.desc}</Text>
          </View>
          <Feather name={item.icon} size={18} color={COLORS.onSurfaceSubtle} />
        </View>
      ))}
    </View>

    <View style={styles.sectionDivider} />

    <View style={styles.footerLine}>
      <View style={styles.footerDash} />
      <Text style={styles.footerText}>Selected by the Master's Council</Text>
      <View style={styles.footerDash} />
    </View>
  </>
);

export default function RulesScreen() {
  const isWeb = Platform.OS === 'web';
  const { height } = useWindowDimensions();

  if (!isWeb) {
    return (
      <View style={styles.screen}>
        <View style={styles.contentArea}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContentMobile}
            showsVerticalScrollIndicator={false}
          >
            <RulesContent />
          </ScrollView>
        </View>
        <BottomNav activeTab="rules" />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { height, maxHeight: height, overflow: 'hidden' }]}>
      <View style={styles.contentArea}>
        <ScrollView
          style={[styles.scrollView, { maxHeight: height }]}
          contentContainerStyle={styles.scrollContentWeb}
          showsVerticalScrollIndicator={false}
        >
          <RulesContent />
        </ScrollView>
      </View>
      <BottomNav activeTab="rules" absolute />
    </View>
  );
}
