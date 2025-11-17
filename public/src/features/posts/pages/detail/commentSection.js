import {createComment} from "/src/features/comments/api/commentsApi.js";
import {getComments} from "/src/features/comments/api/commentsApi.js";

/**
 * 템플릿을 이용해서 댓글을 랜더링하는 합수
 * @param comment 요청을 통해 가져온 comment 객체
 * */
export function renderComment(comment) {

    const currentUser = sessionStorage.getItem("currentUser");

    const template= document.getElementById("comment-template");
    // 템플릿 내부의 콘텐츠를 DeepCopy하는 코드
    const clone = template.content.cloneNode(true);

    const commentLi = clone.querySelector('li');
    commentLi.dataset.commentId = comment.commentId;
    commentLi.dataset.authorNickname = comment.author.nickname;
    commentLi.dataset.commentContent = comment.content;
    clone.getElementById("author-nickname").textContent = comment.author.nickname;
    clone.getElementById("comment-content").textContent = comment.content;
    const commentDate = clone.querySelector('.comment-date');
    // 시간까지
    commentDate.textContent = new Date(comment.createdAt).toLocaleString();
    commentDate.dateTime = comment.createdAt;

    //댓글 작성자 권한 확인(수정/삭제)
    const actionMenu = clone.querySelector('.more-menu');

    if(currentUser && comment.author.nickname === currentUser) {

        const editLi = document.createElement("li");
        editLi.innerHTML = `<a href="/edit-comment/${comment.id}" class="edit-btn">수정</a>`;

        const deleteLi = document.createElement("li");
        deleteLi.innerHTML = `<button type="button" class="delete-btn">삭제</button>`

        actionMenu.prepend(editLi, deleteLi);
    }
    //TODO 대댓글 처리하기 쓰래드로 처리
    return commentLi;
}

/**
 * 댓글의 액션 버튼 클릭을 다루는 함수
 * @param event : 클릭이벤트
 * */
export function handleCommentClick(event) {
    const clickedElement = event.target;

    //"더보기(⁝)" 버튼을 눌렀는지 확인
    const moreBtn = clickedElement.closest('.more-btn');
    if (moreBtn) {
        const menu = moreBtn.nextElementSibling;  //.moreBtn
        if (menu && menu.classList.contains('more-menu')) {
            // 다른 메뉴들 닫기
            const allMenus = document.querySelectorAll('.more-menu.active');
            allMenus.forEach(m => {
                if (m !== menu) {
                    m.classList.remove('active');
                }
            });
            // 현재 메뉴 토글
            menu.classList.toggle("active");
        }
        return;
    }

    // 메뉴 외부 클릭 시 모든 메뉴 닫기
    const isMenuClick = clickedElement.closest('.more-menu') || clickedElement.closest('.more-btn');
    if (!isMenuClick) {
        const allMenus = document.querySelectorAll('.more-menu.active');
        allMenus.forEach(menu => menu.classList.remove('active'));
    }

    //삭제 버튼
    const deleteBtn = clickedElement.closest('.delete-btn');
    if (deleteBtn) {
        const commentLi = clickedElement.closet('li[dat-comment-id]');
        const commentId = commentLi.dateTime.commentId;
        checkCommentDelete(commentId);
        return;
    }
}

//TODO 댓글도 삭제로직 필요
function checkCommentDelete(commentId) {
    if (confirm(`정말 삭제하시겠습니까?₩n₩n삭제한 게시글은 복구할 수 없습니다.`)) {
        console.log("댓글 삭제:", commentId);
    }
}

let currentCursor = null;
let isloading = false;
let hasMore = true;
let observer;

/**
 * 댓글 목록의 무한스크롤을 담당하는 함수, 다음 커서에 대한 댓글들을 불러옴
 * */
async function loadNextPage() {
    // 이미 로딩중이거나, 더이상 데이터 없다면 중단
    if (isloading||!hasMore) return;

    isloading = true;

    // 로딩 인디케이터 표시
    const trigger = document.getElementById('infinite-scroll-trigger');
    if (trigger) {
        trigger.classList.add('loading');
    }

    try {
        const { comments: newComments } = await getComments(currentCursor);
        if (newComments === 0) {
            hasMore = false;
        } else {
            //TODO 댓글 렌더하는 로직
        }
    } catch (error) {
        console.error("다음 페이지 로딩 실패: ", error);
    } finally {
        isloading = false;
        // 로딩 인디케이터 제거
        if (trigger) {
            trigger.classList.remove('loading');
        }
    }
}

/**
 * 무한페이징을 위한 옵저버 함수, 앵커 10이상부터 콜백
 * */
function createObserver() {
    const trigger = document.getElementById('infinite-scroll-trigger');

    const option = {
        root: null, // null이면 뷰포트 전체
        threshold: 0.1 // 앵커가 10%만 보여도 콜백 실행
    };

    const callback = (entries, observer) => {
        entries.forEach(entry => {
            // 앵커(entry.target)이 화면에 보인다면
            if (entry.isIntersecting) {
                loadNextPage();
            }
        });
    };

    const observer = new IntersectionObserver(callback, option);
    observer.observe(trigger);
}

/**
 * 댓글 등록 폼(입력창, 등록 버튼)에 이벤트 리스너를 설정하는 함수
 * @param postId : 댓글이 달릴 게시글의 아이디
 * */
export function setupCommentForm(postId) {
    const commentInput = document.getElementById('comment-input');
    const commentSubmitBtn = document.getElementById('comment-submit-btn');

    if (!commentInput || !commentSubmitBtn) {
        console.error('댓글 폼 요소 찾을 수 없음');
        return;
    }

    commentSubmitBtn.addEventListener('click', async e => {
        const content =commentInput.value;
        if(!content.trim()) {
            alert('댓글 내용을 입력하세요');
            return;
        }

        try {
            const newComment = await createComment(postId, content);

            const commentElement = renderComment(newComment);

            document.getElementById('comment-list').prepend(commentElement);
            //입력창 비우기
            commentInput.value = '';

        }catch (error) {
            console.log('댓글 등록 실패 :', error);
            alert('댓글 등록 실패, 재시도해주세요.');
        }
    });

}