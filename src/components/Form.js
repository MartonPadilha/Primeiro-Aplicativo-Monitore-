import React, { Component } from 'react';
import { View, Text, TextInput, Picker, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native'
import firebase from 'react-native-firebase'

export default class Form extends Component {

    getData = () => {
        let data = new Date()
        let dataAtual = data.getTime()
        return dataAtual
    }



    state = {
        data: this.getData(),
        categoria: '',
        descricao: '',
        valor: ''
    }

    _salvar = () => {
        let t = this

        Alert.alert(
            'Salvar',
            'Você tem certeza que deseja salvar este gasto?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'OK', onPress: () => {
                        firebase.firestore().collection("gastos").add(this.state).then(function (docRef) {
                            alert("Gasto salvo com sucesso!")
                        })
                            .catch(function (error) {
                                console.error("Error adding document: ", error);
                            });
                        t.setState({
                            categoria: '',
                            valor: '',
                            descricao: ''
                        })
                    }
                },
            ],
            { cancelable: false },
        );
    }


    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Insira seu gasto</Text>
                <View>
                <Picker
                    style={styles.input}
                    selectedValue={this.state.categoria}
                    onValueChange={(categoria) =>
                        this.setState({ categoria: categoria })
                    }>
                    <Picker.Item label="Selecione uma categoria..." value="" style={styles.input} />
                    <Picker.Item label="Alimentação" value="Alimentação" />
                    <Picker.Item label="Aluguel da Casa" value="Aluguel da Casa" />
                    <Picker.Item label="Combustível" value="Combustível" />
                    <Picker.Item label="Conta de Água" value="Água" />
                    <Picker.Item label="Conta de Luz" value="Luz" />
                    <Picker.Item label="Internet" value="Internet" />
                    <Picker.Item label="Lazer" value="Lazer" />
                    <Picker.Item label="Manutenção do Veículo" value="Manutenção do Veículo" />
                    <Picker.Item label="Outros" value="Outros" />
                    <Picker.Item label="Vestuário" value="Vestuário" />
                    <Picker.Item label="Turismo" value="Turismo" />
                    <Picker.Item label="Transporte Público" value="Transporte Público" />
                </Picker>
                </View>

                <View>
                <TextInput
                    style={styles.input}
                    placeholder="Descrição..."
                    placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                    underlineColorAndroid='transparent'
                    value={this.state.descricao}
                    onChangeText={descricao => this.setState({ descricao })}
                ></TextInput>
                </View>

                <View>
                <TextInput
                    style={styles.input}
                    placeholder="Valor..."
                    placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                    underlineColorAndroid='transparent'
                    keyboardType='numeric'
                    value={this.state.valor}
                    onChangeText={valor => this.setState({ valor })}
                ></TextInput>
                </View>

                <TouchableOpacity style={styles.button} onPress={this._salvar}>
                    <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>
            </View>
        )
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        position: 'absolute'
    },
    header: {
        height: 44,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        color: 'black',
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: 24,
        marginBottom: 170
    },
    button: {
        width: Dimensions.get('window').width - 10,
        height: 40,
        marginHorizontal: 5,
        backgroundColor: '#00579e',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    buttonText: {
        color: '#eee',
        fontWeight: '100',
        fontSize: 16
    },
    input: {
        width: Dimensions.get('window').width - 10,
        height: 45,
        borderRadius: 5,
        fontSize: 16,
        backgroundColor: 'rgba(0, 87, 158, 0.8)',
        color: 'rgba(255, 255, 255, 1)',
        marginHorizontal: 5,
        marginBottom: 5,
    },
})