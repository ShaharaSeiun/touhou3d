import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ControlsContainer } from './components/ControlsContainer';
import { GlobalsContainer } from './components/GlobalsContainer';
import { LSContainer } from './components/LSContainer';
import { Game } from './pages/Game';
import { Menu } from './pages/Menu';

function App() {
    return (
        <GlobalsContainer>
            <ControlsContainer outsideOfRenderer>
                <LSContainer>
                    <Router>
                        <Switch>
                            <Route path="/game/">
                                <Game />
                            </Route>
                            <Route path="/">
                                <Menu />
                            </Route>
                        </Switch>
                    </Router>
                </LSContainer>
            </ControlsContainer>
        </GlobalsContainer>
    );
}

export default App;
