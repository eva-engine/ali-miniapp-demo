import { resource, GameObject, RESOURCE_TYPE } from "@eva/eva.js/dist/miniprogram";


import { Img, ImgSystem } from "@eva/plugin-renderer-img/dist/miniprogram";
import { DragonBone, DragonBoneSystem } from '@eva/plugin-renderer-dragonbone/dist/miniprogram';
import { Spine, SpineSystem } from '@eva/plugin-renderer-spine/dist/miniprogram';
import { SpriteSystem } from "@eva/plugin-renderer-sprite/dist/miniprogram";
import { NinePatch, NinePatchSystem } from '@eva/plugin-renderer-nine-patch/dist/miniprogram';
import { Mask, MaskSystem, MASK_TYPE } from '@eva/plugin-renderer-mask/dist/miniprogram';
import { SpriteAnimation, SpriteAnimationSystem } from '@eva/plugin-renderer-sprite-animation/dist/miniprogram'

const GAME_WIDTH  = 750
const GAME_HEIGHT = 1000

Page({
  // 供pixi渲染的canvas
  canvas: null,
  context: null,
  // pixi Application
  pixiApplication: null,
  pixiOptions: null,
  data: {
    appOptions: {
      // 手动指定application的尺寸
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      // 全屏-以窗口宽高作为application的尺寸，当设置此选项后，手动设置的width\height会失效
      isFullScreen: false,
      // application是否背景透明
      // transparent: true,
      // 背景颜色
      backgroundColor: 0x000000,
      // 是否强制用2d上下文渲染，如果为false,则优先使用webgl渲染
      forceCanvas: false,

      // FPS设定
      // frameRate: 30,
      // 自动开始
      // autoStart: true,
      // 创建默认场景
      // needScene: true,
    }
  },
  onLoad(query) {
    // 页面加载
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);

    resource.addResource([
      {
        name: 'anim',
        type: RESOURCE_TYPE.SPINE,
        src: {
          ske: {
            type: 'json',
            url: 'https://g.alicdn.com/eva-assets/eva-assets-examples/0.0.2/spine/b5fdf74313d5ff2609ab82f6b6fd83e6.json',
          },
          atlas: {
            type: 'atlas',
            url: 'https://g.alicdn.com/eva-assets/eva-assets-examples/0.0.2/spine/b8597f298a5d6fe47095d43ef03210d4.atlas',
          },
          image: {
            type: 'png',
            url: 'https://g.alicdn.com/eva-assets/eva-assets-examples/0.0.2/spine/TB1YHC8Vxz1gK0jSZSgXXavwpXa-711-711.png',
          },
        },
        preload: true
      },
    ]);
    resource.addResource([
      {
        name: 'dragonbone',
        type: RESOURCE_TYPE.DRAGONBONE,
        src: {
          image: {
            type: 'png',
            url: 'https://g.alicdn.com/eva-assets/eva-assets-examples/0.0.2/dragonbone/TB1RIpUBhn1gK0jSZKPXXXvUXXa-1024-1024.png',
          },
          tex: {
            type: 'json',
            url: 'https://g.alicdn.com/eva-assets/eva-assets-examples/0.0.2/dragonbone/fb18baf3a1af41a88f9d1a4426d47832.json',
          },
          ske: {
            type: 'json',
            url: 'https://g.alicdn.com/eva-assets/eva-assets-examples/0.0.2/dragonbone/c904e6867062e21123e1a44d2be2a0bf.json',
          },
        },
        preload: true,
      },
    ]);
    resource.addResource([
      {
        name: 'Halo',
        type: RESOURCE_TYPE.LOTTIE,
        src: {
          json: {
            type: 'json',
            url: 'https://gw.alipayobjects.com/os/bmw-prod/61d9cc77-12de-47a7-b6e5-06c836ce7083.json',
          },
        },
      },
      {
        name: 'Red',
        type: RESOURCE_TYPE.LOTTIE,
        src: {
          json: {
            type: 'json',
            url: 'https://gw.alipayobjects.com/os/bmw-prod/e327ad5b-80d6-4d3f-8ffc-a7dd15350648.json',
          },
        },
      },
    ]);


  },
  onPixiCanvasError(e) {
    console.log(e);
  },
  onPixiCanvasDidUnmount(e) {
    console.log('aaa', e);
    this.canvas = null;
    this.context = null;
    this.pixiApplication = null;
  },
  onAppInit(e) {
    const { game } = e
    game.addSystem(new ImgSystem)
    game.addSystem(new DragonBoneSystem)
    game.addSystem(new SpineSystem)
    game.addSystem(new NinePatchSystem)
    game.addSystem(new MaskSystem)
    game.addSystem(new SpriteAnimationSystem)
    game.addSystem(new SpriteSystem)


    // 此处还在考虑如何设置默认场景的宽高
    game.scene.transform.size = {
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
    };


    {
      // dragonbone 的 origin 是失效的，将会按照dragonbone设计时的坐标重点定位
      const dragonBone = new GameObject('db', {
        position: {
          x: 100,
          y: -200
        },
        anchor: {
          x: 0.5,
          y: 0.5,
        },
      });

      const db = dragonBone.addComponent(
        new DragonBone({
          resource: 'dragonbone',
          armatureName: 'armatureName',
          autoPlay: true,
          animationName: 'newAnimation'
        }),
      );

      db.play('newAnimation');
      game.scene.addChild(dragonBone);
    }
    {
      let gameObject
      gameObject = new GameObject('spine', {
        position: {
          x: -200,
          y: -200
        },
        anchor: {
          x: 0.5,
          y: 0.5,
        },
        scale: {
          x: 0.5,
          y: 0.5,
        },
      });
      const spine = new Spine({ resource: 'anim', animationName: 'idle' });
      gameObject.addComponent(spine);
      spine.on('complete', e => {
        console.log('动画播放结束', e.name);
      });
      spine.play('idle', true);
      game.scene.addChild(gameObject);
    }
    {
      resource.addResource([
        {
          name: 'imageName',
          type: RESOURCE_TYPE.IMAGE,
          src: {
            image: {
              type: 'png',
              url: 'https://gw.alicdn.com/tfs/TB1DNzoOvb2gK0jSZK9XXaEgFXa-658-1152.webp',
            },
          },
          preload: true,
        },
      ]);
      const image = new GameObject('image1', {
        size: { width: 75, height: 131 },
        origin: { x: 0, y: 0 },
        position: {
          x: 0,
          y: 900,
        },
        anchor: {
          x: 0,
          y: 0,
        },
      });

      image.addComponent(
        new Img({
          resource: 'imageName',
        }),
      );

      game.scene.addChild(image);
    }
    {
      resource.addResource([
        {
          name: 'nine',
          type: RESOURCE_TYPE.IMAGE,
          src: {
            image: {
              type: 'png',
              url: 'https://img.alicdn.com/tfs/TB17uSKkQ9l0K4jSZFKXXXFjpXa-363-144.png',
            },
          },
          preload: false,
        },
      ]);
      const patch = new GameObject('patch', {
        size: { width: 360, height: 145 },
        origin: { x: 0, y: 0 },
        position: {
          x: 510,
          y: 1000,
        },
        anchor: {
          x: 0,
          y: 0,
        },
      });
      patch.addComponent(
        new NinePatch({
          resource: 'nine',
          leftWidth: 100,
          topHeight: 40,
          rightWidth: 40,
          bottomHeight: 40,
        }),
      );

      game.scene.addChild(patch);
    }

    {
      resource.addResource([
        {
          name: 'heart',
          type: RESOURCE_TYPE.IMAGE,
          src: {
            image: {
              type: 'png',
              url: 'https://gw.alicdn.com/bao/uploaded/TB1lVHuaET1gK0jSZFhXXaAtVXa-200-200.png',
            },
          },
          preload: false,
        },
        {
          name: 'tag',
          type: RESOURCE_TYPE.SPRITE,
          src: {
            image: {
              type: 'png',
              url: 'https://gw.alicdn.com/mt/TB1KcVte4n1gK0jSZKPXXXvUXXa-150-50.png',
            },
            json: {
              type: 'json',
              url: 'https://gw.alicdn.com/mt/TB1d4lse4D1gK0jSZFsXXbldVXa.json',
            },
          },
          preload: true,
        },
      ]);
      const image = new GameObject('image2', {
        size: { width: 200, height: 200 },
      });
      image.addComponent(
        new Img({
          resource: 'heart',
        }),
      );
      game.scene.addChild(image);
      image.addComponent(
        new Mask({
          type: MASK_TYPE.Circle,
          style: {
            x: 100,
            y: 100,
            radius: 70,
          },
        }),
      );

      const image1 = new GameObject('image3', {
        size: { width: 200, height: 200 },
        position: { x: 400, y: 300 },
      });
      image1.addComponent(
        new Img({
          resource: 'heart',
        }),
      );

      image1.addComponent(
        new Mask({
          type: MASK_TYPE.Img,
          style: {
            width: 100,
            height: 100,
            x: 20,
            y: 20,
          },
          resource: 'heart',
        }),
      );
      game.scene.addChild(image1);

      const image2 = new GameObject('image4', {
        size: { width: 200, height: 200 },
        position: { x: 100, y: 400 },
      });
      image2.addComponent(
        new Img({
          resource: 'heart',
        }),
      );

      image2.addComponent(
        new Mask({
          type: MASK_TYPE.Sprite,
          style: {
            width: 100,
            height: 100,
            x: 20,
            y: 20,
          },
          resource: 'tag',
          spriteName: 'task.png',
        }),
      );
      game.scene.addChild(image2);
      console.log(resource)
    }


    {

      resource.addResource([
        {
          name: 'fruit',
          type: RESOURCE_TYPE.SPRITE_ANIMATION,
          src: {
            image: {
              type: 'png',
              url:
                'https://gw.alicdn.com/bao/uploaded/TB15pMkkrsTMeJjSszhXXcGCFXa-377-1070.png',
            },
            json: {
              type: 'json',
              url:
                'https://gw.alicdn.com/mt/TB1qCvumsyYBuNkSnfoXXcWgVXa.json',
            },
          },
          preload: false,
        },
      ]);


      const cut = new GameObject('cut', {
        position: { x: 350, y: 100 },
        size: { width: 300, height: 200 },
        origin: { x: 0, y: 0 },
      });

      const frame = cut.addComponent(
        new SpriteAnimation({
          resource: 'fruit',
          speed: 100,
          forwards: true
        }),
      );

      frame.play();

      game.scene.addChild(cut);

    }

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
