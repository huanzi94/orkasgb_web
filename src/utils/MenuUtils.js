import { axiosPost } from './AxiosUtils' 

export const initMenu = (router, store) => {
    if (store.state.routes.length > 0) {
        return;
    }

    axiosPost('/meanu/getMenuByOperator', {}, 'application/json; charset=UTF-8').then(data => {
        if (data) {
            var routerData = data.data.data;
            // 格式化路由
            let fmtRouters = formatRouter(routerData);

            // 添加到路由列表
            fmtRouters.forEach(rout =>  router.addRoute(rout));

            // 将路由放进vuex中
            store.commit('initRouters', fmtRouters);
        }        
    })
}


export const formatRouter = (routers) => {
    let fmtRouters = [];
    routers.forEach(router => {
        let {
            path,
            component,
            name,
            children,
            meanuIcon
        } = router;

        if (children && children instanceof Array) {
            children = formatRouter(children);
        }

        let fmRouter = {
            name: name,
            path: path,
            iconCls: meanuIcon,
            children: children,
            component: () => import('@/components/' + component)
        }
        fmtRouters.push(fmRouter);
    })

    return fmtRouters;
}