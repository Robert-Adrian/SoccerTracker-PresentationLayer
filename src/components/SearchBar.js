import React from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import '../styles/SearchBar.css';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }
    componentWillUnmount() {
        
    }


    render() {
        return (
            <div className="Search">
                <InputText type="text" onInput={e => this.props.setSearchQuery(e.target.value)} placeholder="Cauta un jucator ..."/>
                <Button ><i className="fas fa-search"></i></Button>
            </div>
        );
    }

}

export default SearchBar;