
let defaultState = {
  themeType:0
}

export default function countReducer(preState=defaultState,action){
	//从action对象中获取：type、data
	const {type,data} = action;
	//根据type决定如何加工数据
	switch (type) {
		case 'changeThemeType': 
			return {...preState,themeType:data}
		default:
			return preState
	}
}