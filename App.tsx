import { useState, useEffect } from 'react';
import { Platform, StyleSheet, ScrollView, TextInput, Text, View, TouchableOpacity } from 'react-native';
import MatrixComponent from './components/MatrixComponent';
import CardComponent from './components/CardComponent';
import HintComponent from './components/HintComponent';

export default function App() {
  const [players, setPlayers] = useState(5);
  const [cardsPerPlayer, setCardsPerPlayer] = useState(5);
  const [showHintDisplay, setHintDisplay] = useState(false);
  const [probabilities, setProbabilities] = useState({});
  const [chosen_colors, setChosenColors] = useState([]);
  const [chosen_numbers, setChosenNumbers] = useState([]);
  const card_colors = ['Red', 'Green', 'Blue', 'Yellow', 'White'];
  const card_freq = { 1: 3, 2: 2, 3: 2, 4: 2, 5: 1 };

  useEffect(() => {
    setChosenColors(Array(cardsPerPlayer).fill("Select"));
    setChosenNumbers(Array(cardsPerPlayer).fill("Select"));    
    load_tables();
  }, [cardsPerPlayer]);

  function apply_change(type, idx, value){
    if(type === "color"){
      setChosenColors(prev => {
        const newColors = [...prev];
        newColors[idx] = value;
        return newColors;
      });
    } else {
      setChosenNumbers(prev => {
        const newNumbers = [...prev];
        newNumbers[idx] = value;
        return newNumbers;
      });
    }
  }

  const handleCellPress = (rowIndex, colIndex, newValue) => {
    setMatrix(prevMatrix => {
      const newMatrix = [...prevMatrix];
      newMatrix[rowIndex] = [...newMatrix[rowIndex]];
      newMatrix[rowIndex][colIndex] = newValue;
      return newMatrix;
    });
  };

  const [matrix, setMatrix] = useState<number[][]>([]);

  function apply_hint(card, hintType) {
    let newProbabilities = { ...probabilities };

    for (let given_card of Object.keys(newProbabilities)) {
      let idx = parseInt(given_card);
      let card_probs = { ...newProbabilities[given_card] };

      if (parseInt(card) === idx) {
        if (card_colors.includes(hintType)) {
          for (let color of card_colors) {
            card_probs.color[color] = color === hintType ? 1 : 0;
          }
          apply_change("color", idx, hintType);
        }
        if (Object.keys(card_freq).includes(hintType)) {
          for (let number of Object.keys(card_freq)) {
            card_probs.number[number] = number === hintType ? 1 : 0;
          }
          apply_change("number", idx, hintType);
        }
      } else {
        if (card_colors.includes(hintType)) {
          card_probs.color[hintType] = 0;
        }
        if (Object.keys(card_freq).includes(hintType)) {
          card_probs.number[hintType] = 0;
        }
      }

      newProbabilities[given_card] = card_probs;
    }

    setProbabilities(newProbabilities);
  }

  function load_tables(){
    var arr = {};
    for(let i = 0; i < cardsPerPlayer; i++){  
      arr[i] = {
        color: { "Red": 0, "Green": 0, "Blue": 0, "Yellow": 0, "White": 0 },
        number: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 }
      };
    }
    setProbabilities(arr);
  }

  function reset_card(idx){
    let new_prob = {
      color: { "Red": 0, "Green": 0, "Blue": 0, "Yellow": 0, "White": 0 },
      number: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 }
    };
    let new_probs = { ...probabilities };
    let nc = [...chosen_colors];
    let nn = [...chosen_numbers];
    new_probs[idx] = new_prob;
    setProbabilities(new_probs);
    nc[idx] = "Select";
    nn[idx] = "Select";
    setChosenColors(nc);
    setChosenNumbers(nn);
  }

  useEffect(() => {
    loadMatrix();
  }, []);

  function loadMatrix() {
    const newMatrix = card_colors.map(color => {
      return Object.keys(card_freq).map(num => card_freq[num]);
    });
    setMatrix(newMatrix);
  }

  const handlePlayersChange = (text: string) => {
    const num = parseInt(text) || 2; 
    setPlayers(Math.min(Math.max(num, 2), 5)); 
  };

  const handleCardsPerPlayerChange = (text: string) => {
    const num = parseInt(text) || 4;
    const theoreticalMax = Math.floor(50 / players);
    const maxCards = Math.min(theoreticalMax, 10);
    const clampedValue = Math.min(Math.max(num, 4), maxCards);
    setCardsPerPlayer(clampedValue);

    if (clampedValue === maxCards) {
      console.warn(`Maximum cards per player reached (${maxCards}) with ${players} players`);
    }
  };

  function addHint() {
    setHintDisplay(true); 
  }

  function complete_hint(cards, hintType) {
    for (let card of cards) {
      apply_hint(card.toString(), hintType);
    }
    setHintDisplay(false);
  }

  const incrementPlayers = () => setPlayers(prev => Math.min(prev + 1, 5));
  const decrementPlayers = () => setPlayers(prev => Math.max(prev - 1, 2));
  const incrementCards = () => setCardsPerPlayer(prev => Math.min(prev + 1, 10));
  const decrementCards = () => setCardsPerPlayer(prev => Math.max(prev - 1, 4));

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>Hanabi</Text>
      
      <View style={styles.settingsContainer}>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Players:</Text>
          <View style={styles.numberInputContainer}>
            <TouchableOpacity onPress={decrementPlayers} style={styles.controlButton}><Text style={styles.controlText}>-</Text></TouchableOpacity>
            <TextInput style={styles.numberInput} keyboardType="numeric" value={players.toString()} onChangeText={handlePlayersChange} />
            <TouchableOpacity onPress={incrementPlayers} style={styles.controlButton}><Text style={styles.controlText}>+</Text></TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Cards per Player:</Text>
          <View style={styles.numberInputContainer}>
            <TouchableOpacity onPress={decrementCards} style={styles.controlButton}><Text style={styles.controlText}>-</Text></TouchableOpacity>
            <TextInput style={styles.numberInput} keyboardType="numeric" value={cardsPerPlayer.toString()} onChangeText={handleCardsPerPlayerChange} />
            <TouchableOpacity onPress={incrementCards} style={styles.controlButton}><Text style={styles.controlText}>+</Text></TouchableOpacity>
          </View>
        </View>
      </View>

      <MatrixComponent 
        matrix={matrix} 
        colors={card_colors} 
        numbers={Object.keys(card_freq)} 
        originalFrequencies={card_freq}
        onCellPress={handleCellPress}
      />

      <TouchableOpacity onPress={addHint} style={styles.hintBtn}>
        <Text style={styles.hintText}>Add Hint</Text>
        <HintComponent showHintDisplay={showHintDisplay} number_cards={cardsPerPlayer} colors={card_colors} numbers={Object.keys(card_freq)} return={complete_hint}/>
      </TouchableOpacity>

      <ScrollView horizontal={true} style={{ marginTop: 20 }} contentContainerStyle={styles.cardHdr}>
        {Object.keys(probabilities).map((card, index) => (
          <View key={index} style={styles.deckContainer}>
            <CardComponent
              idx={index}
              color={chosen_colors[index]}
              number={chosen_numbers[index]}
              options={{
                color: card_colors,
                number: Object.keys(card_freq)
              }}
              probabilities={probabilities[card]}
              resetCard={() => reset_card(index)}
              update={(idx, newColor, newNumber) => {
                if (newColor) apply_change("color", idx, newColor);
                if (newNumber) apply_change("number", idx, newNumber);
              }}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  settingsContainer: {
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  hintText: {
    fontSize: 12,
    fontWeight: 'bold',
    color:'white',
  },
  settingLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  numberInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  cardHdr: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    marginTop: 20,
  },

  numberInput: {
    height: 40,
    width: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    textAlign: 'center',
    marginHorizontal: 5,
  },
  hintBtn: {
    width: 140,
    height: 60,
    backgroundColor: '#a0a0ff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    width: 40,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  mainTitle: {
    fontSize: 32,
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 16,
  },
  scrollView: {
    flex: 1,
  },
  deckContainer: {
    marginBottom: 20,
  },
});