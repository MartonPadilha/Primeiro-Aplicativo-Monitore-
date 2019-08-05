import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, StatusBar } from 'react-native'

export default class Home extends Component {
    render(){
        return(
            <View style={styles.container}>
                <StatusBar backgroundColor="#fff" barStyle="light-content" />
                <Text style={styles.header}>Monitore</Text>
                <Image style={{width: 200, height: 150, marginTop: 30, marginBottom: 30}} source={require('../../img/logo.png')}/>
                <Text style={styles.text}>O Monitore é um aplicativo para controle de gastos, desenvolvido especialmente para cuidar das suas finanças e consequentemente te ajudar a economizar dinheiro.
                 O nosso gerenciador financeiro é destinado para você que busca por praticidade na hora de organizar seus gastos diários e gastos mensais.</Text>
                <Text style={styles.text1}>Desenvolvido por: marton.padilha@aluno.iffar.edu.br</Text>
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
    text: {
        color: '#333',
        fontSize: 20,
        marginLeft: 15,
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    text1: {
        color: '#333',
        fontSize: 15,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 120,
        textAlign: 'center'
    }
})