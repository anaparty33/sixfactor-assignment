import React from 'react';
import {connect} from 'react-redux';
import Spinner from 'base/spinner/spinner';
import {
    COVER_PAGE_HEADER,
    COVER_PAGE_HEADER_INFO,
    COVER_PAGE_HEADER_READONLY_INFO
} from 'constants/Constants';
import TableHeader from 'common/table/table-header/table-header';
import {getCoverPageDesignations, saveCoverPageDesignations} from 'actions/coverPageActions';
import {Toggle} from '@dx/continuum-toggle';
import 'components/view/coverPageDesignations/coverPageDesignations.scss';
import Confirm from 'base/confirm/confirm';
import {
    LOB_SAVE_CONFIRMATION,
    COVER_PAGE_SAVE_CONFIRM_MSG,
    COVER_PAGE_CANCEL_CONFIRM_MSG,
    COVER_PAGE_SAVE_CONFIRM_HEADLINE,
    COVER_PAGE_CANCEL_CONFIRM_HEADLINE
} from 'constants/messages';
import UtilService from 'services/utilService';
import {cloneDeep} from 'lodash';
import {GET_COVER_PAGE_DESIGNATIONS, SAVE_COVER_PAGE_DESIGNATIONS} from 'constants/actionTypes';


class CoverPageDesignations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edited: false,
            list: [],
            confirmType: null
        };
    }

    componentDidMount() {

        let metadata = this.props.metadata;
        this.props.getCoverPageDesignations({metadata});
    }

    componentDidUpdate(prevProps) {

        let {apiStatus} = this.props,
            prevApiStatus = prevProps.apiStatus,
            prevGetListStatus = prevApiStatus[GET_COVER_PAGE_DESIGNATIONS],
            getListStatus = apiStatus[GET_COVER_PAGE_DESIGNATIONS],
            prevSaveStatus = prevApiStatus[SAVE_COVER_PAGE_DESIGNATIONS],
            saveStatus = apiStatus[SAVE_COVER_PAGE_DESIGNATIONS];

        if ((prevGetListStatus && prevGetListStatus.pending && getListStatus.success) ||
            (prevSaveStatus && prevSaveStatus.pending && saveStatus.success)) {

            this.resetView();
        } else if (prevSaveStatus && prevSaveStatus.pending && saveStatus.error) {

        }
    }

    setViewState = (state) => {
        this.setState({
            ...state
        });
    };

    resetView = () => {

        let coverPageData = this.props.coverPageData,
            list = cloneDeep(coverPageData.list);

        this.setViewState({
            confirmType: null,
            edited: false,
            list
        });
    };

    handleGeoSelection = (e) => {

        let target = e.target,
            checked = target.checked,
            indeterminate = target.dataset.indeterminate,
            index = target.closest('.geo-details').dataset.idx,
            list = [...this.state.list],
            geo = {...list[index]},
            markets = geo && [...geo.markets] || [];

        if (indeterminate==='true') {

            geo.marketsChecked = geo.selectableItems;
            markets.forEach(market => {
                market.isCoversUp = true;
                market.edited = true;
            });

        } else if (checked) {

            geo.marketsChecked = geo.selectableItems;
            markets.forEach(market => {
                market.isCoversUp = true;
                market.edited = true;
            });

        } else {
            geo.marketsChecked = 0;
            markets.forEach(market => {
                market.isCoversUp = false;
                market.edited = true;
            });
        }
        list[index] = geo;

        this.setViewState({edited: true, list});

    };

    handleMarketSwitch = (checked, geoIdx, marketIdx) => {

        let list = [...this.state.list],
            geo = {...list[geoIdx]},
            market = geo.markets[marketIdx];

        if (checked) {

            market.isCoversUp = true;
            geo.marketsChecked++;
        } else {
            market.isCoversUp = false;
            geo.marketsChecked--;
        }

        market.edited = true;
        list[geoIdx] = geo;

        this.setViewState({edited: true, list});
    };

    handleActionBtn = (btn) => {

        let actionType;

        if (btn.id==='cancel') {
            actionType = 'cancel';
        } else if (btn.id==='save') {
            actionType = 'save';
        }

        this.setViewState({confirmType: actionType});
    };

    handleSave = () => {
        let list = [...this.state.list],
            metadata = this.props.metadata;

        this.props.saveCoverPageDesignations({list, metadata});
    };


    handleConfirm = (type) => {

        if (type==='save') {
            this.handleSave();
        } else if (type==='cancel') {
            this.resetView();
        }

        this.setViewState({
            confirmType: null
        });

    };

    render() {

        const
            {edited, list, confirmType} = this.state,
            {userInfo} = this.props,
            {isLoading} = this.props.coverPageData,
            readOnly = !UtilService.isReadOnlyAccess(userInfo.permissions, 'COVERPAGE'),
            containerClass = readOnly ? 'read-only':'',
            additionalInfo = readOnly ? `${COVER_PAGE_HEADER_INFO}<br/><span style="color:#F56300">${COVER_PAGE_HEADER_READONLY_INFO}</span>`:COVER_PAGE_HEADER_INFO,
            buttonList = [
                {
                    id: 'cancel',
                    text: 'Cancel',
                    classes: 'button-basic button-transparent',
                    isHidden: readOnly || !edited
                },
                {
                    id: 'save',
                    text: 'Save',
                    classes: 'button-basic button-transparent button-blue-solid',
                    isDisabled: !edited,
                    isHidden: readOnly
                }
            ],
            confirmOpen = !!confirmType,
            toggleClasses = {
                wrapper: 'cover-page-toggle'
            };

        let confirmMsg, confirmBtnLabel, confirmHeadline;

        if (confirmType==='save') {
            confirmMsg = COVER_PAGE_SAVE_CONFIRM_MSG;
            confirmHeadline = COVER_PAGE_SAVE_CONFIRM_HEADLINE;
            confirmBtnLabel = 'Confirm';
        } else if (confirmType==='cancel') {
            confirmMsg = COVER_PAGE_CANCEL_CONFIRM_MSG;
            confirmHeadline = COVER_PAGE_CANCEL_CONFIRM_HEADLINE;
            confirmBtnLabel = 'Yes';
        }

        return (
            <div className={`cover-page-content flex flex-g-1 ${containerClass}`}>
                <Spinner loading={isLoading}/>
                <div className="cover-page-content__table flex flex-g-1">
                    <div className="custom-table flex" data-loading={false}>
                        <div className="custom-table__header">
                            <TableHeader
                                title={COVER_PAGE_HEADER}
                                additionalInfo={additionalInfo}
                                isFilterable={false}
                                buttonList={buttonList}
                                handleActionBtn={this.handleActionBtn}
                            />
                        </div>
                        <div className="cover-page-table-content flex flex-g-1 flex-c">
                            <div className="cover-page-table-header flex">
                                <div className="cover-page-table-cell__header">GEO</div>
                                <div className="cover-page-table-cell__header flex-g-1">
                                    <div className="cover-page-check-cell"> Cover Page Enabled</div>
                                </div>
                                <div className="cover-page-table-cell__header">Last Updated</div>
                                <div className="cover-page-table-cell__header">Updated By</div>
                            </div>
                            <div className="cover-page-table-body">
                                {list.map((geo, idx) => {

                                    let checked = geo.marketsChecked,
                                        disabled = readOnly,
                                        indeterminate = checked && (geo.marketsChecked!=geo.selectableItems),
                                        label;

                                    if (checked && !indeterminate) {
                                        label = 'all covers up';
                                    } else if (!checked) {
                                        label = 'all covers down';
                                    }

                                    return (<div className="geo-content" key={geo.id}>
                                        <div className="cover-page-table-row geo-details flex" data-idx={idx}>
                                            <div className="cover-page-table-cell geo-name">{geo.name}</div>
                                            <div className="cover-page-table-cell flex-g-1">
                                                <div className="cover-page-check-cell flex-inline flex-c">
                                                    <input type="checkbox"
                                                           data-id={geo.id}
                                                           checked={checked}
                                                           data-indeterminate={indeterminate}
                                                           className="checkbox cover-page-check"
                                                           onChange={this.handleGeoSelection}
                                                           disabled={disabled}
                                                           ref={(el) => el && (el.indeterminate = indeterminate)}/>

                                                    <span className="geo-selection-info">{label}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {geo.markets.map((market, index) => {

                                            let disabled = readOnly;

                                            return (
                                                <div className="cover-page-table-row market-details flex"
                                                     key={market.id}
                                                     data-geo-idx={idx}
                                                     data-idx={index}>
                                                    <div className="cover-page-table-cell">{market.name}</div>
                                                    <div className="cover-page-table-cell flex-g-1">
                                                        <div className="cover-page-check-cell flex-inline flex-c">
                                                            <Toggle
                                                                classNames={toggleClasses}
                                                                disabled={disabled}
                                                                alternate={true}
                                                                checked={market.isCoversUp}
                                                                onChange={(checked) => this.handleMarketSwitch(checked, idx, index)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="cover-page-table-cell">{market.lastUpdatedDateDisplay}</div>
                                                    <div className="cover-page-table-cell">{market.lastModifiedBy}</div>
                                                </div>
                                            );
                                        })}
                                    </div>);
                                })}
                            </div>
                        </div>

                    </div>
                </div>
                {confirmOpen ?
                    <Confirm isOpen={confirmOpen}
                             onConfirm={() => this.handleConfirm(confirmType)}
                             onCancel={() => this.handleConfirm('close')}
                             buttonText={confirmBtnLabel}
                             headline={confirmHeadline}
                             body={confirmMsg}/>:''}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        coverPageData: state.coverPageDesignations,
        userInfo: state.userInfo.user,
        metadata: state.metadata,
        apiStatus: state.apiStatus
    };
};
const mapDispatchToProps = {
    getCoverPageDesignations,
    saveCoverPageDesignations
};
export default connect(mapStateToProps, mapDispatchToProps)(CoverPageDesignations);