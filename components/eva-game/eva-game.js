import { registerCanvas, devicePixelRatio } from '@eva/miniprogram-adapter/dist/miniprogram'
import { Game } from '@eva/eva.js/dist/miniprogram'
import { RendererSystem } from '@eva/plugin-renderer/dist/miniprogram'



Component({
  systemInfo: null,
  mainCanvas: null,
  game: null,
  delayInitId: null,
  mixins: [],
  data: {
    isRunCanvas: false
  },
  props: {
    options: null,
    onAppInit: null,
    onError: null
  },
  onInit() {

  },
  didMount() {
    const systemInfo = this.systemInfo = my.getSystemInfoSync();

    // 手淘 9.8 版本以后启动canvas。
    if (
      systemInfo.app === 'TB' &&
      compareVersion(systemInfo.version, '9.8.0') === -1
    ) {

      my.alert({
        title: '当前手机淘宝版本较老，请更新'
      });
      return;
    } else if (
      systemInfo.app === 'alipay' &&
      compareVersion(my.SDKVersion, '2.7.0') === -1
    ) {
      my.alert({
        title: '当前支付宝版本较老，请更新'
      });
      return
    }
    const { options } = this.props;
    if (!options) {
      console.warn('eva-game 缺少options');
      this.props.onError && this.props.onError.call(this, { code: -1, msg: 'eva-game 缺少options' });
      return;
    }
    const { windowWidth, windowHeight } = systemInfo;
    const { isFullScreen, width, height } = options;
    let baseSize;
    if (isFullScreen) {
      baseSize = { width: 750, height: windowHeight * (750 / windowWidth) }
    } else {
      baseSize = { width, height };
    }
    this.setData({
      isRunCanvas: true,
      targetWidth: baseSize.width,
      targetHeight: baseSize.height
    });
  },
  didUpdate(prevProps) {
  },
  didUnmount() {
    const { game, props } = this;
    clearTimeout(this.delayInitId);
    if (game && (props.destroyAppOnDidUnmount === "true" || props.destroyAppOnDidUnmount === true || props.destroyAppOnDidUnmount === null || props.destroyAppOnDidUnmount === undefined)) {
      game.destroy();
      this.game = null;
      this.mainCanvas = null;
    }
    props.onDidUnmount && props.onDidUnmount.call(null, { code: 1, msg: 'eva-game didUnmount' });
  },
  methods: {
    onCanvasReady() {
      if (this.systemInfo.app === 'TB') {
        my.createCanvas({
          id: 'canvas',
          success: (canvas) => {
            this.initCanvas(canvas)
          }
        })
      } else if (this.systemInfo.app === 'alipay') {
        const query = my.createSelectorQuery();
        query.select('#canvas').node().exec((res) => {
          this.initCanvas(res[0].node)
        })
      }
    },
    initCanvas(canvas) {
      console.log('_createCanvas success');
      const { options } = this.props;
      if (!options) {
        console.warn('eva-game 缺少options');
        this.props.onError && this.props.onError.call(this, { code: -1, msg: 'eva-game 缺少options' });
        return;
      }
      const systemInfo = this.systemInfo || my.getSystemInfoSync();
      const { windowWidth } = systemInfo;

      let baseSize = { width: this.data.targetWidth, height: this.data.targetHeight };
      const scale = 375 / windowWidth;
      const canvasWidth = baseSize.width / 2 / scale;
      const resolution = canvasWidth / (baseSize.width / 2) * (devicePixelRatio / 2);
      options.resolution = resolution;
      options.width = baseSize.width;
      options.height = baseSize.height;
      console.log(options, 11)
      clearTimeout(this.delayInitId);
      this.delayInitId = setTimeout(() => {
        registerCanvas(canvas);
        this.mainCanvas = canvas;
        this.initGameApplication(canvas, options);
      }, 100);
    },


    setDataPromise(...args) {
      return new Promise((resolve) => {
        this.setData(...args, () => resolve());
      });
    },
    initGameApplication(canvas, options) {
      console.log('initGameApplication');
      const rendererSystem = new RendererSystem({
        ...options,
        canvas,
      })
      const game = new Game({
        frameRate: 30,
        systems: [rendererSystem]
      })

      this.props.onAppInit && this.props.onAppInit.call(this, { canvas, game });
      this.game = game
    },
    onTouchHandle(event) {
      if (this.mainCanvas && event.changedTouches && event.changedTouches.length) {
        console.log('event----->', event);
        this.mainCanvas.dispatchEvent(event);
      }
    }
  }
});


/**
 * @param {string} v1
 * @param {string} v2
 * @returns {-1 | 0 | 1}
 */
function compareVersion(v1, v2) {
  var s1 = v1.split(".");
  var s2 = v2.split(".");
  var len = Math.max(s1.length, s2.length);

  for (let i = 0; i < len; i++) {
    var num1 = parseInt(s1[i] || "0");
    var num2 = parseInt(s2[i] || "0");

    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }

  return 0;
}