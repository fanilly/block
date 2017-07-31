(function() {
  /**
   * @author:JiJunfeng
   * @create date:2017-6-26
   * @description:异步静态资源加载
   */
  window.StaticResource = Class.extend({
    init: function() {
      this.images = new Object();
    },

    /**
     * [_ajax 异步请求]
     * @param  {[String]} url     [请求文件的url]
     * @param  {[Function]} success [请求成功的回调函数 传入响应的json对象]
     * @return {[void]}         [无返回值]
     */
    _ajax: function(url, success) {
      var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
      xhr.open('get', url, true);
      xhr.send(null);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
          var responseData = JSON.parse(xhr.responseText);
          //调用回调函数并传入响应到的json对象
          success(responseData);
        }
      }
    },

    /**
     * [loadImage 异步加载图片]
     * @param  {[String]} url     [包含图片路径数组的json文件url]
     * @param  {[Function]} success [每加载成功一张图片调用一次]
     * @param  {[Function]} failed   [可选的,加载失败调用函数]
     * @return {[void]}         [无返回值]
     */
    loadImage: function(url, success, failed) {
      var self = this;
      //使用异步加载的方式获取到JSON对象
      this._ajax(url, function(responseData) {
        //如果在返回的json对象中没找images属性 则抛出一个错误
        if (!responseData.images) {
          throw new Error('not find url array in resonse date');
        }

        //记录总共需要加载图片的张数及当前加载到的张数
        var totalImage = responseData.images.length,
          currentLoadedImage = 0;

        //遍历图片url数组 每次新建一个Image对象 使用src属性的特性
        //向服务器发送请求 没加载成功一张图片 把加载成功图片的信息
        //保存在this.images对象中 并且调用一次传入的成功的回调函数
        //如果加载失败且传入了失败的回调函数 就调用失败的回调函数
        responseData.images.forEach(function(item) {
          var img = new Image();
          //一个image对象只要设置src属性就会立即自动向服务器请求数据
          img.src = item.src;
          img.onload = function() { //加载成功
            currentLoadedImage++;
            self.images[item.name] = this;
            //加载成功的回调函数 传入两个参数
            //第一个为当前已加载的总张数 第二个为共需要加载的张数
            success(currentLoadedImage, totalImage);
          }
          img.onerror = function() { //加载错误
            if (failed) failed();
          }
        })
      })
    }
  })
})();
