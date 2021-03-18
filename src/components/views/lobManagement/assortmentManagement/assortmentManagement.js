import React from 'react';
import ModalGenericContainer from 'base/modal-generic-container/modalGenericContainer';
import {checkLobAllPartners, checkLobPartner, checkSubLobAllPartners, checkSubPartner} from 'actions/checkLobActions';
import {connect} from 'react-redux';
import './assortmentManagement.scss';
import {Icon} from '@dx/continuum-icon/dist';
import Confirm from 'base/confirm/confirm';
import {LOB_SAVE_CONFIRMATION} from 'constants/messages';

class AssortmentManagement extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            scrollActivated: false,
            edit: true,
            edited: false,
            expandedLobs: {},
            partnerIdx: {...props.selectedIdx},
            editedSubLobs: {},
            editMode: props.editMode,
            confirmOpen: false,
            saving: false
        };
        this.selectedIds = props.selectedItems;
        this.lobs = this.props.metadata.lobs;
        this.colWidth = 250;
    }

    setViewState = (state, callback) => {
        this.setState({
            ...state
        }, callback);
    };

    componentDidUpdate(prevProps, prevState, snapshot) {

        if(prevState.saving) {

            this.setState({
                saving: false,
                partnerIdx: {...this.props.selectedIdx}
            });
        }
    }


    handleScroll = (e) => {
        let target = e.target,
            scrollLeft = target.scrollLeft,
            targetScrollEl =document.getElementById('computed-scroll'),
            targetSpacer =document.getElementById('computed-spacer');


        if (scrollLeft > 150) {
            if (!this.state.scrollActivated) {
                this.setViewState({
                    scrollActivated: true
                });
                targetScrollEl.style.top = targetScrollEl.dataset.top + 'px';
                targetSpacer.style.height = targetSpacer.dataset.height +'px';

                setTimeout(()=>{
                    targetScrollEl.scrollTop = parseInt(targetScrollEl.dataset.scrollTop);
                }, 20)
            }
        } else {
            if (this.state.scrollActivated && scrollLeft > 0) {
                this.setViewState({
                    scrollActivated: false
                });
            }
        }
    };
    handleLobScroll = (e) => {
        let target = e.target,
            scrollTop = target.scrollTop;

        // console.log(scrollLeft);

        let targetScrollEl =document.getElementById('computed-scroll');
        targetScrollEl.dataset.scrollTop = scrollTop;
        targetScrollEl.scrollTop = scrollTop;
    };

    getSubLobCount = (partnerId, lobItem) => {

        let partnerData = this.props.lobData.idx[partnerId],
            subLobMaster = this.props.metadata.idx.subLobs,
            lobItems = [];

        partnerData.subLobs.forEach(subLob => {

            let lob = subLobMaster[subLob].lob;

            if (lob === lobItem.id) {
                lobItems.push(subLob);
            }
        });
        return lobItems.length;
    };

    getCheckHtml = (partnerId, lobId, subLobId) => {

        let checkBox,
            partnerLobs = this.state.partnerIdx[partnerId].lobs,
            subLobs = partnerLobs[lobId] || [],
            checked = subLobs.includes(subLobId);

        if (this.props.editMode) {

            checkBox = <input type="checkbox"
                              className="lob-check"
                              data-partner-id={partnerId}
                              data-lob-id={lobId}
                              data-sub-lob-id={subLobId}
                              data-select-type="subLob"
                              checked={checked}
                              onChange={this.handleSelection}
            />;
        } else {
            if (checked) {
                checkBox = <Icon className="icon-align-center" name="check" size="large" color="blackDarker"/>;
            } else {
                checkBox = <span className="check-content-none"></span>;
            }
        }
        return checkBox;
    };

    getToggleActionText = (lobId) => {

        let actionText;

        if (this.state.expandedLobs[lobId]) {
            actionText = '< Collapse';
        } else {
            actionText = 'Expand >';
        }

        return actionText;
    };

    toggleSubLobsDisplay = (e) => {

        let target = e.target,
            lobId = target.dataset.id;

        let expandedLobs = {...this.state.expandedLobs};

        if (expandedLobs[lobId]) {
            delete expandedLobs[lobId];
        } else {
            expandedLobs = {
                [lobId] : true
            };
        }

        this.setViewState({
            expandedLobs
        });
    };

    cancelEdit = () => {

        this.setViewState({
            editedSubLobs: {},
            editMode: false,
            partnerIdx: this.props.selectedIdx
        }, this.props.onViewModeChange(true, false));
    };

    promptSave = () => {
        this.setViewState({
            confirmOpen: true
        });
    };

    save = () => {
        this.props.onSave(this.state.partnerIdx);

        this.setViewState({
            edited: false,
            confirmOpen: false,
            saving: true
        });
    };

    edit = () => {
        this.props.onViewModeChange(true, true);
        // this.setViewState({
        //     editMode: true
        // });
    };

    handleSelection = (e) => {

        e.stopPropagation();

        let target = e.target,
            checked = target.checked,
            lobId = target.dataset.lobId,
            partnerId = target.dataset.partnerId,
            indeterminate = (target.dataset.indeterminate === 'true'),
            subLobId = target.dataset.subLobId,
            selectType = target.dataset.selectType,
            partnerIdx = {...this.state.partnerIdx},
            partnerData = {...partnerIdx[partnerId]},
            partnerLobs = partnerData.lobs,
            editedLob = (partnerLobs && partnerLobs[lobId] && [...partnerLobs[lobId]]) || [],
            subLobIdx = editedLob.indexOf(subLobId),
            editedSubLobs = {...this.state.editedSubLobs},
            partnerMap = {};

        if (selectType === 'partnerMaster') {

            let editedPartnerLobs,
                editedPartner,
                masterSubLobIds;


            masterSubLobIds = this.props.metadata.idx.lobs[lobId].subLobs.map(subLob => {
                //select all impacts all sub lobs for the partner
                editedSubLobs[`${partnerId}-${subLob.id}`] = true;
                return subLob.id;
            });

            if (indeterminate || checked) {
                // select all
                editedLob = masterSubLobIds;
            } else {
                editedLob = [];
            }
            editedPartnerLobs = {
                ...partnerData.lobs,
                [lobId]: editedLob
            };
            editedPartner = {
                ...partnerData,
                lobs: editedPartnerLobs,
                edited: true
            };

            this.props.metadata.idx.lobs[lobId].subLobs.map(subLob => {
                editedSubLobs[`${partnerId}-${subLob.id}`] = true;
            });


            partnerMap = {
                [partnerId]: editedPartner
            };

        } else if (selectType === 'lobMaster') {

            if (indeterminate || checked) {
                editedLob = this.props.metadata.idx.lobs[lobId].subLobs.map(subLob => {
                    return subLob.id;
                });
            } else {
                editedLob = [];
            }

            Object.values(partnerIdx).forEach((partner) => {

                let lobs = {...partner.lobs};

                partnerMap[partner.id] = {
                    ...partner,
                    edited: true,
                    lobs: {
                        ...lobs,
                        [lobId]: [...editedLob]
                    }
                };

                partnerMap[partner.id].lobs[lobId].forEach(subLobId => {
                    editedSubLobs[`${partner.id}-${subLobId}`] = true;
                });
            });

        } else if (selectType === 'subLobMaster') {

            let action;
            if (indeterminate || checked) {
                action = 'add';
            } else {
                action = 'remove';
            }

            Object.values(partnerIdx).forEach((partner) => {

                let lobs = {...partner.lobs},
                    subLobs = [...lobs[lobId]|| []],
                    subLobIdx = subLobs.indexOf(subLobId);

                // partner.lobs[lobId] = [...editedLob];

                if (action === 'add') {
                    if (!(subLobIdx > -1)) {
                        subLobs.push(subLobId);
                    }
                } else if (action === 'remove') {
                    subLobs.splice(subLobIdx, 1);
                }

                partnerMap[partner.id] = {
                    ...partner,
                    edited: true,
                    lobs: {
                        ...lobs,
                        [lobId]: [...subLobs]
                    }
                };
                // partnerMap[partner.id] = {loblobId] = subLobs;

                // partner.lobs[lobId].forEach(subLobId => {
                editedSubLobs[`${partner.id}-${subLobId}`] = true;
                // });
            });

        } else {

            let editedPartnerLobs,
                editedPartner;
            if (subLobIdx > -1) {
                editedLob.splice(subLobIdx, 1);
            } else {
                editedLob.push(subLobId);
            }

            editedPartnerLobs = {
                ...partnerData.lobs,
                [lobId]: editedLob
            };
            editedPartner = {
                ...partnerData,
                lobs: editedPartnerLobs,
                edited: true
            };

            partnerMap = {
                [partnerId]: editedPartner
            };

            editedSubLobs[`${partnerId}-${subLobId}`] = true;
        }

        this.setViewState({
            editedSubLobs,
            partnerIdx: {
                ...this.state.partnerIdx,
                ...partnerMap
            },
            edited: true
        });
    };


    getMasterCheckBox = (type, partnerId, lobId, subLobId) => {

        let checked,
            partnerIdx = this.state.partnerIdx,
            partner,
            id,
            selectedSubLobs,
            masterSubLobs = this.props.metadata.idx.lobs[lobId].subLobs,
            indeterminate;


        if (type === 'lobMaster') {

            let partnersWithFullSelection = [],
                partners = Object.keys(partnerIdx).map(partnerId => {
                    return partnerIdx[partnerId];
                }).filter(partner => {

                    let partnerLobs = partner.lobs,
                        selectedLob = partnerLobs[lobId],
                        hasLob = !!selectedLob;


                    if (hasLob) {
                        if ((selectedLob.length === masterSubLobs.length)) {
                            partnersWithFullSelection.push(partner);
                        }
                    }
                    return hasLob && !!selectedLob.length;
                });
            id = lobId;
            checked = !!partners.length;
            indeterminate = checked && (partnersWithFullSelection.length != this.selectedIds.length);

        } else if (type === 'partnerMaster') {
            partner = this.state.partnerIdx[partnerId];
            selectedSubLobs = partner.lobs[lobId] || [];
            id = partnerId;
            checked = !!selectedSubLobs.length;
            indeterminate = checked && (selectedSubLobs.length != masterSubLobs.length);
        } else if (type === 'subLobMaster') {

            let partnersWithSubLobSelection = [],
                partners = Object.keys(partnerIdx).map(partnerId => {
                    return partnerIdx[partnerId];
                }).filter(partner => {

                    let partnerLobs = partner.lobs,
                        selectedLob = partnerLobs[lobId],
                        hasSubLob = selectedLob && selectedLob.includes(subLobId);

                    if (hasSubLob) {
                        // if ((partnerLobs[lobId].length === masterSubLobs.length)) {
                        partnersWithSubLobSelection.push(partner);
                        // }
                    }
                    return hasSubLob;
                });

            id = subLobId;
            checked = !!partners.length;
            indeterminate = checked && (partnersWithSubLobSelection.length != this.selectedIds.length);

        }

        return (

            <input type="checkbox"
                   className={`lob-check ${type}-check`}
                   id={`select-${id}`}
                   data-select-type={type}
                   data-partner-id={partnerId}
                   data-lob-id={lobId}
                   data-sub-lob-id={subLobId}
                   data-indeterminate={indeterminate}
                   checked={checked}
                   ref={(el) => el && (el.indeterminate = (el.dataset.indeterminate === 'true'))}
                   onChange={this.handleSelection}
            />
        );
    };

    checkEditedCell = (partnerId, subLobId) => {

        return this.state.editedSubLobs[subLobId];

    };

    closeConfirm = ()=>{

        this.setViewState({
            confirmOpen: false
        });
    };

    render() {

        let {selectedItems, onClose, lobData, editMode, readOnly} = this.props,
            {lobs} = this.props.metadata,
            {subLobs} = this.props.metadata.idx,
            {editedSubLobs, expandedLobs} = this.state,
            isExpanded = expandedLobs && Object.keys(expandedLobs).length,
            editModeClass = editMode ? 'edit' : '',
            scrollActivatedClass = this.state.scrollActivated ? 'scroll-activated' : '',
            saveDisable = !this.state.edited,
            disabledClass = saveDisable ? 'disabled' : '';

        return (
            <>
                <ModalGenericContainer
                    fullScreen={true}
                    isOpen={true}
                    classNames="modal-lob-management"
                    onClose={onClose}>
                    <div className={`lob-mapping ${editModeClass}`}>
                        <div className="lob-mapping-header">
                            <section className="header-text">
                                <h2 className="app-modal-header">Assortment Management</h2>
                                <div className="partner-count">
                                    Viewing {selectedItems.length} partners
                                </div>
                            </section>
                            {readOnly ? (<section className="button-container">
                                {editMode ? <>
                                        <button className="button-basic button-transparent button-blue-clear"
                                                onClick={this.cancelEdit}>Cancel
                                        </button>
                                        <button className={`button-basic button-transparent ${disabledClass}`}
                                                disabled={saveDisable} onClick={this.promptSave}>Save
                                        </button>
                                    </>
                                    : <button className={`button-basic button-transparent`} onClick={this.edit}>Edit
                                    </button>
                                }
                            </section>): ''}

                        </div>
                        <div className={`lob-mapping-container ${scrollActivatedClass}`} onScroll={this.handleScroll}>
                            <div className="lob-mapping-content">
                                <div className="lob-list">
                                    <div className="lob-list-spacer">
                                        <div className="spacer-pop-out" id="computed-spacer"
                                        ref={(el) => el && !el.dataset.height && (el.dataset.height = el.offsetHeight)}
                                        >
                                            {isExpanded ? (<div className="sub-lob-info-labels">
                                                <label className="prod-name">Product Name</label>
                                                <label className="prod-attr">Attributes</label>
                                            </div>) : ''}
                                        </div>
                                    </div>
                                    {
                                        lobs && lobs.map((lob) => {
                                            let expanded = expandedLobs[lob.id],
                                                expandClass = expanded ? 'expanded' : '',
                                                maxWidth = expanded ? (lob.subLobs.length * this.colWidth) : this.colWidth;

                                            return (
                                                <div className={`lob-list-details ${expandClass}`} data-id={lob.id}
                                                     key={lob.id}
                                                     style={{maxWidth: `${maxWidth}px`}}>
                                                    <div className="lob-detail" style={{maxWidth: `${this.colWidth}px`}}>
                                                        <div className="lob-name"
                                                             dangerouslySetInnerHTML={{__html: `${lob.name} (${lob.subLobs.length})`}}>
                                                        </div>

                                                    </div>
                                                    <div className="toggle-sub-lobs">
                                                        <a className="action-toggle-sub-lob"
                                                           role="button"
                                                           data-id={lob.id}
                                                           onClick={this.toggleSubLobsDisplay}>{this.getToggleActionText(lob.id)}</a>
                                                    </div>
                                                    <div className="sub-lob-details">
                                                        <div className="sub-lob-name hide-on-expand sub-lob-master">
                                                            {this.getMasterCheckBox('lobMaster', null, lob.id)} <label
                                                            className="select-lob-label"
                                                            htmlFor={`select-${lob.id}`}
                                                            dangerouslySetInnerHTML={{__html: `Select&nbsp;all&nbsp;${lob.name}`}}></label>
                                                        </div>
                                                        {
                                                            lob.subLobs.map((subLob) => {
                                                                return (
                                                                    <div className="sub-lob-name"
                                                                         key={subLob.id}>
                                                                        {this.getMasterCheckBox('subLobMaster', null, lob.id, subLob.id)}
                                                                        <label
                                                                            className="select-sub-lob-label"
                                                                            htmlFor={`select-${subLob.id}`}
                                                                            dangerouslySetInnerHTML={{__html: subLob.name}}></label>
                                                                        <div className="sub-lob-desc">
                                                                            <span className="desc-text" title={subLob.descTitleValue}
                                                                                  dangerouslySetInnerHTML={{__html: subLob.descDisplayValue}}></span>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                                <div className="lob-mapping-data-container" onScroll={this.handleLobScroll}>
                                    <div className="lob-mapping-data">
                                        <div className="lob-mapping-partner-list lob-display-cell">
                                            <div className="section-pop-out" id="computed-scroll"
                                                 ref={(el) => el && !el.dataset.top && (el.dataset.top = Math.floor(el.getBoundingClientRect().top))}>
                                                {
                                                    this.selectedIds.map((partnerId) => (
                                                            <div className="partner-detail assortment-cell" key={partnerId}>
                                                                <div className="partner-name"
                                                                     title={lobData.idx[partnerId].name}>
                                                                    {this.props.lobData.idx[partnerId] && this.props.lobData.idx[partnerId].name}
                                                                </div>
                                                                <div className="sub-lob-count">
                                                                    {this.props.lobData.idx[partnerId] && this.props.lobData.idx[partnerId].subLobs.length}&nbsp;of&nbsp;{subLobs && Object.keys(subLobs).length}&nbsp;Sub
                                                                    Lobs
                                                                </div>
                                                            </div>
                                                        )
                                                    )
                                                }
                                            </div>

                                        </div>
                                        <div className="lob-table-content">
                                            {
                                                this.selectedIds.map((partnerId) => (

                                                        <div className="partner-lob-row" key={partnerId}>
                                                            {


                                                                lobs && lobs.map((lob) => {

                                                                    let expanded = expandedLobs[lob.id],
                                                                        expandClass = expanded ? 'expanded' : '',
                                                                        maxWidth = expanded ? (lob.subLobs.length * this.colWidth) : this.colWidth;

                                                                    return (
                                                                        <div
                                                                            className={`lob-cell assortment-cell ${expandClass}`}
                                                                            key={lob.id}
                                                                            style={{maxWidth: `${maxWidth}px`}}>

                                                                            <div className="sub-lob-row">
                                                                                <div
                                                                                    className="sub-lob-row-summary hide-on-expand lob-display-cell">
                                                                                    {editMode ?
                                                                                        this.getMasterCheckBox('partnerMaster', partnerId, lob.id)
                                                                                        :
                                                                                        `${this.getSubLobCount(partnerId, lob)} of ${lob.subLobs.length}`

                                                                                    }
                                                                                </div>
                                                                                {
                                                                                    lob.subLobs.map((subLob) => {

                                                                                        let editId = `${partnerId}-${subLob.id}`,
                                                                                            editClass = editedSubLobs[editId] ? 'edited' : '';
                                                                                        return (
                                                                                            <div
                                                                                                key={subLob.id}
                                                                                                className={`sub-lob-check lob-display-cell ${editClass}`}>
                                                                                                {this.getCheckHtml(partnerId, lob.id, subLob.id)}
                                                                                            </div>
                                                                                        );
                                                                                    })
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })
                                                            }
                                                        </div>
                                                    )
                                                )
                                            }

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.state.confirmOpen ?
                    <Confirm isOpen={this.state.confirmOpen}
                             onConfirm={this.save}
                             onCancel={this.closeConfirm}
                             buttonText="Save"
                             headline="Are you sure you want to save?" body={LOB_SAVE_CONFIRMATION} /> : ''}

                </ModalGenericContainer>
            </>
        );
    }
}


export default AssortmentManagement;






