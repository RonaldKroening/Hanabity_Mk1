import { Image } from 'expo-image';
import { Platform, StyleSheet, ScrollView, View, Text, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';

export default function CardCheckboxComponent({given_title, cards_to_show, changeStatus}) {
  const [title, setTitle] = useState(given_title);
  const [cards, setCards] = useState(cards_to_show);
  
  useEffect(() => {
    setCards(cards_to_show);
  }, [cards_to_show]);


  

  function getBackgroundColorForType(card_type) {
    switch (card_type) {
      case 'Red':
        return '#FFDDDD'; // Light red
      case 'Green':
        return '#DDFFDD'; // Light green
      case 'Blue':
        return '#DDDDFF'; // Light blue
      case 'Yellow':
        return '#FFFFDD'; // Light yellow
      default:
        return '#EEEEEE'; // Default white
    }
  }
  function getBackgroundColorForButton(card_type) {
    switch (card_type) {
      case 'Red':
        return '#CCAAAA'; // Light red
      case 'Green':
        return '#AACCAA'; // Light green
      case 'Blue':
        return '#AAAACC'; // Light blue
      case 'Yellow':
        return '#CCCCAA'; // Light yellow
      default:
        return '#CCCCCC'; // Default white
    }
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View 
      >
        <Text style={styles.title}>{title}</Text>
        {Object.entries(cards).map(([card_type, cards_for_type]) => (
          <View key={card_type} style={styles.cardTypeContainer}>
            <Text style={styles.subTitle}>{card_type}</Text>
            <View style={[
              styles.deckContainer, 
              { backgroundColor: getBackgroundColorForType(card_type) }
            ]}>
            {cards_for_type.map((card, index) => (
              <TouchableOpacity 
              key={`${card_type}-${index}`}
              onPress={() => changeStatus(title,card, card_type)} 
              style={[
                styles.cardBtn, 
                { backgroundColor: getBackgroundColorForButton(card_type) }
              ]}
            >
              <Text style={styles.cardBtnText} numberOfLines={2} ellipsizeMode="tail">
                {card}
              </Text>
            </TouchableOpacity>
              
            ))}
            </View>
          </View>
        ))}
        <View style={styles.paddingBottom} />
      </View>
    </SafeAreaView>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height * 0.8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cardTypeContainer: {
    marginBottom: 16,
    
  },

  subTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  paddingBottom: {
    height: 50, 
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  deckContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 8, 
    padding: 5,
    borderRadius: 4,
    borderWidth: 4,
    borderColor: '#fff',
  },

  cardBtn: {
    width: 20,
    height: 20,
    borderRadius: 8, 
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  cardBtnText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    maxWidth: '90%',
  },
});