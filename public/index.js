import { getPosts } from "/src/features/posts/api/postApi.js";

// Constants
const SCROLL_THRESHOLD = 0.1;
const LOADING_CLASS = 'loading';
const PAGE_SIZE = 20;

// Dummy data for missing fields
const CATEGORIES = ['한식', '양식', '중식', '일식', '디저트', '간식', '반찬', '국/찌개'];
const DUMMY_IMAGES = [
    '/assets/images/character/bean.jpg',
    '/assets/images/character/chap.jpg',
    '/assets/images/character/cute.jpg',
    '/assets/images/character/egg_1.jpg',
    '/assets/images/character/egg_fry.jpg',
    '/assets/images/character/kimchi.jpg',
    '/assets/images/character/seaweed.jpg',
    '/assets/images/character/spam.jpg',
];
const DUMMY_EXCERPTS = [
    '엄마가 해주시던 그 맛 그대로! 간단한 재료로 맛있게 만들 수 있어요.',
    '주말 브런치로 딱 좋은 레시피입니다. 가족들과 함께 즐겨보세요.',
    '특별한 날을 위한 레시피예요. 손님 초대 메뉴로 추천합니다.',
    '건강하고 맛있는 한 끼! 영양 가득한 재료로 만들어보세요.',
    '아이들이 정말 좋아하는 메뉴입니다. 간식으로도 완벽해요!',
];
const DEFAULT_AVATAR = '/assets/images/user.png';

// State
let isLoading = false;
let hasMore = true;
let currentCursor = {
    id: undefined,
    createdAt: undefined
};

// DOM Elements
const postGridContainer = document.querySelector('.post-grid-container');
const postTemplate = document.getElementById('post-item-template');
const scrollTrigger = document.getElementById('infinite-scroll-trigger');
const endMessage = document.getElementById('end-of-list-message');
const modal = document.getElementById('post-modal');
const modalClose = modal.querySelector('.modal-close');
const modalBackdrop = modal.querySelector('.modal-backdrop');

/**
 * 랜덤 카테고리를 반환합니다
 */
function getRandomCategory() {
    return CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
}

/**
 * 랜덤 이미지를 반환합니다
 */
function getRandomImage() {
    return DUMMY_IMAGES[Math.floor(Math.random() * DUMMY_IMAGES.length)];
}

/**
 * 랜덤 본문 미리보기를 반환합니다
 */
function getRandomExcerpt() {
    return DUMMY_EXCERPTS[Math.floor(Math.random() * DUMMY_EXCERPTS.length)];
}

/**
 * 게시글 DOM 요소를 생성합니다
 * @param {Object} post - 게시글 데이터
 * @returns {DocumentFragment} 생성된 게시글 DOM 조각
 */
function createPostElement(post) {
    const postFragment = postTemplate.content.cloneNode(true);

    // 요소 탐색
    const postCardInner = postFragment.querySelector('.post-card-inner');
    const cardImage = postFragment.querySelector('.card-image');
    const viewNumber = postFragment.querySelector('.view-number');
    const categoryBadge = postFragment.querySelector('.category-badge');
    const cardTitle = postFragment.querySelector('.card-title');
    const cardExcerpt = postFragment.querySelector('.card-excerpt');
    const authorAvatar = postFragment.querySelector('.author-avatar');
    const authorName = postFragment.querySelector('.author-name');
    const likeCount = postFragment.querySelector('.like-count');
    const commentCount = postFragment.querySelector('.comment-count');

    // 데이터 채우기
    postCardInner.dataset.postId = post.postId;

    // 이미지 (더미 데이터 사용)
    const imageUrl = post.postImageUrl || getRandomImage();
    cardImage.src = imageUrl;
    cardImage.alt = post.title;

    // 조회수
    viewNumber.textContent = post.stats.viewCount;

    // 카테고리 (더미 데이터 사용)
    const category = post.category || getRandomCategory();
    categoryBadge.textContent = category;

    // 제목
    cardTitle.textContent = post.title;

    // 본문 미리보기 (더미 데이터 사용)
    const excerpt = post.excerpt || getRandomExcerpt();
    cardExcerpt.textContent = excerpt;

    // 작성자
    const avatarUrl = post.author.authorProfileUrl || DEFAULT_AVATAR;
    authorAvatar.src = avatarUrl;
    authorAvatar.alt = post.author.nickname;
    authorName.textContent = post.author.nickname;

    // 통계
    likeCount.textContent = post.stats.likeCount;
    commentCount.textContent = post.stats.commentCount;

    // 카드 클릭 이벤트 - 모달 열기
    postCardInner.addEventListener('click', () => {
        openModal(post, imageUrl, category, excerpt, avatarUrl);
    });

    return postFragment;
}

/**
 * 모달을 엽니다
 * @param {Object} post - 게시글 데이터
 * @param {string} imageUrl - 이미지 URL
 * @param {string} category - 카테고리
 * @param {string} excerpt - 본문 미리보기
 * @param {string} avatarUrl - 프로필 이미지 URL
 */
function openModal(post, imageUrl, category, excerpt, avatarUrl) {
    // 모달 데이터 채우기
    const modalImage = modal.querySelector('.modal-image');
    const modalCategory = modal.querySelector('.modal-category');
    const modalTitle = modal.querySelector('.modal-title');
    const modalAuthorAvatar = modal.querySelector('.modal-author-avatar');
    const modalAuthorName = modal.querySelector('.modal-author-name');
    const modalDate = modal.querySelector('.modal-date');
    const modalViews = modal.querySelector('.modal-views');
    const modalLikes = modal.querySelector('.modal-likes');
    const modalComments = modal.querySelector('.modal-comments');
    const modalExcerpt = modal.querySelector('.modal-excerpt');
    const modalDetailLink = modal.querySelector('.modal-detail-link');

    modalImage.src = imageUrl;
    modalImage.alt = post.title;
    modalCategory.textContent = category;
    modalTitle.textContent = post.title;
    modalAuthorAvatar.src = avatarUrl;
    modalAuthorAvatar.alt = post.author.nickname;
    modalAuthorName.textContent = post.author.nickname;

    const date = new Date(post.createdAt);
    modalDate.textContent = date.toLocaleDateString();

    modalViews.textContent = post.stats.viewCount;
    modalLikes.textContent = post.stats.likeCount;
    modalComments.textContent = post.stats.commentCount;
    modalExcerpt.textContent = excerpt;
    modalDetailLink.href = `/post/${post.postId}`;

    // 모달 표시
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Lucide 아이콘 렌더링
    lucide.createIcons();
}

/**
 * 모달을 닫습니다
 */
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * 스크롤 상태 UI를 업데이트합니다
 * @param {boolean} reachedEnd - 마지막 페이지 도달 여부
 */
function updateScrollState(reachedEnd) {
    if (reachedEnd) {
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

    if (postGridContainer) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = 'color: var(--error-color); padding: 20px; text-align: center; grid-column: 1 / -1;';
        postGridContainer.appendChild(errorDiv);

        setTimeout(() => errorDiv.remove(), 3000);
    }
}

/**
 * 다음 페이지를 불러오는 함수
 */
async function loadNextPage() {
    if (isLoading || !hasMore) return;

    isLoading = true;
    showLoading();

    try {
        const response = await getPosts(currentCursor.id, currentCursor.createdAt, PAGE_SIZE);
        const newPosts = response.items;

        newPosts.forEach(post => {
            const postElement = createPostElement(post);
            postGridContainer.appendChild(postElement);
        });

        // Lucide 아이콘 렌더링
        lucide.createIcons();

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

    const option = {
        root: null,
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
    };

    const callback = (entries) => {
        const entry = entries[0];

        updateTriggerProgress(entry.intersectionRatio);

        if (entry.isIntersecting && entry.intersectionRatio >= SCROLL_THRESHOLD && !isLoading) {
            loadNextPage();
        }
    };

    const observer = new IntersectionObserver(callback, option);
    observer.observe(trigger);
}

/**
 * 카테고리 필터 초기화
 */
function initCategoryFilter() {
    const categoryPills = document.querySelectorAll('.category-pill');

    categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
            // 모든 pill에서 active 제거
            categoryPills.forEach(p => p.classList.remove('active'));
            // 클릭된 pill에 active 추가
            pill.classList.add('active');

            // 실제 필터링 로직은 백엔드 연동 시 추가
            // 현재는 UI만 동작
        });
    });
}

/**
 * 모달 이벤트 초기화
 */
function initModalEvents() {
    // 닫기 버튼 클릭
    modalClose.addEventListener('click', closeModal);

    // 배경 클릭
    modalBackdrop.addEventListener('click', closeModal);

    // ESC 키
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// 초기화
document.addEventListener("DOMContentLoaded", () => {
    initCategoryFilter();
    initModalEvents();
    createObserver();
    loadNextPage();

    // Lucide 아이콘 초기 렌더링
    lucide.createIcons();
});
