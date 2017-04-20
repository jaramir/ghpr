import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import Ghpr from './ghpr'

const render = (Component) => {
    ReactDOM.render(
        <AppContainer>
            <Component/>
        </AppContainer>,
        document.getElementById('root')
    )
}

render(Ghpr);

if (module.hot) {
    module.hot.accept('./ghpr', () => {
        render(Ghpr);
    });
}
