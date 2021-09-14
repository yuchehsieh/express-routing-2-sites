var selectGoal = null;			//選取的目標
	var unit = {};					//子目標
	var modified = false;				//是否進行修改
	var reload = false;					//是否重新讀取
	var conceptNo = 1;					//概念序號
	var conceptSelected = "-1";			//作用中的概念ID
	var contentActive = "initial";		//選取概念內容的作用
	var setConnect = false;				//連結節點
	var nodes, edges, network;
	
	$(document).ready(function() {
		if(!sessionStorage.goals) {
			alert("抱歉，讀取不到您的專案資料，請重新登入。");
			location.href= "logout.html";
		}
		else {
			var goals = JSON.parse(sessionStorage.goals);
			for (var goalKey in goals) {	//載入目標概念圖項目
				$("#goal").append("<option>"+goalKey+"</option>");
			}
			
			if(sessionStorage.conceptMap){	//載入繪圖選單
				var conceptMap = JSON.parse(sessionStorage.conceptMap);
				
				var num = 0;	//ID編號
				if(conceptMap.concepts) {
					for (var className in conceptMap.concepts) {	//讀取概念
						num++;
						var divider = false;	//分隔線
						$("<div>").attr({"id":"col-"+num}).appendTo("#contentMenu");
						$("#col-"+num).append("<h2 class=\"pure-menu-heading\">"+className+"</h2>");
						$("<ul>").attr({"id":"view-"+num,"class":"pure-menu-list"}).appendTo("#col-"+num);
						conceptMap["concepts"][className].forEach(function(conceptText, i) {
							if(conceptText == "") divider = true;	//下一組內容為分隔線
							else if(divider) {
								divider = false;
								$("#view-"+num).append("<li class=\"pure-menu-heading\">"+conceptText+"</li>");
							}
							else $("#view-"+num).append("<li class=\"pure-menu-item\"><a onClick=\"contentSelected('"+conceptText+"')\" class=\"pure-menu-link\">"+conceptText+"</a></li>");
						});
					}
				}
				if(conceptMap.links) {
					$("#editLinkMenuSet").append("<li class=\"pure-menu-heading\">▽修改此關係為▽</li>");
					conceptMap.links.forEach(function(linkText, i) {	//讀取關係
						$("#editLinkMenuSet").append("<li class=\"pure-menu-item\"><a onClick=\"editLineWord('"+linkText+"')\" class=\"pure-menu-link\">"+linkText+"</a></li>");
					});
				}
			}
		}
		
		nodes = new vis.DataSet();
		edges = new vis.DataSet();
		var container = document.getElementById("canvas");
		var options = {
			nodes: {fontSize:18},
			edges:{style:"arrow"},
			physics:{barnesHut:{gravitationalConstant:0, springConstant:0, centralGravity: 0}},
			smoothCurves:{dynamic:false, type: 'continuous'}
		};
		network = new vis.Network(container, { nodes: nodes, edges: edges },options);
		
		network.on("doubleClick", function(params){
			if(params.nodes.length > 0) {	//點擊概念
				conceptSelected = params.nodes[0];		//指定目前選取的概念ID
				$.fancybox.open( $("#conceptMenu"), {
					type:"inline",
					width:"150px",
					height:"150px",
					autoSize:false
				});
			}
			else {	//點擊連結
				lineSelected = params.edges[0];
				openLinkMenu();
			}
		})
		.on("click", function(params){
			//開啟連接模式時，被點擊下一個概念與選擇的概念相連
			if(setConnect && conceptSelected != "-1" && conceptSelected != params.nodes[0]) {
				setConnect = false;
				var lineID = conceptSelected + "-" + params.nodes[0];
				edges.add({id: lineID, from: conceptSelected, to: params.nodes[0]});
			}
		});
		
		loadExpMap();	//讀取專家概念圖
	});
	function loadExpMap() {
		var goals = JSON.parse(sessionStorage.goals);
		selectGoal = $("#goal").val();
		
		unit = {};	//清空unit
		unit[selectGoal] = goals[selectGoal]["id"];	//儲存主目標ID
		$("#editUnitMenuSet").html("");
		$("#editUnitMenuSet").append("<li class=\"pure-menu-heading\">▽設定此命題的單元為▽</li>");
		for (var subgoalKey in goals[selectGoal].subgoals) {
			var subgoalName = goals[selectGoal]["subgoals"][subgoalKey];
			unit[subgoalKey] = subgoalName;
			unit[subgoalName] = subgoalKey;
			$("#editUnitMenuSet").append("<li class=\"pure-menu-item\"><a onClick=\"setUnit('"+subgoalKey+"')\" class=\"pure-menu-link\">"+subgoalName+"</a></li>");
		}
		
		var loadData = {};
		loadData.pID = sessionStorage.projectID;
		loadData.fileName = "expCmap-"+unit[selectGoal];
		
		$.getJSON( "loadText.php", loadData, function( map ) {
			drawMap( map );
		})
		.fail(function() {
			setRoot(selectGoal);
		});
	}
	function setRoot(text) {
		nodes.add({
			id: "c1",
			label: text,
			borderWidth: 2,
			color: {
				background: "#ee6666",
				border: "#D96C00"
			}
		});
	}
	function drawMap(map) {
		map.concept.forEach(function(concept, i) {
			//建立概念物件並初始化
			if(concept.id == "c1") {
				setRoot(concept.label);
				nodes.update({id: "c1", x: concept.x, y: concept.y, allowedToMoveX: true, allowedToMoveY: true});
			}
			else {
				nodes.update({id: concept.id, label: concept.label, x: concept.x, y: concept.y, allowedToMoveX: true, allowedToMoveY: true});
			}
		});
		map.line.forEach(function(line, i) {
			edges.add(line);
			if(line.label) edges.update({id: line.id, label: showLinkLabel(line.label, line.weight, line.unit), text: line.label});
		});
	}
	function saveExpMap() {
		var cmapData = saveToJSON();
		var saveData = {};
		saveData.pID = sessionStorage.projectID;
		saveData.fileName = "expCmap-"+unit[selectGoal];
		saveData.content = JSON.stringify( saveToJSON() );
		
		$.post( "saveText.php", saveData, function( data ) {
			if(data == "ok") {
				var expCmap = getExpProposition(cmapData);
			
				$.post( "projectDBinit.php", {pID: saveData.pID, goal: selectGoal, cmap: JSON.stringify( expCmap )}, function( data ) {
					if(data == "ok") {
						modified = false;
						$("#tip").css("display", "block");
						$("#tip").fadeOut(1600);
						
						if(reload) {
							reload = false;
							nodes.clear();
							edges.clear();
							loadExpMap();
						}
					}
					else {
						alert(data);
						$("#tip").css("display", "block");
						$("#tip").fadeOut(1600);
					}
				});
			}
			else {
				alert(data);
				$("#tip").css("display", "block");
				$("#tip").fadeOut(1600);
			}
		});
	}
	function getExpProposition(expertJSON) {	//取得專家命題
		expProposition = [];
		var lineText = {};
		var conceptText = {};
		var weight = {};
		var unit = {};

		expertJSON.concept.forEach(function(concept, i) {
			conceptText[concept.id] = concept.label;		//儲存概念文字
		});
		expertJSON.line.forEach(function(line, i) {			
			var e = {};
			e.pText = conceptText[line.from];
			e.cText = conceptText[line.to];
			e.line = line.label;	//儲存線段文字
			
			expProposition.push(e);	//儲存每一個命題
		});
		return expProposition;
	}
	// 將目前概念圖儲存成JSON物件
	function saveToJSON() {
		var map = {};
		map.concept = [];
		map.line = [];
		var nsLinkWord  = false;
		var nsUnit = false;
		
		//讀取所有概念
		var nodesArray = nodes.getIds();	//取得所有概念ID
		var nodesPosition = network.getPositions();
		nodesArray.forEach( function(nodesID, i) {
			var obj = nodes.get(nodesID);
			var e = {};
			e.id	= obj.id;
			e.x		= nodesPosition[nodesID].x;
			e.y		= nodesPosition[nodesID].y;
			e.label	= obj.label;
			map.concept.push(e);
		});
		
		//讀取所有線段
		var edgesArray = edges.getIds();	//取得所有線段ID
		edgesArray.forEach( function(edgesID, i) {
			var obj = edges.get(edgesID);
			var e = {};
			e.id	= obj.id;
			e.from	= obj.from;
			e.to	= obj.to;
			e.label	= obj.text;
			e.weight = obj.weight;
			e.unit = obj.unit;
			
			if(!obj.text) nsLinkWord = true;
			if(!obj.unit) nsUnit = true;
			
			if(obj.from && obj.to) map.line.push(e);	//不儲存懸空線段
		});
		
		if(nsLinkWord && nsUnit) alert("提醒您，您尚有關聯詞與命題單元未指定。");
		else if(nsLinkWord) alert("提醒您，您尚有關聯詞未指定。");
		else if(nsUnit) alert("提醒您，您尚有命題單元未指定。");
		
		return map;
	}
	function changeGoal() {
		if(modified) {
			reload = true;
			saveExpMap();	//更換目標前先儲存
		}
		else {
			nodes.clear();
			edges.clear();
			loadExpMap();
		}
	}
	// 建立新概念
	function conceptCreat(cName) {
		conceptNo++;				//概念序號+1
		var pID = conceptSelected;	//新建概念的母ID
		var cID = "c" + conceptNo;	//新建概念的ID
		var lineID = pID + "-" + cID;
		
		// 建立新概念物件
		nodes.add({id: cID, label: cName});
		edges.add({id: lineID, from: pID, to: cID});
	}
	// 修改概念內容
	function editConceptWord(str) {
		if(conceptSelected == "c1") {	//根元素不能修改
			alert("很抱歉，初始概念不能修改。");
		}
		else {
			var oldText = nodes.get(conceptSelected).label;
			nodes.update({id: conceptSelected, label: str});
		}
	}
	// 刪除概念
	function delConcepts() {
		if(conceptSelected == "c1") {	//根元素不能被刪除
			alert("很抱歉，初始概念不能刪除。");
		}
		else {
			var str = nodes.get(conceptSelected).label;
			var deleted = confirm("您確定要刪除 [" + str + "] 這個概念嗎？");
			if(deleted) {
				modified = true;
				var removeLineArray = edges.getIds({	//與此概念相連的線段
					filter: function (item) {
						return (item.from == conceptSelected || item.to == conceptSelected);
					}
				});
				
				removeLineArray.forEach(function(lineID, i) {	//刪除線段
					edges.remove(lineID);
				});
				nodes.remove(conceptSelected);
			}
		}
	}
	// 刪除線段
	function delLine() {
		modified = true;
		$.fancybox.close( $("#linkMenu") );	//關閉連結選單
		edges.remove(lineSelected);
	}
	// 修改線段內容
	function editLineWord(str) {
		modified = true;
		$.fancybox.close( $("#editLinkMenu") );	//關閉連結清單
		var weight = 1, unitKey;
		if(edges.get(lineSelected).weight) weight = edges.get(lineSelected).weight;
		if(edges.get(lineSelected).unit) unitKey = edges.get(lineSelected).unit;
		else {
			var parentLink = edges.getIds({		//與此概念相連的線段
				filter: function (item) {
					return (item.to == edges.get(lineSelected).from && item.unit != null);
				}
			});
			if(parentLink.length != 0) {
				var obj = edges.get(parentLink[0]);
				unitKey = obj.unit;	//預設為母節點的單元
			}
		}
		var label = showLinkLabel(str, weight, unitKey);
		
		if(unitKey) edges.update({id: lineSelected, label: label, text: str, weight: weight, unit: unitKey});
		else edges.update({id: lineSelected, label: label, text: str, weight: weight});
	}
	function setWeight() {
		modified = true;
		$.fancybox.close( $("#linkMenu") );	//關閉連結選單
		var str = "";
		if( edges.get(lineSelected).weight != null ) str = edges.get(lineSelected).weight;	//預設為原始內容
		str = prompt("請輸入此命題的權重值",str);
		
		if(isNaN(str)) alert("權重值請輸入數字。");
		else if(str != null && str != "") {
			var text = "", unitKey;
			if(edges.get(lineSelected).text) text = edges.get(lineSelected).text;
			if(edges.get(lineSelected).unit) unitKey = edges.get(lineSelected).unit;
			var label = showLinkLabel(text, str, unitKey);
			
			edges.update({id: lineSelected, label: label, weight: str});
		}
	}
	function setUnit(key) {
		modified = true;
		$.fancybox.close( $("#editUnitMenu") );	//關閉子目錄單元清單
		var text = "", weight = 1;
		if(edges.get(lineSelected).text) text = edges.get(lineSelected).text;
		if(edges.get(lineSelected).weight) weight = edges.get(lineSelected).weight;
		var label = showLinkLabel(text, weight, key);
		
		edges.update({id: lineSelected, label: label, unit: key});
	}
	// 開啟概念內容清單
	function openContentMenu(active) {
		contentActive = active;
		$.fancybox.close( $("#conceptMenu") );	//關閉概念選單
		
		if(contentActive === "del") {		//刪除概念
			delConcepts();
		}
		else if(contentActive === "connect") {
			setConnect = true;	//開啟連結模式，等待使用者點擊其它概念
		}
		else {
			if($("#contentMenu li").length > 0 ) {
				$.fancybox.open( $("#contentMenu"), {	//開啟內容清單
					type:"inline",
					width:"200px",
					autoSize:false
				});
			}
			else {
				var cName = "";
				do {
					cName = prompt("請輸入概念名稱","");
				}
				while(cName == "");
				if(cName !== "" && cName != null) {	//概念名稱已輸入
					if(contentActive === "new") conceptCreat(cName);			//新增子概念
					else if(contentActive === "edit") editConceptWord(cName);	//修改概念內容
				}
			}
		}
	}
	// 開啟連結清單
	function openLinkMenu() {
		$.fancybox.open( $("#linkMenu"), {
			type:"inline",
			width:"150px",
			height:"150px",
			autoSize:false
		});
	}
	function openEditLinkMenu() {
		if($("#editLinkMenuSet li").length > 1 ) {
			$.fancybox.open( $("#editLinkMenu"), {
				type:"inline",
				width:"200px",
				height:"300px",
				autoSize:false
			});
		}
		else {	//沒有清單，手動輸入
			var str = "";
			if( edges.get(lineSelected).label.length > 0 ) str = edges.get(lineSelected).label;	//預設為原始內容
			str = prompt("請輸入概念關係",str);
			
			if(str != null) editLineWord(str);
		}
	}
	function openEditUnitMenu() {
		if($("#editUnitMenuSet li").length > 1 ) {
			$.fancybox.open( $("#editUnitMenu"), {
				type:"inline",
				width:"200px",
				height:"300px",
				autoSize:false
			});
		}
	}
	//當概念內容清單已選取時，按照contentActive行動
	function contentSelected(cName) {
		modified = true;
		if(contentActive === "new") {
			conceptCreat(cName);	//新增子概念
		}
		else if(contentActive === "edit") {
			editConceptWord(cName);	//修改概念內容
		}
		$.fancybox.close( $("#contentMenu") );	//關閉概念內容清單
	}
	function showLinkLabel(word, w, u) {
		if(u) return word+" ("+unit[u]+": "+w+")";
		else if(w) return word+" ("+w+")";
		else if(word) return word;
		return "";
	}