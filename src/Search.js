import React, {Component} from 'react';
import AsyncSelect from 'react-select/lib/Async';
import Item from './Item';


class Search extends Component {

    constructor(props) {
        super(props);
        this.state = { inputValue: '' , selectedItem: null };

        this.handleChange = this.handleChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    loadOptions (inputValue, callback) {
        let url = '//' + process.env.REACT_APP_SERVER_HOST + ':' + process.env.REACT_APP_SERVER_PORT + '/search';
        fetch(url, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({query: inputValue})
        })
        .then(response => response.json())
        .then(function (data) {
            console.log('Request succeeded with JSON response', data);
            callback(data.map((u) => {return {value: u, label: u.name}; }));
        })
        .catch(function (error) {
            console.log('Request failed', error);
        });
    }

    handleChange (newValue, actionMeta) {
        this.setState({selectedItem: newValue.value});
    }

    handleInputChange (newValue) {
        const inputValue = newValue.replace(/\W/g, '');
        this.setState({inputValue});
        return inputValue;
    };

    render() {
        return (
            <div>
                <AsyncSelect
                    cacheOptions
                    loadOptions={this.loadOptions}
                    defaultOptions
                    onInputChange={this.handleInputChange}
                    onChange={this.handleChange}
                />
                <Item {...this.state.selectedItem}/>
            </div>
        );
    }
}

export default Search;