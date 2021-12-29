# 淘宝/支付宝小程序Demo


> 目前不支持读取本地资源，可使用cdn资源


## Eva.js 小程序组件使用方法

所有开发语法都与 Eva.js 一致

[Eva.js 官网](https://eva.js.org/)

[Eva.js 中文官网](https://eva-engine.gitee.io/)


引用npm包的方式需要修改，引用npm包里面的 `dist/miniprogram` 文件

例如

```js
import { resource, GameObject, RESOURCE_TYPE } from "@eva/eva.js/dist/miniprogram";
import { Event, EventSystem, HIT_AREA_TYPE } from '@eva/plugin-renderer-event/dist/miniprogram'
import { Img, ImgSystem } from '@eva/plugin-renderer-img/dist/miniprogram'
```

### 开发IDE：

- 淘宝小程序IDE:[https://miniapp.open.taobao.com/doc.htm?docId=119660&docType=1&tag=dev](https://miniapp.open.taobao.com/doc.htm?docId=119660&docType=1&tag=dev)

- 支付宝小程序IDE:[https://opendocs.alipay.com/mini/ide/download](https://opendocs.alipay.com/mini/ide/download)

### 注意：

- 目前Canvas要求手淘版本 > 9.7.0，项目中需要进行判断版本，进行降级抄底
- Canvas 2d: 要求手淘版本 > 9.7.0
- webGL : 要求手淘版本 > 9.9.0



### 使用方式：

#### 1.开启使用Canvas:

app.json 增加配置项：


- 手淘："enableSkia": "true"

```javascript
{
  "pages": [
    "pages/index/index"
  ],
  "window": {
    "defaultTitle": "My App",
    "enableSkia": "true"
  }
}
```

- 支付宝开启依赖库2.0编译："enableAppxNg": true

mini.project.json

```json
{
  "enableAppxNg": true
}
```


### 2.安装小程序所需依赖，其他 Eva.js 依赖与官网教程相同
- @eva/miniprogram-adapter
- @eva/miniprogram-pixi

```javascript
npm install @eva/miniprogram-adapter
npm install @eva/miniprogram-adapter
```


### 3.引用eva-game组件


- index.axml



```javascript
<eva-game id="canvas" options={{// 这里可覆盖RendererSystem参数
appOptions}} destroyAppOnDidUnmount="true" onError="onEvaCanvasError" onDidUnmount="onEvaCanvasDidUnmount" onAppInit="onAppInit"></eva-game>
```


- index.json

```javascript
{
  "usingComponents":{
      "eva-game": "/components/eva-game/eva-game"
  }
}
```


#### 4.在js中编写eva-game的 事件监听

```javascript
import { resource, GameObject, RESOURCE_TYPE } from "@eva/eva.js/dist/miniprogram";
import { Event, EventSystem, HIT_AREA_TYPE } from '@eva/plugin-renderer-event/dist/miniprogram'
import { Img, ImgSystem } from '@eva/plugin-renderer-img/dist/miniprogram'
Page({
  data: {
    // 这里可覆盖RendererSystem参数
    appOptions: {
      // 手动指定游戏的尺寸
      width: 750,
      height: 1000,
      // 全屏-以窗口宽高作为application的尺寸，当设置此选项后，手动设置的width\height会失效
      isFullScreen: false,
      // 画布透明
      transparent: false,
      // 背景颜色
      backgroundColor: 0x000000,
      // 是否强制用2d上下文渲染，如果为false,则优先使用webgl渲染
      forceCanvas: false
    }
  },
  onLoad(query) {
    // 页面加载
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
    resource.addResource([
      {
        name: 'heart',
        type: RESOURCE_TYPE.IMAGE,
        src: {
          image: {
            type: 'png',
            url:
              'https://gw.alicdn.com/bao/uploaded/TB1lVHuaET1gK0jSZFhXXaAtVXa-200-200.png',
          },
        },
        preload: true,
      },
    ]);
  },
  onEvaCanvasError(e) {
    console.log(e);
  },
  onEvaCanvasDidUnmount(e) {
    console.log('unmount')
  },
  onAppInit(e) {
    const { game } = e;
    game.addSystem(new ImgSystem())
    game.addSystem(new EventSystem())
    const image = new GameObject('image', {
      origin: { x: 0.5, y: 0.5 },
      size: { width: 200, height: 200 },
      position: {
        x: 300,
        y: 300
      },
    });
    const img = image.addComponent(new Img({
      resource: 'heart'
    }));
    const evt = image.addComponent(new Event({
      // 使用这个属性设置交互事件可以触发的区域，骨骼动画有所变差，可以临时在当前游戏对象下添加一个同类型同属性的Graphic查看具体点击位置。
      hitArea: {
        type: HIT_AREA_TYPE.Polygon,
        style: {
          paths: [109, 48, 161, 21, 194, 63, 193, 104, 65, 176, 8, 86, 38, 40, 90, 33]
        }
      }
    }));
    evt.on('tap', () => {
      console.log('touch')
    })
    let touched = false;
    evt.on('touchstart', e => {
      console.log(e);
      console.log('touchstart');
      touched = true;
    });
    evt.on('touchend', e => {
      console.log('touchend');
      touched = false;
    });
    evt.on('touchendoutside', e => {
      console.log('touchendoutside');
      touched = false;
    })
    evt.on('touchmove', e => {
      if (touched) {
        const transform = e.gameObject.transform;
        console.log('touchmove');
        console.log(
          transform.size.width * (1 - transform.origin.x),
          transform.size.height * (1 - transform.origin.y)
        );
        const { x, y } = e.data.position
        transform.position = { x: x, y: y }; // 通过缩放scene来设置游戏界面尺寸时，需要计算真实的点位
      }
    });
    game.scene.addChild(image);
  },
  onReady() {
  },
  onShow() {
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // // 返回自定义分享信息
    // return {
    //   title: 'Demo-Text',
    //   desc: 'Demo-Text',
    //   path: 'pages/text/index',
    // };
  },
});
```
