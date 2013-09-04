// ==UserScript==
// @name DobroReport
// @description Скрипт добавляет кнопку "Сообщить Модераторам"
// @namespace dobro
// @version 0.1
// @author lain-dono
// @license public domain
// @include https://dobrochan.ru/*
// @include https://dobrochan.org/*
// @include https://dobrochan.com/*
// @include http://dobrochan.ru/*
// @include http://dobrochan.org/*
// @include http://dobrochan.com/*
// ==/UserScript==

function main() {
	// Модераторам-тред
	var mod_thread = 43956;
	// Раздел
	var board = window.location.pathname.split("/")[1];

	var postMessage = function(msg) {
		var m = {"thread_id": mod_thread, task:"post", message: msg};
		jQuery.post("/d/post/new.xhtml", m);
	};

	var getMessage = function() {
		// Отмеченные посты(крестики)
		var markedPosts = $(".delete.icon.checked input");
		var postBody = "";

		markedPosts.each(function() {
			postBody += ">>"+board+"/"+this.name+"\n";
		});

		if(!postBody) {
			alert("Нет постов же");
			return false;
		}

		var comment = prompt("Комментарий к нарушающим постам\n(пустой комментарий означает отмену отправки)");

		if(comment) {
			postBody += comment;
			return postBody;
		} else {
			return false;
		}
	}
	
	// Добавляем кнопку
	var button = $("<button>Сообщить Модераторам</button>");
	button.click(function() {
		var msg = getMessage();
		if(msg) {
			postMessage(msg);
		}
		return false;
	});
	$(".userdelete tbody tr td").append(button);
};

// Добавляем скрипт на страницу
var script = document.createElement("script");
script.textContent = "(" + (main.toString()) + ")();";
document.body.appendChild(script);

