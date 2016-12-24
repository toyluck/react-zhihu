import React, { Component } from 'react';
import HeaderBar from './components/HeaderBar'
import ListView from './components/ListView'


class App extends Component {
    render() {
        return (
            <div>
                <HeaderBar></HeaderBar>
                <ListView></ListView>
            </div>
        );
    }
}

export default App;