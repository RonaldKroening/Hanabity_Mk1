import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Picker,
} from 'react-native';

export default function CardComponent({
  idx,
  color: initialColor,
  number: initialNumber,
  probabilities = { color: {}, number: {} },
  options,
  update,
  resetCard,
}) {
  const [color, setColor] = useState(initialColor || '');
  const [number, setNumber] = useState(initialNumber || '');

  const [yesColors, setYesColors] = useState([]);
  const [noColors, setNoColors] = useState([]);
  const [yesNumbers, setYesNumbers] = useState([]);
  const [noNumbers, setNoNumbers] = useState([]);

  useEffect(() => {
    const yc = options.color.filter(c => probabilities.color?.[c] === 1);
    const nc = options.color.filter(c => probabilities.color?.[c] === 0);
    const yn = options.number.filter(n => probabilities.number?.[n] === 1);
    const nn = options.number.filter(n => probabilities.number?.[n] === 0);

    setYesColors(yc);
    setNoColors(nc);
    setYesNumbers(yn);
    setNoNumbers(nn);
  }, [probabilities, options]);

  const moveColor = (c, fromYes) => {
    if (fromYes) {
      setYesColors(yesColors.filter(x => x !== c));
      setNoColors([...noColors, c]);
    } else {
      setNoColors(noColors.filter(x => x !== c));
      setYesColors([...yesColors, c]);
    }
  };

  const moveNumber = (n, fromYes) => {
    if (fromYes) {
      setYesNumbers(yesNumbers.filter(x => x !== n));
      setNoNumbers([...noNumbers, n]);
    } else {
      setNoNumbers(noNumbers.filter(x => x !== n));
      setYesNumbers([...yesNumbers, n]);
    }
  };

  return (
    <View>
    <Text style={styles.cardTitle}>Card {idx + 1}</Text>
    <SafeAreaView style={styles.cardContainer}>
      

      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Color</Text>
        <Picker
          selectedValue={color}
          style={styles.picker}
          onValueChange={(val) => {
            setColor(val);
            update(idx, val, number);
          }}
        >
          <Picker.Item label="Select color" value="" />
          {options?.color?.map((col) => (
            <Picker.Item key={col} label={col} value={col} />
          ))}
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Number</Text>
        <Picker
          selectedValue={number}
          style={styles.picker}
          onValueChange={(val) => {
            setNumber(val);
            update(idx, color, val);
          }}
        >
          <Picker.Item label="Select number" value="" />
          {options?.number?.map((num) => (
            <Picker.Item key={num} label={String(num)} value={String(num)} />
          ))}
        </Picker>
      </View>

      <View style={styles.tableContainer}>
        <Text style={styles.sectionTitle}>Probability Table</Text>

        <View style={styles.tableHeader}>
          <Text style={styles.tableCellHeader}>Probability</Text>
          <Text style={styles.tableCellHeader}>Color</Text>
          <Text style={styles.tableCellHeader}>Number</Text>
        </View>

        {/* YES Row */}
        <View style={styles.tableRow}>
          <Text style={styles.tableCellHeader}>Yes</Text>
          <View style={styles.tableCell}>
            {yesColors.map((c) => (
              <TouchableOpacity
                key={c}
                style={styles.probButton}
                onPress={() => moveColor(c, true)}
              >
                <Text style={styles.buttonText}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.tableCell}>
            {yesNumbers.map((n) => (
              <TouchableOpacity
                key={n}
                style={styles.probButton}
                onPress={() => moveNumber(n, true)}
              >
                <Text style={styles.buttonText}>{n}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* NO Row */}
        <View style={styles.tableRow}>
          <Text style={styles.tableCellHeader}>No</Text>
          <View style={styles.tableCell}>
            {noColors.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.probButton, styles.noButton]}
                onPress={() => moveColor(c, false)}
              >
                <Text style={styles.buttonText}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.tableCell}>
            {noNumbers.map((n) => (
              <TouchableOpacity
                key={n}
                style={[styles.probButton, styles.noButton]}
                onPress={() => moveNumber(n, false)}
              >
                <Text style={styles.buttonText}>{n}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.resetButton]}
          onPress={() => resetCard(idx)}
        >
          <Text style={styles.buttonText}>Reset Card</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    width: 270,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  pickerContainer: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pickerLabel: {
    fontSize: 16,
    color: '#555',
    width: 50,
  },
  picker: {
    height: 40,
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  tableContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 6,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    padding: 8,
    backgroundColor: '#f7f7f7',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    color: '#333',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 6,
  },
  tableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 6,
    paddingHorizontal: 4,
    alignItems: 'flex-start',
  },
  tableCellHeader: {
    flex: 1,
    fontWeight: 'bold',
    color: '#222',
  },
  tableCell: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  probButton: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    margin: 2,
  },
  noButton: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 13,
  },
  buttonRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    minWidth: 100,
  },
  resetButton: {
    backgroundColor: '#e74c3c',
  },
});
