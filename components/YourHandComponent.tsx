import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView } from 'react-native';
import CardComponent from './CardComponent';

const createKnowledge = () => ({ value: '', fixed: false });

export default function YourHandComponent({ deck, options, cards_per_player }) {
    
    const initializeCandidates = () => {
        return Array(cards_per_player).fill().map(() => ({
            likelyColor: '',
            likelyNumber: '',
            probability: 0
        }));
    };

    const initializeKnowledge = () => {
        return Array(cards_per_player).fill().map(() => ({
            color: createKnowledge(),
            number: createKnowledge()
        }));
    };

    
    const [candidates, setCandidates] = useState(initializeCandidates());
    const [knowledge, setKnowledge] = useState(initializeKnowledge());
    const [card_matrix, setMat] = useState([]);
    
    
    const mat_sum = useMemo(() => 
        card_matrix.flat().reduce((sum, count) => sum + count, 0), 
        [card_matrix]
    );

    
    useEffect(() => {
        setCandidates(initializeCandidates());
        setKnowledge(initializeKnowledge());
    }, [cards_per_player]);

    
    const loadMatrixWithSum = (use_deck, opts) => {
        const matrix = [];
        let sum = 0;
        
        opts.color.forEach(color => {
            const row = opts.number.map(number => {
                const count = (use_deck[color] || [])
                    .filter(n => parseInt(n) === parseInt(number)).length;
                sum += count;
                return count;
            });
            matrix.push(row);
        });
        
        return [matrix, sum];
    };

    const isEmpty = (obj) => {
        return !obj || Object.values(obj).flat().length === 0;
    };

    const add_card_knowledge = (idx, color, number, colf, numf) => {
        let knowledge_piece = knowledge[idx];
        let new_knowledge = [...knowledge];
        knowledge_piece.color = {
            value: color,
            fixed: colf
        }
        knowledge_piece.number = {
            value: number.toString(),
            fixed: numf
        };
        new_knowledge[idx] = knowledge_piece;

        setKnowledge(new_knowledge);
    };

    const update_option = (idx, color, number) => {
        console.log("Updating card knowledge for idx:", idx);
        console.log("Color:", color, "Number:", number);
        console.log("Before update:", knowledge[idx]);
  
        add_card_knowledge(idx, color, number, true, true);
        console.log("After update:", knowledge[idx]);
        const newCandidates = [...candidates];
        newCandidates[idx] = {
            likelyColor: color,
            likelyNumber: number,
            probability: 100
        };
        setCandidates(newCandidates);
        
        
        recalculateAllCandidates();
    };

    function resetCard(idx){
        let newKnowledge = [...knowledge];
        newKnowledge[idx] = {
            color: createKnowledge(),
            number: createKnowledge()
        };
        setKnowledge(newKnowledge);
        

        const newCandidates = [...candidates];
        newCandidates[idx] = {
            likelyColor: '?',
            likelyNumber: '?',
            probability: 0
        };
        setCandidates(newCandidates);
        
        
        recalculateAllCandidates();
    };

    const resetAllCards = () => {
        setCandidates(initializeCandidates());
        setKnowledge(initializeKnowledge());
    };

    const choose_best_color = (matrix, number) => {
        const numIndex = parseInt(number) - 1;
        if (numIndex < 0 || numIndex >= options.number.length) return '';
        
        let bestColorIndex = 0;
        let maxProb = 0;
        
        for (let colorIndex = 0; colorIndex < matrix.length; colorIndex++) {
            const prob = matrix[colorIndex][numIndex] / mat_sum;
            if (prob > maxProb) {
                maxProb = prob;
                bestColorIndex = colorIndex;
            }
        }
        
        return options.color[bestColorIndex] || '';
    };

    const choose_best_number = (matrix, color) => {
        const colorIndex = options.color.indexOf(color);
        if (colorIndex < 0 || colorIndex >= matrix.length) return { number: '', probability: 0 };
        
        const numbersInColor = matrix[colorIndex];
        const maxNumIdx = numbersInColor.indexOf(Math.max(...numbersInColor));
        
        return {
            number: options.number[maxNumIdx] || '',
            probability: numbersInColor[maxNumIdx] / mat_sum
        };
    };

    const calculateCandidate = (idx, matrix) => {
        const knowledge_piece = knowledge[idx];
        let new_item = {
            likelyColor: '',
            likelyNumber: '',
            probability: 0
        };

        
        if (knowledge_piece.color.fixed) {
            new_item.likelyColor = knowledge_piece.color.value;
        }
        if (knowledge_piece.number.fixed) {
            new_item.likelyNumber = knowledge_piece.number.value;
        }

        
        if ((!knowledge_piece.color.fixed || !knowledge_piece.number.fixed) && mat_sum > 1) {
            const colorProbs = options.color.map((color, colorIdx) => ({
                color,
                prob: matrix[colorIdx].reduce((a, b) => a + b, 0) / mat_sum
            }));

            const numberProbs = options.number.map((number, numIdx) => ({
                number,
                prob: matrix.reduce((sum, row) => sum + row[numIdx], 0) / mat_sum
            }));

            const maxColor = colorProbs.reduce((max, curr) => 
                curr.prob > max.prob ? curr : max, colorProbs[0]);
            const maxNumber = numberProbs.reduce((max, curr) => 
                curr.prob > max.prob ? curr : max, numberProbs[0]);

            if (maxColor.prob > maxNumber.prob) {
                if (!knowledge_piece.color.fixed) new_item.likelyColor = maxColor.color;
                if (!knowledge_piece.number.fixed) {
                    const numObj = choose_best_number(matrix, new_item.likelyColor);
                    new_item.likelyNumber = numObj.number;
                }
            } else {
                if (!knowledge_piece.number.fixed) new_item.likelyNumber = maxNumber.number;
                if (!knowledge_piece.color.fixed) {
                    new_item.likelyColor = choose_best_color(matrix, new_item.likelyNumber);
                }
            }

            const colorIdx = options.color.indexOf(new_item.likelyColor);
            const numIdx = options.number.indexOf(new_item.likelyNumber);
            if (colorIdx >= 0 && numIdx >= 0) {
                new_item.probability = Math.round((matrix[colorIdx][numIdx] / mat_sum) * 100);
            }
        }

        
        if (knowledge_piece.color.fixed && knowledge_piece.number.fixed) {
            new_item.probability = 100;
        }

        return new_item;
    };

    const recalculateAllCandidates = () => {
        if (isEmpty(deck)) return;

        const [newMatrix] = loadMatrixWithSum(deck, options);
        const workingMatrix = newMatrix.map(row => [...row]); 
        
        
        knowledge.forEach((k, i) => {
            if (k.color.fixed && k.number.fixed) {
                const x = parseInt(k.number.value) - 1;
                const y = options.color.indexOf(k.color.value);
                if (y >= 0 && x >= 0) {
                    workingMatrix[y][x] = Math.max(0, workingMatrix[y][x] - 1);
                }
            }
        });

        
        const indexes = Array(cards_per_player).fill().map((_, i) => i);
        const predictionMatrix = workingMatrix.map(row => [...row]);
        
        indexes.forEach(i => {
            const knowledge_piece = knowledge[i];
            
            
            if (knowledge_piece.color.fixed && knowledge_piece.number.fixed) {
                return;
            }
            
            
            const tempMatrix = predictionMatrix.map(row => [...row]);
            
            
            if (candidates[i].likelyColor && candidates[i].likelyNumber) {
                const x = parseInt(candidates[i].likelyNumber) - 1;
                const y = options.color.indexOf(candidates[i].likelyColor);
                if (y >= 0 && x >= 0) {
                    tempMatrix[y][x] = Math.max(0, tempMatrix[y][x] - 1);
                }
            }
            
            
            const new_item = calculateCandidate(i, tempMatrix);
            
            
            if (new_item.likelyColor && new_item.likelyNumber) {
                const x = parseInt(new_item.likelyNumber) - 1;
                const y = options.color.indexOf(new_item.likelyColor);
                if (y >= 0 && x >= 0) {
                    predictionMatrix[y][x] = Math.max(0, predictionMatrix[y][x] - 1);
                }
            }
            
            
            setCandidates(prev => {
                const newCandidates = [...prev];
                newCandidates[i] = new_item;
                return newCandidates;
            });
        });

        setMat(newMatrix); 
    };

    
    useEffect(() => {
        if (isEmpty(deck)) {
            setMat([]);
            resetAllCards();
            return;
        }

        const [newMatrix] = loadMatrixWithSum(deck, options);
        setMat(newMatrix);
        recalculateAllCandidates();
    }, [deck, options, knowledge, cards_per_player]);

    return (
        <SafeAreaView>
            <View>
                <Text style={styles.text}>Your Hand</Text>
                <View style={styles.handContainer}>
                    <ScrollView 
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {candidates.map((card, idx) => (
                            <CardComponent 
                                key={idx}
                                idx={idx}
                                color={card.likelyColor}
                                number={card.likelyNumber}
                                probability={card.probability}
                                update={update_option}
                                options={options}
                                resetCard={resetCard}
                            />
                        ))}
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    },
    handContainer: {
        flexDirection: 'row',
        marginBottom: 20
    },
    scrollContent: {
        paddingHorizontal: 10
    }
});