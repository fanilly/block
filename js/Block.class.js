(function() {
  window.Block = Class.extend({
    init: function(row, col, blocks) {
      this.row = row;
      this.col = col;
      this.blocks = blocks;

      //game实例对象的属性
      this.ctx = game.ctx;
      this.images = game.actorManager.images;
      this.map = game.actorManager.map;

      this.allType = ["I", "L", "Z", "J", "O", "T"];
      //随机生成形状 随机生成形状的状态 随机颜色
      this.type = this.blocks[this.allType[Math.floor(Math.random() * this.allType.length)]];
      this.state = Math.floor(Math.random() * this.type.length);
      this.color = Math.floor(Math.random() * 7);

      //绑定键盘事件
      this.bindListener();
    },

    bindListener: function() { //绑定键盘事件
      //为键盘绑定事件 
      //按“上”键改变活动方块的状态
      //“左”、“右”键可以进行左右移动
      //按“下”键直接落到底部

      var self = this;
      window.addEventListener('keydown', function(e) {
        var keyCode = e.keyCode;
        switch (keyCode) {
          case 37:
            self.goTo('left');
            break;
          case 39:
            self.goTo('right');
            break;
          case 38:
            self.changeState();
            break;
          case 40:
            self.goDown();
            break;
          default:
            break;
        }
      });
    },

    update: function() {
      //更新方块 每次更新都要去判断是否还能继续下降
      //如果不能继续下降了 就把当前活动块数据存储至地图并删除当前块

      if (game.framesUtil.getTotalFrames() % 12 == 0) {
        this.row++;

        //当前活动方块的数据
        var blockShape = this.type[this.state];

        //记录形成当前活动方块的4*4矩阵中从0开始到
        //最后一个有填充形状的行的行号
        var hasContentRow = 0;
        for (var i = blockShape.length - 1; i >= 0; i--) {
          if (blockShape[i].indexOf('1') != -1) {
            hasContentRow = i;
            break;
          }
        }

        //如果第一个条件为真 怎表示下方有填充方块阻挡
        //第二个条件为真则表示已经已经下移到地图的最底部
        //连个任意为真 就表示移动到了最大单位 不能继续下移了
        //然后保存当前活动方块数据至map中 并删除当前活动方块
        if (this.existsCover(this.type[this.state], this.col) || this.row >= 24 - hasContentRow) {
          for (var i = 0; i < blockShape.length; i++) {
            for (var j = 0; j < blockShape[i].length; j++) {
              if (blockShape[i][j] != '0' && game.actorManager.map[this.row - 1 + i]) {
                game.actorManager.map[this.row - 1 + i][this.col + j] = this.color + 1;
              }
            }
          }
          game.actorManager.block = null;
        }
      }
    },

    render: function() { //渲染方块
      var blockShape = this.type[this.state];
      for (var i = 0; i < blockShape.length; i++) {
        for (var j = 0; j < blockShape[i].length; j++) {
          blockShape[i][j] != 0 && this.ctx.drawImage(this.images.cellblock, this.color * 20, 0, 20, 20, this.col * 20 + j * 20, this.row * 20 + i * 20, 20, 20);
        }
      }
    },

    /**
     * [existsCover 判断当前活动的方块如果在col列上是否会覆盖]
     * @param  {[Number]} col [列数]
     * @return {[void]}     [如果覆盖返回真 否则返回假]
     */
    existsCover: function(blockShape, col) {
      //判断是否覆盖的原理是 拿当前活动的块的数据
      //去和map中对应的行和列的数据进行比对 
      //只要两个对应的位置的数不是同时为0 就表示覆盖了
      var blockShape = blockShape;
      for (var i = 0; i < blockShape.length; i++) {
        for (var j = 0; j < blockShape[i].length; j++) {
          try {
            if (game.actorManager.map[this.row + i][col + j] != 0 && blockShape[i][j] != 0) {
              return true;
            }
          } catch (e) {
            continue;
          }
        }
      }
      return false;
    },

    /**
     * [goTo 向左或向右移动]
     * @param  {[String]} dir [合法值为'left','right']
     * @return {[void]}     [无返回值]
     */
    goTo: function(dir) {
      //每次不管是向左向右移动 都要判断允许移动的最大的值
      //移动的范围为 不许是移动的方块超出地图可视区
      //不许覆盖已经存在在地图上的块

      var tempArr = [];
      //当前活动方块的数据
      var blockShape = this.type[this.state];

      if (dir == 'left') {

        //如果是向左移动 首先计算出形成当前砖块形状的4*4的矩阵中
        //最先有填充形状的单位 然后就可以计算出最多向左移动的单位
        //也就是用0减去最先有填充形状的格子的下标
        for (var i = 0; i < blockShape.length; i++) {
          //如果字符串中存在1 就把第一个1出现的位置记录到数组中
          blockShape[i].indexOf('1') != -1 && tempArr.push(blockShape[i].indexOf('1'));
        }

        //最小的范围
        var minRange = 0 - tempArr.getMinValue();
        var testCol = this.col - 1 < minRange ? minRange : this.col - 1;

        //判断是否重合 如果没重合 则允许向左移动
        !this.existsCover(this.type[this.state], testCol) && (this.col = testCol);

      } else {
        //如果是向右移动 理同向左移动
        for (var i = 0; i < blockShape.length; i++) {
          blockShape[i].lastIndexOf('1') != -1 && tempArr.push(blockShape[i].lastIndexOf('1'));
        }
        //最大的范围
        var maxRange = 8 + (blockShape[0].length - 1 - tempArr.getMaxValue());
        var testCol = this.col + 1 > maxRange ? maxRange : this.col + 1;

        !this.existsCover(this.type[this.state], testCol) && (this.col = testCol);
      }
    },

    /**
     * [changeState 改变当前活动块的状态]
     * @return {[void]} [无返回值]
     */
    changeState: function() {
      //判断是否允许改变当前活动块的形状
      //可以先模拟改变形状 判断模拟出来的形状是否超出地图范围
      //或者是否和地图当前位置的填充重合 如果都不冲突
      //就允许改变形状 否则直接返回


      //模拟出来的状态
      var testState = (this.state + 1) % this.type.length;

      //超出边界
      if (this.col < 0 || this.col > 8) {
        return;
      }

      //短路运算 如果为真则没有重合 改变状态
      !this.existsCover(this.type[testState], this.col) && this.state++;
      this.state = this.state % this.type.length;
    },

    /**
     * [goDown 直接下到最底部]
     * @return {[void]} [无返回值]
     */
    goDown: function() {
    	var self = this;

    	//当前活动方块的数据
      var blockShape = this.type[this.state];
    	(function(){
    		self.row++;

        //记录形成当前活动方块的4*4矩阵中从0开始到
        //最后一个有填充形状的行的行号
        var hasContentRow = 0;
        for (var i = blockShape.length - 1; i >= 0; i--) {
          if (blockShape[i].indexOf('1') != -1) {
            hasContentRow = i;
            break;
          }
        }

        //如果到底部了 就结束递归并减去1回到上一个状态进行渲染
        if (self.existsCover(self.type[self.state], self.col) || self.row >= 24 - hasContentRow) {
        	self.row--;
        	return;
        }
    		arguments.callee();
    	})();
    }
  });
})();
