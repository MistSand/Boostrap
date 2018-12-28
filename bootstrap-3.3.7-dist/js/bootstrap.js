/*!
 * Bootstrap v3.3.7 (http://getbootstrap.com)
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under the MIT license
 */

if (typeof jQuery === 'undefined') {//判断 传入的jQuery对象是否为空
  throw new Error('Bootstrap\'s JavaScript requires jQuery')// 为空则抛出异常 得到：js是可以抛出异常的
}

+function ($) {
  'use strict';//？
  var version = $.fn.jquery.split(' ')[0].split('.')//得到 该jQuery对象的版本号 
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 3)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4')//判断版本号是为1.9.1及以上，否则抛出异常
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.7
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
//Bootstrap 自带的 JavaScript插件的动画效果几乎都是使用css过度实现的，而其中的transition.js就是为了判断当前使用的浏览器是否支持css过度
//就是判断支不支持transitionend事件而已

/*
	疑问：
	1、什么时css过度 实现动画效果
	2、什么是transitionend事件
*/


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================
//比如 使用低版本的 Chrome 浏览器的话，拿的得到的对象就是{end：'webkitTransitionEnd'}这样；如果使用IE 8 则是false，然后就可以添加该事件的回调函数了：
  function transitionEnd() {//过度结束事件室友兼容性的，所以专门创建一个方法，来获取每个浏览器兼容的TransitionEnd（用的应当是状态模式）
    var el = document.createElement('bootstrap')//创造元素 bootstrap 用于测试

    var transEndEventNames = {//按照当前的主流浏览器趋势总共需要判断四种不同前缀的属性名称：
      WebkitTransition : 'webkitTransitionEnd',//低版本的Chrome 和 Safari(WebKit引擎的浏览器，后续可深入研究)
      MozTransition    : 'transitionend',//火狐
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.) ie 8 不支持过度 
  }
  /*
	疑问：
	1、document 对象指向的是什么
	2、el对象是创建的，不是会为空吗？为何能得到el.style[name]的值？createElement方法的作用
*/

  // http://blog.alexmaccaw.com/css-transitions
  /*事件名称的问题基本解决了，但是这个事件有个问题就是有时根本不会触发，这是因为属性值没有发生变化或没有绘制行为发生。要确保每次回调都会被调用，
  我们增加一个定时器即可：模拟事件结束*/
  $.fn.emulateTransitionEnd = function (duration) {//放在jquery的$.fn对象下
    var called = false// transitionend 事件是否已经被触发的表示 触发true 未触发false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })// 表示已触发
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }// 未触发，强制其触发
    setTimeout(callback, duration)//一段时间后检测是否触发
    return this
  }

	/*
	疑问：
	1、jquery的$.fn对象是什么，有什么作用？包含了什么？
	2、$(this).one() 是什么方法？
	3、emulateTransitionEnd这个属性什么时候会用到？传的参数duration是什么？
	4、trigger方法：触发被选元素的指定事件类型，$(selector).trigger(event,[param1,param2])
		event 指定的事件，param参数
	5、DOM树冒泡？
*/

  $(function () {
    $.support.transition = transitionEnd()//挂载到$.support下面

    if (!$.support.transition) return //说明不支持过度 直接返回
	//支持过度，执行下面代码
    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/*该方法的作用是一段时间（就是过度持续的时间 transition-duration）过后如果 transitionend事件没有发生则强制在该元素上触发这个事件*/

/*
	疑问：
	1、上一段代码的语法是什么意思 $(function(){...})
	2、$.support 是什么？
	3、emulateTransitionEnd这个属性什么时候会用到？传的参数duration是什么？
*/

/* ========================================================================
 * Bootstrap: alert.js v3.3.7
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';//使用严格模式 执行js代码

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'//疑问，bootstrap的data类css	//解答，alert为alert警告框事件选择器
  var Alert   = function (el) {//alert警告框构造函数
    $(el).on('click', dismiss, this.close)//on 方法的绑定语法，中间的dissmiss是什么意思？
	//选择器绑定点击关闭alert警告框的事件，是说在$(el)的子元素中有dissmiss属性的元素被点击时，$(el)元素执行close方法
  }

  Alert.VERSION = '3.3.7'//版本号

  Alert.TRANSITION_DURATION = 150//？//解答，过渡时间 为了让警告框在关闭时表现出动画效果

  /*
	主要方法：
	前期目的是获取这个控件对应的DOM
	分别通过以下三个途径：
	1、data-target自定义属性
	2、href的属性中的hash（多为简单的ID选择器或类选择器）
	3、这个按钮的直属父节点
  */

  Alert.prototype.close = function (e) {//在alert原型上添加close方法
    var $this    = $(this)//当前对象包装成jquery对象	//？什么是jquery对象
    var selector = $this.attr('data-target')//获得jquery对象的data-target属性的值	//？data-target属性主要有什么作用

    if (!selector) {//如果selector为false	//如果没有获取到
      selector = $this.attr('href')//得到href属性值	//就获取href属性值
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7//替换非法字符，这个语法不太明白
    }

    var $parent = $(selector === '#' ? [] : selector)//如果selecttor是#则返回空数组，否则返回自身

    if (e) e.preventDefault()//取消事件的默认动作 a标签的链接不会打开

    if (!$parent.length) {//如果$parent对象的长度为false，没有长度
      $parent = $this.closest('.alert')//找到祖先中类名为alert的元素
    }
	//前段代码的目的就是得到控件对应的DOM
    $parent.trigger(e = $.Event('close.bs.alert'))//触发自定义的close.bs.alert事件	//将e重新赋值
	//在移除前触发close自定义事件
    if (e.isDefaultPrevented()) return//e被重新赋值为jquery事件对象 e.isDefaultPrevented()值为false 不会走return语句
	//为 true 直接返回
    $parent.removeClass('in')//删除 具有动画效果的 类

    function removeElement() {
      // detach from parent, fire event then clean up data
	  //datach删除匹配元素，但是不从jquery对象上删除
	  //remove删除元素，元素对应的事件，数据，全部移除
	  //元素动画效果结束后触发closed.bs.alert事件，并移除
      $parent.detach().trigger('closed.bs.alert').remove()//在移除后触发closed自定义事件
    }
	//探测浏览器是否支持transition，以及祖先元素是否包含fade类，如果都支持，在关闭alert警告框时，会有动画效果，如果不支持直接删除

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }

	/*
	疑问：
	1、data-dismiss 这个属性在bootstrap对应的作用？
	2、close方法中的参数 e 是什么？
	3、data-target 这个属性在bootstrap对应的作用？
	4、$this 对象指向什么？其中包含什么？
	5、close.bs.alert 事件又是什么，什么时候定义的？
	6、isDefaultPrevented 方法的作用？
	7、preventDefault 方法：阻止元素发生默认的行为（例如，点击提交俺就时阻止对表单的提交，或者阻止a标签跳转url）
	8、!$parent.length 这个语法得出来的结果是什么？
*/


  // ALERT PLUGIN DEFINITION
  // =======================
  //对外暴露的函数
  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')//获取元素上设置的数据

      if (!data) $this.data('bs.alert', (data = new Alert(this)))//如果没有对应的设置数据，则重新设置
      if (typeof option == 'string') data[option].call($this)//判断传入的option是否为string类型，是则调用Alert实例的对应方法
    })
  }
	//保存一份 alert 引用	//在jQuery上定义alert插件，并重设插件构造器
  var old = $.fn.alert
	  //保留其他插件的$.fn.alert代码（如果定义），以便在noConflict之后，可以继续使用该旧代码
	//jquery实例上的alert方法，当调用该方法是遍历所有的选中的元素，设置对应的data，并调用其原型的close方法
  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert	//并重设插件构造器，可以通过该属性获取插件的真实类函数

	  /*
	疑问：
	1、data 方法作用和用法？
	2、call 方法的作用和用法？解释：
	3、bs.alert 元素中包含了什么数据
	4、jQuery 的$.fn的语法
*/


  // ALERT NO CONFLICT
  // =================
	//当alert方法冲突时，调用此方法避免冲突
  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============
	//在document上绑定事件，通过jquery的off方法，可以解除该事件
  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)
	//这段代码的解释是：在文档document范围内，添加了属性dismiss（[data-dismiss="alert"]）的元素，在单击时，会触发close方法
  //所以，只要在警告框中的删除标签上加上data-dismiss="alert" 就能自动绑定close方法，实现单机标签就能去掉警告框的效果

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.7
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================
//定义Button对象，构造函数
  var Button = function (element, options) {//传入要触发的元素和调用options选项参数
    this.$element  = $(element)//元素
    this.options   = $.extend({}, Button.DEFAULTS, options)//合并默认参数
	//jQuery的扩展方法extend，插件必备：将options合并到Button.DEFAULTS中
    this.isLoading = false//是否等待标志？//是否加载
  }

  Button.VERSION  = '3.3.7'

  Button.DEFAULTS = {
    loadingText: 'loading...'//默认loading时的文本内容
  }
//设置button状态，所有的自定义参数都使用这个方法
  Button.prototype.setState = function (state) {//方法设置状态
    var d    = 'disabled'//禁用//按钮需要禁用时使用它，先赋值一个临时变量
    var $el  = this.$element	//当前元素
    var val  = $el.is('input') ? 'val' : 'html'//获得元素内容，如果是input就获得val，不是就直接获取html
    var data = $el.data()//获得元素内容//获取当前元素的自定义属性，即所有以data-开头的属性

    state += 'Text'
	//组装下面需要用到的属性，比如传入loading，则组装成loadingText，在下面就查找 data-loading-text属性

    if (data.resetText == null) $el.data('resetText', $el[val]())//？resetText参数的意思//如果data没有restText绑定，则创建
//如果data里不包含data-rest-text值，则将当前元素的值赋给data-reset-text临时存放，以便过后再恢复使用它
    // push to event loop to allow forms to submit
	 //$.proxy()该方法通常用于向上下文指向不同对象的元素添加事件。保证了this指向，避免作用域改变而导致错误

	 //不阻止事件，以允许表单的提交
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])
	//给元素赋新值，先从自定义属性里查询，查询不到再在options里查询（可以做个示范之后debug）

      if (state == 'loadingText') {//如果状态时等待状态，则按钮不能点击，就是disable状态
        this.isLoading = true	//设置加载状态为true
        $el.addClass(d).attr(d, d).prop(d, true)//添加class="disabled" disabled="true"//禁用该元素
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d).prop(d, false)//移除上面添加的属性
		//如果不是loading，则删除disabled样式和disabled属性
      }
    }, this), 0)
  }

	 /*
	疑问：
	1、$el.is('input') ? 'val' : 'html' 如果不是input获取到的html是什么样的？
	2、$.proxy 方法
	3、if (state == 'loadingText') { 之后的一段代码，可以研究的是，加入为什么要class 和 attr一起设置
*/
	//实现按钮切换效果
  Button.prototype.toggle = function () {//button定义的第二个主要方法，作用不明
    var changed = true	//设置change标记
    var $parent = this.$element.closest('[data-toggle="buttons"]')//获得button属性的DOM
	//closest表示从this.$element开始检索拥有data-toggle="buttons"属性的标签
	//查找带有[data-toggle="buttons"]属性的最近父元素

    if ($parent.length) {//如果获取到了DOM
		//区分radio checkbox按钮，active是规定好的类样式
      var $input = this.$element.find('input')//找到元素中的输入框
      if ($input.prop('type') == 'radio') {//是否是 单选框
        if ($input.prop('checked')) changed = false//被选中那个，将选中变为false？为啥相反？
		//判断如果该radio已经是被选中的，则不需要其他操作

        $parent.find('.active').removeClass('active')//在父元素中remove 掉 active这个class
		//否则，找到同级元素是否为active的，删除其选中效果

        this.$element.addClass('active')//在该元素中添加calss
      } else if ($input.prop('type') == 'checkbox') {//多选框
        if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
			//如果多选框被选中而且没有选中效果，就把添加属性active
        this.$element.toggleClass('active')
      }
      $input.prop('checked', this.$element.hasClass('active'))
      if (changed) $input.trigger('change')
    } else {//如果 没有获取到DOM
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))//给aria-pressed属性赋值//arai盲人无障碍阅读属性
      this.$element.toggleClass('active')
    }
  }

   /*
	疑问：
	1、$parent.length 为什么要用这种判断，来判断是否获取到元素？
		猜测，获取到的元素可能是一个数组，只是判断该对象是否为空，不能判断数组长度是否为空，也没有意义
	2、prop方法：设置或返回被选元素的属性和值
	3、active这个class有什么作用？为什么要移除掉？为什么要添加？
	4、toggleClass 方法：对设置或移除被选元素的一个或多个类进行切换
	5、这一段判断的逻辑很绕，可以研究
*/


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {//定义外放接口
    return this.each(function () {
      var $this   = $(this)//保存this作用域
	  //判断是否初始化过的依据
      var data    = $this.data('bs.button')//data() 方法向被选元素附加数据，或者从被选元素获取数据。
      var options = typeof option == 'object' && option//？不理解语法
	//如果option为object类型和option参数值，返回true，否则返回false
      if (!data) $this.data('bs.button', (data = new Button(this, options)))//没有就重新构造一个对象

      if (option == 'toggle') data.toggle()//执行toggle方法
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin//在jquery原型上定义button方法
  $.fn.button.Constructor = Button//重写jqyery原型自定义方法的构造器名


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)//在document上绑定button效果
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {//属性名为button的绑定点击效果
      var $btn = $(e.target).closest('.btn')
      Plugin.call($btn, 'toggle')
      if (!($(e.target).is('input[type="radio"], input[type="checkbox"]'))) {//不是 单选、多选按钮
        // Prevent double click on radios, and the double selections (so cancellation) on checkboxes
        e.preventDefault()
        // The target component still receive the focus
        if ($btn.is('input,button')) $btn.trigger('focus')//之后的代码好像于聚焦效果有关
        else $btn.find('input:visible,button:visible').first().trigger('focus')
      }
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

		  /*
	疑问：
	1、closest方法
	2、call方法
	
*/

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.7
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
// data-interval:轮播图自动轮播的等待时间，如果为false则不自动轮播，默认为5000ms
//data-pause:指定鼠标停留在轮播图上是否停止轮播离开后继续自动轮播
//data-wrap:指定是否持续轮播

+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================
	//构造器 
  var Carousel = function (element, options) {//参数 元素 和 行为
    this.$element    = $(element)//容器元素，因为不管单击哪个，最终都会转换到data-ride="carousel"容器元素
    this.$indicators = this.$element.find('.carousel-indicators')//查找.carousel-indicators的元素//查找小圆圈指示符元素集合
    this.options     = options
	//插件运行参数，优先级最高的是所单击元素上的data-属性，然后是容器的data-属性
    this.paused      = null//暂停
    this.sliding     = null//滑动
    this.interval    = null//轮播切换的时间间隔
    this.$active     = null//当前轮播的item
    this.$items      = null//存储所有轮播图片的对象
	//如果this.options.keyboard为true，那么就监听键盘事件
	//keydowm.bs.carousel是bootstrap自己设定的函数事件，类似于"click"这样的，后面是函数
	//$.proxy 描述：接受一个函数，然后返回一个新函数，并且这个新函数始终保持了特定的上下文语境。
	//所以实现的功能是在this.keydown中强制执行this。this.keydown是prototype中的一个函数
	//$.proxy方法 调用this对象上的keydown方法 //把该方法绑定到keydown.bs.carousel上
    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))//允许键盘控制方向的话，就调用keydown事件
		
	//不是移动设备（不存在ontouchstart事件），那么当options.pause == 'hover'时实现鼠标的悬停暂停
    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element//鼠标具有暂停效果，且，不存在ontouchstart元素时，就绑定鼠标事件
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))//绑定鼠标进入时暂停效果
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))//绑定鼠标离开时恢复效果
  }

	 /*
	疑问：
	1、proxy方法:强制执行前一个参数对象中的，后一个参数同名的方法//这种情况下为什么使用proxy方法，对proxy方法得理解不够深入
	
*/

  Carousel.VERSION  = '3.3.7'

  Carousel.TRANSITION_DURATION = 600//每一个轮播默认的运行事件时600s

  Carousel.DEFAULTS = {
    interval: 5000,//默认滚动时间间隔5s
    pause: 'hover',//默认鼠标暂停效果
    wrap: true,//默认是连续播放
    keyboard: true//默认键盘可以控制轮播方向
  }
	//实现按键 轮播滚动功能
  Carousel.prototype.keydown = function (e) {
	  //如果忽略大小写的input和textarea匹配目标事件的名称，那么就返回无效
	  //本质是用正则表达式验证目标事件的名字是不是input或者textarea
    if (/input|textarea/i.test(e.target.tagName)) return//？
    switch (e.which) {
      case 37: this.prev(); break//按钮码为 37 前一页
      case 39: this.next(); break//按钮码为 39 下一页
      default: return
    }
	//告诉浏览器，该方法的默认函数被阻止了，不允许再次运行，只能执行我规定的函数
    e.preventDefault()//去掉默认效果
  }
	//实现 轮播滚动功能//开启轮播（默认从右向左）
	//循环轮播，清除定时器并重新设置定时器
	//此函数用于控制组件开始轮转，除了手动js调用，在鼠标触发mouseleave事件时也会调用
  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)//有触发事件且没有暂停，任意一个为真，都执行移除定时器操作
	//如果没传e，将paused设置为false// || 理解为前一个为false时执行后面代码
    this.interval && clearInterval(this.interval)//就移除定时器，具体如何？
	//如果设置了interval间隔，就清除它// && 理解为前一个为true，就执行后面的代码

	//如果设置了options.interval间隔，并且没有暂停
	//就将在下一个间隔之后，执行next方法（播放下一张图片）
    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
		//这段语法是什么意思？//将 轮播时间间隔 输入到next方法中，并且将时间间隔赋值给interval
		//如果没有暂停，并且时间间隔不为空，那么就设置定时器继续轮播

    return this//返回this,以便于链式操作
  }

	/*
	疑问：
	1、&& 的语法如何解读？//猜测 前面的为true才执行后面的代码
	2、parent方法 所得到的对象：获得当前匹配元素集合中的每个元素的父元素，使用选择器进行筛选是可选的
		沿着DOM树向上遍历单一层级
	3、if (/input|textarea/i.test(e.target.tagName)) return//这段语法的含义与作用
	
*/
	//得到当前item的下标方法//判断当前图片在整个轮播图片集的索引
	//获取轮播项索引值
	//就是找到当前元素的或者下一个上一个元素，赋值给item然后看item的父级元素有几个含有.item类的子元素，将这个jQuery对象赋值给this.items
  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')//得到item 的元素
	//返回值是这个对象中的当前item元素，或者活动中的元素，也就是正在轮播的元素相对于其他指定元素的位置
	//index() 方法返回指定元素相对于其他指定元素的index位置
    return this.$items.index(item || this.$active)//返回当前item的下标？
  }
	//根据方向得到下一个item
  Carousel.prototype.getItemForDirection = function (direction, active) {//参数 方向 和 未知
    var activeIndex = this.getItemIndex(active)//得到active的下标//取得当前active形参指定图片的索引
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))//是否到界限了
    if (willWrap && !this.options.wrap) return active//到界限了，而且不支持循环，就直接返回当前item
    var delta = direction == 'prev' ? -1 : 1//下一次的跳转的间隔 如果向前就-1 先后就+1
    var itemIndex = (activeIndex + delta) % this.$items.length//得到下一个下标
    return this.$items.eq(itemIndex)
  }
	//滚动效果，从当前item到指定item//直接轮播指定索引的图片
  Carousel.prototype.to = function (pos) {
    var that        = this//为了解决this指针变换的问题
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))//得到当前正在显示的item，的index
    if (pos > (this.$items.length - 1) || pos < 0) return//pos值不在图片组的范围内，直接返回
	//如果轮播图正在滚动切换，那么滚动到指定轮播项需要等到滚动切换结束（即监听到slid.bs.carousel）时才能继续操作
    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()
	//如果当前就是目标pos，则先暂停，然后继续执行
	//否则的话就看pos是否大于当前，如果是的话就时next不是就是perv
    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }
	//暂停功能
  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)//暂停开启//如果没传e，将paused设置为true（说明要暂停）
	//如果刚好为轮播添加next/prev类即将开始滚动并且浏览器支持动画，鼠标移入，那么直接触发动画结束自定义事件
	//如果有next或prev元素，并且支持动画，则触发动画
    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)//触发动画
      this.cycle(true)//开始执行
    }

    this.interval = clearInterval(this.interval)//清空定时器函数

    return this
  }
	//下一页功能
  Carousel.prototype.next = function () {
    if (this.sliding) return//如果轮播图正在滚动切换，那么上下轮播切换不做任何操作
    return this.slide('next')
  }
	//前一页功能
  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

	/*
	疑问：
	1、
	
*/
	//轮播的具体操作方法
	//实现滚动效果//滚动函数
  Carousel.prototype.slide = function (type, next) {// 参数 方向、下一个item
    var $active   = this.$element.find('.item.active')//得到当前显示的item
	//将next时可选参数，如果有就给$next，没有就用默认的，也就是当前页面
	//如果提供了next参数，就使用这个参数，如果没提供，就使用当前活动条目的下一个图片条目
    var $next     = next || this.getItemForDirection(type, $active)//语法可参考，得到下一个item
    var isCycling = this.interval//滚动时间
    var direction = type == 'next' ? 'left' : 'right'//下一步向左，反之向右
    var that      = this//获取当前调用者的this对象，防止作用域污染，（作用域污染可以研究）
	//如果next正是当前页面，那么设置轮播标记为false
    if ($next.hasClass('active')) return (this.sliding = false)//下一个就为当前显示item，直接返回

    var relatedTarget = $next[0]//得到结果是什么？
	//触发轮播即将开始自定义事件
    var slideEvent = $.Event('slide.bs.carousel', {//滚动效果对象//滚动之前，触发该自定方法
      relatedTarget: relatedTarget,
      direction: direction
    })
	//trigger() 方法触发被选元素的指定事件类型
    this.$element.trigger(slideEvent)//触发slide事件
    if (slideEvent.isDefaultPrevented()) return//如果要轮播的对象已经是高亮，直接返回不做处理

    this.sliding = true//标记轮播正在进行
	
    isCycling && this.pause()//如果有间隔，则暂停自动执行
	//处理小圆圈的高亮状态
    if (this.$indicators.length) {//如果有小圆圈指示符
      this.$indicators.find('.active').removeClass('active')//清除当前轮播图的active类
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
		  //获得当前高亮图片的索引，按照索引找到对的指示符
      $nextIndicator && $nextIndicator.addClass('active')//如果下一个轮播对象存在，那么就添加active类
		//如果找到的话，就添加active样式使其高亮
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"//轮动后触发自定义方法
	//如果支持动画，并且设置了slide样式
    if ($.support.transition && this.$element.hasClass('slide')) {//如果支持动画并且这个对象有slide这个类
      $next.addClass(type)//那么就把参数type提供的类赋值给他
	  //给要轮播的元素添加type类型样式（比如next、perv）
      $next[0].offsetWidth // force reflow//取得next【0】的宽度//重绘UI？
      $active.addClass(direction)//给要轮播的元素添加方法（如left、right）
      $next.addClass(direction)
		  //给当前活动元素绑定一次性动画事件，在该事件回调里执行以下操作
      $active
        .one('bsTransitionEnd', function () {
		  //在将要轮播的元素上，删除对应的type和方向样式（如next left 或者 prev right）
		  //然后添加active样式
          $next.removeClass([type, direction].join(' ')).addClass('active')//.join(' ')？
		//删除掉class并且用join组合起来，再加上active
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false//设置轮播状态结束
		//绑定定是函数，再0秒后触发指定函数
		//然后触发slid事件，这里使用setTimeout是确保UI刷新线程不被阻塞
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {//如果不支持动画
      $active.removeClass('active')//删除当前高亮元素上的active样式
      $next.addClass('active')//给要轮播的元素上添加高亮active样式
      this.sliding = false//设置轮播状态结束
      this.$element.trigger(slidEvent)//触发slid事件
    }

    isCycling && this.cycle()//如果有间隔，则重新开始（间隔后）自动执行

    return this//返回this，以便链式操作（这里的this是data-tide="carousel"容器元素）
  }

	/*
	疑问：
	1、isDefaultPrevented：返回指定的event对象上是否调用了preventDefault()方法
	
*/


  // CAROUSEL PLUGIN DEFINITION
  // ==========================
  //定义插件
  function Plugin(option) {
    return this.each(function () {//遍历所有符合规则的元素
      var $this   = $(this)	//当前触发元素的jQuery对象
      var data    = $this.data('bs.carousel')
		  //合并参数，优先级依次递增
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)//js方法直接触发轮播，跳转到指定轮播页
      else if (action) data[action]()//在点击上、下一个时触发轮播
      else if (options.interval) data.pause().cycle()//为什么要先暂停，再
    })
  }

  var old = $.fn.carousel
// 保留其他库的$.fn.carousel代码（如果定义的话），以便在noConflict之后，可以继续使用该老代码
  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
		//查找target，即所指定的折叠地区的id或者选择符，如果没有target，就使用href里的值
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return//如果目标元素没有carousel类，说明不是carousel容器，不做任何处理
	//合并target上的data-slide-to属性
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')//查找单击元素上是否有data-slide-to属性
    if (slideIndex) options.interval = false
	//如果存在，则取消间隔设置（因为单击data-slide-to意味着是手动触发行为，后续是不会循环播放的

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }
	//绑定触发事件
	//在带有data-slide或data-slide-to属性的元素上绑定事件
  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {//文档加载时，绑定load方法
    $('[data-ride="carousel"]').each(function () {//找出[data-ride="carousel"] 属性的div，该div就是轮播的父元素
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())//调用该元素的data方法？data方法为什么？
    })
  })

		  /*
	疑问：
	1、call ：
	
*/

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.7
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

/* jshint latedef: false */

+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================
	//构造器
  var Collapse = function (element, options) {//参数 折叠元素对象和定义的行为参数
    this.$element      = $(element)//当前折叠区域的元素
    this.options       = $.extend({}, Collapse.DEFAULTS, options)//合并参数
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')//定义含有该属性的对象
		//[data-toggle="collapse"] 获取到的是，可折叠元素的控件
    this.transitioning = null//该参数的作用？是否正在转换状态//是否正在执行显示/隐藏操作

    if (this.options.parent) {//如果含有父元素，则赋值
      this.$parent = this.getParent()//如果参数里指定了parent，则赋值它
    } else {//如果不包含，直接使用折叠元素赋值
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()//如果toggle属性为true，调用toggle方法
	//其实bootstrap.collapse插件，在显示的内容上，会有in类，不显示的内容上会collapse类
  }

  Collapse.VERSION  = '3.3.7'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true//默认值，是否支持折叠区域的显示状态反转
  }
//获取折叠区域的显示动画的打开方向，是从左向右（width），还是从上向下（height），默认为height
  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')//折叠区域元素上是否有width样式
    return hasWidth ? 'width' : 'height'
  }
//show方法用于显示折叠区域
  Collapse.prototype.show = function () {
	  //如果正在执行collapse操作，或者该折叠元素已经显示，就不做处理了
    if (this.transitioning || this.$element.hasClass('in')) return//如果处于切换状态或者已经展开，直接返回

    var activesData
		//如果parent存在（手风琴风格），则查找所有该元素内已经打开的折叠区域
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')
		//如果存在父元素，就获得已经展开的div

    if (actives && actives.length) {//如果找到已打开的折叠区域存在
      activesData = actives.data('bs.collapse')//查找该折叠区域上面的实例
	  //如果实例存在，并且正在执行相关的collapse操作，则直接返回
      if (activesData && activesData.transitioning) return//但是该对象正在切换状态，直接返回
    }

    var startEvent = $.Event('show.bs.collapse')//定义要触发的事件命名空间
    this.$element.trigger(startEvent)//执行展开之前的方法//在显示之前，触发该方法
    if (startEvent.isDefaultPrevented()) return//如果show事件的回调里阻止了继续操作，则直接返回

    if (actives && actives.length) {//？为什么要隐藏，因为要实现父元素的手风琴效果，先关闭所有打开的元素，再打开选中元素
      Plugin.call(actives, 'hide')//关闭所有找到的已打开的折叠区域
      activesData || actives.data('bs.collapse', null)//并且消除其上面的所有实例
    }

    var dimension = this.dimension()//得到开展方向

    this.$element
      .removeClass('collapse')//删除折叠区域上的collapse样式
      .addClass('collapsing')//然后再添加collapsing样式
		  [dimension](0)//将height设置为0，表示上下展开，如果是width，则表示左右展开
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1//便是正在处理collapse插件的显示工作
	//回调函数，用于处理完成状态
    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')//添加in样式，表示已显示，将height（或width）设置为auto
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')//触发自定义事件
    }

    if (!$.support.transition) return complete.call(this)//如果不支持动画，直接调用complete函数
	//获取表示折叠元素的scroll大小的方向，结果是scrollHeight或者scrollWidth//如何得到的？
    var scrollSize = $.camelCase(['scroll', dimension].join('-'))
	//延迟350毫秒才执行动画，动画结束以后，调用complete回调函数
	//并设置正常的高度或宽度，例如this.$element[height](this.$element[0][scrollHeight])
    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

	/*
	疑问：
	1、事件命名空间，如何理解？
	2、如果show事件的回调里阻止了继续操作？回调时什么意思？如何阻止？
	3、[dimension]('')与[dimension](auto)的效果是一样的吗？
	
*/

//hide方法用于隐藏折叠区域
  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return//正在变换，或者已经隐藏直接返回

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)//执行隐藏以前的自定义方法
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight//重绘折叠区域，得到实际高度

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1//有个知识点，再判断时 1为true 0为false
	//回调函数，用于处理完成状态
    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)//根据展开的方向，直接将height（或者width）设置为0
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }
//转换状态
  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }
//得到父元素
  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }
	//添加状态相关的class
  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {//转换元素和当前元素
    var isOpen = $element.hasClass('in')//转换元素是否处于打开状态

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }
//得到要转换的对象
  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {//遍历所有符合规则的元素
      var $this   = $(this)
      var data    = $this.data('bs.collapse')//获取自定义属性data-bs.collapse的值其实是collapse实例
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)//合并参数
		//如果实例不存在，并且options.toggle存在，且传入option为show/hide
		//则设施show为false，避免再string判断的时候执行data[option]
      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
		  //如果没有collapse实例，就初始化一个，并传入this
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()//如果传入的是字符串，则调用对应的方法
    })
  }

/*
	疑问：
	1、/show|hide/.test(option)语句的中，test方法：option字符串是否匹配show或者hide字符串
*/

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================
//初始化
  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)
	
    if (!$this.attr('data-target')) e.preventDefault()//如果不包含该属性，阻止其默认效果
//查找target，即所指定的折叠区域的id或者选择符，如果没有target，就使用href里的值
    var $target = getTargetFromTrigger($this)//获得该元素中定义的 折叠元素
    var data    = $target.data('bs.collapse')//查找上面是否已经有了collapse实例
    var option  = data ? 'toggle' : $this.data()//如果有，就将toggle作为option（也就是反转状态）
	//如果没有，手机触发元素上所有data-属性作为option配置参数

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.7
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'//弹出下拉菜单时的背景样式
  var toggle   = '[data-toggle="dropdown"]'//带有下拉菜单的属性
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)//绑定点击事件
  }

  Dropdown.VERSION = '3.3.7'
	//得到父元素//获取下拉菜单的父元素容器
  function getParent($this) {
    var selector = $this.attr('data-target')//得到该元素中的data-target属性
	//如果设置了target，就针对该traget元素进行处理

	//如果没有target，则查找href里设置的值
    if (!selector) {//如果该元素没有设置data-target属性
      selector = $this.attr('href')//得到href属性的值//如果没有target，则查找href里设置的值
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
	  //如果href属性有值，且是/#[A-Za-z]/格式，就替换多余的字符并赋值给selector
    }
	//如果上述两个步骤满足其一，设置其为parent元素（下拉菜单的容器元素）
    var $parent = selector && $(selector)//如果selector有值，则将该id对应的对象赋值给$parent
	//如果都不满足，就使用当前触发元素（$this）的父元素
    return $parent && $parent.length ? $parent : $this.parent()//该对象有值且有长度时返回该对象，没有时返回给定元素的父元素
  }
	//清空菜单（隐藏菜单）//关闭所有下拉菜单
  function clearMenus(e) {
    if (e && e.which === 3) return//事件编号为3时，直接返回，3代表什么意思？
    $(backdrop).remove()//清空.dropdown-backdrop样式的的元素//删除用于移动设备的背景
    $(toggle).each(function () {//有下拉菜单属性//根据选择器，遍历所有的dropdown标记，然后全部关闭
      var $this         = $(this)
      var $parent       = getParent($this)//得到该对象的父元素，或者data-target中指定的元素
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return//如果该父元素是打开的（下拉菜单是展开的），直接返回

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return
		  //如果该事件存在且为点击事件且触发事件的是输入框，如果$parent[0]包含e.target，则直接返回

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))//执行自定义的方法（隐藏前执行）

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))//执行自定义的方法（隐藏后执行）
    })
  }

	  /*
	  疑问：
		1、contains方法：方法用于判断指定元素内是否包含另一个元素。即判断另一个DOM元素是否指定DOM元素的后代
	  */
	//转换//控制下拉菜单的打开、关闭操作
  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)//得到当前触发的元素对象

    if ($this.is('.disabled, :disabled')) return//如果当前元素是禁用的，直接返回

    var $parent  = getParent($this)//得到触发元素的父元素
    var isActive = $parent.hasClass('open')//该父元素是否是展开的

    clearMenus()//清除下拉框//关闭所有其他的下拉菜单，即同一个页面，只允许同时出现一个下拉菜单
	
	//判断：单击时当前下拉菜单是否是打开状态
	//如果是，在clearMenus阶段就已经关闭了，所以就不需要再次关闭了
	//如果不是，说明默认状态时关闭状态，则需要展开下拉菜单
    if (!isActive) {//如果不是展开的
		//如果是移动设备，则使用dropdown-backdrop样式，因为移动设备不支持click单击委托
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
		  //有手机的触屏事件，且父元素最近的的元素不包含.navbar-nav这个样式 
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))//就创造一个div
          .addClass('dropdown-backdrop')//绑定dropdown-backdrop样式
          .insertAfter($(this))//？
          .on('click', clearMenus)//绑定点击清空菜单事件
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))//执行展开前的自定义事件

      if (e.isDefaultPrevented()) return//如果已经阻止了默认行为，就不再处理了。

      $this
        .trigger('focus')//获取焦点
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')//增加open样式，打开下拉菜单，因为menu在open样式内会自动显示
        .trigger($.Event('shown.bs.dropdown', relatedTarget))//执行展开后的自定义事件
    }

    return false//阻止该元素后续的默认行为
  }
	//按键方法//利用箭头控制下拉菜单（例如，按向下箭头的时候，打开下拉菜单）
  Dropdown.prototype.keydown = function (e) {
	  //如果按键不是Esc、或上下方向箭头，则忽略处理
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return
		//如果按键不属于/(38|40|27|32)/ 或者 该事件触发是输入框 直接返回

    var $this = $(this)

    e.preventDefault()//阻止默认行为
    e.stopPropagation()//阻止冒泡

    if ($this.is('.disabled, :disabled')) return//如果有禁用标记，则不做处理

    var $parent  = getParent($this)//得到父元素
    var isActive = $parent.hasClass('open')//判断是否展开
	//如果有open样式，或者没有open样式 但是按键是向下箭头的花，也打开下拉菜单
    if (!isActive && e.which != 27 || isActive && e.which == 27) {
		//如果没展开，且事件编号不是27 或者 事件展开且事件编号是27//具体情况是？
      if (e.which == 27) $parent.find(toggle).trigger('focus')//如果是27 找到当前焦点元素
	  //如果按了向下箭头，则给触发元素加上焦点
      return $this.trigger('click')//触发点击事件，默认单击事件，打开下拉菜单
    }

	//返回可以利用箭头选择的下拉菜单项
	//打开下拉菜单时，上下箭头只操作（选中）设置了role=menu（或role=listbox）的链接项
	//必须是可见的a链接，并且不包含分隔符
    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return//如果没有，则不做处理

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up	//按向上箭头的话，index减1
    if (e.which == 40 && index < $items.length - 1) index++         // down	//index++//按向下箭头的话，index加1
    if (!~index)                                    index = 0		//特殊意外情况，设置为第一个菜单项

    $items.eq(index).trigger('focus')	//给所选择的菜单项设置焦点
  }

	 /*
	  疑问：
		1、stopPropagation方法：阻止事件冒泡到父元素，阻止任何父事件处理程序被执行
		2、e.stopPropagation()//阻止冒泡 ？是什么意思？
	  */


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {//根据选择器，遍历所有符合规则的元素
      var $this = $(this)
      var data  = $this.data('bs.dropdown')//获取自定义属性dropdown的值
		
		//如果值不存在，则将Dropdown实例设置为data-dropdown的值
      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
		  //如果option传递了string，则表示要执行某个方法
		//比如传入了toggle，则要执行Dropdown实例的toggle方法，data["toggle"]相当于data.toggle();
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================
//绑定触发事件
  $(document)
	  //为声明式的HTML绑定单击事件，在单击以后先关闭左右的下拉菜单
    .on('click.bs.dropdown.data-api', clearMenus)
	//如果内部有form元素，则阻止冒泡，不做处理
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
	//默认行为，一般都要进行toggle操作（打开或关闭）
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
	//为触发元素和下拉菜单绑定keydown按钮事件，以便可以进行打开或者选择操作
	//toggle = [data-toggle=dropdown]表示所有带有自定义属性data-toggle="dropdown"的元素
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.7
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

//1.定义立即调用的函数
+function ($) {
  'use strict';//使用严格模式 ES5支持

  // MODAL CLASS DEFINITION
  // ======================
	//构造器
  var Modal = function (element, options) {//模态框对象的id 和 执行对象
	  //element表示modal弹出框容器及内部元素，options是设置选项
    this.options             = options//传进来的各种参数
    this.$body               = $(document.body)//当前页面的body对象
    this.$element            = $(element)//元素对象
    this.$dialog             = this.$element.find('.modal-dialog')//得到modal-dialog样式的元素对象
    this.$backdrop           = null//背景对象//modal下面的北京对象
									//默认情况下，不设置是否已经显示弹窗，
									
    this.isShown             = null//是否展示状态
    this.originalBodyPad     = null//？
    this.scrollbarWidth      = 0//？猜测横向滚动条
    this.ignoreBackdropClick = false//忽略背景点击
	//如果设置了remote，就加载remote制定的url内容到modal-content样式的元素内，并触发loaded.bs.modal事件
    if (this.options.remote) {//如果options存在remote属性
      this.$element
        .find('.modal-content')//找到modal-content样式的元素对象
        .load(this.options.remote, $.proxy(function () {//就加载remote制定的url内容
          this.$element.trigger('loaded.bs.modal')//？应该是执行loaded.bs.modal方法
        }, this))
    }
  }

  /*
	疑问：
	1、为何用$.proxy方法内定义trigger方法？用法的作用是什么？
  */

  Modal.VERSION  = '3.3.7'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,//背景是否可以点击关闭模态框
    keyboard: true,//按键Esc之后退出模态框
    show: true//是否显示，单击触发元素时打开弹窗
  }
	//反转弹窗状态
  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)//如果模态框是显示的，就隐藏，否则就显示
	//_relatedTarget？参数是什么？
  }
	//打开弹窗
  Modal.prototype.show = function (_relatedTarget) {//参数？
    var that = this//触发该方法的对象
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })
		//定义弹窗前的触发事件
    this.$element.trigger(e)//执行，显示模态框前的自定义方法

    if (this.isShown || e.isDefaultPrevented()) return//已经显示或者自定义方法阻止后续执行，直接返回

    this.isShown = true//将展示状态变为true

    this.checkScrollbar()//检查滚动条
    this.setScrollbar()//设置滚动条
    this.$body.addClass('modal-open')

    this.escape()//启动按键退出方法
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))
	//如果单机了元素内的子元素（带有[data-dismiss="modal"]属性），则关闭弹窗
    this.$dialog.on('mousedown.dismiss.bs.modal', function () {//绑定鼠标按下事件
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {//鼠标弹起（一次单击事件）
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true//？
      })
    })

    this.backdrop(function () {//绘制背景以后，处理以下代码
      var transition = $.support.transition && that.$element.hasClass('fade')
		//判断浏览器是否支持动画，并且弹窗是否设置了动画过渡效果（是否有fade样式）
      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }//如果modal弹窗没有父容器，则将它附加到body上

      that.$element
        .show()
        .scrollTop(0)//显示modal弹窗

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }//如果支持动画，强制刷新UI现场，重绘弹窗

      that.$element.addClass('in')//给modal弹窗添加in样式，和modal样式一起

      that.enforceFocus()//强制为弹窗设置焦点

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in//弹窗元素
          .one('bsTransitionEnd', function () {
			  //如果支持动画，则动画结束以后给弹窗内的元素设置焦点，并触发shown事件
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)//否则直接设置焦点，触发shown事件
    })
  }
	//关闭弹窗
  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()	//先阻止冒泡行为？什么是冒泡行为？

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)
		
    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')//取消所有的focusin.bs.modal事件

    this.$element
      .removeClass('in')	//删除in样式
      .off('click.dismiss.bs.modal')	//取消点击事件
      .off('mouseup.dismiss.bs.modal')	//取消鼠标弹起事件

    this.$dialog.off('mousedown.dismiss.bs.modal')	//取消背景对象的鼠标按下事件

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }
	//确保当前打开的弹窗处于焦点状态
  Modal.prototype.enforceFocus = function () {
    $(document)		
      .off('focusin.bs.modal') // guard against infinite focus loop//禁用所有的focusin事件，防止无限循环？如何防止
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (document !== e.target &&
            this.$element[0] !== e.target &&//如果处于焦点的元素不是当前元素
            !this.$element.has(e.target).length) {//或不包含当前元素
          this.$element.trigger('focus')
			  //如果处于焦点的元素不是当前元素（或不包含当前元素），则强制给当前元素设置焦点
        }
      }, this))
  }
	//绑定按键Esc键，是否退出处理
  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {//如果模态框是出现的，而且keyboard为true
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {//检测键盘事件，如果是Esc（keycode=27）键，则关闭
        e.which == 27 && this.hide()//如果按键是Esc，则调用隐藏方法
      }, this))
    } else if (!this.isShown) {//如果不是展开的，就移除keydown方法	//否则取消键盘事件检测
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }
	//
  Modal.prototype.resize = function () {
    if (this.isShown) {//如果是展开的，就执行handleUpdate方法
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {//不过不是移除resize.bs.modal 方法的绑定
      $(window).off('resize.bs.modal')
    }
  }
	//隐藏模态框
  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()//隐藏该模态框元素
    this.backdrop(function () {//清除背景
      that.$body.removeClass('modal-open')
      that.resetAdjustments()//清除背景？
      that.resetScrollbar()//清除滚动条
      that.$element.trigger('hidden.bs.modal')
    })
  }
	//删除背景，关闭弹窗时触发
  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()//如果存在背景，就删除背景元素
    this.$backdrop = null//把背景对象制空
  }
	//添加背景，打开弹窗时触发
  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''//如果有fade的calss ，就是有淡入淡出效果

    if (this.isShown && this.options.backdrop) {//如果已经展开，并且设置了backdrop参数
      var doAnimate = $.support.transition && animate//如果支持动画，并且有淡入淡出效果，则doAnimate为true
	//定义动画标识
	//在body上定义背景div元素，并附加fade标识以支持动画
      this.$backdrop = $(document.createElement('div'))//创造背景对象
        .addClass('modal-backdrop ' + animate)
        .appendTo(this.$body)
	//背景被单击时进行判断：如果backdrop参数为static，则强制讲弹窗设置为焦点；否则，关闭弹窗
      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {//绑定点击背景方法
        if (this.ignoreBackdropClick) {//如果忽略背景点击，点击背景直接不执行操作
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return//？
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()//
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow
		//如果支持动画，强制刷刷新UI现场，重绘弹窗
      this.$backdrop.addClass('in')

      if (!callback) return//如果没有回调，则直接返回
		//如果支持动画，则动画结束后执行回调函数；否则，直接执行回调函数？回调函数怎么定义
      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {//如果没展开，而且有背景
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()//移除背景
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

   /*
	疑问：
	1、callback方法
  */

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }
	//检查滚动条？
  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth//当前窗口的整体宽度
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8//如果当前窗体宽度不存在
      var documentElementRect = document.documentElement.getBoundingClientRect()//获得document元素距离页面四边的距离
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)//右距离 - 左距离 = 元素的宽
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth//document.body.clientWidth 可视部分的宽度 小于窗口宽度 则超出页面
    this.scrollbarWidth = this.measureScrollbar()
  }
	/*
	疑问：
	1、getBoundingClientRect 方法：这个方法返回一个矩形对象，包含四个属性：left、top、right和buttom分别表示元素各边与页面上边和左边的距离。
	2、Math.abs 方法：返回数的绝对值
  */
	//设置滚动条
  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)//？
    this.originalBodyPad = document.body.style.paddingRight || ''
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }
	//测量滚动条
  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth//总宽度 - 可视窗口宽度 = 滚动条宽度
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth//返回滚动条宽度
  }

	/*
	疑问：
	1、offsetWidth：元素的border+padding+content的宽度和高度
  */


  // MODAL PLUGIN DEFINITION
  // =======================
	//modal方法
  function Plugin(option, _relatedTarget) {//_relatedTarget？参数是什么意思？
    return this.each(function () {//根据选择器，遍历所有符合规则的元素
      var $this   = $(this)
      var data    = $this.data('bs.modal')//获取自定义属性bs.modal的值
	  //讲默认参数、选择器所在元素的自定义属性（data-开头）和option参数，这三种值合并在一起，作为options参数
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
		  //如果option传递了string，则表示要执行某个方法
		//比如传入show，则要执行modal实例的show方法
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============
//绑定触发事件
  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {//在拥有属性[data-toggle="modal"]的元素上绑定点击事件
    //检测所有拥有自定义属性data-toggle="modal"的元素上的单击事件
	var $this   = $(this)
    var href    = $this.attr('href')	//获取href属性值

	//获取 data-target属性值，如果没有，则获取href值，该值时所弹出的元素的id
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    //如果弹窗元素上已经有该弹窗实例（即弹出过一次了），则设置option值为字符串toggle
	//否则将remote值（如果有的话）、弹窗元素上的自定义属性集合、触发元素上的自定义属性集合，合并为option对象
	var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()//取出a标签的默认方法//如果a链接元素，则要阻止默认行为

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {//定义一次hide事件，给所单击元素加上焦点
        $this.is(':visible') && $this.trigger('focus')//？
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.7
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================
//构造器
  var Tooltip = function (element, options) {//触发元素本身 和 参数
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null
    this.inState    = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.7'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }
	//初始化方法
  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      this.$element.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.$viewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      if (that.$element) { // TODO: Check whether guarding this code with this `if` is really necessary.
        that.$element
          .removeAttr('aria-describedby')
          .trigger('hidden.bs.' + that.type)
      }
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var isSvg = window.SVGElement && el instanceof window.SVGElement
    // Avoid using $.offset() on SVGs since it gives incorrect results in jQuery 3.
    // See https://github.com/twbs/bootstrap/issues/20280
    var elOffset  = isBody ? { top: 0, left: 0 } : (isSvg ? null : $element.offset())
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null
      that.$arrow = null
      that.$viewport = null
      that.$element = null
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.7
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.7'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.7
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body)
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.7'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.7
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.7'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.7
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.7'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = Math.max($(document).height(), $(document.body).height())

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);
