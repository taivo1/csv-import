import React, {Component} from 'react';
import FileUpload from './FileUpload';
import Search from './Search';

class App extends Component {
    render() {
        return (
            <div>
                <h1>Pipedrive FS Task !!!</h1>
                <FileUpload server={ '//' + process.env.REACT_APP_SERVER_HOST + ':' + process.env.REACT_APP_SERVER_PORT + '/import' }/>
                <Search/>
            </div>
        );
    }
}

export default App;