import {uniq, sortBy, cloneDeep} from 'lodash';

export const getUniqueValuesFromList = (list) => {

	let normalizedItems = {},
		uniqueItemsIdx = {};

	list.forEach((item) => {

		Object.keys(item).forEach((key) => {

			let attrValue = item[key];

			if (normalizedItems[key]) {
				if (Array.isArray(attrValue)) {
					normalizedItems[key] = [...normalizedItems[key], ...attrValue];
				} else {
					normalizedItems[key].push(attrValue);
				}
			} else {
				if (Array.isArray(attrValue)) {
					normalizedItems[key] = [...attrValue];
				} else {
					normalizedItems[key] = [attrValue];
				}
			}
		});
	});

	Object.keys(normalizedItems).forEach((key) => {
		uniqueItemsIdx[key] = sortBy(uniq(normalizedItems[key]));
	});

	return uniqueItemsIdx;
};

export const getFilteredData = (list, filter) => {

	let filteredList;

	filteredList = list.filter((list) => {

		let isValid = true;

		Object.keys(filter).forEach((key) => {

			let listValue = list[key],
				filterValues = filter[key];

			if (filterValues.length) {
				if (Array.isArray(listValue)) {
					isValid = isValid && filterValues.some((filter) => {
						return listValue.includes(filter);
					});
				} else {
					if (isValid && !filterValues.includes(listValue.toString())) {
						isValid = false;
					}
				}
			}
		});

		return isValid;
	});

	return filteredList;


};

/*
 * @deprecated
 * To be deprecated. Use mergeListWithState instead
 *
 * */
export const mergeStateWithPrev = (updatedList, prevState) => {

	let updatedViewList = [...prevState.viewList],
        updatedLookupList = [...prevState.list],
        updatedIndex = {...prevState.idx},
        newState = {...prevState};
	
	updatedList.forEach(updatedListItem => {

		prevState.viewList.forEach((listItem, index) => {
			if (listItem.id === updatedListItem.id) {
				updatedViewList[index] = updatedListItem;
			}
		})

		prevState.list.forEach((listItem, index) => {
			if (listItem.id === updatedListItem.id) {
				updatedLookupList[index] = updatedListItem;

			}
		})

		Object.keys(prevState.idx).forEach(partnerId => {

			if(partnerId === updatedListItem.id){

				updatedIndex[partnerId] = updatedListItem;
				updatedIndex[partnerId].isChecked = true

			}
		})

	})

	newState.viewList = [...updatedViewList];
	newState.list = [...updatedLookupList]
	newState.idx = {...updatedIndex}

	return newState
}


export const mergeListWithState = (list, state) => {

    // let stateList = [...state.list],
    let stateList = cloneDeep(state.list),
        stateIdx = cloneDeep(state.idx),
        viewListItems = state.viewList.map((item)=> item.id),
        selectedItems = state.selectedItems,
        newViewList = [],
        newState;

    list.forEach(item => {

        let itemId = item.id,
            stateItem = stateIdx[itemId],
            arrIdx = stateItem.idx;

        item.idx = arrIdx;

        stateList[arrIdx] = item;
        stateIdx[itemId] = item;
    });

    stateList.forEach(item=>{
        //TODO: Remove this logic added to manage checked status on all selected items
        if(selectedItems[item.id]) {
            item.isChecked = true;
            stateIdx[item.id].isChecked = true;
        }
    });

    viewListItems.forEach((viewItem)=>{
        newViewList.push(stateIdx[viewItem]);
    });

    newState = {
        ...state,
        list: stateList,
        idx: stateIdx,
        viewList: newViewList
    };

    return newState
};

export const processLobList = (list = [], metadata = {}) => {


    let processed = {
        list: [],
        idx: {}
    };

    list.forEach((partnerItem, idx) => {

        let partnerLobs = {},
            lobItem = partnerItem.lobs || {},
            subLobs = partnerItem.subLobs || [];

        subLobs.forEach(subLob => {

            let lobId = metadata.subLobs[subLob].lob,
                subLobs = partnerLobs[lobId] || [];

            subLobs = [...subLobs, subLob];

            partnerLobs = {
                ...partnerLobs,
                [lobId]: subLobs
            }
        });

        partnerItem.lobs = partnerLobs;
		partnerItem.idx = idx;
        processed.list.push(partnerItem);
        processed.idx[partnerItem.id] = partnerItem;

    });

    return processed;
};
