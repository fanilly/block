(function() {


	/**
	 * @author:JiJunfeng
	 * @create date:2017-6-26
	 * @descrition:帧工具,用来记录总帧数及计算当前FPS
	 */
  window.FramesUtil = Class.extend({
  	/**
  	 * [init 构造函数]
  	 * @return {[type]} [description]
  	 */
    init: function() {
      //记录总帧数
      this.totalFrames = 0;

      //记录关于计算FPS的参数
      this.FPS = 0; //保存真实的FPS信息
      this.prevSecondFrames = 0; //到上一秒的总帧数
      this.prevSecondTime = new Date(); //上一秒的时间
    },

    /**
     * [update 更新记录的总帧数]
     * @return {[void]} [无返回值]
     */
    update: function() {
      this.totalFrames++;
      //计算FPS FPS就是一秒钟执行了多少帧
      //原理: 首先记录上一秒的总帧数 在每过去一秒钟的时候 用当前的总帧数
      //减去上一秒的总帧数 然后在更新上一秒的总帧数等于这一秒的总帧数
      var currentTime = new Date();
      if (currentTime - this.prevSecondTime >= 1000) {
        this.FPS = this.totalFrames - this.prevSecondFrames;
        this.prevSecondTime = currentTime;
        this.prevSecondFrames = this.totalFrames;
      }
    },

    /**
     * [getTotalFrames 获取总帧数]
     * @return {[Number]} [总帧数]
     */
    getTotalFrames: function() {
      return this.totalFrames;
    },

    /**
     * [getFPS 获取FPS信息]
     * @return {[Number]} [FPS]
     */
    getFPS: function() {
    	return this.FPS;
    }
  });
})();
