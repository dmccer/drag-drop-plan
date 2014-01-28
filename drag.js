function initdrag()
{	
	var forEach = function (context, fn) {
		[].forEach.call(context, fn)
	}

	var plans = document.querySelectorAll('.to-plan-list .plan');
  	var $planTable = document.querySelectorAll('.planed-table')[0];
  	var $axisX = document.getElementById('axisX');
  	var extraX = ($planTable.offsetWidth - $planTable.clientWidth) / 2;
  	var extraY = ($planTable.offsetHeight - $planTable.clientHeight) / 2;
  	var axisXLen = $planTable.clientWidth / 50;
  	var axisYLen = $planTable.clientHeight / 50;
  	var axisAreaList = [];
  	var sourceEls = [];

		var handleStart = function (e) {
			console.log('dragstart: ', e);

			e.dataTransfer.setData('selector', '.plan[data-id="' + e.target.getAttribute('data-id') + '"]')
		};

  	var handleDragOver = function (e) {
  		if (e.preventDefault) {
  			e.preventDefault();
  		}

  		return false;
  	};

  	var handleDragEnter = function (e) {
  		console.log('dragenter:', e);
  		this.classList.add('over');
  	};

  	var handleDragLeave = function (e) {
  		console.log('dragleave:', e);
  		this.classList.remove('over');
  	};

  	var findArea = function (key, value) {
  		return axisAreaList.filter(function (axisArea) {
  			return axisArea[key] === value;
  		});
  	};

  	var getAxisAreasByY = function (axisY) {
  		var axisAreas = findArea('y', axisY);

  		if (axisAreas.length) {
  			axisAreas.sort(function (a, b) {
  				return a.x - b.x;
  			});
  		}

  		return axisAreas;
  	};

  	var getMaxAxisX = function (axisY) {
  		var axisAreas

  		if (typeof axisY === 'number') {
  			axisAreas = getAxisAreasByY(axisY);	
  		} else if (typeof axisY === 'object') {
  			axisAreas = axisY;
  		}
  		
  		var len = axisAreas.length;
  		var lastAxisArea

  		if (len) {
  			lastAxisArea = axisAreas[len - 1]
  			return lastAxisArea.x + lastAxisArea.w;
  		}

  		return 0
  	};

  	var calcAxisX = function (axisY, mousePos, sourceEl) {
  		var axisAreas = getAxisAreasByY(axisY);

  		if (!axisAreas.length) {
  			return 0;
  		}

  		if (axisAreas.length === 1) {
  			return axisAreas[0].el === sourceEl ? 0 : axisAreas[0].x + axisAreas[0].w + 1;
  		}

			var prev,next, i;
			var len = axisAreas.length;
			var maxAxisX = getMaxAxisX(axisAreas);

			if (mousePos.x > maxAxisX) {
				return maxAxisX + 1;
			}

			if (mousePos.x < axisAreas[0].x) {
				return 0;
			}

			for (i = 0; i < len; i++) {
				if (axisAreas[i].x + axisAreas[i].w - mousePos.x <= 0) {
					prev = axisAreas[i];
				} else {
					next = axisAreas[i];
					break;
				}
			}

			if (next.x - mousePos.x > 0) {
				return prev.x + prev.w + 1
			}
			
			return maxAxisX + 1;
  	};

  	var repain = function (axisY) {
  		var axisAreas = getAxisAreasByY(axisY);
  		var len = axisAreas.length;
  		var i = 0;
  		var total = 0;

  		for (i = 0; i < len; i++) {
  			axisAreas[i].x = total;
  			total += axisAreas[i].w + 1;
  			setXPos(axisAreas[i].el, axisAreas[i].x);
  		}
  	};

  	var setXPos = function (el, x) {
  		el.style.left = x + 'px';
  	};

  	var listByAxisY = function () {
  		var yList = {};
  		var prefix = '_y-';

  		axisAreaList.forEach(function (axisArea) {
  			yList[prefix + axisArea.y] = yList[prefix + axisArea.y] || [];
  			yList[prefix + axisArea.y].push(axisArea.x)
  		});

  		for (var key in yList) {
  			if (yList.hasOwnProperty(key)) {
  				yList[key].sort(function (a, b) {
  					return a - b;
  				})
  			}
  		}

  		return yList
  	};

  	var handleDrop = function (e) {
  		console.log('drop:', e);

  		if (e.stopPropagation) {
  			e.stopPropagation();
  		}

  		var sourceEl = document.querySelector(e.dataTransfer.getData('selector'));

  		var mousePos = {
  			x: e.offsetX - extraX,
  			y: e.offsetY - extraY
  		};

  		var sourceSize = {
  			w: sourceEl.offsetWidth,
  			h: sourceEl.offsetHeight
  		};

  		var elDestPos = {
  			x: mousePos.x - sourceSize.w / 2,
  			y: mousePos.y - sourceSize.h / 2
  		};

  		var axisX = 0;
  		var axisY = Math.round(elDestPos.y / 50);

  		axisX = calcAxisX(axisY, mousePos, sourceEl);
  		
  		var axisArea = findArea('el', sourceEl);
  		var needRepain = axisX <= getMaxAxisX(axisY);

  		if (axisArea && axisArea.length) {
	  		axisArea[0].x = axisX;
  			axisArea[0].y = axisY;

  			if (needRepain) {
	  			repain(axisY);
	  		}
  		} else {
  			axisAreaList.push({
	  			x: axisX,
	  			y: axisY,
	  			w: sourceSize.w,
	  			el: sourceEl
	  		});
  		}

  		e.target.appendChild(sourceEl);

  		sourceEl.style.left = axisX + 'px';
  		sourceEl.style.top = (axisY * 51) + 'px';

  		this.classList.remove('over');

  		var yList = listByAxisY();
  		var innerText = '';

  		for (var key in yList) {
  			if (yList.hasOwnProperty(key)) {
  				innerText += key.replace('_y-', 'y') + '-' + yList[key][yList[key].length - 1] + ' ';
  			}
  		}

  		$axisX.innerText = innerText

  		return false;
  	}

  	var handleDragEnd = function (e) {
  		console.log('dragend:', e);
  		
  		forEach(plans, function ($plan) {
		    $plan.classList.remove('over');
		  });
  	};

  	forEach(plans, function ($plan) {
  		$plan.addEventListener('dragstart', handleStart, false);
  		$plan.addEventListener('dragleave', handleDragLeave, false);
  		$plan.addEventListener('drop', function (e) {
  			e.preventDefault();
  			e.stopPropagation();
  			return false;
  		}, false);
  		$plan.addEventListener('dragend', handleDragEnd, false)
  	});

		$planTable.addEventListener('dragenter', handleDragEnter, false)
		$planTable.addEventListener('dragover',handleDragOver, false)
		$planTable.addEventListener('drop', handleDrop, false)
}