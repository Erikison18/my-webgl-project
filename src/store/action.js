export const add = (count) => {
    return (dispatch) => {
        (() => {
            dispatch({
                type: 'addCount',
                count
            })
        })()
    }
}
export const reduce = (count) => {
    return (dispatch) => {
        (() => {
            dispatch({
                type: 'reduceCount',
                count
            })
        })()
    }
}
export const getList = (data) => {
    console.log(data);
    fetch('/facts/random?animal_type=cat&amount=3').then((response) => {
        let promise = response.json();
        promise.then((catListData) => {
            return (dispatch) => {
                (() => {
                    dispatch({
                        type: 'getList',
                        payload: catListData
                    })
                })()
            }
        });
    });
}
