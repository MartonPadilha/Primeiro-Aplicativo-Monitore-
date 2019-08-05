import React, { Component } from 'react';
import { View, Text, Dimensions, Picker, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import firebase from 'react-native-firebase'

let log = true

const screenWidth = Dimensions.get('window').width

import {
    PieChart,
} from 'react-native-chart-kit'

export default class Grafico extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            data: [
                { name: '', population: 100, color: 'rgba(131, 167, 234, 1)', legendFontColor: 'white', legendFontSize: 15 }
            ],
            resultados: [{
                categoria: '',
                descricao: '',
                valor: '',
                data: ''
            }],
            valorTotal: "",
            mes: null
        };
    }

    gera_cor = () => {
        let hexadecimais = '0123456789ABCDEF';
        let cor = '#';

        for (var i = 0; i < 4; i++) {

            cor += hexadecimais[Math.floor(Math.random() * 16)];
        }
        return `${cor}99`;
    }


    consultaFiltrada = () => {

        let resultados = []
        let t = this
        let dt = new Date()
        let primeiroDia = null, ultimoDia = null
        if (this.state.mes !== null) {
            primeiroDia = new Date(dt.getFullYear(), this.state.mes, 1).getTime()
            ultimoDia = new Date(dt.getFullYear(), parseInt(this.state.mes) + 1, 0, 23, 59, 59).getTime();
        } else {
            primeiroDia = new Date(dt.getFullYear(), dt.getMonth(), 1).getTime()
            ultimoDia = new Date(dt.getFullYear(), dt.getMonth() + 1, 0, 23, 59, 59).getTime();
        }
        console.log(this.state.mes)
        console.log(new Date(primeiroDia));
        console.log(new Date(ultimoDia));

        this.setState({ refreshing: true });
        firebase.firestore().collection("gastos").where("data", ">=", primeiroDia).where("data", "<=", ultimoDia)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    resultados.push({ id: doc.id, ...doc.data() })

                });

                resultados.forEach(function (dado) {
                    dado['name'] = dado['categoria'];
                    dado['population'] = JSON.parse(dado['valor'])
                    dado['color'] = t.gera_cor(),
                        dado['legendFontColor'] = '#333',
                        dado['legendFontSize'] = 17
                });
                resultados_agrupados = []
                resultados.map(i => {
                    const categoriasExistentes = resultados_agrupados.map(i => i.name)
                    if (categoriasExistentes.indexOf(i.name) != -1) { // é sinal que já existe essa categoria no array

                        // primeiro achar a posicao em que se encontra o item com a categoria que eu estou procurando
                        let posElemento = -1
                        resultados_agrupados.map((item, index) => {
                            if (item.name == i.name) {
                                posElemento = index
                            }
                        })
                        resultados_agrupados[posElemento]['population'] += i.population
                    } else {
                        resultados_agrupados.push(i)
                    }
                })

                t.setState({
                    data: resultados_agrupados
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
    }

    componentDidMount() {
        this.consultaFiltrada();
    }

    render() {
        const chartConfig = {
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 1, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
                borderRadius: 16,
            }
        }
        return (
            <View style={styles.container}>
                <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={() => this.consultaFiltrada()}
                />
                <Text style={styles.header}>Gráficos</Text>
                <View>
                    <Picker
                        style={styles.input}
                        selectedValue={this.state.mes}
                        onValueChange={(mes) =>
                            this.setState({ mes: mes })
                        }>
                        <Picker.Item label="Selecione o mês" value="" />
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

                    <TouchableOpacity onPress={this.consultaFiltrada} style={styles.button}>
                        <Text style={styles.buttonText}>Buscar</Text>
                    </TouchableOpacity>
                </View>

                {this.state.data.length == 0 ? <Text style={styles.msgAlerta}>Nenhum gasto cadastrado no mês selecionado!</Text> : null}

                <View style={{ marginTop: 70 }}>
                    <PieChart
                        data={this.state.data}
                        width={screenWidth}
                        height={260}
                        chartConfig={chartConfig}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="10"
                        absolute
                    />
                </View>
                <View style={styles.total}>
                    <Text style={{ fontSize: 19, textAlign: 'center', color: '#eee' }}>Total de Gastos: R${this.state.valorTotal}</Text></View>
            </View>
        );
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
    total: {
        backgroundColor: 'rgba(255, 0, 0, 0.9)',
        width: Dimensions.get('window').width,
        height: 31,
        marginTop: 227
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
