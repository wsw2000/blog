let defaultState = {
  themeType: 0,
  isFixed: false,
  visible: false,
  listType:  [
    {id: 1, typeName: "技术", icon: "carry-out"},
    {id: 2, typeName: "生活", icon: "customer-service"},
    {id: 3, typeName: "吐槽", icon: "aliwangwang"},
    {id: 4, typeName: "留言墙", icon: "snippets"},
  ],
}

export default function countReducer(preState = defaultState, action) {
  //从action对象中获取：type、data
  const { type, data } = action
  //根据type决定如何加工数据
  switch (type) {
    case 'changeThemeType':
      return { ...preState, themeType: data }
    case 'changeFixed':
      return { ...preState, isFixed: data }
    case 'changeVisible':
      return { ...preState, visible: data.flag }
    default:
      return preState
  }
}
