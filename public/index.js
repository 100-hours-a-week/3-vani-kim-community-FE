import { getPosts } from "/src/features/posts/api/postApi.js";

// Constants
const SCROLL_THRESHOLD = 0.1;
const LOADING_CLASS = 'loading';
const PAGE_SIZE = 20;

// State
let isLoading = false;
let hasMore = true;
let currentCursor = {
    id: undefined,
    createdAt: undefined
};

// DOM Elements
const postListContainer = document.querySelector('.post-list-container');
const postTemplate = document.getElementById('post-item-template');
const scrollTrigger = document.getElementById('infinite-scroll-trigger');
const endMessage = document.getElementById('end-of-list-message');

/**
 * 게시글 DOM 요소를 생성합니다
 * @param {Object} post - 게시글 데이터
 * @returns {DocumentFragment} 생성된 게시글 DOM 조각
 */
function createPostElement(post) {
    // 템플릿 복제
    const postFragment = postTemplate.content.cloneNode(true);

    // 요소 탐색
    const postLink = postFragment.querySelector('.post-link');
    const postTitle = postFragment.querySelector('.post-title');
    const likes = postFragment.querySelector('.likes');
    const comments = postFragment.querySelector('.comments');
    const views = postFragment.querySelector('.views');
    const postDate = postFragment.querySelector('.post-date');
    const authorNickname = postFragment.querySelector('.author-nickname');

    // 템플릿 채우기
    postLink.href = `/post/${post.postId}`;
    postTitle.textContent = post.title;
    likes.textContent = `좋아요 수 ${post.stats.likeCount}`;
    views.textContent = `조회수 ${post.stats.viewCount}`;
    comments.textContent = `댓글수 ${post.stats.commentCount}`;

    const date = new Date(post.createdAt);
    postDate.datetime = date.toISOString();
    postDate.textContent = date.toLocaleDateString();

    authorNickname.textContent = post.author.nickname;

    return postFragment;
}

/**
 * 스크롤 상태 UI를 업데이트합니다
 * @param {boolean} reachedEnd - 마지막 페이지 도달 여부
 */
function updateScrollState(reachedEnd) {
    if (reachedEnd) {
        console.log("마지막 페이지");

        if (endMessage) {
            endMessage.style.display = 'block';
        }

        if (scrollTrigger) {
            scrollTrigger.style.display = 'none';
        }
    }
}

/**
 * 로딩 인디케이터를 표시합니다
 */
function showLoading() {
    if (scrollTrigger) {
        scrollTrigger.classList.add(LOADING_CLASS);
    }
}

/**
 * 로딩 인디케이터를 숨깁니다
 */
function hideLoading() {
    if (scrollTrigger) {
        scrollTrigger.classList.remove(LOADING_CLASS);
    }
}

/**
 * 에러 메시지를 사용자에게 표시합니다
 * @param {string} message - 표시할 에러 메시지
 */
function showError(message) {
    console.error(message);

    // 간단한 에러 표시
    if (postListContainer) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = 'color: red; padding: 20px; text-align: center;';
        postListContainer.appendChild(errorDiv);

        // 3초 후 에러 메시지 제거
        setTimeout(() => errorDiv.remove(), 3000);
    }
}

/**
 * 다음 페이지를 불러오는 함수
 */
async function loadNextPage() {
    // 이미 로딩중이거나, 더이상 데이터 없다면 중단
    if (isLoading || !hasMore) return;

    isLoading = true;
    showLoading();

    try {
        const response = await getPosts(currentCursor.id, currentCursor.createdAt, PAGE_SIZE);
        const newPosts = response.items;

        // 템플릿을 이용하여 DOM 생성하기
        newPosts.forEach(post => {
            const postElement = createPostElement(post);
            postListContainer.appendChild(postElement);
        });

        // TODO: Implement cursor pagination logic based on your API response
        hasMore = response.hasMore;

        if (hasMore) {
            currentCursor.id = response.nextCursor.id;
            currentCursor.createdAt = response.nextCursor.createdAt;
        }

        updateScrollState(!hasMore);
    } catch (error) {
        showError("게시글을 불러오는데 실패했습니다. 다시 시도해주세요.");
        console.error("다음 페이지 로딩 실패: ", error);
    } finally {
        isLoading = false;
        hideLoading();
    }
}

/**
 * 트리거 요소의 가시성에 따라 진행도를 업데이트합니다
 * @param {number} ratio - 0에서 1 사이의 가시성 비율
 */
function updateTriggerProgress(ratio) {
    if (scrollTrigger && !isLoading) {
        // 회전 각도 계산 (0% = 0deg, 100% = 360deg)
        const rotation = ratio * 360;
        scrollTrigger.style.setProperty('--scroll-progress', rotation + 'deg');
    }
}

/**
 * IntersectionObserver를 생성하여 무한 스크롤을 설정합니다
 */
function createObserver() {
    const trigger = document.getElementById('infinite-scroll-trigger');

    if (!trigger) {
        console.error("스크롤 trigger요소를 찾을 수 없음");
        return;
    }

    // TODO: Adjust threshold based on your UX requirements
    // 진행도를 부드럽게 추적하기 위해 여러 threshold 값 사용
    const option = {
        root: null, // null이면 뷰포트 전체
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] // 10% 단위로 추적
    };

    // callback 에 다른 값 못 담게 상수로 이름없는 함수를 할당
    const callback = (entries) => {
        const entry = entries[0];

        // 진행도 업데이트
        updateTriggerProgress(entry.intersectionRatio);

        // 임계값 이상 보이고, 로딩 중이 아니면 다음 페이지 로드
        if (entry.isIntersecting && entry.intersectionRatio >= SCROLL_THRESHOLD && !isLoading) {
            loadNextPage();
        }
    };

    // 콜백 함수에 해당하면
    const observer = new IntersectionObserver(callback, option);
    observer.observe(trigger);
}

// 초기화
document.addEventListener("DOMContentLoaded", () => {
    createObserver();
    loadNextPage();
});