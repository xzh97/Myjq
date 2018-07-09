/*
 * @Author: xzh 
 * @Date: 2018-05-10 15:41:59 
 * @Last Modified by: xzh
 * @Last Modified time: 2018-05-10 16:15:47
 */



//定义一个构造函数
function MyJq(arg) {
	//用this给实例化对象添加属性 elements用来存放找到的节点
	this.elements = [];
	//判断参数类型
	if( typeof arg == 'object' ){
		this.elements.push(arg);
	}
	else{
		this.elements = document.querySelectorAll(arg);
	}
}
MyJq.prototype = {
	//添加on事件方法
	on: function (type, fn) {
		for (var key = 0; key < this.elements.length; key++) {
			myAddEvent(this.elements[key], type, fn);
		}
		return $(this.elements);
	},
	//解绑事件
	off: function (type, fn){
		for (var key = 0; key < this.elements.length; key++) {
			RemoveEvent(this.elements[key], type, fn);
		}
		return $(this.elements);
	},

	//添加eq方法
	eq : function (index) {
		return $(this.elements[index]);
	},

	//添加attr方法
	attr : function (attr, value) {
		if (arguments.length == 2) {
			for (var key = 0; key < this.elements.length; key++) {
				this.elements[key][attr] = value;
			}
		} else {
			return this.elements[0][attr];
		}
	},

	//添加show，hide方法
	show : function () {
		for (var key = 0; key < this.elements.length; key++) {
			this.elements[key].style.display = 'block';
		}
		return $(this.elements);
	},
	hide : function () {
		for (var key = 0; key < this.elements.length; key++) {
			this.elements[key].style.display = 'none';
		}
		return $(this.elements);
	},

	//index函数
	index: function () {	
		return getIndex(this.elements[0]);
	},

	//css函数
	css:function (attr, val) {
		if(arguments.length == 2){
			for(var i=0; i<this.elements.length; i++){
				this.elements[i].style[attr] = val;
			}
		}else if( typeof attr == 'object'){
			for(var key in attr){
				for (var i = 0; i < this.elements.length; i++) {
					this.elements[i].style[key] = attr[key];
				}
			}
		}
		else{
			return getStyle(this.elements[0], attr);
		}
	},

	//val函数
	val:function(val){
		if (arguments.length) {
			for (var i = 0; i < this.elements.length; i++) {
				this.elements[i].value = val;
			}
		}
		else {
			return this.elements[0].value;
		}
	},

	//html函数
	html:function(val){
		if(arguments.length){
			for(var i=0; i<this.elements.length; i++){
				this.elements[i].innerHTML = val;
			}
		}
		else{
			return this.elements[0].innerHTML;
		}
	},

	//each函数
	each:function(fn){
		for(var i=0; i<this.elements.length;i++){
			fn.call(this.elements[i], i, this.elements[i]);
		}
	},

	//动画函数  不带运动时间，快速或什么
	animate:function(json,fn){
		for (var i = 0; i < this.elements.length; i++){
			startMove(this.elements[i],json,fn)
		}

	},

	//fadeIn
	fadeIn:function(){
		for (var i = 0; i < this.elements.length; i++) {
			startMove(this.elements[i], {opacity:100}, function(){
				this.style.display = 'block';
			})
		}
	},

	//fadeOut
	fadeOut: function () {
		for (var i = 0; i < this.elements.length; i++) {
			startMove(this.elements[i], { opacity: 0 }, function () {
				this.style.display = 'none';
			})
		}
	},
}

//运动函数。。。
function startMove(obj, json, fn) {
	//初始化速度
	var iSpeed = 0;
	//清除重复点击产生的定时器，清除上一次点击产生的定时器
	clearInterval(obj.oTimer);
	//开启定时器开始实现速度累加
	obj.oTimer = setInterval(function () {

		for (var key in json) {
			var iCurrent = 0;
			//当前距离
			if (key == 'opacity') {
				iCurrent = parseInt(parseFloat(getStyle(obj, key)) * 100);
				console.log(iCurrent);
			}
			else {
				iCurrent = parseInt(getStyle(obj, key));
			}

			//获取一个随距离缩短而越来越小的速度
			iSpeed = iSpeed > 0 ? Math.ceil((parseInt( json[key] ) - iCurrent) / 8) : Math.floor((parseInt( json[key] ) - iCurrent) / 8);

			//判断当前距离是否已经到达目标距离，到达则停止，即清除定时器
			if (iCurrent == parseInt( json[key] )) {
				clearInterval(obj.oTimer);
				if (fn) {
					fn.call(obj);
				}
			}
			//否则的话就用当前的距离累加速度
			else {
				if (key == 'opacity') {
					obj.style[key] = (iCurrent + iSpeed) / 100;
				} else {
					obj.style[key] = iCurrent + iSpeed + 'px';
				}

			}

		}

	}, 100)
}


//获取非行内样式
function getStyle(obj, attr){
	if (obj.currentStyle){
		return obj.currentStyle[attr];
	}
	else{
		return getComputedStyle(obj)[attr];
	}
}

//获取index
function getIndex(obj){
	var aBrother = obj.parentNode.children;
	for(var i=0; i<aBrother.length; i++){
		if(aBrother[i] == obj){
			return i;
		}
	}
}

//绑定事件的函数
function myAddEvent(obj,type,fn){
	if(obj.attachEvent){
		obj.attachEvent('on'+type,fn);
	}else{
		obj.addEventListener(type,fn);
	}
}

//解绑事件的函数
function removeEvent(obj, type, fn) {
	if (obj.detachEvent) {
		obj.detachEvent('on' + type, fn);
	} else {
		obj.removeEventListener(type, fn);
	}
}
//使用$符函数
function $(arg){
	return new MyJq(arg);
}

//通过class获取元素  oPrent是父元素节点 sClass是类名
function getByClass(oPrent,sClass){
	var obj = oPrent.getElementsByTagName('*');
	var arr = [];
	for(var key in obj){
		if(obj[key].className == sClass){
			arr.push(obj[key]);
		}
	}
	return arr;
}