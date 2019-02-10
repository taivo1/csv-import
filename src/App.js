import React, {Component} from 'react';
import FilepondUpload from './FilepondUpload';
import CustomFileUpload from './CustomFileUpload';
import Search from './Search';

class App extends Component {
    render() {
        return (
            <div className="container p2">
                <h1 className="center">CSV Import</h1>
                {/*<FilepondUpload server={ '//' + process.env.REACT_APP_SERVER_HOST + ':' + process.env.REACT_APP_SERVER_PORT + '/import' }/>*/}
                <CustomFileUpload server={ '//' + process.env.REACT_APP_SERVER_HOST + ':' + process.env.REACT_APP_SERVER_PORT + '/import' } />
                <Search />
            </div>
        );
    }
}

export default App;