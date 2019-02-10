import React, {Component} from 'react';
import { components } from 'react-select';
import AsyncSelect from 'react-select/lib/Async';
import Item from './Item';



const MenuList = (props) => {
    return (
        <components.MenuList {...props}>
            {React.Children.map(props.children, (child, i) => {
                return React.cloneElement(child, {
                    resultId: 'result-' + (i + 1),
                });
            })}
        </components.MenuList>
    );
};

const Option = (props) => {
    return (
        <div id={props.resultId}>
            <components.Option {...props} />
        </div>
    );
};


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
        // const inputValue = newValue.replace(/\W/g, '');
        this.setState({newValue});
        return newValue;
    }

    render() {
        return (
            <div className="">
                <AsyncSelect
                    components={{ MenuList, Option }}
                    cacheOptions
                    loadOptions={this.loadOptions}
                    defaultOptions
                    onInputChange={this.handleInputChange}
                    onChange={this.handleChange}
                    inputId="searchField"
                />
                <Item {...this.state.selectedItem}/>
            </div>
        );
    }
}

export default Search;