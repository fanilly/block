//对添加原型的方法进行优化
if (!Function.addMethods) {
  Function.prototype.addMethods = function(methods) {
    for (var method in methods) {
      this.prototype[method] = methods[method];
    }
  };
}

/**
 *  工具类
 * getRandomColor:获取随机颜色
 */
var Util = {
  /**
   * 获取随机颜色
   * --原理:将一个随机数通过toString(16)方法转换为一个16进制字符串
   * 如果字符串长度小于6进行补零操作
   * @return {[string]} [十六进制的颜色字符串]
   */
  getRandomColor: function() {
    var HASH = "#",
      ZERO = "0";
    var randColor = (Math.random() * 0xffffff << 0).toString(16);
    while (randColor.length < 6) {
      randColor = ZERO + randColor;
    }
    return HASH + randColor;
  }
};

/**
 *  关于数组原型的拓展
 * removeArrayItem:移除数组中元素
 */
Array.addMethods({
  /**
   * [removeArrayItem 移除数组中元素,有两个需求]
   * @param1:要移除的值或者要移除元素的下标
   * @param2 [optional]:可选的默认为要移除的值--
   *   --如果第一个参数为下标 则必须传入此参数 此参数可以为任意值 建议为'index' 见名知意
   * @return:{[Array]} [一个新的数组]
   */
  removeArrayItem: function() {
    var args = arguments,
      tempArr = new Array();
    if (args.length == 0) throw new Error('removeArrayItem need 1 or 2 parameter');
    if (args.length == 1) {
      this.forEach(function(item) {
        if (args[0] !== item) tempArr.push(item);
      });
    } else {
      this.forEach(function(item, index) {
        if (args[0] != index) tempArr.push(item);
      });
    }
    return tempArr;
  },

  /**
   * [getMinValue 获取数组中最小的值,该数组中的值必须为数值类型]
   * @return {[Number]} [数组中最小的值]
   */
  getMinValue: function() {
    //假设第一个值为最小值 然后与数组中的每个值做比对 
    //如果有比它小的值 它就等于那个比它小的值 
    var minValue = this[0];
    this.forEach(function(item, index) {
      if (minValue > item) {
        minValue = item;
      }
    });
    return minValue;
  },


  /**
   * [getMaxValue 获取数组中最大的值,该数组中的值必须为数值类型]
   * @return {[Number]} [数组中最大的值]
   */
  getMaxValue: function() {
    //假设第一个值为最大值
    var maxValue = this[0];
    this.forEach(function(item, index) {
      if (maxValue < item) {
        maxValue = item;
      }
    });
    return maxValue;
  }


});

/**
 * 关于DOM原型的拓展
 * setCss:设置css样式
 */
HTMLElement.addMethods({
  setCss: function(propertys) {
    for (var key in propertys) {
      this.style[key] = propertys[key];
    }
  }
});
