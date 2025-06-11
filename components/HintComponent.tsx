import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Picker
} from 'react-native';

export default function HintComponent({
  showHintDisplay,
  number_cards,
  colors,
  numbers,
  return: returnHint,
}) {
  const [selectedCards, setSelectedCards] = useState([]);
  const [hintType, setHintType] = useState('Select');

  const toggleCard = (index) => {
    if (selectedCards.includes(index)) {
      setSelectedCards(selectedCards.filter((i) => i !== index));
    } else {
      setSelectedCards([...selectedCards, index]);
    }
  };

  const handleApply = () => {
    if (selectedCards.length != 0 && hintType != 'Select') {
      console.log(`Applying hint: ${hintType} to cards: ${selectedCards}`);
      returnHint( selectedCards, hintType );
    }
    
  };

  return (
    <Modal
      visible={showHintDisplay}
      transparent={true}
      animationType="fade"
    >
      <TouchableWithoutFeedback onPress={() => returnHint([],"Select")}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.hintBox}>

              <Text style={styles.title}>The following cards</Text>
              <View style={styles.cardGrid}>
                {Array.from({ length: number_cards }).map((_, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.card, selectedCards.includes(idx) && styles.cardSelected]}
                    onPress={() => toggleCard(idx)}
                  >
                    <Text style={styles.cardNumber}>{idx + 1}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.areText}>are</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={hintType}
                  onValueChange={(itemValue) => setHintType(itemValue)}
                >
                  <Picker.Item label="Select" value="Select" />
                  {colors.map((color, idx) => (
                    <Picker.Item key={idx} label={color} value={color} />
                  ))}
                  {numbers.map((num, idx) => (
                    <Picker.Item key={idx} label={num.toString()} value={num.toString()} />
                  ))}
                </Picker>
              </View>
              <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                <Text style={styles.applyText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hintBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: 300,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-start',
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#ddd',
    marginBottom: 10,
  },
  closeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  card: {
    width: 40,
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardSelected: {
    backgroundColor: '#cce5ff',
  },
  cardNumber: {
    fontSize: 16,
  },
  areText: {
    marginTop: 10,
    fontSize: 18,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#000',
    marginVertical: 10,
    width: '100%',
  },
  applyButton: {
    backgroundColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  applyText: {
    fontSize: 16,
  },
});
