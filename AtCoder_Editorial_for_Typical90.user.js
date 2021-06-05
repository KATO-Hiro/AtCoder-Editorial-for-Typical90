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
    addEditorialTab();
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
function addEditorialTab() {
    // See:
    // https://api.jquery.com/before/
    $("li.pull-right").before("<li><a href='#editorial-created-by-userscript'><span class='glyphicon glyphicon-book' style='margin-right:4px;' aria-hidden='true'></span>解説</a></li>");
}

function addEditorialPage() {
    addTabContent();

    const editorialId = "#editorial-created-by-userscript";

    showHeader(editorialId);
    addHorizontalRule(editorialId);
    showDifficultyVotingAndUserCodes(editorialId);

    const githubRepoUrl = "https://github.com/E869120/kyopro_educational_90/blob/main/";
    const editorialsUrl = githubRepoUrl + "editorial/";
    const codesUrl = githubRepoUrl + "sol/";

    // TODO: 問題の一覧を取得
    // TODO: 問題によっては、複数の解説とソースコードのファイルがあるので対処
    // TODO: 問題の投稿当日に解説・ソースコードがない場合のmsgを追加
    for (let i = 1; i <= 90; i++ ) {
        // See:
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
        const taskId = String(i).padStart(3, "0");
        showTaskName(taskId, editorialId);

        // TODO: AtCoderの解説ページで図を表示できるようにする
        const editorialUrl = editorialsUrl + taskId + ".jpg";
        showEditorial(taskId, editorialUrl, editorialId);

        // TODO: ソースコードをフォーマットされた状態で表示する
        const editorialCodelUrl = codesUrl + taskId + ".cpp";
        showCode(taskId, editorialCodelUrl, editorialId);
    }
}

function addTabContent() {
    const contestNavTabsId = document.getElementById("contest-nav-tabs");

    // See:
    // https://stackoverflow.com/questions/268490/jquery-document-createelement-equivalent
    // https://blog.toshimaru.net/jqueryhidden-inputjquery/
    $("<div>", {
        class: "tabContent",
        id: "editorial-created-by-userscript",
    }).appendTo(contestNavTabsId);
}

function showHeader(tag) {
    addHeader(
        "<h2>", // heading_tag
        "editorial-header", // className
        "解説", // text
        tag // parent_tag
    );
}

function addHeader(heading_tag, className, text, parent_tag) {
    $(heading_tag, {
        class: className,
        text: text,
    }).appendTo(parent_tag);
}

function addHorizontalRule(tag) {
    // See:
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hr
    $("<hr>", {
        class: "",
    }).appendTo(tag);
}

function showDifficultyVotingAndUserCodes(tag) {
    addHeader(
        "<h3>", // heading_tag
        "difficulty-voting-and-user-codes", // className
        "問題の難易度を投票する・ソースコードを共有する", // text
        tag // parent_tag
    );

    $("<ul>", {
        class: "spread-sheets-ul",
        text: ""
    }).appendTo(tag);

    const spreadSheetUrl = "https://docs.google.com/spreadsheets/d/1GG4Higis4n4GJBViVltjcbuNfyr31PzUY_ZY1zh2GuI/edit#gid=";

    const homeID = "0";
    addSpreadSheetHomeURL(spreadSheetUrl + homeID);

    const difficultyVotingID = "1593175261";
    addDifficultyVotingURL(spreadSheetUrl + difficultyVotingID);

    const taskGroups = [
        ["001", "023", spreadSheetUrl + "105162261"], // task start, task end, spread sheet id.
        ["024", "047", spreadSheetUrl + "1671161250"],
        ["048", "071", spreadSheetUrl + "671876031"],
        ["072", "090", spreadSheetUrl + "428850451"]
    ];

    // See:
    // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
    taskGroups.forEach(
        taskGroup => {
            const taskStart = taskGroup[0];
            const taskEnd = taskGroup[1];
            const url = taskGroup[2];

            addUserCodesURL(
                taskStart,
                taskEnd,
                url
            );
        }
    );
}

function addSpreadSheetHomeURL(url) {
    $("<li>", {
        class: "spread-sheet-home-li",
        text: ""
    }).appendTo(".spread-sheets-ul");

    $("<a>", {
        class: "spread-sheet-home-url",
        href: url,
        text: "目的",
        target: "_blank",
        rel: "noopener",
    }).appendTo(".spread-sheet-home-li");
}

function addDifficultyVotingURL(url) {
    $("<li>", {
        class: "difficulty-voting-li",
        text: ""
    }).appendTo(".spread-sheets-ul");

    $("<a>", {
        class: "difficulty-voting-url",
        href: url,
        text: "問題の難易度を投票する",
        target: "_blank",
        rel: "noopener",
    }).appendTo(".difficulty-voting-li");
}

function addUserCodesURL(taskStart, taskEnd, url) {
    // See:
    // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Template_literals
    $("<li>", {
        class: `user-codes-${taskStart}-${taskEnd}-li`,
        text: ""
    }).appendTo(".spread-sheets-ul");

    $("<a>", {
        class: `user-codes-${taskStart}-${taskEnd}-url`,
        href: url,
        text: `ソースコード(${taskStart}〜${taskEnd})を見る・共有する`,
        target: "_blank",
        rel: "noopener",
    }).appendTo(`.user-codes-${taskStart}-${taskEnd}-li`);
}

function showTaskName(taskName, tag) {
    addHeader(
        "<h3>", // heading_tag
        `task-${taskName}`, // className
        taskName, // text
        tag // parent_tag
    );
}

function showEditorial(taskId, url, tag) {
    const ulClass = `editorial-${taskId}-ul`;
    const liClass = `editorial-${taskId}-li`;

    $("<ul>", {
        class: ulClass,
        text: ""
    }).appendTo(tag);

    $("<li>", {
        class: liClass,
        text: ""
    }).appendTo(`.${ulClass}`);

    $("<a>", {
        class: `editorial-${taskId}-url`,
        href: url,
        text: "公式解説",
        target: "_blank",
        rel: "noopener",
    }).appendTo(`.${liClass}`);
}

function showCode(taskId, url, tag) {
    const ulClass = `editorial-${taskId}-ul`;
    const liClass = `editorial-${taskId}-code-li`;

    $("<li>", {
        class: liClass,
        text: ""
    }).appendTo(`.${ulClass}`);

    $("<a>", {
        class: `editorial-${taskId}-code-url`,
        href: url,
        text: "想定ソースコード",
        target: "_blank",
        rel: "noopener",
    }).appendTo(`.${liClass}`);
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
