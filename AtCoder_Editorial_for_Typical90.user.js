// ==UserScript==
// @name         AtCoder Editorial for Typical90
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  AtCoder「競プロ典型 90 問」に解説タブを追加し、E869120さんがGitHubで公開されている問題の解説・想定ソースコードなどを表示します。
// @match        https://atcoder.jp/contests/typical90*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @author       hiro_hiro
// @license      CC0
// @downloadURL
// @updateURL
// @supportURL
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    "use strict";

    addTabContentStyles();
    addEditorialTabToTaskPage();
    addEditorialPage();

    $(".nav-tabs a").click(function () {
        changeTab($(this));
        hideContentsOfPreviousPage();

        return false;
    });

    const current_url = window.location.href;

    if (current_url.match("/atcoder.jp\/contests\/typical90\/tasks\/typical90_*")) {
        const $editorialButton = addEditorialButtonToTaskPage();

        if (!$editorialButton) return;

        // See:
        // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
        $editorialButton.addEventListener("click", async e => {
            e.preventDefault();

            console.log("called!");
            // TODO: ボタンをクリックすると、解説ページが表示される
            // TODO: 解説ページに、その問題の解説を追加
            // TODO: 解説ページに、その問題のソースコードを追加
            // TODO: 問題によっては、複数の解説とソースコードのファイルがあるので対処
            // TODO: 問題の投稿当日に解説・ソースコードがない場合のmsgを追加
        });
    }
})();

function addTabContentStyles() {
    const tabContentStyles = `
        .tabContent {
            display: none;
        }
        .tabContent.active {
            display: block;
        }
    `;

    GM_addStyle(tabContentStyles);
}

// FIXME: Hard coding is not good.
function addEditorialTabToTaskPage() {
    // See:
    // https://api.jquery.com/before/
    $("li.pull-right").before("<li><a href='#editorial-created-by-userscript'><span class='glyphicon glyphicon-book' style='margin-right:4px;' aria-hidden='true'></span>解説</a></li>");
}

function addEditorialPage() {
    const contestNavTabsId = document.getElementById("contest-nav-tabs");

    // See:
    // https://stackoverflow.com/questions/268490/jquery-document-createelement-equivalent
    // https://blog.toshimaru.net/jqueryhidden-inputjquery/
    $("<div>", {
        class: "tabContent",
        id: "editorial-created-by-userscript",
    }).appendTo(contestNavTabsId);

    $("<h2>", {
        class: "editorial-header",
        text: "解説"
    }).appendTo("#editorial-created-by-userscript");
}

function addEditorialButtonToTaskPage() {
    // See:
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
    const editorialButton = document.createElement("a");
    editorialButton.classList.add("btn", "btn-default", "btn-sm");
    editorialButton.textContent = "解説";

    const taskTitle = document.querySelector(".row > div > .h2");

    if (taskTitle) {
        taskTitle.appendChild(editorialButton);
        return editorialButton;
    } else {
        return;
    }
}

function changeTab(this_object) {
    // See:
    // https://api.jquery.com/parent/
    // https://api.jquery.com/addClass/#addClass-className
    // https://api.jquery.com/siblings/#siblings-selector
    // https://api.jquery.com/removeClass/#removeClass-className
    // https://www.design-memo.com/coding/jquery-tab-change
    this_object.parent().addClass("active").siblings(".active").removeClass("active");
    const tabContentsUrl = this_object.attr("href");
    $(tabContentsUrl).addClass("active").siblings(".active").removeClass("active");
}

function hideContentsOfPreviousPage() {
    // See:
    // https://api.jquery.com/length/
    // https://api.jquery.com/hide/
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for
    // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String
    const tagCount = $(".col-sm-12").length;

    for (let index = 0; index < tagCount; index++) {
        if (index != 0) {
            $("#main-container > div.row > div:nth-child(" + String(index + 1) + ")").hide();
        }
    }
}
