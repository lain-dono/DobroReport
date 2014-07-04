// ==UserScript==
// @name DobroReport
// @description Скрипт добавляет кнопку "Сообщить Модераторам"
// @namespace dobro
// @version 0.4
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
	var mod_thread = 47873;

	// Загрузка номера треда из localStorage
	if (localStorage.dobroReportModThread)
		mod_thread = localStorage.dobroReportModThread;

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

	// Если находимся в настройках
	if (location.pathname == '/settings') {
		var setModThreadButton = $("<button>Обновить номер модераторам-треда ("+ mod_thread +")</button>");
		setModThreadButton.click(function () {
			$.getJSON('/d/0.json', function (json) {
				threads = json.boards.d.threads;
				for (var i = 0; i < threads.length; i++) {
					if (threads[i].title.search("Модераторам") != -1) {
						localStorage.dobroReportModThread = threads[i].display_id;
						alert('Модераторам-тред успешно обновлён: ' + localStorage.dobroReportModThread);
						return;
					}
				}
				alert('Не удалось найти Модераторам-тред на нулевой');
			});
		});
		$('form:last').after(setModThreadButton);
	}
};

// Добавляем скрипт на страницу
var script = document.createElement("script");
script.textContent = "(" + (main.toString()) + ")();";
document.body.appendChild(script);

