import React, { Component } from 'react';
import { Dimensions, Modal, StyleSheet, Alert, View, Text, TextInput, TouchableOpacity, RefreshControl, TouchableHighlight, Picker, ScrollView, FlatList, Button } from 'react-native'
import firebase from 'react-native-firebase'
import DatePicker from 'react-native-datepicker'

export default class Historico extends Component {

    constructor() {
        super()
        this.state = {
            id: '',
            refreshing: false,
            dataInicial: '',
            dataFinal: '',
            categoria: '',
            descricao: '',
            valor: '',
            mes: null,
            mesNome: null,
            valorTotal: 0,
            modalVisible: false,
            editando: {
                categoria: '',
                descricao: '',
                valor: '',
                id: ''
            },
            resultados: [{
                categoria: null,
                descricao: null,
                valor: null,
                data: null
            }]
        }
    }

    componentDidMount() {
        this._getRealTimeData();
    }

    consultaFiltrada = () => {

        let resultados = []
        let t = this
        let dt = new Date()
        let primeiroDia = null, ultimoDia = null
        primeiroDia = new Date(dt.getFullYear(), this.state.mes, 1).getTime()
        ultimoDia = new Date(dt.getFullYear(), parseInt(this.state.mes) + 1, 0, 23, 59, 59).getTime();

        
        // this.setState({ refreshing: true });
        firebase.firestore().collection("gastos").where("data", ">=", primeiroDia).where("data", "<=", ultimoDia)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    resultados.push({ id: doc.id, ...doc.data() })
                });
                t.setState({
                    resultados
                })

                let valorTotal = 0
                resultados.map(i => {
                    valorTotal += parseFloat(i.valor)
                })
                t.setState({
                    valorTotal
                })
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
        console.log(resultados);

    }

    _getRealTimeData = () => {
        let resultados = []
        let t = this
        let dt = new Date()
        let primeiroDia = null, ultimoDia = null
        primeiroDia = new Date(dt.getFullYear(), dt.getMonth(), 1).getTime()
        ultimoDia = new Date(dt.getFullYear(), dt.getMonth() + 1, 0, 23, 59, 59).getTime();

        this.setState({ refreshing: true });
        firebase.firestore().collection("gastos").where("data", ">=", primeiroDia).where("data", "<=", ultimoDia)
            .get().then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    // console.log(doc.id, " => ", doc.data());
                    resultados.push({ id: doc.id, ...doc.data() })
                });
                t.setState({
                    resultados
                })

                let valorTotal = 0
                resultados.map(i => {
                    valorTotal += parseFloat(i.valor)
                })
                t.setState({
                    valorTotal,
                    refreshing: false
                })
            });

    }

    // setModalVisible(visible, id, categoria, descricao, valor) {
    //     this.setState({ modalVisible: visible, id, categoria, descricao, valor});
    // }

    updateData = () => {
        let t = this
        let id = this.state.editando.id
        delete this.state.editando.id
        
        this.setState({ refreshing: true });
        firebase.firestore().collection("gastos").doc(id).update(this.state.editando)
            .then(function () {
               alert("Gasto editado com sucesso!");
            })
            .catch(function (error) {
                console.error("Error writing document: ", error);
            });
            t.setState({
                refreshing: false
            })
    }

    deleteData = (id) => {
        Alert.alert(
            'Deletar',
            'Você tem certeza que deseja deletar esse gasto?',
            [
                {
                    text: 'Cancelar',
                    onPress: () => console.log("Você cancelou"),
                    style: 'cancel',
                },
                {
                    text: 'Sim', onPress: () => {
                        firebase.firestore().collection("gastos").doc(id).delete().then(() => {
                            console.log('Gasto deletado com sucesso!');
                            this._getRealTimeData();
                        }).catch(function (error) {
                            console.error("Error removing document: ", error);
                        })
                    }
                },
            ],
            { cancelable: false },
        );

        ;
    }

    converteDate = (timestemp) => {
        let date = new Date(timestemp)
        return `${date.getDate()}/${parseInt(date.getMonth()) + 1}/${date.getFullYear()}`
    }

    verificaMes = () => { 
        switch(this.state.mes) {
            case 0:
              return this.setState({mesNome: "Janeiro"});
            default:
              return 'foo';
          }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Histórico</Text>

                <Picker
                    style={styles.input}
                    selectedValue={this.state.mes}
                    onValueChange={(mes) =>
                        this.setState({ mes: mes })
                    }>
                    <Picker.Item label="Selecione o mês" />
                    <Picker.Item label="Janeiro" value="0" />
                    <Picker.Item label="Fevereiro" value="1" />
                    <Picker.Item label="Março" value="2" />
                    <Picker.Item label="Abril" value="3" />
                    <Picker.Item label="Maio" value="4" />
                    <Picker.Item label="Junho" value="5" />
                    <Picker.Item label="Julho" value="6" />
                    <Picker.Item label="Agosto" value="7" />
                    <Picker.Item label="Setembro" value="8" />
                    <Picker.Item label="Outubro" value="9" />
                    <Picker.Item label="Novembro" value="10" />
                    <Picker.Item label="Dezembro" value="11" />
                </Picker>

                <TouchableOpacity style={styles.button} onPress={this.consultaFiltrada}>
                    <Text style={styles.buttonText}>Buscar</Text>
                </TouchableOpacity>

                <ScrollView style={{ height: 700 }} refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={() => this._getRealTimeData()}
                    />
                }>
                    <View style={styles.conteudo}>
                        {this.state.resultados.length == 0 ? <Text style={styles.msgAlerta}>Nenhum gasto cadastrado no mês selecionado!</Text> : null}
                        <FlatList
                            // data={[{key: 'a'}, {key: 'b'}]}
                            // renderItem={({item}) => <Text>{item.key}</Text>}
                            data={this.state.resultados}
                            renderItem={({ item }) => {
                                return (
                                    <View style={styles.card}>
                                        <Text style={{ display: 'none' }}>chave: {item.id}</Text>
                                        <Text style={styles.categoria}>{item.categoria}</Text>
                                        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}><Text style={styles.descricao}>{item.descricao}</Text>
                                            <Text style={styles.valor}>R${item.valor}</Text>
                                        </View>
                                        <Text style={styles.data}>{this.converteDate(item.data)}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            <TouchableOpacity style={styles.btn} onPress={() => { this.setState({ modalVisible: true, editando: item }) }}>
                                                <Text style={styles.buttonText}>Editar</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.btn} color='#985246' onPress={() => { this.deleteData(item.id); }}>
                                                <Text style={styles.buttonText}>Excluir</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            }}
                        />
                    </View>

                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                        }}>
                        <View style={styles.containerModal}>
                        <Text style={styles.headerModal}>Editar gasto</Text>
                            <View>
                                <Picker
                                    style={styles.input}
                                    selectedValue={this.state.editando.categoria}
                                    onChangeText={value => {
                                        let editando = { ...this.state.editando }
                                        editando.categoria = value
                                        this.setState({ editando })
                                    }}>
                                    <Picker.Item label="Selecione uma categoria..." value="" style={{ backgroundColor: 'blue' }} />
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

                                <TextInput
                                    style={styles.input}
                                    placeholder="Digite a descrição..."
                                    value={this.state.editando.descricao}
                                    onChangeText={value => {
                                        let editando = { ...this.state.editando }
                                        editando.descricao = value
                                        this.setState({ editando })
                                    }}
                                ></TextInput>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Digite o valor..."
                                    keyboardType='numeric'
                                    value={this.state.editando.valor}
                                    onChangeText={value => {
                                        let editando = { ...this.state.editando }
                                        editando.valor = value
                                        this.setState({ editando })
                                    }}
                                ></TextInput>

                                <TouchableOpacity style={styles.button} onPress={() => { this.updateData() }}>
                                    <Text style={styles.buttonText}>Salvar</Text>
                                </TouchableOpacity>

                                <TouchableHighlight style={styles.button}
                                    onPress={() => {
                                        this.setState({ modalVisible: false })
                                    }}>
                                    <Text style={styles.buttonText}>Voltar</Text>
                                </TouchableHighlight>

                            </View>
                        </View>
                    </Modal>
                </ScrollView>
                <View style={styles.total}>
                    <Text style={{fontSize: 19, textAlign: 'center', color: '#eee'}}>Total de Gastos: R${this.state.valorTotal}</Text></View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        // justifyContent: 'center',
        flexDirection: 'column',
    },
    containerModal: {
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
        marginBottom: 4
    },
    headerModal: {
        height: 44,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        color: 'black',
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: 24,
        marginBottom: 100
    },
    button: {
        width: Dimensions.get('window').width - 10,
        height: 40,
        marginHorizontal: 5,
        marginTop: 5,
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
    card: {
        borderBottomWidth: 1,
        color: '#656563',
        fontSize: 24,
        color: 'black',
        width: Dimensions.get('window').width - 10,
        paddingHorizontal: 10
    },
    btn: {
        width: Dimensions.get('window').width / 3 + 2,
        height: 30,
        marginHorizontal: 6,
        backgroundColor: '#00579e',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 4,
        marginTop: 4
    },
    valor: {
        fontSize: 18,
        color: '#333',
        textAlign: 'right',
        fontWeight: '700',
    },
    data: {
        fontSize: 15,
        color: '#333',
        fontWeight: '700',
    },
    categoria: {
        fontSize: 19,
        textAlign: 'center',
        color: '#333',
        fontWeight: '800',
    },
    descricao: {
        fontSize: 15,
        color: '#333',
        fontWeight: '700',
    },
    total: {
        backgroundColor: 'rgba(255, 0, 0, 0.9)',
        width: Dimensions.get('window').width,
        height: 31
    },
    msgAlerta: {
        paddingHorizontal: 15,
        borderColor: '#eee',
        flexDirection: 'column',
        textAlign: 'center',
        fontSize: 30,
        color: '#333',
        justifyContent: "center",
        marginTop: 200
    }

})