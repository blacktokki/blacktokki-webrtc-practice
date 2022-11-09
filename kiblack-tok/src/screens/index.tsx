import NotFoundScreen from './NotFoundScreen'
import TabOneScreen from './TabOneScreen'

export default {
    key:'NotFound',
    screens:{
        NotFoundScreen:{
            component: NotFoundScreen,
            title: 'Oops!',
        },
    }
}

export const _default = {
    key: "default",
    screens:{
        TabOneScreen:{
            stacks: {defaultStack:TabOneScreen},
            title: 'Tab One Title',
            url: 'one'
        }
    }
}
