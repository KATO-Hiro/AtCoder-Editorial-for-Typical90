// ==UserScript==
// @name         AtCoder Editorial for Typical90
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  AtCoder「競プロ典型 90 問」に解説タブを追加し、E869120さんのGitHubで公開されている問題の解説・想定ソースコードなどを表示します。
// @match        https://atcoder.jp/contests/typical90/tasks/typical90_*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js
// @require      https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js
// @author       hiro_hiro
// @license      CC0
// @downloadURL
// @updateURL
// @supportURL
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    const url = "";
    addEditorialTabToTaskPage(url);

    const $editorialButton = addEditorialButtonToTaskPage();

    if (!$editorialButton) return;

    // See:
    // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
    $editorialButton.addEventListener("click", async e => {
        e.preventDefault();

        console.log("called!");
        // TODO: ボタンをクリックすると、解説ページが作成される
        // TODO: 解説ページに、その問題の解説を追加
        // TODO: 解説ページに、その問題のソースコードを追加
        // TODO: 問題によっては、複数の解説とソースコードのファイルがあるので対処
        // TODO: 問題の投稿当日に解説・ソースコードがない場合のmsgを追加
    });
})();

function addEditorialTabToTaskPage(url) {
    // See:
    // https://api.jquery.com/before/
    $("li.pull-right").before("<li><a href='" + url + "'><span class='glyphicon glyphicon-book' style='margin-right:4px;' aria-hidden='true'></span>解説</a></li>");
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
