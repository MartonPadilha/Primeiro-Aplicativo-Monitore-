import React from 'react'
import {Image, StyleSheet} from 'react-native'
import {createBottomTabNavigator} from 'react-navigation'

import Form from './components/Form'
import Grafico from './components/Grafico'
import Historico from './components/Historico'
import Home from './components/Home'

const MenuRoutes = {
    Home: {
        name: 'Home',
        screen: Home,
        navigationOptions: {
            title: 'Home',
            tabBarIcon: ({ focused,tintColor }) => (
                <Image
                source={require('../img/checked.png')}
                style={styles.img}
              />
            )
        }
    },
    Form: {
        name: 'Adicionar Gasto',
        screen: Form,
        navigationOptions: {
            title: 'Adicionar Gasto',
            tabBarIcon: ({ focused,tintColor }) => (
                <Image
                source={require('../img/checklist.png')}
                style={styles.img}
              />
            )
        }
    },
    Historico: {
        name: 'Histórico',
        screen: Historico,
        navigationOptions: {
            title: 'Histórico',
            tabBarIcon: ({ focused,tintColor }) => (
                <Image
                source={require('../img/change.png')}
                style={styles.img}
              />
            )
        }
    },
    Grafico: {
        name: 'Gráficos',
        screen: Grafico,
        navigationOptions: {
            title: 'Gráficos',
            tabBarIcon: ({ tintColor }) => (
                <Image
                source={require('../img/pie-chart.png')}
                style={styles.img}
              />
            )
        }
    },
}

const styles = StyleSheet.create({
    img: {
        width: 40,
        height: 40
    }
})

const MenuConfig = {
    initialRouteName: 'Home',
    activeTintColor: 'orange',
    tabBarOptions: {
        showLabel: false,
    }
}

const MenuNavigator = createBottomTabNavigator(MenuRoutes, MenuConfig)
export default MenuNavigator