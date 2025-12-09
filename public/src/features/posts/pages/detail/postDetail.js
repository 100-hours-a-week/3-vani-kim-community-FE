import { renderPost, setupPostActionListeners } from '/src/features/posts/pages/detail/post.js'
import { getPost, getPosts} from "/src/features/posts/api/postApi.js";
import { createComment, getComments } from "/src/features/comments/api/commentsApi.js";
import { handleCommentClick, renderComment, setupCommentForm, initInfiniteScroll } from "/src/features/posts/pages/detail/commentSection.js";
import { like } from "/src/features/posts/api/interactionApi.js";
document.addEventListener("DOMContentLoaded", function (){

    const currentLoggedInUserID="postAuthorID";

    const postArticle = document.querySelector(".post");
    if (currentLoggedInUserID === postArticle.dataset.authorId) {
        postArticle.querySelector('.post-actions').style.display = 'inline-block';
    }
})
let isProcessingLike = false;

/**
 * 좋아요 버튼 상태에 따른 Api를 호출하고 좋아요수를 변화시키는 함수
 * @param postId 현재 게시글 아이디
 * @param isLiked 게시글 진입시 사용자의 좋아요 여부
 * @param likeCount 게시글 집입시 좋야요 수
 * */

function setupLikeButton(postId, isLiked, likeCount) {

    const likeButton = document.getElementById("like-button");
    const likeCountSpan = document.getElementById("like-count");

    //초기 상태 설정
    let currentIsLiked = isLiked;
    let currentLikeCount = likeCount;
    updateLikeUI(currentIsLiked, currentLikeCount);

    //클릭 이벤트
    likeButton.addEventListener("click", async () => {
        if (isProcessingLike) return; //서버 응답대기중이면 무시
        isProcessingLike = true;

        //낙관적 업데이트
        const previousIsLiked = currentIsLiked;
        const previousLikeCount = currentLikeCount;

        currentIsLiked = !previousIsLiked;
        currentLikeCount = previousIsLiked ? previousLikeCount - 1 : previousLikeCount + 1;
        updateLikeUI(currentIsLiked, currentLikeCount);

        try{
            if (currentIsLiked) {
                await like(postId);
            } else {
                await like(postId);
            }

        } catch(error) {
            console.error("좋아요 처리 실패 :", error);
            window.toast.error("좋아요 처리에 실패했습니다. 다시 시도해 주세요");

            currentIsLiked=previousIsLiked;
            currentLikeCount=previousLikeCount;
            updateLikeUI(currentIsLiked, currentLikeCount);
        } finally {
            isProcessingLike = false;
        }
    })
}

/**
 * UI업데이트 전용 함수
 * @param isLiked 사용자가 좋아요 상태인지 여부
 * @param count 좋아요 수
 * */
function updateLikeUI(isLiked, count) {
    const likeButton = document.getElementById('like-button');
    const likeIcon = likeButton.querySelector('.like-icon');
    const likeText = likeButton.querySelector('.like-text');
    const likeCountSpan = document.getElementById("post-likes");

    likeButton.classList.toggle('liked', isLiked);

    // 아이콘 업데이트
    if (likeIcon) {
        likeIcon.setAttribute('data-lucide', isLiked ? 'heart' : 'heart');
        if (window.lucide) {
            lucide.createIcons();
        }
    }

    // 텍스트 업데이트
    if (likeText) {
        likeText.textContent = isLiked ? '좋아요 취소' : '좋아요';
    }

    likeCountSpan.textContent = count;
}

//URL에서 게시글 아이디 가져오기
const path = window.location.pathname;
const parts = path.split('/');
const postId = parts.pop()
//메인로직
//게시글을 상세 조회하는 메서드
async function initPage() {
    try {
        let post;
        let commentData;
         //세션확인
        const tempPostData = sessionStorage.getItem("tempPost");
        if (tempPostData) {
            const tempPost = JSON.parse(tempPostData);
            if(tempPost.postId === postId) {
                console.log('세션데이터 이용');
                post = tempPost;
                sessionStorage.removeItem("tempPost");
                commentData = {items : [], nextCursor: null, hasMore: false }
            }
        }
        if (!post) {
            console.log("API 호출 (Promise.all)");
            [post, commentData] = await Promise.all([
                getPost(postId),
                getComments(postId, null, null, 20) // 첫 페이지: 20개씩
            ]);
        }

        console.log('[댓글 초기 로드] commentData:', commentData);
        console.log('[댓글 초기 로드] nextCursor:', commentData.nextCursor);
        console.log('[댓글 초기 로드] hasMore:', commentData.hasMore);

        renderPost(post);

        setupLikeButton(post.postId, post.stats.isLiked, post.stats.likeCount);

        const commentListContainer = document.getElementById('comment-list');

        const fragment = new DocumentFragment();

        const commentArray = commentData.items || [];
        console.log(`[댓글 초기 로드] 댓글 ${commentArray.length}개 렌더링`);

        commentArray.forEach(comment => {
            const commentElement = renderComment(comment);
            fragment.appendChild(commentElement);
        });

        commentListContainer.appendChild(fragment);
        // 댓글 목록(ul)에 이벤트 리스너 1개 추가
        //괄호 빼고 함수 자체 넘기면 이벤트 발생시 이벤트 객체 넘겨서 함수 호출
        commentListContainer.addEventListener('click', handleCommentClick);

        setupCommentForm(postId);

        // 무한 스크롤 초기화 - nextCursor를 cursor 형식으로 변환
        const cursor = commentData.nextCursor ? {
            cursorId: commentData.nextCursor.id,
            cursorCreatedAt: commentData.nextCursor.createdAt
        } : null;

        initInfiniteScroll(postId, cursor);
    } catch (err) {
        console.error("페이지 로딩 실패:", err);
        document.getElementById("comment-list").innerHTML = "<p>댓글 목록을 불러오는데 실패했습니다.</p>";
    }
}

initPage();

