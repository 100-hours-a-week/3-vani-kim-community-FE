import { deletePost } from "/src/features/posts/api/postApi.js";

document.addEventListener("DOMContentLoaded", function() {})

// 게시글 상세페이지 조회를 위해 게시글에 관한 함수를 모아놓은 파일
//게시글 렌더링 시작
export function renderPost(post) {
    const title = post.title;
    const author = post.author.nickname;
    const postImageUrl = post.contentDetail.postImageUrl;

    document.getElementById("post-title").textContent = post.title;
    document.getElementById("post-author-id").textContent = post.author.nickname;

    // 작성자 프로필 이미지 설정
    const authorAvatar = document.querySelector('.post-author .author-avatar');
    if (authorAvatar && post.author.authorProfileUrl) {
        authorAvatar.src = post.author.authorProfileUrl;
    }

    const postDate = document.getElementById("post-date");
    // 보여줄 시간
    postDate.textContent = new Date(post.createdAt).toLocaleString();
    // 검색엔진 등에 노출되는 기계가 보는 시간
    postDate.dateTime = post.createdAt;

    const postImageElem = document.getElementById('post-img');

    if (postImageElem && postImageUrl) {
        postImageElem.src = postImageUrl;
    } else {
        console.warn("'post-img' <img> 태그를 찾을 수 없습니다.")
    }

    document.getElementById("post-body").textContent = post.contentDetail.content;

    document.getElementById('post-likes').textContent = post.stats.likeCount;
    document.getElementById('post-views').textContent = post.stats.viewCount;
    document.getElementById('post-comments').textContent = post.stats.commentCount;

    //작성자 권한 탐색, 수정/삭제 버튼 생성
    setupPostActionListeners(post)
}

/**
 * 게시글의 액션(수정삭제)를 DOM으로 동적으로 생성하는 메서드
 * 권한을 가진사람에게만 보여야하므로 권한 확인후 생성
 * 버튼 렌더링과 이벤트 연결
 * */
export function setupPostActionListeners(post) {
    const currentUserNickname = window.authStore.getNickname();

    if(currentUserNickname && post.author.nickname === currentUserNickname) {
        // 케밥 메뉴 버튼 표시
        const moreBtn = document.getElementById("post-more-btn");
        const moreMenu = document.getElementById("post-more-menu");

        if (moreBtn) {
            moreBtn.style.display = 'flex';

            // 수정 버튼 생성
            const editLi = document.createElement("li");
            editLi.innerHTML = `<a href="/post/${post.postId}/edit" class="edit-btn">수정</a>`;

            // 삭제 버튼 생성
            const deleteLi = document.createElement("li");
            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.className = "delete-btn";
            deleteBtn.textContent = "삭제";
            deleteBtn.addEventListener('click', () => {
                handleDeletePost(post.postId);
            });
            deleteLi.appendChild(deleteBtn);

            moreMenu.appendChild(editLi);
            moreMenu.appendChild(deleteLi);

            // 케밥 메뉴 토글
            moreBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                moreMenu.classList.toggle('active');
            });

            // 외부 클릭 시 메뉴 닫기
            document.addEventListener('click', (e) => {
                if (!moreBtn.contains(e.target) && !moreMenu.contains(e.target)) {
                    moreMenu.classList.remove('active');
                }
            });
        }
    }
}



// 게시글 삭제하기
async function handleDeletePost(postId) {
    const confirmed = await window.toast.confirm(
        "게시글 삭제",
        "정말 삭제하시겠습니까?\n\n삭제한 게시글은 복구할 수 없습니다.",
        { confirmText: "삭제", cancelText: "취소" }
    );

    if (confirmed) {
        try {
            await deletePost(postId);
            window.toast.success('삭제되었습니다.');
            setTimeout(() => {
                window.location.href = '/index';
            }, 1500);
        } catch (error) {
            console.error('삭제 실패:', error);
            window.toast.error('삭제에 실패했습니다.');
        }
    }
}


