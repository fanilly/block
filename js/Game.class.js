(function() {
  window.Game = Class.extend({
    init: function(settings) {

      var self = this;
      //canvas 画布属性及上下文对象
      this.canvas = document.querySelector(settings.canvasID);
      this.ctx = this.canvas.getContext('2d');
      this.width = settings.width;
      this.height = settings.height;
      this.canvas.width = this.width;
      this.canvas.height = this.height;

      //游戏主进程设置
      this.timer = null;
      this.timeDiff = settings.timeDiff || 40;

      //游戏辅助类及游戏资源
      this.framesUtil = new FramesUtil();
      this.staticResource = new StaticResource();

      //开始加载图片
      this.staticResource.loadImage('resource.json', function(currentLoadedImage, totalImage) {
        //如果全部图片加载成功
        if (currentLoadedImage == totalImage) {
          //演员管理类 并创建演员 开始游戏
          self.actorManager = new ActorManager(self.staticResource.images);
          self.actorManager.createActor();
          self.start();
        }
      })
    },

    mainLoop: function() { //游戏主进程业务

      //首先每帧清除画布 然后演员出场
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.actorManager.action();

      if (this.actorManager.die) this.gameOver();

      //更新帧工具 打印总帧数及FPS、分数
      this.framesUtil.update();
      this.ctx.fillStyle = '#fff';
      this.ctx.fillText('FPS ' + this.framesUtil.getFPS(), 280, 30);
      this.ctx.fillText('FNO ' + this.framesUtil.getTotalFrames(), 280, 50);
      this.ctx.fillText('得分: ' + this.actorManager.score, 280, 70);
    },

    gameOver: function() {
      var self = this;
      this.pause();
      var overInfo = document.querySelector('#game_over');
      overInfo.setCss({
        zIndex: 100,
        opacity: 1
      });
      overInfo.querySelector('a').addEventListener('click', function(e) {
        e.preventDefault();
        overInfo.setCss({
          zIndex: 80,
          opacity: 0
        });
        self.restart();
      });
    },

    start: function() { //开始主进程
      var self = this;
      this.timer = setInterval(function() {
        self.mainLoop();
      }, this.timeDiff);
    },

    restart: function() {
      this.actorManager = new ActorManager(this.staticResource.images);
      this.actorManager.createActor();
      this.start();
    },

    pause: function() { //暂停主进程
      clearInterval(this.timer);
    }
  });
})();
