import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MatrixComponent = ({ matrix, colors, numbers }) => {
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
          {numbers.map((num, colIndex) => (
            <Text key={`cell-${color}-${num}`} style={styles.cell}>
              {matrix[rowIndex] ? matrix[rowIndex][colIndex] || 0 : 0}
            </Text>
          ))}
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
});

export default MatrixComponent;