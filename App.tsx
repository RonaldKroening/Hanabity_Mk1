import { useState, useEffect } from 'react';
import { Platform, StyleSheet, ScrollView, TextInput, Text, View, TouchableOpacity } from 'react-native';
import CardCheckboxComponent from "./components/CardCheckboxComponent";
import YourHandComponent from './components/YourHandComponent';

export default function App() {
  const [players, setPlayers] = useState(5);
  const [cardsPerPlayer, setCardsPerPlayer] = useState(5);
  
  

  const card_colors = ['Red', 'Green', 'Blue', 'Yellow', 'White'];
  const card_freq = {
    1:3,
    2:2,
    3:2,
    4:2,
    5:1
  }

  const opts = {
    color: [...card_colors, "?"],
    number: [...Object.keys(card_freq),"?"]
  };
  
  const [current_deck, setDeck] = useState({});
  const [cardsShown, setCardsShown] = useState({}); 
  const [matrix, setMatrix] = useState([]);


  useEffect(() => {
    let deck = load_deck(false);
    let shown = load_deck(true);
    setDeck(deck);
    setCardsShown(shown);
  }, [cardsPerPlayer])

  function update_matrix(name, num, val){
    const name_index = card_colors.indexOf(name);
    let row = matrix[name_index];
    row[num] = row[num] + val;
    let new_matrix = [...matrix];
    new_matrix[name_index] = row;
    setMatrix(new_matrix);
  }

  function load_deck(empty){
    console.log("Loading deck here");
    if(empty == false){
      let deck = {};
      var new_matrix = [];
      for (let name of card_colors){
        let color_arr = [];
        let row = [];
        for (let key in card_freq){
          row.push(card_freq[key]);
          for (let i = 0; i < card_freq[key]; i++){
              color_arr.push(key);
          }
        }
        new_matrix.push(row);
        deck[name] = color_arr;
      }
      console.log(deck);
      setMatrix(new_matrix)
      return deck;
    }else{
      console.log("Loading empty deck");
      let deck = {};
      for (let name of card_colors){
        deck[name] = [];
      }
      console.log(deck);
      return deck;
    }
  }

  function remove(arr, x) {
    console.log(arr);
    let i = arr.indexOf(x);
    if (i !== -1) {
        arr.splice(i, 1);
    }
    return arr;
  }
  function get_index(card_name){
    let card_type = parseInt(card_name.split("-")[1]);
    let card_num = parseInt(card_name.split("-")[2]);
    var index = 0;
    
    for(let i = 1; i < card_type; i++){
      index += card_freq[i];
    }
    return index + card_num;
  }

  function sort_by_color(arr){
    let new_arr = arr.sort((a, b) => {
      return a-b;
    });
    return new_arr;
  }

  function swap_decks(deck1, deck2, card_type, card_name,direction){
    console.log(`Moving the ${card_type} ${card_name} to the ${direction}`);
    var old_cards = deck1[card_type];
    old_cards = remove(old_cards, card_name);
    old_cards = old_cards.sort((a, b) => {
      return a-b;
    });
    var new_cards = deck2[card_type];
    new_cards.push(card_name);
    new_cards = new_cards.sort((a, b) => {
      return a-b;
    });
    if(direction == "Deck"){
      update_matrix(card_type, card_name,1);
      setDeck({
        ...deck2,
        [card_type]: new_cards
      });

      setCardsShown({
        ...deck1,
        [card_type]: old_cards
      });
    }else if(direction == "Shown"){
      update_matrix(card_type, card_name,1);
      setCardsShown({
        ...deck2,
        [card_type]: new_cards
      });
      setDeck({
        ...deck1,
        [card_type]: old_cards
      });
    }
  }
  
  
  function change_status(title, card_name, card_type){
    if(title == "Shown"){
      swap_decks(cardsShown, current_deck, card_type, card_name,"Deck");
    }else{
      swap_decks(current_deck, cardsShown, card_type, card_name,"Shown");
    }
  }
  

  
  
  const handlePlayersChange = (text) => {
    const num = parseInt(text) || 2; 
    setPlayers(Math.min(Math.max(num, 2), 5)); 
  };

  const handleCardsPerPlayerChange = (text) => {
    
    const num = parseInt(text) || 4;
    
    
    const theoreticalMax = Math.floor(50 / players);
    
    
    const maxCards = Math.min(theoreticalMax, 10);
    
    
    const clampedValue = Math.min(Math.max(num, 4), maxCards);
    
    
    setCardsPerPlayer(clampedValue);
    
    
    if (clampedValue === maxCards) {
      console.warn(`Maximum cards per player reached (${maxCards}) with ${players} players`);
    }
  };
  
  const incrementPlayers = () => setPlayers(prev => Math.min(prev + 1, 5));
  const decrementPlayers = () => setPlayers(prev => Math.max(prev - 1, 2));
  const incrementCards = () => setCardsPerPlayer(prev => Math.min(prev + 1, 5));
  const decrementCards = () => setCardsPerPlayer(prev => Math.max(prev - 1, 3));

  useEffect(() => {
    let deck = load_deck(false);
    let shown = load_deck(true);
    setDeck(deck);
    setCardsShown(shown);
  }, [cardsPerPlayer]);

  

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>Hanabi</Text>
      
      <View style={styles.settingsContainer}>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Players:</Text>
          <View style={styles.numberInputContainer}>
            <TouchableOpacity onPress={decrementPlayers} style={styles.controlButton}>
              <Text style={styles.controlText}>-</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.numberInput}
              keyboardType="numeric"
              value={players.toString()}
              onChangeText={handlePlayersChange}
            />
            <TouchableOpacity onPress={incrementPlayers} style={styles.controlButton}>
              <Text style={styles.controlText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Cards per Player:</Text>
          <View style={styles.numberInputContainer}>
            <TouchableOpacity onPress={decrementCards} style={styles.controlButton}>
              <Text style={styles.controlText}>-</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.numberInput}
              keyboardType="numeric"
              value={cardsPerPlayer.toString()}
              onChangeText={handleCardsPerPlayerChange}
            />
            <TouchableOpacity onPress={incrementCards} style={styles.controlButton}>
              <Text style={styles.controlText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.deckContainer}>
          <CardCheckboxComponent given_title={"Deck"} cards_to_show={current_deck} changeStatus={change_status} />
          <CardCheckboxComponent given_title={"Shown"} cards_to_show={cardsShown} changeStatus={change_status} />
        </View>
        <YourHandComponent 
          deck={current_deck} 
          discard={cardsShown} 
          options={opts} 
          cards_per_player={cardsPerPlayer} 
          frequencies={card_freq} 
        />
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
  settingLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  numberInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  scrollContent: {
    paddingBottom: 20,
  },
  deckContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  
});