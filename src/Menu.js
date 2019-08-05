import React from 'react'
import { Dimensions } from 'react-native'
import {createDrawerNavigator} from 'react-navigation'

import Home from './components/Home'
import Form from './components/Form'
import Historico from './components/Historico'
import Grafico from './components/Grafico'

const width = Dimensions.get('window').width


export default createDrawerNavigator({
    Home: {
        screen: () => <Home />
    },
    Form: {
        screen: () => <Form />,
        navigationOptions: { title: 'Formulário'}
    },
    Historico: {
        screen: () => <Historico />,
        navigationOptions: { title: 'Histórico' }
    },
    Grafico: {
        screen: () => <Grafico />,
        navigationOptions: { title: 'Gráfico' }
    }
}, {drawerWidth: 300})