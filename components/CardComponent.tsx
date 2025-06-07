import React, { useState, useEffect } from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Picker
} from 'react-native';

export default function CardComponent({ 
  idx, 
  color: col, 
  number: num, 
  probability, 
  update, 
  options,
  resetCard 
}) {
    const [canUpdate, setCanUpdate] = useState(false);
    const [color, setColor] = useState(col || '');
    const [number, setNumber] = useState(num || '');
    const [editColor, setEditColor] = useState(col || '');
    const [editNumber, setEditNumber] = useState(num || '');
    
    useEffect(() => {
        setColor(col || '');
        setNumber(num || '');
        setEditColor(col || '');
        setEditNumber(num || '');
    }, [col, num]);

    function runUpdate(idx, new_color, new_number) {
        update(idx, new_color || "", new_number || "");  
        setColor(new_color || '');
        setNumber(new_number || '');
        setCanUpdate(false);
    }

    function cancelUpdate() {
        setEditColor(color || ''); 
        setEditNumber(number || '');
        setCanUpdate(false);
    }

    function handleReset() {
        resetCard(idx); 
    }

    return (
        <SafeAreaView style={styles.cardContainer}>
            <Text style={styles.cardTitle}>Card {idx + 1}</Text>
            <View style={styles.cardContent}>
                {!canUpdate ? (
                    <>
                        <View style={styles.cardInfo}> 
                            <Text style={styles.cardText}>
                                Likely Color: {color || 'Not determined'}
                            </Text>
                            <Text style={styles.cardText}>
                                Likely Number: {number || 'Not determined'}
                            </Text>
                            {(color || number) && probability !== undefined && (
                                <Text style={styles.cardText}>
                                    Probability: {typeof probability === 'number' ? probability.toFixed(2) + '%' : 'N/A'}
                                </Text>
                            )}
                        </View>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity 
                                style={[styles.actionButton, styles.editButton]}
                                onPress={() => setCanUpdate(true)}
                            >
                                <Text style={styles.buttonText}>Edit Card</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.actionButton, styles.resetButton]}
                                onPress={handleReset}
                            >
                                <Text style={styles.buttonText}>Reset Card</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <>
                        <View style={styles.editSection}>
                            <View style={styles.pickerContainer}>
                                <Text style={styles.pickerLabel}>Color</Text>
                                <Picker
                                    selectedValue={editColor}
                                    style={styles.picker}
                                    onValueChange={setEditColor}>
                                    <Picker.Item label="Select color" value="" />
                                    {options?.color?.map((col) => (
                                        <Picker.Item key={col} label={col} value={col} />
                                    ))}
                                </Picker>
                            </View>

                            <View style={styles.pickerContainer}>
                                <Text style={styles.pickerLabel}>Number</Text>
                                <Picker
                                    selectedValue={editNumber}
                                    style={styles.picker}
                                    onValueChange={setEditNumber}>
                                    <Picker.Item label="Select number" value="" />
                                    {options?.number?.map((num) => (
                                        <Picker.Item key={num} label={String(num)} value={String(num)} />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity 
                                style={[styles.actionButton, styles.cancelButton]}
                                onPress={cancelUpdate}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.actionButton, styles.saveButton]}
                                onPress={() => runUpdate(idx, editColor, editNumber)}
                            >
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        margin: 10,
        width: 250,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    cardContent: {
        marginTop: 5,
    },
    cardInfo: {
        marginBottom: 15,
    },
    cardText: {
        fontSize: 16,
        marginBottom: 5,
        color: '#555',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    actionButton: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        minWidth: 100,
    },
    editButton: {
        backgroundColor: '#4a90e2',
    },
    resetButton: {
        backgroundColor: '#ffaaaa',
        marginLeft: 10,
    },
    editSection: {
        marginBottom: 15,
    },
    pickerContainer: {
        marginBottom: 15,
    },
    pickerLabel: {
        fontSize: 16,
        marginBottom: 5,
        color: '#555',
    },
    picker: {
        height: 50,
        width: '100%',
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: '#e74c3c',
    },
    saveButton: {
        backgroundColor: '#2ecc71',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});