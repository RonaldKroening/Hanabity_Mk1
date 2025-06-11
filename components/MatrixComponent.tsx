import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MatrixComponent = ({ matrix, colors, numbers, originalFrequencies, onCellPress }) => {
  const handlePress = (rowIndex, colIndex, originalValue) => {
    const currentValue = matrix[rowIndex][colIndex];
    const newValue = currentValue > 0 ? currentValue - 1 : originalValue;
    onCellPress(rowIndex, colIndex, newValue);
  };

  return (
    <View style={styles.container}>
      {/* Header row with numbers */}
      <View style={styles.row}>
        <Text style={[styles.cell, styles.headerCell]}>Color\Num</Text>
        {numbers.map(num => (
          <Text key={`header-${num}`} style={[styles.cell, styles.headerCell]}>{num}</Text>
        ))}
      </View>
      
      {/* Data rows */}
      {colors.map((color, rowIndex) => (
        <View key={`row-${color}`} style={styles.row}>
          <Text style={[styles.cell, styles.headerCell]}>{color}</Text>
          {numbers.map((num, colIndex) => {
            const originalValue = originalFrequencies[num];
            const currentValue = matrix[rowIndex] ? matrix[rowIndex][colIndex] || 0 : 0;
            
            return (
              <TouchableOpacity
                key={`cell-${color}-${num}`}
                style={[
                  styles.cell,
                  styles.buttonCell,
                  currentValue === 0 && styles.zeroCell
                ]}
                onPress={() => handlePress(rowIndex, colIndex, originalValue)}
              >
                <Text style={styles.buttonText}>{currentValue}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    padding: 8,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  headerCell: {
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
  },
  buttonCell: {
    backgroundColor: '#e3f2fd',
  },
  zeroCell: {
    backgroundColor: '#ffebee',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MatrixComponent;