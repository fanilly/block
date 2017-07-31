(function() {
  window.ActorManager = Class.extend({
    init: function(images) {

      //图片及画布资源
      this.images = images;
      this.ctx = game.ctx;

      //方块数据及地图
      this.map = this._getData().map;
      this.blocks = this._getData().blocks;

      //当前活动的方块
      this.block = null;

      //分数
      this.score = 0;
      this.die = false;
    },
    createActor: function() {

    },
    action: function() {
      //渲染游戏界面背景
      this.ctx.drawImage(this.images.background, 0, 0);

      //判断是否有一行累积满了砖块
      //如果有 累积满的那一行消失 哪一行之上的行下移
      for (var i = 0; i < this.map.length; i++) {
        if (this.map[i].indexOf(0) == -1) {
          //记录分数
          this.score++;

          //清空填满的行
          for (var j = 0; j < this.map[i].length; j++) {
            this.map[i][j] = 0;
          }

          //交换位置	首先判断上一行是否全是空
          //如果全是空则无需下移 否则再下移
          this._exchange(i);
        }
      }

      //如果地图中的第一行有了累积 视为游戏死亡
      if (this.map[1].getMaxValue() != 0) this.die = true;

      //渲染累积的砖块
      for (var i = 0; i < this.map.length; i++) {
        for (var j = 0; j < this.map[i].length; j++) {
          if (this.map[i][j] != 0) {
            this.ctx.drawImage(this.images.cellblock, 20 * (this.map[i][j] - 1), 0, 20, 20, j * 20, i * 20, 20, 20);
          }
        }
      }

      //创建砖块
      this.block = this.block || new Block(-4, 5, this.blocks);
      this.block && this.block.update();
      this.block && this.block.render();
    },

    /**
     * [_exchange 交换行]
     * @param  {[Number]} index [当前消失行的行号]
     * @return {[void]}       [无返回值]
     */
    _exchange: function(index) {
      var self = this;
      var currentIndex = index,
        minIndex = 0;

      //找出map数组中最早有数据的行
      for (var i = 0; i < this.map.length; i++) {
        if (this.map[i].getMaxValue() != 0) {
          minIndex = i;
          break;
        }
      }

      //使用递归的方式使消失了填充的空行依次与上一行交换位置
      //直到空行的上面没有有填充的行为止
      (function() {
        var temp = self.map[currentIndex - 1];
        self.map[currentIndex - 1] = self.map[currentIndex];
        self.map[currentIndex] = temp;
        currentIndex--;
        if (currentIndex <= minIndex) {
          return;
        }
        arguments.callee();
      })();
    },

    /**
     * [_getData 获取数据]
     * @return {[Object]} [返回了一个包含地图数组和砖块对象的对象]
     */
    _getData: function() {
      var map = new Array(),
        blocks = new Object();

      //生成一个24行12列的数组 每个元素都为0
      var rowsLen = 24,
        colsLen = 12;
      for (var rows = 0; rows < rowsLen; rows++) {
        var temp = [];
        for (var cols = 0; cols < colsLen; cols++) {
          temp.push(0);
        }
        map.push(temp);
      }
      //测试使用
      // map.push([2, 3, 4, 2, 2, 0, 0, 2, 6, 6, 3, 3]);
      // map.push([2, 3, 4, 2, 2, 0, 0, 2, 6, 6, 3, 3]);

      //记录有几种砖块形状及它的每一种形态
      //然后转换为数组返回出去
      var blocksStr = {
        "I": "0100,0100,0100,0100|0000,1111,0000,0000",
        "L": "0100,0100,0110,0000|0000,1110,1000,0000|1100,0100,0100,0000|0010,1110,0000,0000",
        "Z": "0000,1100,0110,0000|0100,1100,1000,0000|1100,0110,0000,0000|0010,0110,0100,0000",
        "J": "0100,0100,1100,0000|1000,1110,0000,0000|0110,0100,0100,0000|0000,1110,0010,0000",
        "O": "0110,0110,0000,0000",
        "T": "0100,1110,0000,0000|0100,0110,0100,0000|0000,1110,0100,0000|0100,1100,0100,0000",
        "A": "1111,1001,1001,1111"
      };
      for (var key in blocksStr) {
        var tempArr = [];
        //首先将每一项以|(着重符)分割成数组
        //再遍历分割出来的数组 之后一','(逗号)分割成数组
        var temp = blocksStr[key].split('|');
        for (var i = 0; i < temp.length; i++) {
          tempArr.push(temp[i].split(','));
        }
        blocks[key] = tempArr;
      }

      //返回地图数组和砖块对象
      return {
        map: map,
        blocks: blocks
      }
    }
  })
})();
