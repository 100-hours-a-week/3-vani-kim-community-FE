import {createComment, deleteComment, updateComment} from "/src/features/comments/api/commentsApi.js";
import {getComments} from "/src/features/comments/api/commentsApi.js";

/**
 * 템플릿을 이용해서 댓글을 랜더링하는 합수
 * @param comment 요청을 통해 가져온 comment 객체
 * */
export function renderComment(comment) {

    const currentUserNickname = window.authStore.getNickname();

    const template= document.getElementById("comment-template");
    // 템플릿 내부의 콘텐츠를 DeepCopy하는 코드
    const clone = template.content.cloneNode(true);

    const commentLi = clone.querySelector('li');
    commentLi.dataset.commentId = comment.commentId;
    commentLi.dataset.authorNickname = comment.author.nickname;
    commentLi.dataset.commentContent = comment.content;
    clone.getElementById("author-nickname").textContent = comment.author.nickname;
    clone.getElementById("comment-content").textContent = comment.content;

    // 댓글 작성자 프로필 이미지 설정
    const commentAuthorImg = clone.querySelector('.comment-author img');
    if (commentAuthorImg && comment.author.authorProfileImageUrl) {
        commentAuthorImg.src = comment.author.authorProfileImageUrl;
    }

    const commentDate = clone.querySelector('.comment-date');
    // 시간까지
    commentDate.textContent = new Date(comment.createdAt).toLocaleString();
    commentDate.dateTime = comment.createdAt;

    //댓글 작성자 권한 확인(수정/삭제)
    const actionMenu = clone.querySelector('.more-menu');

    if(currentUserNickname && comment.author.nickname === currentUserNickname) {

        const editLi = document.createElement("li");
        editLi.innerHTML = `<button type="button" class="edit-btn">수정</button>`;

        const deleteLi = document.createElement("li");
        deleteLi.innerHTML = `<button type="button" class="delete-btn">삭제</button>`

        actionMenu.prepend(editLi, deleteLi);
    }
    //TODO 대댓글 처리하기 쓰래드로 처리
    return commentLi;
}

/**
 * 댓글의 액션 버튼 클릭을 다루는 함수
 * @param event : click event
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

    //수정 버튼
    const editBtn = clickedElement.closest('.edit-btn');
    if (editBtn) {
        const commentLi = clickedElement.closest('li[data-comment-id]');
        const commentId = commentLi.dataset.commentId;

        // URL에서 postId 가져오기
        const path = window.location.pathname;
        const parts = path.split('/');
        const postId = parts.pop();

        enterEditMode(postId, commentId, commentLi);
        return;
    }

    //삭제 버튼
    const deleteBtn = clickedElement.closest('.delete-btn');
    if (deleteBtn) {
        const commentLi = clickedElement.closest('li[data-comment-id]');
        const commentId = commentLi.dataset.commentId;

        // URL에서 postId 가져오기
        const path = window.location.pathname;
        const parts = path.split('/');
        const postId = parts.pop();

        checkCommentDelete(postId, commentId, commentLi);
        return;
    }
}

/**
 * 댓글 삭제를 처리하는 함수
 * @param postId : 게시글 ID
 * @param commentId : 댓글 ID
 * @param commentLi : 삭제할 댓글 DOM 요소
 */
async function checkCommentDelete(postId, commentId, commentLi) {
    const confirmed = await window.toast.confirm(
        "댓글 삭제",
        "정말 삭제하시겠습니까?\n\n삭제한 댓글은 복구할 수 없습니다.",
        { confirmText: "삭제", cancelText: "취소" }
    );

    if (confirmed) {
        try {
            await deleteComment(postId, commentId);
            // 성공시 DOM에서 제거
            commentLi.remove();
            window.toast.success('댓글이 삭제되었습니다.');
        } catch (error) {
            console.error('댓글 삭제 실패:', error);
            window.toast.error('댓글 삭제에 실패했습니다. 다시 시도해주세요.');
        }
    }
}

/**
 * 댓글 수정 모드로 전환하는 함수
 * @param postId : 게시글 ID
 * @param commentId : 댓글 ID
 * @param commentLi : 수정할 댓글 DOM 요소
 */
function enterEditMode(postId, commentId, commentLi) {
    // 이미 수정 모드인 경우 무시
    if (commentLi.classList.contains('editing')) {
        return;
    }

    // 원본 내용 저장
    const originalContent = commentLi.dataset.commentContent;
    const commentContentDiv = commentLi.querySelector('.comment-content');

    // 수정 모드 플래그 추가
    commentLi.classList.add('editing');

    // 더보기 메뉴 숨기기
    const moreMenu = commentLi.querySelector('.more-menu');
    if (moreMenu) {
        moreMenu.classList.remove('active');
    }

    // 텍스트를 textarea로 변경
    commentContentDiv.innerHTML = `
        <textarea class="comment-edit-textarea">${originalContent}</textarea>
        <div class="comment-edit-actions">
            <button type="button" class="save-edit-btn">저장</button>
            <button type="button" class="cancel-edit-btn">취소</button>
        </div>
    `;

    const textarea = commentContentDiv.querySelector('.comment-edit-textarea');
    const saveBtn = commentContentDiv.querySelector('.save-edit-btn');
    const cancelBtn = commentContentDiv.querySelector('.cancel-edit-btn');

    // 저장 버튼 이벤트
    saveBtn.addEventListener('click', () => saveCommentEdit(postId, commentId, commentLi, textarea.value.trim(), originalContent));

    // 취소 버튼 이벤트
    cancelBtn.addEventListener('click', () => cancelCommentEdit(commentLi, originalContent));

    // textarea 포커스 및 커서를 끝으로 이동
    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
}

/**
 * 댓글 수정 저장하는 함수
 * @param postId : 게시글 ID
 * @param commentId : 댓글 ID
 * @param commentLi : 댓글 DOM 요소
 * @param newContent : 새로운 댓글 내용
 * @param originalContent : 원본 댓글 내용
 */
async function saveCommentEdit(postId, commentId, commentLi, newContent, originalContent) {
    if (!newContent) {
        window.toast.warning('댓글 내용을 입력하세요.');
        return;
    }

    if (newContent === originalContent) {
        // 내용이 변경되지 않은 경우 그냥 취소
        cancelCommentEdit(commentLi, originalContent);
        return;
    }

    try {
        const updatedComment = await updateComment(postId, commentId, newContent);

        // 수정 모드 종료
        commentLi.classList.remove('editing');

        // 데이터 속성 업데이트
        commentLi.dataset.commentContent = newContent;

        // 화면에 새로운 내용 표시
        const commentContentDiv = commentLi.querySelector('.comment-content');
        commentContentDiv.textContent = newContent;

        window.toast.success('댓글이 수정되었습니다.');
    } catch (error) {
        console.error('댓글 수정 실패:', error);
        window.toast.error('댓글 수정에 실패했습니다. 다시 시도해주세요.');
    }
}

/**
 * 댓글 수정 취소하는 함수
 * @param commentLi : 댓글 DOM 요소
 * @param originalContent : 원본 댓글 내용
 */
function cancelCommentEdit(commentLi, originalContent) {
    // 수정 모드 종료
    commentLi.classList.remove('editing');

    // 원본 내용으로 되돌림
    const commentContentDiv = commentLi.querySelector('.comment-content');
    commentContentDiv.textContent = originalContent;
}

// 무한 스크롤 상태 관리
let currentPostId = null;
let currentCursor = null;
let isloading = false;
let hasMore = true;
let observer = null;

/**
 * 댓글 목록의 무한스크롤을 담당하는 함수, 다음 커서에 대한 댓글들을 불러옴
 * */
async function loadNextPage() {
    console.log('[무한스크롤] loadNextPage 시작', { isloading, hasMore, currentCursor });

    // 이미 로딩중이거나, 더이상 데이터 없다면 중단
    if (isloading || !hasMore || !currentCursor) {
        console.log('[무한스크롤] loadNextPage 중단:', { isloading, hasMore, currentCursor });
        return;
    }

    isloading = true;
    console.log('[무한스크롤] 로딩 시작');

    // 로딩 인디케이터 표시
    const trigger = document.getElementById('infinite-scroll-trigger');
    if (trigger) {
        trigger.classList.add('loading');
    }

    try {
        // API 호출: postId, cursorId, cursorCreatedAt, size
        console.log('[무한스크롤] API 호출:', {
            postId: currentPostId,
            cursorId: currentCursor.cursorId,
            cursorCreatedAt: currentCursor.cursorCreatedAt,
            size: 20
        });

        const commentData = await getComments(
            currentPostId,
            currentCursor.cursorId,
            currentCursor.cursorCreatedAt,
            20 // 한 페이지당 20개씩
        );

        console.log('[무한스크롤] API 응답:', commentData);

        const newComments = commentData.items || [];

        if (newComments.length === 0) {
            console.log('[무한스크롤] 더 이상 댓글 없음');
            hasMore = false;
            if (trigger) {
                trigger.style.display = 'none';
            }
        } else {
            console.log(`[무한스크롤] 댓글 ${newComments.length}개 렌더링`);
            // 댓글 렌더링
            const commentListContainer = document.getElementById('comment-list');
            const fragment = document.createDocumentFragment();

            newComments.forEach(comment => {
                const commentElement = renderComment(comment);
                fragment.appendChild(commentElement);
            });

            commentListContainer.appendChild(fragment);

            // 다음 커서 업데이트 - nextCursor를 cursorId/cursorCreatedAt 형식으로 변환
            if (commentData.nextCursor && commentData.hasMore) {
                console.log('[무한스크롤] 다음 커서 업데이트:', commentData.nextCursor);
                currentCursor = {
                    cursorId: commentData.nextCursor.id,
                    cursorCreatedAt: commentData.nextCursor.createdAt
                };
            } else {
                console.log('[무한스크롤] 다음 커서 없음, 종료');
                hasMore = false;
                if (trigger) {
                    trigger.style.display = 'none';
                }
            }
        }
    } catch (error) {
        console.error("[무한스크롤] 다음 페이지 로딩 실패: ", error);
        window.toast.error('댓글을 불러오는데 실패했습니다.');
    } finally {
        isloading = false;
        console.log('[무한스크롤] 로딩 완료');
        // 로딩 인디케이터 제거
        if (trigger) {
            trigger.classList.remove('loading');
        }
    }
}

/**
 * 무한페이징을 위한 옵저버 함수, 앵커 10% 이상부터 콜백
 * */
function createObserver() {
    const trigger = document.getElementById('infinite-scroll-trigger');

    if (!trigger) {
        console.error('[무한스크롤] Trigger 요소를 찾을 수 없음');
        return;
    }

    console.log('[무한스크롤] Observer 생성 완료, trigger 요소:', trigger);

    const option = {
        root: null, // null이면 뷰포트 전체
        threshold: 0.1 // 앵커가 10%만 보여도 콜백 실행
    };

    const callback = (entries) => {
        entries.forEach(entry => {
            console.log('[무한스크롤] Observer 콜백 실행', {
                isIntersecting: entry.isIntersecting,
                hasMore,
                isloading,
                currentCursor
            });

            // 앵커(entry.target)이 화면에 보인다면
            if (entry.isIntersecting && hasMore && !isloading) {
                console.log('[무한스크롤] loadNextPage 호출');
                loadNextPage();
            }
        });
    };

    observer = new IntersectionObserver(callback, option);
    observer.observe(trigger);
    console.log('[무한스크롤] Observer observe 시작');
}

/**
 * 무한 스크롤 초기화 함수
 * @param postId : 게시글 ID
 * @param initialCursor : 초기 커서 (첫 페이지 응답에서 받은 cursor)
 */
export function initInfiniteScroll(postId, initialCursor) {
    console.log('[무한스크롤] 초기화 시작', { postId, initialCursor });

    currentPostId = postId;
    currentCursor = initialCursor;
    hasMore = !!initialCursor; // cursor가 있으면 더 불러올 데이터가 있음

    console.log('[무한스크롤] 상태:', { currentPostId, currentCursor, hasMore });

    const trigger = document.getElementById('infinite-scroll-trigger');
    if (trigger) {
        if (hasMore) {
            trigger.style.display = 'flex';
            console.log('[무한스크롤] 트리거 표시 및 Observer 생성');
            createObserver();
        } else {
            trigger.style.display = 'none';
            console.log('[무한스크롤] 더 이상 로드할 댓글 없음');
        }
    } else {
        console.error('[무한스크롤] 트리거 요소를 찾을 수 없음');
    }
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
            window.toast.warning('댓글 내용을 입력하세요');
            return;
        }

        try {
            const newComment = await createComment(postId, content);

            const commentElement = renderComment(newComment);

            document.getElementById('comment-list').prepend(commentElement);
            //입력창 비우기
            commentInput.value = '';
            window.toast.success('댓글이 등록되었습니다.');

        }catch (error) {
            console.log('댓글 등록 실패 :', error);
            window.toast.error('댓글 등록 실패, 재시도해주세요.');
        }
    });

}