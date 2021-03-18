import React from 'react';

class ColumnHeader extends React.Component {

    constructor(props) {
        super(props);
    }

    setViewState = (state, callback) => {

        this.setState({
            ...state
        }, callback);
    };

    render() {

        const {lobType, checkExpandStatus} = this.props;
        return (
            <>
                <div key={lobType.tagId}
                     className={`modal-table-column expandable-column ${checkExpandStatus(lobType.tagId) ? 'open' : ''}`}
                     style={checkExpandStatus(lobType.tagId) ? {minWidth: `${lobType.subLobs.length * 200}px`} : {minWidth: '250px'}}>
                    <div className="modal-table-head-wrapper">
                        <div className="modal-table-column-header">
                            <span className="column-title">{lobType.title} ({lobType.subLobs.length})</span>
                        </div>
                        {lobType.subLobs.length > 1 ? <a className="button-border-less" role="button" id={lobType.tagId}
                                                         onClick={this.handleSubLobClick}>{checkExpandStatus(lobType.tagId) ? '< Collapse' : 'Expand >'} </a> :
                            <div style={{height: '23px'}}></div>}
                        {/*    {this.props.editEnable ?*/}
                        {/*(<div className="modal-table-column-spacer">*/}
                        {/*    /!*<span>{this.checkColumnHeaderStatus(lobType)}</span> <span>Select All {lobType.title}</span>*!/*/}
                        {/*</div>) :*/}
                        {/*(<div className="modal-table-column-spacer"></div>)}*/}
                    </div>
                </div>
            </>
        );
    }
}

export default ColumnHeader;